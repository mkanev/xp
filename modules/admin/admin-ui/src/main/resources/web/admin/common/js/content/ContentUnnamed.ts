import {StringHelper} from "../util/StringHelper";
import {Equitable} from "../Equitable";
import {assert} from "../util/Assert";
import {ObjectHelper} from "../ObjectHelper";
import {ContentName} from "./ContentName";

export class ContentUnnamed extends ContentName implements Equitable {

        public static PRETTY_UNNAMED = "unnamed";

        constructor(name: string) {
            super(name);
            assert(name.indexOf(ContentName.UNNAMED_PREFIX) == 0,
                    "An UnnamedContent must start with [" + ContentName.UNNAMED_PREFIX + "]: " + name);
        }

        isUnnamed(): boolean {
            return true;
        }

        toString(): string {
            return "";
        }

        equals(o: Equitable): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, ContentUnnamed)) {
                return false;
            }

            if (!super.equals(o)) {
                return false;
            }

            return true;
        }

        toStringIncludingHidden() {
            return super.toString();
        }

        public static newUnnamed() {
            return new ContentUnnamed(ContentName.UNNAMED_PREFIX);
        }

        public static prettifyUnnamed(name?: string) {
            if (!name) {
                return `<${ContentUnnamed.PRETTY_UNNAMED}>`;
            }

            let prettifiedName = name.replace(/-/g, " ").trim();
            prettifiedName = StringHelper.capitalizeAll(`${ContentUnnamed.PRETTY_UNNAMED} ${prettifiedName}`);

            return `<${prettifiedName}>`;
        }
    }
