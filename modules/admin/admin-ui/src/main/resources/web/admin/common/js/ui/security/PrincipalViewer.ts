import {Principal} from "../../security/Principal";
import {PrincipalType} from "../../security/PrincipalType";
import {NamesAndIconViewer} from "../NamesAndIconViewer";

export class PrincipalViewer extends NamesAndIconViewer<Principal> {

        private removeClickedListeners: {(event: MouseEvent):void}[] = [];

        constructor() {
            super();
        }

        resolveDisplayName(object: Principal): string {
            return object.getDisplayName();
        }

        resolveUnnamedDisplayName(object: Principal): string {
            return object.getTypeName();
        }

        resolveSubName(object: Principal, relativePath: boolean = false): string {
            return object.getKey().toPath();
        }

        resolveIconClass(object: Principal): string {
            switch (object.getKey().getType()) {
            case PrincipalType.USER:
                return "icon-user";
            case PrincipalType.GROUP:
                return "icon-users";
            case PrincipalType.ROLE:
                return "icon-masks";
            }

            return "";
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
