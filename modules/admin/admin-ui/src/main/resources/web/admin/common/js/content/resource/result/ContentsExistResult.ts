import {ContentsExistJson} from "../../json/ContentsExistJson";

export class ContentsExistResult {

        private contentsExistMap: Object = {}

        constructor(json: ContentsExistJson) {
            json.contentsExistJson.forEach(item => {
                this.contentsExistMap[item.contentId] = item.exists;
            });
        }

        contentExists(id: string): boolean {
            return this.contentsExistMap.hasOwnProperty(id) && this.contentsExistMap[id];
        }
    }
