import {Equitable} from "../../Equitable";
import {DivEl} from "../../dom/DivEl";
import {Viewer} from "../../ui/Viewer";
import {BrowseItem} from "./BrowseItem";

export class SelectionItem<M extends Equitable> extends DivEl {

        private viewer: Viewer<M>;

        protected item: BrowseItem<M>;

        private removeEl: DivEl;

        private removeListeners: {(event: MouseEvent): void}[] = [];

        constructor(viewer: Viewer<M>, item: BrowseItem<M>) {
            super("browse-selection-item");
            this.viewer = viewer;
            this.item = item;
        }

        doRender(): Q.Promise<boolean> {
            return super.doRender().then((rendered) => {
                this.removeEl = this.initRemoveButton();
                this.appendChild(this.removeEl);
                this.appendChild(this.viewer);
                return rendered;
            });
        }

        private initRemoveButton(callback?: () => void) {
            var removeEl = new DivEl("icon remove");
            removeEl.onClicked(this.notifyRemoveClicked.bind(this));
            return removeEl;
        }

        onRemoveClicked(listener: (event: MouseEvent) => void) {
            this.removeListeners.push(listener);
        }

        unRemoveClicked(listener: (event: MouseEvent) => void) {
            this.removeListeners = this.removeListeners.filter((current) => {
                return current !== listener;
            })
        }

        notifyRemoveClicked(event: MouseEvent) {
            this.removeListeners.forEach((listener) => {
                listener(event);
            })
        }

        setBrowseItem(item: BrowseItem<M>) {
            this.item = item;
            this.viewer.remove();
            this.viewer.setObject(item.getModel());
            this.appendChild(this.viewer);
        }

        getBrowseItem(): BrowseItem<M> {
            return this.item;
        }

        hideRemoveButton() {
            if (this.isRendered()) {
                this.removeEl.hide();
            } else {
                this.onRendered(() => {
                    this.removeEl.hide();
                });
            }
        }
    }

