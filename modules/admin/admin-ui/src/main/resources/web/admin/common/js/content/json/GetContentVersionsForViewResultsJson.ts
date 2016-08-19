import {ActiveContentVersionJson} from "./ActiveContentVersionJson";
import {ContentVersionViewJson} from "./ContentVersionViewJson";

export interface GetContentVersionsForViewResultsJson {

        from: number;

        size: number;

        hits: number;

        totalHits: number;

        activeVersion: ActiveContentVersionJson;

        contentVersions: ContentVersionViewJson[];
    }
