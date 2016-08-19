import {AppBar} from "./bar/AppBar";
import {Equitable} from "../Equitable";
import {AppBarTabMenu} from "./bar/AppBarTabMenu";
import {KeyBinding} from "../ui/KeyBinding";
import {PanelShownEvent} from "../ui/panel/PanelShownEvent";
import {KeyBindings} from "../ui/KeyBindings";
import {Action} from "../ui/Action";
import {BrowsePanel} from "./browse/BrowsePanel";
import {AppBarTabMenuItem} from "./bar/AppBarTabMenuItem";
import {ItemViewPanel} from "./view/ItemViewPanel";
import {ItemViewClosedEvent} from "./view/ItemViewClosedEvent";
import {WizardPanel} from "./wizard/WizardPanel";
import {WizardClosedEvent} from "./wizard/WizardClosedEvent";
import {Panel} from "../ui/panel/Panel";
import {ObjectHelper} from "../ObjectHelper";
import {ActionContainer} from "../ui/ActionContainer";
import {AppPanel} from "./AppPanel";

export interface BrowseBasedAppPanelConfig<M> {

        appBar:AppBar;

    }

    export class BrowseAndWizardBasedAppPanel<M extends Equitable> extends AppPanel<M> {

        private appBarTabMenu: AppBarTabMenu;

        private currentKeyBindings: KeyBinding[];

        private appBar: AppBar;

        constructor(config: BrowseBasedAppPanelConfig<M>) {
            super(config.appBar.getTabMenu());

            this.appBar = config.appBar;

            this.appBarTabMenu = config.appBar.getTabMenu();

            this.onPanelShown((event: PanelShownEvent) => {
                if (event.getPanel() === this.getBrowsePanel()) {
                    this.getBrowsePanel().refreshFilter();
                }

                var previousActions = this.resolveActions(event.getPreviousPanel());
                KeyBindings.get().unbindKeys(Action.getKeyBindings(previousActions));

                var nextActions = this.resolveActions(event.getPanel());
                this.currentKeyBindings = Action.getKeyBindings(nextActions);
                KeyBindings.get().bindKeys(this.currentKeyBindings);
            });
        }

        addBrowsePanel(browsePanel: BrowsePanel<M>) {
            super.addBrowsePanel(browsePanel);

            this.currentKeyBindings = Action.getKeyBindings(this.resolveActions(browsePanel));
            this.activateCurrentKeyBindings();
        }

        activateCurrentKeyBindings() {

            if (this.currentKeyBindings) {
                KeyBindings.get().bindKeys(this.currentKeyBindings);
            }
        }

        getAppBarTabMenu(): AppBarTabMenu {
            return this.appBarTabMenu;
        }

        addViewPanel(tabMenuItem: AppBarTabMenuItem, viewPanel: ItemViewPanel<M>) {
            super.addNavigablePanel(tabMenuItem, viewPanel, true);

            viewPanel.onClosed((event: ItemViewClosedEvent<M>) => {
                this.removeNavigablePanel(event.getView(), false);
            });
        }

        addWizardPanel(tabMenuItem: AppBarTabMenuItem, wizardPanel: WizardPanel<any>) {
            super.addNavigablePanel(tabMenuItem, wizardPanel, true);

            wizardPanel.onClosed((event: WizardClosedEvent) => {
                this.removeNavigablePanel(event.getWizard(), false);
            });
        }

        canRemovePanel(panel: Panel): boolean {
            if (ObjectHelper.iFrameSafeInstanceOf(panel, WizardPanel)) {
                var wizardPanel: WizardPanel<any> = <WizardPanel<any>>panel;
                return wizardPanel.canClose();
            }
            return true;
        }

        private resolveActions(panel: Panel): Action[] {
            var actions = [];
            actions = actions.concat(this.appBar.getActions());

            if (ObjectHelper.iFrameSafeInstanceOf(panel, WizardPanel) ||
                ObjectHelper.iFrameSafeInstanceOf(panel, BrowsePanel) ||
                ObjectHelper.iFrameSafeInstanceOf(panel, ItemViewPanel)) {
                var actionContainer: ActionContainer = <any>panel;
                actions = actions.concat(actionContainer.getActions());
            }
            return actions;
        }
    }
