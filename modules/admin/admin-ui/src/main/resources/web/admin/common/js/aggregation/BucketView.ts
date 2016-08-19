import {DivEl} from "../dom/DivEl";
import {Bucket} from "./Bucket";
import {Checkbox} from "../ui/Checkbox";
import {AggregationView} from "./AggregationView";
import {ValueChangedEvent} from "../ValueChangedEvent";
import {StringHelper} from "../util/StringHelper";
import {BucketViewSelectionChangedEvent} from "./BucketViewSelectionChangedEvent";

export class BucketView extends DivEl {

        private bucket: Bucket;

        private checkbox: Checkbox;

        private parentAggregationView: AggregationView;

        private selectionChangedListeners: Function[] = [];

        private displayName: string;

        constructor(bucket: Bucket, parentAggregationView: AggregationView, select: boolean,
                    displayName?: string) {

            super('aggregation-bucket-view');
            this.bucket = bucket;
            this.parentAggregationView = parentAggregationView;
            this.displayName = displayName;

            this.checkbox = Checkbox.create().setLabelText(this.resolveLabelValue()).setChecked(select).build();

            this.checkbox.onValueChanged((event: ValueChangedEvent) => {
                this.notifySelectionChanged(eval(event.getOldValue()), eval(event.getNewValue()));
            });
            this.appendChild(this.checkbox);

            this.updateUI();
        }

        private resolveLabelValue(): string {

            if (this.displayName != null) {
                return this.displayName + ' (' + this.bucket.getDocCount() + ')';
            }

            return this.resolveKey() + ' (' + this.bucket.getDocCount() + ')';
        }

        private resolveKey(): string {
            var key = this.bucket.getKey();
            if (key.indexOf(":") > 0) {
                return StringHelper.capitalize(key.substring(key.indexOf(":") + 1));
            }

            return key;
        }

        setDisplayName(displayName: string) {
            this.displayName = displayName;
            this.updateLabel();
        }

        private updateLabel(): void {
            this.checkbox.setLabel(this.resolveLabelValue());
        }

        getBucket(): Bucket {
            return this.bucket;
        }

        getName(): string {
            return this.bucket.getKey();
        }

        update(bucket: Bucket) {
            this.bucket = bucket;
            this.updateUI();
        }

        isSelected(): boolean {
            return this.checkbox.isChecked();
        }

        deselect(supressEvent?: boolean) {
            this.checkbox.setChecked(false, supressEvent);
        }

        private updateUI() {

            this.updateLabel();

            if (this.bucket.getDocCount() > 0 || this.isSelected()) {
                this.show();
            } else {
                this.hide();
            }
        }

        getParentAggregationView() {
            return this.parentAggregationView;
        }

        notifySelectionChanged(oldValue: boolean, newValue: boolean) {

            this.selectionChangedListeners.forEach((listener: (event: BucketViewSelectionChangedEvent) => void) => {
                listener(new BucketViewSelectionChangedEvent(oldValue, newValue, this));
            });
        }

        unSelectionChanged(listener: (event: BucketViewSelectionChangedEvent) => void) {
            this.selectionChangedListeners = this.selectionChangedListeners.filter(function (curr) {
                return curr != listener;
            });
        }

        onSelectionChanged(listener: (event: BucketViewSelectionChangedEvent) => void) {
            this.selectionChangedListeners.push(listener);
        }

    }
