import {ValueExpr} from "./expr/ValueExpr";
import {FunctionExpr} from "./expr/FunctionExpr";
import {DynamicConstraintExpr} from "./expr/DynamicConstraintExpr";
import {LogicalExpr} from "./expr/LogicalExpr";
import {LogicalOperator} from "./expr/LogicalOperator";
import {Expression} from "./expr/Expression";
import {QueryField} from "./QueryField";
import {QueryFields} from "./QueryFields";

export class FulltextSearchExpression {

        static create(searchString: string, queryFields: QueryFields): Expression {

            if (searchString == null) {
                return null;
            }
            var args: ValueExpr[] = [];

            args.push(ValueExpr.stringValue(queryFields.toString()));
            args.push(ValueExpr.stringValue(searchString));
            args.push(ValueExpr.stringValue("AND"));

            var fulltextExp: FunctionExpr = new FunctionExpr("fulltext", args);
            var fulltextDynamicExpr: DynamicConstraintExpr = new DynamicConstraintExpr(fulltextExp);

            var nGramExpr: FunctionExpr = new FunctionExpr("ngram", args);
            var nGramDynamicExpr: DynamicConstraintExpr = new DynamicConstraintExpr(nGramExpr);

            var booleanExpr: LogicalExpr = new LogicalExpr(fulltextDynamicExpr, LogicalOperator.OR, nGramDynamicExpr);
            return booleanExpr;
        }
    }

    export class FulltextSearchExpressionBuilder {

        queryFields: QueryFields = new QueryFields();

        searchString: string;

        addField(queryField: QueryField): FulltextSearchExpressionBuilder {
            this.queryFields.add(queryField);
            return this;
        }

        setSearchString(searchString: string): FulltextSearchExpressionBuilder {
            this.searchString = searchString;
            return this;
        }

        build(): Expression {
            return FulltextSearchExpression.create(this.searchString, this.queryFields);
        }

    }

