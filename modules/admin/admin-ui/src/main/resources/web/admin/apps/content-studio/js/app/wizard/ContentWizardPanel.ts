import {PropertyTree} from "../../../../../common/js/data/PropertyTree";
import {FormView} from "../../../../../common/js/form/FormView";
import {FormContextBuilder} from "../../../../../common/js/form/FormContext";
import {ContentFormContext} from "../../../../../common/js/content/form/ContentFormContext";
import {Content} from "../../../../../common/js/content/Content";
import {ContentId} from "../../../../../common/js/content/ContentId";
import {ContentPath} from "../../../../../common/js/content/ContentPath";
import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {CompareStatus} from "../../../../../common/js/content/CompareStatus";
import {ContentBuilder} from "../../../../../common/js/content/Content";
import {Thumbnail} from "../../../../../common/js/thumb/Thumbnail";
import {ContentName} from "../../../../../common/js/content/ContentName";
import {ContentUnnamed} from "../../../../../common/js/content/ContentUnnamed";
import {CreateContentRequest} from "../../../../../common/js/content/resource/CreateContentRequest";
import {UpdateContentRequest} from "../../../../../common/js/content/resource/UpdateContentRequest";
import {GetContentByIdRequest} from "../../../../../common/js/content/resource/GetContentByIdRequest";
import {ExtraData} from "../../../../../common/js/content/ExtraData";
import {Page} from "../../../../../common/js/content/page/Page";
import {Site} from "../../../../../common/js/content/site/Site";
import {SiteModel} from "../../../../../common/js/content/site/SiteModel";
import {LiveEditModel} from "../../../../../common/js/liveedit/LiveEditModel";
import {ContentType} from "../../../../../common/js/schema/content/ContentType";
import {PageTemplate} from "../../../../../common/js/content/page/PageTemplate";
import {PageDescriptor} from "../../../../../common/js/content/page/PageDescriptor";
import {AccessControlList} from "../../../../../common/js/security/acl/AccessControlList";
import {AccessControlEntry} from "../../../../../common/js/security/acl/AccessControlEntry";
import {GetPageTemplateByKeyRequest} from "../../../../../common/js/content/page/GetPageTemplateByKeyRequest";
import {GetPageDescriptorByKeyRequest} from "../../../../../common/js/content/page/GetPageDescriptorByKeyRequest";
import {IsRenderableRequest} from "../../../../../common/js/content/page/IsRenderableRequest";
import {GetNearestSiteRequest} from "../../../../../common/js/content/resource/GetNearestSiteRequest";
import {GetPageDescriptorsByApplicationsRequest} from "../../../../../common/js/content/page/GetPageDescriptorsByApplicationsRequest";
import {ConfirmationDialog} from "../../../../../common/js/ui/dialog/ConfirmationDialog";
import {ResponsiveManager} from "../../../../../common/js/ui/responsive/ResponsiveManager";
import {ResponsiveRanges} from "../../../../../common/js/ui/responsive/ResponsiveRanges";
import {ResponsiveItem} from "../../../../../common/js/ui/responsive/ResponsiveItem";
import {FormIcon} from "../../../../../common/js/app/wizard/FormIcon";
import {FileUploadCompleteEvent} from "../../../../../common/js/ui/uploader/FileUploadCompleteEvent";
import {TogglerButton} from "../../../../../common/js/ui/button/TogglerButton";
import {WizardHeaderWithDisplayNameAndName} from "../../../../../common/js/app/wizard/WizardHeaderWithDisplayNameAndName";
import {WizardHeaderWithDisplayNameAndNameBuilder} from "../../../../../common/js/app/wizard/WizardHeaderWithDisplayNameAndName";
import {WizardStep} from "../../../../../common/js/app/wizard/WizardStep";
import {WizardStepValidityChangedEvent} from "../../../../../common/js/app/wizard/WizardStepValidityChangedEvent";
import {ContentRequiresSaveEvent} from "../../../../../common/js/content/event/ContentRequiresSaveEvent";
import {ImageErrorEvent} from "../../../../../common/js/content/image/ImageErrorEvent";
import {Application} from "../../../../../common/js/application/Application";
import {ApplicationKey} from "../../../../../common/js/application/ApplicationKey";
import {ApplicationEvent} from "../../../../../common/js/application/ApplicationEvent";
import {ApplicationEventType} from "../../../../../common/js/application/ApplicationEvent";
import {Mixin} from "../../../../../common/js/schema/mixin/Mixin";
import {MixinName} from "../../../../../common/js/schema/mixin/MixinName";
import {MixinNames} from "../../../../../common/js/schema/mixin/MixinNames";
import {GetMixinByQualifiedNameRequest} from "../../../../../common/js/schema/mixin/GetMixinByQualifiedNameRequest";
import {ContentDeletedEvent} from "../../../../../common/js/content/event/ContentDeletedEvent";
import {ContentUpdatedEvent} from "../../../../../common/js/content/event/ContentUpdatedEvent";
import {ContentNamedEvent} from "../../../../../common/js/content/event/ContentNamedEvent";
import {ActiveContentVersionSetEvent} from "../../../../../common/js/content/event/ActiveContentVersionSetEvent";
import {ContentServerEventsHandler} from "../../../../../common/js/content/event/ContentServerEventsHandler";
import {DialogButton} from "../../../../../common/js/ui/dialog/DialogButton";
import {Toolbar} from "../../../../../common/js/ui/toolbar/Toolbar";
import {CycleButton} from "../../../../../common/js/ui/button/CycleButton";
import {WizardPanel} from "../../../../../common/js/app/wizard/WizardPanel";
import {ApplicationAddedEvent} from "../../../../../common/js/content/site/ApplicationAddedEvent";
import {ApplicationRemovedEvent} from "../../../../../common/js/content/site/ApplicationRemovedEvent";
import {showWarning} from "../../../../../common/js/notify/MessageBus";
import {GetApplicationRequest} from "../../../../../common/js/application/GetApplicationRequest";
import {MaskContentWizardPanelEvent} from "../../../../../common/js/app/wizard/MaskContentWizardPanelEvent";
import {WizardHeader} from "../../../../../common/js/app/wizard/WizardHeader";
import {Panel} from "../../../../../common/js/ui/panel/Panel";
import {ValidityChangedEvent} from "../../../../../common/js/ValidityChangedEvent";
import {FileUploadedEvent} from "../../../../../common/js/ui/uploader/FileUploadedEvent";
import {showFeedback} from "../../../../../common/js/notify/MessageBus";
import {IsAuthenticatedRequest} from "../../../../../common/js/security/auth/IsAuthenticatedRequest";
import {LoginResult} from "../../../../../common/js/security/auth/LoginResult";
import {Exception} from "../../../../../common/js/Exception";
import {ExceptionType} from "../../../../../common/js/Exception";
import {ValueTypes} from "../../../../../common/js/data/ValueTypes";
import {FormItemContainer} from "../../../../../common/js/form/FormItemContainer";
import {ObjectHelper} from "../../../../../common/js/ObjectHelper";
import {FieldSet} from "../../../../../common/js/form/FieldSet";
import {FormItemSet} from "../../../../../common/js/form/FormItemSet";
import {Input} from "../../../../../common/js/form/Input";
import {ContentSummaryAndCompareStatusFetcher} from "../../../../../common/js/content/resource/ContentSummaryAndCompareStatusFetcher";
import {PropertyTreeComparator} from "../../../../../common/js/data/PropertyTreeComparator";
import {ContentIconUrlResolver} from "../../../../../common/js/content/util/ContentIconUrlResolver";
import {FormBuilder} from "../../../../../common/js/form/Form";
import {DefaultErrorHandler} from "../../../../../common/js/DefaultErrorHandler";
import {StringHelper} from "../../../../../common/js/util/StringHelper";
import {Action} from "../../../../../common/js/ui/Action";
import {Permission} from "../../../../../common/js/security/acl/Permission";
import {PrincipalKey} from "../../../../../common/js/security/PrincipalKey";
import {RoleKeys} from "../../../../../common/js/security/RoleKeys";
import {CompareStatusFormatter} from "../../../../../common/js/content/CompareStatus";

import {DefaultModels} from "./page/DefaultModels";
import {ContentWizardStepForm} from "./ContentWizardStepForm";
import {SettingsWizardStepForm} from "./SettingsWizardStepForm";
import {SecurityWizardStepForm} from "./SecurityWizardStepForm";
import {DisplayNameScriptExecutor} from "./DisplayNameScriptExecutor";
import {LiveFormPanel, LiveFormPanelConfig} from "./page/LiveFormPanel";
import {ContentWizardToolbarPublishControls} from "./ContentWizardToolbarPublishControls";
import {ContentWizardActions} from "./action/ContentWizardActions";
import {ContentWizardPanelParams} from "./ContentWizardPanelParams";
import {ContentWizardToolbar} from "./ContentWizardToolbar";
import {ContentPermissionsAppliedEvent} from "./ContentPermissionsAppliedEvent";
import {Router} from "../Router";
import {PersistNewContentRoutine} from "./PersistNewContentRoutine";
import {UpdatePersistedContentRoutine} from "./UpdatePersistedContentRoutine";
import {ContentWizardDataLoader} from "./ContentWizardDataLoader";
import {ThumbnailUploaderEl} from "./ThumbnailUploaderEl";

export class ContentWizardPanel extends WizardPanel<Content> {

    private contentParams: ContentWizardPanelParams;

    private parentContent: Content;

    private defaultModels: DefaultModels;

    private site: Site;

    private contentType: ContentType;

    private siteModel: SiteModel;

    private liveEditModel: LiveEditModel;

    private contentWizardStep: WizardStep;

    private contentWizardStepForm: ContentWizardStepForm;

    private settingsWizardStepForm: SettingsWizardStepForm;

    private settingsWizardStep: WizardStep;

    private securityWizardStepForm: SecurityWizardStepForm;

    private metadataStepFormByName: {[name: string]: ContentWizardStepForm;};

    private displayNameScriptExecutor: DisplayNameScriptExecutor;

    private requireValid: boolean;

    private wizardActions: ContentWizardActions;

    private isContentFormValid: boolean;

    private contentNamedListeners: {(event: ContentNamedEvent): void}[];

    private isSecurityWizardStepFormAllowed: boolean;

    private publishButtonForMobile: DialogButton;

    private inMobileViewMode: boolean;

    private skipValidation: boolean;

    private contentCompareStatus: CompareStatus;

    private dataChangedListener: () => void;

    private applicationAddedListener: (event: ApplicationAddedEvent) => void;

    private applicationRemovedListener: (event: ApplicationRemovedEvent) => void;

    private applicationUnavailableListener: (event: ApplicationEvent) => void;

    /**
     * Whether constructor is being currently executed or not.
     */

    public static debug: boolean = false;

    constructor(params: ContentWizardPanelParams) {

        this.contentParams = params;

        this.isContentFormValid = false;
        this.isSecurityWizardStepFormAllowed = false;

        this.requireValid = false;
        this.skipValidation = false;
        this.contentNamedListeners = [];

        this.displayNameScriptExecutor = new DisplayNameScriptExecutor();

        this.initWizardActions();

        this.metadataStepFormByName = {};

        super({
            tabId: params.tabId,
            persistedItem: null,
            actions: this.wizardActions
        });

        this.initListeners();
        this.listenToContentEvents();
        this.handleSiteConfigApply();
        this.handleBrokenImageInTheWizard();
    }

    private initWizardActions() {
        this.wizardActions = new ContentWizardActions(this);
        this.wizardActions.getShowLiveEditAction().setEnabled(false);
        this.wizardActions.getSaveAction().onExecuted(() => {
            if (this.isNew) { // validation might have not been called for some cases for new item
                this.contentWizardStepForm.validate();
            }
            this.displayValidationErrors();
        });

        this.wizardActions.getShowSplitEditAction().onExecuted(() => {
            if (!this.inMobileViewMode) {
                this.getCycleViewModeButton()
                    .selectActiveAction(this.wizardActions.getShowLiveEditAction());
            }
        });
    }

    private initListeners() {

        this.onDataLoaded((content: Content) => {
            if (this.getPersistedItem()) {
                Router.setHash("edit/" + this.getPersistedItem().getId());
            } else {
                Router.setHash("new/" + this.contentType.getName());
            }
        });

        this.dataChangedListener = () => {
            var publishControls = this.getContentWizardToolbarPublishControls();
            if (this.isContentFormValid && publishControls.isOnline()) {
                publishControls.setCompareStatus(CompareStatus.NEWER);
            }
        };

        this.applicationAddedListener = (event: ApplicationAddedEvent) => {
            this.addMetadataStepForms(event.getApplicationKey());
        };

        this.applicationRemovedListener = (event: ApplicationRemovedEvent) => {
            this.removeMetadataStepForms();
        };

        this.applicationUnavailableListener = (event: ApplicationEvent) => {
            var isAppFromSiteModelUnavailable: boolean = this.siteModel.getApplicationKeys().some((applicationKey: ApplicationKey) => {
                return event.getApplicationKey().equals(applicationKey);
            });

            if (isAppFromSiteModelUnavailable) {
                let message = "Required application " + event.getApplicationKey().toString() + " not available.";

                if (this.isVisible()) {
                    showWarning(message);
                }
                else {
                    let shownHandler = () => {
                        new GetApplicationRequest(event.getApplicationKey()).sendAndParse()
                            .then(
                                (application: Application) => {
                                    if (application.getState() == "stopped") {
                                        showWarning(message);
                                    }
                                })
                            .catch((reason: any) => { //app was uninstalled
                                showWarning(message);
                            });

                        this.unShown(shownHandler);
                    };

                    this.onShown(shownHandler);

                }

            }

        };

        MaskContentWizardPanelEvent.on(event => {
            if (this.getPersistedItem().getContentId().equals(event.getContentId())) {
                this.params.actions.suspendActions(event.isMask());
            }
        });

        ContentPermissionsAppliedEvent.on((event) => this.contentPermissionsUpdated(event.getContent()));
    }

    protected doLoadData(): Q.Promise<Content> {
        if (ContentWizardPanel.debug) {
            console.debug("ContentWizardPanel.doLoadData");
        }
        return new ContentWizardDataLoader().loadData(this.contentParams)
            .then((loader) => {
                if (ContentWizardPanel.debug) {
                    console.debug("ContentWizardPanel.doLoadData: loaded data", loader);
                }
                if (loader.content) {
                    // in case of new content will be created in super.loadData()
                    this.isNew = false;
                    this.setPersistedItem(loader.content);
                }
                this.defaultModels = loader.defaultModels;
                this.site = loader.siteContent;
                this.contentType = loader.contentType;
                this.parentContent = loader.parentContent;
                this.contentCompareStatus = loader.compareStatus;

            }).then(() => super.doLoadData());
    }


    protected createFormIcon(): ThumbnailUploaderEl {
        var thumbnailUploader = new ThumbnailUploaderEl({
            name: 'thumbnail-uploader',
            deferred: true
        });

        if (this.contentParams.createSite || this.getPersistedItem().isSite()) {
            thumbnailUploader.addClass("site");
        }

        return thumbnailUploader;
    }

    public getFormIcon(): ThumbnailUploaderEl {
        return <ThumbnailUploaderEl> super.getFormIcon();
    }

    protected createMainToolbar(): Toolbar {
        return new ContentWizardToolbar({
            saveAction: this.wizardActions.getSaveAction(),
            deleteAction: this.wizardActions.getDeleteAction(),
            duplicateAction: this.wizardActions.getDuplicateAction(),
            previewAction: this.wizardActions.getPreviewAction(),
            publishAction: this.wizardActions.getPublishAction(),
            publishTreeAction: this.wizardActions.getPublishTreeAction(),
            unpublishAction: this.wizardActions.getUnpublishAction(),
            showLiveEditAction: this.wizardActions.getShowLiveEditAction(),
            showFormAction: this.wizardActions.getShowFormAction(),
            showSplitEditAction: this.wizardActions.getShowSplitEditAction()
        });
    }

    public getMainToolbar(): ContentWizardToolbar {
        return <ContentWizardToolbar> super.getMainToolbar();
    }

    protected createWizardHeader(): WizardHeader {
        var header = new WizardHeaderWithDisplayNameAndNameBuilder()
            .setDisplayNameGenerator(this.displayNameScriptExecutor)
            .build();

        if (this.parentContent) {
            header.setPath(this.parentContent.getPath().prettifyUnnamedPathElements().toString() + "/");
        } else {
            header.setPath("/");
        }

        var existing = this.getPersistedItem();
        if (!!existing) {
            header.initNames(existing.getDisplayName(), existing.getName().toString(), false);
        }

        return header;
    }

    public getWizardHeader(): WizardHeaderWithDisplayNameAndName {
        return <WizardHeaderWithDisplayNameAndName> super.getWizardHeader();
    }

    protected createLivePanel(): Panel {
        var liveFormPanel;
        var isSiteOrWithinSite = !!this.site || this.contentParams.createSite;
        var isPageTemplate = this.contentType.isPageTemplate();
        var isShortcut = this.contentType.isShortcut();

        if ((isSiteOrWithinSite || isPageTemplate) && !isShortcut) {

            liveFormPanel = new LiveFormPanel(<LiveFormPanelConfig> {
                contentWizardPanel: this,
                contentType: this.contentType.getContentTypeName(),
                defaultModels: this.defaultModels
            });
        }
        return liveFormPanel;
    }

    public getLivePanel(): LiveFormPanel {
        return <LiveFormPanel> super.getLivePanel();
    }

    doRenderOnDataLoaded(rendered): Q.Promise<boolean> {

        return super.doRenderOnDataLoaded(rendered).then((rendered) => {
            if (ContentWizardPanel.debug) {
                console.debug("ContentWizardPanel.doRenderOnDataLoaded");
            }

            this.initPublishButtonForMobile();

            if (this.contentType.hasContentDisplayNameScript()) {
                this.displayNameScriptExecutor.setScript(this.contentType.getContentDisplayNameScript());
            }

            this.addClass("content-wizard-panel");

            this.inMobileViewMode = false;

            var responsiveItem = ResponsiveManager.onAvailableSizeChanged(this, this.availableSizeChangedHandler.bind(this));

            this.onRemoved((event) => {
                ResponsiveManager.unAvailableSizeChanged(this);
            });

            this.onValidityChanged((event: ValidityChangedEvent) => {
                let isThisValid = event.isValid() && this.isValid(); // event.isValid() = false will prevent the call to this.isValid()
                this.isContentFormValid = isThisValid;
                var thumbnailUploader = this.getFormIcon();
                thumbnailUploader.toggleClass("invalid", isThisValid);
                this.getContentWizardToolbarPublishControls().setContentCanBePublished(this.checkContentCanBePublished());
                if (!this.isNew) {
                    this.displayValidationErrors();
                }
            });

            var thumbnailUploader = this.getFormIcon();
            if (thumbnailUploader) {
                thumbnailUploader.setEnabled(!this.contentType.isImage());
                thumbnailUploader.onFileUploaded(this.onFileUploaded.bind(this));
            }

            return rendered;
        });
    }

    private availableSizeChangedHandler(item: ResponsiveItem) {
        if (this.isVisible()) {
            this.updateStickyToolbar();
            if (item.isInRangeOrSmaller(ResponsiveRanges._720_960)) {
                this.inMobileViewMode = true;
                if (this.isSplitView()) {
                    if (this.isMinimized()) {
                        this.toggleMinimize();
                    }
                    this.showForm();
                    this.getCycleViewModeButton().selectActiveAction(this.wizardActions.getShowFormAction());
                }
            } else {
                if (this.inMobileViewMode && this.isLiveView()) {
                    this.inMobileViewMode = false;
                    this.showSplitEdit();
                }

                this.inMobileViewMode = false;
            }
        }
    }

    private onFileUploaded(event: FileUploadedEvent<Content>) {
        var newPersistedContent: Content = event.getUploadItem().getModel();
        this.setPersistedItem(newPersistedContent);
        this.updateMetadataAndMetadataStepForms(newPersistedContent);
        this.updateThumbnailWithContent(newPersistedContent);
        var contentToDisplay = (newPersistedContent.getDisplayName() && newPersistedContent.getDisplayName().length > 0) ?
                               '\"' + newPersistedContent.getDisplayName() + '\"' : "Content";
        showFeedback(contentToDisplay + ' saved');
    }

    private handleSiteConfigApply() {
        var siteConfigApplyHandler = (event: ContentRequiresSaveEvent) => {
            if (this.isCurrentContentId(event.getContentId())) {
                this.saveChanges();
            }
        };

        ContentRequiresSaveEvent.on(siteConfigApplyHandler);
        this.onClosed(() => {
            ContentRequiresSaveEvent.un(siteConfigApplyHandler);
        });
    }

    private handleBrokenImageInTheWizard() {
        var brokenImageHandler = (event: ImageErrorEvent) => {
            if (this.isCurrentContentId(event.getContentId())) {
                this.wizardActions.setDeleteOnlyMode(this.getPersistedItem());
            }
        };

        ImageErrorEvent.on(brokenImageHandler);
        this.onClosed(() => {
            ImageErrorEvent.un(brokenImageHandler);
        });
    }

    getContentType(): ContentType {
        return this.contentType;
    }

    giveInitialFocus() {

        if (this.contentType.hasContentDisplayNameScript()) {
            if (!this.contentWizardStepForm.giveFocus()) {
                this.getWizardHeader().giveFocus();
            }
        } else {
            this.getWizardHeader().giveFocus();
        }

        this.startRememberFocus();
    }

    private createSteps(): wemQ.Promise<Mixin[]> {

        this.contentWizardStepForm = new ContentWizardStepForm();
        this.settingsWizardStepForm = new SettingsWizardStepForm();
        this.securityWizardStepForm = new SecurityWizardStepForm();

        var applicationKeys = this.site ? this.site.getApplicationKeys() : [];
        var applicationPromises = applicationKeys.map((key: ApplicationKey) => this.fetchApplication(key));

        return new IsAuthenticatedRequest().sendAndParse().then((loginResult: LoginResult) => {
            this.checkSecurityWizardStepFormAllowed(loginResult);
            this.enablePublishIfAllowed(loginResult);
            return wemQ.all(applicationPromises);
        }).then((applications: Application[]) => {
            for (var i = 0; i < applications.length; i++) {
                var app = applications[i];
                if (!app.isStarted()) {
                    var deferred = wemQ.defer<Mixin[]>();
                    deferred.reject(new Exception("Application '" + app.getDisplayName() +
                                                      "' required by the site is not available. " +
                                                      "Make sure all applications specified in the site configuration are installed and started.",
                        ExceptionType.WARNING));
                    return deferred.promise;
                }
            }

            var metadataMixinPromises: wemQ.Promise<Mixin>[] = [];
            metadataMixinPromises = metadataMixinPromises.concat(
                this.contentType.getMetadata().map((name: MixinName) => {
                    return this.fetchMixin(name);
                }));

            applications.forEach((app: Application) => {
                metadataMixinPromises = metadataMixinPromises.concat(
                    app.getMetaSteps().map((name: MixinName) => {
                        return this.fetchMixin(name);
                    })
                );
            });

            return wemQ.all(metadataMixinPromises);
        }).then((mixins: Mixin[]) => {
            var steps: WizardStep[] = [];

            this.contentWizardStep = new WizardStep(this.contentType.getDisplayName(), this.contentWizardStepForm);
            steps.push(this.contentWizardStep);

            mixins.forEach((mixin: Mixin, index: number) => {
                if (!this.metadataStepFormByName[mixin.getMixinName().toString()]) {
                    var stepForm = new ContentWizardStepForm();
                    this.metadataStepFormByName[mixin.getMixinName().toString()] = stepForm;
                    steps.splice(index + 1, 0, new WizardStep(mixin.getDisplayName(), stepForm));
                }
            });
            this.settingsWizardStep = new WizardStep("Settings", this.settingsWizardStepForm);
            steps.push(this.settingsWizardStep);

            if (this.isSecurityWizardStepFormAllowed) {
                steps.push(new WizardStep("Security", this.securityWizardStepForm));
            }


            this.setSteps(steps);

            return mixins;
        });
    }


    close(checkCanClose: boolean = false) {
        var liveFormPanel = this.getLivePanel();
        if (liveFormPanel) {
            liveFormPanel.skipNextReloadConfirmation(true);
        }
        super.close(checkCanClose);
    }

    private fetchMixin(name: MixinName): wemQ.Promise<Mixin> {
        var deferred = wemQ.defer<Mixin>();
        new GetMixinByQualifiedNameRequest(name).sendAndParse().then((mixin) => {
            deferred.resolve(mixin);
        }).catch((reason) => {
            deferred.reject(new Exception("Content cannot be opened. Required mixin '" + name.toString() + "' not found.",
                ExceptionType.WARNING));
        }).done();
        return deferred.promise;
    }

    private fetchApplication(key: ApplicationKey): wemQ.Promise<Application> {
        var deferred = wemQ.defer<Application>();
        new GetApplicationRequest(key).sendAndParse().then((mod) => {
            deferred.resolve(mod);
        }).catch((reason) => {
            deferred.reject(new Exception("Content cannot be opened. Required application '" + key.toString() + "' not found.",
                ExceptionType.WARNING));
        }).done();
        return deferred.promise;
    }

    saveChanges(): wemQ.Promise<Content> {
        var liveFormPanel = this.getLivePanel();
        if (liveFormPanel) {
            liveFormPanel.skipNextReloadConfirmation(true);
        }
        this.setRequireValid(false);
        return super.saveChanges();
    }

    private isCurrentContentId(id: ContentId): boolean {
        return this.getPersistedItem() && id && this.getPersistedItem().getContentId().equals(id);
    }

    private persistedItemPathIsDescendantOrEqual(path: ContentPath): boolean {
        return this.getPersistedItem().getPath().isDescendantOf(path) || this.getPersistedItem().getPath().equals(path);
    }

    private updateWizard(content: Content, unchangedOnly: boolean = true) {

        this.updateWizardHeader(content);
        this.updateWizardStepForms(content, unchangedOnly);
        this.updateMetadataAndMetadataStepForms(content.clone(), unchangedOnly);
        this.resetLastFocusedElement();
    }

    private listenToContentEvents() {

        let serverEvents = ContentServerEventsHandler.getInstance();

        var deleteHandler = (event: ContentDeletedEvent) => {
            if (this.getPersistedItem()) {
                event.getDeletedItems().filter((deletedItem) => {
                    return !!deletedItem;
                }).some((deletedItem) => {
                    if (this.getPersistedItem().getPath().equals(deletedItem.getContentPath())) {
                        if (deletedItem.isPending()) {
                            let publishControls = this.getContentWizardToolbarPublishControls();
                            publishControls.setContentCanBePublished(true, false);
                            publishControls.setCompareStatus(CompareStatus.PENDING_DELETE);
                            this.contentCompareStatus = CompareStatus.PENDING_DELETE;
                        } else {
                            this.close();
                        }

                        return true;
                    }
                });
            }
        };

        var publishOrUnpublishHandler = (contents: ContentSummaryAndCompareStatus[]) => {
            contents.forEach(content => {
                if (this.isCurrentContentId(content.getContentId())) {

                    this.contentCompareStatus = content.getCompareStatus();
                    this.getContentWizardToolbarPublishControls().setCompareStatus(this.contentCompareStatus);

                    this.getWizardHeader().disableNameGeneration(this.contentCompareStatus === CompareStatus.EQUAL);
                }
            });
        };

        var updateHandler = (contentId: ContentId, unchangedOnly: boolean = true, versionChanged: boolean = false) => {
            var isCurrent = this.isCurrentContentId(contentId);

            // Find all html areas in form
            var htmlAreas = this.getHtmlAreasInForm(this.getContentType().getForm());
            // And check if html area actually contains event.getContentId() that was updated
            var areasContainId = this.doAreasContainId(htmlAreas, contentId.toString());

            if (isCurrent || areasContainId) {
                new GetContentByIdRequest(this.getPersistedItem().getContentId()).sendAndParse().done((content: Content) => {
                    this.setPersistedItem(content);
                    this.updateWizard(content, unchangedOnly);
                    if (versionChanged) {
                        this.updateLiveFormOnVersionChange();
                    } else if (this.isContentRenderable()) {
                        // also update live form panel for renderable content without asking
                        let liveFormPanel = this.getLivePanel();
                        liveFormPanel.skipNextReloadConfirmation(true);
                        liveFormPanel.loadPage(false);
                    }
                    this.wizardActions.setDeleteOnlyMode(this.getPersistedItem(), false);
                });
            }
        };

        var sortedHandler = (data: ContentSummaryAndCompareStatus[]) => {
            var indexOfCurrentContent;
            var wasSorted = data.some((sorted: ContentSummaryAndCompareStatus, index: number) => {
                indexOfCurrentContent = index;
                return this.isCurrentContentId(sorted.getContentId());
            });
            if (wasSorted) {
                this.getContentWizardToolbarPublishControls().setCompareStatus(data[indexOfCurrentContent].getCompareStatus());
            }
        };

        var activeContentVersionSetHandler = (event: ActiveContentVersionSetEvent) => updateHandler(event.getContentId(), false, true);
        var contentUpdatedHanlder = (event: ContentUpdatedEvent) => updateHandler(event.getContentId());

        var movedHandler = (data: ContentSummaryAndCompareStatus[], oldPaths: ContentPath[]) => {
            var wasMoved = oldPaths.some((oldPath: ContentPath) => {
                return this.persistedItemPathIsDescendantOrEqual(oldPath);
            });

            if (wasMoved) {
                updateHandler(this.getPersistedItem().getContentId());
            }
        };

        ActiveContentVersionSetEvent.on(activeContentVersionSetHandler);
        ContentUpdatedEvent.on(contentUpdatedHanlder);
        ContentDeletedEvent.on(deleteHandler);
        ContentServerEventsHandler.getInstance().onContentMoved(movedHandler);
        ContentServerEventsHandler.getInstance().onContentSorted(sortedHandler);

        serverEvents.onContentPublished(publishOrUnpublishHandler);
        serverEvents.onContentUnpublished(publishOrUnpublishHandler);

        this.onClosed(() => {
            ActiveContentVersionSetEvent.un(activeContentVersionSetHandler);
            ContentUpdatedEvent.un(contentUpdatedHanlder);
            ContentDeletedEvent.un(deleteHandler);
            ContentServerEventsHandler.getInstance().unContentMoved(movedHandler);
            ContentServerEventsHandler.getInstance().unContentSorted(sortedHandler);

            serverEvents.unContentPublished(publishOrUnpublishHandler);
            serverEvents.unContentUnpublished(publishOrUnpublishHandler);
        });
    }

    private updateLiveFormOnVersionChange() {
        var content = this.getPersistedItem(),
            formContext = this.createFormContext(content);

        if (!!this.siteModel) {
            this.unbindSiteModelListeners();
        }

        var liveFormPanel = this.getLivePanel();
        if (liveFormPanel) {

            var site = content.isSite() ? <Site>content : this.site;
            this.siteModel = new SiteModel(site);
            return this.initLiveEditModel(content, this.siteModel, formContext).then(() => {
                liveFormPanel.setModel(this.liveEditModel);
                liveFormPanel.skipNextReloadConfirmation(true);
                liveFormPanel.loadPage(false);
                this.updatePreviewActionVisibility();
                return wemQ(null);
            });

        }
        if (!this.siteModel && content.isSite()) {
            this.siteModel = new SiteModel(<Site>content);
        }
        if (this.siteModel) {
            this.initSiteModelListeners();
        }
    }

    private doAreasContainId(areas: string[], id: string): boolean {
        var data: PropertyTree = this.getPersistedItem().getContentData();

        return areas.some((area) => {
            var property = data.getProperty(area);
            if (property && property.hasNonNullValue() && property.getType().equals(ValueTypes.STRING)) {
                return property.getString().indexOf(id) >= 0
            }
        });
    }

    private getHtmlAreasInForm(formItemContainer: FormItemContainer): string[] {
        var result: string[] = [];

        formItemContainer.getFormItems().forEach((item) => {
            if (ObjectHelper.iFrameSafeInstanceOf(item, FieldSet)) {
                result = result.concat(this.getHtmlAreasInForm(<FieldSet> item));
            } else if (ObjectHelper.iFrameSafeInstanceOf(item, FormItemSet)) {
                result = result.concat(this.getHtmlAreasInForm(<FormItemSet> item));
            } else if (ObjectHelper.iFrameSafeInstanceOf(item, Input)) {
                var input = <Input> item;
                if (input.getInputType().getName() === "HtmlArea") {
                    result.push(input.getPath().toString());
                }
            }
        })

        return result;
    }

    doLayout(persistedContent: Content): wemQ.Promise<void> {

        return super.doLayout(persistedContent).then(() => {

            if (ContentWizardPanel.debug) {
                console.debug("ContentWizardPanel.doLayout", persistedContent);
            }

            this.updateThumbnailWithContent(persistedContent);

            var publishControls = this.getContentWizardToolbarPublishControls();
            let wizardHeader = this.getWizardHeader();

            ContentSummaryAndCompareStatusFetcher.fetchByContent(persistedContent).then((summaryAndStatus) => {
                this.contentCompareStatus = summaryAndStatus.getCompareStatus();

                wizardHeader.disableNameGeneration(this.contentCompareStatus !== CompareStatus.NEW);

                publishControls.setCompareStatus(this.contentCompareStatus);
                publishControls.setLeafContent(!this.getPersistedItem().hasChildren());

                this.managePublishButtonStateForMobile(this.contentCompareStatus);
            });

            wizardHeader.setSimplifiedNameGeneration(persistedContent.getType().isDescendantOfMedia());
            publishControls.enableActionsForExisting(persistedContent);

            if (this.isRendered()) {

                var viewedContent = this.assembleViewedContent(persistedContent.newBuilder()).build();
                if (viewedContent.equals(persistedContent) || this.skipValidation) {

                    // force update wizard with server bounced values to erase incorrect ones
                    this.updateWizard(persistedContent, false);

                    var liveFormPanel = this.getLivePanel();
                    if (liveFormPanel) {
                        liveFormPanel.loadPage();
                    }
                } else {
                    console.warn("Received Content from server differs from what's viewed:");
                    if (!viewedContent.getContentData().equals(persistedContent.getContentData())) {
                        console.warn(" inequality found in Content.data");
                        if (persistedContent.getContentData() && viewedContent.getContentData()) {
                            console.warn(" comparing persistedContent.data against viewedContent.data:");
                            new PropertyTreeComparator().compareTree(persistedContent.getContentData(),
                                viewedContent.getContentData());
                        }
                    }
                    if (!ObjectHelper.equals(viewedContent.getPage(), persistedContent.getPage())) {
                        console.warn(" inequality found in Content.page");
                        if (persistedContent.getPage() && viewedContent.getPage()) {
                            console.warn(" comparing persistedContent.page.config against viewedContent.page.config:");
                            new PropertyTreeComparator().compareTree(persistedContent.getPage().getConfig(),
                                viewedContent.getPage().getConfig());
                        }
                    }
                    if (!ObjectHelper.arrayEquals(viewedContent.getAllExtraData(), persistedContent.getAllExtraData())) {
                        console.warn(" inequality found in Content.meta");
                    }
                    if (!ObjectHelper.equals(viewedContent.getAttachments(), persistedContent.getAttachments())) {
                        console.warn(" inequality found in Content.attachments");
                    }
                    if (!ObjectHelper.equals(viewedContent.getPermissions(), persistedContent.getPermissions())) {
                        console.warn(" inequality found in Content.permissions");
                    }
                    console.warn(" viewedContent: ", viewedContent);
                    console.warn(" persistedContent: ", persistedContent);

                    if (persistedContent.getType().isDescendantOfMedia()) {
                        this.updateMetadataAndMetadataStepForms(persistedContent.clone());
                    } else {
                        ConfirmationDialog.get().setQuestion(
                            "Received Content from server differs from what you have. Would you like to load changes from server?").setYesCallback(
                            () => this.doLayoutPersistedItem(persistedContent.clone())).setNoCallback(() => {/* Do nothing... */
                        }).show();
                    }
                }

            } else {

                return this.doLayoutPersistedItem(persistedContent.clone());
            }

        });

    }

    saveChangesWithoutValidation(): wemQ.Promise<Content> {
        this.skipValidation = true;

        let result = this.saveChanges();
        result.then(() => this.skipValidation = false);

        return result;
    }

    private updateThumbnailWithContent(content: Content) {
        var thumbnailUploader = this.getFormIcon();

        thumbnailUploader
            .setParams({
                id: content.getContentId().toString()
            })
            .setEnabled(!content.isImage())
            .setValue(new ContentIconUrlResolver().setContent(content).resolve());

        thumbnailUploader.toggleClass("invalid", !content.isValid());
    }

    // Remember that content has been cloned here and it is not the persistedItem any more
    private doLayoutPersistedItem(content: Content): wemQ.Promise<void> {
        if (ContentWizardPanel.debug) {
            console.debug("ContentWizardPanel.doLayoutPersistedItem");
        }

        this.toggleClass("rendered", false);

        this.wizardActions.getShowLiveEditAction().setEnabled(false);
        this.wizardActions.getPreviewAction().setVisible(false);
        this.wizardActions.getPreviewAction().setEnabled(false);

        this.setupWizardLiveEdit(content.isSite() || this.site && !content.getType().isShortcut());

        return this.createSteps().then((schemas: Mixin[]) => {

            var formContext = this.createFormContext(content);

            var contentData = content.getContentData();

            contentData.onChanged(this.dataChangedListener);

            var formViewLayoutPromises = [];
            formViewLayoutPromises.push(this.contentWizardStepForm.layout(formContext, contentData, this.contentType.getForm()));
            // Must pass FormView from contentWizardStepForm displayNameScriptExecutor, since a new is created for each call to renderExisting
            this.displayNameScriptExecutor.setFormView(this.contentWizardStepForm.getFormView());
            this.settingsWizardStepForm.layout(content);
            this.settingsWizardStepForm.getModel().onPropertyChanged(this.dataChangedListener);

            if (this.isSecurityWizardStepFormAllowed) {
                this.securityWizardStepForm.layout(content);
            }


            schemas.forEach((schema: Mixin, index: number) => {
                var extraData = content.getExtraData(schema.getMixinName());
                if (!extraData) {
                    extraData = new ExtraData(schema.getMixinName(), new PropertyTree());
                    content.getAllExtraData().push(extraData);
                }
                var metadataFormView = this.metadataStepFormByName[schema.getMixinName().toString()];
                var metadataForm = new FormBuilder().addFormItems(schema.getFormItems()).build();

                var data = extraData.getData();
                data.onChanged(this.dataChangedListener);

                formViewLayoutPromises.push(metadataFormView.layout(formContext, data, metadataForm));
            });

            return wemQ.all(formViewLayoutPromises).spread<any>(() => {

                this.contentWizardStepForm.getFormView().addClass("panel-may-display-validation-errors");
                if (this.isNew) {
                    this.contentWizardStepForm.getFormView().highlightInputsOnValidityChange(true);
                } else {
                    this.displayValidationErrors();
                }

                this.enableDisplayNameScriptExecution(this.contentWizardStepForm.getFormView());

                var liveFormPanel = this.getLivePanel();
                if (liveFormPanel) {

                    if (!this.liveEditModel) {
                        var site = content.isSite() ? <Site>content : this.site;
                        this.siteModel = new SiteModel(site);
                        return this.initLiveEditModel(content, this.siteModel, formContext).then(() => {
                            liveFormPanel.setModel(this.liveEditModel);
                            liveFormPanel.loadPage();
                            this.updatePreviewActionVisibility();
                            return wemQ(null);
                        });
                    }
                    else {
                        liveFormPanel.loadPage();
                    }
                }
                if (!this.siteModel && content.isSite()) {
                    this.siteModel = new SiteModel(<Site>content);
                }
                if (this.siteModel) {
                    this.initSiteModelListeners();
                }
                return wemQ(null);
            });
        });
    }

    private setupWizardLiveEdit(renderable: boolean) {
        this.toggleClass("rendered", renderable);

        this.wizardActions.getShowLiveEditAction().setEnabled(renderable);
        this.wizardActions.getShowSplitEditAction().setEnabled(renderable);
        this.wizardActions.getPreviewAction().setVisible(renderable);

        this.getCycleViewModeButton().setVisible(renderable);

        if (this.getEl().getWidth() > ResponsiveRanges._720_960.getMaximumRange() && renderable) {

            this.wizardActions.getShowSplitEditAction().execute();
        } else if (!!this.getSplitPanel()) {

            this.wizardActions.getShowFormAction().execute();
        }
    }

    private initSiteModelListeners() {
        this.siteModel.onApplicationAdded(this.applicationAddedListener);
        this.siteModel.onApplicationRemoved(this.applicationRemovedListener);
        this.siteModel.onApplicationUnavailable(this.applicationUnavailableListener);
    }

    private unbindSiteModelListeners() {
        this.siteModel.unApplicationAdded(this.applicationAddedListener);
        this.siteModel.unApplicationRemoved(this.applicationRemovedListener);
        this.siteModel.unApplicationUnavailable(this.applicationUnavailableListener);
    }

    private removeMetadataStepForms() {
        var applicationKeys = this.siteModel.getApplicationKeys();
        var applicationPromises = applicationKeys.map(
            (key: ApplicationKey) => new GetApplicationRequest(key).sendAndParse());

        return wemQ.all(applicationPromises).then((applications: Application[]) => {
            var metadataMixinPromises: wemQ.Promise<Mixin>[] = [];

            applications.forEach((app: Application) => {
                metadataMixinPromises = metadataMixinPromises.concat(
                    app.getMetaSteps().map((name: MixinName) => {
                        return new GetMixinByQualifiedNameRequest(name).sendAndParse();
                    })
                );
            });

            return wemQ.all(metadataMixinPromises);
        }).then((mixins: Mixin[]) => {
            var activeMixinsNames = MixinNames.create().fromMixins(mixins).build();

            var panelNamesToRemoveBuilder = MixinNames.create();

            for (var key in this.metadataStepFormByName) {// check all old mixin panels
                var mixinName = new MixinName(key);
                if (!activeMixinsNames.contains(mixinName)) {
                    panelNamesToRemoveBuilder.addMixinName(mixinName);
                }
            }
            var panelNamesToRemove = panelNamesToRemoveBuilder.build();
            panelNamesToRemove.forEach((panelName: MixinName) => {
                this.removeStepWithForm(this.metadataStepFormByName[panelName.toString()]);
                delete this.metadataStepFormByName[panelName.toString()];
            });

            return mixins;
        }).catch((reason: any) => {
            DefaultErrorHandler.handle(reason);
        }).done();
    }

    private addMetadataStepForms(applicationKey: ApplicationKey) {
        new GetApplicationRequest(applicationKey).sendAndParse().then((currentApplication: Application) => {

            var mixinNames = currentApplication.getMetaSteps();

            //remove already existing extraData
            var mixinNamesToAdd = mixinNames.filter((mixinName: MixinName) => {
                return !this.metadataStepFormByName[mixinName.toString()];
            });

            var getMixinPromises: wemQ.Promise<Mixin>[] = mixinNamesToAdd.map((name: MixinName) => {
                return new GetMixinByQualifiedNameRequest(name).sendAndParse();
            });
            return wemQ.all(getMixinPromises);
        }).then((mixins: Mixin[]) => {
            mixins.forEach((mixin: Mixin) => {
                if (!this.metadataStepFormByName[mixin.getMixinName().toString()]) {

                    var stepForm = new ContentWizardStepForm();
                    this.metadataStepFormByName[mixin.getMixinName().toString()] = stepForm;

                    var wizardStep = new WizardStep(mixin.getDisplayName(), stepForm);
                    this.insertStepBefore(wizardStep, this.settingsWizardStep);

                    var extraData = new ExtraData(mixin.getMixinName(), new PropertyTree());

                    stepForm.layout(this.createFormContext(this.getPersistedItem()), extraData.getData(), mixin.toForm());
                }
            });

            return mixins;
        }).catch((reason: any) => {
            DefaultErrorHandler.handle(reason);
        }).done();
    }

    private initLiveEditModel(content: Content, siteModel: SiteModel, formContext: ContentFormContext): wemQ.Promise<void> {
        this.initSiteModelListeners();
        this.liveEditModel =
            LiveEditModel.create().setParentContent(this.parentContent).setContent(content).setContentFormContext(formContext).setSiteModel(
                siteModel).build();
        return this.liveEditModel.init(this.defaultModels.getPageTemplate(), this.defaultModels.getPageDescriptor());
    }

    persistNewItem(): wemQ.Promise<Content> {
        return new PersistNewContentRoutine(this).setCreateContentRequestProducer(this.produceCreateContentRequest).execute().then(
            (content: Content) => {
                showFeedback('Content created');
                return content;
            });
    }

    postPersistNewItem(persistedContent: Content): wemQ.Promise<Content> {

        if (persistedContent.isSite()) {
            this.site = <Site>persistedContent;
        }

        return wemQ(persistedContent);
    }

    private produceCreateContentRequest(): wemQ.Promise<CreateContentRequest> {
        var deferred = wemQ.defer<CreateContentRequest>();

        var parentPath = this.parentContent != null ? this.parentContent.getPath() : ContentPath.ROOT;

        if (this.contentType.getContentTypeName().isMedia()) {
            deferred.resolve(null);
        } else {
            deferred.resolve(
                new CreateContentRequest()
                    .setRequireValid(this.requireValid)
                    .setName(ContentUnnamed.newUnnamed())
                    .setParent(parentPath)
                    .setContentType(this.contentType.getContentTypeName())
                    .setDisplayName("")     // new content is created on wizard open so display name is always empty
                    .setData(new PropertyTree()).setExtraData([]));
        }

        return deferred.promise;
    }

    updatePersistedItem(): wemQ.Promise<Content> {
        var persistedContent = this.getPersistedItem();
        var viewedContent = this.assembleViewedContent(persistedContent.newBuilder()).build();

        var updatePersistedContentRoutine = new UpdatePersistedContentRoutine(this, persistedContent,
            viewedContent).setUpdateContentRequestProducer(
            this.produceUpdateContentRequest);

        return updatePersistedContentRoutine.execute().then((content: Content) => {

            if (persistedContent.getName().isUnnamed() && !content.getName().isUnnamed()) {
                this.notifyContentNamed(content);
            }
            var contentToDisplay = (content.getDisplayName() && content.getDisplayName().length > 0) ?
                                   '\"' + content.getDisplayName() + '\"' : "Content";
            showFeedback(contentToDisplay + ' saved');

            return content;
        });
    }

    private produceUpdateContentRequest(persistedContent: Content, viewedContent: Content): UpdateContentRequest {
        var persistedContent = this.getPersistedItem();

        var updateContentRequest = new UpdateContentRequest(persistedContent.getId()).setRequireValid(this.requireValid).setContentName(
            viewedContent.getName()).setDisplayName(viewedContent.getDisplayName()).setData(viewedContent.getContentData()).setExtraData(
            viewedContent.getAllExtraData()).setOwner(viewedContent.getOwner()).setLanguage(viewedContent.getLanguage());

        return updateContentRequest;
    }

    hasUnsavedChanges(): boolean {
        if (!this.isRendered()) {
            return false;
        }
        var persistedContent: Content = this.getPersistedItem();
        if (persistedContent == undefined) {
            return true;
        } else {

            var viewedContent = this.assembleViewedContent(new ContentBuilder(persistedContent)).build();
            return !viewedContent.equals(persistedContent, true);
        }
    }

    private enableDisplayNameScriptExecution(formView: FormView) {

        if (this.displayNameScriptExecutor.hasScript()) {

            formView.onKeyUp((event: KeyboardEvent) => {
                if (this.displayNameScriptExecutor.hasScript()) {
                    this.getWizardHeader().setDisplayName(this.displayNameScriptExecutor.execute());
                }
            });
        }
    }

    private assembleViewedContent(viewedContentBuilder: ContentBuilder): ContentBuilder {

        viewedContentBuilder.setName(this.resolveContentNameForUpdateRequest());
        viewedContentBuilder.setDisplayName(this.getWizardHeader().getDisplayName());
        if (this.contentWizardStepForm) {
            viewedContentBuilder.setData(this.contentWizardStepForm.getData());
        }

        var extraData: ExtraData[] = [];
        for (var key in this.metadataStepFormByName) {
            if (this.metadataStepFormByName.hasOwnProperty(key)) {
                extraData.push(new ExtraData(new MixinName(key), this.metadataStepFormByName[key].getData()));
            }
        }

        viewedContentBuilder.setExtraData(extraData);

        this.settingsWizardStepForm.getModel().apply(viewedContentBuilder);

        viewedContentBuilder.setPage(this.assembleViewedPage());
        return viewedContentBuilder;
    }

    private assembleViewedPage(): Page {
        var liveFormPanel = this.getLivePanel();
        return liveFormPanel ? liveFormPanel.getPage() : null;
    }

    private resolveContentNameForUpdateRequest(): ContentName {
        if (StringHelper.isEmpty(this.getWizardHeader().getName())) {
            if (this.getPersistedItem().getName().isUnnamed()) {
                return this.getPersistedItem().getName();
            } else {
                return ContentUnnamed.newUnnamed();
            }
        }
        return ContentName.fromString(this.getWizardHeader().getName());
    }

    setRequireValid(requireValid: boolean) {
        this.requireValid = requireValid;
    }

    showLiveEdit() {
        if (!this.inMobileViewMode) {
            this.showSplitEdit();
            return;
        }

        this.getSplitPanel().addClass("toggle-live").removeClass("toggle-form toggle-split");
        this.getMainToolbar().toggleClass("live", true);
        this.toggleClass("form", false);

        this.openLiveEdit();
    }

    showSplitEdit() {
        this.getSplitPanel().addClass("toggle-split").removeClass("toggle-live toggle-form");
        this.getMainToolbar().toggleClass("live", true);
        this.toggleClass("form", false);

        this.openLiveEdit();
    }

    showForm() {
        this.getSplitPanel().addClass("toggle-form").removeClass("toggle-live toggle-split");
        this.getMainToolbar().toggleClass("live", false);
        this.toggleClass("form", true);

        this.closeLiveEdit();
    }

    private isSplitView(): boolean {
        return this.getSplitPanel() && this.getSplitPanel().hasClass("toggle-split");
    }

    private isLiveView(): boolean {
        return this.getSplitPanel() && this.getSplitPanel().hasClass("toggle-live");
    }

    private displayValidationErrors() {
        if (!this.isContentFormValid) {
            this.contentWizardStepForm.displayValidationErrors(true);
        }

        for (var key in this.metadataStepFormByName) {
            if (this.metadataStepFormByName.hasOwnProperty(key)) {
                var form = this.metadataStepFormByName[key];
                if (!form.isValid()) {
                    form.displayValidationErrors(true);
                }
            }
        }
    }

    public checkContentCanBePublished(): boolean {
        if (this.getContentWizardToolbarPublishControls().isPendingDelete()) {
            // allow deleting published content without validity check
            return true;
        }

        var allMetadataFormsValid = true,
            allMetadataFormsHaveValidUserInput = true;
        for (var key in this.metadataStepFormByName) {
            if (this.metadataStepFormByName.hasOwnProperty(key)) {
                var form = this.metadataStepFormByName[key];
                if (!form.isValid()) {
                    allMetadataFormsValid = false;
                }
                var formHasValidUserInput = form.getFormView().hasValidUserInput();
                if (!formHasValidUserInput) {
                    allMetadataFormsHaveValidUserInput = false;
                }
            }
        }
        return this.isContentFormValid && allMetadataFormsValid && allMetadataFormsHaveValidUserInput;
    }

    getContextWindowToggler(): TogglerButton {
        return this.getMainToolbar().getContextWindowToggler();
    }

    getComponentsViewToggler(): TogglerButton {
        return this.getMainToolbar().getComponentsViewToggler();
    }

    getContentWizardToolbarPublishControls(): ContentWizardToolbarPublishControls {
        return this.getMainToolbar().getContentWizardToolbarPublishControls();
    }

    getCycleViewModeButton(): CycleButton {
        return this.getMainToolbar().getCycleViewModeButton();
    }

    getCloseAction(): Action {
        return this.wizardActions.getCloseAction();
    }

    onContentNamed(listener: (event: ContentNamedEvent)=>void) {
        this.contentNamedListeners.push(listener);
    }

    unContentNamed(listener: (event: ContentNamedEvent)=>void) {
        this.contentNamedListeners = this.contentNamedListeners.filter((curr) => {
            return curr != listener;
        });
        return this;
    }

    getContentCompareStatus(): CompareStatus {
        return this.contentCompareStatus;
    }

    private notifyContentNamed(content: Content) {
        this.contentNamedListeners.forEach((listener: (event: ContentNamedEvent)=>void)=> {
            listener.call(this, new ContentNamedEvent(this, content));
        });
    }

    private contentPermissionsUpdated(content: Content) {
        var persistedContent: Content = this.getPersistedItem();

        if (persistedContent && (content.getId() === persistedContent.getId())) {
            var updatedContent: Content = persistedContent.newBuilder().setInheritPermissionsEnabled(
                content.isInheritPermissionsEnabled()).setPermissions(content.getPermissions().clone()).build();
            this.setPersistedItem(updatedContent);
        }

    }

    private createFormContext(content: Content): ContentFormContext {
        var formContext: ContentFormContext = <ContentFormContext>ContentFormContext.create().setSite(this.site).setParentContent(
            this.parentContent).setPersistedContent(content).setContentTypeName(
            this.contentType ? this.contentType.getContentTypeName() : undefined).setShowEmptyFormItemSetOccurrences(
            this.isItemPersisted()).build();
        return formContext;
    }

    private checkSecurityWizardStepFormAllowed(loginResult: LoginResult) {

        if (this.getPersistedItem().isAnyPrincipalAllowed(loginResult.getPrincipals(), Permission.WRITE_PERMISSIONS)) {
            this.isSecurityWizardStepFormAllowed = true;
        }
    }

    private isPrincipalPresent(principalKey: PrincipalKey,
                               accessEntriesToCheck: AccessControlEntry[]): boolean {

        return accessEntriesToCheck.some((entry: AccessControlEntry) => {
            if (entry.getPrincipalKey().equals(principalKey)) {
                return true;
            }
        });
    }

    /**
     * Enables publish button if selected item has access entry with publish permission
     * for at least one of user's principals or if user contains Admin principal.
     * @param loginResult - user's authorisation state
     */
    private enablePublishIfAllowed(loginResult: LoginResult) {
        var entries = this.getPersistedItem().getPermissions().getEntries();
        var accessEntriesWithPublishPermissions: AccessControlEntry[] = entries.filter((item: AccessControlEntry) => {
            return item.isAllowed(Permission.PUBLISH);
        });

        loginResult.getPrincipals().some((principalKey: PrincipalKey) => {
            if (RoleKeys.ADMIN.equals(principalKey) ||
                this.isPrincipalPresent(principalKey, accessEntriesWithPublishPermissions)) {
                this.wizardActions.getPublishAction().setEnabled(true);
                return true;
            }
        });
    }

    /**
     * Synchronizes wizard's extraData step forms with passed content - erases steps forms (meta)data and populates it with content's (meta)data.
     * @param content
     */
    private updateMetadataAndMetadataStepForms(content: Content, unchangedOnly: boolean = true) {
        var contentCopy = content.clone();

        for (var key in this.metadataStepFormByName) {
            if (this.metadataStepFormByName.hasOwnProperty(key)) {

                var mixinName = new MixinName(key);
                var extraData = contentCopy.getExtraData(mixinName);
                if (!extraData) { // ensure ExtraData object corresponds to each step form
                    extraData = new ExtraData(mixinName, new PropertyTree());
                    contentCopy.getAllExtraData().push(extraData);
                }

                let form = this.metadataStepFormByName[key];
                form.getData().unChanged(this.dataChangedListener);

                let data = extraData.getData();
                data.onChanged(this.dataChangedListener);

                form.update(data, unchangedOnly);
            }
        }
    }

    private updateWizardStepForms(content: Content, unchangedOnly: boolean = true) {

        this.contentWizardStepForm.getData().unChanged(this.dataChangedListener);

        // remember to copy data to have persistedItem pristine
        var contentCopy = content.clone();
        contentCopy.getContentData().onChanged(this.dataChangedListener);

        this.contentWizardStepForm.update(contentCopy.getContentData(), unchangedOnly);
        this.contentWizardStepForm.validate();

        if (contentCopy.isSite()) {
            this.siteModel.update(<Site>contentCopy);
        }

        this.settingsWizardStepForm.update(contentCopy, unchangedOnly);

        if (this.isSecurityWizardStepFormAllowed) {
            this.securityWizardStepForm.update(contentCopy, unchangedOnly);
        }
    }

    private updateWizardHeader(content: Content) {

        this.updateThumbnailWithContent(content);

        this.getWizardHeader().initNames(content.getDisplayName(), content.getName().toString(), true, false);

        // case when content was moved
        this.getWizardHeader()
            .setPath(content.getPath().getParentPath().isRoot() ? "/" : content.getPath().getParentPath().toString() + "/");
    }

    private initPublishButtonForMobile() {

        var action: Action = new Action("Publish");
        action.setIconClass("publish-action");
        action.onExecuted(() => {
            this.wizardActions.getPublishAction().execute();
        });

        this.publishButtonForMobile = new DialogButton(action);
        this.publishButtonForMobile.addClass("mobile-edit-publish-button");

        this.subscribePublishButtonForMobileToPublishEvents();

        this.appendChild(this.publishButtonForMobile);
    }

    private managePublishButtonStateForMobile(compareStatus: CompareStatus) {
        var canBeShown = compareStatus !== CompareStatus.EQUAL;
        this.publishButtonForMobile.toggleClass("visible", canBeShown);
        this.publishButtonForMobile.setLabel("Publish " + CompareStatusFormatter.formatStatus(compareStatus) + " item");
    }

    private subscribePublishButtonForMobileToPublishEvents() {

        var serverPublishOrUnpublishHandler = (contents: ContentSummaryAndCompareStatus[]) => {
            contents.forEach(content => {
                if (this.isCurrentContentId(content.getContentId())) {
                    this.managePublishButtonStateForMobile(CompareStatus.EQUAL);
                }
            });
        };


        let serverEvents = ContentServerEventsHandler.getInstance();
        serverEvents.onContentPublished(serverPublishOrUnpublishHandler);
        serverEvents.onContentUnpublished(serverPublishOrUnpublishHandler);

        this.onClosed(() => {
            serverEvents.unContentPublished(serverPublishOrUnpublishHandler);
            serverEvents.unContentUnpublished(serverPublishOrUnpublishHandler);
        });
    }

    private openLiveEdit() {
        var livePanel = this.getLivePanel();

        this.getSplitPanel().showSecondPanel();
        livePanel.clearPageViewSelectionAndOpenInspectPage();
        this.showMinimizeEditButton();

        if (!this.livePanel.isRendered()) {
            this.liveMask.show();
        }
    }

    private closeLiveEdit() {
        this.getSplitPanel().hideSecondPanel();
        this.hideMinimizeEditButton();

        if (this.liveMask && this.liveMask.isVisible()) {
            this.liveMask.hide();
        }

        if (this.isMinimized()) {
            this.toggleMinimize();
        }
    }

    private isContentRenderable(): boolean {
        var isPageTemplateWithNoController = this.contentType.getContentTypeName().isPageTemplate() &&
                                             !this.liveEditModel.getPageModel().getController();

        return this.liveEditModel && (this.liveEditModel.isPageRenderable() || isPageTemplateWithNoController);
    }

    private updatePreviewActionVisibility() {
        this.wizardActions.getPreviewAction().setEnabled(this.isContentRenderable());

        this.liveEditModel.getPageModel().onPageModeChanged(()=> {
            this.wizardActions.getPreviewAction().setEnabled(this.isContentRenderable());
        });
    }

}
