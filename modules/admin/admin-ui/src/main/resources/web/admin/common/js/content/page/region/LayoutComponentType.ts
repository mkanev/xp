import {ComponentType} from "./ComponentType";
import {LayoutComponentBuilder} from "./LayoutComponent";

export class LayoutComponentType extends ComponentType {

        private static INSTANCE = new LayoutComponentType();

        constructor() {
            super("layout");
        }

        newComponentBuilder(): LayoutComponentBuilder {
            return new LayoutComponentBuilder();
        }

        public static get(): LayoutComponentType {
            return LayoutComponentType.INSTANCE;
        }
    }

