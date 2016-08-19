import {ContentJson} from "../json/ContentJson";
import {ListContentResult} from "../resource/result/ListContentResult";
import {BaseLoader} from "../../util/loader/BaseLoader";
import {PageTemplate} from "./PageTemplate";
import {PageTemplateResourceRequest} from "./PageTemplateResourceRequest";

export class PageTemplateLoader extends BaseLoader<ListContentResult<ContentJson>, PageTemplate> {

        constructor(request: PageTemplateResourceRequest<ListContentResult<ContentJson>, PageTemplate[]>) {
            super(request);
        }

        filterFn(template: PageTemplate) {
            return template.getDisplayName().toString().indexOf(this.getSearchString().toLowerCase()) != -1;
        }

    }
