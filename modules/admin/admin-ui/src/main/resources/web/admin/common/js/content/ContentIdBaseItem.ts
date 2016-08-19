import {ContentIdBaseItemJson} from "./json/ContentIdBaseItemJson";
import {Equitable} from "../Equitable";
import {ObjectHelper} from "../ObjectHelper";
import {ContentId} from "./ContentId";
import {ContentSummary} from "./ContentSummary";

export class ContentIdBaseItem implements Equitable {

        private contentId: ContentId;

        constructor(builder: ContentIdBaseItemBuilder) {
            this.contentId = builder.contentId;
        }

        getContentId(): ContentId {
            return this.contentId;
        }

        equals(o: Equitable): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, ContentSummary)) {
                return false;
            }

            var other = <ContentIdBaseItem>o;

            if (!ObjectHelper.equals(this.contentId, other.contentId)) {
                return false;
            }

            return true;
        }

        static fromJson(json: ContentIdBaseItemJson): ContentIdBaseItem {
            return new ContentIdBaseItemBuilder().fromContentIdBaseItemJson(json).build();
        }

        static fromJsonArray(jsonArray: ContentIdBaseItemJson[]): ContentIdBaseItem[] {
            var array: ContentIdBaseItem[] = [];
            jsonArray.forEach((json: ContentIdBaseItemJson) => {
                array.push(ContentIdBaseItem.fromJson(json));
            });
            return array;
        }
    }

    export class ContentIdBaseItemBuilder {

        contentId: ContentId;

        constructor(source?: ContentIdBaseItem) {
            if (source) {
                this.contentId = source.getContentId();
            }
        }

        fromContentIdBaseItemJson(json: ContentIdBaseItemJson): ContentIdBaseItemBuilder {
            this.contentId = new ContentId(json.id);
            return this;
        }

        build(): ContentIdBaseItem {
            return new ContentIdBaseItem(this);
        }
    }
