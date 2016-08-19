import {NamesAndIconViewer} from "../../ui/NamesAndIconViewer";
import {ImageComponent} from "../../content/page/region/ImageComponent";
import {ItemViewIconClassResolver} from "../ItemViewIconClassResolver";

export class ImageComponentViewer extends NamesAndIconViewer<ImageComponent> {

        constructor() {
            super();
        }

        resolveDisplayName(object: ImageComponent): string {
            return !!object.getName() ? object.getName().toString() : "";
        }

        resolveSubName(object: ImageComponent, relativePath: boolean = false): string {
            return object.getPath().toString();
        }

        resolveIconClass(object: ImageComponent): string {
            return ItemViewIconClassResolver.resolveByType("image");
        }

    }

