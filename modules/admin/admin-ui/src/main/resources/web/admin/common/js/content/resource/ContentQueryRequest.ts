module api.content.resource {

    import ContentQuery = api.content.query.ContentQuery;
    import ContentQueryResult = api.content.resource.result.ContentQueryResult;

    export class ContentQueryRequest<CONTENT_JSON extends json.ContentIdBaseItemJson,CONTENT extends ContentIdBaseItem>
    extends ContentResourceRequest<json.ContentQueryResultJson<CONTENT_JSON>, ContentQueryResult<CONTENT,CONTENT_JSON>> {

        private contentQuery: ContentQuery;

        private expand: api.rest.Expand = api.rest.Expand.SUMMARY;

        private allLoaded: boolean = false;

        private results: CONTENT[] = [];

        constructor(contentQuery: ContentQuery) {
            super();
            super.setMethod("POST");
            this.contentQuery = contentQuery;
        }

        getContentQuery(): ContentQuery {
            return this.contentQuery;
        }

        setExpand(expand: api.rest.Expand): ContentQueryRequest<CONTENT_JSON,CONTENT> {
            this.expand = expand;
            return this;
        }

        isPartiallyLoaded(): boolean {
            return this.results.length > 0 && !this.allLoaded;
        }

        resetParams() {
            this.allLoaded = false;
            this.contentQuery.setFrom(this.contentQuery.getFrom() >= 0 ? 0 : -1);
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

            return this.send().then((response: api.rest.JsonResponse<json.ContentQueryResultJson<CONTENT_JSON>>) => {

                var responseResult: json.ContentQueryResultJson<CONTENT_JSON> = response.getResult(),
                    aggregations = api.aggregation.Aggregation.fromJsonArray(responseResult.aggregations),
                    contentsAsJson: json.ContentIdBaseItemJson[] = responseResult.contents,
                    metadata = new ContentMetadata(response.getResult().metadata["hits"], response.getResult().metadata["totalHits"]),
                    contents: CONTENT[];

                if (this.expand == api.rest.Expand.NONE) {
                    contents = <any[]> this.fromJsonToContentIdBaseItemArray(contentsAsJson);
                }
                else if (this.expand == api.rest.Expand.SUMMARY) {
                    contents = <any[]> this.fromJsonToContentSummaryArray(<json.ContentSummaryJson[]>contentsAsJson);
                }
                else {
                    contents = <any[]>this.fromJsonToContentArray(<json.ContentJson[]>contentsAsJson);
                }

                this.updateStateAfterLoad(contents, metadata);

                return new ContentQueryResult<CONTENT,CONTENT_JSON>(this.results, aggregations, <CONTENT_JSON[]>contentsAsJson, metadata);
            });
        }

        private updateStateAfterLoad(contents: CONTENT[], metadata: ContentMetadata) {
            if (this.contentQuery.getFrom() == 0) {
                this.results = [];
            }

            this.results = this.results.concat(contents);

            this.allLoaded = (this.contentQuery.getFrom() + metadata.getHits()) >= metadata.getTotalHits();
            this.contentQuery.setFrom(this.contentQuery.getFrom() + metadata.getHits());
        }

        private getMustBereferencedById(): string {
            var contentId = this.contentQuery.getMustBeReferencedById();
            if (!!contentId) {
                return contentId.toString();
            }
            return null;
        }

        private aggregationQueriesToJson(aggregationQueries: api.query.aggregation.AggregationQuery[]): api.query.aggregation.AggregationQueryTypeWrapperJson[] {
            var aggregationQueryJsons: api.query.aggregation.AggregationQueryTypeWrapperJson[] = [];

            if (aggregationQueries == null) {
                return aggregationQueryJsons;
            }

            aggregationQueries.forEach((aggregationQuery: api.query.aggregation.AggregationQuery) => {
                aggregationQueryJsons.push(aggregationQuery.toJson());
            });

            return aggregationQueryJsons;
        }


        private queryFiltersToJson(queryFilters: api.query.filter.Filter[]): api.query.filter.FilterTypeWrapperJson[] {

            var queryFilterJsons: api.query.filter.FilterTypeWrapperJson[] = [];

            if (queryFilters == null || queryFilters.length == 0) {
                return queryFilterJsons;
            }

            queryFilters.forEach((queryFilter: api.query.filter.Filter)=> {

                queryFilterJsons.push(queryFilter.toJson());

            });

            return queryFilterJsons;
        }

        private expandAsString(): string {
            switch (this.expand) {
            case api.rest.Expand.FULL:
                return "full";
            case api.rest.Expand.SUMMARY:
                return "summary";
            case api.rest.Expand.NONE:
                return "none";
            default:
                return "summary";
            }
        }

        contentTypeNamesAsString(names: api.schema.content.ContentTypeName[]): string[] {
            var result: string[] = [];

            names.forEach((name: api.schema.content.ContentTypeName) => {
                result.push(name.toString());
            });

            return result;
        }

        getRequestPath(): api.rest.Path {
            return api.rest.Path.fromParent(super.getResourcePath(), "query");
        }
    }
}