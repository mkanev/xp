package com.enonic.wem.repo.internal.search;

import com.enonic.wem.repo.internal.InternalContext;
import com.enonic.wem.repo.internal.index.query.NodeQueryResult;
import com.enonic.wem.repo.internal.storage.branch.NodeBranchQuery;
import com.enonic.wem.repo.internal.storage.branch.NodeBranchQueryResult;
import com.enonic.wem.repo.internal.version.NodeVersionQuery;
import com.enonic.xp.node.NodeIds;
import com.enonic.xp.node.NodeQuery;
import com.enonic.xp.node.NodeVersionDiffQuery;
import com.enonic.xp.node.NodeVersionDiffResult;
import com.enonic.xp.node.NodeVersionIds;
import com.enonic.xp.node.NodeVersionQueryResult;
import com.enonic.xp.query.expr.OrderExpressions;

public interface SearchService
{
    int GET_ALL_SIZE_FLAG = -1;

    NodeQueryResult search( final NodeQuery query, final InternalContext context );

    NodeVersionQueryResult search( final NodeVersionQuery query, final InternalContext context );

    NodeBranchQueryResult search( final NodeBranchQuery nodeBranchQuery, final InternalContext context );

    NodeVersionIds toBeRewrittenToNodeVersionQuery( final NodeIds nodeIds, final OrderExpressions orderExprs,
                                                    final InternalContext indexContext );

    NodeVersionDiffResult diffNodeVersions( final NodeVersionDiffQuery query, final InternalContext context );


}
