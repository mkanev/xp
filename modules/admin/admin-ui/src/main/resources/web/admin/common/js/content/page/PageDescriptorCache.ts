import {Application} from "../../application/Application";
import {ApplicationKey} from "../../application/ApplicationKey";
import {ApplicationCaches} from "../../application/ApplicationCaches";
import {ApplicationBasedCache} from "../../application/ApplicationBasedCache";
import {WindowDOM} from "../../dom/WindowDOM";
import {DefaultErrorHandler} from "../../DefaultErrorHandler";
import {assertNotNull} from "../../util/Assert";
import {Cache} from "../../cache/Cache";
import {DescriptorKey} from "./DescriptorKey";
import {GetPageDescriptorsByApplicationRequest} from "./GetPageDescriptorsByApplicationRequest";
import {PageDescriptor} from "./PageDescriptor";

export class PageDescriptorCache extends ApplicationBasedCache<PageDescriptorApplicationCache,PageDescriptor,DescriptorKey> {

        private static instance: PageDescriptorCache;

        static get(): PageDescriptorCache {

            var w = WindowDOM.get();
            var topWindow: any = w.getTopParent() == null ? w.asWindow() : w.getTopParent().asWindow();

            if (!topWindow.PageDescriptorCache.instance) {
                topWindow.PageDescriptorCache.instance = new PageDescriptorCache();
            }
            return topWindow.PageDescriptorCache.instance;
        }

        constructor() {
            if (PageDescriptorCache.instance) {
                throw new Error("Instantiation failed: Use PageDescriptorCache.get() instead!");
            }
            super();
        }

        loadByApplication(applicationKey: ApplicationKey) {
            new GetPageDescriptorsByApplicationRequest(applicationKey).sendAndParse().catch((reason: any) => {
                DefaultErrorHandler.handle(reason);
            }).done();
        }

        put(descriptor: PageDescriptor) {
            assertNotNull(descriptor, "a PageDescriptor must be given");

            super.put(descriptor, descriptor.getKey().getApplicationKey());
        }

        getByKey(key: DescriptorKey): PageDescriptor {
            return super.getByKey(key, key.getApplicationKey());
        }

        createApplicationCache(): PageDescriptorApplicationCache {
            return new PageDescriptorApplicationCache();
        }
    }

    export class PageDescriptorApplicationCache extends Cache<PageDescriptor, DescriptorKey> {

        copy(object: PageDescriptor): PageDescriptor {
            return object.clone();
        }

        getKeyFromObject(object: PageDescriptor): DescriptorKey {
            return object.getKey();
        }

        getKeyAsString(key: DescriptorKey): string {
            return key.toString();
        }
    }
