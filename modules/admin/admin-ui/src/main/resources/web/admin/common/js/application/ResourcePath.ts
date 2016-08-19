import {BasePath} from "../util/BasePath";

export class ResourcePath extends BasePath<ResourcePath> {

        private static ELEMENT_DIVIDER:string = "/";

        public static fromString(s:string) {
            var absolute:boolean = s.charAt(0) == ResourcePath.ELEMENT_DIVIDER;
            var elements:string[] = s.split(ResourcePath.ELEMENT_DIVIDER);
            return new ResourcePath(BasePath.removeEmptyElements(elements), absolute);
        }

        constructor(elements:string[], absolute?:boolean) {
            super(elements, ResourcePath.ELEMENT_DIVIDER, absolute);
        }

        newInstance(elements:string[], absolute:boolean):ResourcePath {
            return new ResourcePath(elements, absolute);
        }
    }
