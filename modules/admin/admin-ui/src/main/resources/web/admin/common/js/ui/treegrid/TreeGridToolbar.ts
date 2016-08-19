import {TreeGridActions} from "./actions/TreeGridActions";
import {TreeGridToolbarActions} from "./actions/TreeGridToolbarActions";
import {Toolbar} from "../toolbar/Toolbar";
import {Element} from "../../dom/Element";
import {Button} from "../button/Button";
import {TreeGrid} from "./TreeGrid";

export class TreeGridToolbar extends Toolbar {

        private treeGrid: TreeGrid<any>;
        private refreshButton: Element;

        constructor(actions: TreeGridToolbarActions<any>, treeGrid: TreeGrid<any>) {
            super("tree-grid-toolbar");

            this.addActions(actions.getAllActions());

            this.addGreedySpacer();
            this.refreshButton = new Button().addClass('icon-loop2');
            this.refreshButton.onClicked((event: MouseEvent) => treeGrid.reload());
            this.addElement(this.refreshButton);

            this.treeGrid = treeGrid;
        }
    }
