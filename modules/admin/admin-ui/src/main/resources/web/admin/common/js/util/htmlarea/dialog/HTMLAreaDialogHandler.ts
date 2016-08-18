module api.util.htmlarea.dialog {

    export class HTMLAreaDialogHandler {

        private static modalDialog: HtmlModalDialog;

        static createAndOpenDialog(event: CreateHtmlAreaDialogEvent): HtmlModalDialog {
            let modalDialog;

            switch (event.getType()) {
            case HtmlAreaDialogType.ANCHOR:
                modalDialog = this.openAnchorDialog(event.getConfig());
                break;
            case HtmlAreaDialogType.IMAGE:
                modalDialog = this.openImageDialog(event.getConfig(), event.getContent());
                break;
            case HtmlAreaDialogType.LINK:
                modalDialog = this.openLinkDialog(event.getConfig(), event.getContent());
                break;
            case HtmlAreaDialogType.MACRO:
                modalDialog = this.openMacroDialog(event.getConfig(), event.getContent(), event.getApplicationKeys());
                break;
            }

            if (modalDialog) {
                this.modalDialog = modalDialog;
                modalDialog.onHidden(() => {
                    this.modalDialog = null;
                });
            }

            return this.modalDialog;
        }

        static getOpenDialog(): HtmlModalDialog {
            return this.modalDialog;
        }

        private static openLinkDialog(config: HtmlAreaAnchor, content: api.content.ContentSummary): HtmlModalDialog {
            return this.openDialog(new LinkModalDialog(config, content));
        }

        private static openImageDialog(config: HtmlAreaImage, content: api.content.ContentSummary): HtmlModalDialog {
            return this.openDialog(new ImageModalDialog(config, content));
        }

        private static openAnchorDialog(editor: HtmlAreaEditor): HtmlModalDialog {
            return this.openDialog(new AnchorModalDialog(editor));
        }

        private static openMacroDialog(config: HtmlAreaMacro, content: api.content.ContentSummary,
                                       applicationKeys: api.application.ApplicationKey[]): HtmlModalDialog {
            return this.openDialog(new MacroModalDialog(config, content, applicationKeys));
        }

        private static openDialog(dialog: HtmlModalDialog): HtmlModalDialog {
            dialog.open();
            return dialog;
        }
    }
}