import {Panel} from "../../../ui/panel/Panel";
import {AggregationContainer} from "../../../aggregation/AggregationContainer";
import {TextSearchField} from "./TextSearchField";
import {ClearFilterButton} from "./ClearFilterButton";
import {SpanEl} from "../../../dom/SpanEl";
import {Aggregation} from "../../../aggregation/Aggregation";
import {AggregationGroupView} from "../../../aggregation/AggregationGroupView";
import {DivEl} from "../../../dom/DivEl";
import {BucketViewSelectionChangedEvent} from "../../../aggregation/BucketViewSelectionChangedEvent";
import {KeyBindings} from "../../../ui/KeyBindings";
import {KeyBinding} from "../../../ui/KeyBinding";
import {SearchInputValues} from "../../../query/SearchInputValues";
import {Element} from "../../../dom/Element";

export class BrowseFilterPanel extends Panel {

        private searchStartedListeners: {():void}[] = [];

        private resetListeners: {():void}[] = [];

        private hideFilterPanelButtonClickedListeners: {():void}[] = [];

        private showResultsButtonClickedListeners: {():void}[] = [];

        private aggregationContainer: AggregationContainer;

        private searchField: TextSearchField;

        private clearFilter: ClearFilterButton;

        private hitsCounterEl: SpanEl;

        private hideFilterPanelButton: SpanEl;

        private showResultsButton: SpanEl;

        protected filterPanelRefreshNeeded: boolean = false;

        private refreshStartedListeners: {():void}[] = [];

        constructor(aggregations?: Aggregation[], groupViews?: AggregationGroupView[]) {
            super();
            this.addClass('filter-panel');

            this.hideFilterPanelButton = new SpanEl("hide-filter-panel-button icon-search");
            this.hideFilterPanelButton.onClicked(() => this.notifyHidePanelButtonPressed());

            var showResultsButtonWrapper = new DivEl("show-filter-results");
            this.showResultsButton = new SpanEl("show-filter-results-button");
            this.showResultsButton.setHtml("Show results");
            this.showResultsButton.onClicked(() => this.notifyShowResultsButtonPressed());
            showResultsButtonWrapper.appendChild(this.showResultsButton);

            this.searchField = new TextSearchField('Search');
            this.searchField.onValueChanged(() => {
                this.search(this.searchField);
            });

            this.clearFilter = new ClearFilterButton();
            this.clearFilter.onClicked((event: MouseEvent) => {
                this.reset();
            });

            this.hitsCounterEl = new SpanEl("hits-counter");

            var hitsCounterAndClearButtonWrapper = new DivEl("hits-and-clear");
            hitsCounterAndClearButtonWrapper.appendChildren(this.clearFilter, this.hitsCounterEl);

            this.aggregationContainer = new AggregationContainer();
            this.appendChild(this.aggregationContainer);

            if (groupViews != null) {
                groupViews.forEach((aggregationGroupView: AggregationGroupView) => {

                        aggregationGroupView.onBucketViewSelectionChanged((event: BucketViewSelectionChangedEvent) => {
                            this.search(event.getBucketView());
                        });

                        this.aggregationContainer.addAggregationGroupView(aggregationGroupView);
                    }
                );
            }

            this.onRendered((event) => {
                this.appendChild(this.hideFilterPanelButton);
                this.appendExtraSection();
                this.appendChild(this.searchField);
                this.appendChild(hitsCounterAndClearButtonWrapper);
                this.appendChild(this.aggregationContainer);
                this.appendChild(showResultsButtonWrapper);

                this.showResultsButton.hide();

                KeyBindings.get().bindKey(new KeyBinding("/", (e: ExtendedKeyboardEvent) => {
                    setTimeout(this.giveFocusToSearch.bind(this), 100);
                }).setGlobal(true));
            })
        }

        protected appendExtraSection() {
        }

        setRefreshOfFilterRequired() {
            this.filterPanelRefreshNeeded = true;
        }

        giveFocusToSearch() {
            this.searchField.giveFocus();
        }

        updateAggregations(aggregations: Aggregation[], doUpdateAll?: boolean) {
            this.aggregationContainer.updateAggregations(aggregations, doUpdateAll);
        }

        getSearchInputValues(): SearchInputValues {

            var searchInputValues: SearchInputValues = new SearchInputValues();

            searchInputValues.setAggregationSelections(this.aggregationContainer.getSelectedValuesByAggregationName());
            searchInputValues.setTextSearchFieldValue(this.searchField.getEl().getValue());

            return searchInputValues;
        }

        hasFilterSet(): boolean {
            return this.aggregationContainer.hasSelectedBuckets() || this.hasSearchStringSet();
        }

        hasSearchStringSet(): boolean {
            return this.searchField.getHTMLElement()['value'].trim() != '';
        }

        search(elementChanged?: Element) {
            if (this.hasFilterSet()) {
                this.clearFilter.show();
            }
            else {
                this.clearFilter.hide();
            }
            this.notifySearchStarted();
            this.doSearch(elementChanged);
        }

        doSearch(elementChanged?: Element) {
            return;
        }

        refresh() {
            if (this.filterPanelRefreshNeeded) {
                this.notifyRefreshStarted();
                this.doRefresh();
                this.filterPanelRefreshNeeded = false;
            }
        }

        doRefresh() {
            return;
        }

        reset(silent: boolean = false) {
            this.searchField.clear(true);
            this.aggregationContainer.deselectAll(true);
            this.clearFilter.hide();
            if (!silent) {
                this.notifyReset();
            }
        }

        deselectAll() {
            this.aggregationContainer.deselectAll(true);
        }

        onSearchStarted(listener: ()=> void) {
            this.searchStartedListeners.push(listener);
        }

        onReset(listener: ()=> void) {
            this.resetListeners.push(listener);
        }

        onRefreshStarted(listener: ()=> void) {
            this.refreshStartedListeners.push(listener);
        }

        unRefreshStarted(listener: ()=>void) {
            this.refreshStartedListeners = this.refreshStartedListeners.filter((currentListener: ()=> void) => {
                return currentListener != listener;
            });
        }

        unSearchStarted(listener: ()=> void) {
            this.searchStartedListeners = this.searchStartedListeners.filter((currentListener: ()=> void) => {
                return currentListener != listener;
            });
        }

        unReset(listener: ()=> void) {
            this.resetListeners = this.resetListeners.filter((currentListener: ()=>void) => {
                return currentListener != listener;
            });

        }

        onHideFilterPanelButtonClicked(listener: ()=> void) {
            this.hideFilterPanelButtonClickedListeners.push(listener);
        }

        onShowResultsButtonClicked(listener: ()=> void) {
            this.showResultsButtonClickedListeners.push(listener);
        }

        private notifySearchStarted() {
            this.searchStartedListeners.forEach((listener: ()=> void) => {
                listener.call(this);
            });
        }

        protected notifyRefreshStarted() {
            this.refreshStartedListeners.forEach((listener: ()=> void) => {
                listener.call(this);
            });
        }

        private notifyReset() {
            this.resetListeners.forEach((listener: ()=> void) => {
                listener.call(this);
            });
        }

        private notifyHidePanelButtonPressed() {
            this.hideFilterPanelButtonClickedListeners.forEach((listener: ()=> void) => {
                listener.call(this);
            });
        }

        private notifyShowResultsButtonPressed() {
            this.showResultsButtonClickedListeners.forEach((listener: ()=> void) => {
                listener.call(this);
            });
        }

        updateHitsCounter(hits: number, emptyFilterValue: boolean = false) {
            if (!emptyFilterValue) {
                if (hits != 1) {
                    this.hitsCounterEl.setHtml(hits + " hits");
                }
                else {
                    this.hitsCounterEl.setHtml(hits + " hit");
                }
            } else {
                this.hitsCounterEl.setHtml(hits + " total");
            }

            if (hits != 0) {
                this.showResultsButton.show();
            }
            else {
                this.showResultsButton.hide();
            }
        }
    }

