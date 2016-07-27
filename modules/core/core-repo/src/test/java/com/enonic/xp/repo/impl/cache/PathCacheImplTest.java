package com.enonic.xp.repo.impl.cache;

import org.junit.Test;

import com.enonic.xp.branch.BranchId;
import com.enonic.xp.node.NodeId;
import com.enonic.xp.node.NodePath;

import static org.junit.Assert.*;

public class PathCacheImplTest
{

    @Test
    public void put()
        throws Exception
    {
        final PathCacheImpl cache = new PathCacheImpl();

        final CachePath a = createPath( "a" );

        cache.cache( a, NodeId.from( "_1_draft" ) );
        assertEquals( NodeId.from( "_1_draft" ), cache.get( a ) );
    }

    @Test
    public void remove()
        throws Exception
    {
        final PathCacheImpl cache = new PathCacheImpl();

        final CachePath a = createPath( "a" );

        cache.cache( a, NodeId.from( "1_draft" ) );
        cache.evict( a );
        assertNull( cache.get( a ) );
    }


    @Test
    public void update_entry()
        throws Exception
    {
        final PathCacheImpl cache = new PathCacheImpl();

        cache.cache( createPath( "/oldPath" ), NodeId.from( "1_draft" ) );
        cache.cache( createPath( "/newPath" ), NodeId.from( "1_draft" ) );

        assertEquals( NodeId.from( "1_draft" ), cache.get( createPath( "/newPath" ) ) );
    }

    @Test
    public void update_entry_2()
        throws Exception
    {
        final PathCacheImpl cache = new PathCacheImpl();

        cache.cache( createPath( "/oldPath" ), NodeId.from( "1_draft" ) );
        cache.cache( createPath( "/oldPath" ), NodeId.from( "2_draft" ) );
        cache.cache( createPath( "/newPath" ), NodeId.from( "1_draft" ) );

        assertEquals( NodeId.from( "2_draft" ), cache.get( createPath( "/oldPath" ) ) );
        assertEquals( NodeId.from( "1_draft" ), cache.get( createPath( "/newPath" ) ) );
    }


    private CachePath createPath( final String path )
    {
        return new BranchPath( BranchId.from( "test" ), NodePath.create( path ).build() );
    }

}