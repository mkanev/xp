import {LoadMask} from "../ui/mask/LoadMask";
import {ElementRenderedEvent} from "../dom/ElementRenderedEvent";
import {GetAllContentTypesRequest} from "../schema/content/GetAllContentTypesRequest";
import {ContentTypeSummary} from "../schema/content/ContentTypeSummary";
import {AggregationView} from "./AggregationView";
import {AggregationGroupView} from "./AggregationGroupView";

export class ContentTypeAggregationGroupView extends AggregationGroupView {

        initialize() {

            var displayNameMap: {[name:string]:string} = {};

            var mask: LoadMask = new LoadMask(this);
            this.appendChild(mask);
            this.onRendered((event: ElementRenderedEvent) => {
                mask.show();
            });

            var request = new GetAllContentTypesRequest();
            request.sendAndParse().done((contentTypes: ContentTypeSummary[]) => {

                contentTypes.forEach((contentType: ContentTypeSummary)=> {
                    displayNameMap[contentType.getName().toLowerCase()] = contentType.getDisplayName();
                });

                this.getAggregationViews().forEach((aggregationView: AggregationView)=> {
                    aggregationView.setDisplayNamesMap(displayNameMap);
                });
                mask.remove();
            });

        }


    }

