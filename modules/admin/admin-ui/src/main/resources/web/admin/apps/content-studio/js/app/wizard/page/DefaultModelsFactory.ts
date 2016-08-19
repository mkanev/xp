import {ContentTypeName} from "../../../../../../common/js/schema/content/ContentTypeName";
import {ContentId} from "../../../../../../common/js/content/ContentId";
import {PageTemplate} from "../../../../../../common/js/content/page/PageTemplate";
import {PageDescriptor} from "../../../../../../common/js/content/page/PageDescriptor";
import {GetPageDescriptorByKeyRequest} from "../../../../../../common/js/content/page/GetPageDescriptorByKeyRequest";
import {GetDefaultPageTemplateRequest} from "../../../../../../common/js/content/page/GetDefaultPageTemplateRequest";
import {ApplicationKey} from "../../../../../../common/js/application/ApplicationKey";
import {Exception} from "../../../../../../common/js/Exception";
import {ExceptionType} from "../../../../../../common/js/Exception";

import {DefaultModels} from "./DefaultModels";

export interface DefaultModelsFactoryConfig {

    siteId: ContentId;

    contentType: ContentTypeName;

    applications: ApplicationKey[];
}

export class DefaultModelsFactory {

    static create(config: DefaultModelsFactoryConfig): wemQ.Promise<DefaultModels> {

        return new GetDefaultPageTemplateRequest(config.siteId, config.contentType).sendAndParse().then(
            (defaultPageTemplate: PageTemplate) => {

                var defaultPageTemplateDescriptorPromise = null;
                if (defaultPageTemplate && defaultPageTemplate.isPage()) {
                    defaultPageTemplateDescriptorPromise =
                        new GetPageDescriptorByKeyRequest(defaultPageTemplate.getController()).sendAndParse();
                }
                else if (defaultPageTemplate && !defaultPageTemplate.isPage()) {
                    defaultPageTemplate = null;
                }

                var deferred = wemQ.defer<DefaultModels>();
                if (defaultPageTemplateDescriptorPromise) {
                    defaultPageTemplateDescriptorPromise.then((defaultPageTemplateDescriptor: PageDescriptor) => {

                        deferred.resolve(new DefaultModels(defaultPageTemplate, defaultPageTemplateDescriptor));
                    }).catch((reason) => {

                        deferred.reject(new Exception("Page descriptor '" + defaultPageTemplate.getController() + "' not found.",
                            ExceptionType.WARNING));
                    }).done();
                }
                else {
                    deferred.resolve(new DefaultModels(defaultPageTemplate, null));
                }

                return deferred.promise;
            });
    }
}
