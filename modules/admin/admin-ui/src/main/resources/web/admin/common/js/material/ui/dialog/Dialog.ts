module api.material.ui.dialog {

    import DialogEl = api.material.dom.DialogEl;
    import HeaderEl = api.material.dom.HeaderEl;

    export interface DialogConfig {
        title: DialogHeaderConfig
    }

    export class Dialog extends DialogEl {

        private header: DialogHeader;

        constructor(config: DialogConfig) {
            super("dialog mdl-dialog");
            this.initialize(config);
        }

        initialize(config: DialogConfig) {
            this.initHeader(config.title);
            this.initContent();
            this.initActions();
        }

        private initHeader(config: DialogHeaderConfig) {
            this.header = new DialogHeader(config);
            this.appendChild(this.header);
        }

        private initContent(): void {

        }

        private initActions(): void {

        }
    }
}
