module api_remote {

    export interface Account {
        key: string;
        type: string;
        name: string;
        userStore: string;
        qualifiedName: string;
        builtIn: bool;
        displayName: string;
        modifiedTime: Date;
        createdTime: Date;
        editable: bool;
        deleted: bool;
        image_url: string;
        email?: string;
    }

    export interface AccountFacet {
        name: string;
        terms: AccountFacetEntry[];
    }

    export interface AccountFacetEntry {
        name: string;
        count: number;
    }

    export interface UserProfile {
        country?: string;
        fax?: string;
        description?: string;
        firstName?: string;
        globalPosition?: string;
        homePage?: string;
        initials?: string;
        lastName?: string;
        memberId?: string;
        middleName?: string;
        mobile?: string;
        nickName?: string;
        organization?: string;
        personalId?: string;
        phone?: string;
        prefix?: string;
        suffix?: string;
        title?: string;
        birthday?: Date;
        gender?: string;
        htmlEmail?: bool;
        locale?: string;
        timezone?: string;
        addresses?: Address[];
    }

    export interface Address {
        label?: string;
        country?: string;
        isoCountry?: string;
        region?: string;
        isoRegion?: string;
        postalAddress?: string;
        postalCode?: string;
        street?: string;
    }

    export interface RemoteCallAccountFindParams {
        key?: string[];
        query?: string;
        start?: number;
        limit?: number;
        userstores?: string[];
        sort?: string;
        dir?: string;
        types?: string[];
    }

    export interface RemoteCallAccountFindResult extends RemoteCallResultBase {
        accounts: Account[];
        facets?: AccountFacet[];
        total?: number;
    }

    export interface RemoteCallAccountGetGraphParams {
        key: string;
    }

    export interface RemoteCallAccountGetGraphResult extends RemoteCallResultBase {
        graph: {
            id: string;
            name: string;
            data: {
                type: string;
                key: string;
                image_uri: string;
                name: string;
            };
            adjacencies?: {
                nodeTo: string;
            }[];
        }[];
    }

    export interface RemoteCallAccountChangePasswordParams {
        key: string;
        password: string;
    }

    export interface RemoteCallAccountChangePasswordResult extends RemoteCallResultBase {
    }

    export interface RemoteCallAccountVerifyUniqueEmailParams {
        userStore: string;
        email: string;
    }

    export interface RemoteCallAccountVerifyUniqueEmailResult extends RemoteCallResultBase {
        emailInUse: bool;
        key: string;
    }

    export interface RemoteCallAccountSuggestUserNameParams {
        userStore: string;
        firstName: string;
        lastName: string;
    }

    export interface RemoteCallAccountSuggestUserNameResult extends RemoteCallResultBase {
        username: string;
    }

    export interface RemoteCallAccountCreateOrUpdateParams {
        key: string;
        email?: string;
        imageRef?: string;
        profile?: UserProfile;
        members?: string[];
        displayName: string;
        groups?: string[];
    }

    export interface RemoteCallAccountCreateOrUpdateResult extends RemoteCallResultBase {
        created: bool;
        updated: bool;
    }

    export interface RemoteCallDeleteAccountParams {
        key:string[];
    }

    export interface RemoteCallDeleteAccountResult extends RemoteCallResultBase {
        deleted:number;
    }

    export interface RemoteCallGetAccountParams {
        key:string;
    }

    export interface RemoteCallGetAccountResult extends RemoteCallResultBase, Account {

    }

}