import {ContentId} from "../ContentId";
import {Equitable} from "../../Equitable";
import {ObjectHelper} from "../../ObjectHelper";

export class PageTemplateKey extends ContentId {

        public static fromContentId(id: ContentId): PageTemplateKey {

            return new PageTemplateKey(id.toString());
        }

        public static fromString(s: string): PageTemplateKey {

            return new PageTemplateKey(s);
        }

        constructor(s: string) {
            super(s);
        }

        equals(o: Equitable): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, PageTemplateKey)) {
                return false;
            }

            var other = <PageTemplateKey>o;
            return super.equals(other);
        }
    }
