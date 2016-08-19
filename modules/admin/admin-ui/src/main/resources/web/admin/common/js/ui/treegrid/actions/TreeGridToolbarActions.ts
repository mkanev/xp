import {Action} from "../../Action";
import {TreeGrid} from "../TreeGrid";
import {Equitable} from "../../../Equitable";
import {BrowseItem} from "../../../app/browse/BrowseItem";
import {ClearSelectionAction} from "./ClearSelectionAction";
import {SelectAllAction} from "./SelectAllAction";
import {TreeGridActions} from "./TreeGridActions";

export class TreeGridToolbarActions<M extends Equitable> implements TreeGridActions<M> {

        public SELECT_ALL: Action;
        public CLEAR_SELECTION: ClearSelectionAction<M>;

        private actions: Action[] = [];

        constructor(grid: TreeGrid<any>) {
            this.SELECT_ALL = new SelectAllAction(grid);
            this.CLEAR_SELECTION = new ClearSelectionAction(grid);
            this.actions.push(this.SELECT_ALL, this.CLEAR_SELECTION);
        }

        getAllActions(): Action[] {
            return this.actions;
        }

        updateActionsEnabledState(browseItems: BrowseItem<M>[]): wemQ.Promise<BrowseItem<M>[]> {
            var deferred = wemQ.defer<BrowseItem<M>[]>();
            deferred.resolve(browseItems);
            return deferred.promise;
        }
    }
