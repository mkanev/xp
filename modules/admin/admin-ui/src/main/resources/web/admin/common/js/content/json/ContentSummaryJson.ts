import {ItemJson} from "../../item/ItemJson";
import {ThumbnailJson} from "../../thumb/ThumbnailJson";
import {ChildOrderJson} from "./ChildOrderJson";
import {ContentIdBaseItemJson} from "./ContentIdBaseItemJson";

export interface ContentSummaryJson extends ContentIdBaseItemJson, ItemJson {

        name:string;

        displayName:string;

        path:string;

        isRoot:boolean;

        hasChildren:boolean;

        type:string;

        iconUrl:string;

        thumbnail: ThumbnailJson;

        modifier:string;

        owner:string;

        isPage:boolean;

        isValid:boolean;

        requireValid:boolean;

        childOrder:ChildOrderJson;

        language: string;

        contentState: string;
    }
