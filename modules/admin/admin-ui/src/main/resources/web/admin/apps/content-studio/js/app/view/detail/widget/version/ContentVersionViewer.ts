import {Viewer} from "../../../../../../../../common/js/ui/Viewer";
import {ContentVersion} from "../../../../../../../../common/js/content/ContentVersion";
import {NamesAndIconView} from "../../../../../../../../common/js/app/NamesAndIconView";
import {NamesAndIconViewBuilder} from "../../../../../../../../common/js/app/NamesAndIconView";
import {NamesAndIconViewSize} from "../../../../../../../../common/js/app/NamesAndIconViewSize";
import {SpanEl} from "../../../../../../../../common/js/dom/SpanEl";
import {Element} from "../../../../../../../../common/js/dom/Element";
import {BrEl} from "../../../../../../../../common/js/dom/BrEl";

export class ContentVersionViewer extends Viewer<ContentVersion> {

    private namesAndIconView: NamesAndIconView;

    constructor() {
        super();
        this.namesAndIconView = new NamesAndIconViewBuilder().setSize(NamesAndIconViewSize.small).build();
        this.appendChild(this.namesAndIconView);
    }

    private getModifiedString(modified: Date): string {
        var timeDiff = Math.abs(Date.now() - modified.getTime());
        var secInMs = 1000;
        var minInMs = secInMs * 60;
        var hrInMs = minInMs * 60;
        var dayInMs = hrInMs * 24;
        var monInMs = dayInMs * 31;
        var yrInMs = dayInMs * 365;

        if (timeDiff < minInMs) {
            return "less than a minute ago";
        }
        else if (timeDiff < 2 * minInMs) {
            return "a minute ago";
        }
        else if (timeDiff < hrInMs) {
            return ~~(timeDiff / minInMs) + " minutes ago";
        }
        else if (timeDiff < 2 * hrInMs) {
            return "over an hour ago";
        }
        else if (timeDiff < dayInMs) {
            return "over " + ~~(timeDiff / hrInMs) + " hours ago";
        }
        else if (timeDiff < 2 * dayInMs) {
            return "over a day ago";
        }
        else if (timeDiff < monInMs) {
            return "over " + ~~(timeDiff / dayInMs) + " days ago";
        }
        else if (timeDiff < 2 * monInMs) {
            return "over a month ago";
        }
        else if (timeDiff < yrInMs) {
            return "over " + ~~(timeDiff / monInMs) + " months ago";
        }
        else if (timeDiff < 2 * yrInMs) {
            return "over a year ago";
        }

        return "over " + ~~(timeDiff / yrInMs) + " years ago";
    }

    private getModifierSpan(contentVersion: ContentVersion): SpanEl {
        var span = new SpanEl("version-modifier");

        span.setHtml(this.getModifiedString(contentVersion.modified));

        return span;
    }

    private getCommentSpan(contentVersion: ContentVersion): SpanEl {
        if (contentVersion.comment.length = 0) {
            return null;
        }

        var span = new SpanEl("version-comment");
        span.setHtml(contentVersion.comment);
        return span;
    }

    private getSubNameElements(contentVersion: ContentVersion): Element[] {
        var elements: Element[] = [this.getModifierSpan(contentVersion)]/*,
         commentSpan = this.getCommentSpan(contentVersion)*/;

        /*          Uncomment to enable comments in version history
         if (commentSpan) {
         elements.push(new BrEl(), commentSpan);
         }
         */
        return elements;
    }

    setObject(contentVersion: ContentVersion, row?: number) {

        //TODO: use content version image and number instead of row
        this.namesAndIconView
            .setMainName(contentVersion.modifierDisplayName)
            .setSubNameElements(this.getSubNameElements(contentVersion))
            .setIconClass("icon-user");

        return super.setObject(contentVersion);
    }
}

