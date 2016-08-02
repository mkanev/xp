module api.material.ui.dialog {

    import FooterEl = api.material.dom.FooterEl;

    export interface DialogActionsConfig {
    }

    export class DialogActions extends FooterEl {

        constructor(config: DialogActionsConfig) {
            super("dialog__actions mdl-dialog__actions");
            this.initialize(config);
        }

        initialize(config: DialogActionsConfig) {
        }
    }
}
