import {PropertyPath} from "../data/PropertyPath";
import {PropertyArray} from "../data/PropertyArray";
import {InputTypeViewContext} from "./inputtype/InputTypeViewContext";
import {Input} from "./Input";

export class FormContext {

        private showEmptyFormItemSetOccurrences: boolean;

        constructor(builder: FormContextBuilder) {
            this.showEmptyFormItemSetOccurrences = builder.showEmptyFormItemSetOccurrences;
        }

        getShowEmptyFormItemSetOccurrences(): boolean {
            return this.showEmptyFormItemSetOccurrences;
        }

        setShowEmptyFormItemSetOccurrences(value: boolean) {
            this.showEmptyFormItemSetOccurrences = value;
        }

        static create(): FormContextBuilder {
            return new FormContextBuilder();
        }

        createInputTypeViewContext(inputTypeConfig: any, parentPropertyPath: PropertyPath,
                                   input: Input): InputTypeViewContext {

            return <InputTypeViewContext> {
                formContext: this,
                input: input,
                inputConfig: inputTypeConfig,
                parentDataPath: parentPropertyPath
            };
        }
    }

    export class FormContextBuilder {

        showEmptyFormItemSetOccurrences: boolean;

        public setShowEmptyFormItemSetOccurrences(value: boolean): FormContextBuilder {
            this.showEmptyFormItemSetOccurrences = value;
            return this;
        }

        public build(): FormContext {
            return new FormContext(this);
        }
    }
