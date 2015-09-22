package com.enonic.wem.repo.internal.elasticsearch.query;

import org.elasticsearch.index.query.QueryBuilder;

import com.enonic.wem.repo.internal.elasticsearch.aggregation.query.AggregationQueryBuilderFactory;
import com.enonic.wem.repo.internal.elasticsearch.query.builder.AclFilterBuilderFactory;
import com.enonic.wem.repo.internal.elasticsearch.query.builder.FilterBuilderFactory;
import com.enonic.wem.repo.internal.elasticsearch.query.builder.QueryBuilderFactory;
import com.enonic.wem.repo.internal.elasticsearch.query.builder.SortQueryBuilderFactory;
import com.enonic.wem.repo.internal.storage.StorageSettings;
import com.enonic.xp.data.ValueFactory;
import com.enonic.xp.node.NodeIndexPath;
import com.enonic.xp.node.NodeQuery;
import com.enonic.xp.query.filter.Filter;
import com.enonic.xp.query.filter.ValueFilter;
import com.enonic.xp.security.PrincipalKeys;

public class NodeQueryTranslator
    extends AbstractElasticsearchQueryTranslator
{
    static ElasticsearchQuery translate( final NodeQuery nodeQuery, final StorageSettings settings )
    {
        final QueryBuilder queryWithQueryFilters = createQueryWithQueryFilters( nodeQuery, settings.getAcl() );

        final ElasticsearchQuery.Builder queryBuilder = ElasticsearchQuery.create().
            index( settings.getStorageName().getName() ).
            indexType( settings.getStorageType().getName() ).
            query( queryWithQueryFilters ).
            setAggregations( AggregationQueryBuilderFactory.create( nodeQuery.getAggregationQueries() ) ).
            sortBuilders( SortQueryBuilderFactory.create( nodeQuery.getOrderBys() ) ).
            filter( FilterBuilderFactory.create( nodeQuery.getPostFilters() ) ).
            from( nodeQuery.getFrom() ).
            size( nodeQuery.getSize() );

        return queryBuilder.build();
    }

    private static QueryBuilder createQueryWithQueryFilters( final NodeQuery nodeQuery, final PrincipalKeys acl )
    {
        final QueryBuilderFactory.Builder queryBuilderBuilder = QueryBuilderFactory.create().
            queryExpr( nodeQuery.getQuery() ).
            addQueryFilters( nodeQuery.getQueryFilters() );

        final Filter aclFilter = AclFilterBuilderFactory.create( acl );

        if ( aclFilter != null )
        {
            queryBuilderBuilder.addQueryFilter( aclFilter );
        }

        addParentFilter( nodeQuery, queryBuilderBuilder );
        addPathFilter( nodeQuery, queryBuilderBuilder );

        return queryBuilderBuilder.build();
    }

    private static void addPathFilter( final NodeQuery nodeQuery, final QueryBuilderFactory.Builder queryBuilderBuilder )
    {
        if ( nodeQuery.getPath() != null )
        {
            queryBuilderBuilder.addQueryFilter( ValueFilter.create().
                fieldName( NodeIndexPath.PATH.getPath() ).
                addValue( ValueFactory.newString( nodeQuery.getPath().toString() ) ).
                build() );
        }
    }

    private static void addParentFilter( final NodeQuery nodeQuery, final QueryBuilderFactory.Builder queryBuilderBuilder )
    {
        if ( nodeQuery.getParent() != null )
        {
            queryBuilderBuilder.addQueryFilter( ValueFilter.create().
                fieldName( NodeIndexPath.PARENT_PATH.getPath() ).
                addValue( ValueFactory.newString( nodeQuery.getParent().toString() ) ).
                build() );
        }
    }
}
