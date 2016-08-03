module api.material.ui.button {

    import Action = api.ui.Action;

    export class FlatButton extends api.ui.button.ActionButton {

        constructor(action: Action) {
            super(action);
            this.addClass("mdl-button");
            this.removeClass("action-button");
            this.removeClass(api.StyleHelper.getCls("button", api.StyleHelper.COMMON_PREFIX));
        }
    }
}
