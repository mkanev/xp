import {FormView} from "../../../../../../../../../common/js/form/FormView";
import {DescriptorBasedComponent} from "../../../../../../../../../common/js/content/page/region/DescriptorBasedComponent";
import {DescriptorKey} from "../../../../../../../../../common/js/content/page/DescriptorKey";
import {Descriptor} from "../../../../../../../../../common/js/content/page/Descriptor";
import {LiveEditModel} from "../../../../../../../../../common/js/liveedit/LiveEditModel";
import {SiteModel} from "../../../../../../../../../common/js/content/site/SiteModel";
import {DescriptorBasedDropdown} from "../../../../../../../../../common/js/content/page/DescriptorBasedDropdown";
import {GetLayoutDescriptorsByApplicationsRequest} from "../../../../../../../../../common/js/content/page/region/GetLayoutDescriptorsByApplicationsRequest";
import {GetPartDescriptorsByApplicationsRequest} from "../../../../../../../../../common/js/content/page/region/GetPartDescriptorsByApplicationsRequest";
import {DefaultErrorHandler} from "../../../../../../../../../common/js/DefaultErrorHandler";

import {ComponentInspectionPanel} from "./ComponentInspectionPanel";
import {ComponentInspectionPanelConfig} from "./ComponentInspectionPanel";

export interface DescriptorBasedComponentInspectionPanelConfig extends ComponentInspectionPanelConfig {

}

export class DescriptorBasedComponentInspectionPanel<COMPONENT extends DescriptorBasedComponent, DESCRIPTOR extends Descriptor> extends ComponentInspectionPanel<COMPONENT> {

    private formView: FormView;

    protected selector: DescriptorBasedDropdown<DESCRIPTOR>;

    constructor(config: DescriptorBasedComponentInspectionPanelConfig) {
        super(config);

        this.formView = null;
    }


    setModel(liveEditModel: LiveEditModel) {

        if (this.liveEditModel != liveEditModel) {
            if (this.liveEditModel != null && this.liveEditModel.getSiteModel() != null) {
                let siteModel = this.liveEditModel.getSiteModel();

                siteModel.unApplicationUnavailable(this.applicationUnavailableHandler.bind(this));
                siteModel.unApplicationAdded(this.reloadDescriptorsOnApplicationChange.bind(this));
                siteModel.unApplicationRemoved(this.reloadDescriptorsOnApplicationChange.bind(this));
            }

            super.setModel(liveEditModel);
            this.layout();

            liveEditModel.getSiteModel().onApplicationUnavailable(this.applicationUnavailableHandler.bind(this));
            liveEditModel.getSiteModel().onApplicationAdded(this.reloadDescriptorsOnApplicationChange.bind(this));
            liveEditModel.getSiteModel().onApplicationRemoved(this.reloadDescriptorsOnApplicationChange.bind(this));
        }
    }

    protected layout() {
        throw new Error("Must be implemented in inheritors");
    }

    protected applicationUnavailableHandler() {
        this.selector.hideDropdown();
    }

    protected reloadDescriptorsOnApplicationChange() {
        this.selector.getLoader().load();
    }

    setupComponentForm(component: DescriptorBasedComponent, descriptor: Descriptor) {
        if (this.formView) {
            if (this.hasChild(this.formView)) {
                this.removeChild(this.formView);
            }
            this.formView = null;
        }
        if (!component || !descriptor) {
            return;
        }

        var form = descriptor.getConfig();
        var config = component.getConfig();
        this.formView = new FormView(this.formContext, form, config.getRoot());
        this.appendChild(this.formView);
        component.setDisableEventForwarding(true);
        this.formView.layout().catch((reason: any) => {
            DefaultErrorHandler.handle(reason);
        }).finally(() => {
            component.setDisableEventForwarding(false);
        }).done();
    }
}
