import {ContentJson} from "../../json/ContentJson";
import {Content} from "../../Content";
import {ContentId} from "../../ContentId";
import {PropertyTree} from "../../../data/PropertyTree";
import {Component} from "./Component";
import {Path} from "../../../rest/Path";
import {JsonResponse} from "../../../rest/JsonResponse";
import {FragmentResourceRequest} from "./FragmentResourceRequest";

export class CreateFragmentRequest extends FragmentResourceRequest<ContentJson, Content> {

        private contentId: ContentId;

        private config: PropertyTree;

        private component: Component;

        constructor(contentId: ContentId) {
            super();
            super.setMethod("POST");
            this.contentId = contentId;
        }

        setConfig(config: PropertyTree): CreateFragmentRequest {
            this.config = config;
            return this;
        }

        setComponent(value: Component): CreateFragmentRequest {
            this.component = value;
            return this;
        }

        getParams(): Object {
            return {
                contentId: this.contentId.toString(),
                config: this.config ? this.config.toJson() : null,
                component: this.component != null ? this.component.toJson() : null
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "create");
        }

        sendAndParse(): wemQ.Promise<Content> {

            return this.send().then((response: JsonResponse<ContentJson>) => {
                return response.isBlank() ? null : this.fromJsonToContent(response.getResult());
            });
        }
    }
