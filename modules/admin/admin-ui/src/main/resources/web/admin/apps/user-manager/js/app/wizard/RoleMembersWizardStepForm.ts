import {Role} from "../../../../../common/js/security/Role";
import {Principal} from "../../../../../common/js/security/Principal";
import {PrincipalKey} from "../../../../../common/js/security/PrincipalKey";
import {PrincipalType} from "../../../../../common/js/security/PrincipalType";

import {PrincipalMembersWizardStepForm} from "./PrincipalMembersWizardStepForm";

export class RoleMembersWizardStepForm extends PrincipalMembersWizardStepForm {

    constructor() {
        super();
        this.getLoader().load();
    }

    getPrincipalMembers(): PrincipalKey[] {
        return this.getPrincipal().asRole().getMembers();
    }
}
