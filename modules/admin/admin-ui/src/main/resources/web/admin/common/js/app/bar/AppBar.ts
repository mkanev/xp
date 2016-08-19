import {ResponsiveRanges} from "../../ui/responsive/ResponsiveRanges";
import {DivEl} from "../../dom/DivEl";
import {ActionContainer} from "../../ui/ActionContainer";
import {ButtonEl} from "../../dom/ButtonEl";
import {NavigatorEvent} from "../../ui/NavigatorEvent";
import {ResponsiveManager} from "../../ui/responsive/ResponsiveManager";
import {ResponsiveItem} from "../../ui/responsive/ResponsiveItem";
import {Action} from "../../ui/Action";
import {ActionButton} from "../../ui/button/ActionButton";
import {Button} from "../../ui/button/Button";
import {App} from "../Application";
import {AppBarActions} from "./AppBarActions";
import {AppBarTabMenu} from "./AppBarTabMenu";
import {ShowAppLauncherAction} from "./ShowAppLauncherAction";

export class AppBar extends DivEl implements ActionContainer {

        private application: App;

        private launcherButton: ButtonEl;

        private homeButton: HomeButton;

        private tabMenu: AppBarTabMenu;

        private showAppLauncherAction: ShowAppLauncherAction;

        constructor(application: App) {
            super("appbar");

            this.application = application;
            this.tabMenu = new AppBarTabMenu();

            this.showAppLauncherAction = new ShowAppLauncherAction(this.application);

            this.homeButton = new HomeButton(this.application, AppBarActions.SHOW_BROWSE_PANEL);
            this.appendChild(this.homeButton);

            this.appendChild(this.tabMenu);

            this.tabMenu.onNavigationItemAdded((event: NavigatorEvent)=> {
                this.updateAppOpenTabs();
            });
            this.tabMenu.onNavigationItemRemoved((event: NavigatorEvent)=> {
                this.updateAppOpenTabs();
            });

            // Responsive events to update homeButton styles
            ResponsiveManager.onAvailableSizeChanged(this, (item: ResponsiveItem) => {
                if (this.tabMenu.countVisible() > 0) {
                    this.addClass("tabs-present");
                } else {
                    this.removeClass("tabs-present");
                }
            });
            this.onRendered(() => {ResponsiveManager.fireResizeEvent();});

        }


        getActions(): Action[] {
            return [this.showAppLauncherAction];
        }

        getTabMenu(): AppBarTabMenu {
            return this.tabMenu;
        }

        private updateAppOpenTabs() {
            this.application.setOpenTabs(this.tabMenu.countVisible());
        }
    }

    export class LauncherButton extends ActionButton {

        constructor(action: Action) {
            super(action, false);
            this.addClass('launcher-button');
        }

    }

    export class HomeButton extends Button {

        constructor(app: App, action: Action) {

            super(app.getName());

            this.addClass("home-button app-icon icon-" + app.getIconUrl());

            this.onClicked((event: MouseEvent) => {
                action.execute();
            });
        }

    }
