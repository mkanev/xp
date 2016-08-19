import {RegionPath} from "../content/page/region/RegionPath";
import {RegionView} from "./RegionView";
import {Event} from "../event/Event";
import {ClassHelper} from "../ClassHelper";

export class RegionSelectedEvent extends Event {

        private pageItemView: RegionView;

        constructor(regionView: RegionView) {
            super();
            this.pageItemView = regionView;
        }

        getRegionView(): RegionView {
            return this.pageItemView;
        }

        static on(handler: (event: RegionSelectedEvent) => void, contextWindow: Window = window) {
            Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
        }

        static un(handler: (event: RegionSelectedEvent) => void, contextWindow: Window = window) {
            Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
        }
    }
