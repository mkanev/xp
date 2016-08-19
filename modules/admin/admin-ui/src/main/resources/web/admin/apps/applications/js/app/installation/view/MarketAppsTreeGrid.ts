import {Element} from "../../../../../../common/js/dom/Element";
import {ElementHelper} from "../../../../../../common/js/dom/ElementHelper";
import {ElementFromHelperBuilder} from "../../../../../../common/js/dom/Element";
import {GridColumn} from "../../../../../../common/js/ui/grid/GridColumn";
import {GridColumnBuilder} from "../../../../../../common/js/ui/grid/GridColumn";
import {TreeGrid} from "../../../../../../common/js/ui/treegrid/TreeGrid";
import {TreeNode} from "../../../../../../common/js/ui/treegrid/TreeNode";
import {TreeGridBuilder} from "../../../../../../common/js/ui/treegrid/TreeGridBuilder";
import {DateTimeFormatter} from "../../../../../../common/js/ui/treegrid/DateTimeFormatter";
import {TreeGridContextMenu} from "../../../../../../common/js/ui/treegrid/TreeGridContextMenu";
import {ContentResponse} from "../../../../../../common/js/content/resource/result/ContentResponse";
import {ContentSummary} from "../../../../../../common/js/content/ContentSummary";
import {ContentSummaryBuilder} from "../../../../../../common/js/content/ContentSummary";
import {ContentSummaryViewer} from "../../../../../../common/js/content/ContentSummaryViewer";
import {ContentSummaryAndCompareStatusFetcher} from "../../../../../../common/js/content/resource/ContentSummaryAndCompareStatusFetcher";
import {CompareStatus} from "../../../../../../common/js/content/CompareStatus";
import {MarketApplication} from "../../../../../../common/js/application/MarketApplication";
import {Application} from "../../../../../../common/js/application/Application";
import {MarketAppStatus} from "../../../../../../common/js/application/MarketApplication";
import {MarketAppStatusFormatter} from "../../../../../../common/js/application/MarketApplication";
import {ApplicationEvent} from "../../../../../../common/js/application/ApplicationEvent";
import {ApplicationEventType} from "../../../../../../common/js/application/ApplicationEvent";
import {MarketApplicationsFetcher} from "../../../../../../common/js/application/MarketApplicationFetcher";
import {MarketApplicationResponse} from "../../../../../../common/js/application/MarketApplicationResponse";
import {MarketApplicationBuilder} from "../../../../../../common/js/application/MarketApplication";
import {GetApplicationRequest} from "../../../../../../common/js/application/GetApplicationRequest";
import {ProgressBar} from "../../../../../../common/js/ui/ProgressBar";
import {InstallUrlApplicationRequest} from "../../../../../../common/js/application/InstallUrlApplicationRequest";
import {ApplicationInstallResult} from "../../../../../../common/js/application/ApplicationInstallResult";
import {DefaultErrorHandler} from "../../../../../../common/js/DefaultErrorHandler";
import {DivEl} from "../../../../../../common/js/dom/DivEl";

import {MarketAppViewer} from "./MarketAppViewer";

declare var CONFIG;

export class MarketAppsTreeGrid extends TreeGrid<MarketApplication> {

    static MAX_FETCH_SIZE: number = 10;

    private installApplications: Application[];

    constructor() {

        var nameColumn = new GridColumnBuilder<TreeNode<MarketApplication>>().setName("Name").setId("displayName").setField(
            "displayName").setCssClass("app-name-and-icon").setMinWidth(170).setFormatter(this.nameFormatter).build();
        var versionColumn = new GridColumnBuilder<TreeNode<MarketApplication>>().setName("Version").setId("version").setField(
            "latestVersion").setCssClass("version").setMinWidth(40).build();
        var appStatusColumns = new GridColumnBuilder<TreeNode<MarketApplication>>().setName("AppStatus").setId("appStatus").setField(
            "status").setCssClass("status").setMinWidth(50).setFormatter(this.appStatusFormatter).setCssClass("app-status").build();

        super(new TreeGridBuilder<MarketApplication>().setColumns([
                nameColumn,
                versionColumn,
                appStatusColumns
            ]).setPartialLoadEnabled(true).setLoadBufferSize(2).setCheckableRows(false).setShowToolbar(false).setRowHeight(
            70).disableMultipleSelection(true).prependClasses("market-app-tree-grid").setSelectedCellCssClass(
            "selected-sort-row").setQuietErrorHandling(
            true).setAutoLoad(false)
        );

        this.installApplications = [];

        this.subscribeAndManageInstallClick();
        this.subscribeOnUninstallEvent();
        this.subscribeOnInstallEvent();
    }

    private subscribeOnUninstallEvent() { // set status of market app to NOT_INSTALLED if it was uninstalled
        ApplicationEvent.on((event: ApplicationEvent) => {
            if (ApplicationEventType.UNINSTALLED == event.getEventType()) {
                var nodeToUpdate = this.getRoot().getCurrentRoot().findNode(event.getApplicationKey().toString());
                if (!!nodeToUpdate) {
                    (<MarketApplication>nodeToUpdate.getData()).setStatus(MarketAppStatus.NOT_INSTALLED);
                    this.refresh();
                }
            }
        });
    }

    private subscribeOnInstallEvent() { // update status of market app
        ApplicationEvent.on((event: ApplicationEvent) => {
            if (ApplicationEventType.INSTALLED == event.getEventType()) {
                var nodeToUpdate = this.getRoot().getCurrentRoot().findNode(event.getApplicationKey().toString());
                if (!!nodeToUpdate) {
                    new GetApplicationRequest(event.getApplicationKey(),
                        true).sendAndParse().then((application: Application)=> {
                        if (!!application) {
                            var marketApplication: MarketApplication = <MarketApplication>nodeToUpdate.getData();
                            if (MarketApplicationsFetcher.installedAppCanBeUpdated(marketApplication, application)) {
                                marketApplication.setStatus(MarketAppStatus.OLDER_VERSION_INSTALLED);
                            } else {
                                marketApplication.setStatus(MarketAppStatus.INSTALLED);
                            }
                            this.refresh();
                        }
                    });
                }
            }
        });
    }

    private subscribeAndManageInstallClick() {
        this.getGrid().subscribeOnClick((event, data) => {
            var node = this.getItem(data.row),
                app = <MarketApplication>node.getData(),
                url = app.getLatestVersionDownloadUrl(),
                elem = new Element(new ElementFromHelperBuilder().setHelper(new ElementHelper(event.target))),
                status = app.getStatus();

            if ((elem.hasClass(MarketAppStatusFormatter.statusInstallCssClass) ||
                 elem.hasClass(MarketAppStatusFormatter.statusUpdateCssClass))) {

                var progressBar = new ProgressBar(0);
                var progressHandler = (event) => {
                    if (event.getApplicationUrl() == url &&
                        event.getEventType() == ApplicationEventType.PROGRESS) {

                        progressBar.setValue(event.getProgress());
                    }
                };

                ApplicationEvent.on(progressHandler);
                elem.removeChildren().appendChild(progressBar);

                new InstallUrlApplicationRequest(url)
                    .sendAndParse().then((result: ApplicationInstallResult)=> {
                    ApplicationEvent.un(progressHandler);
                    if (!result.getFailure()) {

                        elem.removeClass(MarketAppStatusFormatter.statusInstallCssClass + " " +
                                         MarketAppStatusFormatter.statusUpdateCssClass);
                        elem.addClass(MarketAppStatusFormatter.getStatusCssClass(MarketAppStatus.INSTALLED));

                        elem.setHtml(MarketAppStatusFormatter.formatStatus(MarketAppStatus.INSTALLED));
                        app.setStatus(MarketAppStatus.INSTALLED);
                    } else {
                        elem.setHtml(MarketAppStatusFormatter.formatStatus(status));
                    }

                }).catch((reason: any) => {
                    ApplicationEvent.un(progressHandler);
                    elem.setHtml(MarketAppStatusFormatter.formatStatus(status));

                    DefaultErrorHandler.handle(reason);
                });
            }
        });
    }

    private nameFormatter(row: number, cell: number, value: any, columnDef: any, node: TreeNode<MarketApplication>) {
        const data = node.getData();
        if (data.getAppKey()) {
            var viewer: MarketAppViewer = <MarketAppViewer>node.getViewer("name");
            if (!viewer) {
                viewer = new MarketAppViewer();
                viewer.setObject(node.getData(), node.calcLevel() > 1);
                node.setViewer("name", viewer);
            }
            return viewer.toString();
        }

        return "";
    }

    isEmptyNode(node: TreeNode<MarketApplication>): boolean {
        const data = node.getData();
        return !data.getAppKey();
    }

    private appStatusFormatter(row: number, cell: number, value: any, columnDef: any, node: TreeNode<MarketApplication>) {
        let data = node.getData();
        let statusWrapper = new DivEl();

        if (!!data.getAppKey()) {

            let status = node.getData().getStatus();

            statusWrapper.setHtml(MarketAppStatusFormatter.formatStatus(status));
            statusWrapper.addClass(MarketAppStatusFormatter.getStatusCssClass(status));
        }

        return statusWrapper.toString();
    }

    sortNodeChildren(node: TreeNode<MarketApplication>) {
        this.initData(this.getRoot().getCurrentRoot().treeToList());
    }

    updateInstallApplications(installApplications: Application[]) {
        this.installApplications = installApplications;
    }

    fetchChildren(): wemQ.Promise<MarketApplication[]> {
        let root = this.getRoot().getCurrentRoot();
        let children = root.getChildren();
        var from = root.getChildren().length;
        if (from > 0 && !children[from - 1].getData().getAppKey()) {
            children.pop();
            from--;
        }

        return MarketApplicationsFetcher.fetchChildren(this.getVersion(), this.installApplications, from,
            MarketAppsTreeGrid.MAX_FETCH_SIZE).then(
            (data: MarketApplicationResponse) => {
                let meta = data.getMetadata();
                let applications = children.map((el) => {
                    return el.getData();
                }).slice(0, from).concat(data.getApplications());
                root.setMaxChildren(meta.getTotalHits());
                if (from + meta.getHits() < meta.getTotalHits()) {
                    let emptyApplication = new MarketApplicationBuilder().setLatestVersion("").build();
                    applications.push(emptyApplication);
                }
                return applications;
            }).catch((reason: any) => {
            var status500Message = "Woops... The server seems to be experiencing problems. Please try again later.";
            var defaultErrorMessage = "Enonic Market is temporarily unavailable. Please try again later.";
            this.handleError(reason, reason.getStatusCode() === 500 ? status500Message : defaultErrorMessage);
            return [];
        });
    }

    private getVersion(): string {
        let version: string = CONFIG.xpVersion;
        if (!version) {
            return '';
        }
        let parts = version.split('.');
        if (parts.length > 3) {
            parts.pop(); // remove '.snapshot'
            return parts.join('.');
        }
        return version;
    }

    getDataId(data: MarketApplication): string {
        return data.getAppKey() ? data.getAppKey().toString() : "";
    }
}
