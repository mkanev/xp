import {UserStoreAccessControlList} from "../../../../../common/js/security/acl/UserStoreAccessControlList";
import {UserStoreAccessControlComboBox} from "../../../../../common/js/ui/security/acl/UserStoreAccessControlComboBox";
import {Content} from "../../../../../common/js/content/Content";
import {UserStore} from "../../../../../common/js/security/UserStore";
import {FormItemBuilder} from "../../../../../common/js/ui/form/FormItem";
import {Validators} from "../../../../../common/js/ui/form/Validators";
import {DivEl} from "../../../../../common/js/dom/DivEl";
import {LabelEl} from "../../../../../common/js/dom/LabelEl";
import {WizardStepForm} from "../../../../../common/js/app/wizard/WizardStepForm";
import {Fieldset} from "../../../../../common/js/ui/form/Fieldset";
import {Form} from "../../../../../common/js/ui/form/Form";

export class SecurityWizardStepForm extends WizardStepForm {

    private inheritance: DivEl;
    private comboBox: UserStoreAccessControlComboBox;
    private userStore: UserStore;

    private content: Content;

    constructor() {
        super("security-wizard-step-form");

        this.inheritance = new DivEl(/*"inheritance"*/);

        this.comboBox = new UserStoreAccessControlComboBox();
        this.comboBox.addClass('principal-combobox');

        var accessComboBoxFormItem = new FormItemBuilder(this.comboBox).setValidator(Validators.required).setLabel("Permissions").build();

        var fieldSet = new Fieldset();
        fieldSet.add(accessComboBoxFormItem);

        var form = new Form().add(fieldSet);

        form.onFocus((event) => {
            this.notifyFocused(event);
        });
        form.onBlur((event) => {
            this.notifyBlurred(event);
        });

        this.appendChild(this.inheritance);
        this.appendChild(form);

    }

    layout(userStore: UserStore, defaultUserStore: UserStore) {
        this.userStore = userStore;

        this.comboBox.clearSelection();

        if (defaultUserStore) {
            defaultUserStore.getPermissions().getEntries().forEach((item) => {
                this.comboBox.select(item, true);
            });
        }

        userStore.getPermissions().getEntries().forEach((item) => {
            if (!this.comboBox.isSelected(item)) {
                this.comboBox.select(item);
            }
        });

    }

    layoutReadOnly(userStore: UserStore) {
        this.userStore = userStore;

        this.comboBox.clearSelection();
        userStore.getPermissions().getEntries().forEach((item) => {
            if (!this.comboBox.isSelected(item)) {
                this.comboBox.select(item, true);
            }
        });

    }

    giveFocus(): boolean {
        return this.comboBox.giveFocus();
    }

    getPermissions(): UserStoreAccessControlList {
        return new UserStoreAccessControlList(this.comboBox.getSelectedDisplayValues());
    }

}
