import {Grid} from "../../../../../../../../common/js/ui/grid/Grid";
import {DataView} from "../../../../../../../../common/js/ui/grid/DataView";
import {GridOptions} from "../../../../../../../../common/js/ui/grid/GridOptions";
import {GridOptionsBuilder} from "../../../../../../../../common/js/ui/grid/GridOptions";
import {GridColumn} from "../../../../../../../../common/js/ui/grid/GridColumn";
import {GridColumnBuilder} from "../../../../../../../../common/js/ui/grid/GridColumn";
import {DivEl} from "../../../../../../../../common/js/dom/DivEl";
import {FontIcon} from "../../../../../../../../common/js/ui/FontIcon";
import {H5El} from "../../../../../../../../common/js/dom/H5El";
import {H6El} from "../../../../../../../../common/js/dom/H6El";

import {Insertable} from "./Insertable";

export interface InsertablesGridOptions {
    draggableRows?:boolean;
    rowClass?:string;
    onClick?:(el) => void;
}

export class InsertablesGrid extends Grid<Insertable> {

    private componentGridOptions: InsertablesGridOptions;

    private componentDataView: DataView<Insertable>;

    constructor(dataView: DataView<Insertable>, options: InsertablesGridOptions = {}) {
        super(dataView, this.createColumns(), this.createOptions());
        this.componentDataView = dataView;
        this.componentGridOptions = options;

        this.onRendered((event) => {
            if (this.componentGridOptions.onClick) {
                this.setOnClick(this.componentGridOptions.onClick);
            }
        })
    }

    private createOptions(): GridOptions<Insertable> {
        return new GridOptionsBuilder().setHideColumnHeaders(true).setRowHeight(50).setHeight(400).setWidth(320)
            .build();
    }

    private createColumns(): GridColumn<Insertable>[] {
        return [new GridColumnBuilder().setName("component").setField("component").setId("component").setWidth(320).setCssClass(
            "grid-row").setFormatter((row, cell, value, columnDef, dataContext) => {
            return this.buildRow(row, cell, value, columnDef, <Insertable>dataContext).toString();
        }).build()
        ];
    }

    private buildRow(row: number, cell: number, value: any, columnDef: any, insertable: Insertable): DivEl {
        var rowEl = new DivEl();
        rowEl.getEl().setData('portal-component-type', insertable.getName());
        if (this.componentGridOptions.draggableRows) {
            rowEl.getEl().setData('context-window-draggable', 'true');
        }
        if (this.componentGridOptions.rowClass) {
            rowEl.addClass(this.componentGridOptions.rowClass)
        }

        var icon = new FontIcon(insertable.getIconCls());

        var title = new H5El();
        title.getEl().setInnerHtml(insertable.getDisplayName());

        var subtitle = new H6El();
        subtitle.getEl().setInnerHtml(insertable.getDescription());

        rowEl.appendChild(icon);
        rowEl.appendChild(title);
        rowEl.appendChild(subtitle);

        return rowEl;
    }
}
