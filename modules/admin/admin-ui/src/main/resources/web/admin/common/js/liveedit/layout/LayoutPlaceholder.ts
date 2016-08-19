import {LayoutComponent} from "../../content/page/region/LayoutComponent";
import {PageItemType} from "../PageItemType";
import {SiteModel} from "../../content/site/SiteModel";
import {LayoutDescriptor} from "../../content/page/region/LayoutDescriptor";
import {GetLayoutDescriptorsByApplicationsRequest} from "../../content/page/region/GetLayoutDescriptorsByApplicationsRequest";
import {LayoutDescriptorLoader} from "../../content/page/region/LayoutDescriptorLoader";
import {LayoutDescriptorComboBox} from "../../content/page/region/LayoutDescriptorComboBox";
import {SelectedOptionEvent} from "../../ui/selector/combobox/SelectedOptionEvent";
import {DescriptorByDisplayNameComparator} from "../../content/page/DescriptorByDisplayNameComparator";
import {ItemViewPlaceholder} from "../ItemViewPlaceholder";
import {LayoutComponentView} from "./LayoutComponentView";

export class LayoutPlaceholder extends ItemViewPlaceholder {

        private comboBox: LayoutDescriptorComboBox;

        private layoutComponentView: LayoutComponentView;

        constructor(layoutView: LayoutComponentView) {
            super();
            this.addClassEx("layout-placeholder");
            this.layoutComponentView = layoutView;

            var request = new GetLayoutDescriptorsByApplicationsRequest(layoutView.getLiveEditModel().getSiteModel().getApplicationKeys());
            var loader = new LayoutDescriptorLoader(request);
            loader.setComparator(new DescriptorByDisplayNameComparator());
            this.comboBox = new LayoutDescriptorComboBox(loader);
            loader.load();

            this.appendChild(this.comboBox);

            this.comboBox.onOptionSelected((event: SelectedOptionEvent<LayoutDescriptor>) => {
                this.layoutComponentView.showLoadingSpinner();
                var descriptor = event.getSelectedOption().getOption().displayValue;

                var layoutComponent: LayoutComponent = this.layoutComponentView.getComponent();
                layoutComponent.setDescriptor(descriptor.getKey(), descriptor);
            });

            var siteModel = layoutView.getLiveEditModel().getSiteModel();
            siteModel.onApplicationAdded(() => this.reloadDescriptorsOnApplicationChange(siteModel, request));
            siteModel.onApplicationRemoved(() => this.reloadDescriptorsOnApplicationChange(siteModel, request));
        }

        private reloadDescriptorsOnApplicationChange(siteModel: SiteModel, request: GetLayoutDescriptorsByApplicationsRequest) {
            request.setApplicationKeys(siteModel.getApplicationKeys());
            this.comboBox.getLoader().load();
        }

        select() {
            this.comboBox.show();
            this.comboBox.giveFocus();
        }

        deselect() {
            this.comboBox.hide();
        }
    }
