import {AggregationQueryTypeWrapperJson} from "./AggregationQueryTypeWrapperJson";
import {ClassHelper} from "../../ClassHelper";
import {AggregationQueryJson} from "./AggregationQueryJson";

export class AggregationQuery {

        private name: string;

        toJson(): AggregationQueryTypeWrapperJson {
            throw new Error("Must be implemented by inheritor: " + ClassHelper.getClassName(this));
        }

        toAggregationQueryJson(): AggregationQueryJson {

            return {
                "name": this.getName()
            };
        }

        constructor(name: string) {
            this.name = name;
        }

        public getName(): string {
            return this.name;
        }

    }
