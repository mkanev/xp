import {Content} from "../../../../../../../../../common/js/content/Content";
import {SiteModel} from "../../../../../../../../../common/js/content/site/SiteModel";
import {LiveEditModel} from "../../../../../../../../../common/js/liveedit/LiveEditModel";
import {LayoutDescriptor} from "../../../../../../../../../common/js/content/page/region/LayoutDescriptor";
import {DescriptorKey} from "../../../../../../../../../common/js/content/page/DescriptorKey";
import {DescriptorByDisplayNameComparator} from "../../../../../../../../../common/js/content/page/DescriptorByDisplayNameComparator";
import {LayoutComponent} from "../../../../../../../../../common/js/content/page/region/LayoutComponent";
import {DescriptorBasedComponent} from "../../../../../../../../../common/js/content/page/region/DescriptorBasedComponent";
import {ComponentPropertyChangedEvent} from "../../../../../../../../../common/js/content/page/region/ComponentPropertyChangedEvent";
import {GetLayoutDescriptorByKeyRequest} from "../../../../../../../../../common/js/content/page/region/GetLayoutDescriptorByKeyRequest";
import {GetLayoutDescriptorsByApplicationsRequest} from "../../../../../../../../../common/js/content/page/region/GetLayoutDescriptorsByApplicationsRequest";
import {Descriptor} from "../../../../../../../../../common/js/content/page/Descriptor";
import {LoadedDataEvent} from "../../../../../../../../../common/js/util/loader/event/LoadedDataEvent";
import {LayoutDescriptorLoader} from "../../../../../../../../../common/js/content/page/region/LayoutDescriptorLoader";
import {LayoutDescriptorBuilder} from "../../../../../../../../../common/js/content/page/region/LayoutDescriptor";
import {LayoutDescriptorDropdown} from "../../../../../../../../../common/js/content/page/region/LayoutDescriptorDropdown";
import {Option} from "../../../../../../../../../common/js/ui/selector/Option";
import {SelectedOption} from "../../../../../../../../../common/js/ui/selector/combobox/SelectedOption";
import {OptionSelectedEvent} from "../../../../../../../../../common/js/ui/selector/OptionSelectedEvent";
import {LayoutComponentView} from "../../../../../../../../../common/js/liveedit/layout/LayoutComponentView";
import {ItemViewIconClassResolver} from "../../../../../../../../../common/js/liveedit/ItemViewIconClassResolver";
import {DefaultErrorHandler} from "../../../../../../../../../common/js/DefaultErrorHandler";

import {
    DescriptorBasedComponentInspectionPanel,
    DescriptorBasedComponentInspectionPanelConfig
} from "./DescriptorBasedComponentInspectionPanel";
import {DescriptorBasedDropdownForm} from "./DescriptorBasedDropdownForm";

export class LayoutInspectionPanel extends DescriptorBasedComponentInspectionPanel<LayoutComponent, LayoutDescriptor> {

    private layoutView: LayoutComponentView;

    private layoutComponent: LayoutComponent;

    private layoutForm: DescriptorBasedDropdownForm;

    private handleSelectorEvents: boolean = true;

    private componentPropertyChangedEventHandler;

    constructor() {
        super(<DescriptorBasedComponentInspectionPanelConfig>{
            iconClass: ItemViewIconClassResolver.resolveByType("layout", "icon-xlarge")
        });
    }

    protected layout() {

        this.removeChildren();

        var descriptorsRequest = new GetLayoutDescriptorsByApplicationsRequest(this.liveEditModel.getSiteModel().getApplicationKeys());
        var loader = new LayoutDescriptorLoader(descriptorsRequest);
        loader.setComparator(new DescriptorByDisplayNameComparator());

        this.selector = new LayoutDescriptorDropdown("", loader);
        this.layoutForm = new DescriptorBasedDropdownForm(this.selector, "Layout");

        loader.load();

        this.componentPropertyChangedEventHandler = (event: ComponentPropertyChangedEvent) => {

            // Ensure displayed config form and selector option are removed when descriptor is removed
            if (event.getPropertyName() == DescriptorBasedComponent.PROPERTY_DESCRIPTOR) {
                if (!this.layoutComponent.hasDescriptor()) {
                    this.setSelectorValue(null, false);
                }
            }
        };

        this.initSelectorListeners();
        this.appendChild(this.layoutForm);

    }

    protected reloadDescriptorsOnApplicationChange() {
        if(this.selector) {
            (<GetLayoutDescriptorsByApplicationsRequest>this.selector.getLoader().getRequest()).
                setApplicationKeys(this.liveEditModel.getSiteModel().getApplicationKeys());
            super.reloadDescriptorsOnApplicationChange();
        }
    }

    protected applicationUnavailableHandler() {
        this.selector.hideDropdown();
    }

    private registerComponentListeners(component: LayoutComponent) {
        component.onPropertyChanged(this.componentPropertyChangedEventHandler);
    }

    private unregisterComponentListeners(component: LayoutComponent) {
        component.unPropertyChanged(this.componentPropertyChangedEventHandler);
    }

    setComponent(component: LayoutComponent, descriptor?: LayoutDescriptor) {

        super.setComponent(component);
        this.selector.setDescriptor(descriptor);
    }

    setLayoutComponent(layoutView: LayoutComponentView) {

        if (this.layoutComponent) {
            this.unregisterComponentListeners(this.layoutComponent);
        }

        this.layoutView = layoutView;
        this.layoutComponent = <LayoutComponent> layoutView.getComponent();

        this.setComponent(this.layoutComponent);
        var key: DescriptorKey = this.layoutComponent.getDescriptor();
        if (key) {
            var descriptor: LayoutDescriptor = this.selector.getDescriptor(key);
            if (descriptor) {
                this.setSelectorValue(descriptor);
            } else {
                new GetLayoutDescriptorByKeyRequest(key).sendAndParse().then((descriptor: LayoutDescriptor) => {
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

        this.registerComponentListeners(this.layoutComponent);
    }

    private setSelectorValue(descriptor: LayoutDescriptor, silent: boolean = true) {
        if (silent) {
            this.handleSelectorEvents = false;
        }

        this.selector.setDescriptor(descriptor);
        this.setupComponentForm(this.layoutComponent, descriptor);

        this.handleSelectorEvents = true;
    }

    private initSelectorListeners() {
        this.selector.onOptionSelected((event: OptionSelectedEvent<LayoutDescriptor>) => {
            if (this.handleSelectorEvents) {

                var option: Option<LayoutDescriptor> = event.getOption();

                var selectedDescriptorKey: DescriptorKey = option.displayValue.getKey();
                this.layoutComponent.setDescriptor(selectedDescriptorKey, option.displayValue);
            }
        });
    }
}
