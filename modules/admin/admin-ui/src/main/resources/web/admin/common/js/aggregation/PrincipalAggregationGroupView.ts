import {LoadMask} from "../ui/mask/LoadMask";
import {ElementRenderedEvent} from "../dom/ElementRenderedEvent";
import {AggregationGroupView} from "./AggregationGroupView";

export class PrincipalAggregationGroupView extends AggregationGroupView {

        initialize() {

            var displayNameMap: string[] = [];

            var mask: LoadMask = new LoadMask(this);
            this.appendChild(mask);
            this.onRendered((event: ElementRenderedEvent) => {
                mask.show();
            });

            // displayNameMap["user"] = "User";
            //  displayNameMap["group"] = "Group";
            mask.remove();


        }


    }

