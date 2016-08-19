import {InputTypeView} from "../form/inputtype/InputTypeView";
import {Event} from "../event/Event";
import {ClassHelper} from "../ClassHelper";

export class FocusSwitchEvent extends Event {
        private inputTypeView: InputTypeView<any>;

        constructor(inputTypeView: InputTypeView<any>) {
            super();
            this.inputTypeView = inputTypeView;
        }

        getInputTypeView(): InputTypeView<any> {
            return this.inputTypeView;
        }

        static on(handler: (event: FocusSwitchEvent) => void, contextWindow: Window = window) {
            Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
        }

        static un(handler?: (event: FocusSwitchEvent) => void, contextWindow: Window = window) {
            Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
        }
    }
