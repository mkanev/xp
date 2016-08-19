import {ContentVersion} from "../../../../../../../../common/js/content/ContentVersion";
import {ContentId} from "../../../../../../../../common/js/content/ContentId";
import {ContentSummaryAndCompareStatus} from "../../../../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {ListBox} from "../../../../../../../../common/js/ui/selector/list/ListBox";
import {CompareStatus} from "../../../../../../../../common/js/content/CompareStatus";
import {Element} from "../../../../../../../../common/js/dom/Element";
import {LiEl} from "../../../../../../../../common/js/dom/LiEl";
import {GetContentVersionsForViewRequest} from "../../../../../../../../common/js/content/resource/GetContentVersionsForViewRequest";
import {ContentVersions} from "../../../../../../../../common/js/content/ContentVersions";
import {CompareStatusFormatter} from "../../../../../../../../common/js/content/CompareStatus";
import {DivEl} from "../../../../../../../../common/js/dom/DivEl";
import {SpanEl} from "../../../../../../../../common/js/dom/SpanEl";
import {DateTimeFormatter} from "../../../../../../../../common/js/ui/treegrid/DateTimeFormatter";
import {ActionButton} from "../../../../../../../../common/js/ui/button/ActionButton";
import {Action} from "../../../../../../../../common/js/ui/Action";
import {SetActiveContentVersionRequest} from "../../../../../../../../common/js/content/resource/SetActiveContentVersionRequest";
import {NotifyManager} from "../../../../../../../../common/js/notify/NotifyManager";
import {ActiveContentVersionSetEvent} from "../../../../../../../../common/js/content/event/ActiveContentVersionSetEvent";

import {ContentVersionViewer} from "./ContentVersionViewer";

export class VersionsView extends ListBox<ContentVersion> {

    private contentId: ContentId;
    private status: CompareStatus;
    private loadedListeners: {(): void}[] = [];
    private activeVersion: ContentVersion;

    private static branchMaster = "master";
    private static branchDraft = "draft";

    constructor() {
        super("all-content-versions");
    }

    setContentData(item: ContentSummaryAndCompareStatus) {
        this.contentId = item.getContentId();
        this.status = item.getCompareStatus();
    }

    reload(): wemQ.Promise<void> {
        return this.loadData().then((contentVersions: ContentVersion[]) => {
            this.updateView(contentVersions);
            this.notifyLoaded();
        })
    }

    createItemView(item: ContentVersion, readOnly: boolean): Element {
        var itemContainer = new LiEl("content-version-item");

        this.createStatusBlock(item, itemContainer);
        this.createDataBlocks(item, itemContainer);
        this.addOnClickHandler(itemContainer);

        return itemContainer;
    }

    getItemId(item: ContentVersion): string {
        return item.id;
    }

    onLoaded(listener: () => void) {
        this.loadedListeners.push(listener);
    }

    unLoaded(listener: () => void) {
        this.loadedListeners = this.loadedListeners.filter((curr) => {
            return curr !== listener;
        });
    }

    private notifyLoaded() {
        this.loadedListeners.forEach((listener) => {
            listener();
        });
    }

    private loadData(): wemQ.Promise<ContentVersion[]> {
        if (this.contentId) {
            return new GetContentVersionsForViewRequest(this.contentId).sendAndParse().then(
                (contentVersions: ContentVersions) => {
                    this.activeVersion = contentVersions.getActiveVersion();
                    return contentVersions.getContentVersions();
                });
        } else {
            throw new Error("Required contentId not set for ActiveContentVersionsTreeGrid")
        }
    }

    private updateView(contentVersions: ContentVersion[]) {
        this.clearItems();
        this.setItems(contentVersions);
        this.getItemView(this.activeVersion).addClass("active");
    }

    private getStatus(contentVersion: ContentVersion): ContentVersionStatus {
        if (this.status == undefined) {
            return null;
        }
        var result = null;

        var hasMaster = contentVersion.workspaces.some((workspace) => {
            return workspace == VersionsView.branchMaster;
        });

        contentVersion.workspaces.some((workspace: string) => {
            if (!hasMaster || workspace == VersionsView.branchMaster) {
                result = {workspace: workspace, status: this.getState(workspace)};
                return true;
            }
        });

        return result;
    }

    private getState(workspace): string {
        if (workspace == VersionsView.branchMaster) {
            return CompareStatusFormatter.formatStatus(CompareStatus.EQUAL);
        }
        else {
            return CompareStatusFormatter.formatStatus(this.status);
        }
    }

    private createStatusBlock(item: ContentVersion, itemEl: Element) {
        var contentVersionStatus = this.getStatus(item);
        if (!!contentVersionStatus) {
            var statusDiv = new DivEl("status " + contentVersionStatus.workspace);
            statusDiv.setHtml(contentVersionStatus.status);
            itemEl.appendChild(statusDiv);
        }
    }

    private createDataBlocks(item: ContentVersion, itemEl: Element) {
        var descriptionDiv = this.createDescriptionBlock(item),
            versionInfoDiv = this.createVersionInfoBlock(item),
            closeButton = this.createCloseButton();

        itemEl.appendChildren(closeButton, descriptionDiv, versionInfoDiv);
    }

    private createCloseButton(): Element {
        return new DivEl("close-version-info-button hidden");
    }

    private createDescriptionBlock(item: ContentVersion): Element {
        var descriptionDiv = new ContentVersionViewer();
        descriptionDiv.addClass("description");
        descriptionDiv.setObject(item);
        return descriptionDiv;
    }

    private createVersionInfoBlock(item: ContentVersion): Element {
        var versionInfoDiv = new DivEl("version-info hidden");

        var timestampDiv = new DivEl("version-info-timestamp");
        timestampDiv.appendChildren(new SpanEl("label").setHtml("Timestamp: "),
            new SpanEl().setHtml(DateTimeFormatter.createHtml(item.modified)));

        var versionIdDiv = new DivEl("version-info-version-id");
        versionIdDiv.appendChildren(new SpanEl("label").setHtml("Version Id: "), new SpanEl().setHtml(item.id));

        var displayNameDiv = new DivEl("version-info-display-name");
        displayNameDiv.appendChildren(new SpanEl("label").setHtml("Display name: "),
            new SpanEl().setHtml(item.displayName));

        var isActive = item.id === this.activeVersion.id;
        var restoreButton = new ActionButton(new Action(isActive
            ? "This version is active"
            : "Restore this version").onExecuted((action: Action) => {
            if (!isActive) {
                new SetActiveContentVersionRequest(item.id, this.contentId).sendAndParse().then(
                    (contentId: ContentId) => {
                    NotifyManager.get().showFeedback(`Version successfully changed to ${item.id}`);
                    new ActiveContentVersionSetEvent(this.contentId, item.id).fire();
                });
            }
        }), false);

        if (isActive) {
            restoreButton.addClass("active");
        }

        restoreButton.onClicked((event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
        });

        versionInfoDiv.appendChildren(timestampDiv, versionIdDiv, displayNameDiv, restoreButton);

        return versionInfoDiv;
    }

    private addOnClickHandler(itemContainer: Element) {
        itemContainer.onClicked(() => {
            this.collapseAllContentVersionItemViewsExcept(itemContainer);
            itemContainer.toggleClass("expanded");
        });
    }

    private collapseAllContentVersionItemViewsExcept(itemContainer: Element) {
        wemjq(this.getHTMLElement()).find(".content-version-item").not(itemContainer.getHTMLElement()).removeClass("expanded");
    }
}

export class ContentVersionStatus {
    workspace: string;

    status: string;
}
