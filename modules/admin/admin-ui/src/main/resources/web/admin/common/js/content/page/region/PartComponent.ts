import {PropertyTree} from "../../../data/PropertyTree";
import {Equitable} from "../../../Equitable";
import {Cloneable} from "../../../Cloneable";
import {ObjectHelper} from "../../../ObjectHelper";
import {DescriptorKey} from "../DescriptorKey";
import {ComponentName} from "./ComponentName";
import {ComponentTypeWrapperJson} from "./ComponentTypeWrapperJson";
import {DescriptorBasedComponent} from "./DescriptorBasedComponent";
import {DescriptorBasedComponentBuilder} from "./DescriptorBasedComponent";
import {PartComponentJson} from "./PartComponentJson";
import {PartComponentType} from "./PartComponentType";
import {Region} from "./Region";

export class PartComponent extends DescriptorBasedComponent implements Equitable, Cloneable {

        constructor(builder: PartComponentBuilder) {
            super(builder);
        }

        toJson(): ComponentTypeWrapperJson {
            var json: PartComponentJson = <PartComponentJson>super.toComponentJson();

            return <ComponentTypeWrapperJson> {
                PartComponent: json
            };
        }

        isEmpty(): boolean {
            return !this.hasDescriptor();
        }

        equals(o: Equitable): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, PartComponent)) {
                return false;
            }

            return super.equals(o);
        }

        clone(): PartComponent {
            return new PartComponentBuilder(this).build();
        }
    }

    export class PartComponentBuilder extends DescriptorBasedComponentBuilder<PartComponent> {

        constructor(source?: PartComponent) {

            super(source);

            this.setType(PartComponentType.get());
        }

        public fromJson(json: PartComponentJson, region: Region): PartComponentBuilder {

            if (json.descriptor) {
                this.setDescriptor(DescriptorKey.fromString(json.descriptor));
            }
            this.setName(json.name ? new ComponentName(json.name) : null);
            if (json.config) {
                this.setConfig(PropertyTree.fromJson(json.config));
            }
            this.setParent(region);
            return this;
        }

        public build(): PartComponent {
            return new PartComponent(this);
        }
    }
