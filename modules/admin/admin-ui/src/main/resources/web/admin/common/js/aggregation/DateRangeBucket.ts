import {DateRangeBucketJson} from "./DateRangeBucketJson";
import {Bucket} from "./Bucket";

export class DateRangeBucket extends Bucket {

        private from: Date;
        private to: Date;

        constructor(key: string, docCount: number) {
            super(key, docCount);
        }

        public getFrom(): Date {
            return this.from;
        }

        public getTo(): Date {
            return this.to;
        }

        public static fromDateRangeJson(json: DateRangeBucketJson): DateRangeBucket {

            var dateRangeBucket: DateRangeBucket = new DateRangeBucket(json.key, json.docCount);
            dateRangeBucket.from = json.from;
            dateRangeBucket.to = json.to;

            return dateRangeBucket;
        }

    }

