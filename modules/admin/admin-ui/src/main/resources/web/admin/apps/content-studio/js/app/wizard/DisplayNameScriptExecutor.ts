import {PropertyPath} from "../../../../../common/js/data/PropertyPath";
import {Property} from "../../../../../common/js/data/Property";
import {Value} from "../../../../../common/js/data/Value";
import {ValueType} from "../../../../../common/js/data/ValueType";
import {ValueTypes} from "../../../../../common/js/data/ValueTypes";
import {PropertyTree} from "../../../../../common/js/data/PropertyTree";
import {DisplayNameGenerator} from "../../../../../common/js/app/wizard/DisplayNameGenerator";
import {FormView} from "../../../../../common/js/form/FormView";
import {StringHelper} from "../../../../../common/js/util/StringHelper";
import {assertNotNull} from "../../../../../common/js/util/Assert";

export class DisplayNameScriptExecutor implements DisplayNameGenerator {

    private formView: FormView;

    private script: string;

    setFormView(value: FormView): DisplayNameScriptExecutor {
        this.formView = value;
        return this;
    }

    setScript(value: string): DisplayNameScriptExecutor {
        this.script = value;
        return this;
    }

    hasScript(): boolean {
        return !StringHelper.isBlank(this.script);
    }

    execute(): string {
        assertNotNull(this.formView, "formView not set");
        assertNotNull(this.script, "script not set");

        return this.safeEval(this.script, this.formView);
    }

    private safeEval(script: string, formView: FormView): string {

        function $(...paths: string[]) {

            var strValues: string [] = [];
            paths.forEach((path: string) => {

                var strValue = formView.getData().getString(path);
                if (!StringHelper.isBlank(strValue)) {
                    strValues.push(strValue);
                }
            });

            var strValue = "";
            strValues.forEach((s: string, index: number) => {
                strValue += s;
                if (index < strValues.length - 1) {
                    strValue += " ";
                }
            });

            return strValue;
        }

        var result = '';

        try {
            // hide eval, Function, document, window and other things from the script.
            result = eval('var eval; var Function; var document; var location; ' +
                          'var window; var parent; var self; var top; ' +
                          script);
        } catch (e) {
            console.error('Cannot evaluate script [' + script + '].', e);
        }

        return result;
    }
}
