import {ContentIdBaseItemJson} from "./ContentIdBaseItemJson";

export interface ResolvePublishContentResultJson {

        dependentContents: ContentIdBaseItemJson[];
        requestedContents: ContentIdBaseItemJson[];
        containsRemovable: boolean;
    }
