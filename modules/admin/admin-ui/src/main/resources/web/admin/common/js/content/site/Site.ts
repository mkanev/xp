import {Property} from "../../data/Property";
import {ApplicationKey} from "../../application/ApplicationKey";
import {ValueTypes} from "../../data/ValueTypes";
import {Content} from "../Content";
import {Equitable} from "../../Equitable";
import {Cloneable} from "../../Cloneable";
import {ObjectHelper} from "../../ObjectHelper";
import {ContentBuilder} from "../Content";
import {ContentJson} from "../json/ContentJson";
import {SiteConfig} from "./SiteConfig";

export class Site extends Content implements Equitable, Cloneable {

        constructor(builder: SiteBuilder) {
            super(builder);
        }

        isSite(): boolean {
            return true;
        }

        getDescription(): string {
            return this.getContentData().getString("description");
        }

        getSiteConfigs(): SiteConfig[] {

            var siteConfigs: SiteConfig[] = [];
            this.getContentData().forEachProperty("siteConfig", (applicationProperty: Property) => {
                var siteConfigData = applicationProperty.getPropertySet();
                if (siteConfigData) {
                    var siteConfig = SiteConfig.create().fromData(siteConfigData).build();
                    siteConfigs.push(siteConfig);
                }
            });

            return siteConfigs;
        }

        getApplicationKeys(): ApplicationKey[] {
            return this.getSiteConfigs().map((config: SiteConfig) => config.getApplicationKey());
        }

        equals(o: Equitable, ignoreEmptyValues: boolean = false): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, Site)) {
                return false;
            }

            return super.equals(o, ignoreEmptyValues);
        }

        clone(): Site {

            return this.newBuilder().build();
        }

        newBuilder(): SiteBuilder {
            return new SiteBuilder(this);
        }
    }

    export class SiteBuilder extends ContentBuilder {

        constructor(source?: Site) {
            super(source);
        }

        fromContentJson(contentJson: ContentJson): SiteBuilder {
            super.fromContentJson(contentJson);
            return this;
        }

        build(): Site {
            return new Site(this);
        }
    }
