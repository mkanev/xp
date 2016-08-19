import {Content} from "../content/Content";
import {Site} from "../content/site/Site";
import {StyleHelper} from "../StyleHelper";
import {CreateItemViewConfig} from "./CreateItemViewConfig";
import {ItemType} from "./ItemType";
import {ItemTypeConfigJson} from "./ItemTypeConfig";
import {PageView} from "./PageView";

export class PageItemType extends ItemType {

        private static INSTANCE = new PageItemType();

        static get(): PageItemType {
            return PageItemType.INSTANCE;
        }

        constructor() {
            super("page", <ItemTypeConfigJson>{
                cssSelector: '[data-portal-component-type=page]',
                draggable: false,
                cursor: 'pointer',
                iconCls: StyleHelper.COMMON_PREFIX + 'icon-page',
                highlighterStyle: {
                    stroke: 'rgba(20, 20, 20, 1)', // not used
                    strokeDasharray: '',
                    fill: 'rgba(255, 255, 255, 0)' // not used
                },
                contextMenuConfig: ['reset']
            });
        }

        createView(config: CreateItemViewConfig<any,any>): PageView {
            throw new Error("Not supported");
        }
    }

    PageItemType.get();
