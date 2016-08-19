import {ComponentView} from "../ComponentView";
import {ContentView} from "../ContentView";
import {RegionView} from "../RegionView";
import {ImageComponent} from "../../content/page/region/ImageComponent";
import {Element} from "../../dom/Element";
import {ComponentViewBuilder} from "../ComponentView";
import {ImageComponentViewer} from "./ImageComponentViewer";
import {ImageItemType} from "./ImageItemType";
import {ImagePlaceholder} from "./ImagePlaceholder";

export class ImageComponentViewBuilder extends ComponentViewBuilder<ImageComponent> {

        constructor() {
            super();
            this.setType(ImageItemType.get());
        }
    }

    export class ImageComponentView extends ComponentView<ImageComponent> {

        private image: Element;
        private imageComponent: ImageComponent;

        constructor(builder: ImageComponentViewBuilder) {
            this.liveEditModel = builder.parentRegionView.getLiveEditModel();
            this.imageComponent = builder.component;

            super(builder.setPlaceholder(
                new ImagePlaceholder(this)).
                setViewer(new ImageComponentViewer()).
                setInspectActionRequired(true));

            this.initializeImage();
        }

        private initializeImage() {

            var figureElChildren = this.getChildren();
            for (var i = 0; i < figureElChildren.length; i++) {
                var image = figureElChildren[i];
                if (image.getHTMLElement().tagName.toUpperCase() == 'IMG') {
                    this.image = image;

                    // no way to use ImgEl.onLoaded because all html tags are parsed as Element
                    this.image.getEl().addEventListener("load", (event) => {
                        // refresh shader and highlighter after image loaded
                        // if it's still selected
                        if (this.isSelected()) {
                            this.highlightSelected();
                            //this.shade();
                        }
                    });
                }
                return;
            }
        }

        isEmpty(): boolean {
            return !this.imageComponent || this.imageComponent.isEmpty();
        }

    }
