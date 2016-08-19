import {Equitable} from "../Equitable";
import {ApplicationKey} from "../application/ApplicationKey";
import {PropertyTree} from "../data/PropertyTree";
import {ObjectHelper} from "../ObjectHelper";
import {AuthConfigJson} from "./AuthConfigJson";

export class AuthConfig implements Equitable {
        private applicationKey: ApplicationKey;
        private config: PropertyTree;

        constructor(builder: AuthConfigBuilder) {
            this.applicationKey = builder.applicationKey;
            this.config = builder.config;
        }

        getApplicationKey(): ApplicationKey {
            return this.applicationKey;
        }

        getConfig(): PropertyTree {
            return this.config;
        }

        equals(o: Equitable): boolean {
            if (!ObjectHelper.iFrameSafeInstanceOf(o, AuthConfig)) {
                return false;
            }

            var other = <AuthConfig> o;

            return this.applicationKey.equals(other.applicationKey) &&
                   this.config.equals(other.config)
        }

        toJson(): AuthConfigJson {
            return {
                "applicationKey": this.applicationKey.toString(),
                "config": this.config.toJson()
            };
        }

        clone(): AuthConfig {
            return AuthConfig.create().
                setApplicationKey(this.applicationKey).
                setConfig(this.config.copy()).
                build();
        }

        static create(): AuthConfigBuilder {
            return new AuthConfigBuilder();
        }

        static fromJson(json: AuthConfigJson): AuthConfig {
            return new AuthConfigBuilder().fromJson(json).build();
        }

    }

    export class AuthConfigBuilder {
        applicationKey: ApplicationKey;
        config: PropertyTree;

        constructor() {
        }

        setApplicationKey(applicationKey: ApplicationKey): AuthConfigBuilder {
            this.applicationKey = applicationKey;
            return this;
        }

        setConfig(config: PropertyTree): AuthConfigBuilder {
            this.config = config;
            return this;
        }


        fromJson(json: AuthConfigJson): AuthConfigBuilder {
            this.applicationKey = ApplicationKey.fromString(json.applicationKey);
            this.config = json.config != null ? PropertyTree.fromJson(json.config) : null;
            return this;
        }

        build(): AuthConfig {
            return new AuthConfig(this);
        }
    }
