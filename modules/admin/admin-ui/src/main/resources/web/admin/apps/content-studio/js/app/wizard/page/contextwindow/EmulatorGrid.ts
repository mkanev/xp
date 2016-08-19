import {Grid} from "../../../../../../../common/js/ui/grid/Grid";
import {DataView} from "../../../../../../../common/js/ui/grid/DataView";
import {GridOptions} from "../../../../../../../common/js/ui/grid/GridOptions";
import {GridOptionsBuilder} from "../../../../../../../common/js/ui/grid/GridOptions";
import {GridColumn} from "../../../../../../../common/js/ui/grid/GridColumn";
import {GridColumnBuilder} from "../../../../../../../common/js/ui/grid/GridColumn";
import {DivEl} from "../../../../../../../common/js/dom/DivEl";
import {FontIcon} from "../../../../../../../common/js/ui/FontIcon";
import {H5El} from "../../../../../../../common/js/dom/H5El";
import {H6El} from "../../../../../../../common/js/dom/H6El";

export class EmulatorGrid extends Grid<any> {

    constructor(dataView: DataView<any>) {
        super(dataView, this.createColumns(), this.createOptions());
    }

    private createOptions(): GridOptions<any> {
        return new GridOptionsBuilder().setHideColumnHeaders(true).setRowHeight(50).setHeight(450).setWidth(320)
            .build();
    }

    private createColumns(): GridColumn<any>[] {
        return [new GridColumnBuilder().setName("device").setField("device").setId("device").setWidth(320).setCssClass(
            "grid-row").setFormatter((row, cell, value, columnDef, dataContext) => {
            return this.buildRow(row, cell, value).toString();
        }).build()
        ];
    }

    private buildRow(row, cell, data): DivEl {
        var rowEl = new DivEl();
        rowEl.getEl().setData('width', data.width);
        rowEl.getEl().setData('height', data.height);
        rowEl.getEl().setData('units', data.units);

        var icon = new FontIcon("icon-" + data.device_type);

        var title = new H5El();
        title.getEl().setInnerHtml(data.name);

        var subtitle = new H6El();
        var units = data.display_units ? data.units : "";
        subtitle.getEl().setInnerHtml(data.width + units + " &times; " + data.height + units, false);
        rowEl.appendChild(icon);
        rowEl.appendChild(title);
        rowEl.appendChild(subtitle);

        if (data.rotatable == true) {
            var rotator = new DivEl();
            rotator.addClass('rotate');
            rotator.addClassEx('icon-loop');
            rowEl.appendChild(rotator);
        }

        return rowEl;
    }

    static toSlickData(data: any[]): any[] {
        var result = [];
        var i = 1;
        data["devices"].forEach((item, index) => {
            var tmp = {
                "id": i,
                "device": item
            };
            result.push(tmp);
            i++;
        });
        return result;
    }

}
