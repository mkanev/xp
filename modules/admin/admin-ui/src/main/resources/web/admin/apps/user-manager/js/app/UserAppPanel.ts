import "../api.ts";
import {UserTreeGridItem, UserTreeGridItemType, UserTreeGridItemBuilder} from "./browse/UserTreeGridItem";
import {UserItemWizardPanel} from "./wizard/UserItemWizardPanel";
import {UserStoreWizardPanel} from "./wizard/UserStoreWizardPanel";
import {PrincipalWizardPanel} from "./wizard/PrincipalWizardPanel";
import {NewPrincipalEvent} from "./browse/NewPrincipalEvent";
import {EditPrincipalEvent} from "./browse/EditPrincipalEvent";
import {UserBrowsePanel} from "./browse/UserBrowsePanel";
import {UserStoreWizardPanelParams} from "./wizard/UserStoreWizardPanelParams";
import {PrincipalWizardPanelParams} from "./wizard/PrincipalWizardPanelParams";
import {RoleWizardPanel} from "./wizard/RoleWizardPanel";
import {UserWizardPanel} from "./wizard/UserWizardPanel";
import {GroupWizardPanel} from "./wizard/GroupWizardPanel";

import AppBarTabMenuItem = api.app.bar.AppBarTabMenuItem;
import AppBarTabMenuItemBuilder = api.app.bar.AppBarTabMenuItemBuilder;
import AppBarTabId = api.app.bar.AppBarTabId;
import Principal = api.security.Principal;
import PrincipalType = api.security.PrincipalType;
import PrincipalKey = api.security.PrincipalKey;
import UserStore = api.security.UserStore;
import GetUserStoreByKeyRequest = api.security.GetUserStoreByKeyRequest;
import UserStoreKey = api.security.UserStoreKey;

interface PrincipalData {

    tabName: string;

    principalPath: string;

    principalType: PrincipalType;
}

export class UserAppPanel extends api.app.BrowseAndWizardBasedAppPanel<UserTreeGridItem> {

    private mask: api.ui.mask.LoadMask;

    constructor(appBar: api.app.bar.AppBar, path?: api.rest.Path) {

        super({
            appBar: appBar
        });
        this.mask = new api.ui.mask.LoadMask(this);

        this.handleGlobalEvents();

        this.route(path);
    }

    private route(path?: api.rest.Path) {
        var action = path ? path.getElement(0) : undefined;
        switch (action) {
        case 'edit':
            var id = path.getElement(1);
            if (id && this.isValidPrincipalKey(id)) {
                new api.security.GetPrincipalByKeyRequest(api.security.PrincipalKey.fromString(id)).sendAndParse().done(
                    (principal: api.security.Principal) => {
                        new EditPrincipalEvent([
                            new UserTreeGridItemBuilder().setPrincipal(principal).setType(UserTreeGridItemType.PRINCIPAL).build()
                        ]).fire();
                    });
            } else if (id && this.isValidUserStoreKey(id)) {
                new GetUserStoreByKeyRequest(api.security.UserStoreKey.fromString(id)).sendAndParse().done((userStore: UserStore) => {
                    new EditPrincipalEvent([
                        new UserTreeGridItemBuilder().setUserStore(userStore).setType(
                            UserTreeGridItemType.USER_STORE).build()
                    ]).fire();
                });
            }
            else {
                new api.app.ShowBrowsePanelEvent().fire();
            }
            break;
        case 'view':
            var id = path.getElement(1);
            if (id) {
                //TODO
            }
            break;
        default:
            new api.app.ShowBrowsePanelEvent().fire();
            break;
        }
    }

    private isValidPrincipalKey(value: string): boolean {
        try {
            api.security.PrincipalKey.fromString(value);
            return true;
        } catch (e) {
            return false;
        }
    }

    private isValidUserStoreKey(value: string): boolean {
        try {
            api.security.UserStoreKey.fromString(value);
            return true;
        } catch (e) {
            return false;
        }
    }

    addWizardPanel(tabMenuItem: api.app.bar.AppBarTabMenuItem, wizardPanel: api.app.wizard.WizardPanel<any>) {
        super.addWizardPanel(tabMenuItem, wizardPanel);

        wizardPanel.onRendered(() => {
            tabMenuItem.setLabel(this.getWizardPanelItemDisplayName(wizardPanel));

            wizardPanel.getWizardHeader().onPropertyChanged((event: api.PropertyChangedEvent) => {
                if (event.getPropertyName() === "displayName") {
                    var name = <string>event.getNewValue() || this.getPrettyNameForWizardPanel(wizardPanel);
                    tabMenuItem.setLabel(name, !<string>event.getNewValue());
                }
            });
        });

        //tabMenuItem.markInvalid(!wizardPanel.getPersistedItem().isValid());

        wizardPanel.onValidityChanged((event: api.ValidityChangedEvent) => {
            tabMenuItem.markInvalid(!wizardPanel.isValid());
        });
    }

    private handleGlobalEvents() {

        api.app.ShowBrowsePanelEvent.on((event) => {
            this.handleBrowse(event);
        });

        NewPrincipalEvent.on((event) => {
            this.handleNew(event);
        });

        EditPrincipalEvent.on((event) => {
            this.handleEdit(event);
        });
    }

    private handleBrowse(event: api.app.ShowBrowsePanelEvent) {
        var browsePanel: api.app.browse.BrowsePanel<UserTreeGridItem> = this.getBrowsePanel();
        if (!browsePanel) {
            this.addBrowsePanel(new UserBrowsePanel());
        } else {
            this.selectPanelByIndex(this.getPanelIndex(browsePanel));
        }
    }


    private handleWizardCreated(wizard: UserItemWizardPanel<api.Equitable>, tabName: string) {
        var tabMenuItem = new AppBarTabMenuItemBuilder()
            .setLabel(api.content.ContentUnnamed.prettifyUnnamed(tabName))
            .setTabId(wizard.getTabId())
            .setCloseAction(wizard.getCloseAction())
            .build();


        this.addWizardPanel(tabMenuItem, wizard);

    }

    private getWizardPanelItemDisplayName(wizardPanel: api.app.wizard.WizardPanel<api.Equitable>): string {
        var displayName;
        if (!!wizardPanel.getPersistedItem()) {
            displayName = (<any>wizardPanel.getPersistedItem()).getDisplayName();
        }

        return displayName || this.getPrettyNameForWizardPanel(wizardPanel);
    }

    private getPrettyNameForWizardPanel(wizard: api.app.wizard.WizardPanel<api.Equitable>): string {
        return api.content.ContentUnnamed.prettifyUnnamed((<UserItemWizardPanel<api.Equitable>>wizard).getUserItemType());
    }

    private handleWizardUpdated(wizard: UserItemWizardPanel<api.Equitable>, tabMenuItem: AppBarTabMenuItem) {

        if (tabMenuItem != null) {
            this.getAppBarTabMenu().deselectNavigationItem();
            this.getAppBarTabMenu().removeNavigationItem(tabMenuItem);
            this.removePanelByIndex(tabMenuItem.getIndex());
        }
        tabMenuItem = new AppBarTabMenuItemBuilder().
            setTabId(wizard.getTabId()).
            setEditing(true).
            setCloseAction(wizard.getCloseAction()).
            build();
        this.addWizardPanel(tabMenuItem, wizard);

        // TODO: what is this view that we try to remove?
        /*var viewTabId = AppBarTabId.forView(id);
         var viewTabMenuItem = this.getAppBarTabMenu().getNavigationItemById(viewTabId);
         if (viewTabMenuItem != null) {
         this.removePanelByIndex(viewTabMenuItem.getIndex());
         }*/
    }


    private handleNew(event: NewPrincipalEvent) {
        var userItem = event.getPrincipals()[0],
            data: PrincipalData = this.resolvePrincipalData(userItem),
            tabId = AppBarTabId.forNew(data.tabName),
            tabMenuItem = this.getAppBarTabMenu().getNavigationItemById(tabId);

        if (tabMenuItem != null) {
            this.selectPanel(tabMenuItem);
        } else {
            if (!userItem || userItem.getType() == UserTreeGridItemType.USER_STORE) {
                this.handleUserStoreNew(tabId, data.tabName);
            } else {
                this.loadUserStoreIfNeeded(userItem).then((userStore: UserStore) => {
                    this.handlePrincipalNew(tabId, data, userStore, userItem);
                });
            }
        }

    }

    private resolvePrincipalData(userItem: UserTreeGridItem): PrincipalData {
        var principalType: PrincipalType,
            principalPath = "",
            tabName;

        if (userItem) {
            switch (userItem.getType()) {

            case UserTreeGridItemType.USERS:
                principalType = PrincipalType.USER;
                principalPath = PrincipalKey.ofUser(userItem.getUserStore().getKey(), "none").toPath(true);
                tabName = "User";
                break;
            case UserTreeGridItemType.GROUPS:
                principalType = PrincipalType.GROUP;
                principalPath = PrincipalKey.ofGroup(userItem.getUserStore().getKey(), "none").toPath(true);
                tabName = "Group";
                break;
            case UserTreeGridItemType.ROLES:
                principalType = PrincipalType.ROLE;
                principalPath = PrincipalKey.ofRole("none").toPath(true);
                tabName = "Role";
                break;
            case UserTreeGridItemType.PRINCIPAL:
                principalType = userItem.getPrincipal().getType();
                principalPath = userItem.getPrincipal().getKey().toPath(true);
                tabName = PrincipalType[principalType];
                tabName = tabName[0] + tabName.slice(1).toLowerCase();
                break;
            case UserTreeGridItemType.USER_STORE:
                tabName = "User Store";
                break;
            }

        } else {
            tabName = "User Store";
        }

        return {
            tabName: tabName,
            principalType: principalType,
            principalPath: principalPath
        };
    }

    private loadUserStoreIfNeeded(userItem: UserTreeGridItem) {
        var promise;
        this.mask.show();

        switch (userItem.getType()) {
        case UserTreeGridItemType.USERS:
        case UserTreeGridItemType.GROUPS:
            promise = new GetUserStoreByKeyRequest(userItem.getUserStore().getKey()).sendAndParse();
            break;
        case UserTreeGridItemType.PRINCIPAL:
            // Roles does not have a UserStore link
            if (userItem.getPrincipal().getType() !== PrincipalType.ROLE) {
                promise = new GetUserStoreByKeyRequest(userItem.getPrincipal().getKey().getUserStore()).sendAndParse();
            } else {
                promise = wemQ(userItem.getUserStore());
            }
            break;
        default:
        case UserTreeGridItemType.USER_STORE:
        case UserTreeGridItemType.ROLES:
            promise = wemQ(userItem.getUserStore());
            break;
        }

        return promise
            .catch((reason: any) => {
                api.DefaultErrorHandler.handle(reason);
            }).finally(() => {
                this.mask.hide();
            });
    }

    private handlePrincipalNew(tabId: AppBarTabId, data: PrincipalData, userStore: UserStore, userItem: UserTreeGridItem) {
        if (data.principalType === PrincipalType.USER && !this.areUsersEditable(userStore)) {
            api.notify.showError("The ID Provider selected for this user store does not allow to create users.");
            return;
        }
        if (data.principalType === PrincipalType.GROUP && !this.areGroupsEditable(userStore)) {
            api.notify.showError("The ID Provider selected for this user store does not allow to create groups.");
            return;
        }

        var wizardParams = <PrincipalWizardPanelParams> new PrincipalWizardPanelParams()
            .setUserStore(userStore)
            .setParentOfSameType(userItem.getType() === UserTreeGridItemType.PRINCIPAL)
            .setPersistedType(data.principalType)
            .setPersistedPath(data.principalPath)
            .setTabId(tabId);

        var wizard = this.resolvePrincipalWizardPanel(wizardParams);

        wizard.onPrincipalNamed((event: api.security.PrincipalNamedEvent) => {
            this.handlePrincipalNamedEvent(event);
        });

        this.handleWizardCreated(wizard, data.tabName);
    }

    private handleUserStoreNew(tabId: AppBarTabId, tabName: string) {
        var wizardParams = <UserStoreWizardPanelParams> new UserStoreWizardPanelParams().setTabId(tabId);
        this.handleWizardCreated(new UserStoreWizardPanel(wizardParams), tabName);
    }


    private handleEdit(event: EditPrincipalEvent) {
        var userItems: UserTreeGridItem[] = event.getPrincipals();

        userItems.forEach((userItem: UserTreeGridItem) => {
            if (!userItem) {
                return;
            }

            var tabMenuItem = this.resolveTabMenuItem(userItem);

            if (tabMenuItem != null) {
                this.selectPanel(tabMenuItem);
            } else {
                var tabId = this.getTabIdForUserItem(userItem);
                if (userItem.getType() === UserTreeGridItemType.USER_STORE) {
                    this.handleUserStoreEdit(userItem.getUserStore(), tabId, tabMenuItem);
                } else if (userItem.getType() == UserTreeGridItemType.PRINCIPAL) {
                    this.loadUserStoreIfNeeded(userItem).then((userStore) => {
                        this.handlePrincipalEdit(userItem.getPrincipal(), userStore, tabId, tabMenuItem);
                    });
                }
            }
        });
    }

    private handleUserStoreEdit(userStore: UserStore, tabId: AppBarTabId, tabMenuItem: AppBarTabMenuItem) {

        var wizardParams = new UserStoreWizardPanelParams()
            .setUserStoreKey(userStore.getKey())    // use key to load persisted item
            .setTabId(tabId);

        var wizard = new UserStoreWizardPanel(wizardParams);

        this.handleWizardUpdated(wizard, tabMenuItem);
    }

    private handlePrincipalEdit(principal: Principal, userStore: UserStore, tabId: AppBarTabId, tabMenuItem: AppBarTabMenuItem) {

        var principalType = principal.getType();

        if (PrincipalType.USER == principalType && !this.areUsersEditable(userStore)) {
            api.notify.showError("The ID Provider selected for this user store does not allow to edit users.");
            return;

        } else if (PrincipalType.GROUP == principalType && !this.areGroupsEditable(userStore)) {
            api.notify.showError("The ID Provider selected for this user store does not allow to edit groups.");
            return;

        } else {
            this.createPrincipalWizardPanelForEdit(principal, userStore, tabId, tabMenuItem);

        }
    }

    private createPrincipalWizardPanelForEdit(principal: Principal, userStore: UserStore, tabId: AppBarTabId,
                                              tabMenuItem: AppBarTabMenuItem) {

        var wizardParams = <PrincipalWizardPanelParams> new PrincipalWizardPanelParams()
            .setUserStore(userStore)
            .setPrincipalKey(principal.getKey())    // user principal key to load persisted item
            .setPersistedType(principal.getType())
            .setPersistedPath(principal.getKey().toPath(true))
            .setTabId(tabId);

        var wizard = this.resolvePrincipalWizardPanel(wizardParams);

        this.handleWizardUpdated(wizard, tabMenuItem);
    }

    private resolvePrincipalWizardPanel(wizardParams: PrincipalWizardPanelParams): PrincipalWizardPanel {
        var wizard: PrincipalWizardPanel;
        switch (wizardParams.persistedType) {
        case PrincipalType.ROLE:
            wizard = new RoleWizardPanel(wizardParams);
            break;
        case PrincipalType.USER:
            wizard = new UserWizardPanel(wizardParams);
            break;
        case PrincipalType.GROUP:
            wizard = new GroupWizardPanel(wizardParams);
            break;
        default:
            wizard = new PrincipalWizardPanel(wizardParams);
        }
        return wizard;
    }

    private handlePrincipalNamedEvent(event: api.event.Event) {
        var e = <api.security.PrincipalNamedEvent>event;
        var wizard = e.getWizard(),
            tabMenuItem = this.getAppBarTabMenu().getNavigationItemById(wizard.getTabId());
        // update tab id so that new wizard for the same content type can be created
        var newTabId = api.app.bar.AppBarTabId.forEdit(e.getPrincipal().getKey().getId());
        tabMenuItem.setTabId(newTabId);
        wizard.setTabId(newTabId);

        var name = e.getPrincipal().getDisplayName();
        if (api.ObjectHelper.iFrameSafeInstanceOf(wizard, PrincipalWizardPanel)) {
            name = name || this.getPrettyNameForWizardPanel(wizard);
        }
        this.getAppBarTabMenu().getNavigationItemById(newTabId).setLabel(name, !e.getPrincipal().getDisplayName());
    }

    private resolveTabMenuItem(userItem: UserTreeGridItem): AppBarTabMenuItem {
        if (!!userItem) {
            return this.getAppBarTabMenu().getNavigationItemById(this.getTabIdForUserItem(userItem));
        }
        return null;
    }

    private getTabIdForUserItem(userItem: UserTreeGridItem): AppBarTabId {
        var appBarTabId: AppBarTabId;
        if (UserTreeGridItemType.PRINCIPAL == userItem.getType()) {
            appBarTabId = AppBarTabId.forEdit(userItem.getPrincipal().getKey().getId());
        } else if (UserTreeGridItemType.USER_STORE == userItem.getType()) {
            appBarTabId = AppBarTabId.forEdit(userItem.getUserStore().getKey().getId());
        }
        return appBarTabId;
    }

    private areUsersEditable(userStore: UserStore): boolean {
        var idProviderMode = userStore.getIdProviderMode();
        return api.security.IdProviderMode.EXTERNAL != idProviderMode && api.security.IdProviderMode.MIXED != idProviderMode;
    }

    private areGroupsEditable(userStore: UserStore): boolean {
        var idProviderMode = userStore.getIdProviderMode();
        return api.security.IdProviderMode.EXTERNAL != idProviderMode;
    }

}
