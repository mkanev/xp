import {ItemType} from "../ItemType";
import {ComponentItemType} from "../ComponentItemType";
import {RegionView} from "../RegionView";
import {PartComponent} from "../../content/page/region/PartComponent";
import {CreateItemViewConfig} from "../CreateItemViewConfig";
import {PartComponentViewBuilder} from "./PartComponentView";
import {PartComponentView} from "./PartComponentView";

export class PartItemType extends ComponentItemType {

        private static INSTANCE = new PartItemType();

        static get(): PartItemType {
            return PartItemType.INSTANCE;
        }

        constructor() {
            super("part", this.getDefaultConfigJson("part"));
        }

        isComponentType(): boolean {
            return true
        }

        createView(config: CreateItemViewConfig<RegionView,PartComponent>): PartComponentView {

            return new PartComponentView(new PartComponentViewBuilder().
                setItemViewProducer(config.itemViewProducer).
                setParentRegionView(config.parentView).
                setParentElement(config.parentElement).
                setComponent(config.data).
                setElement(config.element).
                setPositionIndex(config.positionIndex));
        }
    }

    PartItemType.get();
