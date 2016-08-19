import {ContentJson} from "../json/ContentJson";
import {ContentTypeName} from "../../schema/content/ContentTypeName";
import {PropertyTree} from "../../data/PropertyTree";
import {ExtraDataJson} from "../json/ExtraDataJson";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {Content} from "../Content";
import {ContentName} from "../ContentName";
import {ContentPath} from "../ContentPath";
import {ExtraData} from "../ExtraData";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class CreateContentRequest extends ContentResourceRequest<ContentJson, Content> {

        private valid: boolean;

        private requireValid: boolean;

        private name: ContentName;

        private parent: ContentPath;

        private contentType: ContentTypeName;

        private data: PropertyTree;

        private meta: ExtraData[] = [];

        private displayName: string;

        constructor() {
            super();
            this.valid = false;
            this.requireValid = false;
            super.setMethod("POST");
        }

        setValid(value: boolean): CreateContentRequest {
            this.valid = value;
            return this;
        }

        setRequireValid(value: boolean): CreateContentRequest {
            this.requireValid = value;
            return this;
        }

        setName(value: ContentName): CreateContentRequest {
            this.name = value;
            return this;
        }

        setParent(value: ContentPath): CreateContentRequest {
            this.parent = value;
            return this;
        }

        setContentType(value: ContentTypeName): CreateContentRequest {
            this.contentType = value;
            return this;
        }

        setData(data: PropertyTree): CreateContentRequest {
            this.data = data;
            return this;
        }

        setExtraData(extraData: ExtraData[]): CreateContentRequest {
            this.meta = extraData;
            return this;
        }

        setDisplayName(displayName: string): CreateContentRequest {
            this.displayName = displayName;
            return this;
        }

        getParams(): Object {
            return {
                valid: this.valid,
                requireValid: this.requireValid,
                name: this.name.isUnnamed() ? this.name.toUnnamed().toStringIncludingHidden() : this.name.toString(),
                parent: this.parent.toString(),
                contentType: this.contentType.toString(),
                data: this.data.toJson(),
                meta: this.extraDataToJson(),
                displayName: this.displayName
            };
        }

        private extraDataToJson(): ExtraDataJson[] {
            return this.meta ? this.meta.map((extraData: ExtraData) => extraData.toJson()) : null;
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "create");
        }

        sendAndParse(): wemQ.Promise<Content> {

            return this.send().then((response: JsonResponse<ContentJson>) => {

                return this.fromJsonToContent(response.getResult());

            });
        }

    }
