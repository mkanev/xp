import {NodeServerChangeType} from "../../event/NodeServerChange";
import {Event} from "../../event/Event";
import {ClassHelper} from "../../ClassHelper";
import {ContentServerEvent} from "./ContentServerEvent";

export class BatchContentServerEvent extends Event {

        private events: ContentServerEvent[];

        private type: NodeServerChangeType;

        constructor(events: ContentServerEvent[], type: NodeServerChangeType) {
            super();
            this.events = events || [];
            this.type = type;
        }

        getEvents(): ContentServerEvent[] {
            return this.events;
        }

        getType(): NodeServerChangeType {
            return this.type;
        }

        toString(): string {
            return "BatchContentServerEvent: [" +
                   this.events.map((event) => event.toString()).join(", ") +
                   "]";
        }

        static on(handler: (event: BatchContentServerEvent) => void) {
            Event.bind(ClassHelper.getFullName(this), handler);
        }

        static un(handler?: (event: BatchContentServerEvent) => void) {
            Event.unbind(ClassHelper.getFullName(this), handler);
        }
    }
