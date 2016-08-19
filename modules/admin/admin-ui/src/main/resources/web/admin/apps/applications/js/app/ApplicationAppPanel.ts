import {Application} from "../../../../common/js/application/Application";
import {BrowseAndWizardBasedAppPanel} from "../../../../common/js/app/BrowseAndWizardBasedAppPanel";
import {AppBar} from "../../../../common/js/app/bar/AppBar";
import {Path} from "../../../../common/js/rest/Path";
import {ShowBrowsePanelEvent} from "../../../../common/js/app/ShowBrowsePanelEvent";
import {BrowsePanel} from "../../../../common/js/app/browse/BrowsePanel";

import {ApplicationBrowsePanel} from "./browse/ApplicationBrowsePanel";

export class ApplicationAppPanel extends BrowseAndWizardBasedAppPanel<Application> {

    constructor(appBar: AppBar, path?: Path) {

        super({
            appBar: appBar
        });

        this.handleGlobalEvents();

        this.route(path)
    }

    private route(path?: Path) {
        var action = path ? path.getElement(0) : undefined;

        switch (action) {
        case 'edit':
            var id = path.getElement(1);
            if (id) {
                //TODO
            }
            break;
        case 'view' :
            var id = path.getElement(1);
            if (id) {
                //TODO
            }
            break;
        default:
            new ShowBrowsePanelEvent().fire();
            break;
        }
    }

    private handleGlobalEvents() {

        ShowBrowsePanelEvent.on((event) => {
            this.handleBrowse(event);
        });
    }

    private handleBrowse(event: ShowBrowsePanelEvent) {
        var browsePanel: BrowsePanel<Application> = this.getBrowsePanel();
        if (!browsePanel) {
            this.addBrowsePanel(new ApplicationBrowsePanel());
        } else {
            this.showPanel(browsePanel);
        }
    }
}
