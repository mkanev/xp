import {PropertyChangedEvent} from "../../../../../../../../../common/js/PropertyChangedEvent";
import {LiveEditModel} from "../../../../../../../../../common/js/liveedit/LiveEditModel";
import {PageModel} from "../../../../../../../../../common/js/content/page/PageModel";
import {PageDescriptor} from "../../../../../../../../../common/js/content/page/PageDescriptor";
import {DescriptorKey} from "../../../../../../../../../common/js/content/page/DescriptorKey";
import {LoadedDataEvent} from "../../../../../../../../../common/js/util/loader/event/LoadedDataEvent";
import {PageDescriptorDropdown} from "../../../../../../../../../common/js/content/page/PageDescriptorDropdown";

export class PageControllerSelector extends PageDescriptorDropdown {

    private pageModel: PageModel;

    constructor(model: LiveEditModel) {
        super(model);

        this.pageModel = model.getPageModel();

        this.onLoadedData((event: LoadedDataEvent<PageDescriptor>) => {

            if (this.pageModel.hasController() && this.pageModel.getController().getKey().toString() !== this.getValue()) {
                this.selectController(this.pageModel.getController().getKey());
            }
        });

        this.pageModel.onPropertyChanged((event: PropertyChangedEvent) => {
            if (event.getPropertyName() == PageModel.PROPERTY_CONTROLLER && this !== event.getSource()) {
                var descriptorKey = <DescriptorKey>event.getNewValue();
                if (descriptorKey) {
                    this.selectController(descriptorKey);
                }
                // TODO: Change class to extend a PageDescriptorComboBox instead, since we then can deselect.
            }
        });
    }

    private selectController(descriptorKey: DescriptorKey) {

        var optionToSelect = this.getOptionByValue(descriptorKey.toString());
        if (optionToSelect) {
            this.selectOption(optionToSelect, true);
        }
    }
}
