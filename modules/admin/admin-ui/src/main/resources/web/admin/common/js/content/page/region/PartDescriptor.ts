import {Descriptor} from "../Descriptor";
import {Cloneable} from "../../../Cloneable";
import {DescriptorBuilder} from "../Descriptor";
import {DescriptorKey} from "../DescriptorKey";
import {DescriptorName} from "../DescriptorName";
import {Form} from "../../../form/Form";
import {PartDescriptorJson} from "./PartDescriptorJson";

export class PartDescriptor extends Descriptor implements Cloneable {

        public clone(): PartDescriptor {
            return new PartDescriptorBuilder(this).build();
        }
    }

    export class PartDescriptorBuilder extends DescriptorBuilder {

        constructor(source?: PartDescriptor) {
            super(source);
        }

        public fromJson(json: PartDescriptorJson): PartDescriptorBuilder {

            this.setKey(DescriptorKey.fromString(json.key));
            this.setName(new DescriptorName(json.name));
            this.setDisplayName(json.displayName);
            this.setConfig(json.config != null ? Form.fromJson(json.config) : null);
            return this;
        }

        public setKey(value: DescriptorKey): PartDescriptorBuilder {
            this.key = value;
            return this;
        }

        public setName(value: DescriptorName): PartDescriptorBuilder {
            this.name = value;
            return this;
        }

        public setDisplayName(value: string): PartDescriptorBuilder {
            this.displayName = value;
            return this;
        }

        public setConfig(value: Form): PartDescriptorBuilder {
            this.config = value;
            return this;
        }

        public build(): PartDescriptor {
            return new PartDescriptor(this);
        }
    }
