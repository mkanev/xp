import {Panel} from "../../ui/panel/Panel";
import {IFrameEl} from "../../dom/IFrameEl";
import {LoadMask} from "../../ui/mask/LoadMask";

export class ItemPreviewPanel extends Panel {

        public frame: IFrameEl;

        public mask: LoadMask;

        constructor(className?: string) {
            super("item-preview-panel" + (className ? " " + className : ""));
            this.mask = new LoadMask(this);
            this.frame = new IFrameEl();
            this.frame.onLoaded((event: UIEvent) => this.mask.hide());
            this.appendChild(this.frame);
        }

    }
