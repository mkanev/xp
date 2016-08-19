import {GetContentVersionsForViewResultsJson} from "./json/GetContentVersionsForViewResultsJson";
import {ContentVersionViewJson} from "./json/ContentVersionViewJson";
import {ContentVersion} from "./ContentVersion";

export class ContentVersions {

        private contentVersions: ContentVersion[];

        private activeVersion: ContentVersion;

        getContentVersions(): ContentVersion[] {
            return this.contentVersions;
        }

        getActiveVersion(): ContentVersion {
            return this.activeVersion;
        }

        constructor(contentVersions: ContentVersion[], activeVersion: ContentVersion) {
            this.contentVersions = contentVersions;
            this.activeVersion = activeVersion;
        }

        static fromJson(contentVersionForViewJson: GetContentVersionsForViewResultsJson): ContentVersions {

            var contentVersions: ContentVersion[] = [];
            contentVersionForViewJson.contentVersions.forEach((contentVersionViewJson: ContentVersionViewJson) => {
                contentVersions.push(ContentVersion.fromJson(contentVersionViewJson, contentVersionViewJson.workspaces));
            });

            var activeVersion;
            if (!!contentVersionForViewJson.activeVersion) {
                activeVersion = ContentVersion.fromJson(contentVersionForViewJson.activeVersion.contentVersion,
                    [contentVersionForViewJson.activeVersion.branch]);
            }

            return new ContentVersions(contentVersions, activeVersion);
        }
    }

