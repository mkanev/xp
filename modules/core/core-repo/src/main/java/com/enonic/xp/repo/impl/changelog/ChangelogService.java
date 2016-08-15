package com.enonic.xp.repo.impl.changelog;

import com.enonic.xp.branch.BranchId;
import com.enonic.xp.node.NodeId;
import com.enonic.xp.node.NodeIds;
import com.enonic.xp.node.NodePath;
import com.enonic.xp.repo.impl.InternalContext;

public interface ChangelogService
{
    void store( final NodeId nodeId, final NodePath nodePath, final InternalContext context );

    void delete( final BranchId target, final NodeId nodeId );

    NodeIds get( final NodePath nodePath, final InternalContext context );

}
