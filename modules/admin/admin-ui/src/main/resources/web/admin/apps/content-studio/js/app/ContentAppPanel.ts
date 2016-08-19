import {ContentSummary} from "../../../../common/js/content/ContentSummary";
import {ContentSummaryAndCompareStatus} from "../../../../common/js/content/ContentSummaryAndCompareStatus";
import {Content} from "../../../../common/js/content/Content";
import {ContentId} from "../../../../common/js/content/ContentId";
import {ContentNamedEvent} from "../../../../common/js/content/event/ContentNamedEvent";
import {ContentUpdatedEvent} from "../../../../common/js/content/event/ContentUpdatedEvent";
import {AppBarTabId} from "../../../../common/js/app/bar/AppBarTabId";
import {AppBarTabMenuItem} from "../../../../common/js/app/bar/AppBarTabMenuItem";
import {AppBarTabMenuItemBuilder} from "../../../../common/js/app/bar/AppBarTabMenuItem";
import {ShowBrowsePanelEvent} from "../../../../common/js/app/ShowBrowsePanelEvent";
import {BrowseAndWizardBasedAppPanel} from "../../../../common/js/app/BrowseAndWizardBasedAppPanel";
import {LoadMask} from "../../../../common/js/ui/mask/LoadMask";
import {AppBar} from "../../../../common/js/app/bar/AppBar";
import {Path} from "../../../../common/js/rest/Path";
import {WizardPanel} from "../../../../common/js/app/wizard/WizardPanel";
import {PropertyChangedEvent} from "../../../../common/js/PropertyChangedEvent";
import {ContentUnnamed} from "../../../../common/js/content/ContentUnnamed";
import {ValidityChangedEvent} from "../../../../common/js/ValidityChangedEvent";
import {ContentSummaryAndCompareStatusFetcher} from "../../../../common/js/content/resource/ContentSummaryAndCompareStatusFetcher";
import {EditContentEvent} from "../../../../common/js/content/event/EditContentEvent";
import {BrowsePanel} from "../../../../common/js/app/browse/BrowsePanel";
import {StringHelper} from "../../../../common/js/util/StringHelper";
import {GetContentTypeByNameRequest} from "../../../../common/js/schema/content/GetContentTypeByNameRequest";
import {ContentType} from "../../../../common/js/schema/content/ContentType";
import {ViewItem} from "../../../../common/js/app/view/ViewItem";
import {ContentIconUrlResolver} from "../../../../common/js/content/util/ContentIconUrlResolver";

import {NewContentEvent} from "./create/NewContentEvent";
import {ContentWizardPanel} from "./wizard/ContentWizardPanel";
import {ViewContentEvent} from "./browse/ViewContentEvent";
import {SortContentEvent} from "./browse/SortContentEvent";
import {MoveContentEvent} from "./browse/MoveContentEvent";
import {ContentBrowsePanel} from "./browse/ContentBrowsePanel";
import {ContentItemViewPanel} from "./view/ContentItemViewPanel";
import {OpenSortDialogEvent} from "./browse/OpenSortDialogEvent";
import {OpenMoveDialogEvent} from "./browse/OpenMoveDialogEvent";
import {ContentWizardPanelParams} from "./wizard/ContentWizardPanelParams";

export class ContentAppPanel extends BrowseAndWizardBasedAppPanel<ContentSummaryAndCompareStatus> {

    private mask: LoadMask;

    constructor(appBar: AppBar, path?: Path) {

        super({
            appBar: appBar
        });

        this.mask = new LoadMask(this);

        this.handleGlobalEvents();

        this.route(path);
    }

    addWizardPanel(tabMenuItem: AppBarTabMenuItem, wizardPanel: WizardPanel<Content>) {
        super.addWizardPanel(tabMenuItem, wizardPanel);

        wizardPanel.onRendered((event) => {
            // header will be ready after rendering is complete
            wizardPanel.getWizardHeader().onPropertyChanged((event: PropertyChangedEvent) => {
                if (event.getPropertyName() === "displayName") {
                    var contentType = (<ContentWizardPanel>wizardPanel).getContentType(),
                        name = <string>event.getNewValue() || ContentUnnamed.prettifyUnnamed(contentType.getDisplayName());

                    tabMenuItem.setLabel(name, !<string>event.getNewValue(), false);
                }
            });
        });

        var contentWizardPanel = <ContentWizardPanel>wizardPanel;

        contentWizardPanel.onDataLoaded((content) => {
            tabMenuItem.markInvalid(!content.isValid());
        });

        contentWizardPanel.onValidityChanged((event: ValidityChangedEvent) => {
            tabMenuItem.markInvalid(!contentWizardPanel.isValid());
        });
    }

    private route(path?: Path) {
        var action = path ? path.getElement(0) : undefined;

        switch (action) {
        case 'edit':
            var id = path.getElement(1);
            if (id) {
                ContentSummaryAndCompareStatusFetcher.fetch(new ContentId(id)).done(
                    (content: ContentSummaryAndCompareStatus) => {
                        new EditContentEvent([content]).fire();
                    });
            }
            break;
        case 'view' :
            var id = path.getElement(1);
            if (id) {
                ContentSummaryAndCompareStatusFetcher.fetch(new ContentId(id)).done(
                    (content: ContentSummaryAndCompareStatus) => {
                        new ViewContentEvent([content]).fire();
                    });
            }
            break;
        default:
            new ShowBrowsePanelEvent().fire();
            break;
        }
    }

    private handleGlobalEvents() {
        NewContentEvent.on((event) => {
            this.handleNewContent(event);
        });

        ViewContentEvent.on((event) => {
            this.handleView(event);
        });

        EditContentEvent.on((event) => {
            this.handleEdit(event);
        });

        ShowBrowsePanelEvent.on((event) => {
            this.handleBrowse(event);
        });

        ContentUpdatedEvent.on((event) => {
            this.handleUpdated(event);
        });

        SortContentEvent.on((event) => {
            this.handleSort(event);
        });

        MoveContentEvent.on((event) => {
            this.handleMove(event);
        });
    }

    private handleUpdated(event: ContentUpdatedEvent) {
        // do something when content is updated
    }

    private handleBrowse(event: ShowBrowsePanelEvent) {
        var browsePanel: BrowsePanel<ContentSummaryAndCompareStatus> = this.getBrowsePanel();
        if (!browsePanel) {
            this.addBrowsePanel(new ContentBrowsePanel());
        } else {
            this.selectPanelByIndex(this.getPanelIndex(browsePanel));
        }
    }

    private handleNewContent(newContentEvent: NewContentEvent) {

        var contentTypeSummary = newContentEvent.getContentType();
        var tabId = AppBarTabId.forNew(contentTypeSummary.getName());
        var tabMenuItem = this.getAppBarTabMenu().getNavigationItemById(tabId);

        if (tabMenuItem != null) {

            this.selectPanel(tabMenuItem);

        } else {

            var wizardParams = new ContentWizardPanelParams()
                .setTabId(tabId)
                .setContentTypeName(contentTypeSummary.getContentTypeName())
                .setParentContent(newContentEvent.getParentContent())
                .setCreateSite(newContentEvent.getContentType().isSite());

            var wizard = new ContentWizardPanel(wizardParams);

            wizard.onDataLoaded((loadedContent: Content) => {
                var newTabId = AppBarTabId.forNew(loadedContent.getContentId().toString());
                tabMenuItem.setTabId(newTabId);
                wizard.setTabId(newTabId);
            });

            wizard.onContentNamed(this.handleContentNamedEvent.bind(this));

            tabMenuItem = new AppBarTabMenuItemBuilder()
                .setLabel(ContentUnnamed.prettifyUnnamed(contentTypeSummary.getDisplayName()))
                .setTabId(tabId).setCloseAction(wizard.getCloseAction())
                .build();

            this.addWizardPanel(tabMenuItem, wizard);

            if (newContentEvent.getContentType().isSite() && this.getBrowsePanel()) {
                var content: Content = newContentEvent.getParentContent();
                if (!!content) { // refresh site's node
                    this.getBrowsePanel().getTreeGrid().refreshNodeById(content.getId());
                }
            }

        }
    }


    private handleEdit(event: EditContentEvent) {

        event.getModels().forEach((content: ContentSummaryAndCompareStatus) => {

            if (!content || !content.getContentSummary()) {
                return;
            }

            var contentSummary = content.getContentSummary(),
                contentTypeName = contentSummary.getType();

            var closeViewPanelMenuItem = this.resolveTabMenuItemForContentBeingViewed(contentSummary);
            var tabMenuItem = this.resolveTabMenuItemForContentBeingEdited(contentSummary);

            if (tabMenuItem != null) {
                this.selectPanel(tabMenuItem);
            } else {

                var tabId = AppBarTabId.forEdit(contentSummary.getId());

                var wizardParams = new ContentWizardPanelParams()
                    .setTabId(tabId)
                    .setContentTypeName(contentTypeName)
                    .setContentSummary(contentSummary);

                var wizard = new ContentWizardPanel(wizardParams);

                if (closeViewPanelMenuItem != null) {
                    this.getAppBarTabMenu().deselectNavigationItem();
                    this.getAppBarTabMenu().removeNavigationItem(closeViewPanelMenuItem);
                    this.removePanelByIndex(closeViewPanelMenuItem.getIndex());
                }

                var name = contentSummary.getDisplayName();
                if (StringHelper.isBlank(name)) {
                    wizard.onDataLoaded((loadedContent) => {
                        tabMenuItem.setLabel(ContentUnnamed.prettifyUnnamed(wizard.getContentType().getDisplayName()));
                    })
                }

                tabMenuItem = new AppBarTabMenuItemBuilder()
                    .setLabel(name)
                    .setMarkUnnamed(!contentSummary.getDisplayName())
                    .setMarkInvalid(!contentSummary.isValid())
                    .setTabId(tabId)
                    .setEditing(true)
                    .setCloseAction(wizard.getCloseAction()).build();

                this.addWizardPanel(tabMenuItem, wizard);

                var viewTabId = AppBarTabId.forView(contentSummary.getId());
                var viewTabMenuItem = this.getAppBarTabMenu().getNavigationItemById(viewTabId);
                if (viewTabMenuItem != null) {
                    this.removePanelByIndex(viewTabMenuItem.getIndex());
                }

            }
        });
    }

    private handleView(event: ViewContentEvent) {

        var contents: ContentSummaryAndCompareStatus[] = event.getModels();
        contents.forEach((content: ContentSummaryAndCompareStatus) => {
            if (!content || !content.getContentSummary()) {
                return;
            }

            var tabMenuItem = this.resolveTabMenuItemForContentBeingEditedOrViewed(content.getContentSummary());

            if (tabMenuItem) {
                this.selectPanel(tabMenuItem);
            } else {
                var tabId = AppBarTabId.forView(content.getId());
                var contentItemViewPanel = new ContentItemViewPanel();

                tabMenuItem = new AppBarTabMenuItemBuilder().setLabel(content.getDisplayName()).setMarkInvalid(
                    !content.getContentSummary().isValid()).setTabId(tabId).setCloseAction(contentItemViewPanel.getCloseAction()).build();

                if (!content.getDisplayName()) {
                    new GetContentTypeByNameRequest(content.getContentSummary().getType()).sendAndParse().then(
                        (contentType: ContentType) => {
                            tabMenuItem.setLabel(ContentUnnamed.prettifyUnnamed(contentType.getDisplayName()), true);
                        }).done();
                }

                var contentItem = new ViewItem(content)
                    .setDisplayName(content.getDisplayName())
                    .setPath(content.getPath().toString())
                    .setIconUrl(new ContentIconUrlResolver().setContent(content.getContentSummary()).resolve());

                contentItemViewPanel.setItem(contentItem);

                this.addViewPanel(tabMenuItem, contentItemViewPanel);
            }
        });
    }

    private handleSort(event: SortContentEvent) {

        var contents: ContentSummaryAndCompareStatus[] = event.getModels();
        new OpenSortDialogEvent(contents[0]).fire();
    }

    private handleMove(event: MoveContentEvent) {

        var contents: ContentSummaryAndCompareStatus[] = event.getModels();
        new OpenMoveDialogEvent(contents.map(content => content.getContentSummary())).fire();
    }

    private handleContentNamedEvent(event: ContentNamedEvent) {

        var wizard = event.getWizard(),
            tabMenuItem = this.getAppBarTabMenu().getNavigationItemById(wizard.getTabId());
        // update tab id so that new wizard for the same content type can be created
        var newTabId = AppBarTabId.forEdit(event.getContent().getId());
        tabMenuItem.setTabId(newTabId);
        wizard.setTabId(newTabId);
    }

    private resolveTabMenuItemForContentBeingEditedOrViewed(content: ContentSummary): AppBarTabMenuItem {
        var result = this.resolveTabMenuItemForContentBeingEdited(content);
        if (!result) {
            result = this.resolveTabMenuItemForContentBeingViewed(content)
        }
        return result;
    }

    private resolveTabMenuItemForContentBeingEdited(content: ContentSummary): AppBarTabMenuItem {
        if (!!content) {

            var tabId = this.getAppBarTabMenu().getNavigationItemById(AppBarTabId.forEdit(content.getId()));
            if (tabId) {
                return tabId;
            }
        }
        return null;
    }

    private resolveTabMenuItemForContentBeingViewed(content: ContentSummary): AppBarTabMenuItem {
        if (!!content) {
            var tabId = this.getAppBarTabMenu().getNavigationItemById(AppBarTabId.forView(content.getId()));
            if (tabId) {
                return tabId;
            }
        }

        return null;
    }
}
