import {Event} from "../../event/Event";
import {ClassHelper} from "../../ClassHelper";

export class PrincipalDeletedEvent extends Event {

        private principalDeletedPaths: string[] = [];

        constructor() {
            super();
        }

        addItem(principalPath: string): PrincipalDeletedEvent {
            this.principalDeletedPaths.push(principalPath);
            return this;
        }

        getDeletedItems(): string[] {
            return this.principalDeletedPaths;
        }

        isEmpty(): boolean {
            return this.principalDeletedPaths.length == 0;
        }

        fire() {
            if (!this.isEmpty()) {
                super.fire();
            }
        }

        static on(handler: (event: PrincipalDeletedEvent) => void) {
            Event.bind(ClassHelper.getFullName(this), handler);
        }

        static un(handler?: (event: PrincipalDeletedEvent) => void) {
            Event.unbind(ClassHelper.getFullName(this), handler);
        }
    }


