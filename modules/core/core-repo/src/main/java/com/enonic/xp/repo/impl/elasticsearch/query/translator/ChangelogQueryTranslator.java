package com.enonic.xp.repo.impl.elasticsearch.query.translator;

import org.elasticsearch.index.query.QueryBuilder;

import com.enonic.xp.repo.impl.branch.search.ChangelogQuery;
import com.enonic.xp.repo.impl.elasticsearch.query.ElasticsearchQuery;
import com.enonic.xp.repo.impl.elasticsearch.query.translator.builder.FilterBuilderFactory;
import com.enonic.xp.repo.impl.elasticsearch.query.translator.builder.QueryBuilderFactory;
import com.enonic.xp.repo.impl.elasticsearch.query.translator.builder.SortQueryBuilderFactory;
import com.enonic.xp.repo.impl.search.SearchRequest;

public class ChangelogQueryTranslator
{
    private final QueryFieldNameResolver fieldNameResolver = new StoreQueryFieldNameResolver();

    private final SortQueryBuilderFactory sortBuilder = new SortQueryBuilderFactory( fieldNameResolver );

    private final FilterBuilderFactory filterBuilderFactory = new FilterBuilderFactory( fieldNameResolver );


    public ElasticsearchQuery translate( final SearchRequest request )
    {
        final ChangelogQuery query = (ChangelogQuery) request.getQuery();

        return ElasticsearchQuery.create().
            index( request.getSettings().getIndexName() ).
            indexType( request.getSettings().getIndexType() ).
            query( createQueryBuilder( query ) ).
            sortBuilders( sortBuilder.create( query.getOrderBys() ) ).
            filter( filterBuilderFactory.create( query.getPostFilters() ) ).
            size( query.getSize() ).
            from( query.getFrom() ).
            build();
    }

    private QueryBuilder createQueryBuilder( final ChangelogQuery query )
    {
        final QueryBuilderFactory.Builder queryBuilderBuilder = QueryBuilderFactory.newBuilder().
            queryExpr( query.getQuery() ).
            addQueryFilters( query.getQueryFilters() ).
            fieldNameResolver( this.fieldNameResolver );
        return queryBuilderBuilder.build().create();
    }


}
