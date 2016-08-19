import {PageModel} from "../../../../../../../../../common/js/content/page/PageModel";
import {PageTemplate} from "../../../../../../../../../common/js/content/page/PageTemplate";
import {PageTemplateDisplayName} from "../../../../../../../../../common/js/content/page/PageMode";

export class PageTemplateOption {

    private template: PageTemplate;

    private pageModel: PageModel;

    constructor(template: PageTemplate, pageModel: PageModel) {
        this.template = template;
        this.pageModel = pageModel;
    }

    getPageTemplate(): PageTemplate {
        return this.template;
    }

    getPageModel(): PageModel {
        return this.pageModel;
    }

    isCustom(): boolean {
        var pageTemplateDisplayName = PageTemplateDisplayName;

        return this.template && this.template.getDisplayName() == pageTemplateDisplayName[pageTemplateDisplayName.Custom];
    }
}
