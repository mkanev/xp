import {PublishContentJson} from "../json/PublishContentJson";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {showFeedback} from "../../notify/MessageBus";
import {showSuccess} from "../../notify/MessageBus";
import {showError} from "../../notify/MessageBus";
import {ContentId} from "../ContentId";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class PublishContentRequest extends ContentResourceRequest<PublishContentJson, any> {

        private ids: ContentId[] = [];

        private excludedIds: ContentId[] = [];

        private includeChildren: boolean;

        constructor(contentId?: ContentId) {
            super();
            this.setHeavyOperation(true);
            super.setMethod("POST");
            if (contentId) {
                this.addId(contentId);
            }
        }

        setIds(contentIds: ContentId[]): PublishContentRequest {
            this.ids = contentIds;
            return this;
        }

        setExcludedIds(excludedIds: ContentId[]): PublishContentRequest {
            this.excludedIds = excludedIds;
            return this;
        }

        setIncludeChildren(includeChildren: boolean): PublishContentRequest {
            this.includeChildren = includeChildren;
            return this;
        }

        addId(contentId: ContentId): PublishContentRequest {
            this.ids.push(contentId);
            return this;
        }

        getParams(): Object {
            return {
                ids: this.ids.map((el) => {
                    return el.toString();
                }),
                excludedIds: this.excludedIds.map((el) => {
                    return el.toString();
                }),
                includeChildren: this.includeChildren
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "publish");
        }

        static feedback(jsonResponse: JsonResponse<PublishContentJson>) {

            var result = jsonResponse.getResult(),
                succeeded = result.successes,
                failed = result.failures,
                deleted = result.deleted,
                total = succeeded + failed + deleted;

            switch (total) {
            case 0:
                showFeedback('Nothing to publish.');
                break;
            case 1:
                if (succeeded === 1) {
                    showSuccess('\"' + result.contentName + '\" published');
                } else if (failed === 1) {
                    showError('\"' + result.contentName + '\" failed, reason: ' + result.failures[0].reason);
                } else {
                    showSuccess('pending item was deleted');
                    //showSuccess('\"' + result.contentName + '\" deleted'); //restore when it's possible to get display name of deleted content
                }
                break;
            default: // > 1
                if (succeeded > 0) {
                    showSuccess(succeeded + ' items were published');
                }
                if (deleted > 0) {
                    showSuccess(deleted + ' pending items were deleted');
                }
                if (failed > 0) {
                    showError(failed + ' items failed to publish');
                }
            }
        }
    }
