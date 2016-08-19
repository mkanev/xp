import {QueryField} from "../../query/QueryField";
import {OrderExpr} from "../../query/expr/OrderExpr";
import {QueryExpr} from "../../query/expr/QueryExpr";
import {FieldExpr} from "../../query/expr/FieldExpr";
import {FieldOrderExpr} from "../../query/expr/FieldOrderExpr";
import {OrderDirection} from "../../query/expr/OrderDirection";
import {ConstraintExpr} from "../../query/expr/ConstraintExpr";
import {ContentSummaryJson} from "../json/ContentSummaryJson";
import {ContentQueryResultJson} from "../json/ContentQueryResultJson";
import {ContentQuery} from "../query/ContentQuery";
import {ResourceRequest} from "../../rest/ResourceRequest";
import {Expand} from "../../rest/Expand";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentQueryResult} from "./result/ContentQueryResult";
import {ContentTypeName} from "../../schema/content/ContentTypeName";
import {PathMatchExpressionBuilder} from "../../query/PathMatchExpression";
import {ContentPath} from "../ContentPath";
import {ContentSummary} from "../ContentSummary";
import {ContentQueryRequest} from "./ContentQueryRequest";

export class ContentSummaryRequest extends ResourceRequest<ContentQueryResultJson<ContentSummaryJson>, ContentSummary[]> {

        private contentQuery: ContentQuery;

        private path: ContentPath;

        private searchString: string = "";

        private request: ContentQueryRequest<ContentSummaryJson, ContentSummary>;

        public static MODIFIED_TIME_DESC = new FieldOrderExpr(new FieldExpr("modifiedTime"), OrderDirection.DESC);

        public static SCORE_DESC = new FieldOrderExpr(new FieldExpr("_score"), OrderDirection.DESC);

        public static DEFAULT_ORDER: OrderExpr[] = [ContentSummaryRequest.SCORE_DESC, ContentSummaryRequest.MODIFIED_TIME_DESC];

        constructor() {
            super();
            this.contentQuery = new ContentQuery();
            this.request =
                new ContentQueryRequest<ContentSummaryJson, ContentSummary>(this.contentQuery).setExpand(Expand.SUMMARY);
        }

        getSearhchString(): string {
            return this.searchString;
        }

        getRestPath(): Path {
            return this.request.getRestPath();
        }

        getRequestPath(): Path {
            return this.request.getRequestPath();
        }

        getContentPath(): ContentPath {
            return this.path;
        }

        getParams(): Object {
            return this.request.getParams();
        }

        send(): wemQ.Promise<JsonResponse<ContentQueryResultJson<ContentSummaryJson>>> {
            this.buildSearchQueryExpr();

            return this.request.send();
        }

        sendAndParse(): wemQ.Promise<ContentSummary[]> {
            this.buildSearchQueryExpr();

            return this.request.sendAndParse().then(
                (queryResult: ContentQueryResult<ContentSummary,ContentSummaryJson>) => {
                return queryResult.getContents();
            });
        }

        setAllowedContentTypes(contentTypes: string[]) {
            this.contentQuery.setContentTypeNames(this.createContentTypeNames(contentTypes));
        }

        setAllowedContentTypeNames(contentTypeNames: ContentTypeName[]) {
            this.contentQuery.setContentTypeNames(contentTypeNames);
        }

        setSize(size: number) {
            this.contentQuery.setSize(size);
        }

        setContentPath(path: ContentPath) {
            this.path = path;
        }

        setSearchString(value: string = "") {
            this.searchString = value;
        }

        private buildSearchQueryExpr() {
            this.contentQuery.setQueryExpr(new QueryExpr(this.createSearchExpression(), ContentSummaryRequest.DEFAULT_ORDER));
        }

        protected createSearchExpression(): ConstraintExpr {
            return new PathMatchExpressionBuilder()
                .setSearchString(this.searchString)
                .setPath(this.path ? this.path.toString() : "")
                .addField(new QueryField(QueryField.DISPLAY_NAME, 5))
                .addField(new QueryField(QueryField.NAME, 3))
                .addField(new QueryField(QueryField.ALL))
                .build();
        }

        private createContentTypeNames(names: string[]): ContentTypeName[] {
            return (names || []).map((name: string) => new ContentTypeName(name));
        }
    }
