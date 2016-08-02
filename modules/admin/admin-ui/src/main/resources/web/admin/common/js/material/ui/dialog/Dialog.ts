module api.material.ui.dialog {

    import DialogEl = api.material.dom.DialogEl;

    export interface DialogConfig {
        title: DialogHeaderConfig,
        content: DialogContentConfig,
        actions: DialogActionsConfig
    }

    export class Dialog extends DialogEl {

        private header: DialogHeader;
        private content: DialogContent;
        private actions: DialogActions;

        constructor(config: DialogConfig) {
            super("dialog mdl-dialog");
            this.initialize(config);
        }

        initialize(config: DialogConfig) {
            this.initHeader(config.title);
            this.initContent(config.content);
            this.initActions(config.actions);
            this.init();
        }

        private initHeader(config: DialogHeaderConfig) {
            this.header = new DialogHeader(config);
        }

        private initContent(config: DialogContentConfig): void {
            this.content = new DialogContent(config);
        }

        private initActions(config: DialogActionsConfig): void {
            this.actions = new DialogActions(config)
        }

        isDataLoaded(): boolean {
            return true;
        }

        doRender(): wemQ.Promise<boolean> {
            return super.doRender().then((rendered) => {
                if (this.isDataLoaded()) {
                    return this.doRenderOnDataLoaded(rendered);
                }
            });

        }

        doRenderOnDataLoaded(rendered: boolean): wemQ.Promise<boolean> {
            this.appendChild(this.header);
            this.appendChild(this.content);
            this.appendChild(this.actions);

            return wemQ(true);
        }
    }
}
