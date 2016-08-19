import {DivEl} from "../dom/DivEl";

export class PagePlaceholderInfoBlock extends DivEl {

        private line1: DivEl;

        private line2: DivEl;

        constructor() {
            super("page-placeholder-info");

            this.line1 = new DivEl("page-placeholder-info-line1");
            this.line2 = new DivEl("page-placeholder-info-line2");

            this.appendChildren(this.line1, this.line2);
        }

        setTextForContent(contentTypeDisplayName: string) {
            this.line1.setHtml("Select a controller below to set up a customized page");
            this.line2.setHtml('No page templates supporting content type "' + contentTypeDisplayName + '" found');
        }

        setNoControllersAvailableText() {
            this.line1.setHtml("No page controllers found");
            this.line2.setHtml("Please add an application to your site to enable rendering of this item");
        }

    }
