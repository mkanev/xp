import {FormJson} from "./json/FormJson";
import {FormItemJson} from "./json/FormItemJson";
import {Equitable} from "../Equitable";
import {ObjectHelper} from "../ObjectHelper";
import {FieldSet} from "./FieldSet";
import {FormItem} from "./FormItem";
import {FormItemContainer} from "./FormItemContainer";
import {FormItemFactory} from "./FormItemFactory";
import {FormItemSet} from "./FormItemSet";
import {Input} from "./Input";
import {Layout} from "./Layout";

export class FormBuilder {

        formItems: FormItem[] = [];

        addFormItem(formItem: FormItem): FormBuilder {
            this.formItems.push(formItem);
            return this;
        }

        addFormItems(formItems: FormItem[]): FormBuilder {
            formItems.forEach((formItem: FormItem) => {
                this.addFormItem(formItem);
            });
            return this;
        }

        fromJson(json: FormJson): FormBuilder {
            json.formItems.forEach((formItemJson: FormItemJson) => {
                var formItem = FormItemFactory.createFormItem(formItemJson);
                if (formItem) {
                    this.addFormItem(formItem);
                }
            });
            return this;
        }

        build(): Form {
            return new Form(this);
        }
    }

    /**
     * A form consist of [[FormItem]]s.
     *
     * A [[FormItem]] can either be a [[Input]], [[FormItemSet]] or a [[FieldSet]]:
     * * A [[Input]] gives the user the possibility input one or more values.
     * * A [[FormItemSet]] groups a set of [[FormItem]]s, both visually and the data.
     * * A [[FieldSet]] is a [[Layout]] which only visually groups [[FormItem]]s.
     */
    export class Form implements Equitable, FormItemContainer {

        private formItems: FormItem[] = [];

        private formItemByName: {[name:string] : FormItem; } = {};

        static fromJson(json: FormJson) {
            var builder = new FormBuilder();
            builder.fromJson(json);
            return builder.build();
        }

        constructor(builder: FormBuilder) {
            builder.formItems.forEach((formItem: FormItem) => {
                this.addFormItem(formItem);
            });
        }

        addFormItem(formItem: FormItem) {
            if (this.formItemByName[name]) {
                throw new Error("FormItem already added: " + name);
            }
            this.formItemByName[formItem.getName()] = formItem;
            this.formItems.push(formItem);
        }

        getFormItems(): FormItem[] {
            return this.formItems;
        }

        getFormItemByName(name: string): FormItem {
            return this.formItemByName[name];
        }

        getInputByName(name: string): Input {
            return <Input>this.formItemByName[name];
        }

        toJson(): FormJson {

            return <FormJson>{
                formItems: FormItem.formItemsToJson(this.getFormItems())
            }
        }

        equals(o: Equitable): boolean {

            if (!(ObjectHelper.iFrameSafeInstanceOf(o, Form))) {
                return false;
            }

            var other = <Form>o;

            if (this.formItems.length != other.formItems.length) {
                return false;
            }

            for (var i = 0; i < this.formItems.length; i++) {
                if (!this.formItems[i].equals(other.formItems[i])) {
                    return false;
                }
            }

            return true;
        }
    }
