module api.content.resource {

    import ContentIdBaseItemJson = api.content.json.ContentIdBaseItemJson;
    import ContentSummaryJson = api.content.json.ContentSummaryJson;
    import ContentJson = api.content.json.ContentJson;
    export class ContentResourceRequest<JSON_TYPE, PARSED_TYPE> extends api.rest.ResourceRequest<JSON_TYPE, PARSED_TYPE> {

        public static EXPAND_NONE = 'none';
        public static EXPAND_SUMMARY = 'summary';
        public static EXPAND_FULL = 'full';

        private resourcePath: api.rest.Path;

        constructor() {
            super();
            this.resourcePath = api.rest.Path.fromParent(super.getRestPath(), "content");
        }

        getResourcePath(): api.rest.Path {
            return this.resourcePath;
        }

        fromJsonToContent(json: ContentJson): Content {
            return Content.fromJson(json);
        }

        fromJsonToContentArray(json: ContentJson[]): Content[] {

            var array: Content[] = [];
            json.forEach((itemJson: ContentJson) => {
                array.push(this.fromJsonToContent(itemJson));
            });

            return array;
        }

        fromJsonToContentSummary(json: ContentSummaryJson): ContentSummary {
            return ContentSummary.fromJson(json);
        }

        fromJsonToContentSummaryArray(json: ContentSummaryJson[]): ContentSummary[] {

            var array: ContentSummary[] = [];
            json.forEach((itemJson: ContentSummaryJson) => {
                array.push(this.fromJsonToContentSummary(itemJson));
            });

            return array;
        }

        fromJsonToContentIdBaseItem(json: ContentIdBaseItemJson): ContentIdBaseItem {
            return ContentIdBaseItem.fromJson(json);
        }

        fromJsonToContentIdBaseItemArray(jsonArray: ContentIdBaseItemJson[]): ContentIdBaseItem[] {
            return ContentIdBaseItem.fromJsonArray(jsonArray);
        }
    }
}