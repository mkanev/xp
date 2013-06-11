module app {

    export class NewContentAction extends api_action.Action {

        constructor() {
            super("New");
            this.addExecutionListener(() => {
                console.log('TODO: New content');
            });
        }
    }

    export class OpenContentAction extends api_action.Action {

        constructor() {
            super("Open");
            this.setEnabled(false);
            this.addExecutionListener(() => {
                console.log('TODO: Open content');
            });
        }
    }

    export class EditContentAction extends api_action.Action {

        constructor() {
            super("Edit");
            this.setEnabled(false);
            this.addExecutionListener(() => {
                console.log('TODO: Edit content');
            });
        }
    }

    export class DeleteContentAction extends api_action.Action {

        constructor() {
            super("Delete");
            this.setEnabled(false);
            this.addExecutionListener(() => {
                console.log('TODO: Delete content');
            });
        }
    }

    export class DuplicateContentAction extends api_action.Action {

        constructor() {
            super("Duplicate");
            this.setEnabled(false);
            this.addExecutionListener(() => {
                console.log('TODO: Duplicate content');
            });
        }
    }

    export class MoveContentAction extends api_action.Action {

        constructor() {
            super("Move");
            this.setEnabled(false);
            this.addExecutionListener(() => {
                console.log('TODO: Move content');
            });
        }
    }

    export class BrowseContentSettingsAction extends api_action.Action {

        constructor() {
            super("");
            this.setEnabled(true);
            this.setIconClass('icon-toolbar-settings');
            this.addExecutionListener(() => {
                console.log('TODO: browse content settings');
            });
        }
    }

    export class ContentActions {

        static NEW_CONTENT:api_action.Action = new NewContentAction();
        static OPEN_CONTENT:api_action.Action = new OpenContentAction;
        static EDIT_CONTENT:api_action.Action = new EditContentAction();
        static DELETE_CONTENT:api_action.Action = new DeleteContentAction();
        static DUPLICATE_CONTENT:api_action.Action = new DuplicateContentAction();
        static MOVE_CONTENT:api_action.Action = new MoveContentAction();
        static BROWSE_CONTENT_SETTINGS:api_action.Action = new BrowseContentSettingsAction();

        static init() {

            app_event.GridSelectionChangeEvent.on((event) => {

                var contents:api_model.ContentModel[] = event.getModels();

                if (contents.length <= 0) {
                    NEW_CONTENT.setEnabled(true);
                    OPEN_CONTENT.setEnabled(false);
                    EDIT_CONTENT.setEnabled(false);
                    DELETE_CONTENT.setEnabled(false);
                    DUPLICATE_CONTENT.setEnabled(false);
                    MOVE_CONTENT.setEnabled(false);
                }
                else if (contents.length == 1) {
                    NEW_CONTENT.setEnabled(false);
                    OPEN_CONTENT.setEnabled(true);
                    EDIT_CONTENT.setEnabled(contents[0].data.editable);
                    DELETE_CONTENT.setEnabled(contents[0].data.deletable);
                    DUPLICATE_CONTENT.setEnabled(true);
                    MOVE_CONTENT.setEnabled(true);
                }
                else {
                    NEW_CONTENT.setEnabled(false);
                    OPEN_CONTENT.setEnabled(true);
                    EDIT_CONTENT.setEnabled(anyEditable(contents));
                    DELETE_CONTENT.setEnabled(anyDeleteable(contents));
                    DUPLICATE_CONTENT.setEnabled(true);
                    MOVE_CONTENT.setEnabled(true);
                }
            });
        }

        static anyEditable(contents:api_model.ContentModel[]):bool {
            for (var i in contents) {
                var content:api_model.ContentModel = contents[i];
                if (content.data.editable) {
                    return true;
                }
            }
            return false;
        }

        static anyDeleteable(contents:api_model.ContentModel[]):bool {
            for (var i in contents) {
                var content:api_model.ContentModel = contents[i];
                if (content.data.deletable) {
                    return true;
                }
            }
            return false;
        }
    }
}
