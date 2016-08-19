import {PrincipalJson} from "../PrincipalJson";

export interface AccessControlEntryJson {

        principal: PrincipalJson;

        allow: string[];

        deny: string[];

        // inherited?: boolean;

    }
