import {MarketApplicationsListJson} from "./json/MarketApplicationsListJson";
import {Path} from "../rest/Path";
import {JsonResponse} from "../rest/JsonResponse";
import {ApplicationResourceRequest} from "./ApplicationResourceRequest";
import {MarketApplication} from "./MarketApplication";
import {MarketApplicationMetadata} from "./MarketApplicationMetadata";
import {MarketApplicationResponse} from "./MarketApplicationResponse";

export class ListMarketApplicationsRequest extends ApplicationResourceRequest<MarketApplicationsListJson, MarketApplicationResponse> {

        private version: string;
        private start: number = 0;
        private count: number = 10;

        constructor() {
            super();
            this.setMethod("POST");
        }

        setVersion(version: string): ListMarketApplicationsRequest {
            this.version = version;
            return this;
        }

        setStart(start: number): ListMarketApplicationsRequest {
            this.start = start;
            return this;
        }

        setCount(count: number): ListMarketApplicationsRequest {
            this.count = count;
            return this;
        }

        getParams(): Object {
            return {
                version: this.version,
                start: this.start,
                count: this.count,
            }
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "getMarketApplications");
        }

        sendAndParse(): wemQ.Promise<MarketApplicationResponse> {
            return this.send().then((response: JsonResponse<MarketApplicationsListJson>) => {
                let applications = MarketApplication.fromJsonArray(response.getResult().hits);
                let hits = applications.length;
                let totalHits = response.getResult().total;
                return new MarketApplicationResponse(applications, new MarketApplicationMetadata(hits, totalHits));
            });
        }
    }
