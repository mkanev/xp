import {FragmentDropdown} from "../../../../../../../../../common/js/content/page/region/FragmentDropdown";
import {Form} from "../../../../../../../../../common/js/ui/form/Form";
import {Fieldset} from "../../../../../../../../../common/js/ui/form/Fieldset";
import {StringHelper} from "../../../../../../../../../common/js/util/StringHelper";
import {FormItemBuilder} from "../../../../../../../../../common/js/ui/form/FormItem";

export class FragmentSelectorForm extends Form {

    private fragmentSelector: FragmentDropdown;

    constructor(fragmentSelector: FragmentDropdown, title?: string) {
        super('fragment-dropdown-form');
        this.fragmentSelector = fragmentSelector;

        var fieldSet = new Fieldset();
        if (!StringHelper.isBlank(title)) {
            fieldSet.add(new FormItemBuilder(fragmentSelector).setLabel(title).build());
        }
        else {
            fieldSet.add(new FormItemBuilder(fragmentSelector).build());
        }

        this.add(fieldSet);
    }

    getSelector(): FragmentDropdown {
        return this.fragmentSelector;
    }

}
