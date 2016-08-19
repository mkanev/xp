import {PropertyTree} from "../../../data/PropertyTree";
import {PropertyEvent} from "../../../data/PropertyEvent";
import {Equitable} from "../../../Equitable";
import {Cloneable} from "../../../Cloneable";
import {ObjectHelper} from "../../../ObjectHelper";
import {Descriptor} from "../Descriptor";
import {DescriptorKey} from "../DescriptorKey";
import {Component} from "./Component";
import {ComponentBuilder} from "./Component";
import {ComponentName} from "./ComponentName";
import {DescriptorBasedComponentJson} from "./DescriptorBasedComponentJson";

export class DescriptorBasedComponent extends Component implements Equitable, Cloneable {

        public static debug: boolean = false;

        public static PROPERTY_DESCRIPTOR = 'descriptor';

        public static PROPERTY_CONFIG = 'config';

        private disableEventForwarding: boolean;

        private descriptor: DescriptorKey;

        private config: PropertyTree;

        private configChangedHandler: (event: PropertyEvent) => void;

        constructor(builder: DescriptorBasedComponentBuilder<any>) {

            super(builder);

            this.descriptor = builder.descriptor;
            this.config = builder.config;

            this.configChangedHandler = (event: PropertyEvent) => {
                if (DescriptorBasedComponent.debug) {
                    console.debug("DescriptorBasedComponent[" + this.getPath().toString() + "].config.onChanged: ", event);
                }
                if (!this.disableEventForwarding) {
                    this.notifyPropertyValueChanged(DescriptorBasedComponent.PROPERTY_CONFIG);
                }
            };

            this.config.onChanged(this.configChangedHandler);
        }

        setDisableEventForwarding(value: boolean) {
            this.disableEventForwarding = value;
        }

        hasDescriptor(): boolean {
            return !!this.descriptor;
        }

        getDescriptor(): DescriptorKey {
            return this.descriptor;
        }

        setDescriptor(descriptorKey: DescriptorKey, descriptor: Descriptor) {

            var oldValue = this.descriptor;
            this.descriptor = descriptorKey;

            this.setName(descriptor ? new ComponentName(descriptor.getDisplayName()) : this.getType().getDefaultName());

            if (!ObjectHelper.equals(oldValue, descriptorKey)) {
                this.notifyPropertyChanged(DescriptorBasedComponent.PROPERTY_DESCRIPTOR);
            }

            this.setConfig(new PropertyTree());
        }

        setConfig(config: PropertyTree) {
            var oldValue = this.config;
            if (oldValue) {
                this.config.unChanged(this.configChangedHandler);
            }
            this.config = config;
            this.config.onChanged(this.configChangedHandler);

            if (!ObjectHelper.equals(oldValue, config)) {
                this.notifyPropertyChanged(DescriptorBasedComponent.PROPERTY_CONFIG);
            }
        }

        getConfig(): PropertyTree {
            return this.config;
        }

        doReset() {
            this.setDescriptor(null, null);
        }

        toComponentJson(): DescriptorBasedComponentJson {

            return <DescriptorBasedComponentJson>{
                "name": this.getName() ? this.getName().toString() : null,
                "descriptor": this.descriptor != null ? this.descriptor.toString() : null,
                "config": this.config != null ? this.config.toJson() : null
            };
        }

        equals(o: Equitable): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, DescriptorBasedComponent)) {
                return false;
            }

            if (!super.equals(o)) {
                return false;
            }
            var other = <DescriptorBasedComponent>o;

            if (!ObjectHelper.equals(this.descriptor, other.descriptor)) {
                return false;
            }

            if (!ObjectHelper.equals(this.config, other.config)) {
                return false;
            }

            return true;
        }

        clone(): DescriptorBasedComponent {
            throw new Error("Must be implemented by inheritors");
        }
    }

    export class DescriptorBasedComponentBuilder<DESCRIPTOR_BASED_COMPONENT extends DescriptorBasedComponent> extends ComponentBuilder<DESCRIPTOR_BASED_COMPONENT> {

        descriptor: DescriptorKey;

        config: PropertyTree;

        constructor(source?: DescriptorBasedComponent) {
            super(source);
            if (source) {
                this.descriptor = source.getDescriptor();
                this.config = source.getConfig() ? source.getConfig().copy() : null;
            }
            else {
                this.config = new PropertyTree();
            }
        }

        public setDescriptor(value: DescriptorKey): ComponentBuilder<DESCRIPTOR_BASED_COMPONENT> {
            this.descriptor = value;
            return this;
        }

        public setConfig(value: PropertyTree): ComponentBuilder<DESCRIPTOR_BASED_COMPONENT> {
            this.config = value;
            return this;
        }


        public build(): DESCRIPTOR_BASED_COMPONENT {
            throw new Error("Must be implemented by inheritor");
        }
    }
