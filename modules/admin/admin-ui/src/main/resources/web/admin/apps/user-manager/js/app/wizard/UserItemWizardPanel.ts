import {Principal} from "../../../../../common/js/security/Principal";
import {PrincipalKey} from "../../../../../common/js/security/PrincipalKey";
import {PrincipalType} from "../../../../../common/js/security/PrincipalType";
import {PrincipalNamedEvent} from "../../../../../common/js/security/PrincipalNamedEvent";
import {UserStoreKey} from "../../../../../common/js/security/UserStoreKey";
import {ConfirmationDialog} from "../../../../../common/js/ui/dialog/ConfirmationDialog";
import {ResponsiveManager} from "../../../../../common/js/ui/responsive/ResponsiveManager";
import {ResponsiveItem} from "../../../../../common/js/ui/responsive/ResponsiveItem";
import {FormIcon} from "../../../../../common/js/app/wizard/FormIcon";
import {WizardHeaderWithDisplayNameAndName} from "../../../../../common/js/app/wizard/WizardHeaderWithDisplayNameAndName";
import {WizardHeaderWithDisplayNameAndNameBuilder} from "../../../../../common/js/app/wizard/WizardHeaderWithDisplayNameAndName";
import {WizardStep} from "../../../../../common/js/app/wizard/WizardStep";
import {Toolbar} from "../../../../../common/js/ui/toolbar/Toolbar";
import {WizardActions} from "../../../../../common/js/app/wizard/WizardActions";
import {Equitable} from "../../../../../common/js/Equitable";
import {WizardPanel} from "../../../../../common/js/app/wizard/WizardPanel";
import {ImgEl} from "../../../../../common/js/dom/ImgEl";
import {ElementShownEvent} from "../../../../../common/js/dom/ElementShownEvent";
import {showError} from "../../../../../common/js/notify/MessageBus";
import {Action} from "../../../../../common/js/ui/Action";

import {UserItemWizardActions} from "./action/UserItemWizardActions";
import {UserItemWizardPanelParams} from "./UserItemWizardPanelParams";

export class UserItemWizardPanel<USER_ITEM_TYPE extends Equitable> extends WizardPanel<USER_ITEM_TYPE> {

    wizardActions: UserItemWizardActions<USER_ITEM_TYPE>;

    constructor(params: UserItemWizardPanelParams<USER_ITEM_TYPE>) {

        this.wizardActions = this.createWizardActions();

        super({
            tabId: params.tabId,
            persistedItem: params.persistedItem,
            actions: this.wizardActions
        });
    }

    protected createWizardActions(): UserItemWizardActions<USER_ITEM_TYPE> {
        throw Error('Override me');
    }

    protected createMainToolbar(): Toolbar {
        throw Error('Override me');
    }

    protected createWizardHeader(): WizardHeaderWithDisplayNameAndName {
        throw Error('Override me');
    }

    public getWizardHeader(): WizardHeaderWithDisplayNameAndName {
        return <WizardHeaderWithDisplayNameAndName> super.getWizardHeader();
    }

    protected createFormIcon(): FormIcon {
        var iconUrl = ImgEl.PLACEHOLDER;
        var formIcon = new FormIcon(iconUrl, "icon");
        formIcon.addClass("icon icon-xlarge");
        return formIcon;
    }

    public getFormIcon(): FormIcon {
        return <FormIcon> super.getFormIcon();
    }

    doRenderOnDataLoaded(rendered): Q.Promise<boolean> {

        return super.doRenderOnDataLoaded(rendered).then((rendered) => {
            this.addClass("principal-wizard-panel");

            var responsiveItem = ResponsiveManager.onAvailableSizeChanged(this, (item: ResponsiveItem) => {
                if (this.isVisible()) {
                    this.updateStickyToolbar();
                }
            });

            this.updateHash();
            this.onRemoved((event) => ResponsiveManager.unAvailableSizeChanged(this));

            this.onShown((event: ElementShownEvent) => {
                this.updateHash();
                responsiveItem.update();
            });

            return rendered;
        });
    }

    getUserItemType(): string {
        throw new Error("Must be implemented by inheritors");
    }

    saveChanges(): wemQ.Promise<USER_ITEM_TYPE> {
        if (this.isRendered() && !this.getWizardHeader().getName()) {
            var deferred = wemQ.defer<USER_ITEM_TYPE>();
            showError("Name can not be empty");
            deferred.reject(new Error("Name can not be empty"));
            return deferred.promise;
        } else {
            return super.saveChanges();
        }

    }


    createSteps(persistedItem: USER_ITEM_TYPE): WizardStep[] {
        throw new Error("Must be implemented by inheritors");
    }

    doLayout(persistedItem: USER_ITEM_TYPE): wemQ.Promise<void> {

        this.setSteps(this.createSteps(this.getPersistedItem()));

        return wemQ<void>(null);
    }

    protected doLayoutPersistedItem(persistedItem: USER_ITEM_TYPE): Q.Promise<void> {
        throw new Error("Must be implemented by inheritors");
    }

    persistNewItem(): wemQ.Promise<USER_ITEM_TYPE> {
        throw new Error("Must be implemented by inheritors");
    }

    updatePersistedItem(): wemQ.Promise<USER_ITEM_TYPE> {
        throw new Error("Must be implemented by inheritors");
    }

    getCloseAction(): Action {
        return this.wizardActions.getCloseAction();
    }

    protected updateHash() {
        throw new Error("Must be implemented by inheritors");
    }
}
