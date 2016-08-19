import {Event} from "../event/Event";
import {Component} from "../content/page/region/Component";
import {ClassHelper} from "../ClassHelper";
import {ComponentView} from "./ComponentView";

export class ComponentLoadedEvent extends Event {

        private newComponentView: ComponentView<Component>;
        private oldComponentView: ComponentView<Component>;

        constructor(newComponentView: ComponentView<Component>, oldComponentView: ComponentView<Component>) {
            super();
            this.newComponentView = newComponentView;
            this.oldComponentView = oldComponentView;
        }

        getNewComponentView(): ComponentView<Component> {
            return this.newComponentView;
        }

        getOldComponentView(): ComponentView<Component> {
            return this.oldComponentView;
        }

        static on(handler: (event: ComponentLoadedEvent) => void, contextWindow: Window = window) {
            Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
        }

        static un(handler?: (event: ComponentLoadedEvent) => void, contextWindow: Window = window) {
            Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
        }
    }
