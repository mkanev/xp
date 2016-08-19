import {UserStore} from "../../../../../../common/js/security/UserStore";
import {Principal} from "../../../../../../common/js/security/Principal";
import {Action} from "../../../../../../common/js/ui/Action";
import {WizardPanel} from "../../../../../../common/js/app/wizard/WizardPanel";
import {Equitable} from "../../../../../../common/js/Equitable";
import {ConfirmationDialog} from "../../../../../../common/js/ui/dialog/ConfirmationDialog";
import {DeletePrincipalRequest} from "../../../../../../common/js/security/DeletePrincipalRequest";
import {JsonResponse} from "../../../../../../common/js/rest/JsonResponse";
import {showFeedback} from "../../../../../../common/js/notify/MessageBus";
import {UserItemDeletedEvent} from "../../../../../../common/js/security/UserItemDeletedEvent";
import {DeleteUserStoreRequest} from "../../../../../../common/js/security/DeleteUserStoreRequest";

import {PrincipalWizardPanel} from "../PrincipalWizardPanel";

export class DeleteUserItemAction extends Action {

    constructor(wizardPanel: WizardPanel<Equitable>) {
        super("Delete", "mod+del", true);
        this.onExecuted(() => {
            ConfirmationDialog.get()
                .setQuestion("Are you sure you want to delete this item?")
                .setNoCallback(null)
                .setYesCallback(() => {

                    wizardPanel.close();

                    var persistedItem = wizardPanel.getPersistedItem(),
                        isPrincipal = (wizardPanel instanceof PrincipalWizardPanel) && !!persistedItem,
                        userItemKey;
                    if (isPrincipal) {
                        userItemKey = (<Principal>persistedItem).getKey();
                        new DeletePrincipalRequest()
                            .setKeys([userItemKey])
                            .send()
                            .done((jsonResponse: JsonResponse<any>) => {
                                var json = jsonResponse.getJson();

                                if (json.results && json.results.length > 0) {
                                    var key = json.results[0].principalKey;

                                    showFeedback('Principal [' + key + '] deleted!');
                                    UserItemDeletedEvent.create().setPrincipals([<Principal>persistedItem]).build().fire();
                                }
                            });
                    } else {
                        userItemKey = (<UserStore>persistedItem).getKey();
                        new DeleteUserStoreRequest()
                            .setKeys([userItemKey])
                            .send()
                            .done((jsonResponse: JsonResponse<any>) => {
                                var json = jsonResponse.getJson();

                                if (json.results && json.results.length > 0) {
                                    var key = json.results[0].userStoreKey;

                                    showFeedback('UserStore [' + key + '] deleted!');
                                    UserItemDeletedEvent.create().setUserStores([<UserStore>persistedItem]).build().fire();
                                }
                            });
                    }
                }).open();
        });
    }
}
