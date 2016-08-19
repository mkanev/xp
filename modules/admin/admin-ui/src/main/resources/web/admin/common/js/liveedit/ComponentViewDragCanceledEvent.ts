import {Event} from "../event/Event";
import {Component} from "../content/page/region/Component";
import {ClassHelper} from "../ClassHelper";
import {ComponentView} from "./ComponentView";
import {ComponentViewDragStoppedEvent} from "./ComponentViewDraggingStoppedEvent";

export class ComponentViewDragCanceledEvent extends Event {

        private componentView: ComponentView<Component>;

        constructor(componentView: ComponentView<Component>) {
            super();
            this.componentView = componentView;
        }

        getComponentView(): ComponentView<Component> {
            return this.componentView;
        }

        static on(handler: (event: ComponentViewDragStoppedEvent) => void, contextWindow: Window = window) {
            Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
        }

        static un(handler: (event: ComponentViewDragStoppedEvent) => void, contextWindow: Window = window) {
            Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
        }
    }
