import {Region} from "../../../../../../../../../common/js/content/page/region/Region";
import {NamesAndIconView} from "../../../../../../../../../common/js/app/NamesAndIconView";
import {NamesAndIconViewBuilder} from "../../../../../../../../../common/js/app/NamesAndIconView";
import {NamesAndIconViewSize} from "../../../../../../../../../common/js/app/NamesAndIconViewSize";
import {ItemViewIconClassResolver} from "../../../../../../../../../common/js/liveedit/ItemViewIconClassResolver";

import {BaseInspectionPanel} from "../BaseInspectionPanel";

export class RegionInspectionPanel extends BaseInspectionPanel {

    private region: Region;

    private namesAndIcon: NamesAndIconView;

    constructor() {
        super();

        this.namesAndIcon =
            new NamesAndIconView(new NamesAndIconViewBuilder().setSize(NamesAndIconViewSize.medium)).setIconClass(
                ItemViewIconClassResolver.resolveByType("region"));

        this.appendChild(this.namesAndIcon);
    }

    setRegion(region: Region) {

        this.region = region;

        if (region) {
            this.namesAndIcon.setMainName(region.getName());
            this.namesAndIcon.setSubName(region.getPath().toString());
        }
        else {
            this.namesAndIcon.setMainName("[No  Region given]");
            this.namesAndIcon.setSubName("");
        }
    }

}
