import {Element} from "../dom/Element";
import {NewElementBuilder} from "../dom/Element";

/**
     * An abstract class capable of viewing a given object.
     */
    export class Viewer<OBJECT> extends Element {

        private object: OBJECT;

        constructor(className?: string) {
            super(new NewElementBuilder().
                setTagName("div").
                setClassName('viewer ' + (className || '')).
                setGenerateId(false));
        }


        doRender(): Q.Promise<boolean> {
            return super.doRender().then((rendered) => {
                this.doLayout(this.getObject());
                return rendered;
            });
        }

        /*
         Need a sync method (instead of async doRender) to use in grid formatters which use viewer.toString()
         */
        protected doLayout(object: OBJECT): void {

        }

        setObject(object: OBJECT): void {
            this.object = object;

            if(this.isRendered()) {
                this.doLayout(object);
            }
        }

        getObject(): OBJECT {
            return this.object;
        }

        getPreferredHeight(): number {
            throw new Error("Must be implemented by inheritors");
        }

        toString(): string {
            if(!this.isRendered()) {
                this.doLayout(this.getObject());
            }
            return super.toString();
        }
    }
