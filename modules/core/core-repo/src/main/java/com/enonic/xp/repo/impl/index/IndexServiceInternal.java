package com.enonic.xp.repo.impl.index;

import com.enonic.xp.branch.Branch;
import com.enonic.xp.index.IndexType;
import com.enonic.xp.node.NodeId;
import com.enonic.xp.repo.impl.elasticsearch.ClusterHealthStatus;
import com.enonic.xp.repository.IndexResource;
import com.enonic.xp.repository.RepositoryId;

public interface IndexServiceInternal
{
    void createIndex( final String indexName, final IndexResource settings );

    void updateIndex( final String indexName, final OldIndexSettings settings );

    void deleteIndices( final String... indexNames );

    boolean indicesExists( final String... indices );

    void applyMapping( final String indexName, final IndexType indexType, final IndexResource mapping );

    ClusterHealthStatus getClusterHealth( final String timeout, final String... indexNames );

    void refresh( final String... indexNames );

    boolean isMaster();

    void copy( final NodeId nodeId, final RepositoryId repositoryId, final Branch source, final Branch target );
}

