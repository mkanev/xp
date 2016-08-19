import {ApplicationKey} from "../../application/ApplicationKey";
import {ApplicationEvent} from "../../application/ApplicationEvent";
import {ApplicationEventType} from "../../application/ApplicationEvent";
import {Site} from "./Site";
import {PropertyChangedEvent} from "../../PropertyChangedEvent";
import {PropertyAddedEvent} from "../../data/PropertyAddedEvent";
import {PropertyRemovedEvent} from "../../data/PropertyRemovedEvent";
import {Property} from "../../data/Property";
import {SiteConfig} from "./SiteConfig";
import {ContentId} from "../ContentId";
import {ApplicationAddedEvent} from "./ApplicationAddedEvent";
import {ApplicationRemovedEvent} from "./ApplicationRemovedEvent";

export class SiteModel {

        public static PROPERTY_NAME_SITE_CONFIGS = "siteConfigs";

        private site: Site;

        private siteConfigs: SiteConfig[];

        private applicationAddedListeners: {(event: ApplicationAddedEvent):void}[] = [];

        private applicationRemovedListeners: {(event: ApplicationRemovedEvent):void}[] = [];

        private propertyChangedListeners: {(event: PropertyChangedEvent):void}[] = [];

        private applicationPropertyAddedListener: (event: PropertyAddedEvent) => void;

        private applicationPropertyRemovedListener: (event: PropertyRemovedEvent) => void;

        private applicationGlobalEventsListener: (event: ApplicationEvent) => void;

        private applicationUnavailableListeners: {(applicationEvent: ApplicationEvent):void}[] = [];

        constructor(site: Site) {
            this.initApplicationPropertyListeners();
            this.setup(site);
        }

        private initApplicationPropertyListeners() {
            this.applicationPropertyAddedListener = (event: PropertyAddedEvent) => {
                var property: Property = event.getProperty();
                // TODO:? property.getPath().startsWith(PropertyPath.fromString(".siteConfig")) &&  property.getName( )=="config")
                if (property.getPath().toString().indexOf(".siteConfig") == 0 && property.getName() == "config") {
                    var siteConfig: SiteConfig = SiteConfig.create().fromData(property.getParent()).build();
                    if (!this.siteConfigs) {
                        this.siteConfigs = [];
                    }
                    this.siteConfigs.push(siteConfig);
                    this.notifyApplicationAdded(siteConfig);
                }
            };

            this.applicationPropertyRemovedListener = (event: PropertyRemovedEvent) => {
                var property: Property = event.getProperty();
                if (property.getName() == "siteConfig") {
                    var applicationKey = ApplicationKey.fromString(property.getPropertySet().getString("applicationKey"));
                    this.siteConfigs = this.siteConfigs.filter((siteConfig: SiteConfig) =>
                        !siteConfig.getApplicationKey().equals(applicationKey)
                    );
                    this.notifyApplicationRemoved(applicationKey);
                }
            };

            this.applicationGlobalEventsListener = (event: ApplicationEvent) => {
                if (ApplicationEventType.STOPPED == event.getEventType()) {
                    this.notifyApplicationUnavailable(event);
                }
            }
        }

        private setup(site: Site) {
            this.site = site;
            this.siteConfigs = site.getSiteConfigs();
            this.site.getContentData().onPropertyAdded(this.applicationPropertyAddedListener);
            this.site.getContentData().onPropertyRemoved(this.applicationPropertyRemovedListener);
            ApplicationEvent.on(this.applicationGlobalEventsListener);
        }

        update(site: Site) {
            if (this.site) {
                this.site.getContentData().unPropertyAdded(this.applicationPropertyAddedListener);
                this.site.getContentData().unPropertyRemoved(this.applicationPropertyRemovedListener);
                ApplicationEvent.un(this.applicationGlobalEventsListener);
            }

            if (site) {
                this.setup(site);
            }
        }

        getSite(): Site {
            return this.site;
        }

        getSiteId(): ContentId {
            return this.site.getContentId();
        }

        getApplicationKeys(): ApplicationKey[] {
            return this.siteConfigs.map((sc: SiteConfig) => sc.getApplicationKey());
        }

        onPropertyChanged(listener: (event: PropertyChangedEvent)=>void) {
            this.propertyChangedListeners.push(listener);
        }

        unPropertyChanged(listener: (event: PropertyChangedEvent)=>void) {
            this.propertyChangedListeners =
                this.propertyChangedListeners.filter((curr: (event: PropertyChangedEvent)=>void) => {
                    return listener != curr;
                });
        }

        private notifyPropertyChanged(property: string, oldValue: any, newValue: any, source: any) {
            var event = new PropertyChangedEvent(property, oldValue, newValue, source);
            this.propertyChangedListeners.forEach((listener: (event: PropertyChangedEvent)=>void) => {
                listener(event);
            })
        }

        onApplicationAdded(listener: (event: ApplicationAddedEvent)=>void) {
            this.applicationAddedListeners.push(listener);
        }

        unApplicationAdded(listener: (event: ApplicationAddedEvent)=>void) {
            this.applicationAddedListeners =
            this.applicationAddedListeners.filter((curr: (event: ApplicationAddedEvent)=>void) => {
                    return listener != curr;
                });
        }

        private notifyApplicationAdded(siteConfig: SiteConfig) {
            var event = new ApplicationAddedEvent(siteConfig);
            this.applicationAddedListeners.forEach((listener: (event: ApplicationAddedEvent)=>void) => {
                listener(event);
            })
        }

        onApplicationRemoved(listener: (event: ApplicationRemovedEvent)=>void) {
            this.applicationRemovedListeners.push(listener);
        }

        unApplicationRemoved(listener: (event: ApplicationRemovedEvent)=>void) {
            this.applicationRemovedListeners =
            this.applicationRemovedListeners.filter((curr: (event: ApplicationRemovedEvent)=>void) => {
                    return listener != curr;
                });
        }

        private notifyApplicationRemoved(applicationKey: ApplicationKey) {
            var event = new ApplicationRemovedEvent(applicationKey);
            this.applicationRemovedListeners.forEach((listener: (event: ApplicationRemovedEvent)=>void) => {
                listener(event);
            })
        }

        onApplicationUnavailable(listener: (applicationEvent: ApplicationEvent)=>void) {
            this.applicationUnavailableListeners.push(listener);
        }

        unApplicationUnavailable(listener: (applicationEvent: ApplicationEvent)=>void) {
            this.applicationUnavailableListeners =
                this.applicationUnavailableListeners.filter((curr: (applicationEvent: ApplicationEvent)=>void) => {
                    return listener != curr;
                });
        }

        private notifyApplicationUnavailable(applicationEvent: ApplicationEvent) {
            this.applicationUnavailableListeners.forEach((listener: (applicationEvent: ApplicationEvent)=>void) => {
                listener(applicationEvent);
            })
        }
    }
