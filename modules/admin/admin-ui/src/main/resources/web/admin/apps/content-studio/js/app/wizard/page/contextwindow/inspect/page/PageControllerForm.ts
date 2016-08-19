import {Form} from "../../../../../../../../../common/js/ui/form/Form";
import {Fieldset} from "../../../../../../../../../common/js/ui/form/Fieldset";
import {FormItemBuilder} from "../../../../../../../../../common/js/ui/form/FormItem";

import {PageControllerSelector} from "./PageControllerSelector";

export class PageControllerForm extends Form {

    private controllerSelector: PageControllerSelector;

    constructor(controllerSelector: PageControllerSelector) {
        super('page-controller-form');
        this.controllerSelector = controllerSelector;

        var fieldSet = new Fieldset();
        fieldSet.add(new FormItemBuilder(controllerSelector).setLabel("Page Controller").build());
        this.add(fieldSet);
    }

    getSelector(): PageControllerSelector {
        return this.controllerSelector;
    }

}
