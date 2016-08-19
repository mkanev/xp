import {ChildOrderJson} from "./ChildOrderJson";
import {SetOrderUpdateJson} from "./SetOrderUpdateJson";

export interface SetChildOrderJson extends SetOrderUpdateJson {

        childOrder: ChildOrderJson;

    }
