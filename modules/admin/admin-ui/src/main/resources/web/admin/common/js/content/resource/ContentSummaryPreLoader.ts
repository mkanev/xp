import {ContentQueryResultJson} from "../json/ContentQueryResultJson";
import {ContentSummaryJson} from "../json/ContentSummaryJson";
import {BaseLoader} from "../../util/loader/BaseLoader";
import {ResourceRequest} from "../../rest/ResourceRequest";
import {ContentId} from "../ContentId";
import {ContentSummary} from "../ContentSummary";
import {GetContentSummaryByIds} from "./GetContentSummaryByIds";

export class ContentSummaryPreLoader extends BaseLoader<ContentQueryResultJson<ContentSummaryJson>, ContentSummary> {

        constructor(request: ResourceRequest<ContentQueryResultJson<ContentSummaryJson>, ContentSummary[]>) {
            super(request);
        }

        preLoad(ids: string): wemQ.Promise<ContentSummary[]> {
            this.notifyLoadingData(false);

            let contentIds = ids.split(";").map((id) => {
                return new ContentId(id);
            });
            return new GetContentSummaryByIds(contentIds).sendAndParse().then((results: ContentSummary[]) => {
                if (this.getComparator()) {
                    this.setResults(results.sort(this.getComparator().compare));
                } else {
                    this.setResults(results);
                }
                this.notifyLoadedData(results);
                return this.getResults();
            });
        }
    }


