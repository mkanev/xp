import {PageTemplate} from "../../../../../../common/js/content/page/PageTemplate";
import {PageTemplateKey} from "../../../../../../common/js/content/page/PageTemplateKey";
import {DescriptorKey} from "../../../../../../common/js/content/page/DescriptorKey";
import {Content} from "../../../../../../common/js/content/Content";
import {ContentId} from "../../../../../../common/js/content/ContentId";
import {ContentTypeName} from "../../../../../../common/js/schema/content/ContentTypeName";
import {Page} from "../../../../../../common/js/content/page/Page";
import {PageMode} from "../../../../../../common/js/content/page/PageMode";
import {PageModel} from "../../../../../../common/js/content/page/PageModel";
import {SiteModel} from "../../../../../../common/js/content/site/SiteModel";
import {LiveEditModel} from "../../../../../../common/js/liveedit/LiveEditModel";
import {PageDescriptor} from "../../../../../../common/js/content/page/PageDescriptor";
import {GetPageDescriptorByKeyRequest} from "../../../../../../common/js/content/page/GetPageDescriptorByKeyRequest";
import {GetPageTemplateByKeyRequest} from "../../../../../../common/js/content/page/GetPageTemplateByKeyRequest";
import {Component} from "../../../../../../common/js/content/page/region/Component";
import {ImageComponent} from "../../../../../../common/js/content/page/region/ImageComponent";
import {DescriptorBasedComponent} from "../../../../../../common/js/content/page/region/DescriptorBasedComponent";
import {PartComponent} from "../../../../../../common/js/content/page/region/PartComponent";
import {LayoutComponent} from "../../../../../../common/js/content/page/region/LayoutComponent";
import {FragmentComponent} from "../../../../../../common/js/content/page/region/FragmentComponent";
import {ComponentPropertyChangedEvent} from "../../../../../../common/js/content/page/region/ComponentPropertyChangedEvent";
import {ComponentPropertyValueChangedEvent} from "../../../../../../common/js/content/page/region/ComponentPropertyValueChangedEvent";
import {GetPartDescriptorsByApplicationsRequest} from "../../../../../../common/js/content/page/region/GetPartDescriptorsByApplicationsRequest";
import {GetLayoutDescriptorsByApplicationsRequest} from "../../../../../../common/js/content/page/region/GetLayoutDescriptorsByApplicationsRequest";
import {RenderingMode} from "../../../../../../common/js/rendering/RenderingMode";
import {RegionView} from "../../../../../../common/js/liveedit/RegionView";
import {ComponentView} from "../../../../../../common/js/liveedit/ComponentView";
import {PageView} from "../../../../../../common/js/liveedit/PageView";
import {ImageComponentView} from "../../../../../../common/js/liveedit/image/ImageComponentView";
import {PartComponentView} from "../../../../../../common/js/liveedit/part/PartComponentView";
import {LayoutComponentView} from "../../../../../../common/js/liveedit/layout/LayoutComponentView";
import {TextComponentView} from "../../../../../../common/js/liveedit/text/TextComponentView";
import {FragmentComponentView} from "../../../../../../common/js/liveedit/fragment/FragmentComponentView";
import {ComponentViewDragStartedEvent} from "../../../../../../common/js/liveedit/ComponentViewDragStartedEvent";
import {ComponentViewDragDroppedEvent} from "../../../../../../common/js/liveedit/ComponentViewDragDroppedEventEvent";
import {ComponentViewDragCanceledEvent} from "../../../../../../common/js/liveedit/ComponentViewDragCanceledEvent";
import {PageSelectedEvent} from "../../../../../../common/js/liveedit/PageSelectedEvent";
import {RegionSelectedEvent} from "../../../../../../common/js/liveedit/RegionSelectedEvent";
import {ItemViewSelectedEvent} from "../../../../../../common/js/liveedit/ItemViewSelectedEvent";
import {ItemViewDeselectedEvent} from "../../../../../../common/js/liveedit/ItemViewDeselectedEvent";
import {ComponentInspectedEvent} from "../../../../../../common/js/liveedit/ComponentInspectedEvent";
import {PageInspectedEvent} from "../../../../../../common/js/liveedit/PageInspectedEvent";
import {LiveComponentAddedEvent as ComponentAddedEvent} from "../../../../../../common/js/liveedit/LiveComponentAddedEvent";
import {LiveComponentRemovedEvent as ComponentRemovedEvent} from "../../../../../../common/js/liveedit/LiveComponentRemovedEvent";
import {ComponentDuplicatedEvent} from "../../../../../../common/js/liveedit/ComponentDuplicatedEvent";
import {LiveEditPageInitializationErrorEvent} from "../../../../../../common/js/liveedit/LiveEditPageInitializationErrorEvent";
import {ComponentFragmentCreatedEvent} from "../../../../../../common/js/liveedit/ComponentFragmentCreatedEvent";
import {ShowWarningLiveEditEvent} from "../../../../../../common/js/liveedit/ShowWarningLiveEditEvent";
import {CreateHtmlAreaDialogEvent as HtmlAreaDialogShownEvent} from "../../../../../../common/js/util/htmlarea/dialog/CreateHtmlAreaDialogEvent";
import {HTMLAreaDialogHandler} from "../../../../../../common/js/util/htmlarea/dialog/HTMLAreaDialogHandler";
import {Panel} from "../../../../../../common/js/ui/panel/Panel";
import {LiveEditPageViewReadyEvent} from "../../../../../../common/js/liveedit/LiveEditPageViewReadyEvent";
import {Action} from "../../../../../../common/js/ui/Action";
import {ObjectHelper} from "../../../../../../common/js/ObjectHelper";
import {WindowDOM} from "../../../../../../common/js/dom/WindowDOM";
import {Element} from "../../../../../../common/js/dom/Element";
import {PropertyChangedEvent} from "../../../../../../common/js/PropertyChangedEvent";
import {DefaultErrorHandler} from "../../../../../../common/js/DefaultErrorHandler";
import {assertNotNull} from "../../../../../../common/js/util/Assert";
import {PortalUriHelper} from "../../../../../../common/js/rendering/PortalUriHelper";
import {Branch} from "../../../../../../common/js/content/Branch";
import {PageLockedEvent} from "../../../../../../common/js/liveedit/PageLockedEvent";
import {PageUnlockedEvent} from "../../../../../../common/js/liveedit/PageUnlockedEvent";
import {showSuccess} from "../../../../../../common/js/notify/MessageBus";
import {ContentSummaryAndCompareStatus} from "../../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {EditContentEvent} from "../../../../../../common/js/content/event/EditContentEvent";
import {showWarning} from "../../../../../../common/js/notify/MessageBus";
import {showError} from "../../../../../../common/js/notify/MessageBus";
import {PageUnloadedEvent} from "../../../../../../common/js/liveedit/PageUnloadedEvent";
import {Shader} from "../../../../../../common/js/liveedit/Shader";
import {ClassHelper} from "../../../../../../common/js/ClassHelper";

import {ContentWizardPanel} from "../ContentWizardPanel";
import {DefaultModels} from "./DefaultModels";
import {EmulatorPanel} from "./contextwindow/EmulatorPanel";
import {LiveEditPageProxy} from "./LiveEditPageProxy";
import {TextInspectionPanel} from "./contextwindow/inspect/region/TextInspectionPanel";
import {ContentInspectionPanel} from "./contextwindow/inspect/ContentInspectionPanel";
import {RegionInspectionPanel} from "./contextwindow/inspect/region/RegionInspectionPanel";
import {ImageInspectionPanel} from "./contextwindow/inspect/region/ImageInspectionPanel";
import {LayoutInspectionPanel} from "./contextwindow/inspect/region/LayoutInspectionPanel";
import {FragmentInspectionPanel} from "./contextwindow/inspect/region/FragmentInspectionPanel";
import {PartInspectionPanel} from "./contextwindow/inspect/region/PartInspectionPanel";
import {PageInspectionPanel} from "./contextwindow/inspect/page/PageInspectionPanel";
import {InspectionsPanel, InspectionsPanelConfig} from "./contextwindow/inspect/InspectionsPanel";
import {InsertablesPanel, ComponentTypesPanelConfig} from "./contextwindow/insert/InsertablesPanel";
import {ContextWindowController} from "./contextwindow/ContextWindowController";
import {ContextWindow, ContextWindowConfig} from "./contextwindow/ContextWindow";
import {ShowContentFormEvent} from "../ShowContentFormEvent";

export interface LiveFormPanelConfig {

    contentType: ContentTypeName;

    contentWizardPanel: ContentWizardPanel;

    defaultModels: DefaultModels;
}

export class LiveFormPanel extends Panel {

    private defaultModels: DefaultModels;

    private content: Content;

    private liveEditModel: LiveEditModel;

    private pageView: PageView;

    private pageModel: PageModel;

    private pageLoading: boolean;

    private pageSkipReload: boolean;
    private frameContainer: Panel;

    private lockPageAfterProxyLoad: boolean;

    private contextWindow: ContextWindow;
    private contextWindowController: ContextWindowController;

    private emulatorPanel: EmulatorPanel;
    private insertablesPanel: InsertablesPanel;
    private inspectionsPanel: InspectionsPanel;
    private contentInspectionPanel: ContentInspectionPanel;
    private pageInspectionPanel: PageInspectionPanel;
    private regionInspectionPanel: RegionInspectionPanel;
    private imageInspectionPanel: ImageInspectionPanel;
    private partInspectionPanel: PartInspectionPanel;
    private layoutInspectionPanel: LayoutInspectionPanel;
    private fragmentInspectionPanel: FragmentInspectionPanel;
    private textInspectionPanel: TextInspectionPanel;

    private contentWizardPanel: ContentWizardPanel;

    private liveEditPageProxy: LiveEditPageProxy;

    constructor(config: LiveFormPanelConfig) {
        super("live-form-panel");
        this.contentWizardPanel = config.contentWizardPanel;
        this.defaultModels = config.defaultModels;

        this.pageLoading = false;
        this.pageSkipReload = false;
        this.lockPageAfterProxyLoad = false;

        this.liveEditPageProxy = new LiveEditPageProxy();

        this.contextWindow = this.createContextWindow(this.liveEditPageProxy, this.liveEditModel);

        // constructor to listen to live edit events during wizard rendering
        this.contextWindowController = new ContextWindowController(
            this.contextWindow,
            this.contentWizardPanel
        );
    }

    private createContextWindow(proxy: LiveEditPageProxy, model: LiveEditModel): ContextWindow {
        this.emulatorPanel = new EmulatorPanel({
            liveEditPage: proxy
        });

        this.inspectionsPanel = this.createInspectionsPanel(model);

        this.insertablesPanel = new InsertablesPanel(<ComponentTypesPanelConfig>{
            liveEditPage: proxy,
            contentWizardPanel: this.contentWizardPanel
        });

        return new ContextWindow(<ContextWindowConfig>{
            liveEditPage: proxy,
            liveFormPanel: this,
            inspectionPanel: this.inspectionsPanel,
            emulatorPanel: this.emulatorPanel,
            insertablesPanel: this.insertablesPanel
        });
    }

    private createInspectionsPanel(model: LiveEditModel): InspectionsPanel {
        var saveAction = new Action('Apply');
        saveAction.onExecuted(() => {
            if (!this.pageView) {
                this.saveAndReloadPage();
                return;
            }

            var itemView = this.pageView.getSelectedView();
            if (ObjectHelper.iFrameSafeInstanceOf(itemView, ComponentView)) {
                this.saveAndReloadOnlyComponent(<ComponentView<Component>> itemView);
            } else if (this.pageView.isLocked() || ObjectHelper.iFrameSafeInstanceOf(itemView, PageView)) {
                this.saveAndReloadPage();
            }
        });

        this.contentInspectionPanel = new ContentInspectionPanel();
        this.contentInspectionPanel.setContent(this.content);

        this.pageInspectionPanel = new PageInspectionPanel();
        this.partInspectionPanel = new PartInspectionPanel();
        this.layoutInspectionPanel = new LayoutInspectionPanel();
        this.imageInspectionPanel = new ImageInspectionPanel();
        this.fragmentInspectionPanel = new FragmentInspectionPanel();

        this.textInspectionPanel = new TextInspectionPanel();
        this.regionInspectionPanel = new RegionInspectionPanel();

        return new InspectionsPanel(<InspectionsPanelConfig>{
            contentInspectionPanel: this.contentInspectionPanel,
            pageInspectionPanel: this.pageInspectionPanel,
            regionInspectionPanel: this.regionInspectionPanel,
            imageInspectionPanel: this.imageInspectionPanel,
            partInspectionPanel: this.partInspectionPanel,
            layoutInspectionPanel: this.layoutInspectionPanel,
            fragmentInspectionPanel: this.fragmentInspectionPanel,
            textInspectionPanel: this.textInspectionPanel,
            saveAction: saveAction
        });
    }

    doRender(): Q.Promise<boolean> {
        return super.doRender().then((rendered: boolean) => {

            WindowDOM.get().onBeforeUnload((event) => {
                console.log("onbeforeunload " + this.liveEditModel.getContent().getDisplayName());
                // the reload is triggered by the main frame,
                // so let the live edit know it to skip the popup
                this.liveEditPageProxy.skipNextReloadConfirmation(true);
            });

            this.frameContainer = new Panel("frame-container");
            this.frameContainer.appendChildren<Element>(this.liveEditPageProxy.getIFrame(), this.liveEditPageProxy.getDragMask());

            // append mask here in order for the context window to be above
            this.appendChildren<Element>(this.frameContainer, this.liveEditPageProxy.getLoadMask(), this.contextWindow);


            this.contextWindow.onDisplayModeChanged(() => {
                if (!this.contextWindow.isFloating()) {
                    this.contentWizardPanel.getContextWindowToggler().setActive(true);
                    this.contextWindow.slideIn();
                }
            });

            this.liveEditListen();

            // delay rendered event until live edit page is fully loaded
            var liveEditDeferred = wemQ.defer<boolean>();

            this.liveEditPageProxy.onLiveEditPageViewReady((event: LiveEditPageViewReadyEvent) => {
                liveEditDeferred.resolve(rendered);
            });

            this.liveEditPageProxy.onLiveEditPageInitializationError((event: LiveEditPageInitializationErrorEvent) => {
                liveEditDeferred.reject(event.getMessage());
            });

            return liveEditDeferred.promise;
        });
    }

    remove(): LiveFormPanel {

        this.liveEditPageProxy.remove();
        super.remove();
        return this;
    }

    public getPage(): Page {
        return this.pageModel ? this.pageModel.getPage() : null;
    }

    setModel(liveEditModel: LiveEditModel) {

        this.liveEditModel = liveEditModel;

        this.content = liveEditModel.getContent();
        this.insertablesPanel.setContent(this.content);

        this.pageModel = liveEditModel.getPageModel();
        this.pageModel.setIgnorePropertyChanges(true);

        this.liveEditPageProxy.setModel(liveEditModel);
        this.pageInspectionPanel.setModel(liveEditModel);
        this.partInspectionPanel.setModel(liveEditModel);
        this.layoutInspectionPanel.setModel(liveEditModel);
        this.imageInspectionPanel.setModel(liveEditModel);
        this.fragmentInspectionPanel.setModel(liveEditModel);

        this.pageModel.setIgnorePropertyChanges(false);

        this.pageModel.onPropertyChanged((event: PropertyChangedEvent) => {

            // NB: To make the event.getSource() check work, all calls from this to PageModel that changes a property must done with this as eventSource argument.

            if (event.getPropertyName() == PageModel.PROPERTY_CONTROLLER && this !== event.getSource()) {
                this.saveAndReloadPage(false);
            }
            else if (event.getPropertyName() == PageModel.PROPERTY_TEMPLATE && this !== event.getSource()) {

                // do not reload page if there was no template in pageModel before and if new template is the default one - case when switching automatic template to default
                // only reload when switching from customized with controller set back to template or automatic template
                if (!(this.pageModel.getDefaultPageTemplate().equals(this.pageModel.getTemplate()) && !event.getOldValue() &&
                      !this.pageModel.hasController())) {
                    this.pageInspectionPanel.refreshInspectionHandler(liveEditModel);
                    this.lockPageAfterProxyLoad = true;
                    this.saveAndReloadPage(false);
                }
            }
        });

        this.pageModel.onComponentPropertyChangedEvent((event: ComponentPropertyChangedEvent) => {

            if (ObjectHelper.iFrameSafeInstanceOf(event.getComponent(), DescriptorBasedComponent)) {
                if (event.getPropertyName() == DescriptorBasedComponent.PROPERTY_DESCRIPTOR) {

                    var componentView = this.pageView.getComponentViewByPath(event.getPath());
                    if (componentView) {
                        if (ObjectHelper.iFrameSafeInstanceOf(componentView, PartComponentView)) {
                            var partView = <PartComponentView>componentView;
                            var partComponent: PartComponent = partView.getComponent();
                            if (partComponent.hasDescriptor()) {
                                this.saveAndReloadOnlyComponent(componentView);
                            }
                        } else if (ObjectHelper.iFrameSafeInstanceOf(componentView, LayoutComponentView)) {
                            var layoutView = <LayoutComponentView>componentView;
                            var layoutComponent: LayoutComponent = layoutView.getComponent();
                            if (layoutComponent.hasDescriptor()) {
                                this.saveAndReloadOnlyComponent(componentView);
                            }
                        }
                    } else {
                        console.debug("ComponentView by path not found: " + event.getPath().toString());
                    }
                }
            } else if (ObjectHelper.iFrameSafeInstanceOf(event.getComponent(), ImageComponent)) {
                if (event.getPropertyName() == ImageComponent.PROPERTY_IMAGE && !event.getComponent().isEmpty()) {
                    var componentView = this.pageView.getComponentViewByPath(event.getPath());
                    if (componentView) {
                        this.saveAndReloadOnlyComponent(componentView);
                    }
                }
            } else if (ObjectHelper.iFrameSafeInstanceOf(event.getComponent(), FragmentComponent)) {
                if (event.getPropertyName() == FragmentComponent.PROPERTY_FRAGMENT && !event.getComponent().isEmpty()) {
                    var componentView = this.pageView.getComponentViewByPath(event.getPath());
                    if (componentView) {
                        this.saveAndReloadOnlyComponent(componentView);
                    }
                }
            }
        });
    }

    skipNextReloadConfirmation(skip: boolean) {
        this.liveEditPageProxy.skipNextReloadConfirmation(skip);
    }

    loadPage(clearInspection: boolean = true) {
        if (this.pageSkipReload == false && !this.pageLoading) {

            if (clearInspection) {
                this.clearSelection();
            }

            this.pageLoading = true;
            this.liveEditPageProxy.load();
            this.liveEditPageProxy.onLoaded(() => {
                this.pageLoading = false;
                if (this.lockPageAfterProxyLoad) {
                    this.pageView.setLocked(true);
                    this.lockPageAfterProxyLoad = false;
                }
            });
        }
    }

    saveAndReloadPage(clearInspection: boolean = false) {
        this.pageSkipReload = true;
        this.contentWizardPanel.saveChanges().then(() => {
            this.pageSkipReload = false;
            if (clearInspection) {
                this.contextWindow.clearSelection();
            }
            this.liveEditPageProxy.load();
        }).catch((reason: any) => DefaultErrorHandler.handle(reason)).done();
    }

    saveAndReloadOnlyComponent(componentView: ComponentView<Component>) {

        assertNotNull(componentView, "componentView cannot be null");

        this.pageSkipReload = true;
        var componentUrl = PortalUriHelper.getComponentUri(this.content.getContentId().toString(),
            componentView.getComponentPath(),
            RenderingMode.EDIT,
            Branch.DRAFT);

        this.contentWizardPanel.saveChangesWithoutValidation().then(() => {
            this.pageSkipReload = false;
            componentView.showLoadingSpinner();
            return this.liveEditPageProxy.loadComponent(componentView, componentUrl);
        }).catch((errorMessage: any) => {

            DefaultErrorHandler.handle(errorMessage);

            componentView.hideLoadingSpinner();
            componentView.showRenderingError(componentUrl, errorMessage);
        }).done();
    }

    updateFrameContainerSize(contextWindowShown: boolean, contextWindowWidth?: number) {
        if (contextWindowShown && contextWindowWidth) {
            this.frameContainer.getEl().setWidth("calc(100% - " + (contextWindowWidth - 1) + "px)");
        } else {
            this.frameContainer.getEl().setWidth("100%");
        }
    }

    private liveEditListen() {

        this.liveEditPageProxy.onPageLocked((event: PageLockedEvent) => {
            this.inspectPage();
        });

        this.liveEditPageProxy.onPageUnlocked((event: PageUnlockedEvent) => {
            this.contextWindow.clearSelection();
        });

        this.liveEditPageProxy.onLiveEditPageViewReady((event: LiveEditPageViewReadyEvent) => {
            this.pageView = event.getPageView();
            if (this.pageView) {
                this.insertablesPanel.setPageView(this.pageView);
            }
        });

        this.liveEditPageProxy.onPageSelected((event: PageSelectedEvent) => {
            this.inspectPage();
        });

        this.liveEditPageProxy.onRegionSelected((event: RegionSelectedEvent) => {
            this.inspectRegion(event.getRegionView());
        });

        this.liveEditPageProxy.onItemViewSelected((event: ItemViewSelectedEvent) => {
            var itemView = event.getItemView();
            var toggler = this.contentWizardPanel.getContextWindowToggler();

            if (ObjectHelper.iFrameSafeInstanceOf(itemView, ComponentView)) {
                if (!this.contextWindow.isFixed()) {
                    if (itemView.isEmpty()) {
                        if (this.contextWindow.isFloating() && this.contextWindow.isShownOrAboutToBeShown()) {
                            toggler.setActive(false);
                        }
                    } else if (event.isNew() && !toggler.isActive()) {
                        toggler.setActive(true);
                    }
                } else {
                    this.contextWindow.setFixed(false);
                }
                this.inspectComponent(<ComponentView<Component>>itemView);
            }

            if (!this.pageView.isLocked() && !event.isRightClicked()) {
                this.minimizeContentFormPanelIfNeeded();
            }
        });

        this.liveEditPageProxy.onItemViewDeselected((event: ItemViewDeselectedEvent) => {
            var toggler = this.contentWizardPanel.getContextWindowToggler();
            if (!toggler.isActive() && this.contextWindow.isShownOrAboutToBeShown()) {
                this.contextWindow.slideOut();
            } else if (toggler.isActive() && !this.contextWindow.isShownOrAboutToBeShown()) {
                this.contextWindow.slideIn();
            }
            this.clearSelection();
        });

        this.liveEditPageProxy.onComponentAdded((event: ComponentAddedEvent) => {
            // do something when component is added
            // onItemViewSelected() is not called on adding TextComponentView thus calling minimizeContentFormPanelIfNeeded() for it from here
            if (ObjectHelper.iFrameSafeInstanceOf(event.getComponentView(), TextComponentView)) {
                this.minimizeContentFormPanelIfNeeded();
            }
        });

        this.liveEditPageProxy.onComponentRemoved((event: ComponentRemovedEvent) => {

            if (!this.pageModel.isPageTemplate() && this.pageModel.getMode() == PageMode.AUTOMATIC) {
                this.pageModel.initializePageFromDefault(this);
            }

            this.clearSelection();
        });

        this.liveEditPageProxy.onComponentViewDragDropped((event: ComponentViewDragDroppedEvent) => {

            var componentView = event.getComponentView();
            if (!componentView.isEmpty()) {
                this.inspectComponent(componentView);
            }
        });

        this.liveEditPageProxy.onComponentDuplicated((event: ComponentDuplicatedEvent) => {

            this.saveAndReloadOnlyComponent(event.getDuplicatedComponentView());
        });

        this.liveEditPageProxy.onComponentInspected((event: ComponentInspectedEvent) => {
            var componentView = event.getComponentView();
            this.contentWizardPanel.getContextWindowToggler().setActive(true);
            this.contextWindow.slideIn();
            this.inspectComponent(componentView);
        });

        this.liveEditPageProxy.onPageInspected((event: PageInspectedEvent) => {
            this.contentWizardPanel.getContextWindowToggler().setActive(true);
            this.contextWindow.slideIn();
            this.inspectPage();
        });

        this.liveEditPageProxy.onComponentFragmentCreated((event: ComponentFragmentCreatedEvent) => {
            var fragmentView: FragmentComponentView = event.getComponentView();
            var componentType = event.getSourceComponentType().getShortName();
            var componentName = fragmentView.getComponent().getName().toString();
            showSuccess(`Fragment created from '${componentName}' ${componentType}.`);

            this.saveAndReloadOnlyComponent(event.getComponentView());

            var summaryAndStatus = ContentSummaryAndCompareStatus.fromContentSummary(event.getFragmentContent());
            new EditContentEvent([summaryAndStatus]).fire();
        });

        this.liveEditPageProxy.onShowWarning((event: ShowWarningLiveEditEvent) => {
            showWarning(event.getMessage());
        });

        this.liveEditPageProxy.onEditContent((event: EditContentEvent) => {
            new EditContentEvent(event.getModels()).fire();
        });

        this.liveEditPageProxy.onLiveEditPageInitializationError((event: LiveEditPageInitializationErrorEvent) => {
            showError(event.getMessage(), false);
            new ShowContentFormEvent().fire();
            this.contentWizardPanel.showForm();
        });

        this.liveEditPageProxy.onPageUnloaded((event: PageUnloadedEvent) => {
            this.contentWizardPanel.close();
        });

        this.liveEditPageProxy.onLiveEditPageDialogCreate((event: HtmlAreaDialogShownEvent) => {
            let modalDialog = HTMLAreaDialogHandler.createAndOpenDialog(event);
            this.liveEditPageProxy.notifyLiveEditPageDialogCreated(modalDialog, event.getConfig());
        });

        this.liveEditPageProxy.onPageTextModeStarted(() => {
            // Collapse the panel with a delay to give HTML editor time to initialize
            setTimeout(() => {
                this.minimizeContentFormPanelIfNeeded();
            }, 200);
        });
    }

    private shade() {
        Shader.get().shade(this);
    }

    private minimizeContentFormPanelIfNeeded() {
        if (this.contextWindow.isFloating() && !this.contentWizardPanel.isMinimized()) {
            this.contentWizardPanel.toggleMinimize();
        }
    }

    private inspectPage() {
        this.contextWindow.showInspectionPanel(this.pageInspectionPanel);
    }

    private clearSelection(): void {
        var pageModel = this.liveEditModel.getPageModel();
        var customizedWithController = pageModel.isCustomized() && pageModel.hasController();
        var isFragmentContent = pageModel.getMode() === PageMode.FRAGMENT;
        if (pageModel.hasDefaultPageTemplate() || customizedWithController || isFragmentContent) {
            this.contextWindow.clearSelection();
        } else {
            this.inspectPage();
        }
    }

    clearPageViewSelectionAndOpenInspectPage() {
        if (this.pageView && this.pageView.hasSelectedView()) {
            this.pageView.getSelectedView().deselect();
        }
        this.inspectPage();
    }

    private inspectRegion(regionView: RegionView) {

        var region = regionView.getRegion();

        this.regionInspectionPanel.setRegion(region);
        this.contextWindow.showInspectionPanel(this.regionInspectionPanel);
    }

    private inspectComponent(componentView: ComponentView<Component>) {
        assertNotNull(componentView, "componentView cannot be null");

        if (ObjectHelper.iFrameSafeInstanceOf(componentView, ImageComponentView)) {
            this.imageInspectionPanel.setImageComponent(<ImageComponentView>componentView);
            this.contextWindow.showInspectionPanel(this.imageInspectionPanel);
        }
        else if (ObjectHelper.iFrameSafeInstanceOf(componentView, PartComponentView)) {
            this.partInspectionPanel.setPartComponent(<PartComponentView>componentView);
            this.contextWindow.showInspectionPanel(this.partInspectionPanel);
        }
        else if (ObjectHelper.iFrameSafeInstanceOf(componentView, LayoutComponentView)) {
            this.layoutInspectionPanel.setLayoutComponent(<LayoutComponentView>componentView);
            this.contextWindow.showInspectionPanel(this.layoutInspectionPanel);
        }
        else if (ObjectHelper.iFrameSafeInstanceOf(componentView, TextComponentView)) {
            this.textInspectionPanel.setTextComponent(<TextComponentView>componentView);
            this.contextWindow.showInspectionPanel(this.textInspectionPanel);
        }
        else if (ObjectHelper.iFrameSafeInstanceOf(componentView, FragmentComponentView)) {
            this.fragmentInspectionPanel.setFragmentComponent(<FragmentComponentView>componentView);
            this.contextWindow.showInspectionPanel(this.fragmentInspectionPanel);
        }
        else {
            throw new Error("ComponentView cannot be selected: " + ClassHelper.getClassName(componentView));
        }
    }
}
