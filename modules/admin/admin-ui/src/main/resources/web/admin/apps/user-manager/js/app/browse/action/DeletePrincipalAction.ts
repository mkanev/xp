import {Action} from "../../../../../../common/js/ui/Action";
import {ConfirmationDialog} from "../../../../../../common/js/ui/dialog/ConfirmationDialog";
import {ObjectHelper} from "../../../../../../common/js/ObjectHelper";
import {Principal} from "../../../../../../common/js/security/Principal";
import {UserStore} from "../../../../../../common/js/security/UserStore";
import {DeletePrincipalRequest} from "../../../../../../common/js/security/DeletePrincipalRequest";
import {JsonResponse} from "../../../../../../common/js/rest/JsonResponse";
import {showFeedback} from "../../../../../../common/js/notify/MessageBus";
import {UserItemDeletedEvent} from "../../../../../../common/js/security/UserItemDeletedEvent";
import {DeleteUserStoreRequest} from "../../../../../../common/js/security/DeleteUserStoreRequest";

import {UserItemsTreeGrid} from "../UserItemsTreeGrid";
import {UserTreeGridItemType} from "../UserTreeGridItem";
import {UserTreeGridItem} from "../UserTreeGridItem";

export class DeletePrincipalAction extends Action {

    constructor(grid: UserItemsTreeGrid) {
        super("Delete", "mod+del");
        this.setEnabled(false);
        this.onExecuted(() => {
            ConfirmationDialog.get()
                .setQuestion("Are you sure you want to delete this user item?")
                .setNoCallback(null)
                .setYesCallback(() => {


                    var principalItems = grid.getSelectedDataList().filter(
                        userItem => UserTreeGridItemType.PRINCIPAL == userItem.getType()).map((userItem: UserTreeGridItem) => {
                        return userItem.getPrincipal();
                    });

                    var userStoreItems = grid.getSelectedDataList().filter(
                        userItem => UserTreeGridItemType.USER_STORE == userItem.getType()).map((userItem: UserTreeGridItem) => {
                        return userItem.getUserStore();
                    });

                    var principalKeys = principalItems.filter((userItem) => {
                        return ObjectHelper.iFrameSafeInstanceOf(userItem, Principal);
                    }).map((principal: Principal) => {
                        return principal.getKey();
                    });

                    var userStoreKeys = userStoreItems.filter((userItem) => {
                        return ObjectHelper.iFrameSafeInstanceOf(userItem, UserStore);
                    }).map((userStore: UserStore) => {
                        return userStore.getKey();
                    });


                    if (principalKeys && principalKeys.length > 0) {
                        new DeletePrincipalRequest()
                            .setKeys(principalKeys)
                            .send()
                            .done((jsonResponse: JsonResponse<any>) => {
                                var json = jsonResponse.getJson();

                                if (json.results && json.results.length > 0) {
                                    var key = json.results[0].principalKey;

                                    showFeedback('Principal [' + key + '] deleted!');
                                    UserItemDeletedEvent.create().setPrincipals(principalItems).build().fire();
                                }
                            });
                    }

                    if (userStoreKeys && userStoreKeys.length > 0) {
                        new DeleteUserStoreRequest()
                            .setKeys(userStoreKeys)
                            .send()
                            .done((jsonResponse: JsonResponse<any>) => {
                                var json = jsonResponse.getJson();

                                if (json.results && json.results.length > 0) {
                                    var key = json.results[0].userStoreKey;

                                    showFeedback('UserStore [' + key + '] deleted!');
                                    UserItemDeletedEvent.create().setUserStores(userStoreItems).build().fire();
                                }
                            });
                    }
                }).open();
        });
    }
}
