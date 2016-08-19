import {Event} from "../../../../../../common/js/event/Event";
import {ContentQueryResult} from "../../../../../../common/js/content/resource/result/ContentQueryResult";
import {ContentQuery} from "../../../../../../common/js/content/query/ContentQuery";
import {ClassHelper} from "../../../../../../common/js/ClassHelper";

export class ContentBrowseSearchEvent extends Event {

    private contentQueryResult: ContentQueryResult<any,any>;
    private contentQuery: ContentQuery;

    constructor(contentQueryResult: ContentQueryResult<any,any>,
                contentQuery?: ContentQuery) {
        super();
        this.contentQueryResult = contentQueryResult;
        this.contentQuery = contentQuery;
    }

    getContentQueryResult(): ContentQueryResult<any,any> {
        return this.contentQueryResult;
    }

    getContentQuery(): ContentQuery {
        return this.contentQuery;
    }

    static on(handler: (event: ContentBrowseSearchEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: ContentBrowseSearchEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
