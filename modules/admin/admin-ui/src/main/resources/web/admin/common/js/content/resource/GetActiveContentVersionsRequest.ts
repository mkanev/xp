import {ActiveContentVersionJson} from "../json/ActiveContentVersionJson";
import {ContentVersionJson} from "../json/ContentVersionJson";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentId} from "../ContentId";
import {ContentVersion} from "../ContentVersion";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class GetActiveContentVersionsRequest extends ContentResourceRequest<json.GetActiveContentVersionsResultsJson, ContentVersion[]> {

        private id: ContentId;

        constructor(id: ContentId) {
            super();
            super.setMethod("GET");
            this.id = id;
        }

        getParams(): Object {
            return {
                id: this.id.toString()
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), 'getActiveVersions');
        }

        sendAndParse(): wemQ.Promise<ContentVersion[]> {

            return this.send().then((response: JsonResponse<json.GetActiveContentVersionsResultsJson>) => {
                return this.fromJsonToContentVersions(response.getResult().activeContentVersions);
            });
        }

        private fromJsonToContentVersions(json: ActiveContentVersionJson[]): ContentVersion[] {

            var contentVersionJson: ContentVersionJson;
            var contentVersion: ContentVersion;
            var contentVersionsMap: {[id: string]: ContentVersion} = {};

            json.forEach((activeContentVersion: ActiveContentVersionJson) => {

                contentVersionJson = activeContentVersion.contentVersion;

                contentVersion = contentVersionsMap[contentVersionJson.id];
                if (!contentVersion) {
                    contentVersion = ContentVersion.fromJson(contentVersionJson, [activeContentVersion.branch]);
                    contentVersionsMap[contentVersion.id] = contentVersion;
                } else {
                    // just add new workspace if already exists
                    contentVersion.workspaces.push(activeContentVersion.branch);
                }
            });

            return Object.keys(contentVersionsMap).map(function (key) {
                return contentVersionsMap[key];
            });
        }

    }
