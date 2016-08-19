import {Content} from "../../../../../../../../common/js/content/Content";
import {NamesAndIconView} from "../../../../../../../../common/js/app/NamesAndIconView";
import {NamesAndIconViewBuilder} from "../../../../../../../../common/js/app/NamesAndIconView";
import {NamesAndIconViewSize} from "../../../../../../../../common/js/app/NamesAndIconViewSize";
import {ItemViewIconClassResolver} from "../../../../../../../../common/js/liveedit/ItemViewIconClassResolver";

import {BaseInspectionPanel} from "./BaseInspectionPanel";

export class ContentInspectionPanel extends BaseInspectionPanel {

    private content: Content;

    private namesAndIcon: NamesAndIconView;

    constructor() {
        super();

        this.namesAndIcon =
            new NamesAndIconView(new NamesAndIconViewBuilder().setSize(NamesAndIconViewSize.medium)).setIconClass(
                ItemViewIconClassResolver.resolveByType("content", "icon-xlarge"));

        this.appendChild(this.namesAndIcon);
    }

    setContent(content: Content) {

        this.content = content;

        if (content) {
            this.namesAndIcon.setMainName(content.getDisplayName());
            this.namesAndIcon.setSubName(content.getPath().toString());
        }
        else {
            this.namesAndIcon.setMainName("[No Content given]");
            this.namesAndIcon.setSubName("");
        }
    }

}
