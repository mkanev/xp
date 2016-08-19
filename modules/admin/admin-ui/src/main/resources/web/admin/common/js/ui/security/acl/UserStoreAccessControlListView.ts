import {Permission} from "../../../security/acl/Permission";
import {Principal} from "../../../security/Principal";
import {PrincipalType} from "../../../security/PrincipalType";
import {UserStoreAccessControlEntry} from "../../../security/acl/UserStoreAccessControlEntry";
import {ListBox} from "../../selector/list/ListBox";
import {UserStoreAccessControlEntryView} from "./UserStoreAccessControlEntryView";

export class UserStoreAccessControlListView extends ListBox<UserStoreAccessControlEntry> {

        private itemValueChangedListeners: {(item: UserStoreAccessControlEntry): void}[] = [];
        private itemsEditable: boolean = true;

        constructor(className?: string) {
            super('access-control-list' + (className ? " " + className : ""));
        }

        createItemView(entry: UserStoreAccessControlEntry, readOnly: boolean): UserStoreAccessControlEntryView {
            var itemView = new UserStoreAccessControlEntryView(entry);
            itemView.setEditable(this.itemsEditable);
            itemView.onRemoveClicked(() => {
                this.removeItem(entry);
            });
            itemView.onValueChanged((item: UserStoreAccessControlEntry) => {
                this.notifyItemValueChanged(item);
            });

            if(readOnly)
            {
                itemView.setEditable(false);
            }

            return itemView;
        }

        getItemId(item: UserStoreAccessControlEntry): string {
            return item.getPrincipal().getKey().toString();
        }

        onItemValueChanged(listener: (item: UserStoreAccessControlEntry) => void) {
            this.itemValueChangedListeners.push(listener);
        }

        unItemValueChanged(listener: (item: UserStoreAccessControlEntry) => void) {
            this.itemValueChangedListeners = this.itemValueChangedListeners.filter((curr) => {
                return curr != listener;
            })
        }

        notifyItemValueChanged(item: UserStoreAccessControlEntry) {
            this.itemValueChangedListeners.forEach((listener) => {
                listener(item);
            })
        }

        setItemsEditable(editable: boolean): UserStoreAccessControlListView {
            if (this.itemsEditable != editable) {
                this.itemsEditable = editable;
                this.refreshList();
            }
            return this;
        }

        isItemsEditable(): boolean {
            return this.itemsEditable;
        }

    }

