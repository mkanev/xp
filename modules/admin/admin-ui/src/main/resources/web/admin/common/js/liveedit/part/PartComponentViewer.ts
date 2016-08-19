import {NamesAndIconViewer} from "../../ui/NamesAndIconViewer";
import {PartComponent} from "../../content/page/region/PartComponent";
import {ItemViewIconClassResolver} from "../ItemViewIconClassResolver";

export class PartComponentViewer extends NamesAndIconViewer<PartComponent> {

        constructor() {
            super();
        }

        resolveDisplayName(object: PartComponent): string {
            return !!object.getName() ? object.getName().toString() : "";
        }

        resolveSubName(object: PartComponent, relativePath: boolean = false): string {
            return object.getPath().toString();
        }

        resolveIconClass(object: PartComponent): string {
            return ItemViewIconClassResolver.resolveByType("part");
        }
    }

