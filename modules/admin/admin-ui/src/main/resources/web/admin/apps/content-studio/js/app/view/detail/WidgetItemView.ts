import {Element} from "../../../../../../common/js/dom/Element";
import {LabelEl} from "../../../../../../common/js/dom/LabelEl";
import {LinkEl} from "../../../../../../common/js/dom/LinkEl";
import {DivEl} from "../../../../../../common/js/dom/DivEl";

export class WidgetItemView extends DivEl {

    public static debug = false;
    private uid: string = "";

    constructor(className?: string) {
        super("widget-item-view" + (className ? " " + className : ""));
    }

    public layout(): wemQ.Promise<any> {
        if (WidgetItemView.debug) {
            console.debug('WidgetItemView.layout: ', this);
        }
        return wemQ<any>(null);
    }

    private getFullWidgetUrl(url: string, uid: string, contentId: string) {
        return url + "?uid=" + uid + "&contentId=" + contentId;
    }

    public setUrl(url: string, contentId: string, keepId: boolean = false): wemQ.Promise<void> {
        var deferred = wemQ.defer<void>(),
            uid = (!keepId || !this.uid) ? Date.now().toString() : this.uid,
            linkEl = new LinkEl(this.getFullWidgetUrl(url, uid, contentId)).setAsync(),
            el = this.getEl(),
            onLinkLoaded = ((event: UIEvent) => {
                var mainContainer = event.target["import"].body;
                if (mainContainer) {
                    var html = this.stripOffAssets(mainContainer.innerHTML);
                    el.getHTMLElement().insertAdjacentHTML('beforeend', html);
                }

                linkEl.unLoaded(onLinkLoaded);
                deferred.resolve(null);
            });

        this.uid = uid;
        this.removeChildren();

        linkEl.onLoaded(onLinkLoaded);
        this.appendChild(linkEl);

        return deferred.promise;
    }

    private stripOffAssets(html: string): string {
        return html.replace(/(?:<script\b[^>]*>[\s\S]*?<\/script>)|(?:<link\b[^<>]*[\\/]?>)/gm, "");
    }
}
