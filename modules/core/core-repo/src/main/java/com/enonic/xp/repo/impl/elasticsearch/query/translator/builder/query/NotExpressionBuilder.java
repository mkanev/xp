package com.enonic.xp.repo.impl.elasticsearch.query.translator.builder.query;

import org.elasticsearch.index.query.QueryBuilder;

import com.enonic.xp.query.expr.NotExpr;
import com.enonic.xp.repo.impl.elasticsearch.query.translator.QueryFieldNameResolver;

class NotExpressionBuilder
{

    public static QueryBuilder build( final NotExpr expr, final QueryFieldNameResolver resolver )
    {
        final QueryBuilder negated = ConstraintExpressionBuilder.build( expr.getExpression(), resolver );
        return NotQueryBuilder.build( negated );
    }

}
