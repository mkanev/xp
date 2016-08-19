import {Event} from "../event/Event";
import {Component} from "../content/page/region/Component";
import {FragmentComponentView} from "./fragment/FragmentComponentView";
import {ComponentType} from "../content/page/region/ComponentType";
import {Content} from "../content/Content";
import {ClassHelper} from "../ClassHelper";

export class ComponentFragmentCreatedEvent extends Event {

        private sourceComponentType: ComponentType;

        private fragmentComponentView: FragmentComponentView;

        private fragmentContent: Content;

        constructor(fragmentComponentView: FragmentComponentView, sourceComponentType: ComponentType,
                    fragmentContent: Content) {
            super();
            this.fragmentComponentView = fragmentComponentView;
            this.sourceComponentType = sourceComponentType;
            this.fragmentContent = fragmentContent;
        }

        getComponentView(): FragmentComponentView {
            return this.fragmentComponentView;
        }

        getFragmentContent(): Content {
            return this.fragmentContent;
        }

        getSourceComponentType(): ComponentType {
            return this.sourceComponentType;
        }

        static on(handler: (event: ComponentFragmentCreatedEvent) => void, contextWindow: Window = window) {
            Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
        }

        static un(handler?: (event: ComponentFragmentCreatedEvent) => void, contextWindow: Window = window) {
            Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
        }
    }
