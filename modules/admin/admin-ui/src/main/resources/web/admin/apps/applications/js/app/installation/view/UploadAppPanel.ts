import {ApplicationUploaderEl} from "../../../../../../common/js/application/ApplicationUploaderEl";
import {InputEl} from "../../../../../../common/js/dom/InputEl";
import {FileUploadStartedEvent} from "../../../../../../common/js/ui/uploader/FileUploadStartedEvent";
import {Action} from "../../../../../../common/js/ui/Action";
import {Panel} from "../../../../../../common/js/ui/panel/Panel";

import {ApplicationInput} from "./ApplicationInput";

export class UploadAppPanel extends Panel {

    private cancelAction: Action;
    
    private applicationInput: ApplicationInput;

    constructor(cancelAction: Action, className?: string) {
        super(className);

        this.cancelAction = cancelAction;

        this.onShown(() => {
            this.applicationInput.giveFocus();
        });
    }

    getApplicationInput(): ApplicationInput {
        return this.applicationInput;
    }

    doRender(): Q.Promise<boolean> {
        return super.doRender().then((rendered) => {

            this.applicationInput = new ApplicationInput(this.cancelAction, 'large').
                setPlaceholder("Paste link or drop files here");
    
            this.appendChild(this.applicationInput);
            
            return rendered;
        });
    }
}
