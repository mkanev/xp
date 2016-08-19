import {Role} from "../../../../../common/js/security/Role";
import {Principal} from "../../../../../common/js/security/Principal";
import {PrincipalKey} from "../../../../../common/js/security/PrincipalKey";
import {PrincipalType} from "../../../../../common/js/security/PrincipalType";
import {PrincipalLoader} from "../../../../../common/js/security/PrincipalLoader";
import {FormItemBuilder} from "../../../../../common/js/ui/form/FormItem";
import {PrincipalComboBox} from "../../../../../common/js/ui/security/PrincipalComboBox";
import {DivEl} from "../../../../../common/js/dom/DivEl";
import {LabelEl} from "../../../../../common/js/dom/LabelEl";
import {WizardStepForm} from "../../../../../common/js/app/wizard/WizardStepForm";
import {Fieldset} from "../../../../../common/js/ui/form/Fieldset";
import {Form} from "../../../../../common/js/ui/form/Form";

export class PrincipalMembersWizardStepForm extends WizardStepForm {

    private principals: PrincipalComboBox;

    private principal: Principal;

    private loader: PrincipalLoader;

    constructor(loadedHandler?: Function) {
        super();

        loadedHandler = loadedHandler || (() => {
            });
        this.loader =
            new PrincipalLoader().setAllowedTypes([PrincipalType.GROUP, PrincipalType.USER]).skipPrincipals([PrincipalKey.ofAnonymous()]);

        this.principals = PrincipalComboBox.create().setLoader(this.loader).build();
        var handler = () => {
            this.selectMembers();
            loadedHandler();
            this.principals.unLoaded(handler);
        };
        this.principals.onLoaded(handler);

        var principalsFormItem = new FormItemBuilder(this.principals).setLabel('Members').build();

        var fieldSet = new Fieldset();
        fieldSet.add(principalsFormItem);

        var form = new Form().add(fieldSet);

        form.onFocus((event) => {
            this.notifyFocused(event);
        });
        form.onBlur((event) => {
            this.notifyBlurred(event);
        });

        this.appendChild(form);

    }

    layout(principal: Principal) {
        this.principal = principal;
        this.loader.skipPrincipal(principal.getKey());
        this.selectMembers();
    }

    private selectMembers(): void {
        if (!!this.principal) {
            var principalKeys = this.getPrincipalMembers().map((key: PrincipalKey) => {
                return key.getId();
            });
            var selected = this.principals.getDisplayValues().filter((principal: Principal) => {
                return principalKeys.indexOf(principal.getKey().getId()) >= 0;
            });
            selected.forEach((selection) => {
                this.principals.select(selection);
            });
        }
    }

    getMembers(): Principal[] {
        return this.principals.getSelectedDisplayValues();
    }

    getPrincipals(): PrincipalComboBox {
        return this.principals;
    }

    getPrincipal(): Principal {
        return this.principal;
    }

    getPrincipalMembers(): PrincipalKey[] {
        throw new Error("Must be implemented by inheritors");
    }

    giveFocus(): boolean {
        return this.principals.giveFocus();
    }

    getLoader(): PrincipalLoader {
        return this.loader;
    }
}
