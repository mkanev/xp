import {AccessControlList} from "../security/acl/AccessControlList";
import {AccessControlEntry} from "../security/acl/AccessControlEntry";
import {Property} from "../data/Property";
import {PropertyTree} from "../data/PropertyTree";
import {PropertyPath} from "../data/PropertyPath";
import {PageTemplateBuilder} from "./page/PageTemplate";
import {SiteBuilder} from "./site/Site";
import {Equitable} from "../Equitable";
import {Cloneable} from "../Cloneable";
import {Attachments} from "./attachment/Attachments";
import {Page} from "./page/Page";
import {assertNotNull} from "../util/Assert";
import {MixinName} from "../schema/mixin/MixinName";
import {PrincipalKey} from "../security/PrincipalKey";
import {Permission} from "../security/acl/Permission";
import {RoleKeys} from "../security/RoleKeys";
import {ExtraDataByMixinNameComparator} from "./util/ExtraDataByMixinNameComparator";
import {ObjectHelper} from "../ObjectHelper";
import {ContentJson} from "./json/ContentJson";
import {ContentTypeName} from "../schema/content/ContentTypeName";
import {AttachmentsBuilder} from "./attachment/Attachments";
import {ExtraDataJson} from "./json/ExtraDataJson";
import {PageBuilder} from "./page/Page";
import {ContentSummary} from "./ContentSummary";
import {ContentSummaryBuilder} from "./ContentSummary";
import {ExtraData} from "./ExtraData";

export class Content extends ContentSummary implements Equitable, Cloneable {

        private data: PropertyTree;

        private attachments: Attachments;

        private extraData: ExtraData[] = [];

        private pageObj: Page;

        private permissions: AccessControlList;

        private inheritPermissions: boolean;

        constructor(builder: ContentBuilder) {
            super(builder);

            assertNotNull(builder.data, "data is required for Content");
            this.data = builder.data;
            this.attachments = builder.attachments;
            this.extraData = builder.extraData || [];
            this.pageObj = builder.pageObj;
            this.permissions = builder.permissions || new AccessControlList();
            this.inheritPermissions = builder.inheritPermissions;
        }

        getContentData(): PropertyTree {
            return this.data;
        }

        getAttachments(): Attachments {
            return this.attachments;
        }

        getExtraData(name: MixinName): ExtraData {
            return this.extraData.filter((item: ExtraData) => item.getName().equals(name))[0];
        }

        getAllExtraData(): ExtraData[] {
            return this.extraData;
        }

        getProperty(propertyName: string): Property {
            return !!propertyName ? this.data.getProperty(propertyName) : null;
        }

        getPage(): Page {
            return this.pageObj;
        }

        getPermissions(): AccessControlList {
            return this.permissions;
        }

        isInheritPermissionsEnabled(): boolean {
            return this.inheritPermissions;
        }

        isAnyPrincipalAllowed(principalKeys: PrincipalKey[], permission: Permission): boolean {

            if (principalKeys.map(key => key.toString()).indexOf(RoleKeys.ADMIN.toString()) > -1) {
                return true;
            }

            for (var i = 0; i < this.permissions.getEntries().length; i++) {
                var entry = this.permissions.getEntries()[i];

                if (entry.isAllowed(permission)) {
                    var principalInEntry = principalKeys.some((principalKey: PrincipalKey) => {
                        if (principalKey.equals(entry.getPrincipalKey())) {
                            return true;
                        }
                    });
                    if (principalInEntry) {
                        return true;
                    }
                }
            }
            return false;
        }

        private trimPropertyTree(data: PropertyTree): PropertyTree {
            var copy = data.copy();
            copy.getRoot().removeEmptyValues();
            return copy;
        }

        private trimExtraData(extraData: ExtraData): ExtraData {
            var copy = extraData.clone();
            copy.getData().getRoot().removeEmptyValues();
            return copy;
        }

        private extraDataEqualsIgnoreEmpty(extraData: ExtraData[], otherMeta: ExtraData[]): boolean {
            extraData = extraData.map((m) => this.trimExtraData(m)).filter((m) => !m.getData().isEmpty());
            otherMeta = otherMeta.map((m) => this.trimExtraData(m)).filter((m) => !m.getData().isEmpty());

            var comparator = new ExtraDataByMixinNameComparator();
            return ObjectHelper.arrayEquals(extraData.sort(comparator.compare), otherMeta.sort(comparator.compare));
        }

        equals(o: Equitable, ignoreEmptyValues: boolean = false): boolean {
            if (!ObjectHelper.iFrameSafeInstanceOf(o, Content)) {
                return false;
            }

            if (!super.equals(o)) {
                return false;
            }

            var other = <Content>o;

            if (ignoreEmptyValues) {
                if (!ObjectHelper.equals(this.trimPropertyTree(this.data), this.trimPropertyTree(other.data))) {
                    return false;
                }
            } else {
                if (!ObjectHelper.equals(this.data, other.data)) {
                    return false;
                }
            }

            if (ignoreEmptyValues) {
                if (!this.extraDataEqualsIgnoreEmpty(this.extraData, other.extraData)) {
                    return false;
                }
            } else {
                var comparator = new ExtraDataByMixinNameComparator();
                if (!ObjectHelper.arrayEquals(this.extraData.sort(comparator.compare), other.extraData.sort(comparator.compare))) {
                    return false;
                }
            }

            if (!ObjectHelper.equals(this.pageObj, other.pageObj)) {
                return false;
            }

            if (!ObjectHelper.equals(this.permissions, other.permissions)) {
                return false;
            }

            if (!ObjectHelper.equals(this.attachments, other.attachments)) {
                return false;
            }

            if (this.inheritPermissions !== other.inheritPermissions) {
                return false;
            }

            return true;
        }

        clone(): Content {
            return this.newBuilder().build();
        }

        newBuilder(): ContentBuilder {
            return new ContentBuilder(this);
        }

        static fromJson(json: ContentJson): Content {

            var type = new ContentTypeName(json.type);

            if (type.isSite()) {
                return new SiteBuilder().fromContentJson(json).build();
            }
            else if (type.isPageTemplate()) {
                return new PageTemplateBuilder().fromContentJson(json).build();
            }
            return new ContentBuilder().fromContentJson(json).build();
        }
    }

    export class ContentBuilder extends ContentSummaryBuilder {

        data: PropertyTree;

        attachments: Attachments;

        extraData: ExtraData[];

        pageObj: Page;

        permissions: AccessControlList;

        inheritPermissions: boolean = true;

        constructor(source?: Content) {
            super(source);
            if (source) {

                this.data = source.getContentData() ? source.getContentData().copy() : null;
                this.attachments = source.getAttachments();
                this.extraData = source.getAllExtraData() ? source.getAllExtraData().map((extraData: ExtraData) => extraData.clone()) : [];
                this.pageObj = source.getPage() ? source.getPage().clone() : null;
                this.permissions = source.getPermissions(); // TODO clone?
                this.inheritPermissions = source.isInheritPermissionsEnabled();
            }
        }

        fromContentJson(json: ContentJson): ContentBuilder {

            super.fromContentSummaryJson(json);

            this.data = PropertyTree.fromJson(json.data);
            this.attachments = new AttachmentsBuilder().fromJson(json.attachments).build();
            this.extraData = [];
            json.meta.forEach((extraDataJson: ExtraDataJson) => {
                this.extraData.push(ExtraData.fromJson(extraDataJson));
            });

            if (this.page) {
                this.pageObj = new PageBuilder().fromJson(json.page).build();
                this.page = true;
            }
            if (json.permissions) {
                this.permissions = AccessControlList.fromJson(json);
            }
            if (typeof json.inheritPermissions !== "undefined") {
                this.inheritPermissions = json.inheritPermissions;
            }

            return this;
        }

        setData(value: PropertyTree): ContentBuilder {
            this.data = value;
            return this;
        }

        setAttachments(value: Attachments): ContentBuilder {
            this.attachments = value;
            return this;
        }

        setPage(value: Page): ContentBuilder {
            this.pageObj = value;
            this.page = value ? true : false;
            return this;
        }

        setExtraData(extraData: ExtraData[]): ContentBuilder {
            this.extraData = extraData;
            return this;
        }

        setPermissions(value: AccessControlList): ContentBuilder {
            this.permissions = value;
            return this;
        }

        setInheritPermissionsEnabled(value: boolean): ContentBuilder {
            this.inheritPermissions = value;
            return this;
        }

        build(): Content {
            return new Content(this);
        }
    }
