import {FieldSet} from "../FieldSet";
import {FormItemSet} from "../FormItemSet";
import {Input} from "../Input";
import {FieldSetJson} from "./FieldSetJson";
import {FormItemSetJson} from "./FormItemSetJson";
import {InputJson} from "./InputJson";

export interface FormItemTypeWrapperJson {

        Input?: InputJson;

        FormItemSet?: FormItemSetJson;

        FieldSet?: FieldSetJson;
    }
