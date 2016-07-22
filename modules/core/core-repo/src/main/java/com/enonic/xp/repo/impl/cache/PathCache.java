package com.enonic.xp.repo.impl.cache;

import com.enonic.xp.node.NodeId;

public interface PathCache
{
    void cache( final CachePath path, final NodeId nodeId );

    void evict( final CachePath path );

    NodeId get( final CachePath path );
}
