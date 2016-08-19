import {NamesAndIconViewer} from "../../NamesAndIconViewer";
import {Application} from "../../../application/Application";

export class AuthApplicationViewer extends NamesAndIconViewer<Application> {

        constructor() {
            super();
        }

        resolveDisplayName(object: Application): string {
            return object.getDisplayName();
        }

        resolveSubName(object: Application, relativePath: boolean = false): string {
            return object.getApplicationKey().toString();
        }

        resolveIconClass(object: Application): string {
            return "icon-shield icon-large";
        }
    }
