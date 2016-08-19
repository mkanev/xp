import {ItemView} from "../../../../../common/js/liveedit/ItemView";
import {ItemType} from "../../../../../common/js/liveedit/ItemType";
import {PageView} from "../../../../../common/js/liveedit/PageView";
import {PageItemType} from "../../../../../common/js/liveedit/PageItemType";
import {Content} from "../../../../../common/js/content/Content";
import {TextItemType} from "../../../../../common/js/liveedit/text/TextItemType";
import {FragmentItemType} from "../../../../../common/js/liveedit/fragment/FragmentItemType";
import {TextComponentView} from "../../../../../common/js/liveedit/text/TextComponentView";
import {FragmentComponentView} from "../../../../../common/js/liveedit/fragment/FragmentComponentView";
import {TextComponent} from "../../../../../common/js/content/page/region/TextComponent";
import {TextComponentViewer} from "../../../../../common/js/liveedit/text/TextComponentViewer";
import {NamesAndIconViewer} from "../../../../../common/js/ui/NamesAndIconViewer";
import {ObjectHelper} from "../../../../../common/js/ObjectHelper";

export class PageComponentsItemViewer extends NamesAndIconViewer<ItemView> {

    private content: Content;

    constructor(content: Content) {
        this.content = content;
        super('page-components-item-viewer');
    }

    resolveDisplayName(object: ItemView): string {
        if (ObjectHelper.iFrameSafeInstanceOf(object.getType(), TextItemType)) {
            let textView = <TextComponentView> object;
            let textComponent = <TextComponent>textView.getComponent();
            let viewer = <TextComponentViewer>object.getViewer()
            return viewer.resolveDisplayName(textComponent, textView);
        } else if (ObjectHelper.iFrameSafeInstanceOf(object.getType(), FragmentItemType)) {
            let fragmentView = <FragmentComponentView> object;
            let fragmentComponent = fragmentView.getFragmentRootComponent();
            if (fragmentComponent) {
                if (ObjectHelper.iFrameSafeInstanceOf(fragmentComponent, TextComponent)) {
                    return this.extractTextFromTextComponent(<TextComponent>fragmentComponent);
                }
                return fragmentComponent.getName().toString();
            }
        }

        return object.getName();
    }

    resolveSubName(object: ItemView, relativePath: boolean = false): string {
        if (ObjectHelper.iFrameSafeInstanceOf(object.getType(), FragmentItemType)) {
            let fragmentView = <FragmentComponentView> object;
            let fragmentComponent = fragmentView.getFragmentRootComponent();
            if (fragmentComponent) {
                return fragmentComponent.getType().getShortName();
            }
        }

        return object.getType() ? object.getType().getShortName() : "";
    }

    resolveIconUrl(object: ItemView): string {
        if (PageItemType.get().equals(object.getType())) {
            return object.getIconUrl(this.content);
        }
        return null;
    }

    resolveIconClass(object: ItemView): string {
        return object.getIconClass();
    }

    private extractTextFromTextComponent(textComponent: TextComponent): string {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = textComponent.getText();
        return (tmp.textContent || tmp.innerText || "").trim();
    }
}
