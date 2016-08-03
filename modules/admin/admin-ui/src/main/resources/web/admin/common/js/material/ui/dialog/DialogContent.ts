module api.material.ui.dialog {

    import DivEl = api.dom.DivEl;

    export interface DialogContentConfig {
    }

    export class DialogContent extends DivEl {

        constructor(config: DialogContentConfig) {
            super("dialog__content mdl-dialog__content");
            this.initialize(config);
        }

        initialize(config: DialogContentConfig) {
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
            return wemQ(true);
        }
    }
}
