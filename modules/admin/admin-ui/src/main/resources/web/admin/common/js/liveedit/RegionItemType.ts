import {Region} from "../content/page/region/Region";
import {StyleHelper} from "../StyleHelper";
import {Element} from "../dom/Element";
import {CreateItemViewConfig} from "./CreateItemViewConfig";
import {ItemType} from "./ItemType";
import {ItemTypeConfigJson} from "./ItemTypeConfig";
import {ItemView} from "./ItemView";
import {RegionViewBuilder} from "./RegionView";
import {RegionView} from "./RegionView";

export class RegionItemType extends ItemType {

        private static INSTANCE = new RegionItemType();

        static get(): RegionItemType {
            return RegionItemType.INSTANCE;
        }

        constructor() {
            super("region", <ItemTypeConfigJson>{
                cssSelector: '[data-portal-region]',
                draggable: false,
                cursor: 'pointer',
                iconCls: StyleHelper.COMMON_PREFIX + 'icon-region',
                highlighterStyle: {
                    stroke: 'rgba(20, 20, 20, 1)', // not used
                    strokeDasharray: '5 5',
                    fill: 'rgba(255, 255, 255, 0)' // not used
                },
                contextMenuConfig: ['parent', 'clearRegion']

            });
        }

        static getRegionName(element: Element): string {
            return element.getEl().getAttribute('data-' + ItemType.ATTRIBUTE_REGION_NAME);
        }

        createView(config: CreateItemViewConfig<ItemView,Region>): RegionView {
            return new RegionView(new RegionViewBuilder().
                setParentView(config.parentView).
                setParentElement(config.parentElement).
                setRegion(config.data).
                setElement(config.element));
        }
    }

    RegionItemType.get();
