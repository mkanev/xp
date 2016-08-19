import {RichComboBox} from "../../ui/selector/combobox/RichComboBox";
import {BaseLoader} from "../../util/loader/BaseLoader";
import {ContentTypeSummaryListJson} from "./ContentTypeSummaryListJson";
import {RichComboBoxBuilder} from "../../ui/selector/combobox/RichComboBox";
import {BaseSelectedOptionsView} from "../../ui/selector/combobox/BaseSelectedOptionsView";
import {Option} from "../../ui/selector/Option";
import {SelectedOption} from "../../ui/selector/combobox/SelectedOption";
import {RichSelectedOptionView} from "../../ui/selector/combobox/RichSelectedOptionView";
import {ContentTypeSummary} from "./ContentTypeSummary";
import {ContentTypeSummaryLoader} from "./ContentTypeSummaryLoader";
import {ContentTypeSummaryViewer} from "./ContentTypeSummaryViewer";

export class ContentTypeComboBox extends RichComboBox<ContentTypeSummary> {

        constructor(maximumOccurrences: number = 0, loader? : BaseLoader<ContentTypeSummaryListJson, ContentTypeSummary>) {
            var loader = loader || new ContentTypeSummaryLoader();
            super(new RichComboBoxBuilder<ContentTypeSummary>()
                .setLoader(loader)
                .setSelectedOptionsView(new ContentTypeSelectedOptionsView())
                .setOptionDisplayValueViewer(new ContentTypeSummaryViewer())
                .setMaximumOccurrences(maximumOccurrences));
        }

    }

    export class ContentTypeSelectedOptionsView extends BaseSelectedOptionsView<ContentTypeSummary> {

        createSelectedOption(option: Option<ContentTypeSummary>): SelectedOption<ContentTypeSummary> {

            var optionView = new ContentTypeSelectedOptionView(option);
            return new SelectedOption<ContentTypeSummary>(optionView, this.count());
        }
    }

    export class ContentTypeSelectedOptionView extends RichSelectedOptionView<ContentTypeSummary> {

        constructor(option: Option<ContentTypeSummary>) {
            super(option);
        }

        resolveIconUrl(content: ContentTypeSummary): string {
            return content.getIconUrl();
        }

        resolveTitle(content: ContentTypeSummary): string {
            return content.getDisplayName().toString();
        }

        resolveSubTitle(content: ContentTypeSummary): string {
            return content.getName();
        }

    }
