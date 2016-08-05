module api.material.ui.dialog {

    import FooterEl = api.material.dom.FooterEl;
    import Action = api.ui.Action;
    import FlatButton = api.material.ui.button.FlatButton;

    export interface DialogActionsConfig {
        actions?: Action[],
        dialog?: Dialog
    }

    export class DialogActions extends FooterEl {

        private config: DialogActionsConfig;
        private buttons: FlatButton[] = [];

        constructor(config: DialogActionsConfig) {
            super("dialog__actions mdl-dialog__actions");
            this.initialize(config);
        }

        initialize(config: DialogActionsConfig) {
            this.config = config;
            this.config.actions = config.actions || this.getDefaultActions(config);
            this.buttons = [];
        }

        getDefaultActions(config: DialogActionsConfig): Action[] {
            const cancelAction = new Action("Close");
            cancelAction.onExecuted(() => {
                config.dialog.close();
            });
            return [cancelAction];
        }

        giveFocus(): boolean {
            if (this.buttons.length > 0) {
                return this.buttons[0].giveFocus();
            }
            return false;
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
            this.config.actions.forEach((action) => {
                const button = new FlatButton(action);
                this.buttons.push(button)
                this.appendChild(button);
            });

            return wemQ(true);
        }
    }
}
