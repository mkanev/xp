package com.enonic.wem.repo.internal.elasticsearch.query.builder;

import org.elasticsearch.index.query.QueryBuilder;
import org.junit.Assert;
import org.junit.Test;

import com.enonic.wem.api.data.Value;
import com.enonic.wem.api.query.expr.QueryExpr;
import com.enonic.wem.api.query.filter.ValueFilter;
import com.enonic.wem.api.query.parser.QueryParser;

public class QueryBuilderFactoryTest
    extends BaseTestBuilderFactory
{
    @Test
    public void createQuery()
        throws Exception
    {
        createQuery( "not( myField > 1) ", "not_range.json" );
        createQuery( "not( not( myField > 1  ))", "not_not_range.json" );
        createQuery( "fulltext('myField', 'my search phrase', 'OR')", "fulltext_3_args.json" );
    }

    private void createQuery( final String query, final String fileContainingExpectedJson )
        throws Exception
    {
        final String expected = load( fileContainingExpectedJson );

        final String expression = QueryBuilderFactory.
            create().
            queryExpr( QueryParser.parse( query ) ).
            build().
            toString();

        final String expectedJson = cleanString( expected );
        final String actualJson = cleanString( expression );

        Assert.assertEquals( expectedJson, actualJson );
    }

    @Test
    public void createQueryWithFilter()
        throws Exception
    {
        final String expected = load( "query_with_queryfilter.json" );

        final ValueFilter queryFilter = ValueFilter.create().
            fieldName( "myField" ).
            addValue( Value.newString( "myValue1" ) ).
            addValue( Value.newString( "myValue2" ) ).
            build();

        final QueryExpr query = QueryParser.parse( "not( myField > 1) " );

        final QueryBuilder builtQuery = QueryBuilderFactory.create().
            queryExpr( query ).
            addQueryFilter( queryFilter ).
            build();

        final String expectedJson = cleanString( expected );
        final String actualJson = cleanString( builtQuery.toString() );

        Assert.assertEquals( expectedJson, actualJson );
    }
}