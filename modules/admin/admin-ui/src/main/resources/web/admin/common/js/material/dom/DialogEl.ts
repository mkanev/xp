module api.material.dom {

    import Element = api.dom.Element;
    import NewElementBuilder = api.dom.NewElementBuilder;

    export class DialogEl extends Element {
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

        open() {
            return this.showModal();
        }

        close() {
            return this.hide();
        }
    }
}
