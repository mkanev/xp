import {MixinJson} from "./MixinJson";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {Mixin} from "./Mixin";
import {MixinName} from "./MixinName";
import {MixinResourceRequest} from "./MixinResourceRequest";

export class GetMixinByQualifiedNameRequest extends MixinResourceRequest<MixinJson, Mixin> {

        private name: MixinName;

        constructor(name: MixinName) {
            super();
            super.setMethod("GET");
            this.name = name;
        }

        getParams(): Object {
            return {
                name: this.name.toString()
            };
        }

        getRequestPath(): Path {
            return super.getResourcePath();
        }

        sendAndParse(): wemQ.Promise<Mixin> {

            return this.send().then((response: JsonResponse<MixinJson>) => {
                return this.fromJsonToMixin(response.getResult());
            });
        }
    }
