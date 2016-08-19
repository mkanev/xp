import {FormInputEl} from "../../dom/FormInputEl";
import {StringHelper} from "../../util/StringHelper";

export class Validators {

        public static required(input: FormInputEl): string {
            var value = input.getValue();
            return StringHelper.isBlank(value) ? "This field is required" : undefined;
        }

        public static validEmail(input: FormInputEl): string {
            var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
            var value = input.getValue();
            return !regexEmail.test(value) ? "Invalid email address" : undefined;
        }
    }

