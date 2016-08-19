import {Cache} from "../cache/Cache";
import {ClassHelper} from "../ClassHelper";
import {assertNotNull} from "../util/Assert";
import {ApplicationCaches} from "./ApplicationCaches";
import {ApplicationEventType} from "./ApplicationEvent";
import {ApplicationEvent} from "./ApplicationEvent";
import {ApplicationKey} from "./ApplicationKey";

export class ApplicationBasedCache<CACHE extends Cache<any,any>,T,TKEY> {

        private applicationCaches: ApplicationCaches<CACHE>;

        constructor() {

            this.applicationCaches = new ApplicationCaches<CACHE>();

            ApplicationEvent.on((event: ApplicationEvent) => {

                if (ApplicationEventType.STARTED == event.getEventType()) {
                    console.log(ClassHelper.getClassName(this) +
                                " received ApplicationEvent STARTED, calling - loadByApplication.. " +
                                event.getApplicationKey().toString());
                    this.loadByApplication(event.getApplicationKey());
                }
                else if (ApplicationEventType.STOPPED == event.getEventType()) {
                    console.log(ClassHelper.getClassName(this) +
                                " received ApplicationEvent STOPPED - calling deleteByApplicationKey.. " +
                                event.getApplicationKey().toString());
                    this.deleteByApplicationKey(event.getApplicationKey())
                }
            });
        }

        loadByApplication(applicationKey: ApplicationKey) {
            throw new Error("Must be implemented by inheritor");
        }

        getByApplication(applicationKey: ApplicationKey): T[] {
            assertNotNull(applicationKey, "applicationKey not given");
            var cache = this.applicationCaches.getByKey(applicationKey);
            if (!cache) {
                return null;
            }
            return cache.getAll();
        }

        getByKey(key: TKEY, applicationKey: ApplicationKey): T {
            assertNotNull(key, "key not given");

            var cache = this.applicationCaches.getByKey(applicationKey);
            if (!cache) {
                return null;
            }
            return cache.getByKey(key);
        }

        put(object: T, applicationKey?: ApplicationKey) {
            assertNotNull(object, "a object to cache must be given");

            var cache = this.applicationCaches.getByKey(applicationKey);
            if (!cache) {
                cache = this.createApplicationCache();
                this.applicationCaches.put(applicationKey, cache);
            }
            cache.put(object);
        }

        createApplicationCache(): CACHE {
            throw new Error("Must be implemented by inheritor");
        }

        private deleteByApplicationKey(applicationKey: ApplicationKey) {
            this.applicationCaches.removeByKey(applicationKey);
        }
    }
