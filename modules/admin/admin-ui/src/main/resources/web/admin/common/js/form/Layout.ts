import {FormItemTypeWrapperJson} from "./json/FormItemTypeWrapperJson";
import {ObjectHelper} from "../ObjectHelper";
import {Equitable} from "../Equitable";
import {FieldSet} from "./FieldSet";
import {FormItem} from "./FormItem";

export class Layout extends FormItem {

        constructor(name: string) {
            super(name);
        }

        public toLayoutJson(): FormItemTypeWrapperJson {

            if (ObjectHelper.iFrameSafeInstanceOf(this, FieldSet)) {
                return (<FieldSet>this).toFieldSetJson();
            }
            else {
                throw new Error("Unsupported Layout: " + this);
            }
        }

        equals(o: Equitable): boolean {

            if (!(ObjectHelper.iFrameSafeInstanceOf(o, Layout))) {
                return false;
            }

            return super.equals(o);
        }
    }
