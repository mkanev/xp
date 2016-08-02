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
    }
}
