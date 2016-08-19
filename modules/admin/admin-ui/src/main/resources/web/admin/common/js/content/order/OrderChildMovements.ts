import {ReorderChildContentJson} from "../json/ReorderChildContentJson";
import {ReorderChildContentsJson} from "../json/ReorderChildContentsJson";
import {OrderChildMovement} from "./OrderChildMovement";

export class OrderChildMovements {

        private reorderChildren: OrderChildMovement[] = [];

        getReorderChildren(): OrderChildMovement[] {
            return this.reorderChildren;
        }

        addChildMovement(movement: OrderChildMovement) {
            this.reorderChildren.push(movement);
        }

        toArrayJson(): ReorderChildContentJson[] {
            var result: ReorderChildContentJson[] = [];
            this.reorderChildren.forEach((movement: OrderChildMovement) => {
                result.push(movement.toJson());
            });
            return result;
        }


    }

