import {DivEl} from "../../dom/DivEl";
import {ImgEl} from "../../dom/ImgEl";

export class LazyImage extends DivEl {

        private phantomImage: ImgEl;

        constructor(src?: string) {
            super("lazy-image");

            this.addClass("empty");

            this.phantomImage = new ImgEl(null, "phantom-image");

            this.phantomImage.onLoaded(() => {
                this.getEl().setBackgroundImage("url(" + this.phantomImage.getSrc() + ")");
                this.removeClass("empty");
            });

            this.setSrc(src);
        }

        setSrc(src: string) {
            if (!this.hasClass("empty")) {
                this.addClass("empty");
            }

            this.phantomImage.setSrc(src);
        }
    }
