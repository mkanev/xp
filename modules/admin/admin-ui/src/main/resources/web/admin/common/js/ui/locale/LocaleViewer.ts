import {Locale} from "../../locale/Locale";
import {Viewer} from "../Viewer";
import {NamesView} from "../../app/NamesView";
import {StringHelper} from "../../util/StringHelper";

export class LocaleViewer extends Viewer<Locale> {

        private namesView: NamesView;

        private removeClickedListeners: {(event: MouseEvent):void}[] = [];

        private displayNamePattern = '{0} ({1})';

        constructor() {
            super();
            this.namesView = new NamesView();
            this.appendChild(this.namesView);
        }

        setObject(locale: Locale) {
            this.namesView.setMainName(StringHelper.format(this.displayNamePattern, locale.getDisplayName(), locale.getTag()));

            return super.setObject(locale);
        }

        getPreferredHeight(): number {
            return 30;
        }

        onRemoveClicked(listener: (event: MouseEvent) => void) {
            this.removeClickedListeners.push(listener);
        }

        unRemoveClicked(listener: (event: MouseEvent) => void) {
            this.removeClickedListeners = this.removeClickedListeners.filter((current) => {
                return current !== listener;
            })
        }

        notifyRemoveClicked(event: MouseEvent) {
            this.removeClickedListeners.forEach((listener) => {
                listener(event);
            })
        }
    }
