import {ApplicationKey} from "../../application/ApplicationKey";
import {ApplicationBasedName} from "../../application/ApplicationBasedName";
import {assertNotNull} from "../../util/Assert";
import {RelationshipType} from "./RelationshipType";

export class RelationshipTypeName extends ApplicationBasedName {

        static REFERENCE = new RelationshipTypeName(ApplicationKey.SYSTEM + ApplicationBasedName.SEPARATOR + "reference");

        constructor(name: string) {
            assertNotNull(name, "RelationshipType name can't be null");
            var parts = name.split(ApplicationBasedName.SEPARATOR);
            super(ApplicationKey.fromString(parts[0]), parts[1]);
        }

    }
