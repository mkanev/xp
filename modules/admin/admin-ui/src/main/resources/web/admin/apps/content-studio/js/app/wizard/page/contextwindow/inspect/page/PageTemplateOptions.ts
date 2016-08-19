import {ContentId} from "../../../../../../../../../common/js/content/ContentId";
import {ContentTypeName} from "../../../../../../../../../common/js/schema/content/ContentTypeName";
import {GetPageTemplatesByCanRenderRequest} from "../../../../../../../../../common/js/content/page/GetPageTemplatesByCanRenderRequest";
import {PageModel} from "../../../../../../../../../common/js/content/page/PageModel";
import {PageTemplate} from "../../../../../../../../../common/js/content/page/PageTemplate";
import {PageTemplateLoader} from "../../../../../../../../../common/js/content/page/PageTemplateLoader";
import {Option} from "../../../../../../../../../common/js/ui/selector/Option";
import {LoadedDataEvent} from "../../../../../../../../../common/js/util/loader/event/LoadedDataEvent";
import {PageTemplateByDisplayNameComparator} from "../../../../../../../../../common/js/content/page/PageTemplateByDisplayNameComparator";

import {PageTemplateOption} from "./PageTemplateOption";

export class PageTemplateOptions {

    private siteId: ContentId;

    private contentType: ContentTypeName;

    private pageModel: PageModel;

    private defaultPageTemplateOption: Option<PageTemplateOption>;

    constructor(siteId: ContentId, contentType: ContentTypeName, pageModel: PageModel) {
        this.siteId = siteId;
        this.contentType = contentType;
        this.pageModel = pageModel;
        this.defaultPageTemplateOption = {value: "__auto__", displayValue: new PageTemplateOption(null, pageModel)};
    }

    getDefault(): Option<PageTemplateOption> {
        return this.defaultPageTemplateOption;
    }

    getOptions(): wemQ.Promise<Option<PageTemplateOption>[]> {

        var deferred = wemQ.defer<Option<PageTemplateOption>[]>();

        var options: Option<PageTemplateOption>[] = [];
        options.push(this.defaultPageTemplateOption);

        var loader = new PageTemplateLoader(new GetPageTemplatesByCanRenderRequest(this.siteId,
            this.contentType));
        loader.setComparator(new PageTemplateByDisplayNameComparator());
        loader.onLoadedData((event: LoadedDataEvent<PageTemplate>) => {

            event.getData().forEach((pageTemplate: PageTemplate) => {

                var indices: string[] = [];
                indices.push(pageTemplate.getName().toString());
                indices.push(pageTemplate.getDisplayName());
                indices.push(pageTemplate.getController().toString());

                var option = {
                    value: pageTemplate.getId().toString(),
                    displayValue: new PageTemplateOption(pageTemplate, this.pageModel),
                    indices: indices
                };
                options.push(option);
            });

            deferred.resolve(options);
        });
        loader.load();
        return deferred.promise;
    }
}
