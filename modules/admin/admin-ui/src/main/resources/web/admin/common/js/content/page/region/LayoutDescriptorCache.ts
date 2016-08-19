import {Application} from "../../../application/Application";
import {ApplicationKey} from "../../../application/ApplicationKey";
import {ApplicationCaches} from "../../../application/ApplicationCaches";
import {ApplicationBasedCache} from "../../../application/ApplicationBasedCache";
import {DescriptorKey} from "../DescriptorKey";
import {WindowDOM} from "../../../dom/WindowDOM";
import {DefaultErrorHandler} from "../../../DefaultErrorHandler";
import {assertNotNull} from "../../../util/Assert";
import {Cache} from "../../../cache/Cache";
import {GetLayoutDescriptorsByApplicationRequest} from "./GetLayoutDescriptorsByApplicationRequest";
import {LayoutDescriptor} from "./LayoutDescriptor";

export class LayoutDescriptorCache extends ApplicationBasedCache<LayoutDescriptorApplicationCache,LayoutDescriptor,DescriptorKey> {

        private static instance: LayoutDescriptorCache;

        static get(): LayoutDescriptorCache {

            var w = WindowDOM.get();
            var topWindow: any = w.getTopParent() == null ? w.asWindow() : w.getTopParent().asWindow();

            if (!topWindow.LayoutDescriptorCache.instance) {
                topWindow.LayoutDescriptorCache.instance = new LayoutDescriptorCache();
            }
            return topWindow.LayoutDescriptorCache.instance;
        }

        constructor() {
            if (LayoutDescriptorCache.instance) {
                throw new Error("Instantiation failed: Use LayoutDescriptorCache.get() instead!");
            }
            super();
        }

        loadByApplication(applicationKey: ApplicationKey) {
            new GetLayoutDescriptorsByApplicationRequest(applicationKey).sendAndParse().catch((reason: any) => {
                DefaultErrorHandler.handle(reason);
            }).done();
        }

        put(descriptor: LayoutDescriptor) {
            assertNotNull(descriptor, "a LayoutDescriptor must be given");

            super.put(descriptor, descriptor.getKey().getApplicationKey());
        }

        getByKey(key: DescriptorKey): LayoutDescriptor {
            return super.getByKey(key, key.getApplicationKey());
        }

        createApplicationCache(): LayoutDescriptorApplicationCache {
            return new LayoutDescriptorApplicationCache();
        }
    }

    export class LayoutDescriptorApplicationCache extends Cache<LayoutDescriptor, DescriptorKey> {

        copy(object: LayoutDescriptor): LayoutDescriptor {
            return object.clone();
        }

        getKeyFromObject(object: LayoutDescriptor): DescriptorKey {
            return object.getKey();
        }

        getKeyAsString(key: DescriptorKey): string {
            return key.toString();
        }
    }
