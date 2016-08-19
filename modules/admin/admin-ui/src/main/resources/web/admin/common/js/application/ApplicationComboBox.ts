import {RichComboBox} from "../ui/selector/combobox/RichComboBox";
import {Application} from "./Application";
import {RichComboBoxBuilder} from "../ui/selector/combobox/RichComboBox";
import {ApplicationLoader} from "./ApplicationLoader";
import {BaseSelectedOptionsView} from "../ui/selector/combobox/BaseSelectedOptionsView";
import {Option} from "../ui/selector/Option";
import {SelectedOption} from "../ui/selector/combobox/SelectedOption";
import {RichSelectedOptionView} from "../ui/selector/combobox/RichSelectedOptionView";
import {UriHelper} from "../util/UriHelper";
import {ApplicationViewer} from "./ApplicationViewer";

export class ApplicationComboBox extends RichComboBox<Application> {
        constructor(maximumOccurrences?: number) {
            var builder = new RichComboBoxBuilder<Application>();
            builder.
                setMaximumOccurrences(maximumOccurrences || 0).
                setComboBoxName("applicationSelector").
                setLoader(new ApplicationLoader()).
                setSelectedOptionsView(new ApplicationSelectedOptionsView()).
                setOptionDisplayValueViewer(new ApplicationViewer()).
                setDelayedInputValueChangedHandling(500);
            super(builder);
        }
    }

    export class ApplicationSelectedOptionsView extends BaseSelectedOptionsView<Application> {

        createSelectedOption(option: Option<Application>): SelectedOption<Application> {
            var optionView = new ApplicationSelectedOptionView(option);
            return new SelectedOption<Application>(optionView, this.count());
        }
    }

    export class ApplicationSelectedOptionView extends RichSelectedOptionView<Application> {


        constructor(option: Option<Application>) {
            super(option);
        }

        resolveIconUrl(content: Application): string {
            return UriHelper.getAdminUri("common/images/icons/icoMoon/128x128/puzzle.png");
        }

        resolveTitle(content: Application): string {
            return content.getDisplayName().toString();
        }

        resolveSubTitle(content: Application): string {
            return content.getApplicationKey().toString();
        }

    }
