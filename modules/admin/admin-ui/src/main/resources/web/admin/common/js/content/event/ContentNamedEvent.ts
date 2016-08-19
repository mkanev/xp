import {Event} from "../../event/Event";
import {WizardPanel} from "../../app/wizard/WizardPanel";
import {ClassHelper} from "../../ClassHelper";
import {Content} from "../Content";

export class ContentNamedEvent extends Event {

        private wizard: WizardPanel<Content>;
        private content: Content;

        constructor(wizard: WizardPanel<Content>, content: Content) {
            super();
            this.wizard = wizard;
            this.content = content;
        }

        public getWizard(): WizardPanel<Content> {
            return this.wizard;
        }

        public getContent(): Content {
            return this.content;
        }

        static on(handler: (event: ContentNamedEvent) => void) {
            Event.bind(ClassHelper.getFullName(this), handler);
        }

        static un(handler?: (event: ContentNamedEvent) => void) {
            Event.unbind(ClassHelper.getFullName(this), handler);
        }

    }

