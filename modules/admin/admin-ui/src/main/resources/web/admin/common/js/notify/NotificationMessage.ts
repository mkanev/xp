import {DivEl} from "../dom/DivEl";
import {SpanEl} from "../dom/SpanEl";

export class NotificationMessage extends DivEl {

        private notificationInner: DivEl;

        constructor(message: string) {
            super("notification");
            this.notificationInner = new DivEl("notification-inner");
            var notificationRemove = new SpanEl("notification-remove");
            notificationRemove.setHtml("X");
            var notificationContent = new DivEl("notification-content");
            notificationContent.getEl().setInnerHtml(message, false);
            this.notificationInner.appendChild(notificationRemove).appendChild(notificationContent);
            this.appendChild(this.notificationInner);
        }

    }
