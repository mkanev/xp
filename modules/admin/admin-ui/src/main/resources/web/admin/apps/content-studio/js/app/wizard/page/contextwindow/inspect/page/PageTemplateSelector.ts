import {PropertyChangedEvent} from "../../../../../../../../../common/js/PropertyChangedEvent";
import {ContentId} from "../../../../../../../../../common/js/content/ContentId";
import {PageTemplateKey} from "../../../../../../../../../common/js/content/page/PageTemplateKey";
import {PageTemplate} from "../../../../../../../../../common/js/content/page/PageTemplate";
import {PageTemplateBuilder} from "../../../../../../../../../common/js/content/page/PageTemplate";
import {Option} from "../../../../../../../../../common/js/ui/selector/Option";
import {OptionSelectedEvent} from "../../../../../../../../../common/js/ui/selector/OptionSelectedEvent";
import {DropdownInput} from "../../../../../../../../../common/js/ui/selector/dropdown/DropdownInput";
import {DropdownConfig} from "../../../../../../../../../common/js/ui/selector/dropdown/DropdownInput";
import {PageModel} from "../../../../../../../../../common/js/content/page/PageModel";
import {LiveEditModel} from "../../../../../../../../../common/js/liveedit/LiveEditModel";
import {PageMode} from "../../../../../../../../../common/js/content/page/PageMode";
import {DefaultErrorHandler} from "../../../../../../../../../common/js/DefaultErrorHandler";
import {PageTemplateDisplayName} from "../../../../../../../../../common/js/content/page/PageMode";
import {PropertyTree} from "../../../../../../../../../common/js/data/PropertyTree";

import {PageTemplateOption} from "./PageTemplateOption";
import {PageTemplateOptions} from "./PageTemplateOptions";
import {PageTemplateOptionViewer} from "./PageTemplateOptionViewer";

export class PageTemplateSelector extends DropdownInput<PageTemplateOption> {

    private pageModel: PageModel;

    private selectionListeners: {(template: PageTemplate):void}[] = [];

    private customizedSelectedListeners: {():void}[] = [];

    private customizedOption: Option<PageTemplateOption>;

    constructor() {
        super("pageTemplate", <DropdownConfig<PageTemplateOption>>{
            optionDisplayValueViewer: new PageTemplateOptionViewer()
        });
    }

    setModel(liveEditModel: LiveEditModel) {

        this.pageModel = liveEditModel.getPageModel();

        var pageTemplateOptions = new PageTemplateOptions(liveEditModel.getSiteModel().getSiteId(),
            liveEditModel.getContent().getType(), this.pageModel);

        pageTemplateOptions.getOptions().then((options: Option<PageTemplateOption>[]) => {

            options.forEach((option: Option<PageTemplateOption>) => {
                this.addOption(option);
            });

            this.customizedOption = this.createCustomizedOption();
            this.addOption(this.customizedOption);

            if (this.pageModel.isCustomized()) {
                this.selectRow(options.length);
            }
            else if (this.pageModel.hasTemplate()) {
                this.selectTemplate(this.pageModel.getTemplateKey());
            }
            else {
                this.selectOption(pageTemplateOptions.getDefault(), true);
            }

            this.onOptionSelected((event: OptionSelectedEvent<PageTemplateOption>) => {
                var selectedOption = event.getOption().displayValue;
                if (selectedOption.getPageTemplate() && selectedOption.isCustom()) {
                    this.notifyCustomizedSelected();
                }
                else {
                    this.notifySelection(selectedOption.getPageTemplate());
                }
            });

            this.pageModel.onPropertyChanged((event: PropertyChangedEvent) => {
                if (event.getPropertyName() == PageModel.PROPERTY_TEMPLATE && this !== event.getSource()) {
                    var pageTemplateKey = <PageTemplateKey>event.getNewValue();
                    if (pageTemplateKey) {
                        this.selectTemplate(pageTemplateKey);
                    } else {
                        this.selectOption(pageTemplateOptions.getDefault(), true);
                    }
                }
                else if (event.getPropertyName() == PageModel.PROPERTY_CONTROLLER && event.getNewValue()) {
                    this.selectCustomized();
                }
            });

            this.pageModel.onReset(() => {
                this.selectOption(pageTemplateOptions.getDefault(), true);
            });

        }).catch((reason: any) => {
            DefaultErrorHandler.handle(reason);
        }).done();
    }

    private selectTemplate(template: PageTemplateKey) {
        var optionToSelect = this.getOptionByValue(template.toString());
        if (optionToSelect) {
            this.selectOption(optionToSelect, true);
        }
    }

    private selectCustomized() {
        this.selectOption(this.customizedOption, true);
    }

    onSelection(listener: (event: PageTemplate)=>void) {
        this.selectionListeners.push(listener);
    }

    unSelection(listener: (event: PageTemplate)=>void) {
        this.selectionListeners.filter((currentListener: (event: PageTemplate)=>void) => {
            return listener != currentListener;
        });
    }

    private notifySelection(item: PageTemplate) {
        this.selectionListeners.forEach((listener: (event: PageTemplate)=>void) => {
            listener(item);
        });
    }

    onCustomizedSelected(listener: ()=>void) {
        this.customizedSelectedListeners.push(listener);
    }

    private notifyCustomizedSelected() {
        this.customizedSelectedListeners.forEach((listener: ()=>void) => {
            listener();
        });
    }

    private createCustomizedOption(): Option<PageTemplateOption> {
        var pageTemplateDisplayName = PageTemplateDisplayName;
        var pageTemplate: PageTemplate = (<PageTemplateBuilder> new PageTemplateBuilder()
            .setData(new PropertyTree())
            .setDisplayName(pageTemplateDisplayName[pageTemplateDisplayName.Custom]))
            .build();
        var option = {
            value: "Customized",
            displayValue: new PageTemplateOption(pageTemplate, this.pageModel)
        };

        return option;
    }
}
