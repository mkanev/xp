import {ContentMetadata} from "../../ContentMetadata";

export interface ListContentResult<T> {

        contents: T[];

        metadata: ContentMetadata;
    }
