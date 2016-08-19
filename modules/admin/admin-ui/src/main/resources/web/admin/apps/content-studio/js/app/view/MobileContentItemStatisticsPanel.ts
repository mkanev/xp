import {TabMenuItemBuilder} from "../../../../../common/js/ui/tab/TabMenuItem";
import {ViewItem} from "../../../../../common/js/app/view/ViewItem";
import {ContentSummary} from "../../../../../common/js/content/ContentSummary";
import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {StringHelper} from "../../../../../common/js/util/StringHelper";
import {ResponsiveManager} from "../../../../../common/js/ui/responsive/ResponsiveManager";
import {ResponsiveItem} from "../../../../../common/js/ui/responsive/ResponsiveItem";
import {ItemStatisticsPanel} from "../../../../../common/js/app/view/ItemStatisticsPanel";
import {DivEl} from "../../../../../common/js/dom/DivEl";
import {SpanEl} from "../../../../../common/js/dom/SpanEl";
import {ContentUnnamed} from "../../../../../common/js/content/ContentUnnamed";

import {DetailsPanel, SLIDE_FROM} from "./detail/DetailsPanel";
import {ContentItemPreviewPanel} from "./ContentItemPreviewPanel";
import {MobileDetailsPanelToggleButton} from "./detail/button/MobileDetailsPanelToggleButton";
import {MobileContentTreeGridActions} from "../browse/action/MobileContentTreeGridActions";
import {MobileContentBrowseToolbar} from "../browse/MobileContentBrowseToolbar";

export class MobileContentItemStatisticsPanel extends ItemStatisticsPanel<ContentSummaryAndCompareStatus> {

    private itemHeader: DivEl = new DivEl("mobile-content-item-statistics-header");
    private headerLabel: SpanEl = new SpanEl();

    private previewPanel: ContentItemPreviewPanel;
    private detailsPanel: DetailsPanel = DetailsPanel.create().setUseSplitter(false).setUseViewer(false).setSlideFrom(
        SLIDE_FROM.BOTTOM).setIsMobile(true).build();
    private detailsToggleButton: MobileDetailsPanelToggleButton;

    private mobileBrowseActions: MobileContentTreeGridActions;
    private toolbar: MobileContentBrowseToolbar;

    constructor(mobileBrowseActions: MobileContentTreeGridActions) {
        super("mobile-content-item-statistics-panel");

        this.mobileBrowseActions = mobileBrowseActions;

        this.setDoOffset(false);

        this.initHeader();

        this.initPreviewPanel();

        this.initDetailsPanel();

        this.initToolbar();

        this.onRendered(() => {
            this.slideAllOut();
        });

        ResponsiveManager.onAvailableSizeChanged(this, (item: ResponsiveItem) => {
            this.slideAllOut();
        });
    }

    private initToolbar() {
        this.toolbar = new MobileContentBrowseToolbar(this.mobileBrowseActions);
        this.appendChild(this.toolbar);
    }

    private initHeader() {
        this.itemHeader.appendChild(this.headerLabel);
        this.detailsToggleButton = new MobileDetailsPanelToggleButton(this.detailsPanel, () => {
            this.calcAndSetDetailsPanelTopOffset();
        });
        var backButton = new DivEl("back-button");
        backButton.onClicked((event) => {
            this.slideAllOut();
        });
        this.itemHeader.appendChild(backButton);
        this.itemHeader.appendChild(this.detailsToggleButton);

        this.appendChild(this.itemHeader);

    }

    private initDetailsPanel() {
        this.detailsPanel.addClass("mobile");
        this.appendChild(this.detailsPanel);
    }

    private initPreviewPanel() {
        this.previewPanel = new ContentItemPreviewPanel();
        this.previewPanel.setDoOffset(false);
        this.appendChild(this.previewPanel);
    }

    setItem(item: ViewItem<ContentSummaryAndCompareStatus>) {
        if (!this.getItem() || !this.getItem().equals(item)) {
            super.setItem(item);
            this.previewPanel.setItem(item);
            this.detailsPanel.setItem(item ? item.getModel() : null);
            if (item) {
                this.setName(this.makeDisplayName(item));
            }
        }
        this.slideIn();
    }

    private makeDisplayName(item: ViewItem<ContentSummaryAndCompareStatus>): string {
        let localName = item.getModel().getType().getLocalName() || "";
        return StringHelper.isEmpty(item.getDisplayName())
            ? ContentUnnamed.prettifyUnnamed(localName)
            : item.getDisplayName();
    }

    getDetailsPanel(): DetailsPanel {
        return this.detailsPanel;
    }

    setName(name: string) {
        this.headerLabel.setHtml(name);
    }

    slideAllOut() {
        this.slideOut();
        this.detailsPanel.slideOut();
        this.detailsToggleButton.removeClass("expanded");
    }

    slideOut() {
        this.getEl().setRightPx(-this.getEl().getWidthWithBorder());
    }

    slideIn() {
        //this.calcAndSetDetailsPanelTopOffset();
        this.getEl().setRightPx(0);
    }

    private calcAndSetDetailsPanelTopOffset() {
        this.detailsPanel.getEl().setTopPx(this.itemHeader.getEl().getHeightWithMargin());
    }
}
