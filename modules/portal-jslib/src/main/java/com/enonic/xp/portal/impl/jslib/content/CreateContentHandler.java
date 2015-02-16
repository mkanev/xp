package com.enonic.xp.portal.impl.jslib.content;

import java.util.Map;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.enonic.xp.content.Content;
import com.enonic.xp.content.ContentPath;
import com.enonic.xp.content.ContentService;
import com.enonic.xp.content.CreateContentParams;
import com.enonic.xp.content.Metadata;
import com.enonic.xp.content.Metadatas;
import com.enonic.xp.data.PropertySet;
import com.enonic.xp.data.PropertyTree;
import com.enonic.xp.module.ModuleKey;
import com.enonic.xp.portal.impl.jslib.mapper.ContentMapper;
import com.enonic.xp.portal.script.command.CommandHandler;
import com.enonic.xp.portal.script.command.CommandRequest;
import com.enonic.xp.schema.content.ContentTypeName;
import com.enonic.xp.schema.mixin.Mixin;
import com.enonic.xp.schema.mixin.MixinName;
import com.enonic.xp.schema.mixin.MixinService;

@Component(immediate = true)
public final class CreateContentHandler
    implements CommandHandler
{
    private ContentService contentService;

    private MixinService mixinService;

    @Override
    public String getName()
    {
        return "content.create";
    }

    @Override
    public Object execute( final CommandRequest req )
    {
        final CreateContentParams params = createParams( req );
        final Content result = this.contentService.create( params );
        return new ContentMapper( result );
    }

    private CreateContentParams createParams( final CommandRequest req )
    {
        return CreateContentParams.create().
            name( req.param( "name" ).value( String.class ) ).
            parent( contentPath( req.param( "parentPath" ).value( String.class ) ) ).
            displayName( req.param( "displayName" ).value( String.class ) ).
            requireValid(
                req.param( "requireValid" ).value( Boolean.class ) != null ? req.param( "requireValid" ).value( Boolean.class ) : false ).
            type( contentTypeName( req.param( "contentType" ).value( String.class ) ) ).
            contentData( propertyTree( req.param( "data" ).map() ) ).
            metadata( metaDatas( req.param( "x" ).map() ) ).
            build();
    }

    private ContentPath contentPath( final String value )
    {
        return value != null ? ContentPath.from( value ) : null;
    }

    private ContentTypeName contentTypeName( final String value )
    {
        return value != null ? ContentTypeName.from( value ) : null;
    }

    private PropertyTree propertyTree( final Map<?, ?> value )
    {
        if ( value == null )
        {
            return null;
        }

        final PropertyTree tree = new PropertyTree();
        applyData( tree.getRoot(), value );
        return tree;
    }

    private void applyData( final PropertySet set, final Map<?, ?> value )
    {
        for ( final Map.Entry<?, ?> entry : value.entrySet() )
        {
            final String name = entry.getKey().toString();
            final Object item = entry.getValue();

            if ( item instanceof Map )
            {
                applyData( set.addSet( name ), (Map) item );
            }
            else if ( item instanceof Iterable )
            {
                applyData( set, name, (Iterable<?>) item );
            }
            else if ( item instanceof Double )
            {
                set.addDouble( name, (Double) item );
            }
            else if ( item instanceof Number )
            {
                set.addLong( name, ( (Number) item ).longValue() );
            }
            else if ( item instanceof Boolean )
            {
                set.addBoolean( name, (Boolean) item );
            }
            else
            {
                set.addString( name, item.toString() );
            }
        }
    }

    private void applyData( final PropertySet set, final String name, final Object value )
    {
        if ( value instanceof Map )
        {
            applyData( set.addSet( name ), (Map) value );
        }
        else if ( value instanceof Iterable )
        {
            applyData( set, name, (Iterable<?>) value );
        }
        else
        {
            set.addString( name, value.toString() );
        }
    }

    private void applyData( final PropertySet set, final String name, final Iterable<?> value )
    {
        for ( final Object item : value )
        {
            applyData( set, name, item );
        }
    }

    private Metadatas metaDatas( final Map<String, Object> value )
    {
        if ( value == null )
        {
            return null;
        }

        final Metadatas.Builder metadatasBuilder = Metadatas.builder();
        for ( final String modulePrefix : value.keySet() )
        {
            final ModuleKey moduleKey = Metadata.fromModulePrefix( modulePrefix );
            final Object metadatasObject = value.get( modulePrefix );
            if ( !( metadatasObject instanceof Map ) )
            {
                continue;
            }
            final Map<String, Object> metadatas = (Map<String, Object>) metadatasObject;

            for ( final String metadataName : metadatas.keySet() )
            {
                final MixinName mixinName = MixinName.from( moduleKey, metadataName );
                final Metadata item = metaData( mixinName, metadatas.get( metadataName ) );
                if ( item != null )
                {
                    metadatasBuilder.add( item );
                }
            }
        }

        return metadatasBuilder.build();
    }

    private Metadata metaData( final MixinName mixinName, final Object value )
    {
        if ( value instanceof Map )
        {
            final Mixin mixin = mixinService.getByName( mixinName );
            if ( mixin != null )
            {
                return new Metadata( mixin.getName(), propertyTree( (Map) value ) );
            }
        }

        return null;
    }

    @Reference
    public void setContentService( final ContentService contentService )
    {
        this.contentService = contentService;
    }

    @Reference
    public void setMixinService( final MixinService mixinService )
    {
        this.mixinService = mixinService;
    }
}