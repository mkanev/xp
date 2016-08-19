import {Event} from "../../../../../common/js/event/Event";

import {UserTreeGridItem} from "./UserTreeGridItem";

export class BaseUserEvent extends Event {

    private gridItems: UserTreeGridItem[];

    constructor(gridItems: UserTreeGridItem[]) {
        this.gridItems = gridItems;
        super();
    }

    getPrincipals(): UserTreeGridItem[] {
        return this.gridItems;
    }
}
