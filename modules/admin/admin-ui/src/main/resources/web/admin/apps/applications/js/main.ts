import {Application} from "../../../common/js/application/Application";
import {App} from "../../../common/js/app/Application";
import {Path} from "../../../common/js/rest/Path";
import {ServerEventsListener} from "../../../common/js/app/ServerEventsListener";
import {LostConnectionDetector} from "../../../common/js/system/LostConnectionDetector";
import {NotifyManager} from "../../../common/js/notify/NotifyManager";
import {showError} from "../../../common/js/notify/MessageBus";
import {UriHelper} from "../../../common/js/util/UriHelper";
import {AppBar} from "../../../common/js/app/bar/AppBar";
import {Body} from "../../../common/js/dom/Body";
import {AppHelper} from "../../../common/js/util/AppHelper";
import {AppLauncherEventType} from "../../../common/js/app/AppLauncherEventType";

declare var CONFIG;

import {ApplicationAppPanel} from "./app/ApplicationAppPanel";
import {InstallAppDialog} from "./app/installation/InstallAppDialog";
import {InstallAppPromptEvent} from "./app/installation/InstallAppPromptEvent";

function getApplication(): App {
    var application = new App('applications', 'Applications', 'AM', 'applications');
    application.setPath(Path.fromString("/"));
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

function startApplication() {

    var application: App = getApplication();
    var appBar = new AppBar(application);
    var appPanel = new ApplicationAppPanel(appBar, application.getPath());

    var body = Body.get();
    body.appendChild(appBar);
    body.appendChild(appPanel);

    AppHelper.preventDragRedirect();

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

    var installAppDialog = new InstallAppDialog();

    InstallAppPromptEvent.on((event) => {
        installAppDialog.updateInstallApplications(event.getInstalledApplications());
        installAppDialog.open();
    });

}

window.onload = function () {
    startApplication();
};
