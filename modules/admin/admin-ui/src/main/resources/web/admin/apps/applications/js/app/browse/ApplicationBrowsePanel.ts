import {ApplicationKey} from "../../../../../common/js/application/ApplicationKey";
import {Application} from "../../../../../common/js/application/Application";
import {TreeNode} from "../../../../../common/js/ui/treegrid/TreeNode";
import {BrowseItem} from "../../../../../common/js/app/browse/BrowseItem";
import {StartApplicationRequest} from "../../../../../common/js/application/StartApplicationRequest";
import {StopApplicationRequest} from "../../../../../common/js/application/StopApplicationRequest";
import {UninstallApplicationRequest} from "../../../../../common/js/application/UninstallApplicationRequest";
import {ApplicationEvent} from "../../../../../common/js/application/ApplicationEvent";
import {ApplicationEventType} from "../../../../../common/js/application/ApplicationEvent";
import {BrowsePanel} from "../../../../../common/js/app/browse/BrowsePanel";
import {UriHelper} from "../../../../../common/js/util/UriHelper";
import {showFeedback} from "../../../../../common/js/notify/MessageBus";
import {ServerEventsConnection} from "../../../../../common/js/app/ServerEventsConnection";
import {ApplicationUploadStartedEvent} from "../../../../../common/js/application/ApplicationUploadStartedEvent";
import {UploadItem} from "../../../../../common/js/ui/uploader/UploadItem";

import {ApplicationBrowseToolbar} from "./ApplicationBrowseToolbar";
import {ApplicationBrowseActions} from "./ApplicationBrowseActions";
import {ApplicationTreeGrid} from "./ApplicationTreeGrid";
import {ApplicationBrowseItemPanel} from "./ApplicationBrowseItemPanel";
import {StopApplicationEvent} from "./StopApplicationEvent";
import {StartApplicationEvent} from "./StartApplicationEvent";
import {UninstallApplicationEvent} from "./UninstallApplicationEvent";

export class ApplicationBrowsePanel extends BrowsePanel<Application> {

    private browseActions: ApplicationBrowseActions;

    private applicationTreeGrid: ApplicationTreeGrid;

    private toolbar: ApplicationBrowseToolbar;

    private applicationIconUrl: string;

    constructor() {

        this.applicationTreeGrid = new ApplicationTreeGrid();

        this.browseActions = <ApplicationBrowseActions> this.applicationTreeGrid.getContextMenu().getActions();

        this.toolbar = new ApplicationBrowseToolbar(this.browseActions);
        var browseItemPanel = new ApplicationBrowseItemPanel();

        super({
            browseToolbar: this.toolbar,
            treeGrid: this.applicationTreeGrid,
            browseItemPanel: browseItemPanel,
            filterPanel: undefined
        });

        this.applicationIconUrl = UriHelper.getAdminUri('common/images/icons/icoMoon/128x128/puzzle.png');

        this.registerEvents();
    }

    treeNodesToBrowseItems(nodes: TreeNode<Application>[]): BrowseItem<Application>[] {
        var browseItems: BrowseItem<Application>[] = [];

        // do not proceed duplicated content. still, it can be selected
        nodes.forEach((node: TreeNode<Application>, index: number) => {
            for (var i = 0; i <= index; i++) {
                if (nodes[i].getData().getId() === node.getData().getId()) {
                    break;
                }
            }
            if (i === index) {
                var applicationEl = node.getData();
                var item = new BrowseItem<Application>(applicationEl).setId(applicationEl.getId()).setDisplayName(
                    applicationEl.getDisplayName()).setPath(applicationEl.getName()).setIconUrl(this.applicationIconUrl);
                browseItems.push(item);
            }
        });
        return browseItems;
    }

    private registerEvents() {
        StopApplicationEvent.on((event: StopApplicationEvent) => {
            var applicationKeys = ApplicationKey.fromApplications(event.getApplications());
            new StopApplicationRequest(applicationKeys).sendAndParse()
                .then(() => {
                }).done();
        });

        StartApplicationEvent.on((event: StartApplicationEvent) => {
            var applicationKeys = ApplicationKey.fromApplications(event.getApplications());
            new StartApplicationRequest(applicationKeys).sendAndParse()
                .then(() => {
                }).done();
        });


        UninstallApplicationEvent.on((event: UninstallApplicationEvent) => {
            var applicationKeys = ApplicationKey.fromClusterApplications(event.getApplications());
            new UninstallApplicationRequest(applicationKeys).sendAndParse()
                .then(() => {
                }).done();
        });

        ApplicationEvent.on((event: ApplicationEvent) => {
            if (ApplicationEventType.INSTALLED == event.getEventType()) {
                this.applicationTreeGrid.appendApplicationNode(event.getApplicationKey()).then(() => {
                    setTimeout(() => { // timeout lets grid to remove UploadMockNode so that its not counted in the toolbar
                        this.applicationTreeGrid.triggerSelectionChangedListeners();
                        var installedApp = this.applicationTreeGrid.getByApplicationKey(event.getApplicationKey()),
                            installedAppName = !!installedApp ? installedApp.getDisplayName() : event.getApplicationKey();
                        showFeedback("Application '" + installedAppName + "' installed successfully");
                    }, 200);
                });

            } else if (ApplicationEventType.UNINSTALLED == event.getEventType()) {
                var uninstalledApp = this.applicationTreeGrid.getByApplicationKey(event.getApplicationKey()),
                    uninstalledAppName = !!uninstalledApp ? uninstalledApp.getDisplayName() : event.getApplicationKey();
                showFeedback("Application '" + uninstalledAppName + "' uninstalled successfully");
                this.applicationTreeGrid.deleteApplicationNode(event.getApplicationKey());
            } else if (ApplicationEventType.STOPPED == event.getEventType()) {
                setTimeout(() => { // as uninstall usually follows stop event, lets wait to check if app still exists
                    var stoppedApp = this.applicationTreeGrid.getByApplicationKey(event.getApplicationKey());
                    if (!!stoppedApp && ServerEventsConnection.getInstance().isConnected()) { // seems to be present in the grid and xp is running
                        this.applicationTreeGrid.updateApplicationNode(event.getApplicationKey());
                    }
                }, 400);
            } else if (event.isNeedToUpdateApplication()) {
                this.applicationTreeGrid.updateApplicationNode(event.getApplicationKey());
            }
        });

        ApplicationUploadStartedEvent.on((event) => {
            this.handleNewAppUpload(event);
        });

    }

    private handleNewAppUpload(event: ApplicationUploadStartedEvent) {
        event.getUploadItems().forEach((item: UploadItem<Application>) => {
            this.applicationTreeGrid.appendUploadNode(item);
        });
    }
}
