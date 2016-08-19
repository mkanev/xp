import {ContentPublishItemJson} from "../../json/ContentPublishItemJson";
import {ResolvePublishContentResultJson} from "../../json/ResolvePublishContentResultJson";
import {ContentId} from "../../ContentId";

export class ResolvePublishDependenciesResult {

        dependentContents: ContentId[];
        requestedContents: ContentId[];
        containsRemovable: boolean;


        constructor(dependants: ContentId[], requested: ContentId[], containsRemovable: boolean) {
            this.dependentContents = dependants;
            this.requestedContents = requested;
            this.containsRemovable = containsRemovable;
        }

        getDependants(): ContentId[] {
            return this.dependentContents;
        }

        getRequested(): ContentId[] {
            return this.requestedContents;
        }

        isContainsRemovable(): boolean {
            return this.containsRemovable;
        }

        static fromJson(json: ResolvePublishContentResultJson): ResolvePublishDependenciesResult {

            let dependants: ContentId[] = json.dependentContents.map(dependant => new ContentId(dependant.id));
            let requested: ContentId[] = json.requestedContents.map(dependant => new ContentId(dependant.id));
            let containsRemovable: boolean = json.containsRemovable;

            return new ResolvePublishDependenciesResult(dependants, requested, containsRemovable);
        }
    }
