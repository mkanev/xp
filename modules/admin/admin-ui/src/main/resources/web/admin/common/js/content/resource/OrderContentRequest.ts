import {SetChildOrderJson} from "../json/SetChildOrderJson";
import {ChildOrder} from "../order/ChildOrder";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentJson} from "../json/ContentJson";
import {Content} from "../Content";
import {ContentId} from "../ContentId";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class OrderContentRequest extends ContentResourceRequest<any, any> {

        private silent: boolean = false;

        private contentId: ContentId;

        private childOrder: ChildOrder;

        constructor() {
            super();
            super.setMethod("POST");
        }

        setContentId(value: ContentId): OrderContentRequest {
            this.contentId = value;
            return this;
        }

        setChildOrder(value: ChildOrder): OrderContentRequest {
            this.childOrder = value;
            return this;
        }

        setSilent(silent: boolean): OrderContentRequest {
            this.silent = silent;
            return this;
        }

        getParams(): Object {
            return this.contentToJson();
        }

        private contentToJson(): SetChildOrderJson {
            return ChildOrder.toSetChildOrderJson(this.contentId, this.childOrder, this.silent);
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "setChildOrder");
        }

        sendAndParse(): wemQ.Promise<Content> {

            return this.send().then((response: JsonResponse<ContentJson>) => {

                return this.fromJsonToContent(response.getResult());

            });
        }

    }
