module app {

    export class ContentAppPanel extends api_app.AppPanel {

        private browsePanel:app_browse.ContentBrowsePanel;

        private appBarTabMenu:api_app.AppBarTabMenu;

        constructor(appBar:ContentAppBar) {

            this.browsePanel = new app_browse.ContentBrowsePanel();
            this.appBarTabMenu = appBar.getTabMenu();

            super(appBar.getTabMenu(), this.browsePanel, app_browse.ContentBrowseActions.ACTIONS);

            this.handleGlobalEvents();
        }

        private handleGlobalEvents() {

            api_app.ShowAppBrowsePanelEvent.on((event) => {
                this.showHomePanel();
                this.appBarTabMenu.deselectNavigationItem();
            });

            api_ui_tab.TabMenuItemSelectEvent.on((event) => {
                this.appBarTabMenu.hideMenu();
                this.selectPanel(event.getTab());
            });

            api_ui_tab.TabMenuItemCloseEvent.on((event) => {
                var tabIndex = event.getTab().getIndex();
                var panel = this.getPanel(tabIndex);
                new app_browse.CloseContentEvent(panel, true).fire();
            });

            app_new.NewContentEvent.on((event) => {

                var contentType = event.getContentType();

                console.log("NewContentEvent", contentType);
                // TODO: Open wizard for new content of given content type

            });

            app_browse.OpenContentEvent.on((event) => {

                var contents:api_model.ContentExtModel[] = event.getModels();
                for (var i = 0; i < contents.length; i++) {
                    var contentModel:api_model.ContentExtModel = contents[i];

                    var tabMenuItem = new ContentAppBarTabMenuItem(contentModel.data.displayName);
                    var id = this.generateTabId(contentModel.data.name, false);
                    var contentItemViewPanel = new app_view.ContentItemViewPanel(id);

                    var contentItem = new api_app_browse.BrowseItem(contentModel)
                        .setDisplayName(contentModel.data.displayName)
                        .setPath(contentModel.data.name)
                        .setIconUrl(contentModel.data.iconUrl);

                    contentItemViewPanel.setItem(contentItem);

                    this.addNavigationItem(tabMenuItem, contentItemViewPanel);
                    this.selectPanel(tabMenuItem);
                }

            });

            app_browse.EditContentEvent.on((event) => {

                var contents:api_model.ContentExtModel[] = event.getModels();
                for (var i = 0; i < contents.length; i++) {
                    var contentModel:api_model.ContentExtModel = contents[i];

                    //TODO: RemoteCallContentGetResult doesn't match returned result  if 'path' param is used!
                    var contentGetParams:api_remote_content.GetParams = {
                        "contentIds": [contentModel.data.id]
                    };
                    api_remote.RemoteContentService.content_get(contentGetParams, (result:api_remote_content.GetResult) => {

                        if (result && result.success) {

                            var tabMenuItem = new ContentAppBarTabMenuItem(result.content[0].displayName, true);
                            var id = this.generateTabId(result.content[0].name, true);
                            var contentWizardPanel = new app_wizard.ContentWizardPanel(id);
                            contentWizardPanel.setData(result);

                            this.addWizardPanel(tabMenuItem, contentWizardPanel);
                            this.selectPanel(tabMenuItem);
                        } else {
                            console.error("Error", result ? result.error : "Unable to retrieve content.");
                        }
                    });
                }
            });

            app_browse.CloseContentEvent.on((event) => {
                this.removePanel(event.getPanel(), event.isCheckCanRemovePanel());
            });

            api_app_wizard.CloseWizardPanelEvent.on((event) => {
                this.removePanel(event.getWizardPanel(), event.isCheckCanRemovePanel());
            });

        }

        private generateTabId(contentName, isEdit) {
            return 'tab-' + ( isEdit ? 'edit-' : 'preview-') + contentName;
        }
    }

}
