import {NamesAndIconViewer} from "../../ui/NamesAndIconViewer";
import {FragmentComponent} from "../../content/page/region/FragmentComponent";
import {ItemViewIconClassResolver} from "../ItemViewIconClassResolver";

export class FragmentComponentViewer extends NamesAndIconViewer<FragmentComponent> {

        constructor() {
            super();
        }

        resolveDisplayName(object: FragmentComponent): string {
            return !!object.getName() ? object.getName().toString() : "";
        }

        resolveSubName(object: FragmentComponent, relativePath: boolean = false): string {
            return object.getPath().toString();
        }

        resolveIconClass(object: FragmentComponent): string {
            return ItemViewIconClassResolver.resolveByType("fragment");
        }

    }

