import {Event} from "../../event/Event";
import {ContentSummaryAndCompareStatus} from "../ContentSummaryAndCompareStatus";
import {ClassHelper} from "../../ClassHelper";

export class EditContentEvent extends Event {

        private model: ContentSummaryAndCompareStatus[];

        constructor(model: ContentSummaryAndCompareStatus[]) {
            this.model = model;
            super();
        }

        getModels(): ContentSummaryAndCompareStatus[] {
            return this.model;
        }

        static on(handler: (event: EditContentEvent) => void, contextWindow: Window = window) {
            Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
        }

        static un(handler?: (event: EditContentEvent) => void, contextWindow: Window = window) {
            Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
        }
    }
