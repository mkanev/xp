module api.liveedit {

    import Component = api.content.page.region.Component;

    export class StartTextEditModeEvent extends api.event.Event {

        private componentView: ComponentView<Component>;

        constructor(componentView: ComponentView<Component>) {
            super();
            this.componentView = componentView;
        }

        getComponentView(): ComponentView<Component> {
            return this.componentView;
        }

        static on(handler: (event: StartTextEditModeEvent) => void, contextWindow: Window = window) {
            api.event.Event.bind(api.ClassHelper.getFullName(this), handler, contextWindow);
        }

        static un(handler?: (event: StartTextEditModeEvent) => void, contextWindow: Window = window) {
            api.event.Event.unbind(api.ClassHelper.getFullName(this), handler, contextWindow);
        }
    }
}