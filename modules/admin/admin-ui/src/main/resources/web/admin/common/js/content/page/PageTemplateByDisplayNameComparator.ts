import {Comparator} from "../../Comparator";
import {PageTemplate} from "./PageTemplate";

export class PageTemplateByDisplayNameComparator implements Comparator<PageTemplate> {

        compare(a: PageTemplate, b: PageTemplate): number {
            if (!a) {
                return 1;
            } else {
                var firstName = a.getDisplayName() || '';
            }
            if (!b) {
                return -1;
            } else {
                var secondName = b.getDisplayName() || '';
            }
            return firstName.localeCompare(secondName);
        }
    }
