import {ContentTypeName} from "../../schema/content/ContentTypeName";
import {ContentSummaryLoader} from "./ContentSummaryLoader";
import {FragmentContentSummaryRequest} from "./FragmentContentSummaryRequest";

export class FragmentContentSummaryLoader extends ContentSummaryLoader {

        constructor() {
            super();
            super.setAllowedContentTypeNames([ContentTypeName.FRAGMENT]);
        }

        protected initContentSummaryRequest(): FragmentContentSummaryRequest {
            return new FragmentContentSummaryRequest();
        }

        setParentSitePath(parentSitePath: string): FragmentContentSummaryLoader {
            (<FragmentContentSummaryRequest>this.getRequest()).setParentSitePath(parentSitePath);
            return this;
        }

        setAllowedContentTypes(contentTypes: string[]) {
            throw new Error("Only fragments allowed");
        }

        setAllowedContentTypeNames(contentTypeNames: ContentTypeName[]) {
            throw new Error("Only fragments allowed");
        }

    }

