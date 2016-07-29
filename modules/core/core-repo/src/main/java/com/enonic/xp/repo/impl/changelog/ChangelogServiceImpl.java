package com.enonic.xp.repo.impl.changelog;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.enonic.xp.branch.Branch;
import com.enonic.xp.branch.BranchId;
import com.enonic.xp.branch.Branches;
import com.enonic.xp.index.IndexType;
import com.enonic.xp.node.NodeId;
import com.enonic.xp.node.NodeIds;
import com.enonic.xp.node.NodePath;
import com.enonic.xp.repo.impl.InternalContext;
import com.enonic.xp.repo.impl.StorageSettings;
import com.enonic.xp.repo.impl.storage.StorageDao;
import com.enonic.xp.repo.impl.storage.StorageData;
import com.enonic.xp.repo.impl.storage.StoreRequest;

@Component(immediate = true)
public class ChangelogServiceImpl
    implements ChangelogService
{
    private StorageDao storageDao;

    @Override
    public void store( final NodeId nodeId, final NodePath nodePath, final InternalContext context )
    {
        final BranchId branchId = context.getBranchId();

        final Branch targetBranch = Branches.getInstance().get( branchId );

        if ( targetBranch.isMaster() )
        {
            return;
        }

        this.storageDao.store( StoreRequest.create().
            id( nodeId.toString() ).
            settings( StorageSettings.create().
                indexType( IndexType.CHANGELOG ).
                repositoryId( context.getRepositoryId() ).
                branch( branchId ).
                build() ).
            data( StorageData.create().
                add( "nodepath", nodePath ).
                build() ).
            build() );
    }

    @Override
    public void delete( final BranchId target, final NodeId nodeId )
    {

    }

    public NodeIds get( final InternalContext context )
    {
        return NodeIds.empty();
    }

    @Reference
    public void setStorageDao( final StorageDao storageDao )
    {
        this.storageDao = storageDao;
    }
}
