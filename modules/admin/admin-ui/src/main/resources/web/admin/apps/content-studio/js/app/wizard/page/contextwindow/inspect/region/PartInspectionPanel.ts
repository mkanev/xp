import {SiteModel} from "../../../../../../../../../common/js/content/site/SiteModel";
import {PartDescriptor} from "../../../../../../../../../common/js/content/page/region/PartDescriptor";
import {PartDescriptorLoader} from "../../../../../../../../../common/js/content/page/region/PartDescriptorLoader";
import {GetPartDescriptorsByApplicationsRequest} from "../../../../../../../../../common/js/content/page/region/GetPartDescriptorsByApplicationsRequest";
import {GetPartDescriptorByKeyRequest} from "../../../../../../../../../common/js/content/page/region/GetPartDescriptorByKeyRequest";
import {PartComponent} from "../../../../../../../../../common/js/content/page/region/PartComponent";
import {PartDescriptorDropdown} from "../../../../../../../../../common/js/content/page/region/PartDescriptorDropdown";
import {DescriptorBasedComponent} from "../../../../../../../../../common/js/content/page/region/DescriptorBasedComponent";
import {ComponentPropertyChangedEvent} from "../../../../../../../../../common/js/content/page/region/ComponentPropertyChangedEvent";
import {DescriptorKey} from "../../../../../../../../../common/js/content/page/DescriptorKey";
import {Descriptor} from "../../../../../../../../../common/js/content/page/Descriptor";
import {PartComponentView} from "../../../../../../../../../common/js/liveedit/part/PartComponentView";
import {LiveEditModel} from "../../../../../../../../../common/js/liveedit/LiveEditModel";
import {Option} from "../../../../../../../../../common/js/ui/selector/Option";
import {SelectedOption} from "../../../../../../../../../common/js/ui/selector/combobox/SelectedOption";
import {OptionSelectedEvent} from "../../../../../../../../../common/js/ui/selector/OptionSelectedEvent";
import {ItemViewIconClassResolver} from "../../../../../../../../../common/js/liveedit/ItemViewIconClassResolver";
import {DescriptorByDisplayNameComparator} from "../../../../../../../../../common/js/content/page/DescriptorByDisplayNameComparator";
import {DefaultErrorHandler} from "../../../../../../../../../common/js/DefaultErrorHandler";

import {
    DescriptorBasedComponentInspectionPanel,
    DescriptorBasedComponentInspectionPanelConfig
} from "./DescriptorBasedComponentInspectionPanel";
import {DescriptorBasedDropdownForm} from "./DescriptorBasedDropdownForm";

export class PartInspectionPanel extends DescriptorBasedComponentInspectionPanel<PartComponent, PartDescriptor> {

    private partView: PartComponentView;

    private partComponent: PartComponent;

    private partForm: DescriptorBasedDropdownForm;

    private handleSelectorEvents: boolean = true;

    private componentPropertyChangedEventHandler;

    constructor() {
        super(<DescriptorBasedComponentInspectionPanelConfig>{
            iconClass: ItemViewIconClassResolver.resolveByType("part", "icon-xlarge")
        });
    }

    protected layout() {

        this.removeChildren();

        var descriptorsRequest = new GetPartDescriptorsByApplicationsRequest(this.liveEditModel.getSiteModel().getApplicationKeys());
        var loader = new PartDescriptorLoader(descriptorsRequest);
        loader.setComparator(new DescriptorByDisplayNameComparator());

        this.selector = new PartDescriptorDropdown("", loader);
        this.partForm = new DescriptorBasedDropdownForm(this.selector, "Part");

        loader.load();

        this.componentPropertyChangedEventHandler = (event: ComponentPropertyChangedEvent) => {

            // Ensure displayed config form and selector option are removed when descriptor is removed
            if (event.getPropertyName() == DescriptorBasedComponent.PROPERTY_DESCRIPTOR) {
                if (!this.partComponent.hasDescriptor()) {
                    this.setSelectorValue(null, false);
                }
            }
        };

        this.initSelectorListeners();
        this.appendChild(this.partForm);
    }

    protected reloadDescriptorsOnApplicationChange() {
        if(this.selector) {
            (<GetPartDescriptorsByApplicationsRequest>this.selector.getLoader().getRequest()).
                setApplicationKeys(this.liveEditModel.getSiteModel().getApplicationKeys());
            super.reloadDescriptorsOnApplicationChange();
        }
    }

    setComponent(component: PartComponent, descriptor?: PartDescriptor) {

        super.setComponent(component);
        this.selector.setDescriptor(descriptor);
    }

    private setSelectorValue(descriptor: PartDescriptor, silent: boolean = true) {
        if (silent) {
            this.handleSelectorEvents = false;
        }

        this.selector.setDescriptor(descriptor);
        this.setupComponentForm(this.partComponent, descriptor);

        this.handleSelectorEvents = true;
    }

    private registerComponentListeners(component: PartComponent) {
        component.onPropertyChanged(this.componentPropertyChangedEventHandler);
    }

    private unregisterComponentListeners(component: PartComponent) {
        component.unPropertyChanged(this.componentPropertyChangedEventHandler);
    }

    setPartComponent(partView: PartComponentView) {

        if (this.partComponent) {
            this.unregisterComponentListeners(this.partComponent);
        }

        this.partView = partView;
        this.partComponent = <PartComponent>partView.getComponent();

        this.setComponent(this.partComponent);
        var key: DescriptorKey = this.partComponent.getDescriptor();
        if (key) {
            var descriptor: PartDescriptor = this.selector.getDescriptor(key);
            if (descriptor) {
                this.setSelectorValue(descriptor);
            } else {
                new GetPartDescriptorByKeyRequest(key).sendAndParse().then((descriptor: PartDescriptor) => {
                    this.setSelectorValue(descriptor);
                }).catch((reason: any) => {
                    if (this.isNotFoundError(reason)) {
                        this.setSelectorValue(null);
                    } else {
                        DefaultErrorHandler.handle(reason);
                    }
                }).done();
            }
        } else {
            this.setSelectorValue(null);
        }

        this.registerComponentListeners(this.partComponent);
    }

    private initSelectorListeners() {

        this.selector.onOptionSelected((event: OptionSelectedEvent<PartDescriptor>) => {
            if (this.handleSelectorEvents) {
                var option: Option<PartDescriptor> = event.getOption();
                var selectedDescriptorKey: DescriptorKey = option.displayValue.getKey();
                this.partComponent.setDescriptor(selectedDescriptorKey, option.displayValue);
            }
        });
    }
}
