import {ContentSummary} from "../../../content/ContentSummary";
import {ApplicationKey} from "../../../application/ApplicationKey";
import {AnchorModalDialog} from "./AnchorModalDialog";
import {HtmlAreaDialogType} from "./CreateHtmlAreaDialogEvent";
import {CreateHtmlAreaDialogEvent} from "./CreateHtmlAreaDialogEvent";
import {HtmlModalDialog} from "./HtmlModalDialog";
import {HtmlAreaAnchor} from "./HtmlModalDialog";
import {HtmlAreaImage} from "./HtmlModalDialog";
import {HtmlAreaMacro} from "./HtmlModalDialog";
import {ImageModalDialog} from "./ImageModalDialog";
import {LinkModalDialog} from "./LinkModalDialog";
import {MacroModalDialog} from "./MacroModalDialog";

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

        private static openLinkDialog(config: HtmlAreaAnchor, content: ContentSummary): HtmlModalDialog {
            return this.openDialog(new LinkModalDialog(config, content));
        }

        private static openImageDialog(config: HtmlAreaImage, content: ContentSummary): HtmlModalDialog {
            return this.openDialog(new ImageModalDialog(config, content));
        }

        private static openAnchorDialog(editor: HtmlAreaEditor): HtmlModalDialog {
            return this.openDialog(new AnchorModalDialog(editor));
        }

        private static openMacroDialog(config: HtmlAreaMacro, content: ContentSummary,
                                       applicationKeys: ApplicationKey[]): HtmlModalDialog {
            return this.openDialog(new MacroModalDialog(config, content, applicationKeys));
        }

        private static openDialog(dialog: HtmlModalDialog): HtmlModalDialog {
            dialog.open();
            return dialog;
        }
    }
