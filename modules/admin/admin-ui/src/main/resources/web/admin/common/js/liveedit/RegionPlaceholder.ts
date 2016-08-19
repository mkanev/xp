import {Region} from "../content/page/region/Region";
import {PEl} from "../dom/PEl";
import {ItemViewPlaceholder} from "./ItemViewPlaceholder";

export class RegionPlaceholder extends ItemViewPlaceholder {

        private region: Region;

        constructor(region: Region) {
            super();
            this.addClassEx("region-placeholder");

            this.region = region;

            var dragComponentsHereEl = new PEl();
            dragComponentsHereEl.setHtml("Drop here");

            this.appendChild(dragComponentsHereEl);
        }
    }
