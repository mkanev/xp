import {CompareExpr} from "../../query/expr/CompareExpr";
import {FieldExpr} from "../../query/expr/FieldExpr";
import {ValueExpr} from "../../query/expr/ValueExpr";
import {LogicalExpr} from "../../query/expr/LogicalExpr";
import {LogicalOperator} from "../../query/expr/LogicalOperator";
import {QueryExpr} from "../../query/expr/QueryExpr";
import {ConstraintExpr} from "../../query/expr/ConstraintExpr";
import {ContentSummaryRequest} from "./ContentSummaryRequest";

export class FragmentContentSummaryRequest extends ContentSummaryRequest {

        private parentSitePath: string;

        constructor() {
            super();
        }

        protected createSearchExpression(): ConstraintExpr {
            if (this.parentSitePath) {
                var searchConstraint = super.createSearchExpression();
                var nearestSiteConstraint = this.createParentSiteFragmentsOnlyQuery();
                return new LogicalExpr(searchConstraint, LogicalOperator.AND, nearestSiteConstraint);
            }
            else {
                return super.createSearchExpression();
            }
        }

        private createParentSiteFragmentsOnlyQuery(): CompareExpr {
            return CompareExpr.like(new FieldExpr("_path"), ValueExpr.string("/content" + this.parentSitePath + "/*"));
        }

        setParentSitePath(sitePath: string) {
            this.parentSitePath = sitePath;
        }

    }

