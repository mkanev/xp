import {DivEl} from "../../dom/DivEl";
import {H2El} from "../../dom/H2El";
import {UlEl} from "../../dom/UlEl";
import {LiEl} from "../../dom/LiEl";

export class ItemDataGroup extends DivEl {

        private header: H2El;

        private empty: boolean;

        constructor(title: string, className?: string) {
            super(!!className ? className + " item-data-group" : "item-data-group");
            this.header = new H2El();
            this.header.getEl().setInnerHtml(title);
            this.appendChild(this.header);

            this.empty = true;
        }

        addDataList(header: string, ...datas: string[]) {
            this.addDataArray(header, datas);
        }

        addDataArray(header: string, datas: string[]) {
            var dataList = new UlEl("data-list");

            if (header) {
                var headerElement = new LiEl();
                headerElement.addClass("list-header");

                headerElement.getEl().setInnerHtml(header, false);
                dataList.appendChild(headerElement);
            }

            datas.forEach((data) => {
                var dataElement = new LiEl();
                dataElement.getEl().setInnerHtml(data, false);
                dataList.appendChild(dataElement);
                this.empty = false;
            });

            this.appendChild(dataList);
        }

        isEmpty(): boolean {
            return this.empty;
        }
    }
