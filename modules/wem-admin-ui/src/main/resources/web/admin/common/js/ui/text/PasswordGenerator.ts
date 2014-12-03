module api.ui.text {

    import StringHelper = api.util.StringHelper;
    import NumberHelper = api.util.NumberHelper;
    import ArrayHelper = api.util.ArrayHelper;

    enum CharType {
        SPECIAL,
        DIGIT,
        UPPERCASE,
        LOWERCASE
    }

    export class PasswordGenerator extends api.dom.FormInputEl {

        private input: PasswordInput;
        private showLink: api.dom.AEl;
        private generateLink: api.dom.AEl;

        private complexity: string;

        private SPECIAL_CHARS = '!@#$%^&*()_+{}:"<>?|[];\',./`~';
        private LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
        private UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        private DIGIT_CHARS = '0123456789';

        constructor() {
            super("div", "password-generator");

            this.input = new PasswordInput();
            this.input.onInput((event: Event) => {
                this.assessComplexity(this.input.getValue());
            });
            this.appendChild(this.input);

            this.showLink = new api.dom.AEl('show-link');
            this.showLink.onClicked((event: MouseEvent) => {
                var unlocked = this.hasClass('unlocked');
                this.toggleClass('unlocked', !unlocked);
                this.input.setType(unlocked ? 'password' : 'text');
            });
            this.appendChild(this.showLink);

            this.generateLink = new api.dom.AEl();
            this.generateLink.setHtml('Generate');
            this.generateLink.onClicked((event: MouseEvent) => {
                this.generatePassword();
                this.assessComplexity(this.input.getValue());
            });
            this.appendChild(this.generateLink);
        }

        getValue(): string {
            return this.input.getValue();
        }

        setValue(value: string): PasswordGenerator {
            this.input.setValue(value);
            return this;
        }

        getName(): string {
            return this.input.getName();
        }

        setName(value: string): PasswordGenerator {
            this.input.setName(value);
            return this;
        }

        setPlaceholder(value: string): PasswordGenerator {
            this.input.setPlaceholder(value);
            return this;
        }

        getPlaceholder(): string {
            return this.input.getPlaceholder();
        }

        private assessComplexity(value: string) {
            if (this.complexity) {
                this.removeClass(this.complexity);
                this.complexity = undefined;
            }
            if (this.isExtreme(value)) {
                this.complexity = 'extreme'
            } else if (this.isStrong(value)) {
                this.complexity = 'strong';
            } else if (this.isGood(value)) {
                this.complexity = 'good';
            } else if (this.isWeak(value)) {
                this.complexity = 'weak';
            }
            if (this.complexity) {
                this.addClass(this.complexity);
            }
        }


        private generatePassword() {
            var length = NumberHelper.randomBetween(12, 16),
                maxSpecials = NumberHelper.randomBetween(1, 3),
                specials = 0,
                maxDigits = NumberHelper.randomBetween(1, 3),
                digits = 0,
                maxUppercase = NumberHelper.randomBetween(2, 4),
                uppercase = 0,
                maxLowercase = length - maxSpecials - maxDigits - maxUppercase,
                lowercase = 0;

            var result = "";
            var types = [CharType.SPECIAL, CharType.DIGIT, CharType.UPPERCASE, CharType.LOWERCASE];

            for (var i = 0; i < length; i++) {
                var type = types[NumberHelper.randomBetween(0, types.length - 1)];
                switch (type) {
                case CharType.SPECIAL:
                    if (specials < maxSpecials) {
                        result += this.SPECIAL_CHARS.charAt(NumberHelper.randomBetween(0, this.SPECIAL_CHARS.length - 1));
                        specials++;
                    } else {
                        length++;
                        ArrayHelper.removeValue(CharType.SPECIAL, types);
                    }
                    break;
                case CharType.DIGIT:
                    if (digits < maxDigits) {
                        result += this.DIGIT_CHARS.charAt(NumberHelper.randomBetween(0, this.DIGIT_CHARS.length - 1));
                        digits++;
                    } else {
                        length++;
                        ArrayHelper.removeValue(CharType.DIGIT, types);
                    }
                    break;
                case CharType.UPPERCASE:
                    if (uppercase < maxUppercase) {
                        result += this.UPPERCASE_CHARS.charAt(NumberHelper.randomBetween(0, this.UPPERCASE_CHARS.length - 1));
                        uppercase++;
                    } else {
                        length++;
                        ArrayHelper.removeValue(CharType.UPPERCASE, types);
                    }
                    break;
                case CharType.LOWERCASE:
                    if (lowercase < maxLowercase) {
                        result += this.LOWERCASE_CHARS.charAt(NumberHelper.randomBetween(0, this.LOWERCASE_CHARS.length - 1));
                        lowercase++;
                    } else {
                        length++;
                        ArrayHelper.removeValue(CharType.LOWERCASE, types);
                    }
                    break;
                }
            }
            console.log('Generated ' + result.length + ' chars password (SP:' + maxSpecials + ', DG:' + maxDigits + ',UC:' + maxUppercase +
                        ', LC:' + maxLowercase + ') = ' + result);
            this.input.setValue(result);
        }

        private isWeak(value: string): boolean {
            return !StringHelper.isBlank(value) &&
                   (value.length < 8 ||
                    StringHelper.isLowerCase(value) ||
                    StringHelper.isUpperCase(value))
        }

        private isGood(value: string): boolean {
            return !StringHelper.isBlank(value) &&
                   ((value.length >= 8) ||
                    (value.length >= 6 && !StringHelper.isAlphaNumeric(value) &&
                     (!StringHelper.isLowerCase(value) || !StringHelper.isUpperCase(value))));
        }

        private isStrong(value: string): boolean {
            return !StringHelper.isBlank(value) && value.length >= 8 && !StringHelper.isAlphaNumeric(value) &&
                   !StringHelper.isLowerCase(value) && !StringHelper.isUpperCase(value);
        }

        private isExtreme(value: string): boolean {
            return !StringHelper.isBlank(value) && value.length >= 12 && !StringHelper.isAlphaNumeric(value) &&
                   this.containsDigits(value) && !StringHelper.isLowerCase(value) && !StringHelper.isUpperCase(value);
        }

        private containsDigits(value: string): boolean {
            return /\d/i.test(value);
        }
    }
}