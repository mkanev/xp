import {Form} from "../../../ui/form/Form";
import {FormItem} from "../../../ui/form/FormItem";
import {Panel} from "../../../ui/panel/Panel";
import {DockedPanel} from "../../../ui/panel/DockedPanel";
import {Validators} from "../../../ui/form/Validators";
import {DropdownInput} from "../../../ui/selector/dropdown/DropdownInput";
import {DropdownConfig} from "../../../ui/selector/dropdown/DropdownInput";
import {Option} from "../../../ui/selector/Option";
import {LabelPosition} from "../../../ui/Checkbox";
import {ContentSummary} from "../../../content/ContentSummary";
import {ModalDialogHeader} from "../../../ui/dialog/ModalDialog";
import {StringHelper} from "../../StringHelper";
import {ContentTypeName} from "../../../schema/content/ContentTypeName";
import {FormInputEl} from "../../../dom/FormInputEl";
import {Checkbox} from "../../../ui/Checkbox";
import {Action} from "../../../ui/Action";
import {ContentSummaryLoader} from "../../../content/resource/ContentSummaryLoader";
import {ContentComboBox} from "../../../content/ContentComboBox";
import {DropdownExpandedEvent} from "../../../ui/selector/DropdownExpandedEvent";
import {KeyHelper} from "../../../ui/KeyHelper";
import {FormItemEl} from "../../../dom/FormItemEl";
import {Element} from "../../../dom/Element";
import {ElementHelper} from "../../../dom/ElementHelper";
import {AEl} from "../../../dom/AEl";
import {TextInput} from "../../../ui/text/TextInput";
import {NavigatedDeckPanel} from "../../../ui/panel/NavigatedDeckPanel";
import {TabBarItem} from "../../../ui/tab/TabBarItem";
import {Link} from "../../Link";
import {HtmlModalDialog} from "./HtmlModalDialog";
import {HtmlAreaAnchor} from "./HtmlModalDialog";

export class LinkModalDialog extends HtmlModalDialog {
        private dockedPanel: DockedPanel;
        private link: HTMLElement;
        private linkText: string;
        private anchorList: string[];
        private onlyTextSelected: boolean;

        private content: ContentSummary;

        private static tabNames: any = {
            content: "Content",
            url: "URL",
            download: "Download",
            email: "Email",
            anchor: "Anchor"
        };

        private static contentPrefix = "content://";
        private static downloadPrefix = "media://download/";
        private static emailPrefix = "mailto:";
        private static subjectPrefix = "?subject=";

        constructor(config: HtmlAreaAnchor, content: ContentSummary) {
            this.link = config.element;
            this.linkText = config.text;
            this.anchorList = config.anchorList;
            this.onlyTextSelected = config.onlyTextSelected;

            this.content = content;

            super(config.editor, new ModalDialogHeader("Insert Link"), "link-modal-dialog");
        }

        private getHref(): string {
            return this.link ? this.link.getAttribute("href") : StringHelper.EMPTY_STRING;
        }

        private getLinkText(): string {
            return this.link ? this.link["text"] : this.linkText;
        }

        private getToolTip(): string {
            return this.link ? this.link.getAttribute("title") : StringHelper.EMPTY_STRING;
        }

        private isContentLink(): boolean {
            return this.getHref().indexOf(LinkModalDialog.contentPrefix) === 0;
        }

        private getContentId(): string {
            if (this.link && this.isContentLink()) {
                return this.getHref().replace(LinkModalDialog.contentPrefix, StringHelper.EMPTY_STRING);
            }
            return StringHelper.EMPTY_STRING;
        }

        private isDownloadLink(): boolean {
            return this.getHref().indexOf(LinkModalDialog.downloadPrefix) === 0;
        }

        private getDownloadId(): string {
            return this.isDownloadLink() ?
                   this.getHref().replace(LinkModalDialog.downloadPrefix, StringHelper.EMPTY_STRING) :
                   StringHelper.EMPTY_STRING;
        }

        private isUrl(): boolean {
            return this.link ? !(this.isContentLink() || this.isDownloadLink() || this.isEmail()) : false;
        }

        private getUrl(): string {
            return this.isUrl() ? this.getHref() : StringHelper.EMPTY_STRING;
        }

        private isEmail(): boolean {
            return this.getHref().indexOf(LinkModalDialog.emailPrefix) === 0;
        }

        private getEmail(): string {
            if (!this.isEmail()) {
                return StringHelper.EMPTY_STRING;
            }
            var emailArr = this.getHref().split(LinkModalDialog.subjectPrefix);
            return emailArr[0].replace(LinkModalDialog.emailPrefix, StringHelper.EMPTY_STRING);
        }

        private isAnchor(): boolean {
            return this.getHref().indexOf("#") === 0;
        }

        private getAnchor(): string {
            return this.isAnchor() ? this.getHref() : StringHelper.EMPTY_STRING;
        }

        private getSubject(): string {
            if (!this.isEmail() || this.getHref().indexOf(LinkModalDialog.subjectPrefix) == -1) {
                return StringHelper.EMPTY_STRING;
            }
            var emailArr = this.getHref().split(LinkModalDialog.subjectPrefix);
            return decodeURI(emailArr[1].replace(LinkModalDialog.subjectPrefix, StringHelper.EMPTY_STRING));
        }

        protected layout() {
            super.layout();
            this.appendChildToContentPanel(this.dockedPanel = this.createDockedPanel());

            this.getMainForm().onValidityChanged(() => {
                this.centerMyself();
            });

            this.dockedPanel.getDeck().onPanelShown(() => {
                this.centerMyself();
            })

        }

        private createContentPanel(): Panel {
            return this.createFormPanel([
                this.createContentSelector("contentId", "Target", this.getContentId()),
                this.createTargetCheckbox("contentTarget", this.isContentLink())
            ]);
        }

        private createDownloadPanel(): Panel {
            return this.createFormPanel([
                this.createContentSelector("downloadId", "Target", this.getDownloadId(), ContentTypeName.getMediaTypes())
            ]);
        }

        private createUrlPanel(): Panel {
            return this.createFormPanel([
                this.createFormItem("url", "Url", Validators.required, this.getUrl()),
                this.createTargetCheckbox("urlTarget", this.isUrl())
            ]);
        }

        private createAnchorPanel(): Panel {
            return this.createFormPanel([
                this.createAnchorDropdown()
            ]);
        }

        private createEmailPanel(): Panel {
            var emailFormItem: FormItem = this.createFormItem("email", "Email", LinkModalDialog.validationRequiredEmail, this.getEmail());

            emailFormItem.getLabel().addClass("required");

            return this.createFormPanel([
                emailFormItem,
                this.createFormItem("subject", "Subject", null, this.getSubject())
            ]);
        }

        private static validationRequiredEmail(input: FormInputEl): string {
            var isValid;

            if (!(isValid = Validators.required(input))) {
                isValid = Validators.validEmail(input);
            }

            return isValid;
        }

        private getTarget(isTabSelected: boolean): boolean {
            return isTabSelected ? !StringHelper.isBlank(this.link.getAttribute("target")) : false;
        }

        private createTargetCheckbox(id: string, isTabSelected: boolean): FormItem {
            var checkbox = Checkbox.create().setLabelText("Open in new tab").setChecked(
                this.getTarget(isTabSelected)).setLabelPosition(LabelPosition.LEFT).build();

            return this.createFormItem(id, null, null, null, checkbox);
        }

        protected getMainFormItems(): FormItem [] {
            var items = [];
            if (this.onlyTextSelected) {
                var linkTextFormItem = this.createFormItem("linkText", "Text", Validators.required, this.getLinkText());
                this.setFirstFocusField(linkTextFormItem.getInput());

                items.push(linkTextFormItem);
            }

            items.push(this.createFormItem("toolTip", "Tooltip", null, this.getToolTip()));

            return items;
        }

        private createDockedPanel(): DockedPanel {
            var dockedPanel = new DockedPanel();
            dockedPanel.addItem(LinkModalDialog.tabNames.content, true, this.createContentPanel());
            dockedPanel.addItem(LinkModalDialog.tabNames.url, true, this.createUrlPanel(), this.isUrl());
            dockedPanel.addItem(LinkModalDialog.tabNames.download, true, this.createDownloadPanel(), this.isDownloadLink());
            dockedPanel.addItem(LinkModalDialog.tabNames.email, true, this.createEmailPanel(), this.isEmail());
            if (this.anchorList.length) {
                dockedPanel.addItem(LinkModalDialog.tabNames.anchor, true, this.createAnchorPanel(), this.isAnchor());
            }

            dockedPanel.getDeck().getPanels().forEach((panel) => {
                (<Form>panel.getFirstChild()).onValidityChanged(() => {
                    this.centerMyself();
                })
            });

            return dockedPanel;
        }

        protected initializeActions() {
            var submitAction = new Action(this.link ? "Update" : "Insert");
            this.setSubmitAction(submitAction);

            this.addAction(submitAction.onExecuted(() => {
                if (this.validate()) {
                    this.createLink();
                    this.close();
                }
            }));

            super.initializeActions();
        }

        private createContentSelector(id: string, label: string, value: string,
                                      contentTypeNames?: ContentTypeName[]): FormItem {
            let loader = new ContentSummaryLoader();
            loader.setContentPath(this.content.getPath());

            let contentSelector = ContentComboBox.create().setLoader(loader).setMaximumOccurrences(1).build(),
                contentSelectorComboBox = contentSelector.getComboBox();

            contentSelectorComboBox.onValueChanged(() => {
                this.centerMyself();
            })

            if (contentTypeNames) {
                loader.setAllowedContentTypeNames(contentTypeNames);
            }

            contentSelectorComboBox.onExpanded((event: DropdownExpandedEvent) => {
                this.adjustDropDown(contentSelectorComboBox.getInput(), event.getDropdownElement().getEl());
            });


            contentSelectorComboBox.onKeyDown((e: KeyboardEvent) => {
                if (KeyHelper.isEscKey(e) && !contentSelectorComboBox.isDropdownShown()) {
                    // Prevent modal dialog from closing on Esc key when dropdown is expanded
                    e.preventDefault();
                    e.stopPropagation();
                }
            });

            return this.createFormItem(id, label, Validators.required, value, <FormItemEl>contentSelector);
        }

        private createAnchorDropdown(): FormItem {
            var dropDown = new DropdownInput<string>(name, <DropdownConfig<string>>{});

            this.anchorList.forEach((anchor: string) => {
                dropDown.addOption(<Option<string>>{value: "#" + anchor, displayValue: anchor});
            });

            dropDown.onExpanded((event: DropdownExpandedEvent) => {
                this.adjustDropDown(dropDown, event.getDropdownElement().getEl());
            });

            if (this.getAnchor()) {
                dropDown.setValue(this.getAnchor());
            }

            return this.createFormItem("anchor", "Anchor", Validators.required, null, <FormItemEl>dropDown);
        }

        private adjustDropDown(inputElement: Element, dropDownElement: ElementHelper) {
            var inputPosition = wemjq(inputElement.getHTMLElement()).offset();

            dropDownElement.setMaxWidthPx(inputElement.getEl().getWidthWithBorder());
            dropDownElement.setTopPx(inputPosition.top + inputElement.getEl().getHeightWithBorder() - 1);
            dropDownElement.setLeftPx(inputPosition.left);
        }

        private validateDockPanel(): boolean {
            var form = <Form>this.dockedPanel.getDeck().getPanelShown().getFirstChild();

            return form.validate(true).isValid();
        }

        protected validate(): boolean {
            var mainFormValid = super.validate();
            var dockPanelValid = this.validateDockPanel();

            return mainFormValid && dockPanelValid;
        }

        private createContentLink(): AEl {
            var contentSelector = <ContentComboBox>this.getFieldById("contentId"),
                targetCheckbox = <Checkbox>this.getFieldById("contentTarget");

            var linkEl = new AEl();
            linkEl.setUrl(LinkModalDialog.contentPrefix + contentSelector.getValue(), targetCheckbox.isChecked() ? "_blank" : null);

            return linkEl;
        }

        private createDownloadLink(): AEl {
            var contentSelector = <ContentComboBox>this.getFieldById("downloadId");

            var linkEl = new AEl();
            linkEl.setUrl(LinkModalDialog.downloadPrefix + contentSelector.getValue());

            return linkEl;
        }

        private createUrlLink(): AEl {
            var url = (<TextInput>this.getFieldById("url")).getValue(),
                targetCheckbox = <Checkbox>this.getFieldById("urlTarget");

            var linkEl = new AEl();
            linkEl.setUrl(url, targetCheckbox.isChecked() ? "_blank" : null);

            return linkEl;
        }

        private createAnchor(): AEl {
            var anchorName = (<TextInput>this.getFieldById("anchor")).getValue();

            var linkEl = new AEl();
            linkEl.setUrl(anchorName);

            return linkEl;
        }

        private createEmailLink(): AEl {
            var email = (<TextInput>this.getFieldById("email")).getValue(),
                subject = (<TextInput>this.getFieldById("subject")).getValue();

            var linkEl = new AEl();
            linkEl.setUrl(LinkModalDialog.emailPrefix + email + (subject ? LinkModalDialog.subjectPrefix + encodeURI(subject) : ""));

            return linkEl;
        }

        private createLink(): void {
            var linkEl: AEl,
                deck = <NavigatedDeckPanel>this.dockedPanel.getDeck(),
                selectedTab = <TabBarItem>deck.getSelectedNavigationItem(),
                linkText: string = this.onlyTextSelected ? (<TextInput>this.getFieldById("linkText")).getValue() : "",
                toolTip: string = (<TextInput>this.getFieldById("toolTip")).getValue();

            switch (selectedTab.getLabel()) {
            case (LinkModalDialog.tabNames.content):
                linkEl = this.createContentLink();
                break;
            case (LinkModalDialog.tabNames.url):
                linkEl = this.createUrlLink();
                break;
            case (LinkModalDialog.tabNames.download):
                linkEl = this.createDownloadLink();
                break;
            case (LinkModalDialog.tabNames.email):
                linkEl = this.createEmailLink();
                break;
            case (LinkModalDialog.tabNames.anchor):
                linkEl = this.createAnchor();
                break;
            }

            linkEl.setHtml(linkText);
            if (toolTip) {
                linkEl.setTitle(toolTip);
            }

            if (this.link) {
                this.link.parentElement.replaceChild(linkEl.getHTMLElement(), this.link);
            }
            else {
                if (this.onlyTextSelected) {
                    this.getEditor().insertContent(linkEl.toString());
                }
                else {
                    var linkAttrs = {
                        href: linkEl.getHref(),
                        target: linkEl.getTarget() ? linkEl.getTarget() : null,
                        rel: null,
                        "class": null,
                        title: linkEl.getTitle()
                    };

                    this.getEditor().execCommand('mceInsertLink', false, linkAttrs);
                }
            }
        }

    }
