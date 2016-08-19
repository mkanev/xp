import {RegionPath} from "./RegionPath";
import {RegionsChangedEvent} from "./RegionsChangedEvent";

export class RegionRemovedEvent extends RegionsChangedEvent {

        private regionPath: RegionPath;

        constructor(regionPath: RegionPath) {
            super();
            this.regionPath = regionPath;
        }

        getRegionPath(): RegionPath {
            return this.regionPath;
        }
    }
