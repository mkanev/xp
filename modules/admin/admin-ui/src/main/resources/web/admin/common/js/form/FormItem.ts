import {Equitable} from "../Equitable";
import {ObjectHelper} from "../ObjectHelper";
import {FormItemTypeWrapperJson} from "./json/FormItemTypeWrapperJson";
import {FieldSet} from "./FieldSet";
import {FormItemPath} from "./FormItemPath";
import {FormItemPathElement} from "./FormItemPath";
import {FormItemSet} from "./FormItemSet";
import {Input} from "./Input";
import {Layout} from "./Layout";

export class FormItem implements Equitable {

        private name: string;

        private parent: FormItem;

        constructor(name: string) {
            this.name = name;
        }

        setParent(parent: FormItem) {
            if (!(ObjectHelper.iFrameSafeInstanceOf(parent, FormItemSet) || ObjectHelper.iFrameSafeInstanceOf(parent, FieldSet))) {
                throw new Error("A parent FormItem must either be a FormItemSet or a FieldSet");
            }

            this.parent = parent;
        }

        getName(): string {
            return this.name;
        }

        getPath(): FormItemPath {
            return this.resolvePath();
        }

        private resolvePath(): FormItemPath {
            return FormItemPath.fromParent(this.resolveParentPath(), FormItemPathElement.fromString(this.name));
        }

        private resolveParentPath(): FormItemPath {

            if (this.parent == null) {
                return FormItemPath.ROOT;
            }
            else {
                return this.parent.getPath();
            }
        }

        equals(o: Equitable): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, FormItem)) {
                return false;
            }

            var other = <FormItem>o;

            if (!ObjectHelper.stringEquals(this.name, other.name)) {
                return false;
            }

            return true;
        }

        public toFormItemJson(): FormItemTypeWrapperJson {

            if (ObjectHelper.iFrameSafeInstanceOf(this, Input)) {
                return (<Input>this).toInputJson();
            }
            else if (ObjectHelper.iFrameSafeInstanceOf(this, FormItemSet)) {
                return (<FormItemSet>this).toFormItemSetJson();
            }
            else if (ObjectHelper.iFrameSafeInstanceOf(this, Layout)) {
                return (<Layout>this).toLayoutJson();
            }
            else {
                throw new Error("Unsupported FormItem: " + this);
            }
        }

        public static formItemsToJson(formItems: FormItem[]): FormItemTypeWrapperJson[] {

            var formItemArray: FormItemTypeWrapperJson[] = [];
            formItems.forEach((formItem: FormItem) => {
                formItemArray.push(formItem.toFormItemJson());
            });
            return formItemArray;
        }
    }
