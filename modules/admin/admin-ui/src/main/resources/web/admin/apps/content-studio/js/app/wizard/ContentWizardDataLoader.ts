import {ContentId} from "../../../../../common/js/content/ContentId";
import {ContentTypeName} from "../../../../../common/js/schema/content/ContentTypeName";
import {Content} from "../../../../../common/js/content/Content";
import {ContentSummary} from "../../../../../common/js/content/ContentSummary";
import {Site} from "../../../../../common/js/content/site/Site";
import {ContentType} from "../../../../../common/js/schema/content/ContentType";
import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {CompareStatus} from "../../../../../common/js/content/CompareStatus";
import {ContentSummaryAndCompareStatusFetcher} from "../../../../../common/js/content/resource/ContentSummaryAndCompareStatusFetcher";
import {ObjectHelper} from "../../../../../common/js/ObjectHelper";
import {GetContentByIdRequest} from "../../../../../common/js/content/resource/GetContentByIdRequest";
import {GetContentTypeByNameRequest} from "../../../../../common/js/schema/content/GetContentTypeByNameRequest";
import {Exception} from "../../../../../common/js/Exception";
import {ExceptionType} from "../../../../../common/js/Exception";
import {GetNearestSiteRequest} from "../../../../../common/js/content/resource/GetNearestSiteRequest";
import {GetContentByPathRequest} from "../../../../../common/js/content/resource/GetContentByPathRequest";

import {DefaultModels} from "./page/DefaultModels";
import {DefaultModelsFactory, DefaultModelsFactoryConfig} from "./page/DefaultModelsFactory";
import {ContentWizardPanelParams} from "./ContentWizardPanelParams";

export class ContentWizardDataLoader {

    parentContent: Content;

    content: Content;

    contentType: ContentType;

    siteContent: Site;

    defaultModels: DefaultModels;

    compareStatus: CompareStatus;

    loadData(params: ContentWizardPanelParams): wemQ.Promise<ContentWizardDataLoader> {
        if (!params.contentSummary) {
            return this.loadDataForNew(params);
        } else {
            return this.loadDataForEdit(params);
        }
    }

    private loadDataForNew(params: ContentWizardPanelParams): wemQ.Promise<ContentWizardDataLoader> {

        return this.loadContentType(params.contentTypeName).then((loadedContentType: ContentType) => {

            this.contentType = loadedContentType;
            return this.loadParentContent(params, true);

        }).then((loadedParentContent: Content) => {

            this.parentContent = loadedParentContent;
            return this.loadSite(loadedParentContent ? loadedParentContent.getContentId() : null);

        }).then((loadedSite: Site) => {

            this.siteContent = loadedSite;
            return this.loadDefaultModels(this.siteContent, params.contentTypeName);

        }).then((defaultModels: DefaultModels) => {

            this.defaultModels = defaultModels;
            return this;

        });
    }

    private loadDataForEdit(params: ContentWizardPanelParams): wemQ.Promise<ContentWizardDataLoader> {

        let sitePromise = this.loadSite(params.contentSummary.getContentId()).then((loadedSite: Site) => {

            this.siteContent = loadedSite;

            return this.loadDefaultModels(this.siteContent, params.contentSummary.getType()).then((defaultModels) => {
                this.defaultModels = defaultModels;
            });
        });

        let contentPromise = this.loadContent(params.contentSummary).then((loadedContent: Content) => {

            this.content = loadedContent;

            let parentPromise = this.loadParentContent(params, false);
            let typePromise = this.loadContentType(this.content.getType());
            let statusPromise = ContentSummaryAndCompareStatusFetcher.fetchByContent(this.content);

            return wemQ.all([parentPromise, typePromise, statusPromise]).spread((parentContent, contentType, compareStatus) => {
                this.parentContent = parentContent;
                this.contentType = contentType;
                if (compareStatus) {
                    this.compareStatus = compareStatus.getCompareStatus();
                }
            });
        });

        return wemQ.all([sitePromise, contentPromise]).then(() => {
            return this;
        })
    }

    private loadContent(summary: ContentSummary): wemQ.Promise<Content> {
        if (ObjectHelper.iFrameSafeInstanceOf(summary, Content)) {
            return wemQ(<Content> summary);
        } else {
            return new GetContentByIdRequest(summary.getContentId()).sendAndParse();
        }
    }

    private loadContentType(name: ContentTypeName): wemQ.Promise<ContentType> {
        var deferred = wemQ.defer<ContentType>();
        new GetContentTypeByNameRequest(name).sendAndParse().then((contentType) => {
            deferred.resolve(contentType);
        }).catch((reason) => {
            deferred.reject(new Exception("Content cannot be opened. Required content type '" + name.toString() +
                                              "' not found.",
                ExceptionType.WARNING));
        }).done();
        return deferred.promise;
    }

    private loadSite(contentId: ContentId): wemQ.Promise<Site> {
        return contentId ? new GetNearestSiteRequest(contentId).sendAndParse() : wemQ<Site>(null);
    }

    private loadDefaultModels(site: Site, contentType: ContentTypeName): wemQ.Promise<DefaultModels> {

        if (site) {
            return DefaultModelsFactory.create(<DefaultModelsFactoryConfig>{
                siteId: site.getContentId(),
                contentType: contentType,
                applications: site.getApplicationKeys()
            });
        }
        else if (contentType.isSite()) {
            return wemQ<DefaultModels>(new DefaultModels(null, null));
        }
        else {
            return wemQ<DefaultModels>(null);
        }
    }

    private loadParentContent(params: ContentWizardPanelParams, isNew: boolean = true): wemQ.Promise<Content> {

        if (params.parentContent != null) {
            return wemQ(params.parentContent);
        }

        if (!isNew && !this.content.hasParent() ||
            isNew && params.parentContent == null) {

            return wemQ<Content>(null);
        }

        return new GetContentByPathRequest(this.content.getPath().getParentPath()).sendAndParse();
    }

}
