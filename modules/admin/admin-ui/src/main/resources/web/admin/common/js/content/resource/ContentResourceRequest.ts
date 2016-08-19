import {ContentIdBaseItemJson} from "../json/ContentIdBaseItemJson";
import {ContentSummaryJson} from "../json/ContentSummaryJson";
import {ContentJson} from "../json/ContentJson";
import {ResourceRequest} from "../../rest/ResourceRequest";
import {Path} from "../../rest/Path";
import {Content} from "../Content";
import {ContentIdBaseItem} from "../ContentIdBaseItem";
import {ContentSummary} from "../ContentSummary";

export class ContentResourceRequest<JSON_TYPE, PARSED_TYPE> extends ResourceRequest<JSON_TYPE, PARSED_TYPE> {

        public static EXPAND_NONE = 'none';
        public static EXPAND_SUMMARY = 'summary';
        public static EXPAND_FULL = 'full';

        private resourcePath: Path;

        constructor() {
            super();
            this.resourcePath = Path.fromParent(super.getRestPath(), "content");
        }

        getResourcePath(): Path {
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
