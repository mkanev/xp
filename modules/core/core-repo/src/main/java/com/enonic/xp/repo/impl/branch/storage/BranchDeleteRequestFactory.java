package com.enonic.xp.repo.impl.branch.storage;

import com.enonic.xp.index.IndexType;
import com.enonic.xp.node.NodeId;
import com.enonic.xp.repo.impl.InternalContext;
import com.enonic.xp.repo.impl.StorageSettings;
import com.enonic.xp.repo.impl.storage.DeleteRequest;

class BranchDeleteRequestFactory
{
    public static DeleteRequest create( final NodeId nodeId, final InternalContext context )
    {
        return DeleteRequest.create().
            forceRefresh( true ).
            id( nodeId.toString() ).
            settings( StorageSettings.create().
                repositoryId( context.getRepositoryId() ).
                indexType( IndexType.BRANCH ).
                branch( context.getBranch() ).
                build() ).
            build();
    }

}
