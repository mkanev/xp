import {GridDragHandler} from "../../../../../common/js/ui/grid/GridDragHandler";
import {TreeGrid} from "../../../../../common/js/ui/treegrid/TreeGrid";
import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {OrderChildMovement} from "../../../../../common/js/content/order/OrderChildMovement";
import {OrderChildMovements} from "../../../../../common/js/content/order/OrderChildMovements";

export class ContentGridDragHandler extends GridDragHandler<ContentSummaryAndCompareStatus> {

    private movements: OrderChildMovements;

    constructor(treeGrid: TreeGrid<ContentSummaryAndCompareStatus>) {
        super(treeGrid);
        this.movements = new OrderChildMovements();
    }

    getContentMovements(): OrderChildMovements {
        return this.movements;
    }

    clearContentMovements() {
        this.movements = new OrderChildMovements();
    }

    handleMovements(rowDataId, moveBeforeRowDataId) {
        this.movements.addChildMovement(new OrderChildMovement(rowDataId, moveBeforeRowDataId));
    }

    getModelId(model: ContentSummaryAndCompareStatus) {
        return model ? model.getContentId() : null;
    }
}
