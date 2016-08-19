import {FormJson} from "./json/FormJson";
import {FormItemTypeWrapperJson} from "./json/FormItemTypeWrapperJson";
import {InputJson} from "./json/InputJson";
import {FormItemSetJson} from "./json/FormItemSetJson";
import {FieldSetJson} from "./json/FieldSetJson";
import {FieldSet} from "./FieldSet";
import {Form} from "./Form";
import {FormItem} from "./FormItem";
import {FormItemSet} from "./FormItemSet";
import {Input} from "./Input";

export class FormItemFactory {

        static createForm(formJson: FormJson): Form {
            return Form.fromJson(formJson);
        }

        static createFormItem(formItemTypeWrapperJson: FormItemTypeWrapperJson): FormItem {

            if (formItemTypeWrapperJson.Input) {
                return FormItemFactory.createInput(<InputJson>formItemTypeWrapperJson.Input);
            }
            else if (formItemTypeWrapperJson.FormItemSet) {
                return FormItemFactory.createFormItemSet(<FormItemSetJson>formItemTypeWrapperJson.FormItemSet);
            }
            else if (formItemTypeWrapperJson.FieldSet) {
                return FormItemFactory.createFieldSetLayout(<FieldSetJson>formItemTypeWrapperJson.FieldSet);
            }

            console.error("Unknown FormItem type: ", formItemTypeWrapperJson);
            return null;
        }

        static createInput(inputJson: InputJson): Input {
            return Input.fromJson(inputJson);
        }

        static createFormItemSet(formItemSetJson: FormItemSetJson): FormItemSet {
            return new FormItemSet(formItemSetJson);
        }

        static createFieldSetLayout(fieldSetJson: FieldSetJson): FieldSet {
            return new FieldSet(fieldSetJson);
        }
    }
