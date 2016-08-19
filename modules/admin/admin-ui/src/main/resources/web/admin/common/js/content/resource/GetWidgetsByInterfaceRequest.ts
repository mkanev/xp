import {WidgetDescriptorJson} from "../json/WidgetDescriptorJson";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {Widget} from "../Widget";
import {WidgetDescriptorResourceRequest} from "./WidgetDescriptorResourceRequest";

export class GetWidgetsByInterfaceRequest extends WidgetDescriptorResourceRequest<WidgetDescriptorJson[], any> {

        private widgetInterfaces: string[];

        constructor(widgetInterfaces: string[]) {
            super();
            super.setMethod("POST");
            this.widgetInterfaces = widgetInterfaces;
        }

        getParams(): Object {
            return this.widgetInterfaces;
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "list/byinterfaces");
        }

        sendAndParse(): wemQ.Promise<Widget[]> {

            return this.send().then((response: JsonResponse<WidgetDescriptorJson[]>) => {
                return WidgetDescriptorResourceRequest.fromJson(response.getResult());
            });
        }
    }
