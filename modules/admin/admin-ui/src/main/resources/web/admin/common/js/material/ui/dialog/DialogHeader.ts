module api.material.ui.dialog {

    import DivEl = api.dom.DivEl;
    import SpanEl = api.dom.SpanEl;
    import HeaderEl = api.material.dom.HeaderEl;

    export interface DialogHeaderConfig {
        title: string;
    }

    export class DialogHeader extends HeaderEl {

        private title: SpanEl;

        constructor(config: DialogHeaderConfig) {
            super("dialog__header mdl-dialog__title");
            this.initialize(config);
        }

        initialize(config: DialogHeaderConfig) {
            this.title = new SpanEl("dialog__title");
            this.setTitle(config.title);
            this.appendChild(this.title);
        }

        setTitle(title: string) {
            this.title.setHtml(title);
        }
    }
}
