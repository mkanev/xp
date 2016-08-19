import {NamesAndIconViewer} from "../../ui/NamesAndIconViewer";
import {LayoutComponent} from "../../content/page/region/LayoutComponent";
import {ItemViewIconClassResolver} from "../ItemViewIconClassResolver";

export class LayoutComponentViewer extends NamesAndIconViewer<LayoutComponent> {

        constructor() {
            super();
        }

        resolveDisplayName(object: LayoutComponent): string {
            return !!object.getName() ? object.getName().toString() : "";
        }

        resolveSubName(object: LayoutComponent, relativePath: boolean = false): string {
            return object.getPath().toString();
        }

        resolveIconClass(object: LayoutComponent): string {
            return ItemViewIconClassResolver.resolveByType("layout");
        }
    }

