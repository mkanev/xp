import {BaseInputTypeNotManagingAdd} from "../support/BaseInputTypeNotManagingAdd";
import {Property} from "../../../data/Property";
import {Value} from "../../../data/Value";
import {ValueType} from "../../../data/ValueType";
import {ValueTypes} from "../../../data/ValueTypes";
import {ContentSummary} from "../../../content/ContentSummary";
import {Element} from "../../../dom/Element";
import {OptionSelectedEvent} from "../../../ui/selector/OptionSelectedEvent";
import {LinkModalDialog} from "../../../util/htmlarea/dialog/LinkModalDialog";
import {ImageModalDialog} from "../../../util/htmlarea/dialog/ImageModalDialog";
import {AnchorModalDialog} from "../../../util/htmlarea/dialog/AnchorModalDialog";
import {HTMLAreaBuilder} from "../../../util/htmlarea/editor/HTMLAreaBuilder";
import {HTMLAreaHelper} from "../../../util/htmlarea/editor/HTMLAreaHelper";
import {HtmlModalDialog as ModalDialog} from "../../../util/htmlarea/dialog/HtmlModalDialog";
import {ElementHelper} from "../../../dom/ElementHelper";
import {ApplicationKey} from "../../../application/ApplicationKey";
import {ContentPath} from "../../../content/ContentPath";
import {ContentInputTypeViewContext} from "../../../content/form/inputtype/ContentInputTypeViewContext";
import {TextAreaInput} from "../../../ui/text/TextAreaInput";
import {DivEl} from "../../../dom/DivEl";
import {AppHelper} from "../../../util/AppHelper";
import {SelectorOnBlurEvent} from "../../../ui/selector/SelectorOnBlurEvent";
import {HTMLAreaDialogHandler} from "../../../util/htmlarea/dialog/HTMLAreaDialogHandler";
import {ResponsiveManager} from "../../../ui/responsive/ResponsiveManager";
import {StringHelper} from "../../../util/StringHelper";
import {ArrayHelper} from "../../../util/ArrayHelper";
import {InputTypeManager} from "../InputTypeManager";
import {Class} from "../../../Class";

declare var CONFIG;

    export class HtmlArea extends BaseInputTypeNotManagingAdd<string> {

        private editors: HtmlAreaOccurrenceInfo[];
        private content: ContentSummary;
        private contentPath: ContentPath;
        private applicationKeys: ApplicationKey[];

        private focusListeners: {(event: FocusEvent): void}[] = [];

        private blurListeners: {(event: FocusEvent): void}[] = [];

        private tools: any = {
            include: "",
            exclude: ""
        };

        constructor(config: ContentInputTypeViewContext) {

            super(config);

            this.addClass("html-area");
            this.editors = [];
            this.contentPath = config.contentPath;
            this.content = config.content;
            this.applicationKeys = config.site ? config.site.getApplicationKeys() : [];

            this.readConfig(config.inputConfig);
        }

        private readConfig(inputConfig: { [element: string]: { [name: string]: string }[]; }): void {
            this.tools.include = inputConfig['include'];
            this.tools.exclude = inputConfig['exclude'];
        }

        getValueType(): ValueType {
            return ValueTypes.STRING;
        }

        newInitialValue(): Value {
            return super.newInitialValue() || ValueTypes.STRING.newValue("");
        }

        createInputOccurrenceElement(index: number, property: Property): Element {
            if (!ValueTypes.STRING.equals(property.getType())) {
                property.convertValueType(ValueTypes.STRING);
            }

            var value = HTMLAreaHelper.prepareImgSrcsInValueForEdit(property.getString());
            var textAreaEl = new TextAreaInput(this.getInput().getName() + "-" + index, value);

            var editorId = textAreaEl.getId();

            var clazz = editorId.replace(/\./g, '_');
            textAreaEl.addClass(clazz);

            var textAreaWrapper = new DivEl();

            this.editors.push({id: editorId, textAreaWrapper: textAreaWrapper, property: property});

            textAreaEl.onRendered(() => {
                this.initEditor(editorId, property, textAreaWrapper);
            });
            textAreaEl.onRemoved(() => {
                this.destroyEditor(editorId);
            });

            textAreaWrapper.appendChild(textAreaEl);

            this.setFocusOnEditorAfterCreate(textAreaWrapper, editorId);

            return textAreaWrapper;
        }

        updateInputOccurrenceElement(occurrence: Element, property: Property, unchangedOnly: boolean) {
            var textArea = <TextAreaInput> occurrence.getFirstChild();
            var id = textArea.getId();

            if (!unchangedOnly || !textArea.isDirty()) {
                this.setEditorContent(id, property);
            }
        }

        private initEditor(id: string, property: Property, textAreaWrapper: Element): void {
            var focusedEditorCls = "html-area-focused";
            var baseUrl = CONFIG.assetsUri;

            var focusHandler = (e) => {
                this.resetInputHeight();
                textAreaWrapper.addClass(focusedEditorCls);

                this.notifyFocused(e);

                AppHelper.dispatchCustomEvent("focusin", this);
                new SelectorOnBlurEvent(this).fire();
            };

            var notifyValueChanged = this.notifyValueChanged.bind(this, id, textAreaWrapper);

            var isMouseOverRemoveOccurenceButton = false;

            var blurHandler = (e) => {
                //checking if remove occurence button clicked or not
                AppHelper.dispatchCustomEvent("focusout", this);

                if (!isMouseOverRemoveOccurenceButton) {
                    this.setStaticInputHeight();
                    textAreaWrapper.removeClass(focusedEditorCls);
                }
                this.notifyBlurred(e);

            };

            var keydownHandler = (e) => {
                if ((e.metaKey || e.ctrlKey) && e.keyCode === 83) {  // Cmd-S or Ctrl-S
                    e.preventDefault();

                    this.notifyValueChanged(id, textAreaWrapper);

                    wemjq(this.getEl().getHTMLElement()).simulate(e.type, { // as editor resides in a frame - propagate event via wrapping element
                        bubbles: e.bubbles,
                        cancelable: e.cancelable,
                        view: parent,
                        ctrlKey: e.ctrlKey,
                        altKey: e.altKey,
                        shiftKey: e.shiftKey,
                        metaKey: e.metaKey,
                        keyCode: e.keyCode,
                        charCode: e.charCode
                    });
                }
            };

            var createDialogHandler = event => {
                HTMLAreaDialogHandler.createAndOpenDialog(event);
                textAreaWrapper.addClass(focusedEditorCls);
            };

            new HTMLAreaBuilder().
                setSelector('textarea.' + id.replace(/\./g, '_')).
                setAssetsUri(baseUrl).setInline(false).onCreateDialog(createDialogHandler).
                setFocusHandler(focusHandler.bind(this)).
                setBlurHandler(blurHandler.bind(this)).
                setKeydownHandler(keydownHandler).setKeyupHandler(notifyValueChanged).setNodeChangeHandler(
                notifyValueChanged).setContentPath(this.contentPath).setContent(this.content).setApplicationKeys(this.applicationKeys).
                setTools(this.tools).
                createEditor().
                then((editor: HtmlAreaEditor) => {
                    this.setEditorContent(id, property);
                    if (this.notInLiveEdit()) {
                        this.setupStickyEditorToolbarForInputOccurence(textAreaWrapper);
                    }
                    this.removeTooltipFromEditorArea(textAreaWrapper);

                var removeButtonEL = wemjq(textAreaWrapper.getParentElement().getParentElement().getHTMLElement()).find(
                    ".remove-button")[0];
                removeButtonEL.addEventListener("mouseover", () => {
                    isMouseOverRemoveOccurenceButton = true;
                });
                removeButtonEL.addEventListener("mouseleave", () => {
                    isMouseOverRemoveOccurenceButton = false;
                });

                    HTMLAreaHelper.updateImageAlignmentBehaviour(editor);
                    this.onShown((event) => {
                        // invoke auto resize on shown in case contents have been updated while inactive
                        if (!!editor['contentAreaContainer'] || !!editor['bodyElement']) {
                            editor.execCommand('mceAutoResize', false, null, {skip_focus: true});
                        }
                    });
                });
        }

        private setFocusOnEditorAfterCreate(inputOccurence: Element, id: string): void {
            inputOccurence.giveFocus = () => {
                var editor = this.getEditor(id);
                if (editor) {
                    editor.focus();
                    return true;
                } else {
                    console.log("Element.giveFocus(): Failed to give focus to HtmlArea element: id = " + this.getId());
                    return false;
                }
            };
        }

        private setupStickyEditorToolbarForInputOccurence(inputOccurence: Element) {
            wemjq(this.getHTMLElement()).closest(".form-panel").on("scroll", (event) => {
                this.updateStickyEditorToolbar(inputOccurence);
            });

            ResponsiveManager.onAvailableSizeChanged(this, () => {
                this.updateEditorToolbarPos(inputOccurence);
            });

            this.onRemoved((event) => {
                ResponsiveManager.unAvailableSizeChanged(this);
            });

            this.onOccurrenceRendered(() => {
                this.resetInputHeight();
            });

            this.onOccurrenceRemoved(() => {
                this.resetInputHeight();
            });
        }

        private updateStickyEditorToolbar(inputOccurence: Element) {
            if (!this.editorTopEdgeIsVisible(inputOccurence) && this.editorLowerEdgeIsVisible(inputOccurence)) {
                inputOccurence.addClass("sticky-toolbar");
                this.updateEditorToolbarPos(inputOccurence);
            }
            else {
                inputOccurence.removeClass("sticky-toolbar")
            }
        }

        private updateEditorToolbarPos(inputOccurence: Element) {
            wemjq(inputOccurence.getHTMLElement()).find(".mce-toolbar-grp").css({top: this.getToolbarOffsetTop(1)});
        }

        private editorTopEdgeIsVisible(inputOccurence: Element): boolean {
            return this.calcDistToTopOfScrlbleArea(inputOccurence) > 0;
        }

        private editorLowerEdgeIsVisible(inputOccurence: Element): boolean {
            var distToTopOfScrlblArea = this.calcDistToTopOfScrlbleArea(inputOccurence);
            var editorToolbarHeight = wemjq(inputOccurence.getHTMLElement()).find(".mce-toolbar-grp").outerHeight(true);
            return (inputOccurence.getEl().getHeightWithoutPadding() - editorToolbarHeight + distToTopOfScrlblArea) > 0;
        }

        private calcDistToTopOfScrlbleArea(inputOccurence: Element): number {
            return inputOccurence.getEl().getOffsetTop() - this.getToolbarOffsetTop();
        }

        private getToolbarOffsetTop(delta: number = 0): number {
            var toolbar = wemjq(this.getHTMLElement()).closest(".form-panel").find(".wizard-step-navigator-and-toolbar"),
                stickyToolbarHeight = toolbar.outerHeight(true),
                offset = toolbar.offset(),
                stickyToolbarOffset = offset ? offset.top : 0;

            return stickyToolbarOffset + stickyToolbarHeight + delta;
        }

        private resetInputHeight() {
            wemjq(this.getHTMLElement()).height("auto");
        }

        private setStaticInputHeight() {
            wemjq(this.getHTMLElement()).height(wemjq(this.getHTMLElement()).height());
        }

        private hideDropdownMenu() {
            wemjq(".mce-menu").hide();
        }

        private getEditor(editorId: string): HtmlAreaEditor {
            return tinymce.get(editorId);
        }

        private setEditorContent(editorId: string, property: Property): void {
            var editor = this.getEditor(editorId);
            if (editor) {
                editor.setContent(property.hasNonNullValue() ? HTMLAreaHelper.prepareImgSrcsInValueForEdit(property.getString()) : "");
            } else {
                console.log("Editor with id '" + editorId + "' not found")
            }
        }

        private notInLiveEdit(): boolean {
            return !(wemjq(this.getHTMLElement()).parents(".inspection-panel").length > 0);
        }

        private notifyValueChanged(id: string, occurrence: Element) {
            var value = ValueTypes.STRING.newValue(HTMLAreaHelper.prepareEditorImageSrcsBeforeSave(this.getEditor(id)));
            this.notifyOccurrenceValueChanged(occurrence, value);
        }

        private newValue(s: string): Value {
            return new Value(s, ValueTypes.STRING);
        }

        valueBreaksRequiredContract(value: Value): boolean {
            return value.isNull() || !value.getType().equals(ValueTypes.STRING) || StringHelper.isBlank(value.getString());
        }

        hasInputElementValidUserInput(inputElement: Element) {

            // TODO
            return true;
        }

        private removeTooltipFromEditorArea(inputOccurence: Element) {
            wemjq(inputOccurence.getHTMLElement()).find("iframe").removeAttr("title");
        }

        handleDnDStart(event: Event, ui: JQueryUI.SortableUIParams): void {
            super.handleDnDStart(event, ui);

            var editorId = wemjq('textarea', ui.item)[0].id;
            this.destroyEditor(editorId);
        }

        handleDnDStop(event: Event, ui: JQueryUI.SortableUIParams): void {
            var editorId = wemjq('textarea', ui.item)[0].id;

            this.reInitEditor(editorId);
            tinymce.execCommand('mceAddEditor', false, editorId);

            this.getEditor(editorId).focus();
        }

        onFocus(listener: (event: FocusEvent) => void) {
            this.focusListeners.push(listener);
        }

        unFocus(listener: (event: FocusEvent) => void) {
            this.focusListeners = this.focusListeners.filter((curr) => {
                return curr !== listener;
            });
        }

        onBlur(listener: (event: FocusEvent) => void) {
            this.blurListeners.push(listener);
        }

        unBlur(listener: (event: FocusEvent) => void) {
            this.blurListeners = this.blurListeners.filter((curr) => {
                return curr !== listener;
            });
        }

        private notifyFocused(event: FocusEvent) {
            this.focusListeners.forEach((listener) => {
                listener(event);
            })
        }

        private notifyBlurred(event: FocusEvent) {
            this.blurListeners.forEach((listener) => {
                listener(event);
            })
        }


        private destroyEditor(id: string): void {
            var editor = this.getEditor(id)
            if (editor) {
                try {
                    editor.destroy(false);
                }
                catch (e) {
                    //error thrown in FF on tab close - XP-2624
                }
            }
        }

        private reInitEditor(id: string) {
            var savedEditor: HtmlAreaOccurrenceInfo = ArrayHelper.findElementByFieldValue(this.editors, "id", id);

            this.initEditor(id, savedEditor.property, savedEditor.textAreaWrapper);
        }

    }

    export interface HtmlAreaOccurrenceInfo {
        id: string;
        textAreaWrapper: Element;
        property: Property;
    }

    InputTypeManager.register(new Class("HtmlArea", HtmlArea));
