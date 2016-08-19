import {Form} from "../../../../../../../../../common/js/ui/form/Form";
import {Fieldset} from "../../../../../../../../../common/js/ui/form/Fieldset";
import {FormItemBuilder} from "../../../../../../../../../common/js/ui/form/FormItem";

import {PageTemplateSelector} from "./PageTemplateSelector";

export class PageTemplateForm extends Form {

    private templateSelector: PageTemplateSelector;

    constructor(templateSelector: PageTemplateSelector) {
        super('page-template-form');
        this.templateSelector = templateSelector;

        var fieldSet = new Fieldset();
        fieldSet.add(new FormItemBuilder(templateSelector).setLabel("Page Template").build());
        this.add(fieldSet);
    }

    getSelector(): PageTemplateSelector {
        return this.templateSelector;
    }

}
