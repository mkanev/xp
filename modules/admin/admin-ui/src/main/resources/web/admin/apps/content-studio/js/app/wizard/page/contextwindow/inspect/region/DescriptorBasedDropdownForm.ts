import {DropdownInput} from "../../../../../../../../../common/js/ui/selector/dropdown/DropdownInput";
import {Form} from "../../../../../../../../../common/js/ui/form/Form";
import {Descriptor} from "../../../../../../../../../common/js/content/page/Descriptor";
import {Fieldset} from "../../../../../../../../../common/js/ui/form/Fieldset";
import {StringHelper} from "../../../../../../../../../common/js/util/StringHelper";
import {FormItemBuilder} from "../../../../../../../../../common/js/ui/form/FormItem";

export class DescriptorBasedDropdownForm extends Form {

    private templateSelector: DropdownInput<Descriptor>;

    constructor(templateSelector: DropdownInput<Descriptor>, title?: string) {
        super('descriptor-based-dropdown-form');
        this.templateSelector = templateSelector;

        var fieldSet = new Fieldset();
        if (!StringHelper.isBlank(title)) {
            fieldSet.add(new FormItemBuilder(templateSelector).setLabel(title).build());
        }
        else {
            fieldSet.add(new FormItemBuilder(templateSelector).build());
        }

        this.add(fieldSet);
    }

    getSelector(): DropdownInput<Descriptor> {
        return this.templateSelector;
    }

}
