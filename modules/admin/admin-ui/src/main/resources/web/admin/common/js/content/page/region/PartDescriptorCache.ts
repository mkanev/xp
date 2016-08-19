import {Application} from "../../../application/Application";
import {ApplicationKey} from "../../../application/ApplicationKey";
import {ApplicationCaches} from "../../../application/ApplicationCaches";
import {ApplicationBasedCache} from "../../../application/ApplicationBasedCache";
import {DescriptorKey} from "../DescriptorKey";
import {WindowDOM} from "../../../dom/WindowDOM";
import {DefaultErrorHandler} from "../../../DefaultErrorHandler";
import {assertNotNull} from "../../../util/Assert";
import {Cache} from "../../../cache/Cache";
import {GetPartDescriptorsByApplicationRequest} from "./GetPartDescriptorsByApplicationRequest";
import {PartDescriptor} from "./PartDescriptor";

export class PartDescriptorCache extends ApplicationBasedCache<PartDescriptorApplicationCache,PartDescriptor,DescriptorKey> {

        private static instance: PartDescriptorCache;

        static get(): PartDescriptorCache {

            var w = WindowDOM.get();
            var topWindow: any = w.getTopParent() == null ? w.asWindow() : w.getTopParent().asWindow();

            if (!topWindow.PartDescriptorCache.instance) {
                topWindow.PartDescriptorCache.instance = new PartDescriptorCache();
            }
            return topWindow.PartDescriptorCache.instance;
        }

        constructor() {
            if (PartDescriptorCache.instance) {
                throw new Error("Instantiation failed: Use PartDescriptorCache.get() instead!");
            }
            super();
        }

        loadByApplication(applicationKey: ApplicationKey) {
            new GetPartDescriptorsByApplicationRequest(applicationKey).sendAndParse().catch((reason: any) => {
                DefaultErrorHandler.handle(reason);
            }).done();
        }

        put(descriptor: PartDescriptor) {
            assertNotNull(descriptor, "a PartDescriptor must be given");

            super.put(descriptor, descriptor.getKey().getApplicationKey());
        }

        getByKey(key: DescriptorKey): PartDescriptor {
            return super.getByKey(key, key.getApplicationKey());
        }

        createApplicationCache(): PartDescriptorApplicationCache {
            return new PartDescriptorApplicationCache();
        }
    }

    export class PartDescriptorApplicationCache extends Cache<PartDescriptor, DescriptorKey> {

        copy(object: PartDescriptor): PartDescriptor {
            return object.clone();
        }

        getKeyFromObject(object: PartDescriptor): DescriptorKey {
            return object.getKey();
        }

        getKeyAsString(key: DescriptorKey): string {
            return key.toString();
        }
    }
