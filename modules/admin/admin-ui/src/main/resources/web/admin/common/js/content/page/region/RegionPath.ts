import {Equitable} from "../../../Equitable";
import {ObjectHelper} from "../../../ObjectHelper";
import {ComponentPath} from "./ComponentPath";

export class RegionPath implements Equitable {

        private static DIVIDER = "/";

        private parentComponentPath: ComponentPath;

        private regionName: string;

        private refString: string;

        constructor(parentComponentPath: ComponentPath, regionName: string) {

            this.parentComponentPath = parentComponentPath;
            this.regionName = regionName;
            if (parentComponentPath != null) {
                this.refString = parentComponentPath + "/" + regionName;
            }
            else {
                this.refString = regionName;
            }
        }

        public hasParentComponentPath(): boolean {

            return this.parentComponentPath != null;
        }

        public getParentComponentPath(): ComponentPath {
            return this.parentComponentPath;
        }

        public getRegionName(): string {
            return this.regionName;
        }

        public toString(): string {
            return this.refString;
        }

        equals(o: Equitable): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, RegionPath)) {
                return false;
            }

            var other = <RegionPath>o;

            if (!ObjectHelper.stringEquals(this.refString, other.refString)) {
                return false;
            }

            return true;
        }

        public static fromString(str: string): RegionPath {

            var lastDivider = str.lastIndexOf(RegionPath.DIVIDER);
            if (lastDivider == -1) {
                return new RegionPath(null, str);
            }

            var regionNameStart = lastDivider + 1;

            var regionName = str.substring(regionNameStart, str.length);
            var componentPathAsString = str.substring(0, regionNameStart);
            var parentPath = ComponentPath.fromString(componentPathAsString);
            return new RegionPath(parentPath, regionName);
        }
    }
