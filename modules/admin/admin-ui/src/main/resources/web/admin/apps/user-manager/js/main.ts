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
import {PrincipalServerEventsHandler} from "../../../common/js/security/event/PrincipalServerEventsHandler";

declare var CONFIG;

import {UserAppPanel} from "./app/UserAppPanel";
import {ChangeUserPasswordDialog} from "./app/wizard/ChangeUserPasswordDialog";
import {Router} from "./app/Router";

function getApplication(): App {
    var application = new App('user-manager', 'Users', 'UM', 'user-manager');
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

function startApplication() {

    var application: App = getApplication();
    var appBar = new AppBar(application);
    var appPanel = new UserAppPanel(appBar, application.getPath());

    var body = Body.get();
    body.appendChild(appBar);
    body.appendChild(appPanel);

    AppHelper.preventDragRedirect();

    var changePasswordDialog = new ChangeUserPasswordDialog();
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
    PrincipalServerEventsHandler.getInstance().start();
}

window.onload = function () {
    startApplication();
};
