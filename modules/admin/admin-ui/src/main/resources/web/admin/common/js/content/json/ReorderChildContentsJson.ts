import {ChildOrderJson} from "./ChildOrderJson";
import {ReorderChildContentJson} from "./ReorderChildContentJson";
import {SetOrderUpdateJson} from "./SetOrderUpdateJson";

export interface ReorderChildContentsJson extends SetOrderUpdateJson {

        manualOrder: boolean;

        childOrder: ChildOrderJson;

        reorderChildren: ReorderChildContentJson[];

    }
