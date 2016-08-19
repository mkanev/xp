import {LayoutComponent} from "../../content/page/region/LayoutComponent";
import {ItemType} from "../ItemType";
import {ItemTypeConfigJson} from "../ItemTypeConfig";
import {RegionView} from "../RegionView";
import {ComponentItemType} from "../ComponentItemType";
import {CreateItemViewConfig} from "../CreateItemViewConfig";
import {LayoutComponentViewBuilder} from "./LayoutComponentView";
import {LayoutComponentView} from "./LayoutComponentView";

export class LayoutItemType extends ComponentItemType {

        private static INSTANCE = new LayoutItemType();

        static get(): LayoutItemType {
            return LayoutItemType.INSTANCE;
        }

        constructor() {
            super("layout", this.getDefaultConfigJson("layout"));
        }

        isComponentType(): boolean {
            return true
        }

        createView(config: CreateItemViewConfig<RegionView,LayoutComponent>): LayoutComponentView {
            return new LayoutComponentView(new LayoutComponentViewBuilder().
                setItemViewProducer(config.itemViewProducer).
                setParentRegionView(config.parentView).
                setParentElement(config.parentElement).
                setComponent(config.data).
                setElement(config.element).
                setPositionIndex(config.positionIndex));
        }
    }

    LayoutItemType.get();
