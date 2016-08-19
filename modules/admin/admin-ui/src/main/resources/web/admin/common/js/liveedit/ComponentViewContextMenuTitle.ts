import {Component} from "../content/page/region/Component";
import {ComponentPropertyChangedEvent} from "../content/page/region/ComponentPropertyChangedEvent";
import {ComponentName} from "../content/page/region/ComponentName";
import {ComponentItemType} from "./ComponentItemType";
import {ItemViewContextMenuTitle} from "./ItemViewContextMenuTitle";

export class ComponentViewContextMenuTitle<COMPONENT extends Component> extends ItemViewContextMenuTitle {

        constructor(component: COMPONENT, type: ComponentItemType) {
            var handler = (event: ComponentPropertyChangedEvent) => {
                if (event.getPropertyName() == Component.PROPERTY_NAME) {
                    this.setMainName(this.createMainName(component));
                }
            };
            super(this.createMainName(component), type.getConfig().getIconCls());

            component.onPropertyChanged(handler);
            this.onRemoved(() => component.unPropertyChanged(handler));
        }

        private createMainName(component: COMPONENT): string {
            return component.getName() ? component.getName().toString() : "";
        }

    }

