import {SelectedOption} from "../ui/selector/combobox/SelectedOption";
import {Option} from "../ui/selector/Option";
import {RichComboBox} from "../ui/selector/combobox/RichComboBox";
import {RichComboBoxBuilder} from "../ui/selector/combobox/RichComboBox";
import {ContentSummaryLoader} from "./resource/ContentSummaryLoader";
import {ContentQueryResultJson} from "./json/ContentQueryResultJson";
import {ContentSummaryJson} from "./json/ContentSummaryJson";
import {ContentSummaryViewer} from "./ContentSummaryViewer";
import {BaseSelectedOptionsView} from "../ui/selector/combobox/BaseSelectedOptionsView";
import {BaseSelectedOptionView} from "../ui/selector/combobox/BaseSelectedOptionView";
import {AEl} from "../dom/AEl";
import {H6El} from "../dom/H6El";
import {Element} from "../dom/Element";
import {RichSelectedOptionView} from "../ui/selector/combobox/RichSelectedOptionView";
import {EditContentEvent} from "./event/EditContentEvent";
import {BaseLoader} from "../util/loader/BaseLoader";
import {ContentId} from "./ContentId";
import {ContentSummary} from "./ContentSummary";
import {ContentSummaryAndCompareStatus} from "./ContentSummaryAndCompareStatus";

export class ContentComboBox extends RichComboBox<ContentSummary> {

        constructor(builder: ContentComboBoxBuilder) {

            var loader = builder.loader ? builder.loader : new ContentSummaryLoader();

            var richComboBoxBuilder = new RichComboBoxBuilder<ContentSummary>().setComboBoxName(
                builder.name ? builder.name : 'contentSelector').setLoader(loader).setSelectedOptionsView(
                new ContentSelectedOptionsView()).setMaximumOccurrences(builder.maximumOccurrences).setOptionDisplayValueViewer(
                new ContentSummaryViewer()).setDelayedInputValueChangedHandling(750).setValue(
                builder.value).setDisplayMissingSelectedOptions(builder.displayMissingSelectedOptions).setRemoveMissingSelectedOptions(
                builder.removeMissingSelectedOptions).setMinWidth(builder.minWidth);

            super(richComboBoxBuilder);

            this.addClass('content-combo-box');

            if (builder.postLoad) {
                this.handleLastRange(builder.postLoad);
            }
        }

        getContent(contentId: ContentId): ContentSummary {
            var option = this.getOptionByValue(contentId.toString());
            if (option) {
                return option.displayValue;
            }
            return null;
        }

        setContent(content: ContentSummary) {

            this.clearSelection();
            if (content) {
                var optionToSelect: Option<ContentSummary> = this.getOptionByValue(content.getContentId().toString());
                if (!optionToSelect) {
                    optionToSelect = {
                        value: content.getContentId().toString(),
                        displayValue: content
                    };
                    this.addOption(optionToSelect);
                }
                this.selectOption(optionToSelect);

            }
        }

        public static create(): ContentComboBoxBuilder {
            return new ContentComboBoxBuilder();
        }
    }

    export class ContentSelectedOptionsView extends BaseSelectedOptionsView<ContentSummary> {

        createSelectedOption(option: Option<ContentSummary>): SelectedOption<ContentSummary> {
            var optionView = !!option.displayValue ? new ContentSelectedOptionView(option) : new MissingContentSelectedOptionView(option);
            return new SelectedOption<ContentSummary>(optionView, this.count());
        }
    }

    export class MissingContentSelectedOptionView extends BaseSelectedOptionView<ContentSummary> {

        private id: string;

        constructor(option: Option<ContentSummary>) {
            this.id = option.value;
            super(option);
        }

        doRender(): wemQ.Promise<boolean> {

            var removeButtonEl = new AEl("remove"),
                message = new H6El("missing-content");

            message.setHtml("No access to content with id=" + this.id);

            removeButtonEl.onClicked((event: Event) => {
                this.notifyRemoveClicked();

                event.stopPropagation();
                event.preventDefault();
                return false;
            });

            this.appendChildren<Element>(removeButtonEl, message);

            return wemQ(true);
        }
    }

    export class ContentSelectedOptionView extends RichSelectedOptionView<ContentSummary> {

        constructor(option: Option<ContentSummary>) {
            super(option);
        }

        resolveIconUrl(content: ContentSummary): string {
            return content.getIconUrl();
        }

        resolveTitle(content: ContentSummary): string {
            return content.getDisplayName().toString();
        }

        resolveSubTitle(content: ContentSummary): string {
            return content.getPath().toString();
        }

        createActionButtons(content: ContentSummary): Element[] {
            let editButton = new AEl("edit");
            editButton.onClicked((event: Event) => {
                let model = [ContentSummaryAndCompareStatus.fromContentSummary(content)];
                new EditContentEvent(model).fire();

                event.stopPropagation();
                event.preventDefault();
                return false;
            });

            return [editButton];
        }

    }

    export class ContentComboBoxBuilder {

        name: string;

        maximumOccurrences: number = 0;

        loader: BaseLoader<ContentQueryResultJson<ContentSummaryJson>, ContentSummary>;

        minWidth: number;

        value: string;

        postLoad: () => void;

        displayMissingSelectedOptions: boolean;

        removeMissingSelectedOptions: boolean;

        setName(value: string): ContentComboBoxBuilder {
            this.name = value;
            return this;
        }

        setMaximumOccurrences(maximumOccurrences: number): ContentComboBoxBuilder {
            this.maximumOccurrences = maximumOccurrences;
            return this;
        }

        setLoader(loader: BaseLoader<ContentQueryResultJson<ContentSummaryJson>, ContentSummary>): ContentComboBoxBuilder {
            this.loader = loader;
            return this;
        }

        setMinWidth(value: number): ContentComboBoxBuilder {
            this.minWidth = value;
            return this;
        }

        setValue(value: string): ContentComboBoxBuilder {
            this.value = value;
            return this;
        }

        setDisplayMissingSelectedOptions(value: boolean): ContentComboBoxBuilder {
            this.displayMissingSelectedOptions = value;
            return this;
        }

        setRemoveMissingSelectedOptions(value: boolean): ContentComboBoxBuilder {
            this.removeMissingSelectedOptions = value;
            return this;
        }

        setPostLoad(postLoad: () => void) {
            this.postLoad = postLoad;
            return this;
        }

        build(): ContentComboBox {
            return new ContentComboBox(this);
        }

    }
