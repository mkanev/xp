module api.material.ui.dialog {

    import SpanEl = api.dom.SpanEl;
    import HeaderEl = api.material.dom.HeaderEl;

    export interface DialogHeaderConfig {
        title?: string;
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

        isDataLoaded(): boolean {
            return true;
        }

        doRender(): wemQ.Promise<boolean> {
            return super.doRender().then((rendered) => {
                if (this.isDataLoaded()) {
                    return this.doRenderOnDataLoaded(rendered);
                }
            });
        }

        doRenderOnDataLoaded(rendered: boolean): wemQ.Promise<boolean> {
            this.appendChild(this.title);

            return wemQ(true);
        }
    }
}
