import {ContentQuery} from "../query/ContentQuery";
import {ContentQueryResult} from "./result/ContentQueryResult";
import {ContentJson} from "../json/ContentJson";
import {ContentSummaryJson} from "../json/ContentSummaryJson";
import {ContentIdBaseItemJson} from "../json/ContentIdBaseItemJson";
import {ContentQueryResultJson} from "../json/ContentQueryResultJson";
import {Expand} from "../../rest/Expand";
import {JsonResponse} from "../../rest/JsonResponse";
import {Aggregation} from "../../aggregation/Aggregation";
import {AggregationQuery} from "../../query/aggregation/AggregationQuery";
import {AggregationQueryTypeWrapperJson} from "../../query/aggregation/AggregationQueryTypeWrapperJson";
import {Filter} from "../../query/filter/Filter";
import {FilterTypeWrapperJson} from "../../query/filter/FilterTypeWrapperJson";
import {ContentTypeName} from "../../schema/content/ContentTypeName";
import {Path} from "../../rest/Path";
import {ContentIdBaseItem} from "../ContentIdBaseItem";
import {ContentMetadata} from "../ContentMetadata";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class ContentQueryRequest<CONTENT_JSON extends ContentIdBaseItemJson,CONTENT extends ContentIdBaseItem>
    extends ContentResourceRequest<ContentQueryResultJson<CONTENT_JSON>, ContentQueryResult<CONTENT,CONTENT_JSON>> {

        private contentQuery: ContentQuery;

        private expand: Expand = Expand.SUMMARY;

        constructor(contentQuery?: ContentQuery) {
            super();
            super.setMethod("POST");
            this.contentQuery = contentQuery;
        }

        setContentQuery(contentQuery: ContentQuery) {
            this.contentQuery = contentQuery;
        }

        setExpand(expand: Expand): ContentQueryRequest<CONTENT_JSON,CONTENT> {
            this.expand = expand;
            return this;
        }

        getParams(): Object {

            var queryExprAsString = this.contentQuery.getQueryExpr() ? this.contentQuery.getQueryExpr().toString() : "";

            return {
                queryExpr: queryExprAsString,
                from: this.contentQuery.getFrom(),
                size: this.contentQuery.getSize(),
                contentTypeNames: this.contentTypeNamesAsString(this.contentQuery.getContentTypes()),
                mustBeReferencedById: this.getMustBereferencedById(),
                expand: this.expandAsString(),
                aggregationQueries: this.aggregationQueriesToJson(this.contentQuery.getAggregationQueries()),
                queryFilters: this.queryFiltersToJson(this.contentQuery.getQueryFilters())
            };
        }

        sendAndParse(): wemQ.Promise<ContentQueryResult<CONTENT,CONTENT_JSON>> {

            return this.send().then((response: JsonResponse<ContentQueryResultJson<CONTENT_JSON>>) => {

                var responseResult: ContentQueryResultJson<CONTENT_JSON> = response.getResult();

                var aggregations = Aggregation.fromJsonArray(responseResult.aggregations);

                var contentsAsJson: ContentIdBaseItemJson[] = responseResult.contents;

                var contentQueryResult: ContentQueryResult<CONTENT, CONTENT_JSON>;

                var metadata = new ContentMetadata(response.getResult().metadata["hits"], response.getResult().metadata["totalHits"]);

                if (this.expand == Expand.NONE) {

                    var contentIdBaseItems: CONTENT[] = <any[]> this.fromJsonToContentIdBaseItemArray(contentsAsJson);
                    contentQueryResult =
                        new ContentQueryResult<CONTENT,CONTENT_JSON>(contentIdBaseItems, aggregations, <CONTENT_JSON[]>contentsAsJson,
                            metadata);
                }
                else if (this.expand == Expand.SUMMARY) {
                    var contentSummaries: CONTENT[] = <any[]> this.fromJsonToContentSummaryArray(<ContentSummaryJson[]>contentsAsJson);
                    contentQueryResult =
                        new ContentQueryResult<CONTENT,CONTENT_JSON>(contentSummaries, aggregations, <CONTENT_JSON[]>contentsAsJson,
                            metadata);
                }
                else {
                    var contents: CONTENT[] = <any[]>this.fromJsonToContentArray(<ContentJson[]>contentsAsJson);
                    contentQueryResult =
                        new ContentQueryResult<CONTENT,CONTENT_JSON>(contents, aggregations, <CONTENT_JSON[]>contentsAsJson, metadata);
                }

                return contentQueryResult;
            });
        }

        private getMustBereferencedById(): string {
            var contentId = this.contentQuery.getMustBeReferencedById();
            if (!!contentId) {
                return contentId.toString();
            }
            return null;
        }

        private aggregationQueriesToJson(aggregationQueries: AggregationQuery[]): AggregationQueryTypeWrapperJson[] {
            var aggregationQueryJsons: AggregationQueryTypeWrapperJson[] = [];

            if (aggregationQueries == null) {
                return aggregationQueryJsons;
            }

            aggregationQueries.forEach((aggregationQuery: AggregationQuery) => {
                aggregationQueryJsons.push(aggregationQuery.toJson());
            });

            return aggregationQueryJsons;
        }


        private queryFiltersToJson(queryFilters: Filter[]): FilterTypeWrapperJson[] {

            var queryFilterJsons: FilterTypeWrapperJson[] = [];

            if (queryFilters == null || queryFilters.length == 0) {
                return queryFilterJsons;
            }

            queryFilters.forEach((queryFilter: Filter)=> {

                queryFilterJsons.push(queryFilter.toJson());

            });

            return queryFilterJsons;
        }

        private expandAsString(): string {
            switch (this.expand) {
            case Expand.FULL:
                return "full";
            case Expand.SUMMARY:
                return "summary";
            case Expand.NONE:
                return "none";
            default:
                return "summary";
            }
        }

        contentTypeNamesAsString(names: ContentTypeName[]): string[] {
            var result: string[] = [];

            names.forEach((name: ContentTypeName) => {
                result.push(name.toString());
            });

            return result;
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "query");
        }
    }
