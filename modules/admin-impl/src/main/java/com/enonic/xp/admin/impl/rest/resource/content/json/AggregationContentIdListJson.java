package com.enonic.xp.admin.impl.rest.resource.content.json;

import com.google.common.collect.ImmutableSet;

import com.enonic.xp.admin.impl.json.content.ContentIdJson;
import com.enonic.xp.admin.impl.rest.resource.content.ContentIconUrlResolver;
import com.enonic.xp.aggregation.Aggregations;
import com.enonic.xp.content.Content;
import com.enonic.xp.content.ContentListMetaData;
import com.enonic.xp.content.Contents;

public class AggregationContentIdListJson
    extends AbstractAggregationContentListJson<ContentIdJson>
{

    public AggregationContentIdListJson( final Content content, final ContentListMetaData contentListMetaData,
                                         final Aggregations aggregations, final ContentIconUrlResolver iconUrlResolver )
    {
        super( content, contentListMetaData, aggregations, iconUrlResolver, null, null );
    }

    public AggregationContentIdListJson( final Contents contents, final ContentListMetaData contentListMetaData,
                                         final Aggregations aggregations, final ContentIconUrlResolver iconUrlResolver )
    {
        super( contents, contentListMetaData, ImmutableSet.copyOf( aggregations ), iconUrlResolver, null, null );
    }

    @Override
    protected ContentIdJson createItem( final Content content )
    {
        return new ContentIdJson( content.getId() );
    }
}