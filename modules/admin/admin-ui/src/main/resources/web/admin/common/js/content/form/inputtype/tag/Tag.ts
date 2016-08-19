import {PropertyPath} from "../../../../data/PropertyPath";
import {PropertyPathElement} from "../../../../data/PropertyPath";
import {Property} from "../../../../data/Property";
import {PropertyArray} from "../../../../data/PropertyArray";
import {Value} from "../../../../data/Value";
import {ValueType} from "../../../../data/ValueType";
import {ValueTypes} from "../../../../data/ValueTypes";
import {BaseInputTypeManagingAdd} from "../../../../form/inputtype/support/BaseInputTypeManagingAdd";
import {ContentInputTypeViewContext} from "../ContentInputTypeViewContext";
import {Tags} from "../../../../ui/tags/Tags";
import {Input} from "../../../../form/Input";
import {TagsBuilder} from "../../../../ui/tags/Tags";
import {TagAddedEvent} from "../../../../ui/tags/TagAddedEvent";
import {TagRemovedEvent} from "../../../../ui/tags/TagRemovedEvent";
import {InputTypeManager} from "../../../../form/inputtype/InputTypeManager";
import {Class} from "../../../../Class";
import {ContentTagSuggesterBuilder} from "./ContentTagSuggester";
import {ContentTagSuggester} from "./ContentTagSuggester";

export class Tag extends BaseInputTypeManagingAdd<string> {

        private context: ContentInputTypeViewContext;

        private tags: Tags;

        private tagSuggester: ContentTagSuggester;

        constructor(context: ContentInputTypeViewContext) {
            super("tag");
            this.addClass("input-type-view");

            this.context = context;

            this.tagSuggester = new ContentTagSuggesterBuilder().
                setDataPath(this.resolveDataPath(context)).
                build();
        }

        private resolveDataPath(context: ContentInputTypeViewContext): PropertyPath {
            if (context.parentDataPath) {
                return PropertyPath.fromParent(context.parentDataPath, PropertyPathElement.fromString(context.input.getName()));
            }
            else {
                return new PropertyPath([PropertyPathElement.fromString(context.input.getName())], false);
            }
        }

        availableSizeChanged() {

        }

        getValueType(): ValueType {
            return ValueTypes.STRING;
        }

        newInitialValue(): Value {
            return null;
        }

        layout(input: Input, propertyArray: PropertyArray): wemQ.Promise<void> {
            if (!ValueTypes.STRING.equals(propertyArray.getType())) {
                propertyArray.convertValues(ValueTypes.STRING);
            }
            super.layout(input, propertyArray);

            var tagsBuilder = new TagsBuilder().
                setTagSuggester(this.tagSuggester).
                setMaxTags(this.context.input.getOccurrences().getMaximum());

            propertyArray.forEach((property) => {
                var value = property.getString();
                if (value) {
                    tagsBuilder.addTag(value);
                }
            });

            this.tags = tagsBuilder.build();
            this.appendChild(this.tags);

            this.tags.onTagAdded((event: TagAddedEvent) => {
                this.ignorePropertyChange = true;
                var value = new Value(event.getValue(), ValueTypes.STRING);
                if (this.tags.countTags() == 1) {
                    this.getPropertyArray().set(0, value);
                }
                else {
                    this.getPropertyArray().add(value);
                }
                this.validate(false);
                this.ignorePropertyChange = false;
            });

            this.tags.onTagRemoved((event: TagRemovedEvent) => {
                this.ignorePropertyChange = true;
                this.getPropertyArray().remove(event.getIndex());
                this.validate(false);
                this.ignorePropertyChange = false;
            });

            this.setLayoutInProgress(false);

            return wemQ<void>(null);
        }


        update(propertyArray: PropertyArray, unchangedOnly?: boolean): Q.Promise<void> {
            var superPromise = super.update(propertyArray, unchangedOnly);

            if (!unchangedOnly || !this.tags.isDirty()) {
                superPromise.then(() => {
                    this.tags.setValue(this.getValueFromPropertyArray(propertyArray));
                });
            } else {
                return superPromise;
            }
        }

        protected getNumberOfValids(): number {
            return this.getPropertyArray().getSize();
        }

        giveFocus(): boolean {
            return this.tags.giveFocus();
        }

        onFocus(listener: (event: FocusEvent) => void) {
            this.tags.onFocus(listener);
        }

        unFocus(listener: (event: FocusEvent) => void) {
            this.tags.unFocus(listener);
        }

        onBlur(listener: (event: FocusEvent) => void) {
            this.tags.onBlur(listener);
        }

        unBlur(listener: (event: FocusEvent) => void) {
            this.tags.unBlur(listener);
        }
    }

    InputTypeManager.register(new Class("Tag", Tag));
