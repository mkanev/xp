import {Viewer} from "../../../ui/Viewer";
import {ImageCroppingNameView} from "./ImageCroppingNameView";
import {ImageCroppingOption} from "./ImageCroppingOption";

export class ImageCroppingOptionViewer extends Viewer<ImageCroppingOption> {

        private nameView: ImageCroppingNameView;

        constructor() {
            super();

            this.nameView = new ImageCroppingNameView(false);
            this.appendChild(this.nameView);
        }

        setObject(object: ImageCroppingOption) {
            this.nameView.setMainName(object.getDisplayValue());

            return super.setObject(object);
        }

        getPreferredHeight(): number {
            return 26;
        }
    }
