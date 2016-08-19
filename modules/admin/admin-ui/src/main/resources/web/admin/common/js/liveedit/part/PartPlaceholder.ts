import {Descriptor} from "../../content/page/Descriptor";
import {SiteModel} from "../../content/site/SiteModel";
import {PartComponent} from "../../content/page/region/PartComponent";
import {PartDescriptor} from "../../content/page/region/PartDescriptor";
import {PartDescriptorLoader} from "../../content/page/region/PartDescriptorLoader";
import {PartDescriptorComboBox} from "../../content/page/region/PartDescriptorComboBox";
import {GetPartDescriptorsByApplicationsRequest} from "../../content/page/region/GetPartDescriptorsByApplicationsRequest";
import {PartItemType} from "./PartItemType";
import {PageItemType} from "../PageItemType";
import {SelectedOptionEvent} from "../../ui/selector/combobox/SelectedOptionEvent";
import {H2El} from "../../dom/H2El";
import {DescriptorByDisplayNameComparator} from "../../content/page/DescriptorByDisplayNameComparator";
import {H3El} from "../../dom/H3El";
import {ItemViewPlaceholder} from "../ItemViewPlaceholder";
import {PartComponentView} from "./PartComponentView";

export class PartPlaceholder extends ItemViewPlaceholder {

        private comboBox: PartDescriptorComboBox;

        private displayName: H2El;

        private partComponentView: PartComponentView;

        constructor(partView: PartComponentView) {
            super();
            this.addClassEx("part-placeholder");

            this.partComponentView = partView;

            var request = new GetPartDescriptorsByApplicationsRequest(partView.getLiveEditModel().getSiteModel().getApplicationKeys());
            var loader = new PartDescriptorLoader(request);
            loader.setComparator(new DescriptorByDisplayNameComparator());
            this.comboBox = new PartDescriptorComboBox(loader);
            loader.load();

            this.appendChild(this.comboBox);

            this.comboBox.onOptionSelected((event: SelectedOptionEvent<PartDescriptor>) => {
                this.partComponentView.showLoadingSpinner();
                var descriptor: Descriptor = event.getSelectedOption().getOption().displayValue;
                var partComponent: PartComponent = this.partComponentView.getComponent();
                partComponent.setDescriptor(descriptor.getKey(), descriptor);
            });

            var siteModel = partView.getLiveEditModel().getSiteModel();
            siteModel.onApplicationAdded(() => this.reloadDescriptorsOnApplicationChange(siteModel, request));
            siteModel.onApplicationRemoved(() => this.reloadDescriptorsOnApplicationChange(siteModel, request));

            this.displayName = new H3El('display-name');
            this.appendChild(this.displayName);
            var partComponent = this.partComponentView.getComponent();
            if (partComponent && partComponent.getName()) {
                this.setDisplayName(partComponent.getName().toString());
            }
        }

        private reloadDescriptorsOnApplicationChange(siteModel: SiteModel, request: GetPartDescriptorsByApplicationsRequest) {
            request.setApplicationKeys(siteModel.getApplicationKeys());
            this.comboBox.getLoader().load();
        }

        setDisplayName(name: string) {
            this.displayName.setHtml(name);
        }

        select() {
            this.comboBox.show();
            this.comboBox.giveFocus();
        }

        deselect() {
            this.comboBox.hide();
        }
    }
