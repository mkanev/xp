import {FormItemSetJson} from "./json/FormItemSetJson";
import {FormItemJson} from "./json/FormItemJson";
import {FormItemTypeWrapperJson} from "./json/FormItemTypeWrapperJson";
import {Equitable} from "../Equitable";
import {ObjectHelper} from "../ObjectHelper";
import {FormItem} from "./FormItem";
import {FormItemContainer} from "./FormItemContainer";
import {FormItemFactory} from "./FormItemFactory";
import {Input} from "./Input";
import {Occurrences} from "./Occurrences";

/**
     * A set of [[FormItem]]s.
     *
     * The form items are kept in the order they where inserted.
     */
    export class FormItemSet extends FormItem implements FormItemContainer {

        private label: string;

        private formItems: FormItem[] = [];

        private formItemByName: {[name: string]: FormItem; } = {};

        private immutable: boolean;

        private occurrences: Occurrences;

        private customText: string;

        private helpText: string;

        constructor(formItemSetJson: FormItemSetJson) {
            super(formItemSetJson.name);
            this.label = formItemSetJson.label;
            this.immutable = formItemSetJson.immutable;
            this.occurrences = Occurrences.fromJson(formItemSetJson.occurrences);
            this.customText = formItemSetJson.customText;
            this.helpText = formItemSetJson.helpText;

            if (formItemSetJson.items != null) {
                formItemSetJson.items.forEach((formItemJson: FormItemJson) => {
                    var formItem = FormItemFactory.createFormItem(formItemJson);
                    if (formItem) {
                        this.addFormItem(formItem);
                    }
                });
            }
        }

        addFormItem(formItem: FormItem) {
            if (this.formItemByName[name]) {
                throw new Error("FormItem already added: " + name);
            }
            formItem.setParent(this);
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

        getLabel(): string {
            return this.label;
        }

        isImmutable(): boolean {
            return this.immutable;
        }

        getCustomText(): string {
            return this.customText;
        }

        getHelpText(): string {
            return this.helpText;
        }

        getOccurrences(): Occurrences {
            return this.occurrences;
        }

        public toFormItemSetJson(): FormItemTypeWrapperJson {

            return <FormItemTypeWrapperJson>{FormItemSet: <FormItemSetJson>{
                name: this.getName(),
                customText: this.getCustomText(),
                helpText: this.getHelpText(),
                immutable: this.isImmutable(),
                items: FormItem.formItemsToJson(this.getFormItems()),
                label: this.getLabel(),
                occurrences: this.getOccurrences().toJson(),
            }};
        }

        equals(o: Equitable): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, FormItemSet)) {
                return false;
            }

            if (!super.equals(o)) {
                return false;
            }

            var other = <FormItemSet>o;

            if (!ObjectHelper.stringEquals(this.label, other.label)) {
                return false;
            }

            if (!ObjectHelper.booleanEquals(this.immutable, other.immutable)) {
                return false;
            }

            if (!ObjectHelper.equals(this.occurrences, other.occurrences)) {
                return false;
            }

            if (!ObjectHelper.stringEquals(this.customText, other.customText)) {
                return false;
            }

            if (!ObjectHelper.stringEquals(this.helpText, other.helpText)) {
                return false;
            }

            if (!ObjectHelper.arrayEquals(this.formItems, other.formItems)) {
                return false;
            }

            return true;
        }

    }
