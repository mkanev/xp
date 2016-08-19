import {ContentInputTypeViewContext} from "../../../content/form/inputtype/ContentInputTypeViewContext";
import {InputValidationRecording} from "../../../form/inputtype/InputValidationRecording";
import {InputValidityChangedEvent} from "../../../form/inputtype/InputValidityChangedEvent";
import {InputValueChangedEvent as ValueChangedEvent} from "../../../form/inputtype/InputValueChangedEvent";
import {Property} from "../../../data/Property";
import {PropertyArray} from "../../../data/PropertyArray";
import {Value} from "../../../data/Value";
import {ValueType} from "../../../data/ValueType";
import {ValueTypes} from "../../../data/ValueTypes";
import {Input} from "../../../form/Input";
import {ContentTypeComboBox} from "../ContentTypeComboBox";
import {ContentTypeSummary} from "../ContentTypeSummary";
import {SelectedOption} from "../../../ui/selector/combobox/SelectedOption";
import {ApplicationKey} from "../../../application/ApplicationKey";
import {SelectedOptionEvent} from "../../../ui/selector/combobox/SelectedOptionEvent";
import {FocusSwitchEvent} from "../../../ui/FocusSwitchEvent";
import {BaseInputTypeManagingAdd} from "../../../form/inputtype/support/BaseInputTypeManagingAdd";
import {PageTemplateContentTypeLoader} from "../PageTemplateContentTypeLoader";
import {ContentTypeSummaryByDisplayNameComparator} from "../ContentTypeSummaryByDisplayNameComparator";
import {InputTypeManager} from "../../../form/inputtype/InputTypeManager";
import {Class} from "../../../Class";
import {ValueChangedEvent} from "../../../ValueChangedEvent";

export class ContentTypeFilter extends BaseInputTypeManagingAdd<string> {

        private combobox: ContentTypeComboBox;

        private context: ContentInputTypeViewContext;

        private onContentTypesLoadedHandler: (contentTypeArray: ContentTypeSummary[]) => void;

        constructor(context: ContentInputTypeViewContext) {
            super('content-type-filter');
            this.context = context;
            this.onContentTypesLoadedHandler = this.onContentTypesLoaded.bind(this);
        }

        getValueType(): ValueType {
            return ValueTypes.STRING;
        }

        newInitialValue(): Value {
            return null;
        }

        private createPageTemplateLoader(): PageTemplateContentTypeLoader {
            var contentId = this.context.site.getContentId(),
                loader = new PageTemplateContentTypeLoader(contentId);

            loader.setComparator(new ContentTypeSummaryByDisplayNameComparator());

            return loader;
        }

        private createComboBox(): ContentTypeComboBox {
            var loader = this.context.formContext.getContentTypeName().isPageTemplate() ? this.createPageTemplateLoader() : null,
                comboBox = new ContentTypeComboBox(this.getInput().getOccurrences().getMaximum(), loader);

            comboBox.onLoaded(this.onContentTypesLoadedHandler);

            comboBox.onOptionSelected((event: SelectedOptionEvent<ContentTypeSummary>) => {
                this.fireFocusSwitchEvent(event);
                this.onContentTypeSelected(event.getSelectedOption());
            });

            comboBox.onOptionDeselected((event: SelectedOptionEvent<ContentTypeSummary>) =>
                this.onContentTypeDeselected(event.getSelectedOption()));

            return comboBox;
        }

        private onContentTypesLoaded(): void {

            this.combobox.getComboBox().setValue(this.getValueFromPropertyArray(this.getPropertyArray()));

            this.setLayoutInProgress(false);
            this.combobox.unLoaded(this.onContentTypesLoadedHandler);
        }

        private onContentTypeSelected(selectedOption: SelectedOption<ContentTypeSummary>): void {
            if (this.isLayoutInProgress()) {
                return;
            }
            this.ignorePropertyChange = true;
            var value = new Value(selectedOption.getOption().displayValue.getContentTypeName().toString(), ValueTypes.STRING);
            if (this.combobox.countSelected() == 1) { // overwrite initial value
                this.getPropertyArray().set(0, value);
            }
            else {
                this.getPropertyArray().add(value);
            }

            this.validate(false);
            this.ignorePropertyChange = false;
        }

        private onContentTypeDeselected(option: SelectedOption<ContentTypeSummary>): void {
            this.ignorePropertyChange = true;
            this.getPropertyArray().remove(option.getIndex());
            this.validate(false);
            this.ignorePropertyChange = false;
        }

        layout(input: Input, propertyArray: PropertyArray): wemQ.Promise<void> {
            if (!ValueTypes.STRING.equals(propertyArray.getType())) {
                propertyArray.convertValues(ValueTypes.STRING);
            }
            super.layout(input, propertyArray);

            this.appendChild(this.combobox = this.createComboBox());

            return this.combobox.getLoader().load().then(() => {
                this.validate(false);
                return wemQ<void>(null);
            });
        }


        update(propertyArray: PropertyArray, unchangedOnly: boolean): Q.Promise<void> {
            var superPromise = super.update(propertyArray, unchangedOnly);

            if (!unchangedOnly || !this.combobox.isDirty()) {
                return superPromise.then(() => {

                    return this.combobox.getLoader().load().then(this.onContentTypesLoadedHandler);
                });
            } else {
                return superPromise;
            }
        }

        private getValues(): Value[] {
            return this.combobox.getSelectedDisplayValues().map((contentType: ContentTypeSummary) => {
                return new Value(contentType.getContentTypeName().toString(), ValueTypes.STRING);
            });
        }

        protected getNumberOfValids(): number {
            return this.getValues().length;
        }

        giveFocus(): boolean {
            return this.combobox.maximumOccurrencesReached() ? false : this.combobox.giveFocus();
        }

        onFocus(listener: (event: FocusEvent) => void) {
            this.combobox.onFocus(listener);
        }

        unFocus(listener: (event: FocusEvent) => void) {
            this.combobox.unFocus(listener);
        }

        onBlur(listener: (event: FocusEvent) => void) {
            this.combobox.onBlur(listener);
        }

        unBlur(listener: (event: FocusEvent) => void) {
            this.combobox.unBlur(listener);
        }
    }

    InputTypeManager.register(new Class("ContentTypeFilter", ContentTypeFilter));

