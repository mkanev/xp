import {AppBarTabId} from "../../../../../common/js/app/bar/AppBarTabId";
import {ContentTypeName} from "../../../../../common/js/schema/content/ContentTypeName";
import {Content} from "../../../../../common/js/content/Content";
import {ContentSummary} from "../../../../../common/js/content/ContentSummary";

export class ContentWizardPanelParams {

    createSite: boolean = false;

    tabId: AppBarTabId;

    contentTypeName: ContentTypeName;

    parentContent: Content;

    contentSummary: ContentSummary;


    setTabId(value: AppBarTabId): ContentWizardPanelParams {
        this.tabId = value;
        return this;
    }

    setContentTypeName(value: ContentTypeName): ContentWizardPanelParams {
        this.contentTypeName = value;
        return this;
    }

    setParentContent(value: Content): ContentWizardPanelParams {
        this.parentContent = value;
        return this;
    }

    setContentSummary(value: ContentSummary): ContentWizardPanelParams {
        this.contentSummary = value;
        return this;
    }

    setCreateSite(value: boolean): ContentWizardPanelParams {
        this.createSite = value;
        return this;
    }
}
