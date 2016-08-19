import {ContentQueryRequest} from "../../../../../../common/js/content/resource/ContentQueryRequest";
import {ContentTypeName} from "../../../../../../common/js/schema/content/ContentTypeName";
import {ContentSummaryJson} from "../../../../../../common/js/content/json/ContentSummaryJson";
import {ContentQueryResult} from "../../../../../../common/js/content/resource/result/ContentQueryResult";
import {ContentSummary} from "../../../../../../common/js/content/ContentSummary";
import {AggregationTypeWrapperJson} from "../../../../../../common/js/aggregation/AggregationTypeWrapperJson";
import {AggregationGroupView} from "../../../../../../common/js/aggregation/AggregationGroupView";
import {ContentTypeAggregationGroupView} from "../../../../../../common/js/aggregation/ContentTypeAggregationGroupView";
import {Aggregation} from "../../../../../../common/js/aggregation/Aggregation";
import {AggregationFactory} from "../../../../../../common/js/aggregation/AggregationFactory";
import {SearchInputValues} from "../../../../../../common/js/query/SearchInputValues";
import {ContentQuery} from "../../../../../../common/js/content/query/ContentQuery";
import {TermsAggregationQuery} from "../../../../../../common/js/query/aggregation/TermsAggregationQuery";
import {DateRangeAggregationQuery} from "../../../../../../common/js/query/aggregation/DateRangeAggregationQuery";
import {DateRange} from "../../../../../../common/js/query/aggregation/DateRange";
import {QueryExpr} from "../../../../../../common/js/query/expr/QueryExpr";
import {CompareExpr} from "../../../../../../common/js/query/expr/CompareExpr";
import {LogicalExpr} from "../../../../../../common/js/query/expr/LogicalExpr";
import {ValueExpr} from "../../../../../../common/js/query/expr/ValueExpr";
import {LogicalOperator} from "../../../../../../common/js/query/expr/LogicalOperator";
import {FieldExpr} from "../../../../../../common/js/query/expr/FieldExpr";
import {Value} from "../../../../../../common/js/data/Value";
import {ValueTypes} from "../../../../../../common/js/data/ValueTypes";
import {QueryField} from "../../../../../../common/js/query/QueryField";
import {ContentSummaryViewer} from "../../../../../../common/js/content/ContentSummaryViewer";
import {ActionButton} from "../../../../../../common/js/ui/button/ActionButton";
import {Action} from "../../../../../../common/js/ui/Action";
import {BrowseFilterPanel} from "../../../../../../common/js/app/browse/filter/BrowseFilterPanel";
import {Element} from "../../../../../../common/js/dom/Element";
import {DefaultErrorHandler} from "../../../../../../common/js/DefaultErrorHandler";
import {Filter} from "../../../../../../common/js/query/filter/Filter";
import {Expand} from "../../../../../../common/js/rest/Expand";
import {ObjectHelper} from "../../../../../../common/js/ObjectHelper";
import {Expression} from "../../../../../../common/js/query/expr/Expression";
import {FulltextSearchExpressionBuilder} from "../../../../../../common/js/query/FulltextSearchExpression";
import {Bucket} from "../../../../../../common/js/aggregation/Bucket";
import {DateRangeBucket} from "../../../../../../common/js/aggregation/DateRangeBucket";
import {RangeFilter} from "../../../../../../common/js/query/filter/RangeFilter";
import {BooleanFilter} from "../../../../../../common/js/query/filter/BooleanFilter";
import {TermsAggregationOrderType} from "../../../../../../common/js/query/aggregation/TermsAggregationQuery";
import {TermsAggregationOrderDirection} from "../../../../../../common/js/query/aggregation/TermsAggregationQuery";
import {BucketAggregation} from "../../../../../../common/js/aggregation/BucketAggregation";
import {DivEl} from "../../../../../../common/js/dom/DivEl";
import {LabelEl} from "../../../../../../common/js/dom/LabelEl";
import {ContentId} from "../../../../../../common/js/content/ContentId";

import {ContentBrowseResetEvent} from "./ContentBrowseResetEvent";
import {ContentBrowseSearchEvent} from "./ContentBrowseSearchEvent";
import {ContentBrowseRefreshEvent} from "./ContentBrowseRefreshEvent";

export class ContentBrowseFilterPanel extends BrowseFilterPanel {

    static CONTENT_TYPE_AGGREGATION_NAME: string = "contentTypes";
    static LAST_MODIFIED_AGGREGATION_NAME: string = "lastModified";
    static CONTENT_TYPE_AGGREGATION_DISPLAY_NAME: string = "Content Types";
    static LAST_MODIFIED_AGGREGATION_DISPLAY_NAME: string = "Last Modified";

    contentTypeAggregation: ContentTypeAggregationGroupView;
    lastModifiedAggregation: AggregationGroupView;

    private dependenciesSection: DependenciesSection;

    constructor() {

        this.contentTypeAggregation = new ContentTypeAggregationGroupView(
            ContentBrowseFilterPanel.CONTENT_TYPE_AGGREGATION_NAME,
            ContentBrowseFilterPanel.CONTENT_TYPE_AGGREGATION_DISPLAY_NAME);

        this.lastModifiedAggregation = new AggregationGroupView(
            ContentBrowseFilterPanel.LAST_MODIFIED_AGGREGATION_NAME,
            ContentBrowseFilterPanel.LAST_MODIFIED_AGGREGATION_DISPLAY_NAME);

        super(null, [this.contentTypeAggregation, this.lastModifiedAggregation]);

        this.initAggregationGroupView([this.contentTypeAggregation, this.lastModifiedAggregation]);

        this.onReset(()=> {
            this.resetFacets();
        });

        this.onShown(() => {
            this.refresh();
        });
    }

    protected appendExtraSection() {
        this.dependenciesSection = new DependenciesSection(this.removeDependencyItemCallback.bind(this));
        this.appendChild(this.dependenciesSection);
    }

    private removeDependencyItemCallback() {
        this.removeClass("has-dependency-item");
        this.dependenciesSection.reset();
        this.search();
    }

    public setDependencyItem(item: ContentSummary, inbound: boolean) {
        this.addClass("has-dependency-item");
        this.dependenciesSection.setItem(item, inbound);
        if (this.dependenciesSection.isActive()) {
            this.reset(true);
            this.search();
        }
    }

    doRefresh() {
        if (!this.isAnyFilterSet()) {
            this.handleEmptyFilterInput(true);
        } else {
            this.refreshDataAndHandleResponse(this.createContentQuery());
        }
    }

    doSearch(elementChanged?: Element) {
        if (!this.isAnyFilterSet()) {
            this.handleEmptyFilterInput();
        } else {
            this.searchDataAndHandleResponse(this.createContentQuery());
        }
    }

    private isAnyFilterSet(): boolean {
        return this.hasFilterSet() || this.dependenciesSection.isActive();
    }

    private handleEmptyFilterInput(isRefresh?: boolean) {
        if (isRefresh) {

            this.resetFacets(true, true).then(() => {
                new ContentBrowseRefreshEvent().fire();
            }).catch((reason: any) => {
                DefaultErrorHandler.handle(reason);
            }).done();

        } else { // it's SearchEvent, usual reset with grid reload
            this.reset();
        }
    }

    private createContentQuery(): ContentQuery {
        var contentQuery: ContentQuery = new ContentQuery(),
            values = this.getSearchInputValues();
        this.appendQueryExpression(values, contentQuery);
        this.appendContentTypeFilter(values, contentQuery);
        this.appendOutboundReferencesFilter(contentQuery);

        var lastModifiedFilter: Filter = this.appendLastModifiedQuery(values);
        if (lastModifiedFilter != null) {
            contentQuery.addQueryFilter(lastModifiedFilter);
        }

        contentQuery.setSize(ContentQuery.POSTLOAD_SIZE);

        this.appendContentTypesAggregationQuery(contentQuery);
        this.appendLastModifiedAggregationQuery(contentQuery);

        return contentQuery;
    }

    private searchDataAndHandleResponse(contentQuery: ContentQuery) {
        new ContentQueryRequest<ContentSummaryJson,ContentSummary>(contentQuery).setExpand(Expand.SUMMARY).sendAndParse().then(
            (contentQueryResult: ContentQueryResult<ContentSummary,ContentSummaryJson>) => {
                this.handleDataSearchResult(contentQuery, contentQueryResult);
            }).catch((reason: any) => {
            DefaultErrorHandler.handle(reason);
        }).done();
    }

    private refreshDataAndHandleResponse(contentQuery: ContentQuery) {
        new ContentQueryRequest<ContentSummaryJson,ContentSummary>(contentQuery).setExpand(Expand.SUMMARY).sendAndParse().then(
            (contentQueryResult: ContentQueryResult<ContentSummary,ContentSummaryJson>) => {
                if (contentQueryResult.getMetadata().getTotalHits() > 0) {
                    this.handleDataSearchResult(contentQuery, contentQueryResult);
                }
                else {
                    this.handleNoSearchResultOnRefresh(contentQuery);
                }
            }).catch((reason: any) => {
            DefaultErrorHandler.handle(reason);
        }).done();
    }

    private handleDataSearchResult(contentQuery: ContentQuery,
                                   contentQueryResult: ContentQueryResult<ContentSummary,ContentSummaryJson>) {
        this.getAggregations(contentQuery, contentQueryResult).then((aggregations: Aggregation[]) => {
            this.updateAggregations(aggregations, true);
            this.updateHitsCounter(contentQueryResult.getMetadata().getTotalHits());
            this.toggleAggregationsVisibility(contentQueryResult.getAggregations());
            new ContentBrowseSearchEvent(contentQueryResult, contentQuery).fire();
        });
    }

    private handleNoSearchResultOnRefresh(contentQuery: ContentQuery) {
        if (this.contentTypesAndRangeFiltersUsed(contentQuery)) { //remove content type facet from search if both content types and date are filtered
            this.refreshDataAndHandleResponse(this.cloneContentQueryNoContentTypes(contentQuery));
        }
        else if (this.hasSearchStringSet()) { // if still no result and search text is set remove last modified facet
            this.deselectAll();
            this.searchDataAndHandleResponse(this.cloneContentQueryNoAggregations(contentQuery));
        }
        else {
            this.reset();
        }
    }

    private contentTypesAndRangeFiltersUsed(contentQuery: ContentQuery): boolean {
        return contentQuery.getContentTypes().length > 0 && contentQuery.getQueryFilters().length > 0;
    }

    private cloneContentQueryNoContentTypes(contentQuery: ContentQuery): ContentQuery {
        var newContentQuery: ContentQuery = new ContentQuery().setContentTypeNames([]).setFrom(contentQuery.getFrom()).setQueryExpr(
            contentQuery.getQueryExpr()).setSize(contentQuery.getSize()).setAggregationQueries(
            contentQuery.getAggregationQueries()).setQueryFilters(contentQuery.getQueryFilters()).setMustBeReferencedById(
            contentQuery.getMustBeReferencedById());

        return newContentQuery;
    }

    private cloneContentQueryNoAggregations(contentQuery: ContentQuery): ContentQuery {
        return this.cloneContentQueryNoContentTypes(contentQuery).setQueryFilters([]);
    }

    private getAggregations(contentQuery: ContentQuery,
                            contentQueryResult: ContentQueryResult<ContentSummary,ContentSummaryJson>): wemQ.Promise<Aggregation[]> {

        var clonedContentQueryNoContentTypes: ContentQuery = this.cloneContentQueryNoContentTypes(contentQuery);

        if (ObjectHelper.objectEquals(contentQuery, clonedContentQueryNoContentTypes)) {
            return wemQ(this.combineAggregations(contentQueryResult, contentQueryResult));
        }

        return new ContentQueryRequest<ContentSummaryJson,ContentSummary>(clonedContentQueryNoContentTypes).setExpand(
            Expand.SUMMARY).sendAndParse().then(
            (contentQueryResultNoContentTypesSelected: ContentQueryResult<ContentSummary,ContentSummaryJson>) => {
                return this.combineAggregations(contentQueryResult, contentQueryResultNoContentTypesSelected);
            });
    }

    private combineAggregations(contentQueryResult, contentQueryResultNoContentTypesSelected): Aggregation[] {
        var contentTypesAggr = contentQueryResultNoContentTypesSelected.getAggregations().filter((aggregation) => {
            return aggregation.getName() === ContentBrowseFilterPanel.CONTENT_TYPE_AGGREGATION_NAME;
        });
        var dateModifiedAggr = contentQueryResult.getAggregations().filter((aggregation) => {
            return aggregation.getName() !== ContentBrowseFilterPanel.CONTENT_TYPE_AGGREGATION_NAME;
        });

        var aggregations = [contentTypesAggr[0], dateModifiedAggr[0]];

        return aggregations;
    }

    private initAggregationGroupView(aggregationGroupView: AggregationGroupView[]) {

        var contentQuery: ContentQuery = this.buildAggregationsQuery();

        new ContentQueryRequest<ContentSummaryJson,ContentSummary>(contentQuery).sendAndParse().then(
            (contentQueryResult: ContentQueryResult<ContentSummary,ContentSummaryJson>) => {

                this.updateAggregations(contentQueryResult.getAggregations(), false);
                this.updateHitsCounter(contentQueryResult.getMetadata().getTotalHits(), true);
                this.toggleAggregationsVisibility(contentQueryResult.getAggregations());

                aggregationGroupView.forEach((aggregationGroupView: AggregationGroupView) => {
                    aggregationGroupView.initialize();
                });
            }).catch((reason: any) => {
            DefaultErrorHandler.handle(reason);
        }).done();
    }

    private resetFacets(suppressEvent?: boolean, doResetAll?: boolean) {

        var contentQuery: ContentQuery = this.buildAggregationsQuery();

        return new ContentQueryRequest<ContentSummaryJson,ContentSummary>(contentQuery).sendAndParse().then(
            (contentQueryResult: ContentQueryResult<ContentSummary,ContentSummaryJson>) => {

                this.updateAggregations(contentQueryResult.getAggregations(), doResetAll);
                this.updateHitsCounter(contentQueryResult.getMetadata().getTotalHits(), true);
                this.toggleAggregationsVisibility(contentQueryResult.getAggregations());

                if (!suppressEvent) { // then fire usual reset event with content grid reloading
                    if (!!this.dependenciesSection && this.dependenciesSection.isActive()) {
                        new ContentBrowseSearchEvent(contentQueryResult, contentQuery).fire();
                    } else {
                        new ContentBrowseResetEvent().fire();
                    }
                }
            }
        ).catch((reason: any) => {
            DefaultErrorHandler.handle(reason);
        });
    }

    private buildAggregationsQuery(): ContentQuery {
        var contentQuery: ContentQuery = new ContentQuery();
        contentQuery.setQueryExpr(new QueryExpr(null));
        contentQuery.setSize(0);

        this.appendInboundQueryExpr(contentQuery);
        this.appendContentTypesAggregationQuery(contentQuery);
        this.appendLastModifiedAggregationQuery(contentQuery);
        this.appendOutboundReferencesFilter(contentQuery);

        return contentQuery;
    }

    private appendQueryExpression(searchInputValues: SearchInputValues, contentQuery: ContentQuery) {
        var fulltextSearchExpression = this.makeFulltextSearchExpr(searchInputValues),
            query: QueryExpr;

        if (this.dependenciesSection.isActive() && this.dependenciesSection.isInbound()) {
            query = new QueryExpr(new LogicalExpr(fulltextSearchExpression, LogicalOperator.AND, this.makeInboundDependenciesSearchExpr()));
        } else {
            query = new QueryExpr(fulltextSearchExpression);
        }

        contentQuery.setQueryExpr(query);
    }

    private makeInboundDependenciesSearchExpr(): Expression {
        var dependencyId = this.dependenciesSection.getDependencyId().toString();

        var query: QueryExpr = new QueryExpr(new LogicalExpr(
            CompareExpr.eq(new FieldExpr(QueryField.REFERENCES), ValueExpr.string(dependencyId)),
            LogicalOperator.AND,
            CompareExpr.neq(new FieldExpr(QueryField.ID), ValueExpr.string(dependencyId))));

        return query;
    }

    private makeFulltextSearchExpr(searchInputValues: SearchInputValues): Expression {

        var searchString: string = searchInputValues.getTextSearchFieldValue();

        return new FulltextSearchExpressionBuilder().setSearchString(
            searchString).addField(new QueryField(QueryField.DISPLAY_NAME, 5)).addField(new QueryField(QueryField.NAME, 3)).addField(
            new QueryField(QueryField.ALL)).build();
    }

    private appendContentTypeFilter(searchInputValues: SearchInputValues, contentQuery: ContentQuery): void {
        var selectedBuckets: Bucket[] = searchInputValues.getSelectedValuesForAggregationName(
            ContentBrowseFilterPanel.CONTENT_TYPE_AGGREGATION_NAME);

        var contentTypeNames: ContentTypeName[] = this.parseContentTypeNames(selectedBuckets);

        contentQuery.setContentTypeNames(contentTypeNames);
    }

    private appendInboundQueryExpr(contentQuery: ContentQuery): void {
        if (!!this.dependenciesSection && this.dependenciesSection.isActive() && this.dependenciesSection.isInbound()) {
            contentQuery.setQueryExpr(new QueryExpr(this.makeInboundDependenciesSearchExpr()));
        }
    }

    private appendOutboundReferencesFilter(contentQuery: ContentQuery): void {
        if (!!this.dependenciesSection && this.dependenciesSection.isActive() && !this.dependenciesSection.isInbound()) {
            contentQuery.setMustBeReferencedById(this.dependenciesSection.getDependencyId());
        }
    }

    private appendLastModifiedQuery(searchInputValues: SearchInputValues): Filter {

        var lastModifiedSelectedBuckets: Bucket[] = searchInputValues.getSelectedValuesForAggregationName(
            ContentBrowseFilterPanel.LAST_MODIFIED_AGGREGATION_NAME);

        if (lastModifiedSelectedBuckets == null || lastModifiedSelectedBuckets.length == 0) {
            return null;
        }

        if (lastModifiedSelectedBuckets.length == 1) {
            var dateRangeBucket: DateRangeBucket = <DateRangeBucket> lastModifiedSelectedBuckets.pop();
            return new RangeFilter(QueryField.MODIFIED_TIME, ValueExpr.dateTime(dateRangeBucket.getFrom()).getValue(),
                null);
        }

        var booleanFilter: BooleanFilter = new BooleanFilter();

        lastModifiedSelectedBuckets.forEach((selectedBucket: DateRangeBucket) => {
            var rangeFilter: RangeFilter =
                new RangeFilter(QueryField.MODIFIED_TIME, ValueExpr.dateTime(selectedBucket.getFrom()).getValue(),
                    null);

            booleanFilter.addShould(<Filter>rangeFilter);
        });

        return booleanFilter;
    }

    private parseContentTypeNames(buckets: Bucket[]): ContentTypeName[] {
        var contentTypeNames: ContentTypeName[] = [];

        if (buckets) {
            for (var i = 0; i < buckets.length; i++) {
                var bucket: Bucket = buckets[i];
                contentTypeNames.push(new ContentTypeName(bucket.getKey()));
            }
        }

        return contentTypeNames;
    }

    private appendContentTypesAggregationQuery(contentQuery) {
        contentQuery.addAggregationQuery(this.createTermsAggregation((ContentBrowseFilterPanel.CONTENT_TYPE_AGGREGATION_NAME),
            QueryField.CONTENT_TYPE, 0));
    }

    private createTermsAggregation(name: string, fieldName: string, size: number): TermsAggregationQuery {
        var termsAggregation = new TermsAggregationQuery(name);
        termsAggregation.setFieldName(fieldName);
        termsAggregation.setSize(size);
        termsAggregation.setOrderByType(TermsAggregationOrderType.DOC_COUNT);
        termsAggregation.setOrderByDirection(TermsAggregationOrderDirection.DESC);
        return termsAggregation;
    }

    private appendLastModifiedAggregationQuery(contentQuery: ContentQuery) {

        var dateRangeAgg = new DateRangeAggregationQuery((ContentBrowseFilterPanel.LAST_MODIFIED_AGGREGATION_NAME));
        dateRangeAgg.setFieldName(QueryField.MODIFIED_TIME);
        dateRangeAgg.addRange(new DateRange("now-1h", null, "< 1 hour"));
        dateRangeAgg.addRange(new DateRange("now-1d", null, "< 1 day"));
        dateRangeAgg.addRange(new DateRange("now-1w", null, "< 1 week"));

        contentQuery.addAggregationQuery(dateRangeAgg);
    }

    private toggleAggregationsVisibility(aggregations: Aggregation[]) {
        aggregations.forEach((aggregation: BucketAggregation) => {
            var aggregationIsEmpty = !aggregation.getBuckets().some((bucket: Bucket) => {
                if (bucket.docCount > 0) {
                    return true;
                }
            })

            var aggregationGroupView = aggregation.getName() == ContentBrowseFilterPanel.CONTENT_TYPE_AGGREGATION_NAME
                ? this.contentTypeAggregation
                : this.lastModifiedAggregation;

            if (aggregationIsEmpty) {
                aggregationGroupView.hide();
            }
            else {
                aggregationGroupView.show();
            }
        })
    }

}

export class DependenciesSection extends DivEl {

    private inboundLabel: LabelEl = new LabelEl("Inbound Dependencies");
    private outboundLabel: LabelEl = new LabelEl("Outbound Dependencies");

    private dependencyItem: ContentSummary;
    private viewer: ContentSummaryViewer = new ContentSummaryViewer();

    private inbound: boolean = true;

    private closeButton: ActionButton;
    private closeCallback: () => void;

    constructor(closeCallback?: () => void) {
        super("dependencies-filter-section");

        this.checkVisibilityState();

        this.closeCallback = closeCallback;

        this.inboundLabel.setVisible(false);
        this.outboundLabel.setVisible(false);
        this.appendChildren(this.inboundLabel, this.outboundLabel);

        this.viewer.addClass("dependency-item");
        this.appendChild(this.viewer);

        this.closeButton = this.appendCloseButton();
    }

    private appendCloseButton(): ActionButton {
        var action = new Action("").onExecuted(() => {
            this.dependencyItem = null;
            this.checkVisibilityState();

            if (!!this.closeCallback) {
                this.closeCallback();
            }
        });
        var button = new ActionButton(action);

        button.addClass("btn-close");
        this.appendChild(button);

        return button;
    }

    public reset() {
        this.dependencyItem = null;
        this.checkVisibilityState();
    }

    public getDependencyId(): ContentId {
        return this.dependencyItem.getContentId();
    }

    public getDependencyItem(): ContentSummary {
        return this.dependencyItem;
    }

    private checkVisibilityState() {
        this.setVisible(this.isActive());
    }

    public isActive(): boolean {
        return !!this.dependencyItem;
    }

    public isInbound(): boolean {
        return this.inbound;
    }

    public setItem(item: ContentSummary, inbound: boolean) {

        this.inbound = inbound;
        this.showRelevantLabel();

        this.dependencyItem = item;

        if (!!item) {
            this.viewer.setObject(item);
        }

        this.checkVisibilityState();
    }

    private showRelevantLabel() {
        this.inboundLabel.setVisible(this.inbound);
        this.outboundLabel.setVisible(!this.inbound);
    }
}
