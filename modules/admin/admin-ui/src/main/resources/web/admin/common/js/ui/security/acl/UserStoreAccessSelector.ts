import {TabMenuItemBuilder} from "../../tab/TabMenuItem";
import {UserStoreAccess} from "../../../security/acl/UserStoreAccess";
import {TabMenu} from "../../tab/TabMenu";
import {ValueChangedEvent} from "../../../ValueChangedEvent";
import {NavigatorEvent} from "../../NavigatorEvent";
import {TabMenuItem} from "../../tab/TabMenuItem";

interface UserStoreAccessSelectorOption {
        value: UserStoreAccess;
        name: string;
    }

    export class UserStoreAccessSelector extends TabMenu {

        private static OPTIONS: UserStoreAccessSelectorOption[] = [
            {value: UserStoreAccess.READ, name: 'Read'},
            {value: UserStoreAccess.CREATE_USERS, name: 'Create Users'},
            {value: UserStoreAccess.WRITE_USERS, name: 'Write Users'},
            {value: UserStoreAccess.USER_STORE_MANAGER, name: 'User Store Manager'},
            {value: UserStoreAccess.ADMINISTRATOR, name: 'Administrator'}
        ];

        private value: UserStoreAccess;
        private valueChangedListeners: {(event: ValueChangedEvent):void}[] = [];

        constructor() {
            super("access-selector");

            UserStoreAccessSelector.OPTIONS.forEach((option: UserStoreAccessSelectorOption, index: number) => {
                var menuItem = (<TabMenuItemBuilder>new TabMenuItemBuilder().setLabel(option.name)).build();
                this.addNavigationItem(menuItem);
            });

            this.onNavigationItemSelected((event: NavigatorEvent) => {
                var item: TabMenuItem = <TabMenuItem> event.getItem();
                this.setValue(UserStoreAccessSelector.OPTIONS[item.getIndex()].value);
            });

        }

        getValue(): UserStoreAccess {
            return this.value
        }

        setValue(value: UserStoreAccess, silent?: boolean): UserStoreAccessSelector {
            var option = this.findOptionByValue(value);
            if (option) {
                this.selectNavigationItem(UserStoreAccessSelector.OPTIONS.indexOf(option));
                if (!silent) {
                    this.notifyValueChanged(new ValueChangedEvent(UserStoreAccess[this.value], UserStoreAccess[value]));
                }
                this.value = value;
            }
            return this;
        }

        private findOptionByValue(value: UserStoreAccess): UserStoreAccessSelectorOption {
            for (var i = 0; i < UserStoreAccessSelector.OPTIONS.length; i++) {
                var option = UserStoreAccessSelector.OPTIONS[i];
                if (option.value == value) {
                    return option;
                }
            }
            return undefined;
        }

        onValueChanged(listener: (event: ValueChangedEvent)=>void) {
            this.valueChangedListeners.push(listener);
        }

        unValueChanged(listener: (event: ValueChangedEvent)=>void) {
            this.valueChangedListeners = this.valueChangedListeners.filter((curr) => {
                return curr !== listener;
            })
        }

        private notifyValueChanged(event: ValueChangedEvent) {
            this.valueChangedListeners.forEach((listener) => {
                listener(event);
            })
        }

    }

