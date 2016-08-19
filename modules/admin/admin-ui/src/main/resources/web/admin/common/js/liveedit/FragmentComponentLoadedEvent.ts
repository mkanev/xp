import {Event} from "../event/Event";
import {FragmentComponentView} from "./fragment/FragmentComponentView";
import {ClassHelper} from "../ClassHelper";

export class FragmentComponentLoadedEvent extends Event {

        private fragmentComponentView: FragmentComponentView;

        constructor(fragmentComponentView: FragmentComponentView) {
            super();
            this.fragmentComponentView = fragmentComponentView;
        }

        getFragmentComponentView(): FragmentComponentView {
            return this.fragmentComponentView;
        }

        static on(handler: (event: FragmentComponentLoadedEvent) => void, contextWindow: Window = window) {
            Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
        }

        static un(handler?: (event: FragmentComponentLoadedEvent) => void, contextWindow: Window = window) {
            Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
        }
    }
