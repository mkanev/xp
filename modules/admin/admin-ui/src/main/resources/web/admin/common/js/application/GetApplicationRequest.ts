import {ApplicationJson} from "./json/ApplicationJson";
import {Path} from "../rest/Path";
import {JsonResponse} from "../rest/JsonResponse";
import {Application} from "./Application";
import {ApplicationCache} from "./ApplicationCache";
import {ApplicationKey} from "./ApplicationKey";
import {ApplicationResourceRequest} from "./ApplicationResourceRequest";

export class GetApplicationRequest extends ApplicationResourceRequest<ApplicationJson, Application> {

        private applicationKey: ApplicationKey;

        private skipCache: boolean;

        constructor(applicationKey: ApplicationKey, skipCache: boolean = false) {
            super();
            super.setMethod("GET");
            this.applicationKey = applicationKey;
            this.skipCache = skipCache;
            this.setHeavyOperation(true);
        }

        getParams(): Object {
            return {
                applicationKey: this.applicationKey.toString()
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath());
        }

        sendAndParse(): wemQ.Promise<Application> {

            var cache = ApplicationCache.get();
            var appObj = this.skipCache ? null : cache.getByKey(this.applicationKey);
            if (appObj) {
                return wemQ(appObj);
            }
            else {
                return this.send().then((response: JsonResponse<ApplicationJson>) => {
                    appObj = this.fromJsonToApplication(response.getResult());
                    cache.put(appObj);
                    return appObj;
                });
            }
        }
    }
