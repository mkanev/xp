import {MacroDescriptor} from "../../../macro/MacroDescriptor";
import {MacroPreview} from "../../../macro/MacroPreview";
import {FormView} from "../../../form/FormView";
import {DockedPanel} from "../../../ui/panel/DockedPanel";
import {Panel} from "../../../ui/panel/Panel";
import {ContentFormContext} from "../../../content/form/ContentFormContext";
import {Form} from "../../../form/Form";
import {Input} from "../../../form/Input";
import {FormItemSet} from "../../../form/FormItemSet";
import {FieldSet} from "../../../form/FieldSet";
import {FormItem} from "../../../form/FormItem";
import {PropertySet} from "../../../data/PropertySet";
import {ContentSummary} from "../../../content/ContentSummary";
import {LoadMask} from "../../../ui/mask/LoadMask";
import {DefaultErrorHandler} from "../../../DefaultErrorHandler";
import {GetPreviewRequest} from "../../../macro/resource/GetPreviewRequest";
import {PropertyTree} from "../../../data/PropertyTree";
import {GetPreviewStringRequest} from "../../../macro/resource/GetPreviewStringRequest";
import {DivEl} from "../../../dom/DivEl";
import {Content} from "../../../content/Content";
import {ResponsiveManager} from "../../../ui/responsive/ResponsiveManager";
import {IFrameEl} from "../../../dom/IFrameEl";
import {AppHelper} from "../../AppHelper";

export class MacroDockedPanel extends DockedPanel {

        private static CONFIGURATION_TAB_NAME: string = "Configuration";
        private static PREVIEW_TAB_NAME: string = "Preview";
        private static MACRO_FORM_INCOMPLETE_MES: string = "Macro configuration is not complete";
        private static PREVIEW_LOAD_ERROR_MESSAGE: string = "An error occurred while loading preview";

        private configPanel: Panel;
        private previewPanel: Panel;

        private content: ContentSummary;
        private macroDescriptor: MacroDescriptor;
        private previewResolved: boolean = false;
        private macroPreview: MacroPreview;
        private data: PropertySet;
        private macroLoadMask: LoadMask;

        private formValueChangedHandler: () => void;

        private panelRenderedListeners: {(): void}[] = [];

        constructor(content: ContentSummary) {
            super();
            this.content = content;

            this.addItem(MacroDockedPanel.CONFIGURATION_TAB_NAME, true, this.createConfigurationPanel());
            this.addItem(MacroDockedPanel.PREVIEW_TAB_NAME, true, this.createPreviewPanel());

            this.macroLoadMask = new LoadMask(this.previewPanel);
            this.appendChild(this.macroLoadMask);

            this.handleConfigPanelShowEvent();
            this.handlePreviewPanelShowEvent();

            this.formValueChangedHandler = () => {
                this.previewResolved = false;
            };
        }

        private createConfigurationPanel(): Panel {
            return this.configPanel = new Panel("macro-config-panel");
        }

        private createPreviewPanel(): Panel {
            return this.previewPanel = new Panel("macro-preview-panel");
        }

        private handlePreviewPanelShowEvent() {
            this.previewPanel.onShown(() => {
                if (this.validateMacroForm()) {
                    if (!!this.macroDescriptor && !this.previewResolved) {
                        this.previewPanel.removeChildren();
                        this.fetchPreview().then((macroPreview: MacroPreview) => {
                            this.previewResolved = true;
                            this.macroPreview = macroPreview;
                            this.renderPreview(macroPreview);
                        }).catch((reason: any) => {
                            DefaultErrorHandler.handle(reason);
                            this.renderPreviewWithMessage(MacroDockedPanel.PREVIEW_LOAD_ERROR_MESSAGE);
                        }).finally(() => {
                            this.macroLoadMask.hide();
                        });
                    } else {
                        this.notifyPanelRendered();
                    }
                } else {
                    this.renderPreviewWithMessage(MacroDockedPanel.MACRO_FORM_INCOMPLETE_MES);
                }
            });
        }

        private handleConfigPanelShowEvent() {
            this.configPanel.onShown(() => {
                this.notifyPanelRendered();
            });
        }

        private fetchPreview(): wemQ.Promise<MacroPreview> {
            this.macroLoadMask.show();

            return new GetPreviewRequest(
                new PropertyTree(this.data),
                this.macroDescriptor.getKey(),
                this.content.getPath()).
                sendAndParse();
        }

        private fetchMacroString(): wemQ.Promise<string> {
            this.macroLoadMask.show();

            return new GetPreviewStringRequest(new PropertyTree(this.data),
                this.macroDescriptor.getKey()).sendAndParse();
        }

        public getMacroPreviewString(): wemQ.Promise<string> {
            var deferred = wemQ.defer<string>();
            if (this.previewResolved) {
                deferred.resolve(this.macroPreview.getMacroString());
            } else {
                this.fetchMacroString().then((macroString: string) => {
                    deferred.resolve(macroString);
                }).catch((reason: any) => {
                    deferred.reject(reason);
                }).finally(() => {
                    this.macroLoadMask.hide();
                });
            }

            return deferred.promise;
        }

        private renderPreviewWithMessage(message: string) {
            this.previewPanel.removeChildren();
            var appendMe = new DivEl("preview-message");
            appendMe.setHtml(message);
            this.previewPanel.appendChild(appendMe)
        }

        private renderPreview(macroPreview: MacroPreview) {
            if (macroPreview.getPageContributions().hasAtLeastOneScript()) { // render in iframe if there are scripts to be included for preview rendering
                this.previewPanel.appendChild(this.makePreviewFrame(macroPreview));
            } else {
                var appendMe = new DivEl("preview-content");
                appendMe.setHtml(macroPreview.getHtml(), false);
                this.previewPanel.appendChild(appendMe)
                this.notifyPanelRendered();
            }
        }

        private makePreviewFrame(macroPreview: MacroPreview): MacroPreviewFrame {
            var previewFrame = new MacroPreviewFrame(macroPreview),
                previewFrameRenderedHandler: () => void = () => {
                    this.notifyPanelRendered();
                };

            previewFrame.onPreviewRendered(previewFrameRenderedHandler);
            previewFrame.onRemoved(() => {
                previewFrame.unPreviewRendered(previewFrameRenderedHandler);
            });

            return previewFrame;
        }

        public validateMacroForm(): boolean {
            var isValid = true,
                form = <FormView>(this.configPanel.getFirstChild());
            if (!!form) {
                isValid = form.validate(false).isValid();
                form.displayValidationErrors(!isValid);
            }
            return isValid;
        }

        public setMacroDescriptor(macroDescriptor: MacroDescriptor) {
            this.macroDescriptor = macroDescriptor;
            this.previewResolved = false;

            this.initPropertySetForDescriptor();
            this.showDescriptorConfigView(macroDescriptor);
        }

        private showDescriptorConfigView(macroDescriptor: MacroDescriptor) {
            this.selectPanel(this.configPanel);

            if (!!macroDescriptor) {
                var formView: FormView = new FormView(ContentFormContext.
                        create().
                        setPersistedContent(<Content>this.content).
                        build(),
                    macroDescriptor.getForm(), this.data);

                this.renderConfigView(formView)
            }
        }

        private initPropertySetForDescriptor() {
            if (!!this.data) {
                this.data.unChanged(this.formValueChangedHandler);
            }
            this.data = new PropertySet();
            this.data.onChanged(this.formValueChangedHandler);
        }

        private renderConfigView(formView: FormView) {
            this.configPanel.removeChildren();

            formView.layout().then(() => {
                this.configPanel.appendChild(formView);
                ResponsiveManager.fireResizeEvent();
            });
        }

        onPanelRendered(listener: () => void) {
            this.panelRenderedListeners.push(listener);
        }

        unPanelRendered(listener: () => void) {
            this.panelRenderedListeners = this.panelRenderedListeners.filter((curr) => {
                return curr !== listener;
            });
        }

        private notifyPanelRendered() {
            this.panelRenderedListeners.forEach((listener) => {
                listener();
            })
        }
    }

    export class MacroPreviewFrame extends IFrameEl {

        private id: string = "macro-preview-frame-id";

        private macroPreview: MacroPreview;

        private debouncedResizeHandler: () => void = AppHelper.debounce(() => {
            this.adjustFrameHeight();
        }, 500, false);

        private previewRenderedListeners: {(): void}[] = [];

        constructor(macroPreview: MacroPreview) {
            super("preview-iframe");
            this.setId(this.id);
            this.macroPreview = macroPreview;

            this.initFrameContent(macroPreview)
        }

        private initFrameContent(macroPreview: MacroPreview) {
            this.onLoaded(() => {

                var doc = this.getHTMLElement()["contentWindow"] || this.getHTMLElement()["contentDocument"];
                if (doc.document) {
                    doc = doc.document;
                }

                doc.open();
                doc.write(this.makeContentForPreviewFrame(macroPreview));
                doc.close();

                if (this.isYoutubePreview()) {
                    doc.body.style.marginRight = 4;
                }

                this.debouncedResizeHandler();
                this.adjustFrameHeightOnContentsUpdate();
            });
        }

        private isYoutubePreview(): boolean {
            return this.macroPreview.getMacroString().indexOf("[youtube") == 0;
        }

        private isInstagramPreview(): boolean {
            return this.macroPreview.getMacroString().indexOf("[instagram") == 0;
        }

        private adjustFrameHeightOnContentsUpdate() {
            var frameWindow = this.getHTMLElement()["contentWindow"];
            if (!!frameWindow) {
                var observer = new MutationObserver(this.debouncedResizeHandler),
                    config = {attributes: true, childList: true, characterData: true};

                observer.observe(frameWindow.document.body, config);
            }
        }

        private adjustFrameHeight() {
            try {
                var frameWindow = this.getHTMLElement()["contentWindow"] || this.getHTMLElement()["contentDocument"],
                    scrollHeight = frameWindow.document.body.scrollHeight,
                    maxFrameHeight = this.getMaxFrameHeight();
                this.getEl().setHeightPx(scrollHeight > 150
                    ? scrollHeight > maxFrameHeight ? maxFrameHeight : scrollHeight + (this.isInstagramPreview() ? 18 : 0)
                    : wemjq("#" + this.id).contents().find('body').outerHeight());
                this.notifyPreviewRendered();
            } catch (error) {
            }
        }

        private getMaxFrameHeight(): number {
            return wemjq(window).height() - 250;
        }

        private makeContentForPreviewFrame(macroPreview: MacroPreview): string {
            var result = "";
            macroPreview.getPageContributions().getHeadBegin().forEach(script => result += script);
            macroPreview.getPageContributions().getHeadEnd().forEach(script => result += script);
            macroPreview.getPageContributions().getBodyBegin().forEach(script => result += script);
            result += macroPreview.getHtml();
            macroPreview.getPageContributions().getBodyEnd().forEach(script => result += script);
            return result;
        }

        onPreviewRendered(listener: () => void) {
            this.previewRenderedListeners.push(listener);
        }

        unPreviewRendered(listener: () => void) {
            this.previewRenderedListeners = this.previewRenderedListeners.filter((curr) => {
                return curr !== listener;
            });
        }

        private notifyPreviewRendered() {
            this.previewRenderedListeners.forEach((listener) => {
                listener();
            })
        }
    }
