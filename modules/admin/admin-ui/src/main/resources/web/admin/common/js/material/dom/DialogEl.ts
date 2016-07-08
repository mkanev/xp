module api.material.dom {

    import NewElementBuilder = api.dom.NewElementBuilder;

    export class DialogEl extends api.dom.Element {
        constructor(className?: string) {
            super(new NewElementBuilder().setTagName("dialog").setClassName(className));
            const dialog = this.getHTMLElement();
            if (!dialog["showModal"]) {
                dialogPolyfill.registerDialog(dialog);
            }
        }

        showModal() {
            return this.getHTMLElement()["showModal"]();
        }

        show() {
            return this.getHTMLElement()["show"]();
        }

        hide() {
            return this.getHTMLElement()["close"]();
        }

        close() {
            return this.hide();
        }
    }
}
