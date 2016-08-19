import {ContentPermissionsJson as ContentsPermissionsEntryJson} from "../../content/json/ContentPermissionsJson";
import {Equitable} from "../../Equitable";
import {Cloneable} from "../../Cloneable";
import {ContentId} from "../../content/ContentId";
import {ObjectHelper} from "../../ObjectHelper";
import {AccessControlEntryJson} from "./AccessControlEntryJson";
import {AccessControlEntry} from "./AccessControlEntry";
import {AccessControlList} from "./AccessControlList";

export class ContentAccessControlList extends AccessControlList implements Equitable, Cloneable {

        private contentId: ContentId;

        constructor(id: string, entries?: AccessControlEntry[]) {
            this.contentId = new ContentId(id);
            super(entries);
        }

        getContentId(): ContentId {
            return this.contentId;
        }

        toString(): string {
            return this.contentId.toString() + ': ' + super.toString();
        }

        equals(o: Equitable): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, ContentAccessControlList)) {
                return false;
            }

            var other = <ContentAccessControlList>o;
            return this.contentId.equals(other.getContentId()) &&
                   ObjectHelper.arrayEquals(this.getEntries().sort(), other.getEntries().sort());
        }

        clone(): ContentAccessControlList {
            return new ContentAccessControlList(this.contentId.toString(), super.clone().getEntries());
        }

        static fromJson(json: ContentsPermissionsEntryJson): ContentAccessControlList {
            var cacl = new ContentAccessControlList(json.contentId);
            json.permissions.forEach((entryJson: AccessControlEntryJson) => {
                var entry = AccessControlEntry.fromJson(entryJson);
                cacl.add(entry);
            });
            return cacl;
        }
    }
