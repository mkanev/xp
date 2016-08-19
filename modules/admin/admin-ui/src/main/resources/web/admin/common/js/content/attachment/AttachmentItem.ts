import {DivEl} from "../../dom/DivEl";
import {AEl} from "../../dom/AEl";
import {UriHelper} from "../../util/UriHelper";

export class AttachmentItem extends DivEl {

        private link: AEl;

        private removeEl: DivEl;

        private value: string;

        constructor(contentId: string, value: string, removeCallback?: (value) => void) {
            super("attachment-item");

            this.value = value;

            this.link = new AEl().setUrl(UriHelper.getRestUri('content/media/' + contentId + '/' + value));
            this.link.setHtml(value);

            this.initRemoveButton(removeCallback);
        }

        private initRemoveButton(callback?: (value) => void) {
            this.removeEl = new DivEl("icon remove");

            this.removeEl.onClicked(() => {
                if (callback) {
                    callback(this.value);
                    this.remove();
                }
            });
        }

        getValue(): string {
            return this.value;
        }

        doRender(): wemQ.Promise<boolean> {
            return super.doRender().then((rendered) => {

                this.removeChildren();
                this.appendChildren(this.removeEl, this.link);

                return rendered;
            });
        }
    }
