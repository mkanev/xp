import {NamesAndIconViewer} from "../../../../../../../../../common/js/ui/NamesAndIconViewer";
import {PageTemplateDisplayName} from "../../../../../../../../../common/js/content/page/PageMode";

import {PageTemplateOption} from "./PageTemplateOption";

export class PageTemplateOptionViewer extends NamesAndIconViewer<PageTemplateOption> {

    constructor() {
        super();
    }

    resolveDisplayName(object: PageTemplateOption): string {
        var pageTemplateDisplayName = PageTemplateDisplayName;

        return !!object.getPageTemplate() ?
               (object.isCustom() ? pageTemplateDisplayName[pageTemplateDisplayName.Custom] : object.getPageTemplate().getDisplayName())
            : pageTemplateDisplayName[pageTemplateDisplayName.Automatic];
    }

    resolveSubName(object: PageTemplateOption, relativePath: boolean = false): string {
        if (!!object.getPageTemplate()) {
            if (object.isCustom()) {
                return "Set up your own page";
            }
            else {
                return object.getPageTemplate().getPath().toString();
            }
        }
        else if (!!object.getPageModel().getDefaultPageTemplate()) {
            return "(" + object.getPageModel().getDefaultPageTemplate().getDisplayName().toString() + ")";
        }
        else {
            return "( no default template found )";
        }
    }

    resolveIconClass(object: PageTemplateOption): string {
        var iconClass = !!object.getPageTemplate() ? (object.isCustom() ? "icon-cog" : "icon-newspaper") : "icon-wand";

        return iconClass + " icon-large";
    }

    getPreferredHeight(): number {
        return 50;
    }
}
