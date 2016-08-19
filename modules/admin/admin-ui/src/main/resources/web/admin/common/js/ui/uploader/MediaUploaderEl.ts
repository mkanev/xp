import {Button} from "../button/Button";
import {CloseButton} from "../button/CloseButton";
import {ValueTypes} from "../../data/ValueTypes";
import {UploaderElConfig} from "./UploaderEl";
import {UploaderEl} from "./UploaderEl";
import {Content} from "../../content/Content";
import {AEl} from "../../dom/AEl";
import {UriHelper} from "../../util/UriHelper";
import {ContentJson} from "../../content/json/ContentJson";
import {ContentBuilder} from "../../content/Content";
import {Value} from "../../data/Value";
import {Element} from "../../dom/Element";

export enum MediaUploaderElOperation
    {
        create,
        update
    }

    export interface MediaUploaderElConfig extends UploaderElConfig {

        operation: MediaUploaderElOperation;
    }

    export class MediaUploaderEl extends UploaderEl<Content> {

        private fileName: string;

        private link: AEl;

        constructor(config: MediaUploaderElConfig) {

            if (config.url == undefined) {
                config.url = UriHelper.getRestUri("content/" + MediaUploaderElOperation[config.operation] + "Media")
            }

            super(config);

            this.addClass('media-uploader-el');
        }

        createModel(serverResponse: ContentJson): Content {
            if (serverResponse) {
                return new ContentBuilder().
                fromContentJson(<ContentJson> serverResponse).
                build();
            }
            else {
                return null;
            }
        }

        getModelValue(item: Content): string {
            return item.getId();
        }

        getMediaValue(item: Content): Value {
            var mediaProperty = item.getContentData().getProperty("media");
            var mediaValue;
            switch (mediaProperty.getType()) {
                case ValueTypes.DATA:
                    mediaValue = mediaProperty.getPropertySet().getProperty('attachment').getValue();
                    break;
                case ValueTypes.STRING:
                    mediaValue = mediaProperty.getValue();
                    break;
            }
            return mediaValue;
        }

        setFileName(name: string) {
            this.fileName = name;
            if (this.link && this.fileName != null && this.fileName != "") {
                this.link.setHtml(this.fileName);
            }
        }

        createResultItem(value: string): Element {
            this.link = new AEl().setUrl(UriHelper.getRestUri('content/media/' + value), "_blank");
            this.link.setHtml(this.fileName != null && this.fileName != "" ? this.fileName : value);

            return this.link;
        }
    }
