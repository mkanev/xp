import {PartComponentView} from "./part/PartComponentView";
import {Element} from "../dom/Element";
import {Action} from "../ui/Action";
import {ContentItemType} from "./ContentItemType";
import {ContentViewContextMenuTitle} from "./ContentViewContextMenuTitle";
import {ItemViewBuilder} from "./ItemView";
import {ItemView} from "./ItemView";

export class ContentViewBuilder {

        parentPartComponentView: PartComponentView;

        parentElement: Element;

        element: Element;

        setParentPartComponentView(value: PartComponentView): ContentViewBuilder {
            this.parentPartComponentView = value;
            return this;
        }

        setParentElement(value: Element): ContentViewBuilder {
            this.parentElement = value;
            return this;
        }

        setElement(value: Element): ContentViewBuilder {
            this.element = value;
            return this;
        }

    }

    // TODO:
    export class ContentView extends ItemView {

        private parentPartComponentView: PartComponentView;

        constructor(builder: ContentViewBuilder) {


            super(new ItemViewBuilder().
                setItemViewIdProducer(builder.parentPartComponentView.getItemViewIdProducer()).
                setType(ContentItemType.get()).
                setElement(builder.element).
                setParentElement(builder.parentElement).
                setParentView(builder.parentPartComponentView).
                setContextMenuActions(this.createContentContextMenuActions()).
                setContextMenuTitle(new ContentViewContextMenuTitle(this)));
            this.parentPartComponentView = builder.parentPartComponentView;
        }

        private createContentContextMenuActions(): Action[] {
            var actions: Action[] = [];

            actions.push(this.createSelectParentAction());
            actions.push(new Action('Insert').onExecuted(() => {
                // TODO
            }));
            actions.push(new Action('View').onExecuted(() => {
                // TODO
            }));
            actions.push(new Action('Edit').onExecuted(() => {
                // TODO
            }));
            return actions;
        }

        isEmpty(): boolean {
            return false;
        }

        getParentItemView(): PartComponentView {
            return this.parentPartComponentView;
        }

        setParentItemView(partView: PartComponentView) {
            super.setParentItemView(partView);
            this.parentPartComponentView = partView;
        }
    }
