package com.enonic.xp.core.impl.export;

import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

import com.google.common.collect.Sets;

import com.enonic.wem.api.data.Property;
import com.enonic.wem.api.data.PropertyTree;
import com.enonic.wem.api.data.ValueTypes;
import com.enonic.wem.api.export.ImportNodeException;
import com.enonic.wem.api.export.NodeImportResult;
import com.enonic.wem.api.node.BinaryAttachment;
import com.enonic.wem.api.node.BinaryAttachments;
import com.enonic.wem.api.node.CreateNodeParams;
import com.enonic.wem.api.node.InsertManualStrategy;
import com.enonic.wem.api.node.Node;
import com.enonic.wem.api.node.NodePath;
import com.enonic.wem.api.node.NodeService;
import com.enonic.wem.api.node.UpdateNodeParams;
import com.enonic.wem.api.util.BinaryReference;
import com.enonic.wem.api.vfs.VirtualFile;
import com.enonic.wem.api.vfs.VirtualFilePaths;
import com.enonic.xp.core.impl.export.builder.CreateNodeParamsFactory;
import com.enonic.xp.core.impl.export.builder.PropertyTreeXmlBuilder;
import com.enonic.xp.core.impl.export.builder.UpdateNodeParamsFactory;
import com.enonic.xp.core.impl.export.reader.ExportReader;
import com.enonic.xp.core.impl.export.validator.ContentImportValidator;
import com.enonic.xp.core.impl.export.validator.ImportValidator;
import com.enonic.xp.core.impl.export.xml.XmlNode;
import com.enonic.xp.core.impl.export.xml.serializer.XmlNodeSerializer;

public class NodeImportCommand
{
    private static final Long IMPORT_NODE_ORDER_START_VALUE = 0l;

    private static final Long IMPORT_NODE_ORDER_SPACE = (long) Integer.MAX_VALUE;

    private final NodePath importRoot;

    private final NodeService nodeService;

    private final XmlNodeSerializer xmlNodeSerializer;

    private final VirtualFile exportRoot;

    private final ExportReader exportReader = new ExportReader();

    private final boolean dryRun;

    private final NodeImportResult.Builder result = NodeImportResult.create();

    private final boolean importNodeIds;

    private final Set<ImportValidator> importValidators = Sets.newHashSet( new ContentImportValidator() );

    private NodeImportCommand( final Builder builder )
    {
        this.nodeService = builder.nodeService;
        this.exportRoot = builder.exportRoot;
        this.xmlNodeSerializer = builder.xmlNodeSerializer;
        this.importRoot = builder.importRoot;
        this.dryRun = builder.dryRun;
        this.importNodeIds = builder.importNodeIds;
    }

    public static Builder create()
    {
        return new Builder();
    }

    public NodeImportResult execute()
    {
        this.result.dryRun( this.dryRun );

        verifyImportRoot();

        importFromDirectoryLayout( this.exportRoot );

        return this.result.build();
    }

    private void importFromDirectoryLayout( final VirtualFile parentFolder )
    {
        final Stream<VirtualFile> children = this.exportReader.getChildren( parentFolder );

        children.forEach( ( child ) -> processNodeFolder( child, ProcessNodeSettings.create() ) );
    }

    private void importFromManualOrder( final VirtualFile nodeFolder )
    {
        final List<String> childNames;

        try
        {
            childNames = processBinarySource( nodeFolder );
        }
        catch ( Exception e )
        {
            result.addError( "Not able to import nodes by manual order, using default ordering", e );
            importFromDirectoryLayout( nodeFolder );
            return;
        }

        long currentManualOrderValue = IMPORT_NODE_ORDER_START_VALUE;

        for ( final String childName : childNames )
        {
            final VirtualFile child = nodeFolder.resolve( VirtualFilePaths.from( childName, "/" ) );

            final ProcessNodeSettings.Builder processNodeSettings = ProcessNodeSettings.create().
                insertManualStrategy( InsertManualStrategy.MANUAL ).
                manualOrderValue( currentManualOrderValue );

            if ( child != null )
            {
                processNodeFolder( child, processNodeSettings );
            }

            currentManualOrderValue -= IMPORT_NODE_ORDER_SPACE;
        }
    }

    private void processNodeFolder( final VirtualFile nodeFolder, final ProcessNodeSettings.Builder processNodeSettings )
    {
        try
        {
            final Node node = processNodeSource( nodeFolder, processNodeSettings );

            try
            {
                if ( !node.getChildOrder().isManualOrder() )
                {
                    importFromDirectoryLayout( nodeFolder );
                }
                else
                {
                    importFromManualOrder( nodeFolder );
                }
            }
            catch ( Exception e )
            {
                result.addError( "Error when parsing children of " + node.path(), e );
            }

        }
        catch ( Exception e )
        {
            result.addError( "Could not import node in forlder " + nodeFolder.getPath().getPath(), e );
        }


    }

    private Node processNodeSource( final VirtualFile nodeFolder, final ProcessNodeSettings.Builder processNodeSettings )
    {
        final VirtualFile nodeSource = this.exportReader.getNodeSource( nodeFolder );

        final XmlNode xmlNode = this.xmlNodeSerializer.parse( nodeSource.getByteSource() );

        final NodePath importNodePath = NodeImportPathResolver.resolveNodeImportPath( nodeFolder, this.exportRoot, this.importRoot );

        final Node existingNode = this.nodeService.getByPath( importNodePath );

        if ( existingNode != null )
        {
            return updateNode( nodeFolder, xmlNode, existingNode );
        }
        else
        {
            return createNode( nodeFolder, processNodeSettings, xmlNode, importNodePath );
        }
    }

    private Node updateNode( final VirtualFile nodeFolder, final XmlNode xmlNode, final Node existingNode )
    {
        final BinaryAttachments binaryAttachments = processBinaryAttachments( nodeFolder, xmlNode );

        final UpdateNodeParams updateNodeParams = UpdateNodeParamsFactory.create().
            xmlNode( xmlNode ).
            binaryAttachments( binaryAttachments ).
            existingNode( existingNode ).
            dryRun( this.dryRun ).
            build().
            execute();

        final Node updatedNode = this.nodeService.update( updateNodeParams );

        result.updated( updatedNode.path() );

        return updatedNode;
    }

    private Node createNode( final VirtualFile nodeFolder, final ProcessNodeSettings.Builder processNodeSettings, final XmlNode xmlNode,
                             final NodePath importNodePath )
    {
        final BinaryAttachments binaryAttachments = processBinaryAttachments( nodeFolder, xmlNode );

        final CreateNodeParams createNodeParams = CreateNodeParamsFactory.create().
            processNodeSettings( processNodeSettings.build() ).
            xmlNode( xmlNode ).
            importPath( importNodePath ).
            binaryAttachments( binaryAttachments ).
            importNodeIds( this.importNodeIds ).
            dryRun( this.dryRun ).
            build().
            execute();

        CreateNodeParams validatedCreateNodeParams = validateImportData( createNodeParams );

        final Node createdNode = this.nodeService.create( validatedCreateNodeParams );

        result.added( createdNode.path() );

        return createdNode;
    }

    private List<String> processBinarySource( final VirtualFile nodeFolder )
        throws Exception
    {
        final VirtualFile orderFile = this.exportReader.getOrderSource( nodeFolder );
        return orderFile.getCharSource().readLines();
    }

    private BinaryAttachments processBinaryAttachments( final VirtualFile nodeFile, final XmlNode xmlNode )
    {
        final PropertyTree data = PropertyTreeXmlBuilder.build( xmlNode.getData() );

        final Set<Property> binaryReferences = data.getByValueType( ValueTypes.BINARY_REFERENCE );

        if ( binaryReferences.isEmpty() )
        {
            return BinaryAttachments.empty();
        }

        final BinaryAttachments.Builder builder = BinaryAttachments.create();

        for ( final Property binaryReference : binaryReferences )
        {
            addBinary( nodeFile, builder, binaryReference );
        }

        return builder.build();
    }

    private void addBinary( final VirtualFile nodeFile, final BinaryAttachments.Builder builder, final Property binaryRefProperty )
    {
        final BinaryReference binaryReference = binaryRefProperty.getBinaryReference();

        try
        {
            final VirtualFile binary = exportReader.getBinarySource( nodeFile, binaryReference.toString() );
            builder.add( new BinaryAttachment( binaryReference, binary.getByteSource() ) );

            result.addBinary( binary.getPath().getPath(), binaryReference );
        }
        catch ( Exception e )
        {
            result.addError( "Error processing binary, skip", e );
        }
    }

    private void verifyImportRoot()
    {
        if ( NodePath.ROOT.equals( this.importRoot ) )
        {
            return;
        }

        final Node importRoot = nodeService.getByPath( this.importRoot );

        if ( importRoot == null )
        {
            throw new ImportNodeException( "Import root '" + this.importRoot + "' not found" );
        }
    }

    private CreateNodeParams validateImportData( final CreateNodeParams createNodeParams )
    {
        CreateNodeParams validatedCreateNodeParams = createNodeParams;

        for ( final ImportValidator validator : this.importValidators )
        {
            if ( validator.canHandle( createNodeParams ) )
            {
                validatedCreateNodeParams = validator.ensureValid( validatedCreateNodeParams );
            }
        }
        return validatedCreateNodeParams;
    }

    public static final class Builder
    {
        private NodePath importRoot;

        private NodeService nodeService;

        private XmlNodeSerializer xmlNodeSerializer;

        private VirtualFile exportRoot;

        private boolean dryRun = false;

        private boolean importNodeIds = true;

        private Builder()
        {
        }

        public Builder targetNodePath( NodePath nodePath )
        {
            this.importRoot = nodePath;
            return this;
        }

        public Builder sourceDirectory( VirtualFile exportRoot )
        {
            this.exportRoot = exportRoot;
            return this;
        }

        public Builder nodeService( NodeService nodeService )
        {
            this.nodeService = nodeService;
            return this;
        }

        public Builder xmlNodeSerializer( XmlNodeSerializer xmlNodeSerializer )
        {
            this.xmlNodeSerializer = xmlNodeSerializer;
            return this;
        }

        public Builder dryRun( final boolean dryRun )
        {
            this.dryRun = dryRun;
            return this;
        }

        public Builder importNodeIds( final boolean importNodeIds )
        {
            this.importNodeIds = importNodeIds;
            return this;
        }

        public NodeImportCommand build()
        {
            return new NodeImportCommand( this );
        }
    }

}
