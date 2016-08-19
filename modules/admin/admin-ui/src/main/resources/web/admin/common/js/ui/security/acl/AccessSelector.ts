import {TabMenuItemBuilder} from "../../tab/TabMenuItem";
import {TabMenu} from "../../tab/TabMenu";
import {ValueChangedEvent} from "../../../ValueChangedEvent";
import {NavigatorEvent} from "../../NavigatorEvent";
import {TabMenuItem} from "../../tab/TabMenuItem";
import {Access} from "./Access";

interface AccessSelectorOption {
        value: Access;
        name: string;
    }

    export class AccessSelector extends TabMenu {

        private static OPTIONS: AccessSelectorOption[] = [
            {value: Access.READ, name: 'Can Read'},
            {value: Access.WRITE, name: 'Can Write'},
            {value: Access.PUBLISH, name: 'Can Publish'},
            {value: Access.FULL, name: 'Full Access'},
            {value: Access.CUSTOM, name: 'Custom...'}
        ];

        private value: Access;
        private valueChangedListeners: {(event: ValueChangedEvent):void}[] = [];

        constructor() {
            super("access-selector");

            AccessSelector.OPTIONS.forEach((option: AccessSelectorOption, index: number) => {
                var menuItem = (<TabMenuItemBuilder>new TabMenuItemBuilder().setLabel(option.name).setAddLabelTitleAttribute(false)).build();
                this.addNavigationItem(menuItem);
            });

            this.onNavigationItemSelected((event: NavigatorEvent) => {
                var item: TabMenuItem = <TabMenuItem> event.getItem();
                this.setValue(AccessSelector.OPTIONS[item.getIndex()].value);
            })
        }

        getValue(): Access {
            return this.value
        }

        setValue(value: Access, silent?: boolean): AccessSelector {
            var option = this.findOptionByValue(value);
            if (option) {
                this.selectNavigationItem(AccessSelector.OPTIONS.indexOf(option));
                if (!silent) {
                    this.notifyValueChanged(new ValueChangedEvent(Access[this.value], Access[value]));
                }
                this.value = value;
            }
            return this;
        }

        protected setButtonLabel(value: string): AccessSelector {
            this.getTabMenuButtonEl().setLabel(value, false);
            return this;
        }

        private findOptionByValue(value: Access): AccessSelectorOption {
            for (var i = 0; i < AccessSelector.OPTIONS.length; i++) {
                var option = AccessSelector.OPTIONS[i];
                if (option.value == value) {
                    return option;
                }
            }
            return undefined;
        }

        showMenu() {

            var menu = this.getMenuEl(),
                button = this.getTabMenuButtonEl(),
                entry = menu.getParentElement().getParentElement(),
                list = entry.getParentElement(),
                offset = entry.getEl().getOffsetTopRelativeToParent() -
                    (list.getEl().getOffsetTopRelativeToParent() + list.getEl().getPaddingTop() + list.getEl().getScrollTop()),
                height = menu.getEl().getHeightWithoutPadding() - button.getEl().getHeight() + 2; // 2 is a valid deviation


            if (offset > height) {
                menu.addClass("upward");
            } else {
                menu.removeClass("upward");
            }

            super.showMenu();
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

