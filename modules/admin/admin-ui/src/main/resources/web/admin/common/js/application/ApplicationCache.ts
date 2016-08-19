import {Cache} from "../cache/Cache";
import {Application} from "./Application";
import {ApplicationBuilder} from "./Application";
import {ApplicationEventType} from "./ApplicationEvent";
import {ApplicationEvent} from "./ApplicationEvent";
import {ApplicationKey} from "./ApplicationKey";

export class ApplicationCache extends Cache<Application, ApplicationKey> {

        private static instance: ApplicationCache;

        constructor() {
            super();

            ApplicationEvent.on((event: ApplicationEvent) => {
                if (event.getEventType() != ApplicationEventType.PROGRESS) {
                    console.log("ApplicationCache on ApplicationEvent, deleting: " + event.getApplicationKey().toString());
                    this.deleteByKey(event.getApplicationKey());
                }
            });
        }

        copy(object: Application): Application {
            return new ApplicationBuilder(object).build();
        }

        getKeyFromObject(object: Application): ApplicationKey {
            return object.getApplicationKey();
        }

        getKeyAsString(key: ApplicationKey): string {
            return key.toString();
        }

        static get(): ApplicationCache {
            if (!ApplicationCache.instance) {
                ApplicationCache.instance = new ApplicationCache();
            }
            return ApplicationCache.instance;
        }
    }
