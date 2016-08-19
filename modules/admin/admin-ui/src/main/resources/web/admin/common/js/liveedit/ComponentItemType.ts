import {Component} from "../content/page/region/Component";
import {StyleHelper} from "../StyleHelper";
import {ComponentView} from "./ComponentView";
import {CreateItemViewConfig} from "./CreateItemViewConfig";
import {ItemType} from "./ItemType";
import {ItemTypeConfigJson} from "./ItemTypeConfig";
import {RegionView} from "./RegionView";

export class ComponentItemType extends ItemType {

        constructor(shortName: string, config: ItemTypeConfigJson) {
            super(shortName, config);
        }

        createView(config: CreateItemViewConfig<RegionView,Component>): ComponentView<Component> {
            throw new Error("Must be implemented by inheritors");
        }

        protected getDefaultConfigJson(itemType: string): ItemTypeConfigJson {
            return <ItemTypeConfigJson>{
                cssSelector: '[data-portal-component-type=' + itemType + ']',
                draggable: true,
                cursor: 'move',
                iconCls: StyleHelper.COMMON_PREFIX + 'icon-' + itemType,
                highlighterStyle: {
                    stroke: 'rgba(68, 68, 68, 1)', // not used
                    strokeDasharray: '',
                    fill: 'rgba(255, 255, 255, 0)' // not used
                },
                contextMenuConfig: ['parent', 'remove', 'clear', 'duplicate']
            };
        }
    }
