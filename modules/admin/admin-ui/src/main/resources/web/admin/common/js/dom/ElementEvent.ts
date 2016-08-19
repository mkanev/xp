import {Event} from "../event/Event";
import {Element} from "./Element";

export class ElementEvent extends Event {

        private element: Element;
        private target: Element;

        constructor(name: string, element: Element, target?: Element) {
            super(name);
            this.element = element;
            this.target = target || element;
        }

        getElement(): Element {
            return this.element;
        }

        getTarget(): Element {
            return this.target;
        }
    }

