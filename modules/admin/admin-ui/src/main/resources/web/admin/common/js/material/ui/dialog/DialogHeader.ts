module api.material.ui.dialog {

    import SpanEl = api.dom.SpanEl;
    import PEl = api.dom.PEl;
    import HeaderEl = api.material.dom.HeaderEl;

    export interface DialogHeaderConfig {
        title?: string;
        subtitle?: string;
    }

    export class DialogHeader extends HeaderEl {

        private config: DialogHeaderConfig;
        private title: SpanEl;
        private subtitle: PEl;

        constructor(config: DialogHeaderConfig) {
            super("dialog__header mdl-dialog__title");
            this.initialize(config);
        }

        initialize(config: DialogHeaderConfig) {
            this.config = config;
            this.title = new SpanEl("dialog__title");
            this.subtitle = new PEl("dialog__subtitle");
            this.update(config);
        }

        update(config: DialogHeaderConfig) {
            if (config.title != null) {
                this.setTitle(config.title);
            }
            if (config.subtitle != null) {
                this.setSubtitle(config.subtitle);
            }
            this.subtitle.toggleClass("dialog__subtitle--empty", !config.subtitle);
        }

        setTitle(title: string) {
            this.title.setHtml(title);
        }

        setSubtitle(subtitle: string) {
            this.subtitle.setHtml(subtitle);
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
            this.appendChild(this.subtitle);

            return wemQ(true);
        }
    }
}
