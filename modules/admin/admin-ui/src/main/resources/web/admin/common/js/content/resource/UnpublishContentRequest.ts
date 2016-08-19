import {UnpublishContentJson} from "../json/UnpublishContentJson";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {showFeedback} from "../../notify/MessageBus";
import {ContentId} from "../ContentId";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class UnpublishContentRequest extends ContentResourceRequest<UnpublishContentJson, any> {

        private ids: ContentId[] = [];

        private includeChildren: boolean;

        constructor(contentId?: ContentId) {
            super();
            this.setHeavyOperation(true);
            super.setMethod("POST");
            if (contentId) {
                this.addId(contentId);
            }
        }

        setIds(contentIds: ContentId[]): UnpublishContentRequest {
            this.ids = contentIds;
            return this;
        }

        addId(contentId: ContentId): UnpublishContentRequest {
            this.ids.push(contentId);
            return this;
        }

        setIncludeChildren(include: boolean): UnpublishContentRequest {
            this.includeChildren = include;
            return this;
        }

        getParams(): Object {
            return {
                includeChildren: this.includeChildren,
                ids: this.ids.map((el) => {
                    return el.toString();
                })
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "unpublish");
        }

        static feedback(jsonResponse: JsonResponse<UnpublishContentJson>) {

            var result = jsonResponse.getResult(),
                total = result.successes;

            switch (total) {
            case 0:
                showFeedback('Nothing to unpublish.');
                break;
            case 1:
                if (total === 1) {
                    showFeedback(`"${result.contentName}" was unpublished`);
                }
                break;
            default: // > 1
                if (total > 0) {
                    showFeedback(`${total} items were unpublished`);
                }
            }
        }
    }
