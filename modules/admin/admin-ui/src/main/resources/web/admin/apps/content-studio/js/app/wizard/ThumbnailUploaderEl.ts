import {Button} from "../../../../../common/js/ui/button/Button";
import {CloseButton} from "../../../../../common/js/ui/button/CloseButton";
import {UploaderElConfig} from "../../../../../common/js/ui/uploader/UploaderEl";
import {UploaderEl} from "../../../../../common/js/ui/uploader/UploaderEl";
import {Content} from "../../../../../common/js/content/Content";
import {ContentIconUrlResolver} from "../../../../../common/js/content/util/ContentIconUrlResolver";
import {UriHelper} from "../../../../../common/js/util/UriHelper";
import {ContentJson} from "../../../../../common/js/content/json/ContentJson";
import {ContentBuilder} from "../../../../../common/js/content/Content";
import {Element} from "../../../../../common/js/dom/Element";
import {ImgEl} from "../../../../../common/js/dom/ImgEl";

export interface ThumbnailUploaderElConfig extends UploaderElConfig {

}

export class ThumbnailUploaderEl extends UploaderEl<Content> {

    private iconUrlResolver: ContentIconUrlResolver;

    constructor(config?: ThumbnailUploaderElConfig) {

        if (config.url == undefined) {
            config.url = UriHelper.getRestUri("content/updateThumbnail");
        }
        if (config.showCancel == undefined) {
            config.showCancel = false;
        }
        if (config.resultAlwaysVisisble == undefined) {
            config.resultAlwaysVisisble = true;
        }
        if (config.allowTypes == undefined) {
            config.allowTypes = [
                {title: 'Image files', extensions: 'jpg,gif,png,svg'}
            ];
        }
        if (config.allowMultiSelection == undefined) {
            config.allowMultiSelection = false;
        }
        if (config.hasUploadButton == undefined) {
            config.hasUploadButton = false;
        }
        if (config.hideDefaultDropZone == undefined) {
            config.hideDefaultDropZone = false;
        }

        super(config);

        this.addClass('thumbnail-uploader-el');
        this.iconUrlResolver = new ContentIconUrlResolver();
    }


    createModel(serverResponse: ContentJson): Content {
        if (serverResponse) {
            return new ContentBuilder().fromContentJson(<ContentJson> serverResponse).build();
        }
        else {
            return null;
        }
    }

    getModelValue(item: Content): string {
        return this.iconUrlResolver.setContent(item).resolve();
    }

    createResultItem(value: string): Element {
        return new ImgEl(value);
    }

}
