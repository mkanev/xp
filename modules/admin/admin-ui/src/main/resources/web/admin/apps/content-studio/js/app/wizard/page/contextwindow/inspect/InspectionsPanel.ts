import {Action} from "../../../../../../../../common/js/ui/Action";
import {Panel} from "../../../../../../../../common/js/ui/panel/Panel";
import {DeckPanel} from "../../../../../../../../common/js/ui/panel/DeckPanel";
import {DivEl} from "../../../../../../../../common/js/dom/DivEl";
import {ActionButton} from "../../../../../../../../common/js/ui/button/ActionButton";
import {ObjectHelper} from "../../../../../../../../common/js/ObjectHelper";

import {ContentInspectionPanel} from "./ContentInspectionPanel";
import {FragmentInspectionPanel} from "./region/FragmentInspectionPanel";
import {TextInspectionPanel} from "./region/TextInspectionPanel";
import {LayoutInspectionPanel} from "./region/LayoutInspectionPanel";
import {PartInspectionPanel} from "./region/PartInspectionPanel";
import {ImageInspectionPanel} from "./region/ImageInspectionPanel";
import {RegionInspectionPanel} from "./region/RegionInspectionPanel";
import {PageInspectionPanel} from "./page/PageInspectionPanel";
import {NoSelectionInspectionPanel} from "./NoSelectionInspectionPanel";

export interface InspectionsPanelConfig {
    contentInspectionPanel: ContentInspectionPanel;
    pageInspectionPanel: PageInspectionPanel;
    regionInspectionPanel: RegionInspectionPanel;
    imageInspectionPanel: ImageInspectionPanel;
    partInspectionPanel: PartInspectionPanel;
    layoutInspectionPanel: LayoutInspectionPanel;
    fragmentInspectionPanel: FragmentInspectionPanel;
    textInspectionPanel: TextInspectionPanel;
    saveAction: Action;
}

export class InspectionsPanel extends Panel {

    private deck: DeckPanel;
    private buttons: DivEl;

    private noSelectionPanel: NoSelectionInspectionPanel;
    private imageInspectionPanel: ImageInspectionPanel;
    private partInspectionPanel: PartInspectionPanel;
    private layoutInspectionPanel: LayoutInspectionPanel;
    private contentInspectionPanel: ContentInspectionPanel;
    private pageInspectionPanel: PageInspectionPanel;
    private regionInspectionPanel: RegionInspectionPanel;
    private fragmentInspectionPanel: FragmentInspectionPanel;
    private textInspectionPanel: TextInspectionPanel;

    private saveRequestListeners: {() : void}[] = [];

    constructor(config: InspectionsPanelConfig) {
        super('inspections-panel');

        this.deck = new DeckPanel();

        this.noSelectionPanel = new NoSelectionInspectionPanel();
        this.imageInspectionPanel = config.imageInspectionPanel;
        this.partInspectionPanel = config.partInspectionPanel;
        this.layoutInspectionPanel = config.layoutInspectionPanel;
        this.contentInspectionPanel = config.contentInspectionPanel;
        this.pageInspectionPanel = config.pageInspectionPanel;
        this.regionInspectionPanel = config.regionInspectionPanel;
        this.fragmentInspectionPanel = config.fragmentInspectionPanel;
        this.textInspectionPanel = config.textInspectionPanel;

        this.deck.addPanel(this.imageInspectionPanel);
        this.deck.addPanel(this.partInspectionPanel);
        this.deck.addPanel(this.layoutInspectionPanel);
        this.deck.addPanel(this.contentInspectionPanel);
        this.deck.addPanel(this.regionInspectionPanel);
        this.deck.addPanel(this.pageInspectionPanel);
        this.deck.addPanel(this.fragmentInspectionPanel);
        this.deck.addPanel(this.textInspectionPanel);
        this.deck.addPanel(this.noSelectionPanel);

        this.deck.showPanel(this.pageInspectionPanel);

        this.buttons = new DivEl('button-bar');
        var saveButton = new ActionButton(config.saveAction);
        this.buttons.appendChild(saveButton);

        this.appendChildren(this.deck, this.buttons);

    }

    public showInspectionPanel(panel: Panel) {
        this.deck.showPanel(panel);
        var showButtons = !(ObjectHelper.iFrameSafeInstanceOf(panel, RegionInspectionPanel) ||
                            ObjectHelper.iFrameSafeInstanceOf(panel, NoSelectionInspectionPanel));
        this.buttons.setVisible(showButtons);
    }

    public clearInspection() {
        this.showInspectionPanel(this.pageInspectionPanel);
    }

    public isInspecting(): boolean {
        return this.deck.getPanelShown() != this.noSelectionPanel;
    }

}
