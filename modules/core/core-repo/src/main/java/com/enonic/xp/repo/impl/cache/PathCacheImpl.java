package com.enonic.xp.repo.impl.cache;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

import com.enonic.xp.node.NodeId;

public class PathCacheImpl
    implements PathCache
{
    private final Cache<CachePath, NodeId> pathCache;

    public PathCacheImpl()
    {
        pathCache = CacheBuilder.newBuilder().
            maximumSize( 100000 ).
            build();
    }

    @Override
    public void cache( final CachePath path, final NodeId id )
    {
        this.pathCache.put( path, id );
    }

    @Override
    public void evict( final CachePath path )
    {
        this.pathCache.invalidate( path );
    }

    @Override
    public NodeId get( final CachePath path )
    {
        return this.pathCache.getIfPresent( path );
    }
}
