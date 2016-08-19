import {CompositeFormInputEl} from "../../dom/CompositeFormInputEl";
import {TextAreaInput} from "./TextAreaInput";
import {UriHelper} from "../../util/UriHelper";

export class CodeAreaBuilder {

        name: string;

        mode: string;

        value: string;

        lineNumbers: boolean;

        public setName(value: string): CodeAreaBuilder {
            this.name = value;
            return this;
        }

        public setMode(value: string): CodeAreaBuilder {
            this.mode = value;
            return this;
        }

        public setValue(value: string): CodeAreaBuilder {
            this.value = value;
            return this;
        }

        public setLineNumbers(value: boolean): CodeAreaBuilder {
            this.lineNumbers = value;
            return this;
        }

        public build(): CodeArea {
            return new CodeArea(this);
        }
    }

    export class CodeArea extends CompositeFormInputEl {

        private textArea: TextAreaInput;

        private options: CodeMirrorOptions;

        private codeMirror;

        private mode: string;

        constructor(builder: CodeAreaBuilder) {
            this.textArea = new TextAreaInput(builder.name, builder.value);

            super(this.textArea);

            this.mode = builder.mode;
            this.options = {
                lineNumbers: builder.lineNumbers
            };
            CodeMirror.modeURL = UriHelper.getAdminUri('common/lib/codemirror/mode/%N.js');

            this.onAdded((event) => {
                this.codeMirror = CodeMirror.fromTextArea(<HTMLTextAreaElement>this.textArea.getHTMLElement(), this.options);
                this.codeMirror.setSize("540px", "350px");
                this.codeMirror.setOption("mode", this.mode);
                CodeMirror.autoLoadMode(this.codeMirror, this.mode);
                this.codeMirror.refresh();
            });

            this.onShown((event) => {
                this.codeMirror.refresh();
            });
        }
    }
