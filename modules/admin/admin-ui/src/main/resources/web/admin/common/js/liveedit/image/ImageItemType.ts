import {ImageComponent} from "../../content/page/region/ImageComponent";
import {ItemType} from "../ItemType";
import {ItemTypeConfigJson} from "../ItemTypeConfig";
import {ComponentItemType} from "../ComponentItemType";
import {RegionView} from "../RegionView";
import {CreateItemViewConfig} from "../CreateItemViewConfig";
import {ImageComponentViewBuilder} from "./ImageComponentView";
import {ImageComponentView} from "./ImageComponentView";

export class ImageItemType extends ComponentItemType {

        private static INSTANCE = new ImageItemType();

        static get(): ImageItemType {
            return ImageItemType.INSTANCE;
        }

        constructor() {
            super("image", this.getDefaultConfigJson("image"));
        }

        createView(config: CreateItemViewConfig<RegionView,ImageComponent>): ImageComponentView {
            return new ImageComponentView(new ImageComponentViewBuilder().
                setItemViewProducer(config.itemViewProducer).
                setParentRegionView(config.parentView).
                setParentElement(config.parentElement).
                setElement(config.element).
                setComponent(config.data).
                setPositionIndex(config.positionIndex));
        }

        isComponentType(): boolean {
            return true
        }
    }

    ImageItemType.get();
