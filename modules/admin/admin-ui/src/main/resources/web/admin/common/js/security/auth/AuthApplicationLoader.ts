import {BaseLoader} from "../../util/loader/BaseLoader";
import {ApplicationListResult} from "../../application/ApplicationListResult";
import {Application} from "../../application/Application";
import {ListAuthApplicationsRequest} from "../../application/ListAuthApplicationsRequest";

export class AuthApplicationLoader extends BaseLoader<ApplicationListResult, Application> {

        constructor() {
            super(new ListAuthApplicationsRequest());
        }

        filterFn(application: Application) {
            return application.getDisplayName().toString().toLowerCase().indexOf(this.getSearchString().toLowerCase()) != -1;
        }
    }
