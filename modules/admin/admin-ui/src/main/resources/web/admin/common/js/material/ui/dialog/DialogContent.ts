module api.material.ui.dialog {

    import DivEl = api.dom.DivEl;

    export interface DialogContentConfig {
        getChildren: () => api.dom.Element[]
    }

    export class DialogContent extends DivEl {

        private config: DialogContentConfig;

        constructor(config: DialogContentConfig) {
            super("dialog__content mdl-dialog__content");
            this.initialize(config);
        }

        initialize(config: DialogContentConfig) {
            this.config = config;
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
            this.config.getChildren().forEach((child) => {
                this.appendChild(child);
            });
            return wemQ(true);
        }
    }
}
