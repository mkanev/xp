import {BaseItem} from "../item/BaseItem";
import {Form} from "../form/Form";
import {ApplicationKey} from "./ApplicationKey";
import {ContentTypeName} from "../schema/content/ContentTypeName";
import {MixinNames} from "../schema/mixin/MixinNames";
import {ApplicationJson} from "./json/ApplicationJson";
import {Equitable} from "../Equitable";
import {ObjectHelper} from "../ObjectHelper";
import {BaseItemBuilder} from "../item/BaseItem";

export class Application extends BaseItem {

        static STATE_STARTED = 'started';
        static STATE_STOPPED = 'stopped';

        private applicationKey: ApplicationKey;

        private displayName: string;

        private description: string;

        private vendorName: string;

        private vendorUrl: string;

        private url: string;

        private state: string;

        private version: string;

        private local: boolean;

        private config: Form;

        private authConfig: Form;

        private applicationDependencies: ApplicationKey[] = [];

        private contentTypeDependencies: ContentTypeName[] = [];

        private metaSteps: MixinNames;

        private minSystemVersion: string;

        private maxSystemVersion: string;

        private iconUrl: string;

        constructor(builder: ApplicationBuilder) {
            super(builder);
            this.applicationKey = builder.applicationKey;
            this.displayName = builder.displayName;
            this.description = builder.description;
            this.vendorName = builder.vendorName;
            this.vendorUrl = builder.vendorUrl;
            this.url = builder.url;
            this.state = builder.state;
            this.version = builder.version;
            this.local = builder.local;
            this.config = builder.config;
            this.authConfig = builder.authConfig;
            this.applicationDependencies = builder.applicationDependencies;
            this.contentTypeDependencies = builder.contentTypeDependencies;
            this.metaSteps = builder.metaSteps;
            this.minSystemVersion = builder.minSystemVersion;
            this.maxSystemVersion = builder.maxSystemVersion;
            this.iconUrl = builder.iconUrl;
        }

        getDisplayName(): string {
            return this.displayName;
        }

        getDescription(): string {
            return this.description;
        }

        getApplicationKey(): ApplicationKey {
            return this.applicationKey;
        }

        getVersion(): string {
            return this.version;
        }

        isLocal(): boolean {
            return this.local;
        }

        getName(): string {
            return this.applicationKey.getName();
        }

        getVendorName(): string {
            return this.vendorName;
        }

        getVendorUrl(): string {
            return this.vendorUrl;
        }

        getUrl(): string {
            return this.url;
        }

        getState(): string {
            return this.state;
        }

        isStarted(): boolean {
            return this.state === Application.STATE_STARTED;
        }

        hasChildren(): boolean {
            return false;
        }

        getForm(): Form {
            return this.config;
        }

        getAuthForm(): Form {
            return this.authConfig;
        }

        getMinSystemVersion(): string {
            return this.minSystemVersion;
        }

        getMaxSystemVersion(): string {
            return this.maxSystemVersion;
        }

        getapplicationDependencies(): ApplicationKey[] {
            return this.applicationDependencies;
        }

        getContentTypeDependencies(): ContentTypeName[] {
            return this.contentTypeDependencies;
        }

        getMetaSteps(): MixinNames {
            return this.metaSteps;
        }

        getIconUrl(): string {
            return this.iconUrl;
        }

        static fromJson(json: ApplicationJson): Application {
            return new ApplicationBuilder().fromJson(json).build();
        }

        static fromJsonArray(jsonArray: ApplicationJson[]): Application[] {
            var array: Application[] = [];
            jsonArray.forEach((json: ApplicationJson) => {
                array.push(Application.fromJson(json));
            });
            return array;
        }

        equals(o: Equitable): boolean {
            if (!ObjectHelper.iFrameSafeInstanceOf(o, Application) || !super.equals(o)) {
                return false;
            }
            var other = <Application>o;

            return this.applicationKey.equals(other.applicationKey) &&
                   this.displayName == other.displayName &&
                   this.description == other.description &&
                   this.vendorName == other.vendorName &&
                   this.vendorUrl == other.vendorUrl &&
                   this.url == other.url &&
                   this.state == other.state &&
                   this.version == other.version &&
                   this.local == other.local &&
                   ObjectHelper.arrayEquals(this.applicationDependencies, other.applicationDependencies) &&
                   ObjectHelper.arrayEquals(this.contentTypeDependencies, other.contentTypeDependencies) &&
                   ObjectHelper.equals(this.metaSteps, other.metaSteps) &&
                   this.minSystemVersion == other.minSystemVersion &&
                   this.maxSystemVersion == other.maxSystemVersion &&
                   this.iconUrl == other.iconUrl;
        }
    }

    export class ApplicationBuilder extends BaseItemBuilder {

        applicationKey: ApplicationKey;

        displayName: string;

        description: string;

        vendorName: string;

        vendorUrl: string;

        url: string;

        state: string;

        version: string;

        local: boolean;

        config: Form;

        authConfig: Form;

        applicationDependencies: ApplicationKey[];

        contentTypeDependencies: ContentTypeName[];

        metaSteps: MixinNames;

        minSystemVersion: string;

        maxSystemVersion: string;

        iconUrl: string;


        constructor(source?: Application) {
            this.applicationDependencies = [];
            this.contentTypeDependencies = [];
            if (source) {
                super(source);
                this.applicationKey = source.getApplicationKey();
                this.displayName = source.getDisplayName();
                this.description = source.getDescription();
                this.vendorName = source.getVendorName();
                this.vendorUrl = source.getVendorUrl();
                this.url = source.getUrl();
                this.state = source.getState();
                this.version = source.getVersion();
                this.local = source.isLocal();
                this.config = source.getForm();
                this.applicationDependencies = source.getapplicationDependencies();
                this.contentTypeDependencies = source.getContentTypeDependencies();
                this.metaSteps = source.getMetaSteps();
                this.minSystemVersion = source.getMinSystemVersion();
                this.maxSystemVersion = source.getMaxSystemVersion();
                this.iconUrl = source.getIconUrl();
            }
        }

        fromJson(json: ApplicationJson): ApplicationBuilder {

            super.fromBaseItemJson(json, 'key');

            this.applicationKey = ApplicationKey.fromString(json.key);
            this.displayName = json.displayName;
            this.description = json.description;
            this.vendorName = json.vendorName;
            this.vendorUrl = json.vendorUrl;
            this.url = json.url;
            this.state = json.state;
            this.version = json.version;
            this.local = json.local;

            this.config = json.config != null ? Form.fromJson(json.config) : null;
            this.authConfig = json.authConfig != null ? Form.fromJson(json.authConfig) : null;
            this.minSystemVersion = json.minSystemVersion;
            this.maxSystemVersion = json.maxSystemVersion;
            this.iconUrl = json.iconUrl;

            if (json.applicationDependencies != null) {
                json.applicationDependencies.forEach((dependency: string) => {
                    this.applicationDependencies.push(ApplicationKey.fromString(dependency));
                });
            }

            if (json.contentTypeDependencies != null) {
                json.contentTypeDependencies.forEach((dependency: string) => {
                    this.contentTypeDependencies.push(new ContentTypeName(dependency));
                });
            }

            if (json.metaSteps != null) {
                this.metaSteps = MixinNames.create().fromStrings(json.metaSteps).build();
            }

            return this;
        }

        build(): Application {
            return new Application(this);
        }
    }
