import {ResourceRequest} from "../../rest/ResourceRequest";
import {Path} from "../../rest/Path";
import {WidgetDescriptorJson} from "../json/WidgetDescriptorJson";
import {Widget} from "../Widget";

export class WidgetDescriptorResourceRequest<JSON_TYPE, PARSED_TYPE> extends ResourceRequest<JSON_TYPE, PARSED_TYPE> {

        private resourcePath: Path;


        constructor() {
            super();
            this.resourcePath = Path.fromParent(super.getRestPath(), "widget");
        }

        getResourcePath(): Path {
            return this.resourcePath;
        }

        static fromJson(json: WidgetDescriptorJson[]): Widget[] {
            var result: Widget[] = [];
            json.forEach((widgetDescriptor: WidgetDescriptorJson) => {
                result.push(new Widget(widgetDescriptor.url,
                    widgetDescriptor.displayName,
                    widgetDescriptor.interfaces,
                    widgetDescriptor.key));
            });
            return result;
        }
    }
