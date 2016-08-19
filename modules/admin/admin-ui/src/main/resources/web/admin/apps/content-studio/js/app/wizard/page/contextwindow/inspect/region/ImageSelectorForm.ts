import {ContentComboBox} from "../../../../../../../../../common/js/content/ContentComboBox";
import {Form} from "../../../../../../../../../common/js/ui/form/Form";
import {Fieldset} from "../../../../../../../../../common/js/ui/form/Fieldset";
import {StringHelper} from "../../../../../../../../../common/js/util/StringHelper";
import {FormItemBuilder} from "../../../../../../../../../common/js/ui/form/FormItem";

export class ImageSelectorForm extends Form {

    private imageSelector: ContentComboBox;

    constructor(templateSelector: ContentComboBox, title?: string) {
        super('image-combobox-form');
        this.imageSelector = templateSelector;

        var fieldSet = new Fieldset();
        if (!StringHelper.isBlank(title)) {
            fieldSet.add(new FormItemBuilder(templateSelector).setLabel(title).build());
        }
        else {
            fieldSet.add(new FormItemBuilder(templateSelector).build());
        }

        this.add(fieldSet);
    }

    getSelector(): ContentComboBox {
        return this.imageSelector;
    }

}
