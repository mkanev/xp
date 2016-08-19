import {Component} from "../../../../../../../../../common/js/content/page/region/Component";
import {ComponentName} from "../../../../../../../../../common/js/content/page/region/ComponentName";
import {ComponentView} from "../../../../../../../../../common/js/liveedit/ComponentView";
import {ContentFormContext} from "../../../../../../../../../common/js/content/form/ContentFormContext";
import {LiveEditModel} from "../../../../../../../../../common/js/liveedit/LiveEditModel";

import {BaseInspectionPanel} from "../BaseInspectionPanel";

export interface ComponentInspectionPanelConfig {

    iconClass: string;
}

export abstract class ComponentInspectionPanel<COMPONENT extends Component> extends BaseInspectionPanel {

    liveEditModel: LiveEditModel;

    formContext: ContentFormContext;

    private component: COMPONENT;

    constructor(config: ComponentInspectionPanelConfig) {
        super();
    }

    setModel(liveEditModel: LiveEditModel) {

        this.liveEditModel = liveEditModel;
        this.formContext = liveEditModel.getFormContext();
    }

    setComponent(component: COMPONENT) {
        this.component = component;
    }

    getComponentView(): ComponentView<Component> {
        throw new Error("Must be implemented by inheritors");
    }

    getComponent(): COMPONENT {
        return this.component;
    }
}
