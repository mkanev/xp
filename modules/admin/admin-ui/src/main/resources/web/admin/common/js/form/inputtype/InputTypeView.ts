import {Property} from "../../data/Property";
import {PropertyArray} from "../../data/PropertyArray";
import {Value} from "../../data/Value";
import {ValueType} from "../../data/ValueType";
import {Element} from "../../dom/Element";
import {Input} from "../Input";
import {ContentSummary} from "../../content/ContentSummary";
import {InputValidationRecording} from "./InputValidationRecording";
import {InputValidityChangedEvent} from "./InputValidityChangedEvent";
import {InputValueChangedEvent} from "./InputValueChangedEvent";

export interface InputTypeView<RAW_VALUE_TYPE> {

        getValueType(): ValueType;

        getElement(): Element;

        layout(input: Input, propertyArray: PropertyArray) : wemQ.Promise<void>;

        update(propertyArray: PropertyArray, unchangedOnly?: boolean): wemQ.Promise<void>;

        newInitialValue(): Value;

        /*
         * Whether the InputTypeView it self is managing adding new occurrences or not.
         * If false, then this is expected to implement interface InputTypeViewNotManagingOccurrences.
         */
        isManagingAdd():boolean;

        /*
         * Invoked when input wants to edit embedded content
         */
        onEditContentRequest(listener: (content: ContentSummary) => void);

        /*
         * Invoked when input wants to edit embedded content
         */
        unEditContentRequest(listener: (content: ContentSummary) => void);

        /*
         * Returns true if focus was successfully given.
         */
        giveFocus(): boolean;

        displayValidationErrors(value: boolean);

        hasValidUserInput() : boolean;

        validate(silent: boolean) : InputValidationRecording;

        onValidityChanged(listener: (event: InputValidityChangedEvent)=>void);

        unValidityChanged(listener: (event: InputValidityChangedEvent)=>void);

        onValueChanged(listener: (event: InputValueChangedEvent)=>void);

        unValueChanged(listener: (event: InputValueChangedEvent)=>void);

        availableSizeChanged();

        onFocus(listener: (event: FocusEvent) => void);

        unFocus(listener: (event: FocusEvent) => void);

        onBlur(listener: (event: FocusEvent) => void);

        unBlur(listener: (event: FocusEvent) => void);

    }
