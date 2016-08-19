import {BaseSelectedOptionView} from "./BaseSelectedOptionView";
import {NamesAndIconViewSize} from "../../../app/NamesAndIconViewSize";
import {Option} from "../Option";
import {Element} from "../../../dom/Element";
import {NamesAndIconViewBuilder} from "../../../app/NamesAndIconView";
import {StringHelper} from "../../../util/StringHelper";
import {AEl} from "../../../dom/AEl";
import {DivEl} from "../../../dom/DivEl";

export class RichSelectedOptionView<T> extends BaseSelectedOptionView<T> {

        private optionDisplayValue: T;

        private size: NamesAndIconViewSize;

        constructor(option: Option<T>, size: NamesAndIconViewSize = NamesAndIconViewSize.small) {
            this.optionDisplayValue = option.displayValue;
            this.size = size;
            super(option);
        }

        resolveIconUrl(content: T): string {
            return "";
        }

        resolveTitle(content: T): string {
            return "";
        }

        resolveSubTitle(content: T): string {
            return "";
        }

        resolveIconClass(content: T): string {
            return "";
        }

        createActionButtons(content: T): Element[] {
            return [];
        }

        doRender(): wemQ.Promise<boolean> {

            var namesAndIconView = new NamesAndIconViewBuilder().setSize(this.size).build();

            namesAndIconView
                .setMainName(this.resolveTitle(this.optionDisplayValue))
                .setSubName(this.resolveSubTitle(this.optionDisplayValue));

            var url = this.resolveIconUrl(this.optionDisplayValue);
            if (!StringHelper.isBlank(url)) {
                namesAndIconView.setIconUrl(this.resolveIconUrl(this.optionDisplayValue) + '?crop=false')
            } else {
                namesAndIconView.setIconClass(this.resolveIconClass(this.optionDisplayValue));
            }

            var removeButton = new AEl("remove");
            removeButton.onClicked((event: Event) => {
                this.notifyRemoveClicked();

                event.stopPropagation();
                event.preventDefault();
                return false;
            });

            var buttons: Element[] = this.createActionButtons(this.optionDisplayValue);

            this.appendChildren<Element>(new DivEl("drag-control"), removeButton);
            this.appendChildren(...buttons);
            this.appendChild(namesAndIconView);

            return wemQ(true);
        }
    }
