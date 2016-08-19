import {NamesAndIconViewer} from "../ui/NamesAndIconViewer";
import {Region} from "../content/page/region/Region";
import {ItemViewIconClassResolver} from "./ItemViewIconClassResolver";

export class RegionComponentViewer extends NamesAndIconViewer<Region> {

        constructor() {
            super();
        }

        resolveDisplayName(object: Region): string {
            return object.getName().toString();
        }

        resolveSubName(object: Region, relativePath: boolean = false): string {
            return object.getPath().toString();
        }

        resolveIconClass(object: Region): string {
            return ItemViewIconClassResolver.resolveByType("region");
        }
    }

