import {TextInput} from "../../ui/text/TextInput";
import {AutosizeTextInput} from "../../ui/text/AutosizeTextInput";
import {ValueChangedEvent} from "../../ValueChangedEvent";
import {WizardHeader} from "./WizardHeader";

export class WizardHeaderWithName extends WizardHeader {

        private nameEl: TextInput;

        constructor() {
            super();

            this.nameEl = AutosizeTextInput.large().setForbiddenCharsRe(/[^_a-z0-9\-]+/ig);
            this.nameEl.setName('name').onValueChanged((event: ValueChangedEvent) => {
                this.notifyPropertyChanged("name", event.getOldValue(), event.getNewValue());
            });
            this.appendChild(this.nameEl);

        }

        getName(): string {
            return this.nameEl.getValue();
        }

        setName(value: string) {
            this.nameEl.setValue(value);
        }

        giveFocus(): boolean {
            return this.nameEl.giveFocus();
        }
    }
