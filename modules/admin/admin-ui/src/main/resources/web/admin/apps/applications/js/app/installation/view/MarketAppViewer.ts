import {MarketApplication} from "../../../../../../common/js/application/MarketApplication";
import {NamesAndIconViewSize} from "../../../../../../common/js/app/NamesAndIconViewSize";
import {Viewer} from "../../../../../../common/js/ui/Viewer";
import {NamesAndIconView} from "../../../../../../common/js/app/NamesAndIconView";
import {AEl} from "../../../../../../common/js/dom/AEl";
import {NamesAndIconViewBuilder} from "../../../../../../common/js/app/NamesAndIconView";

export class MarketAppViewer extends Viewer<MarketApplication> {

    private namesAndIconView: NamesAndIconView;

    private relativePath: boolean;

    private size: NamesAndIconViewSize;

    public static debug: boolean = false;

    constructor(className?: string, size: NamesAndIconViewSize = NamesAndIconViewSize.small) {
        super(className);

        this.size = size;
    }

    setObject(object: MarketApplication, relativePath: boolean = false): wemQ.Promise<boolean> {
        this.relativePath = relativePath;
        super.setObject(object);

        return wemQ(true);
    }

    resolveDisplayName(object: MarketApplication): string {
        var appLink = new AEl().setUrl(object.getUrl(), "_blank").setHtml(object.getDisplayName(), false);
        return appLink.toString();
    }

    resolveSubName(object: MarketApplication, relativePath: boolean = false): string {
        return object.getDescription();
    }

    resolveSubTitle(object: MarketApplication): string {
        return object.getDescription();
    }

    resolveIconUrl(object: MarketApplication): string {
        return object.getIconUrl();
    }

    getPreferredHeight(): number {
        return 50;
    }

    doLayout(object: MarketApplication) {
        super.doLayout(object);

        if (MarketAppViewer.debug) {
            console.debug("MarketAppViewer.doLayout");
        }

        if (!this.namesAndIconView) {
            this.namesAndIconView = new NamesAndIconViewBuilder().setSize(this.size).build();
            this.appendChild(this.namesAndIconView);
        }

        if (object) {
            var displayName = this.resolveDisplayName(object),
                subName = this.resolveSubName(object, this.relativePath),
                subTitle = this.resolveSubTitle(object),
                iconUrl = this.resolveIconUrl(object);

            this.namesAndIconView.getNamesView().setMainName(displayName, false).setSubName(subName, subTitle);
            if (!!subTitle) {
                this.namesAndIconView.getEl().setTitle(subTitle);
            } else if (!!subName) {
                this.namesAndIconView.getEl().setTitle(subName);
            }
            if (!!iconUrl) {
                this.namesAndIconView.setIconUrl(iconUrl);
            }
            this.namesAndIconView.getIconImageEl().onError(() => {
                this.namesAndIconView.setIconClass("icon-puzzle icon-large");
                this.namesAndIconView.getIconImageEl().setSrc("");
            });
        }
    }
}
