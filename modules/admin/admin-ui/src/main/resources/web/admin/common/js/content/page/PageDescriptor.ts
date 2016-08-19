import {RegionDescriptor} from "./region/RegionDescriptor";
import {Cloneable} from "../../Cloneable";
import {PageDescriptorJson} from "./PageDescriptorJson";
import {Form} from "../../form/Form";
import {RegionDescriptorBuilder} from "./region/RegionDescriptor";
import {Descriptor} from "./Descriptor";
import {DescriptorBuilder} from "./Descriptor";
import {DescriptorKey} from "./DescriptorKey";
import {DescriptorName} from "./DescriptorName";

export class PageDescriptor extends Descriptor implements Cloneable {

        private regions: RegionDescriptor[];

        constructor(builder: PageDescriptorBuilder) {
            super(builder);
            this.regions = builder.regions;
        }

        public getRegions(): RegionDescriptor[] {
            return this.regions;
        }

        public clone(): PageDescriptor {
            return new PageDescriptorBuilder(this).build();
        }
    }

    export class PageDescriptorBuilder extends DescriptorBuilder {

        regions: RegionDescriptor[];

        constructor(source?: PageDescriptor) {
            this.regions = [];
            if (source) {
                super(source);
                this.regions = source.getRegions();
            }
        }

        public fromJson(json: PageDescriptorJson): PageDescriptorBuilder {

            this.setName(new DescriptorName(json.name));
            this.setDisplayName(json.displayName);
            this.setConfig(json.config != null ? Form.fromJson(json.config) : null);
            this.setKey(DescriptorKey.fromString(json.key));
            for (var i = 0; i < json.regions.length; i++) {
                var region = new RegionDescriptorBuilder().fromJson(json.regions[i]).build();
                this.regions.push(region);
            }

            return this;
        }

        public setKey(key: DescriptorKey): PageDescriptorBuilder {
            this.key = key;
            return this;
        }

        public setName(value: DescriptorName): PageDescriptorBuilder {
            this.name = value;
            return this;
        }

        public setDisplayName(value: string): PageDescriptorBuilder {
            this.displayName = value;
            return this;
        }

        public setConfig(value: Form): PageDescriptorBuilder {
            this.config = value;
            return this;
        }

        public addRegion(value: RegionDescriptor): PageDescriptorBuilder {
            this.regions.push(value);
            return this;
        }

        public build(): PageDescriptor {
            return new PageDescriptor(this);
        }
    }
