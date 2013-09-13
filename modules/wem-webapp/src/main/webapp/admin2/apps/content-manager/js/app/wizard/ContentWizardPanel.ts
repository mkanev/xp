module app_wizard {

    export class ContentWizardPanel extends api_app_wizard.WizardPanel {

        public static NEW_WIZARD_HEADER = "New Content";

        private static DEFAULT_CONTENT_ICON_URL:string = api_util.getAbsoluteUri("resources/images/default_content.png");

        private persistedContent:api_content.Content;

        private parentContent:api_content.Content;

        private renderingNew:boolean;

        private contentType:api_schema_content.ContentType;

        private duplicateAction:api_ui.Action;

        private deleteAction:api_ui.Action;

        private formIcon:api_app_wizard.FormIcon;

        private contentWizardHeader:api_app_wizard.WizardHeaderWithDisplayNameAndName;

        private contentForm:ContentForm;

        private schemaPanel:api_ui.Panel;

        private modulesPanel:api_ui.Panel;

        private templatesPanel:api_ui.Panel;

        constructor(contentType:api_schema_content.ContentType, parentContent:api_content.Content) {

            this.parentContent = parentContent;
            this.contentType = contentType;
            this.contentWizardHeader = new api_app_wizard.WizardHeaderWithDisplayNameAndName();
            this.formIcon = new api_app_wizard.FormIcon(ContentWizardPanel.DEFAULT_CONTENT_ICON_URL, "Click to upload icon", "rest/upload");

            var closeAction = new api_app_wizard.CloseAction(this);
            var saveAction = new api_app_wizard.SaveAction(this);

            this.duplicateAction = new DuplicateContentAction();
            this.deleteAction = new DeleteContentAction();

            var toolbar = new ContentWizardToolbar({
                saveAction: saveAction,
                duplicateAction: this.duplicateAction,
                deleteAction: this.deleteAction,
                closeAction: closeAction
            });

            var livePanel = new LiveFormPanel();

            super({
                formIcon: this.formIcon,
                toolbar: toolbar,
                header: this.contentWizardHeader,
                livePanel: livePanel
            });

            this.contentWizardHeader.setDisplayName(ContentWizardPanel.NEW_WIZARD_HEADER);
            this.contentWizardHeader.setName(this.contentWizardHeader.generateName(ContentWizardPanel.NEW_WIZARD_HEADER));
            this.contentWizardHeader.setAutogenerateDisplayName(true);
            this.contentWizardHeader.setAutogenerateName(true);

            console.log("ContentWizardPanel this.contentType: ", this.contentType);
            this.contentForm = new ContentForm(this.contentType.getForm());

            this.schemaPanel = new api_ui.Panel("schemaPanel");
            var h1El = new api_dom.H1El();
            h1El.getEl().setInnerHtml("TODO: schema");
            this.schemaPanel.appendChild(h1El);

            this.modulesPanel = new api_ui.Panel("modulesPanel");
            h1El = new api_dom.H1El();
            h1El.getEl().setInnerHtml("TODO: modules");
            this.modulesPanel.appendChild(h1El);

            this.templatesPanel = new api_ui.Panel("templatesPanel");
            h1El = new api_dom.H1El();
            h1El.getEl().setInnerHtml("TODO: templates");
            this.templatesPanel.appendChild(h1El);

            this.addStep(new api_app_wizard.WizardStep("Content"), this.contentForm);
            this.addStep(new api_app_wizard.WizardStep("Schemas"), this.schemaPanel);
            this.addStep(new api_app_wizard.WizardStep("Modules"), this.modulesPanel);
            this.addStep(new api_app_wizard.WizardStep("Templates"), this.templatesPanel);

            ShowContentLiveEvent.on((event) => {
                this.toggleFormPanel(false);
            });

            ShowContentFormEvent.on((event) => {
                this.toggleFormPanel(true);
            });
        }

        renderNew() {
            this.contentForm.renderNew();
            this.renderingNew = true;
        }

        setPersistedItem(content:api_content.Content) {
            super.setPersistedItem(content);
            this.persistedContent = content;
            this.renderingNew = false;

            this.contentWizardHeader.setDisplayName(content.getDisplayName());
            this.contentWizardHeader.setName(content.getName());
            this.formIcon.setSrc(content.getIconUrl());

            // setup displayName and name to be generated automatically
            // if corresponding values are empty
            this.contentWizardHeader.setAutogenerateDisplayName(!content.getDisplayName());
            this.contentWizardHeader.setAutogenerateName(!content.getName());

            console.log("ContentWizardPanel.renderExisting contentData: ", content.getContentData());

            var contentData:api_content.ContentData = content.getContentData();

            this.contentForm.renderExisting(contentData);
        }

        persistNewItem(successCallback?:() => void) {

            var flattenedContentData:any = {};
            this.flattenData(this.contentForm.getContentData(), flattenedContentData);
            console.log("persistNewItem flattenedContentData: ", flattenedContentData);

            new api_content.CreateContentRequest().
                setContentName(this.contentWizardHeader.getName()).
                setParentContentPath(this.parentContent.getPath().toString()).
                setContentType(this.contentType.getQualifiedName()).
                setDisplayName(this.contentWizardHeader.getDisplayName()).
                setContentData(flattenedContentData).
                send().done((createResponse:api_rest.JsonResponse) => {
                    api_notify.showFeedback('Content was created!');
                    console.log('content create response', createResponse);

                    if (successCallback) {
                        successCallback.call(this);
                    }
                });
        }

        updatePersistedItem(successCallback?:() => void) {

            var flattenedContentData:any = {};
            this.flattenData(this.contentForm.getContentData(), flattenedContentData);
            console.log("updatePersistedItem flattenedContentData: ", flattenedContentData);

            new api_content.UpdateContentRequest(this.persistedContent.getId()).
                setContentName(this.contentWizardHeader.getName()).
                setContentType(this.contentType.getQualifiedName()).
                setDisplayName(this.contentWizardHeader.getDisplayName()).
                setContentData(flattenedContentData).
                send().done((updateResponse:api_rest.JsonResponse) => {
                    api_notify.showFeedback('Content was updated!');
                    console.log('content update response', updateResponse);

                    if (successCallback) {
                        successCallback.call(this);
                    }
                });
        }

        private flattenData(contentData:api_data.DataSet, result:any) {
            contentData.getDataArray().forEach((data:api_data.Data) => {
                if (data instanceof api_data.Property) {
                    var property:api_data.Property = <api_data.Property>data;
                    result[data.getId().toString()] = property.getValue();
                }
                else if (data instanceof api_data.DataSet) {
                    var dataSet = <api_data.DataSet>data;
                    this.flattenData(dataSet, result);
                }
            });
        }
    }

    class LiveFormPanel extends api_ui.Panel {

        private frame:api_dom.IFrameEl;

        constructor(url?:string) {
            super("LiveFormPanel");
            this.addClass("live-form-panel");
            this.frame = new api_dom.IFrameEl();
            this.appendChild(this.frame);
            this.frame.setSrc("../../../dev/live-edit-page/bootstrap.jsp?edit=true");
        }

    }
}