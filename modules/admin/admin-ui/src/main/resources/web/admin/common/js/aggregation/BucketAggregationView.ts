import {AggregationView} from "./AggregationView";
import {BucketAggregation} from "./BucketAggregation";
import {BucketView} from "./BucketView";
import {AggregationGroupView} from "./AggregationGroupView";
import {Bucket} from "./Bucket";
import {BucketViewSelectionChangedEvent} from "./BucketViewSelectionChangedEvent";
import {Aggregation} from "./Aggregation";

export class BucketAggregationView extends AggregationView {

        private bucketAggregation: BucketAggregation;

        private bucketViews: BucketView[] = [];

        private showBucketView: boolean;

        constructor(bucketAggregation: BucketAggregation, parentGroupView: AggregationGroupView) {
            super(bucketAggregation, parentGroupView);

            this.bucketAggregation = bucketAggregation;

            this.showBucketView = false;
            this.bucketAggregation.getBuckets().forEach((bucket: Bucket) => {
                this.addBucket(new BucketView(bucket, this, false, this.getDisplayNameForName(bucket.getKey())));
                if (bucket.getDocCount() > 0) {
                    this.showBucketView = true;
                }

            });

            if (!this.showBucketView) {
                this.hide();
            }
        }

        setDisplayNames(): void {
            this.bucketViews.forEach((bucketView: BucketView) => {
                bucketView.setDisplayName(this.getDisplayNameForName(bucketView.getName()));
            })
        }

        hasSelectedEntry(): boolean {
            var isSelected: boolean = false;
            this.bucketViews.forEach((bucketView: BucketView) => {
                if (bucketView.isSelected()) {
                    isSelected = true;
                }
            });
            return isSelected;
        }

        private addBucket(bucketView: BucketView) {
            this.appendChild(bucketView);
            bucketView.onSelectionChanged((event: BucketViewSelectionChangedEvent) => {
                    this.notifyBucketViewSelectionChanged(event);
                }
            );
            this.bucketViews.push(bucketView);
        }

        getSelectedValues(): Bucket[] {

            var selectedBuckets: Bucket[] = [];

            this.bucketViews.forEach((bucketView: BucketView) => {
                if (bucketView.isSelected()) {
                    selectedBuckets.push(bucketView.getBucket());
                }
            });

            return selectedBuckets;
        }

        deselectFacet(supressEvent?: boolean) {
            this.bucketViews.forEach((bucketView: BucketView) => {
                bucketView.deselect(supressEvent);
            });
        }

        update(aggregation: Aggregation) {

            var selectedBucketNames: string[] = this.getSelectedBucketNames();

            this.bucketAggregation = <BucketAggregation> aggregation;
            this.bucketViews = [];
            this.removeChildren();

            var anyBucketVisible = false;

            this.bucketAggregation.getBuckets().forEach((bucket: Bucket) => {

                var wasSelected: boolean = (wemjq.inArray(bucket.getKey(), selectedBucketNames)) > -1;

                var bucketView: BucketView = new BucketView(bucket, this, wasSelected,
                    this.getDisplayNameForName(bucket.getKey()));

                this.addBucket(bucketView);

                if (bucket.getDocCount() > 0 || wasSelected) {
                    anyBucketVisible = true;
                }

            });

            this.showBucketView = anyBucketVisible;

            if (!this.showBucketView) {
                this.hide();
            }
            else if (!this.isVisible()) {
                this.show();
            }
        }

        private getSelectedBucketNames(): string[] {

            var selectedBucketNames: string[] = [];

            var selectedBuckets: Bucket[] = this.getSelectedValues();

            selectedBuckets.forEach((bucket: Bucket) => {
                selectedBucketNames.push(bucket.getKey());
            });

            return selectedBucketNames;
        }
    }
