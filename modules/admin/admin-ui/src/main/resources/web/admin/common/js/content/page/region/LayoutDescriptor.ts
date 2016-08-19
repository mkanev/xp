import {Descriptor} from "../Descriptor";
import {Cloneable} from "../../../Cloneable";
import {DescriptorBuilder} from "../Descriptor";
import {DescriptorKey} from "../DescriptorKey";
import {DescriptorName} from "../DescriptorName";
import {Form} from "../../../form/Form";
import {LayoutDescriptorJson} from "./LayoutDescriptorJson";
import {RegionDescriptor} from "./RegionDescriptor";
import {RegionDescriptorBuilder} from "./RegionDescriptor";

export class LayoutDescriptor extends Descriptor implements Cloneable {
        private regions: RegionDescriptor[];

        constructor(builder: LayoutDescriptorBuilder) {
            super(builder);
            this.regions = builder.regions;
        }

        public getRegions(): RegionDescriptor[] {
            return this.regions;
        }

        public clone(): LayoutDescriptor {
            return new LayoutDescriptorBuilder(this).build();
        }
    }

    export class LayoutDescriptorBuilder extends DescriptorBuilder {

        regions: RegionDescriptor[] = [];

        constructor(source?: LayoutDescriptor) {
            super(source);
            if (source) {
                this.regions = source.getRegions();
            }
        }

        public fromJson(json: LayoutDescriptorJson): LayoutDescriptorBuilder {

            this.setKey(DescriptorKey.fromString(json.key));
            this.setName(new DescriptorName(json.name));
            this.setDisplayName(json.displayName);
            this.setConfig(json.config != null ? Form.fromJson(json.config) : null);
            for (var i = 0; i < json.regions.length; i++) {
                var region = new RegionDescriptorBuilder().fromJson(json.regions[i]).build();
                this.regions.push(region);
            }

            return this;
        }

        public setKey(value: DescriptorKey): LayoutDescriptorBuilder {
            this.key = value;
            return this;
        }

        public setName(value: DescriptorName): LayoutDescriptorBuilder {
            this.name = value;
            return this;
        }

        public setDisplayName(value: string): LayoutDescriptorBuilder {
            this.displayName = value;
            return this;
        }

        public setConfig(value: Form): LayoutDescriptorBuilder {
            this.config = value;
            return this;
        }

        public addRegion(value: RegionDescriptor): LayoutDescriptorBuilder {
            this.regions.push(value);
            return this;
        }

        public build(): LayoutDescriptor {
            return new LayoutDescriptor(this);
        }
    }
