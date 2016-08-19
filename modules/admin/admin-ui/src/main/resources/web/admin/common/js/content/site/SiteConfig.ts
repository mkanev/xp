import {Property} from "../../data/Property";
import {PropertySet} from "../../data/PropertySet";
import {PropertyTree} from "../../data/PropertyTree";
import {ApplicationKey} from "../../application/ApplicationKey";
import {Equitable} from "../../Equitable";
import {Cloneable} from "../../Cloneable";
import {ObjectHelper} from "../../ObjectHelper";
import {assertNotNull} from "../../util/Assert";

export class SiteConfig implements Equitable, Cloneable {

        private applicationKey: ApplicationKey;

        private config: PropertySet;

        constructor(builder: SiteConfigBuilder) {
            this.applicationKey = builder.applicationKey;
            this.config = builder.config;
        }

        getApplicationKey(): ApplicationKey {
            return this.applicationKey;
        }

        getConfig(): PropertySet {
            return this.config;
        }

        toJson(): Object {
            return {
                applicationKey: this.applicationKey.toString(),
                config: this.config.toJson()
            }
        }

        equals(o: Equitable): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, SiteConfig)) {
                return false;
            }

            var other = <SiteConfig>o;

            if (!ObjectHelper.equals(this.applicationKey, other.applicationKey)) {
                return false;
            }

            if (!ObjectHelper.equals(this.config, other.config)) {
                return false;
            }

            return true;
        }

        clone(): SiteConfig {

            return new SiteConfigBuilder(this).build();
        }

        static create(): SiteConfigBuilder {
            return new SiteConfigBuilder();
        }
    }

    export class SiteConfigBuilder {

        applicationKey: ApplicationKey;

        config: PropertySet;

        constructor(source?: SiteConfig) {
            if (source) {
                this.applicationKey = source.getApplicationKey();
                if (source.getConfig()) {
                    var newTree = new PropertyTree(source.getConfig());
                    this.config = newTree.getRoot();
                }
            }
        }

        fromData(propertySet: PropertySet): SiteConfigBuilder {
            assertNotNull(propertySet, "data cannot be null");
            var applicationKey = ApplicationKey.fromString(propertySet.getString("applicationKey"));
            var siteConfig = propertySet.getPropertySet("config");
            this.setApplicationKey(applicationKey);
            this.setConfig(siteConfig);
            return this;
        }

        setApplicationKey(value: ApplicationKey): SiteConfigBuilder {
            this.applicationKey = value;
            return this;
        }

        setConfig(value: PropertySet): SiteConfigBuilder {
            this.config = value;
            return this;
        }

        build(): SiteConfig {
            return new SiteConfig(this);
        }
    }

