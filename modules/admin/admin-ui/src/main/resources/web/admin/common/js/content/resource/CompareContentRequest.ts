import {CompareContentResults} from "./result/CompareContentResults";
import {CompareContentResultsJson} from "../json/CompareContentResultsJson";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentSummary} from "../ContentSummary";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class CompareContentRequest extends ContentResourceRequest<CompareContentResultsJson, CompareContentResults> {

        private ids: string[];

        constructor(ids: string[]) {
            super();
            super.setMethod("POST");
            this.ids = ids;
        }

        static fromContentSummaries(contentSummaries: ContentSummary[]): CompareContentRequest {

            var ids: string[] = [];

            contentSummaries.forEach((contentSummary: ContentSummary) => {

                ids.push(contentSummary.getContentId().toString());
            });

            return new CompareContentRequest(ids);
        }

        getParams(): Object {
            return {
                ids: this.ids
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "compare");
        }

        sendAndParse(): wemQ.Promise<CompareContentResults> {
            return this.send().then((response: JsonResponse<CompareContentResultsJson>) => {
                return this.fromJsonToCompareResults(response.getResult());
            });
        }

        fromJsonToCompareResults(json: CompareContentResultsJson): CompareContentResults {
            return CompareContentResults.fromJson(json);
        }
    }
