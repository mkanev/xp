import {ApplicationKey} from "../../application/ApplicationKey";
import {BaseLoader} from "../../util/loader/BaseLoader";
import {ContentTypeSummaryListJson} from "./ContentTypeSummaryListJson";
import {ContentId} from "../../content/ContentId";
import {GetNearestSiteRequest} from "../../content/resource/GetNearestSiteRequest";
import {Site} from "../../content/site/Site";
import {ContentTypeName} from "./ContentTypeName";
import {ContentTypeSummary} from "./ContentTypeSummary";
import {GetAllContentTypesRequest} from "./GetAllContentTypesRequest";

export class PageTemplateContentTypeLoader extends BaseLoader<ContentTypeSummaryListJson, ContentTypeSummary> {

        private contentId: ContentId;
        constructor(contentId: ContentId) {
            super(new GetAllContentTypesRequest());
            this.contentId = contentId;
        }

        filterFn(contentType: ContentTypeSummary) {
            return contentType.getContentTypeName().toString().indexOf(this.getSearchString().toLowerCase()) != -1;
        }

        sendRequest(): wemQ.Promise<ContentTypeSummary[]> {
            return new GetAllContentTypesRequest().sendAndParse().then((contentTypeArray: ContentTypeSummary[]) => {
                return new GetNearestSiteRequest(this.contentId).sendAndParse().then(
                    (parentSite: Site) => {
                    var typesAllowedEverywhere: {[key:string]: ContentTypeName} = {};
                    [ContentTypeName.UNSTRUCTURED, ContentTypeName.FOLDER, ContentTypeName.SITE,
                        ContentTypeName.SHORTCUT].forEach((contentTypeName: ContentTypeName) => {
                            typesAllowedEverywhere[contentTypeName.toString()] = contentTypeName;
                        });
                    var siteApplications: {[key:string]: ApplicationKey} = {};
                    parentSite.getApplicationKeys().forEach((applicationKey: ApplicationKey) => {
                        siteApplications[applicationKey.toString()] = applicationKey;
                    });

                    var results = contentTypeArray.filter((item: ContentTypeSummary) => {
                        var contentTypeName = item.getContentTypeName();
                        if (item.isAbstract()) {
                            return false;
                        }
                        else if (contentTypeName.isDescendantOfMedia()) {
                            return true;
                        }
                        else if (typesAllowedEverywhere[contentTypeName.toString()]) {
                            return true;
                        }
                        else if (siteApplications[contentTypeName.getApplicationKey().toString()]) {
                            return true;
                        }
                        else {
                            return false;
                        }

                    });

                    return results;
                });
            });
        }
    }

