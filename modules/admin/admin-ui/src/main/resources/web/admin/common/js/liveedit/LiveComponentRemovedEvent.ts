import {Component} from "../content/page/region/Component";
import {Event} from "../event/Event";
import {ClassHelper} from "../ClassHelper";
import {ComponentView} from "./ComponentView";
import {RegionView} from "./RegionView";

export class LiveComponentRemovedEvent extends Event {

        private componentView: ComponentView<Component>;
        private parentRegionView: RegionView;

        constructor(componentView: ComponentView<Component>, regionView: RegionView) {
            super();
            this.componentView = componentView;
            this.parentRegionView = regionView;
        }

        getComponentView(): ComponentView<Component> {
            return this.componentView;
        }

        getParentRegionView(): RegionView {
            return this.parentRegionView;
        }

        static on(handler: (event: LiveComponentRemovedEvent) => void, contextWindow: Window = window) {
            Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
        }

        static un(handler?: (event: LiveComponentRemovedEvent) => void, contextWindow: Window = window) {
            Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
        }
    }
