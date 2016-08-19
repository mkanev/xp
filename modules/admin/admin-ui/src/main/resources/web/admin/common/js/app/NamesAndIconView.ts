import {DivEl} from "../dom/DivEl";
import {ImgEl} from "../dom/ImgEl";
import {NamesView} from "./NamesView";
import {SpanEl} from "../dom/SpanEl";
import {Element} from "../dom/Element";
import {NamesAndIconViewSize} from "./NamesAndIconViewSize";

export class NamesAndIconViewBuilder {

        size: NamesAndIconViewSize;

        addTitleAttribute: boolean = false;

        appendIcon: boolean = true;

        setSize(size: NamesAndIconViewSize): NamesAndIconViewBuilder {
            this.size = size;
            return this;
        }

        setAddTitleAttribute(addTitleAttribute: boolean): NamesAndIconViewBuilder {
            this.addTitleAttribute = addTitleAttribute;
            return this;
        }

        setAppendIcon(appendIcon: boolean): NamesAndIconViewBuilder {
            this.appendIcon = appendIcon;
            return this;
        }

        build(): NamesAndIconView {

            return new NamesAndIconView(this);
        }
    }

    export class NamesAndIconView extends DivEl {

        private wrapperDivEl: DivEl;

        private iconImageEl: ImgEl;

        private iconDivEl: DivEl;

        private namesView: NamesView;

        private iconLabelEl: SpanEl;

        constructor(builder: NamesAndIconViewBuilder) {
            super("names-and-icon-view");
            var sizeClassName: string = NamesAndIconViewSize[builder.size];
            if (builder.size) {
                this.addClass(sizeClassName);
            }

            if (builder.appendIcon) {
                this.wrapperDivEl = new DivEl("wrapper");
                this.appendChild(this.wrapperDivEl);

                this.iconImageEl = new ImgEl(null, "font-icon-default");
                this.wrapperDivEl.appendChild(this.iconImageEl);

                this.iconDivEl = new DivEl("font-icon-default");
                this.wrapperDivEl.appendChild(this.iconDivEl);
                this.iconDivEl.hide();
            }

            this.namesView = new NamesView(builder.addTitleAttribute);
            this.appendChild(this.namesView);

            this.iconLabelEl = new SpanEl("icon-label");
            this.iconLabelEl.hide();
            this.appendChild(this.iconLabelEl);
        }

        setMainName(value: string): NamesAndIconView {
            this.namesView.setMainName(value);
            return this;
        }

        setSubName(value: string, title?: string): NamesAndIconView {
            this.namesView.setSubName(value, title);
            return this;
        }

        setSubNameElements(elements: Element[]): NamesAndIconView {
            this.namesView.setSubNameElements(elements);
            return this;
        }

        setIconClass(value: string): NamesAndIconView {
            this.iconDivEl.setClass("font-icon-default " + value);
            this.iconDivEl.getEl().setDisplay('inline-block');
            this.iconImageEl.hide();
            return this;
        }

        setIconUrl(value: string): NamesAndIconView {
            this.iconImageEl.setSrc(value);
            this.iconDivEl.hide();
            this.iconImageEl.show();
            return this;
        }

        setDisplayIconLabel(display: boolean): NamesAndIconView {
            if (display) {
                this.iconLabelEl.show();
            } else {
                this.iconLabelEl.hide();
            }

            return this;
        }

        getNamesView(): NamesView {
            return this.namesView;
        }

        /**
         * protected, to be used by inheritors
         */
        getIconImageEl(): ImgEl {
            return this.iconImageEl;
        }

        /**
         * protected, to be used by inheritors
         */
        getWrapperDivEl(): DivEl {
            return this.wrapperDivEl;
        }

        setIconToolTip(toolTip: string) {
            this.wrapperDivEl.getEl().setTitle(toolTip);
        }

        static create(): NamesAndIconViewBuilder {
            return new NamesAndIconViewBuilder();
        }

    }
