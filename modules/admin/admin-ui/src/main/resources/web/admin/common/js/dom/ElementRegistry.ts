import {Element} from "./Element";
import {ClassHelper} from "../ClassHelper";

export class ElementRegistry {

        private static counters: { [index: string]: number; } = {};

        private static elements: { [index: string]: Element; } = {};

        public static registerElement(el: Element): string {
            var fullName,
                id = el.getId();

            if (!id) {
                id = fullName = ClassHelper.getFullName(el);
            } else {
                fullName = id;
            }
            var count = ElementRegistry.counters[fullName];
            if (count >= 0) {
                id += '-' + (++count);
            }

            ElementRegistry.counters[fullName] = count || 0;
            ElementRegistry.elements[id] = el;

            return id;
        }

        public static unregisterElement(el: Element) {
            if (el) {
                delete ElementRegistry.elements[el.getId()];
                // don't reduce counter because if we deleted 2nd element while having 5,
                // the counter would had been reduced to 4 resulting in a double 5 elements after another one is created.
            }
        }

        public static getElementById(id: string): Element {
            return ElementRegistry.elements[id];
        }

        public static getElementCountById(id: string): number {
            // Get the counter from the id according to the name notation
            let count = parseInt(id.slice(id.lastIndexOf('-') + 1)) || 0;
            return count;
        }
    }

