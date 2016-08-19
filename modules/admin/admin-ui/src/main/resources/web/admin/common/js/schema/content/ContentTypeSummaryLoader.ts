import {BaseLoader} from "../../util/loader/BaseLoader";
import {ContentTypeSummaryListJson} from "./ContentTypeSummaryListJson";
import {ContentTypeSummary} from "./ContentTypeSummary";
import {GetAllContentTypesRequest} from "./GetAllContentTypesRequest";

export class ContentTypeSummaryLoader extends BaseLoader<ContentTypeSummaryListJson, ContentTypeSummary> {

        constructor() {
            super(new GetAllContentTypesRequest())
        }

        filterFn(contentType: ContentTypeSummary) {
            return contentType.getContentTypeName().toString().indexOf(this.getSearchString().toLowerCase()) != -1;
        }

    }

