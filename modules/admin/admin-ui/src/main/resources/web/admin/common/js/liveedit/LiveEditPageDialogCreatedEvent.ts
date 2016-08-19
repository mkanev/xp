import {HtmlModalDialog as ModalDialog} from "../util/htmlarea/dialog/HtmlModalDialog";
import {Event} from "../event/Event";
import {ClassHelper} from "../ClassHelper";

export class LiveEditPageDialogCreatedEvent extends Event {

        private dialog: ModalDialog;

        private config: any;

        constructor(dialog: ModalDialog, config: any) {
            super();
            this.dialog = dialog;
            this.config = config;
        }

        getModalDialog(): ModalDialog {
            return this.dialog;
        }

        getConfig(): any {
            return this.config;
        }

        static on(handler: (event: LiveEditPageDialogCreatedEvent) => void, contextWindow: Window = window) {
            Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
        }

        static un(handler?: (event: LiveEditPageDialogCreatedEvent) => void, contextWindow: Window = window) {
            Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
        }
    }
