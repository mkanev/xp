import {DivEl} from "../dom/DivEl";
import {AggregationView} from "./AggregationView";
import {H2El} from "../dom/H2El";
import {BucketViewSelectionChangedEvent} from "./BucketViewSelectionChangedEvent";
import {Aggregation} from "./Aggregation";
import {AggregationSelection} from "./AggregationSelection";
import {BucketAggregationView} from "./BucketAggregationView";
import {Bucket} from "./Bucket";
import {ObjectHelper} from "../ObjectHelper";

export class AggregationGroupView extends DivEl {

        private name: string;

        private displayName: string;

        private aggregationViews: AggregationView[] = [];

        private titleEl = new H2El();

        private bucketSelectionChangedListeners: Function[] = [];

        constructor(name: string, displayName: string) {
            super("aggregation-group-view");

            this.name = name;
            this.displayName = displayName;

            this.titleEl.getEl().setInnerHtml(this.displayName);
            this.appendChild(this.titleEl);
        }

        private addAggregationView(aggregationView: AggregationView) {
            this.appendChild(aggregationView);

            aggregationView.onBucketViewSelectionChanged((event: BucketViewSelectionChangedEvent) => {
                    this.notifyBucketViewSelectionChanged(event);
                }
            );

            this.aggregationViews.push(aggregationView);
        }

        initialize(): void {

        }

        getAggregationViews(): AggregationView[] {
            return this.aggregationViews;
        }

        getName(): string {
            return this.name;
        }

        /*
         * Override this method to give other criteria for this group to display given facet.
         */
        handlesAggregation(aggregation: Aggregation) {

            return aggregation.getName() == this.name;
        }

        getSelectedValuesByAggregationName(): AggregationSelection[] {

            var aggregationSelections: AggregationSelection[] = [];

            this.aggregationViews.forEach((bucketAggregationView: BucketAggregationView) => {

                var selectedBuckets: Bucket[] = bucketAggregationView.getSelectedValues();

                if (selectedBuckets != null) {
                    var aggregationSelection: AggregationSelection = new AggregationSelection(bucketAggregationView.getName());
                    aggregationSelection.setValues(selectedBuckets);

                    aggregationSelections.push(aggregationSelection);
                }
            });

            return aggregationSelections;
        }

        hasSelections(): boolean {
            var hasSelections = false;
            for (var i = 0; i < this.aggregationViews.length; i++) {
                if (this.aggregationViews[i].hasSelectedEntry()) {
                    hasSelections = true;
                    break;
                }
            }
            return hasSelections;
        }

        deselectGroup(supressEvent?: boolean) {

            this.aggregationViews.forEach((aggregationView: AggregationView) => {
                aggregationView.deselectFacet(supressEvent);
            });
        }

        onBucketViewSelectionChanged(listener: (event: BucketViewSelectionChangedEvent) => void) {
            this.bucketSelectionChangedListeners.push(listener);
        }

        unBucketViewSelectionChanged(listener: (event: BucketViewSelectionChangedEvent) => void) {
            this.bucketSelectionChangedListeners = this.bucketSelectionChangedListeners.filter(function (curr) {
                return curr != listener;
            });
        }

        notifyBucketViewSelectionChanged(event: BucketViewSelectionChangedEvent) {

            this.bucketSelectionChangedListeners.forEach((listener: (event: BucketViewSelectionChangedEvent) => void) => {
                listener(event);
            });
        }

        update(aggregations: Aggregation[]) {

            aggregations.forEach((aggregation: Aggregation) => {

                var existingAggregationView: AggregationView = this.getAggregationView(aggregation.getName());

                if (existingAggregationView == null) {
                    this.addAggregationView(AggregationView.createAggregationView(aggregation, this));
                }
                else {
                    if (ObjectHelper.iFrameSafeInstanceOf(existingAggregationView, BucketAggregationView)) {

                        var bucketAggregationView: BucketAggregationView = <BucketAggregationView>existingAggregationView;
                        bucketAggregationView.update(aggregation);
                    }
                    // Here be Metric-aggregations
                }
            });
        }

        private getAggregationView(name: string): AggregationView {

            for (var i = 0; i < this.aggregationViews.length; i++) {
                var aggregationView: AggregationView = this.aggregationViews[i];
                if (aggregationView.getName() == name) {
                    return aggregationView;
                }
            }
            return null;
        }
    }

