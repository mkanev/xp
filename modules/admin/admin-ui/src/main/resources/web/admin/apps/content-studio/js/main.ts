import {App} from "../../../common/js/app/Application";
import {Path} from "../../../common/js/rest/Path";
import {ServerEventsListener} from "../../../common/js/app/ServerEventsListener";
import {LostConnectionDetector} from "../../../common/js/system/LostConnectionDetector";
import {NotifyManager} from "../../../common/js/notify/NotifyManager";
import {showError} from "../../../common/js/notify/MessageBus";
import {UriHelper} from "../../../common/js/util/UriHelper";
import {StyleHelper} from "../../../common/js/StyleHelper";
import {StringHelper} from "../../../common/js/util/StringHelper";
import {Body} from "../../../common/js/dom/Body";
import {AppBar} from "../../../common/js/app/bar/AppBar";
import {ContentSummary} from "../../../common/js/content/ContentSummary";
import {GetContentByIdRequest} from "../../../common/js/content/resource/GetContentByIdRequest";
import {Content} from "../../../common/js/content/Content";
import {GetContentByPathRequest} from "../../../common/js/content/resource/GetContentByPathRequest";
import {DefaultErrorHandler} from "../../../common/js/DefaultErrorHandler";
import {AppHelper} from "../../../common/js/util/AppHelper";
import {AppLauncherEventType} from "../../../common/js/app/AppLauncherEventType";
import {ContentServerEventsHandler} from "../../../common/js/content/event/ContentServerEventsHandler";

import {Router} from "./app/Router";
import {ContentAppPanel} from "./app/ContentAppPanel";
import {ContentDeletePromptEvent} from "./app/browse/ContentDeletePromptEvent";
import {ContentPublishPromptEvent} from "./app/browse/ContentPublishPromptEvent";
import {ContentUnpublishPromptEvent} from "./app/browse/ContentUnpublishPromptEvent";
import {ContentDeleteDialog} from "./app/remove/ContentDeleteDialog";
import {ContentPublishDialog} from "./app/publish/ContentPublishDialog";
import {ContentUnpublishDialog} from "./app/publish/ContentUnpublishDialog";
import {NewContentDialog} from "./app/create/NewContentDialog";
import {ShowNewContentDialogEvent} from "./app/browse/ShowNewContentDialogEvent";
import {SortContentDialog} from "./app/browse/SortContentDialog";
import {MoveContentDialog} from "./app/browse/MoveContentDialog";
import {EditPermissionsDialog} from "./app/wizard/EditPermissionsDialog";

declare var CONFIG;

/*
 module components {
 export var detailPanel: app.browse.ContentBrowseItemPanel;
 }
 */

function getApplication(): App {
    var application = new App('content-studio', 'Content Studio', 'CM', 'content-studio');
    application.setPath(Path.fromString(Router.getPath()));
    application.setWindow(window);
    this.serverEventsListener = new ServerEventsListener([application]);

    var messageId;
    this.lostConnectionDetector = new LostConnectionDetector();
    this.lostConnectionDetector.setAuthenticated(true);
    this.lostConnectionDetector.onConnectionLost(() => {
        NotifyManager.get().hide(messageId);
        messageId = showError("Lost connection to server - Please wait until connection is restored", false);
    });
    this.lostConnectionDetector.onSessionExpired(() => {
        NotifyManager.get().hide(messageId);
        window.location.href = UriHelper.getToolUri("");
    });
    this.lostConnectionDetector.onConnectionRestored(() => {
        NotifyManager.get().hide(messageId);
    });

    return application;
}

function initToolTip() {
    var ID = StyleHelper.getCls("tooltip", StyleHelper.COMMON_PREFIX),
        CLS_ON = "tooltip_ON", FOLLOW = true,
        DATA = "_tooltip", OFFSET_X = 0, OFFSET_Y = 20,
        pageX = 0, pageY = 0,
        showAt = function (e) {
            var ntop = pageY + OFFSET_Y, nleft = pageX + OFFSET_X;
            var tooltipText = StringHelper.escapeHtml(wemjq(e.target).data(DATA));
            if (!tooltipText) { //if no text then probably hovering over children of original element that has title attr
                return;
            }
            
            var tooltipWidth = tooltipText.length * 7.5;
            var windowWidth = wemjq(window).width();
            if (nleft + tooltipWidth >= windowWidth) {
                nleft = windowWidth - tooltipWidth;
            }
            wemjq("#" + ID).html(tooltipText).css({
                position: "absolute", top: ntop, left: nleft
            }).show();
        };
    wemjq(document).on("mouseenter", "*[title]", function (e) {
        wemjq(this).data(DATA, wemjq(this).attr("title"));
        wemjq(this).removeAttr("title").addClass(CLS_ON);
        wemjq("<div id='" + ID + "' />").appendTo("body");
        if (e.pageX) {
            pageX = e.pageX;
        }
        if (e.pageY) {
            pageY = e.pageY;
        }
        showAt(e);
    });
    wemjq(document).on("mouseleave click", "." + CLS_ON, function (e) {
        if (wemjq(this).data(DATA)) {
            wemjq(this).attr("title", wemjq(this).data(DATA));
        }
        wemjq(this).removeClass(CLS_ON);
        wemjq("#" + ID).remove();
    });
    if (FOLLOW) { wemjq(document).on("mousemove", "." + CLS_ON, showAt); }
}

function startApplication() {

    var application: App = getApplication();

    var body = Body.get();

    var appBar = new AppBar(application);
    var appPanel = new ContentAppPanel(appBar, application.getPath());

    body.appendChild(appBar);
    body.appendChild(appPanel);

    var contentDeleteDialog = new ContentDeleteDialog();
    ContentDeletePromptEvent.on((event) => {
        contentDeleteDialog
            .setContentToDelete(event.getModels())
            .setYesCallback(event.getYesCallback())
            .setNoCallback(event.getNoCallback())
            .open();
    });

    var contentPublishDialog = new ContentPublishDialog();
    ContentPublishPromptEvent.on((event) => {
        contentPublishDialog
            .setContentToPublish(event.getModels())
            .open();

        if (event.isIncludeChildItems()) {
            contentPublishDialog.setIncludeChildItems(event.isIncludeChildItems());
        }
    });

    var contentUnpublishDialog = new ContentUnpublishDialog();
    ContentUnpublishPromptEvent.on((event) => {
        contentUnpublishDialog
            .setContentToUnpublish(event.getModels())
            .open();
    });

    var newContentDialog = new NewContentDialog();
    ShowNewContentDialogEvent.on((event) => {

        var parentContent: ContentSummary = event.getParentContent()
            ? event.getParentContent().getContentSummary() : null;

        if (parentContent != null) {
            new GetContentByIdRequest(parentContent.getContentId()).sendAndParse().then(
                (newParentContent: Content) => {

                    // TODO: remove pyramid of doom
                    if (parentContent.hasParent() && parentContent.getType().isTemplateFolder()) {
                        new GetContentByPathRequest(parentContent.getPath().getParentPath()).sendAndParse().then(
                            (grandParent: Content) => {

                                newContentDialog.setParentContent(newParentContent);
                                newContentDialog.open();
                            }).catch((reason: any) => {
                                DefaultErrorHandler.handle(reason);
                            }).done();
                    }
                    else {
                        newContentDialog.setParentContent(newParentContent);
                        newContentDialog.open();
                    }
                }).catch((reason: any) => {
                    DefaultErrorHandler.handle(reason);
                }).done();
        }
        else {
            newContentDialog.setParentContent(null);
            newContentDialog.open();
        }
    });

    initToolTip();

    AppHelper.preventDragRedirect();

    var sortDialog = new SortContentDialog();
    var moveDialog = new MoveContentDialog();
    var editPermissionsDialog = new EditPermissionsDialog();
    application.setLoaded(true);
    this.serverEventsListener.start();
    this.lostConnectionDetector.startPolling();

    window.onmessage = (e: MessageEvent) => {
        if (e.data.appLauncherEvent) {
            var eventType: AppLauncherEventType = AppLauncherEventType[<string>e.data.appLauncherEvent];
            if (eventType == AppLauncherEventType.Show) {
                appPanel.activateCurrentKeyBindings();
            }
        }
    };

    ContentServerEventsHandler.getInstance().start();
}

window.onload = function () {
    startApplication();
};
