import {CompareContentResultsJson} from "../../json/CompareContentResultsJson";
import {CompareContentResultJson} from "../../json/CompareContentResultJson";
import {CompareContentResult} from "./CompareContentResult";

export class CompareContentResults {

        private compareContentResults: CompareContentResult[] = [];

        constructor(compareContentResults: CompareContentResult[]) {
            this.compareContentResults = compareContentResults;
        }

        get(contentId: string): CompareContentResult {

            var compareContentResult: CompareContentResult = null;

            this.compareContentResults.forEach((result: CompareContentResult) => {

                if (result.getId() == contentId) {
                    compareContentResult = result;
                }
            });

            return compareContentResult;
        }

        getAll(): CompareContentResult[] {
            return this.compareContentResults;
        }

        static fromJson(json: CompareContentResultsJson): CompareContentResults {

            var list: CompareContentResult[] = [];

            json.compareContentResults.forEach((compareContentResult: CompareContentResultJson) => {
                list.push(CompareContentResult.fromJson(compareContentResult));
            });

            return new CompareContentResults(list);
        }
    }
