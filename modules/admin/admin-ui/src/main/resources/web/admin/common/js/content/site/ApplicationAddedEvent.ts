import {ApplicationKey} from "../../application/ApplicationKey";
import {SiteConfig} from "./SiteConfig";

export class ApplicationAddedEvent {

        private siteConfig: SiteConfig;

        constructor(siteConfig: SiteConfig) {
            this.siteConfig = siteConfig;
        }

        getApplicationKey(): ApplicationKey {
            return this.siteConfig.getApplicationKey();
        }

        getSiteConfig(): SiteConfig {
            return this.siteConfig;
        }
    }
