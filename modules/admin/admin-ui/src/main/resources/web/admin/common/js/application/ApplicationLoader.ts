import {LoadedDataEvent} from "../util/loader/event/LoadedDataEvent";
import {LoadingDataEvent} from "../util/loader/event/LoadingDataEvent";
import {BaseLoader} from "../util/loader/BaseLoader";
import {Application} from "./Application";
import {ApplicationListResult} from "./ApplicationListResult";
import {ListApplicationsRequest} from "./ListApplicationsRequest";

export class ApplicationLoader extends BaseLoader<ApplicationListResult, Application> {

        private listApplicationsRequest: ListApplicationsRequest;

        private filterObject: Object;

        constructor(delay: number = 500, filterObject: Object = null) {
            super(this.listApplicationsRequest = new ListApplicationsRequest());
            if (filterObject) {
                this.filterObject = filterObject;
            }
        }

        search(searchString: string): wemQ.Promise<Application[]> {
            this.listApplicationsRequest.setSearchQuery(searchString);
            return this.load();
        }

        load(): wemQ.Promise<Application[]> {
            var me = this;
            me.notifyLoadingData();

            return me.sendRequest()
                .then((applications: Application[]) => {
                    if (me.filterObject) {
                        applications = applications.filter(me.filterResults, me);
                    }
                    me.notifyLoadedData(applications);

                    return applications;
                });
        }

        private filterResults(application: Application): boolean {
            if (!this.filterObject) {
                return true;
            }

            var result = true;
            for (var name in this.filterObject) {
                if (this.filterObject.hasOwnProperty(name)) {
                    if (!application.hasOwnProperty(name) || this.filterObject[name] != application[name]) {
                        result = false;
                    }
                }
            }

            return result;
        }

    }
