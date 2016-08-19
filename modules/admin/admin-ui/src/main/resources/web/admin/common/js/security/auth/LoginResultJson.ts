import {UserJson} from "../UserJson";

export interface LoginResultJson {

        authenticated: boolean;

        user: UserJson;

        principals: string[];

        message?: string;
    }
