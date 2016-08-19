import {ContentJson} from "../json/ContentJson";
import {Content} from "../Content";
import {ContentId} from "../ContentId";
import {DescriptorKey} from "./DescriptorKey";
import {PageTemplateKey} from "./PageTemplateKey";
import {PropertyTree} from "../../data/PropertyTree";
import {Regions} from "./region/Regions";
import {Component} from "./region/Component";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {PageCUDRequest} from "./PageCUDRequest";
import {PageResourceRequest} from "./PageResourceRequest";

export class CreatePageRequest extends PageResourceRequest<ContentJson, Content> implements PageCUDRequest {

        private contentId: ContentId;

        private controller: DescriptorKey;

        private template: PageTemplateKey;

        private config: PropertyTree;

        private regions: Regions;

        private fragment: Component;

        private customized: boolean;

        constructor(contentId: ContentId) {
            super();
            super.setMethod("POST");
            this.contentId = contentId;
        }

        setController(controller: DescriptorKey): CreatePageRequest {
            this.controller = controller;
            return this;
        }

        setPageTemplateKey(pageTemplateKey: PageTemplateKey): CreatePageRequest {
            this.template = pageTemplateKey;
            return this;
        }

        setConfig(config: PropertyTree): CreatePageRequest {
            this.config = config;
            return this;
        }

        setRegions(value: Regions): CreatePageRequest {
            this.regions = value;
            return this;
        }

        setFragment(value: Component): CreatePageRequest {
            this.fragment = value;
            return this;
        }

        setCustomized(value: boolean): CreatePageRequest {
            this.customized = value;
            return this;
        }

        getParams(): Object {
            return {
                contentId: this.contentId.toString(),
                controller: this.controller ? this.controller.toString() : null,
                template: this.template ? this.template.toString() : null,
                config: this.config ? this.config.toJson() : null,
                regions: this.regions != null ? this.regions.toJson() : null,
                customized: this.customized,
                fragment: this.fragment != null ? this.fragment.toJson() : null
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
