import {FragmentComponent} from "../../content/page/region/FragmentComponent";
import {ItemType} from "../ItemType";
import {ItemTypeConfigJson} from "../ItemTypeConfig";
import {ComponentItemType} from "../ComponentItemType";
import {RegionView} from "../RegionView";
import {CreateItemViewConfig} from "../CreateItemViewConfig";
import {FragmentComponentViewBuilder} from "./FragmentComponentView";
import {FragmentComponentView} from "./FragmentComponentView";

export class FragmentItemType extends ComponentItemType {

        private static INSTANCE = new FragmentItemType();

        static get(): FragmentItemType {
            return FragmentItemType.INSTANCE;
        }

        constructor() {
            super("fragment", this.getDefaultConfigJson("fragment"));
        }

        createView(config: CreateItemViewConfig<RegionView,FragmentComponent>): FragmentComponentView {
            return new FragmentComponentView(new FragmentComponentViewBuilder().setItemViewProducer(
                config.itemViewProducer).setParentRegionView(config.parentView).setParentElement(config.parentElement).setElement(
                config.element).setComponent(config.data).setPositionIndex(config.positionIndex));
        }

        isComponentType(): boolean {
            return true
        }
    }

    FragmentItemType.get();
