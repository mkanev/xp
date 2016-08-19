import {DivEl} from "../dom/DivEl";
import {StyleHelper} from "../StyleHelper";
import {PEl} from "../dom/PEl";
import {AEl} from "../dom/AEl";

export class ItemViewPlaceholder extends DivEl {

        constructor() {
            super("item-placeholder", StyleHelper.PAGE_EDITOR_PREFIX);
        }

        showRenderingError(url: string, errorMessage: string = "Error rendering component") {

            this.removeChildren();
            this.addClass("rendering-error");

            var errorTitle = new PEl().
                setHtml(errorMessage);

            var urlAnchor = new AEl().
                setUrl(url, "_blank").
                setHtml("Show more...");

            this.appendChildren(errorTitle, urlAnchor);
        }

        select() {

        }

        deselect() {

        }
    }
