import {ContentMetadata} from "../../ContentMetadata";

export interface BatchContentResult<T> {

        contents: T[];

        metadata: ContentMetadata;
    }
