import {PropertyArrayJson} from "../../data/PropertyArrayJson";
import {AttachmentJson} from "../attachment/AttachmentJson";
import {ExtraDataJson} from "./ExtraDataJson";
import {PageJson} from "../page/PageJson";
import {AccessControlEntryJson} from "../../security/acl/AccessControlEntryJson";
import {ContentSummaryJson} from "./ContentSummaryJson";

export interface ContentJson extends ContentSummaryJson {

        data: PropertyArrayJson[];

        attachments: AttachmentJson[];

        meta: ExtraDataJson[];

        page: PageJson;

        permissions: AccessControlEntryJson[];

        inheritPermissions: boolean;
    }
