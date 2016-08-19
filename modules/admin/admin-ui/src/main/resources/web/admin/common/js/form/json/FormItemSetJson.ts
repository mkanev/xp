import {FormItemJson} from "./FormItemJson";
import {FormItemTypeWrapperJson} from "./FormItemTypeWrapperJson";
import {OccurrencesJson} from "./OccurrencesJson";

export interface FormItemSetJson extends FormItemJson {

        customText: string;

        helpText: string;

        immutable: boolean;

        items: FormItemTypeWrapperJson[];

        label: string;

        occurrences: OccurrencesJson;
    }
