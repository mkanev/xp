import {Form} from "../form/Form";
import {MixinNames} from "../schema/mixin/MixinNames";
import {Equitable} from "../Equitable";
import {SiteDescriptorJson} from "./json/SiteDescriptorJson";
import {ObjectHelper} from "../ObjectHelper";

export class SiteDescriptor implements Equitable {

        private form: Form;
        private metaSteps: MixinNames;

        constructor(form: Form, mixinNames: MixinNames) {
            this.form = form;
            this.metaSteps = mixinNames;
        }

        public getForm(): Form {
            return this.form;
        }

        public getMetaSteps(): MixinNames {
            return this.metaSteps;
        }

        static fromJson(json: SiteDescriptorJson): SiteDescriptor {

            return new SiteDescriptor(Form.fromJson(json.form),
                MixinNames.create().fromStrings(json.metaSteps).build());
        }

        public equals(o: Equitable): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, SiteDescriptor)) {
                return false;
            }

            var other = <SiteDescriptor>o;

            if (!ObjectHelper.equals(this.form, other.form)) {
                return false;
            }

            if (!ObjectHelper.equals(this.metaSteps, other.metaSteps)) {
                return false;
            }

            return true;
        }
    }

