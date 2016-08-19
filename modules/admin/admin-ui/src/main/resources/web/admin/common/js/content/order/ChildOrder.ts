import {ChildOrderJson} from "../json/ChildOrderJson";
import {OrderExprJson} from "../json/OrderExprJson";
import {OrderExprWrapperJson} from "../json/OrderExprWrapperJson";
import {Equitable} from "../../Equitable";
import {QueryField} from "../../query/QueryField";
import {ObjectHelper} from "../../ObjectHelper";
import {SetChildOrderJson} from "../json/SetChildOrderJson";
import {ContentId} from "../ContentId";
import {DynamicOrderExpr} from "./DynamicOrderExpr";
import {DynamicOrderExprBuilder} from "./DynamicOrderExpr";
import {FieldOrderExpr} from "./FieldOrderExpr";
import {FieldOrderExprBuilder} from "./FieldOrderExpr";
import {OrderExpr} from "./OrderExpr";

export class ChildOrder implements Equitable {

        private DEFAULT_ORDER_DIRECTION_VALUE: string = "DESC";

        static DEFAULT_ORDER_FIELD_VALUE: string = QueryField.MODIFIED_TIME;

        static ASC_ORDER_DIRECTION_VALUE: string = "ASC";

        static DESC_ORDER_DIRECTION_VALUE: string = "DESC";

        static MANUAL_ORDER_VALUE_KEY: string = QueryField.MANUAL_ORDER_VALUE;

        private orderExpressions: OrderExpr[] = [];

        getOrderExpressions(): OrderExpr[] {
            return this.orderExpressions;
        }

        addOrderExpr(expr: OrderExpr) {
            this.orderExpressions.push(expr);
        }

        addOrderExpressions(expressions: OrderExpr[]) {
            expressions.forEach((expr: OrderExpr) => {
                this.orderExpressions.push(expr);
            });

        }


        static fromJson(childOrderJson: ChildOrderJson): ChildOrder {
            var childOrder: ChildOrder = new ChildOrder();
            childOrderJson.orderExpressions.forEach((orderExprJson: OrderExprWrapperJson) => {
                if (orderExprJson.FieldOrderExpr) {
                    childOrder.orderExpressions.push(new FieldOrderExprBuilder(orderExprJson.FieldOrderExpr).build());
                } else if (orderExprJson.DynamicOrderExpr) {
                    childOrder.orderExpressions.push(new DynamicOrderExprBuilder(orderExprJson.DynamicOrderExpr).build());
                }
            });
            return childOrder;
        }

        isManual(): boolean {
            if (this.orderExpressions.length == 0) {
                return false;
            }
            var order = this.orderExpressions[0];
            if (ObjectHelper.iFrameSafeInstanceOf(order, FieldOrderExpr)) {
                return ObjectHelper.stringEquals(ChildOrder.MANUAL_ORDER_VALUE_KEY.toLowerCase(),
                    (<FieldOrderExpr>order).getFieldName().toLowerCase());
            }
            return false;
        }

        isDesc(): boolean {
            if (this.orderExpressions.length == 0) {
                return this.DEFAULT_ORDER_DIRECTION_VALUE == ChildOrder.DESC_ORDER_DIRECTION_VALUE;
            }
            var order = this.orderExpressions[0];
            return ObjectHelper.stringEquals(ChildOrder.DESC_ORDER_DIRECTION_VALUE.toLowerCase(), order.getDirection().toLowerCase());
        }

        isDefault(): boolean {
            var order = this.orderExpressions[0];
            if (ObjectHelper.iFrameSafeInstanceOf(order, FieldOrderExpr)) {
                var fieldOrder = (<FieldOrderExpr>order);
                if (ObjectHelper.stringEquals(this.DEFAULT_ORDER_DIRECTION_VALUE.toLowerCase(),
                    fieldOrder.getDirection().toLowerCase()) &&
                    ObjectHelper.stringEquals(ChildOrder.DEFAULT_ORDER_FIELD_VALUE.toLowerCase(),
                        fieldOrder.getFieldName().toLowerCase())) {
                    return true;
                }
            }
            return false;
        }

        toJson(): ChildOrderJson {

            return {
                "orderExpressions": OrderExpr.toArrayJson(this.getOrderExpressions())
            };
        }

        toString(): string {
            var result = "";
            this.orderExpressions.forEach((expr: OrderExpr) => {
                result = result.concat(" ", expr.toString());
            });
            return result;
        }

        equals(o: Equitable): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, ChildOrder)) {
                return false;
            }
            var other = <ChildOrder>o;
            if (this.orderExpressions.length != other.getOrderExpressions().length) {
                return false;
            }
            for (var count in this.orderExpressions) {
                if (!this.orderExpressions[count].equals(other.getOrderExpressions()[count])) {
                    return false;
                }
            }

            return true;
        }

        static toSetChildOrderJson(contentId: ContentId, childOrder: ChildOrder, silent: boolean): SetChildOrderJson {
            if (contentId && childOrder) {
                return {
                    "silent": silent,
                    "childOrder": childOrder.toJson(),
                    "contentId": contentId.toString()
                };
            }
        }

    }
