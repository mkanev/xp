import {OrderExprJson} from "../json/OrderExprJson";
import {Equitable} from "../../Equitable";
import {ObjectHelper} from "../../ObjectHelper";
import {OrderExpr} from "./OrderExpr";
import {OrderExprBuilder} from "./OrderExpr";

export class FieldOrderExpr extends OrderExpr {

        private fieldName: string;

        constructor(builder: FieldOrderExprBuilder) {
            super(builder);
            this.fieldName = builder.fieldName;
        }

        getFieldName(): string {
            return this.fieldName;
        }

        toJson(): OrderExprJson {
            return {
                "fieldName": this.fieldName,
                "direction": this.getDirection()
            };
        }

        toString() {
            return this.fieldName + " " + super.getDirection();
        }

        equals(o: Equitable): boolean {
            if (!super.equals(o)) {
                return false;
            }
            if (!ObjectHelper.iFrameSafeInstanceOf(o, FieldOrderExpr)) {
                return false;
            }
            var other = <FieldOrderExpr>o;
            if (this.fieldName.toLowerCase() != other.getFieldName().toLowerCase()) {
                return false;
            }
            return true;
        }
    }

    export class FieldOrderExprBuilder extends OrderExprBuilder {

        fieldName: string;

        constructor(json?: OrderExprJson) {
            super(json);
            if (json) {
                this.fieldName = json.fieldName;
            }
        }

        public setFieldName(value: string): FieldOrderExprBuilder {
            this.fieldName = value;
            return this;
        }

        public build(): FieldOrderExpr {
            return new FieldOrderExpr(this);
        }
    }
