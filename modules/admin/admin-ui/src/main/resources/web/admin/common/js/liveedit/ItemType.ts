import {StringHelper} from "../util/StringHelper";
import {Equitable} from "../Equitable";
import {ComponentType} from "../content/page/region/ComponentType";
import {assert} from "../util/Assert";
import {ObjectHelper} from "../ObjectHelper";
import {Element} from "../dom/Element";
import {CreateItemViewConfig} from "./CreateItemViewConfig";
import {ItemTypeConfigJson} from "./ItemTypeConfig";
import {ItemTypeConfig} from "./ItemTypeConfig";
import {ItemView} from "./ItemView";

export class ItemType implements Equitable {

        static ATTRIBUTE_TYPE = "portal-component-type";
        static ATTRIBUTE_REGION_NAME = "portal-region";

        private static shortNameToInstance: {[shortName: string]: ItemType} = {};

        private shortName: string;

        private config: ItemTypeConfig;

        constructor(shortName: string, config: ItemTypeConfigJson) {
            ItemType.shortNameToInstance[shortName] = this;
            this.shortName = shortName;
            this.config = new ItemTypeConfig(config);
        }

        getShortName(): string {
            return this.shortName;
        }

        getConfig(): ItemTypeConfig {
            return this.config;
        }


        isComponentType(): boolean {
            return false
        }

        toComponentType(): ComponentType {
            assert(this.isComponentType(), "Not support when ItemType is not a ComponentType");
            return ComponentType.byShortName(this.shortName);
        }

        createView(config: CreateItemViewConfig<ItemView,any>): ItemView {
            throw new Error("Must be implemented by inheritors");
        }

        equals(o: Equitable): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, ItemType)) {
                return false;
            }

            var other = <ItemType>o;

            if (!ObjectHelper.stringEquals(this.shortName, other.shortName)) {
                return false;
            }

            return true;
        }

        static getDraggables(): ItemType[] {
            var draggables: ItemType[] = [];
            for (var shortName in  ItemType.shortNameToInstance) {
                var itemType = ItemType.shortNameToInstance[shortName];
                if (itemType.getConfig().isDraggable()) {
                    draggables.push(itemType);
                }
            }
            return draggables;
        }

        static byShortName(shortName: string): ItemType {
            return ItemType.shortNameToInstance[shortName];
        }

        static fromHTMLElement(element: HTMLElement): ItemType {
            var typeAsString = element.getAttribute("data-" + ItemType.ATTRIBUTE_TYPE);
            if (StringHelper.isBlank(typeAsString)) {
                var regionName = element.getAttribute("data-" + ItemType.ATTRIBUTE_REGION_NAME);
                if (!StringHelper.isBlank(regionName)) {
                    typeAsString = "region";
                }
            }
            return ItemType.byShortName(typeAsString);
        }

        static fromElement(element: Element): ItemType {
            return ItemType.fromHTMLElement(element.getHTMLElement());
        }
    }
