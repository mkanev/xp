import "../../../../../../api.ts";

import DropdownInput = api.ui.selector.dropdown.DropdownInput;

export class DescriptorBasedDropdownForm extends api.ui.form.Form {

    private templateSelector: DropdownInput<api.content.page.Descriptor>;

    constructor(templateSelector: DropdownInput<api.content.page.Descriptor>, title?: string) {
        super('descriptor-based-dropdown-form');
        this.templateSelector = templateSelector;

        var fieldSet = new api.ui.form.Fieldset();
        if (!api.util.StringHelper.isBlank(title)) {
            fieldSet.add(new api.ui.form.FormItemBuilder(templateSelector).setLabel(title).build());
        }
        else {
            fieldSet.add(new api.ui.form.FormItemBuilder(templateSelector).build());
        }

        this.add(fieldSet);
    }

    getSelector(): DropdownInput<api.content.page.Descriptor> {
        return this.templateSelector;
    }

}
