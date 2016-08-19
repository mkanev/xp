import {Action} from "../../../../../common/js/ui/Action";
import {RenderingMode} from "../../../../../common/js/rendering/RenderingMode";
import {AppHelper} from "../../../../../common/js/util/AppHelper";
import {showWarning} from "../../../../../common/js/notify/MessageBus";
import {ContentSummary} from "../../../../../common/js/content/ContentSummary";
import {PortalUriHelper} from "../../../../../common/js/rendering/PortalUriHelper";
import {Branch} from "../../../../../common/js/content/Branch";

interface OpenedWindow {
    openedWindow: Window,
    isBlocked: boolean
}

export class BasePreviewAction extends Action {

    private notifyBlocked: () => void;

    constructor(label: string, shortcut?: string, global?: boolean) {
        super(label, shortcut, global);
        // Notification is shown not less than once in a minute, if triggered
        this.notifyBlocked = AppHelper.debounce(() => {
            const message = "Pop-up Blocker is enabled in browser settings! Please add selected sites to the exception list.";
            showWarning(message, false);
        }, 60000, true);
    }

    private popupCheck(win: Window) {
        const isBlocked = !win || win.closed || typeof win.closed == "undefined";

        if (isBlocked) {
            this.notifyBlocked();
        }

        return isBlocked;
    }

    // should be called only in async block
    protected openWindow(content: ContentSummary) {
        const targetWindow = this.openBlankWindow(content);
        if (!targetWindow.isBlocked) {
            this.updateLocation(targetWindow.openedWindow, content, false);
        }
    }

    // should be called only in async block
    protected openWindows(contents: ContentSummary[]) {
        contents.forEach((content) => this.openWindow(content));
    }

    // should be called only in async block
    protected openBlankWindow(content: ContentSummary): OpenedWindow {
        const openedWindow = window.open('', content.getId());
        const isBlocked = this.popupCheck(openedWindow);
        return {openedWindow, isBlocked};
    }

    protected updateLocation(targetWindow, content: ContentSummary, focus: boolean = true) {
        targetWindow.location.href = PortalUriHelper.getPortalUri(content.getPath().toString(),
            RenderingMode.PREVIEW, Branch.DRAFT);
        if (focus) {
            targetWindow.focus(); // behavior depends on user settings for firefox
        }
    }
}
