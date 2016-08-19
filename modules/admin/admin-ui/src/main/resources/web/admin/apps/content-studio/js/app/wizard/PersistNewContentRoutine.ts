import {CreateContentRequest} from "../../../../../common/js/content/resource/CreateContentRequest";
import {Content} from "../../../../../common/js/content/Content";
import {Flow} from "../../../../../common/js/util/Flow";
import {PromiseHelper} from "../../../../../common/js/util/PromiseHelper";

import {ContentWizardPanel} from "./ContentWizardPanel";

export class PersistedNewContentRoutineContext {

    content: Content = null;
}

export class PersistNewContentRoutine extends Flow<Content,PersistedNewContentRoutineContext> {

    private createContentRequestProducer: {() : wemQ.Promise<CreateContentRequest>; };

    private doneHandledContent = false;

    constructor(thisOfProducer: ContentWizardPanel) {
        super(thisOfProducer);
    }

    public setCreateContentRequestProducer(producer: {() : wemQ.Promise<CreateContentRequest>; }): PersistNewContentRoutine {
        this.createContentRequestProducer = producer;
        return this;
    }

    public execute(): wemQ.Promise<Content> {

        var context = new PersistedNewContentRoutineContext();
        return this.doExecute(context);
    }

    doExecuteNext(context: PersistedNewContentRoutineContext): wemQ.Promise<Content> {

        if (!this.doneHandledContent) {

            return this.doHandleCreateContent(context).then(() => {

                this.doneHandledContent = true;
                return this.doExecuteNext(context);

            });
        }
        else {
            return wemQ(context.content);
        }
    }

    private doHandleCreateContent(context: PersistedNewContentRoutineContext): wemQ.Promise<void> {

        if (this.createContentRequestProducer != undefined) {

            return this.createContentRequestProducer.call(this.getThisOfProducer()).then((createContentRequest: CreateContentRequest) => {

                return createContentRequest.sendAndParse().then((content: Content): void => {

                    context.content = content;

                });
            });
        }
        else {
            return PromiseHelper.newResolvedVoidPromise();
        }
    }
}
