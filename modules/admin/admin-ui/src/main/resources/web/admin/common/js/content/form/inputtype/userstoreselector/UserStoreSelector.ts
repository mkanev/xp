module api.content.form.inputtype.contentselector {

    import Property = api.data.Property;
    import PropertyArray = api.data.PropertyArray;
    import Value = api.data.Value;
    import ValueType = api.data.ValueType;
    import ValueTypes = api.data.ValueTypes;
    import GetRelationshipTypeByNameRequest = api.schema.relationshiptype.GetRelationshipTypeByNameRequest;
    import RelationshipTypeName = api.schema.relationshiptype.RelationshipTypeName;

    export class UserStoreSelector extends api.form.inputtype.support.BaseInputTypeManagingAdd<api.security.UserStore> {

        private context: api.content.form.inputtype.ContentInputTypeViewContext;

        private comboBox: api.ui.security.UserStoreComboBox;

        private comboboxLoaded = false;

        private userStoreKey: string;

        constructor(config?: api.content.form.inputtype.ContentInputTypeViewContext) {
            super("userstore-selector");
            this.addClass("input-type-view");
            this.context = config;
        }

        getValueType(): ValueType {
            return ValueTypes.STRING;
        }

        newInitialValue(): Value {
            return null;
        }

        layout(input: api.form.Input, propertyArray: PropertyArray): wemQ.Promise<void> {
            super.layout(input, propertyArray);

            this.userStoreKey = this.getValueFromPropertyArray(propertyArray);
            this.createComboBox(input);
            return wemQ<void>(null);
        }

        private createComboBox(input: api.form.Input) {
            this.comboBox = new api.ui.security.UserStoreComboBox(input.getOccurrences().getMaximum());
            var appComboboxLoadingListener = () => {
                this.comboBox.unLoaded(appComboboxLoadingListener);
                this.comboboxLoaded = true;
                this.selectUserStore();

                this.comboBox.onOptionSelected((selectedOption: api.ui.selector.combobox.SelectedOption<api.security.UserStore>) => {
                    var value = ValueTypes.STRING.newValue(selectedOption.getOption().displayValue.getKey().getId())
                    if (this.comboBox.countSelected() == 1) { // overwrite initial value
                        this.getPropertyArray().set(0, value);
                    }
                    else if (!this.getPropertyArray().containsValue(value)) {
                        this.getPropertyArray().add(value);
                    }
                    this.validate(false);
                });

                this.comboBox.onOptionDeselected((removed: api.ui.selector.combobox.SelectedOption<api.security.UserStore>) => {
                    this.getPropertyArray().remove(removed.getIndex());
                    this.validate(false);
                });

                this.appendChild(this.comboBox);
                this.setLayoutInProgress(false);
            };
            this.comboBox.onLoaded(appComboboxLoadingListener);
            this.comboBox.getLoader().load();
        }

        private selectUserStore(): void {
            if (this.comboBox && this.userStoreKey) {
                this.comboBox.getDisplayValues().
                    filter((userStore: api.security.UserStore) => {
                        return this.userStoreKey === userStore.getKey().getId();
                    }).
                    forEach((selectedOption: api.security.UserStore) => {
                        this.comboBox.select(selectedOption);
                    });
            }
        }

        protected getNumberOfValids(): number {
            return this.comboBox.countSelected();
        }

        giveFocus(): boolean {
            if (this.comboBox.maximumOccurrencesReached()) {
                return false;
            }
            return this.comboBox.giveFocus();
        }

        onFocus(listener: (event: FocusEvent) => void) {
            this.comboBox.onFocus(listener);
        }

        unFocus(listener: (event: FocusEvent) => void) {
            this.comboBox.unFocus(listener);
        }

        onBlur(listener: (event: FocusEvent) => void) {
            this.comboBox.onBlur(listener);
        }

        unBlur(listener: (event: FocusEvent) => void) {
            this.comboBox.unBlur(listener);
        }

    }

    api.form.inputtype.InputTypeManager.register(new api.Class("UserStoreSelector", UserStoreSelector));
}