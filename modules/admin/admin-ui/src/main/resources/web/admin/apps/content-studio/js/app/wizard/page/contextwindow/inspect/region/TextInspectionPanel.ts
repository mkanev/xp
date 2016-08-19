import {TextComponent} from "../../../../../../../../../common/js/content/page/region/TextComponent";
import {TextComponentView} from "../../../../../../../../../common/js/liveedit/text/TextComponentView";
import {TextComponentViewer} from "../../../../../../../../../common/js/liveedit/text/TextComponentViewer";
import {NamesAndIconView} from "../../../../../../../../../common/js/app/NamesAndIconView";
import {NamesAndIconViewBuilder} from "../../../../../../../../../common/js/app/NamesAndIconView";
import {NamesAndIconViewSize} from "../../../../../../../../../common/js/app/NamesAndIconViewSize";
import {ItemViewIconClassResolver} from "../../../../../../../../../common/js/liveedit/ItemViewIconClassResolver";

import {BaseInspectionPanel} from "../BaseInspectionPanel";

export class TextInspectionPanel extends BaseInspectionPanel {

    private namesAndIcon: NamesAndIconView;

    constructor() {
        super();

        this.namesAndIcon =
            new NamesAndIconView(new NamesAndIconViewBuilder().setSize(NamesAndIconViewSize.medium)).setIconClass(
                ItemViewIconClassResolver.resolveByType("text"));

        this.appendChild(this.namesAndIcon);
    }

    setTextComponent(textComponentView: TextComponentView) {

        let textComponent: TextComponent = <TextComponent>textComponentView.getComponent();

        if (textComponent) {
            let viewer = <TextComponentViewer>textComponentView.getViewer();
            this.namesAndIcon.setMainName(viewer.resolveDisplayName(textComponent, textComponentView));
            this.namesAndIcon.setSubName(viewer.resolveSubName(textComponent));
            this.namesAndIcon.setIconClass(viewer.resolveIconClass(textComponent));
        }
    }

}
