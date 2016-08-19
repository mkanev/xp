import {ItemViewPanel} from "../../../../../common/js/app/view/ItemViewPanel";
import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {ItemStatisticsPanel} from "../../../../../common/js/app/view/ItemStatisticsPanel";
import {DeckPanel} from "../../../../../common/js/ui/panel/DeckPanel";
import {Action} from "../../../../../common/js/ui/Action";
import {ElementShownEvent} from "../../../../../common/js/dom/ElementShownEvent";
import {ViewItem} from "../../../../../common/js/app/view/ViewItem";

import {ContentItemPreviewPanel} from "./ContentItemPreviewPanel";
import {ContentItemViewToolbar} from "./ContentItemViewToolbar";
import {EditAction} from "./EditAction";
import {DeleteAction} from "./DeleteAction";
import {CloseAction} from "./CloseAction";
import {ContentItemStatisticsPanel} from "./ContentItemStatisticsPanel";
import {Router} from "../Router";
import {ShowPreviewEvent} from "../browse/ShowPreviewEvent";
import {ShowDetailsEvent} from "../browse/ShowDetailsEvent";

export class ContentItemViewPanel extends ItemViewPanel<ContentSummaryAndCompareStatus> {

    private statisticsPanel: ItemStatisticsPanel<ContentSummaryAndCompareStatus>;

    private statisticsPanelIndex: number;

    private previewPanel: ContentItemPreviewPanel;

    private previewMode: boolean;

    private previewPanelIndex: number;

    private deckPanel: DeckPanel;

    private editAction: Action;

    private deleteAction: Action;

    private closeAction: Action;

    private actions: Action[];

    constructor() {

        this.deckPanel = new DeckPanel();

        this.editAction = new EditAction(this);
        this.deleteAction = new DeleteAction(this);
        this.closeAction = new CloseAction(this, true);

        this.actions = [this.editAction, this.deleteAction, this.closeAction];

        var toolbar = new ContentItemViewToolbar({
            editAction: this.editAction,
            deleteAction: this.deleteAction
        });

        super(toolbar, this.deckPanel);

        this.statisticsPanel = new ContentItemStatisticsPanel();
        this.previewPanel = new ContentItemPreviewPanel();

        this.statisticsPanelIndex = this.deckPanel.addPanel(this.statisticsPanel);
        this.previewPanelIndex = this.deckPanel.addPanel(this.previewPanel);

        this.showPreview(false);

        ShowPreviewEvent.on((event) => {
            this.showPreview(true);
        });

        ShowDetailsEvent.on((event) => {
            this.showPreview(false);
        });

        this.onShown((event: ElementShownEvent) => {
            if (this.getItem()) {
                Router.setHash("view/" + this.getItem().getModel().getId());
            }
        });
    }

    setItem(item: ViewItem<ContentSummaryAndCompareStatus>) {
        super.setItem(item);
        this.statisticsPanel.setItem(item);
        this.previewPanel.setItem(item);
    }


    public showPreview(enabled: boolean) {
        this.previewMode = enabled;
        // refresh the view
        if (enabled) {
            this.deckPanel.showPanelByIndex(this.previewPanelIndex);
        } else {
            this.deckPanel.showPanelByIndex(this.statisticsPanelIndex);
        }
    }

    public getCloseAction(): Action {
        return this.closeAction;
    }

    getActions(): Action[] {
        return this.actions;
    }

}
