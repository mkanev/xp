import {ApplicationKey} from "../../application/ApplicationKey";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {Mixin} from "./Mixin";
import {MixinJson} from "./MixinJson";
import {MixinListJson} from "./MixinListJson";
import {MixinResourceRequest} from "./MixinResourceRequest";

export class GetMixinsByApplicationRequest extends MixinResourceRequest<MixinListJson, Mixin[]> {

        private applicationKey: ApplicationKey;

        constructor(applicationKey: ApplicationKey) {
            super();
            super.setMethod("GET");
            this.applicationKey = applicationKey;
        }

        getParams(): Object {
            return {
                applicationKey: this.applicationKey.toString()
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "byApplication");
        }

        sendAndParse(): wemQ.Promise<Mixin[]> {

            return this.send().then((response: JsonResponse<MixinListJson>) => {
                return response.getResult().mixins.map((mixinJson: MixinJson) => {
                    return this.fromJsonToMixin(mixinJson);
                })
            });
        }
    }
