package com.enonic.xp.repo.impl.version.storage;

import java.time.Instant;

import com.enonic.xp.branch.Branch;
import com.enonic.xp.index.IndexType;
import com.enonic.xp.node.NodeVersionMetadata;
import com.enonic.xp.repo.impl.StorageSettings;
import com.enonic.xp.repo.impl.storage.StorageData;
import com.enonic.xp.repo.impl.storage.StoreRequest;
import com.enonic.xp.repo.impl.version.NodeVersionDocumentId;
import com.enonic.xp.repo.impl.version.VersionIndexPath;
import com.enonic.xp.repository.RepositoryId;

public class VersionStorageDocFactory
{
    public static StoreRequest create( final NodeVersionMetadata nodeVersion, final RepositoryId repositoryId, final Branch branch )
    {
        final StorageData data = StorageData.create().
            add( VersionIndexPath.VERSION_ID.getPath(), nodeVersion.getNodeVersionId().toString() ).
            add( VersionIndexPath.NODE_ID.getPath(), nodeVersion.getNodeId().toString() ).
            add( VersionIndexPath.TIMESTAMP.getPath(), nodeVersion.getTimestamp() != null ? nodeVersion.getTimestamp() : Instant.now() ).
            add( VersionIndexPath.NODE_PATH.getPath(), nodeVersion.getNodePath().toString() ).
            build();

        return StoreRequest.create().
            nodePath( nodeVersion.getNodePath() ).
            id( createId( nodeVersion ) ).
            forceRefresh( false ).
            settings( StorageSettings.create().
                indexType( IndexType.VERSION ).
                repositoryId( repositoryId ).
                branch( branch ).
                build() ).
            data( data ).
            routing( nodeVersion.getNodeId().toString() ).
            build();
    }

    private static String createId( final NodeVersionMetadata nodeVersion )
    {
        return new NodeVersionDocumentId( nodeVersion.getNodeId(), nodeVersion.getNodeVersionId() ).toString();
    }
}
