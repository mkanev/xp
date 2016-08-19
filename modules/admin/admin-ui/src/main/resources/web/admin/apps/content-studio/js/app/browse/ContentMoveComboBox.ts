import {SelectedOption} from "../../../../../common/js/ui/selector/combobox/SelectedOption";
import {MoveContentSummaryLoader} from "../../../../../common/js/content/resource/MoveContentSummaryLoader";
import {ContentSummary} from "../../../../../common/js/content/ContentSummary";
import {ContentSelectedOptionsView} from "../../../../../common/js/content/ContentComboBox";
import {ContentPath} from "../../../../../common/js/content/ContentPath";
import {RichComboBox} from "../../../../../common/js/ui/selector/combobox/RichComboBox";
import {RichComboBoxBuilder} from "../../../../../common/js/ui/selector/combobox/RichComboBox";
import {ContentSummaryViewer} from "../../../../../common/js/content/ContentSummaryViewer";
import {ContentType} from "../../../../../common/js/schema/content/ContentType";

export class ContentMoveComboBox extends RichComboBox<ContentSummary> {

    contentLoader: MoveContentSummaryLoader;

    constructor() {
        this.contentLoader = new MoveContentSummaryLoader();
        this.contentLoader.setSize(-1);
        var richComboBoxBuilder: RichComboBoxBuilder<ContentSummary> = new RichComboBoxBuilder<ContentSummary>();
        richComboBoxBuilder
            .setMaximumOccurrences(1)
            .setComboBoxName("contentSelector")
            .setLoader(this.contentLoader)
            .setSelectedOptionsView(new ContentSelectedOptionsView())
            .setOptionDisplayValueViewer(new ContentSummaryViewer())
            .setDelayedInputValueChangedHandling(500);

        super(richComboBoxBuilder);
    }

    setFilterContentPath(contentPath: ContentPath) {
        this.contentLoader.setFilterContentPath(contentPath);
    }

    setFilterSourceContentType(contentType: ContentType) {
        this.contentLoader.setFilterSourceContentType(contentType);
    }

    clearCombobox() {
        super.clearCombobox();
        this.contentLoader.resetSearchString();
    }
}