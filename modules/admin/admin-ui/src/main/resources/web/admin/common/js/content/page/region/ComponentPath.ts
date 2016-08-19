import {Equitable} from "../../../Equitable";
import {ObjectHelper} from "../../../ObjectHelper";
import {StringHelper} from "../../../util/StringHelper";
import {assertNotNull} from "../../../util/Assert";
import {assert} from "../../../util/Assert";
import {RegionPath} from "./RegionPath";

export class ComponentPath implements Equitable {

        private static DIVIDER = "/";

        private regionAndComponentList: ComponentPathRegionAndComponent[];

        private refString: string;

        constructor(regionAndComponentList: ComponentPathRegionAndComponent[]) {

            this.regionAndComponentList = regionAndComponentList;

            this.refString = "";
            this.regionAndComponentList.forEach((regionAndComponent: ComponentPathRegionAndComponent, index: number) => {
                this.refString += regionAndComponent.toString();
                if (index < this.regionAndComponentList.length - 1) {
                    this.refString += ComponentPath.DIVIDER;
                }
            });
        }

        numberOfLevels(): number {
            return this.regionAndComponentList.length;
        }

        getFirstLevel(): ComponentPathRegionAndComponent {
            return this.regionAndComponentList[0];
        }

        getLastLevel(): ComponentPathRegionAndComponent {
            return this.regionAndComponentList[this.regionAndComponentList.length - 1];
        }

        getLevels(): ComponentPathRegionAndComponent [] {
            return this.regionAndComponentList;
        }

        getComponentIndex(): number {
            return this.getLastLevel().getComponentIndex();
        }

        getRegionPath(): RegionPath {

            var regionPathAsString = "";
            this.regionAndComponentList.forEach((regionAndComponent: ComponentPathRegionAndComponent, index: number) => {

                if (index == this.regionAndComponentList.length - 1) {
                    regionPathAsString += regionAndComponent.getRegionName();
                }
                else {
                    regionPathAsString += regionAndComponent.toString();
                    regionPathAsString += "/";
                }

            });

            return RegionPath.fromString(regionPathAsString);
        }

        public removeFirstLevel(): ComponentPath {
            if (this.numberOfLevels() <= 1) {
                return null;
            }

            var newRegionAndComponentList: ComponentPathRegionAndComponent[] = [];
            for (var i = 1; i < this.regionAndComponentList.length; i++) {
                newRegionAndComponentList.push(this.regionAndComponentList[i]);
            }
            return new ComponentPath(newRegionAndComponentList);
        }

        public toString(): string {
            return this.refString;
        }

        equals(o: Equitable): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, ComponentPath)) {
                return false;
            }

            var other = <ComponentPath>o;

            if (!ObjectHelper.stringEquals(this.refString, other.refString)) {
                return false;
            }

            return true;
        }

        public static fromString(str: string): ComponentPath {

            if (!str) {
                return null;
            }

            var elements: string[] = StringHelper.removeEmptyStrings(str.split(ComponentPath.DIVIDER));

            var regionAndComponentList: ComponentPathRegionAndComponent[] = [];
            for (var i = 0; i < elements.length - 1; i += 2) {
                var regionName = elements[i];
                var componentIndexAsString = elements[i + 1];
                var regionAndComponent = new ComponentPathRegionAndComponent(regionName, parseInt(componentIndexAsString));
                regionAndComponentList.push(regionAndComponent);
            }

            return new ComponentPath(regionAndComponentList);
        }

        public static fromRegionPathAndComponentIndex(regionPath: RegionPath, componentIndex: number): ComponentPath {
            assertNotNull(regionPath, "regionPath cannot be null");
            assert(componentIndex >= 0, "componentIndex must be zero or more");

            var regionAndComponentList: ComponentPathRegionAndComponent[] = [];
            if (regionPath.getParentComponentPath()) {
                regionPath.getParentComponentPath().regionAndComponentList.forEach((regionAndComponent: ComponentPathRegionAndComponent)=> {
                    regionAndComponentList.push(regionAndComponent);
                });
            }
            regionAndComponentList.push(new ComponentPathRegionAndComponent(regionPath.getRegionName(), componentIndex));
            return new ComponentPath(regionAndComponentList);
        }
    }

    export class ComponentPathRegionAndComponent {

        private static DIVIDER = "/";

        private regionName: string;

        private componentIndex: number;

        private refString: string;

        constructor(regionName: string, componentIndex: number) {
            this.regionName = regionName;
            this.componentIndex = componentIndex;
            this.refString = regionName + ComponentPathRegionAndComponent.DIVIDER + this.componentIndex;
        }

        getRegionName(): string {
            return this.regionName;
        }

        getComponentIndex(): number {
            return this.componentIndex;
        }

        toString(): string {
            return this.refString;
        }
    }
