import {ItemTypeConfigJson} from "../ItemTypeConfig";
import {ComponentItemType} from "../ComponentItemType";
import {RegionView} from "../RegionView";
import {TextComponent} from "../../content/page/region/TextComponent";
import {CreateItemViewConfig} from "../CreateItemViewConfig";
import {TextComponentViewBuilder} from "./TextComponentView";
import {TextComponentView} from "./TextComponentView";

export class TextItemType extends ComponentItemType {

        private static INSTANCE = new TextItemType();

        static get(): TextItemType {
            return TextItemType.INSTANCE;
        }

        constructor() {
            super("text", this.getConfigJson());
        }

        createView(config: CreateItemViewConfig<RegionView,TextComponent>): TextComponentView {
            return new TextComponentView(new TextComponentViewBuilder().
                setItemViewProducer(config.itemViewProducer).
                setParentRegionView(config.parentView).
                setParentElement(config.parentElement).
                setComponent(config.data).
                setElement(config.element).
                setPositionIndex(config.positionIndex));
        }

        isComponentType(): boolean {
            return true
        }

        private getConfigJson(): ItemTypeConfigJson {
            var config = this.getDefaultConfigJson("text");
            config.contextMenuConfig.push("edit");
            
            return config;
        }
    }

    TextItemType.get();
