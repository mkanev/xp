import {RichComboBox} from "../../ui/selector/combobox/RichComboBox";
import {RichComboBoxBuilder} from "../../ui/selector/combobox/RichComboBox";
import {BaseSelectedOptionsView} from "../../ui/selector/combobox/BaseSelectedOptionsView";
import {Option} from "../../ui/selector/Option";
import {SelectedOption} from "../../ui/selector/combobox/SelectedOption";
import {BaseSelectedOptionView} from "../../ui/selector/combobox/BaseSelectedOptionView";
import {NamesAndIconViewBuilder} from "../../app/NamesAndIconView";
import {NamesAndIconViewSize} from "../../app/NamesAndIconViewSize";
import {AEl} from "../../dom/AEl";
import {Element} from "../../dom/Element";
import {PageTemplate} from "./PageTemplate";
import {PageTemplateViewer} from "./PageTemplateViewer";

export class PageTemplateComboBox extends RichComboBox<PageTemplate> {

        constructor() {
            super(new RichComboBoxBuilder<PageTemplate>().setSelectedOptionsView(
                new PageTemplateSelectedOptionsView()).setIdentifierMethod("getKey").setMaximumOccurrences(1).setOptionDisplayValueViewer(
                new PageTemplateViewer));
        }
    }

    export class PageTemplateSelectedOptionsView extends BaseSelectedOptionsView<PageTemplate> {

        createSelectedOption(option: Option<PageTemplate>): SelectedOption<PageTemplate> {
            return new SelectedOption<PageTemplate>(new PageTemplateSelectedOptionView(option), this.count());
        }
    }

    export class PageTemplateSelectedOptionView extends BaseSelectedOptionView<PageTemplate> {

        private pageTemplate: PageTemplate;

        constructor(option: Option<PageTemplate>) {
            this.pageTemplate = option.displayValue;
            super(option);
            this.addClass("page-template-selected-option-view");
        }

        doRender(): wemQ.Promise<boolean> {

            var namesAndIconView = new NamesAndIconViewBuilder().setSize(NamesAndIconViewSize.small).build();
            namesAndIconView.setIconClass("icon-newspaper icon-large")
                .setMainName(this.pageTemplate.getDisplayName())
                .setSubName(this.pageTemplate.getController().toString());

            var removeButtonEl = new AEl("remove");
            removeButtonEl.onClicked((event: MouseEvent) => {
                this.notifyRemoveClicked();

                event.stopPropagation();
                event.preventDefault();
                return false;
            });

            this.appendChildren<Element>(removeButtonEl, namesAndIconView);

            return wemQ(true);
        }

    }
