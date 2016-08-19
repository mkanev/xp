import {ComponentType} from "./ComponentType";
import {FragmentComponentBuilder} from "./FragmentComponent";

export class FragmentComponentType extends ComponentType {

        private static INSTANCE = new FragmentComponentType();

        constructor() {
            super("fragment");
        }

        newComponentBuilder(): FragmentComponentBuilder {
            return new FragmentComponentBuilder();
        }

        public static get(): FragmentComponentType {
            return FragmentComponentType.INSTANCE;
        }
    }

