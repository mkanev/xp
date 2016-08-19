import {ValueExpr} from "./expr/ValueExpr";
import {FunctionExpr} from "./expr/FunctionExpr";
import {DynamicConstraintExpr} from "./expr/DynamicConstraintExpr";
import {LogicalExpr} from "./expr/LogicalExpr";
import {LogicalOperator} from "./expr/LogicalOperator";
import {Expression} from "./expr/Expression";
import {FulltextSearchExpression} from "./FulltextSearchExpression";
import {FulltextSearchExpressionBuilder} from "./FulltextSearchExpression";
import {QueryField} from "./QueryField";
import {QueryFields} from "./QueryFields";

export class PathMatchExpression extends FulltextSearchExpression {

        static createWithPath(searchString: string, queryFields: QueryFields, path: string): Expression {

            var expression = FulltextSearchExpression.create(searchString, queryFields);

            var args = [];
            args.push(ValueExpr.stringValue("_path"));
            args.push(ValueExpr.stringValue("/content" + path));

            var matchedExpr: FunctionExpr = new FunctionExpr("pathMatch", args);
            var matchedDynamicExpr: DynamicConstraintExpr = new DynamicConstraintExpr(matchedExpr);

            var booleanExpr: LogicalExpr = new LogicalExpr(expression, LogicalOperator.AND, matchedDynamicExpr);
            return booleanExpr;
        }
    }

    export class PathMatchExpressionBuilder extends FulltextSearchExpressionBuilder {

        path: string;

        addField(queryField: QueryField): PathMatchExpressionBuilder {
            super.addField(queryField);
            return this;
        }

        setSearchString(searchString: string): PathMatchExpressionBuilder {
            super.setSearchString(searchString);
            return this;
        }

        setPath(path: string): PathMatchExpressionBuilder {
            this.path = path;
            return this;
        }

        build(): Expression {
            return PathMatchExpression.createWithPath(this.searchString, this.queryFields, this.path);
        }
    }

