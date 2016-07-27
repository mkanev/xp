package com.enonic.xp.repo.impl.branch.storage;

import java.time.Instant;

import com.enonic.xp.index.IndexType;
import com.enonic.xp.node.NodeBranchEntry;
import com.enonic.xp.node.NodeId;
import com.enonic.xp.repo.impl.InternalContext;
import com.enonic.xp.repo.impl.StorageSettings;
import com.enonic.xp.repo.impl.storage.StorageData;
import com.enonic.xp.repo.impl.storage.StoreRequest;

class BranchStorageRequestFactory
{
    public static StoreRequest create( final NodeBranchEntry nodeBranchEntry, final InternalContext context )
    {

        final StorageData data = StorageData.create().
            add( BranchIndexPath.VERSION_ID.getPath(), nodeBranchEntry.getVersionId().toString() ).
            add( BranchIndexPath.BRANCH_NAME.getPath(), context.getBranchId().getValue() ).
            add( BranchIndexPath.NODE_ID.getPath(), nodeBranchEntry.getNodeId().toString() ).
            add( BranchIndexPath.STATE.getPath(), nodeBranchEntry.getNodeState().value() ).
            add( BranchIndexPath.PATH.getPath(), nodeBranchEntry.getNodePath().toString() ).
            add( BranchIndexPath.TIMESTAMP.getPath(),
                 nodeBranchEntry.getTimestamp() != null ? nodeBranchEntry.getTimestamp() : Instant.now() ).
            build();

        final NodeId nodeId = nodeBranchEntry.getNodeId();

        return StoreRequest.create().
            id( nodeId.toString() ).
            nodePath( nodeBranchEntry.getNodePath() ).
            forceRefresh( false ).
            settings( StorageSettings.create().
                indexType( IndexType.BRANCH ).
                repositoryId( context.getRepositoryId() ).
                branch( context.getBranchId() ).
                build() ).
            data( data ).
            build();
    }


}
