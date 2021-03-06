package com.enonic.xp.core.content;

import org.junit.Test;

import com.enonic.xp.content.Content;
import com.enonic.xp.content.ContentPath;
import com.enonic.xp.content.ContentQuery;
import com.enonic.xp.content.FindContentByQueryParams;
import com.enonic.xp.query.parser.QueryParser;

public class ContentServiceImplTest_find
    extends AbstractContentServiceTest
{

    @Test
    public void order_by_path()
        throws Exception
    {
        final Content site = createContent( ContentPath.ROOT, "a" );

        final Content child3 = createContent( site.getPath(), "d" );
        final Content child2 = createContent( site.getPath(), "c" );
        final Content child1 = createContent( site.getPath(), "b" );

        final ContentQuery queryOrderAsc = ContentQuery.create().
            queryExpr( QueryParser.parse( "order by _path asc" ) ).
            build();

        assertOrder( contentService.find( FindContentByQueryParams.create().
            contentQuery( queryOrderAsc ).
            build() ), site, child1, child2, child3 );

        assertOrder( contentService.find( queryOrderAsc ).getContentIds(), site, child1, child2, child3 );

        final ContentQuery queryOrderDesc = ContentQuery.create().
            queryExpr( QueryParser.parse( "order by _path desc" ) ).
            build();

        assertOrder( contentService.find( FindContentByQueryParams.create().
            contentQuery( queryOrderDesc ).
            build() ), child3, child2, child1, site );

        assertOrder( contentService.find( queryOrderDesc ).getContentIds(), child3, child2, child1, site );
    }
}
