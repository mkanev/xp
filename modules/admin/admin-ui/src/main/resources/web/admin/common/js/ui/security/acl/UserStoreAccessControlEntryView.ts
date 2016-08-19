import {Principal} from "../../../security/Principal";
import {PrincipalType} from "../../../security/PrincipalType";
import {PrincipalKey} from "../../../security/PrincipalKey";
import {Permission} from "../../../security/acl/Permission";
import {UserStoreAccessControlEntry} from "../../../security/acl/UserStoreAccessControlEntry";
import {UserStoreAccess} from "../../../security/acl/UserStoreAccess";
import {PrincipalViewer} from "../PrincipalViewer";
import {AEl} from "../../../dom/AEl";
import {ValueChangedEvent} from "../../../ValueChangedEvent";
import {UserStoreAccessSelector} from "./UserStoreAccessSelector";

export class UserStoreAccessControlEntryView extends PrincipalViewer {

        private ace: UserStoreAccessControlEntry;

        private accessSelector: UserStoreAccessSelector;

        private removeButton: AEl;
        private valueChangedListeners: {(item: UserStoreAccessControlEntry): void}[] = [];
        private editable: boolean = true;

        public static debug: boolean = false;

        constructor(ace: UserStoreAccessControlEntry) {
            super();
            this.setClass('userstore-access-control-entry');
            //this.toggleClass('inherited', ace.isInherited());

            this.ace = ace;
            if (isNaN(this.ace.getAccess())) {
                this.ace.setAccess(UserStoreAccess[UserStoreAccess.CREATE_USERS]);
            }

            this.setUserStoreAccessControlEntry(this.ace, true);

        }

        getValueChangedListeners(): {(item: UserStoreAccessControlEntry): void}[] {
            return this.valueChangedListeners;
        }

        setEditable(editable: boolean) {
            if (editable != this.editable) {
                this.accessSelector.setEnabled(editable);
                this.editable = editable;
            }

            if (this.editable) {
                this.removeClass("readonly");
            }
            else {
                this.addClass("readonly");
            }
        }

        isEditable(): boolean {
            return this.editable;
        }

        onValueChanged(listener: (item: UserStoreAccessControlEntry) => void) {
            this.valueChangedListeners.push(listener);
        }

        unValueChanged(listener: (item: UserStoreAccessControlEntry) => void) {
            this.valueChangedListeners = this.valueChangedListeners.filter((curr) => {
                return curr != listener;
            })
        }

        notifyValueChanged(item: UserStoreAccessControlEntry) {
            this.valueChangedListeners.forEach((listener) => {
                listener(item);
            })
        }

        public setUserStoreAccessControlEntry(ace: UserStoreAccessControlEntry, silent?: boolean) {
            this.ace = ace;

            var principal = Principal.create().setKey(ace.getPrincipal().getKey()).setDisplayName(
                ace.getPrincipal().getDisplayName()).setModifiedTime(ace.getPrincipal().getModifiedTime()).build();
            this.setObject(principal);

            this.doLayout(principal);
        }

        public getUserStoreAccessControlEntry(): UserStoreAccessControlEntry {
            var ace = new UserStoreAccessControlEntry(this.ace.getPrincipal(), this.ace.getAccess());
            return ace;
        }

        doLayout(object: Principal) {
            super.doLayout(object);

            if (UserStoreAccessControlEntryView.debug) {
                console.debug("UserStoreAccessControlEntryView.doLayout");
            }

            // permissions will be set on access selector value change

            if (!this.accessSelector) {
                this.accessSelector = new UserStoreAccessSelector();
                this.accessSelector.onValueChanged((event: ValueChangedEvent) => {
                    this.ace.setAccess(event.getNewValue());
                });
                this.appendChild(this.accessSelector);
            }
            this.accessSelector.setValue(this.ace.getAccess(), true);

            if (!this.removeButton) {
                this.removeButton = new AEl("icon-close");
                this.removeButton.onClicked((event: MouseEvent) => {
                    if (this.editable) {
                        this.notifyRemoveClicked(event);
                    }
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                });
                this.appendChild(this.removeButton);
            }
        }
    }

