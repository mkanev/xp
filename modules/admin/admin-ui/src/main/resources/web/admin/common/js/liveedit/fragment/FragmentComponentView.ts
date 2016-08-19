import {ComponentView} from "../ComponentView";
import {ContentView} from "../ContentView";
import {RegionView} from "../RegionView";
import {FragmentComponent} from "../../content/page/region/FragmentComponent";
import {GetContentByIdRequest} from "../../content/resource/GetContentByIdRequest";
import {Content} from "../../content/Content";
import {HTMLAreaHelper} from "../../util/htmlarea/editor/HTMLAreaHelper";
import {FragmentComponentLoadedEvent} from "../FragmentComponentLoadedEvent";
import {ComponentPropertyValueChangedEvent} from "../../content/page/region/ComponentPropertyValueChangedEvent";
import {Component} from "../../content/page/region/Component";
import {Action} from "../../ui/Action";
import {ContentSummaryAndCompareStatus} from "../../content/ContentSummaryAndCompareStatus";
import {EditContentEvent} from "../../content/event/EditContentEvent";
import {Element} from "../../dom/Element";
import {ItemType} from "../ItemType";
import {LayoutItemType} from "../layout/LayoutItemType";
import {TextItemType} from "../text/TextItemType";
import {ComponentViewBuilder} from "../ComponentView";
import {LiveEditModel} from "../LiveEditModel";
import {FragmentComponentViewer} from "./FragmentComponentViewer";
import {FragmentItemType} from "./FragmentItemType";
import {FragmentPlaceholder} from "./FragmentPlaceholder";

export class FragmentComponentViewBuilder extends ComponentViewBuilder<FragmentComponent> {

        constructor() {
            super();
            this.setType(FragmentItemType.get());
        }
    }

    export class FragmentComponentView extends ComponentView<FragmentComponent> {

        private fragmentComponent: FragmentComponent;

        private fragmentContainsLayout: boolean;

        private fragmentContent: Content;

        private fragmentContentLoadedListeners: {(event: FragmentComponentLoadedEvent): void}[];

        constructor(builder: FragmentComponentViewBuilder) {
            this.liveEditModel = builder.parentRegionView.getLiveEditModel();
            this.fragmentComponent = builder.component;
            this.fragmentContainsLayout = false;
            this.fragmentContent = null;
            this.fragmentContentLoadedListeners = [];

            super(builder.setPlaceholder(new FragmentPlaceholder(this)).setViewer(
                new FragmentComponentViewer()).setInspectActionRequired(true));

            this.fragmentComponent.onPropertyValueChanged((e: ComponentPropertyValueChangedEvent) => {
                if (e.getPropertyName() === FragmentComponent.PROPERTY_FRAGMENT) {
                    this.loadFragmentContent();
                }
            });
            this.loadFragmentContent();

            this.parseContentViews(this);
        }

        isEmpty(): boolean {
            return !this.fragmentComponent || this.fragmentComponent.isEmpty();
        }

        containsLayout(): boolean {
            return this.fragmentContainsLayout;
        }

        getFragmentRootComponent(): Component {
            if (this.fragmentContent) {
                let page = this.fragmentContent.getPage();
                if (page) {
                    return page.getFragment();
                }
            }
            return null;
        }

        private loadFragmentContent() {
            var contentId = this.fragmentComponent.getFragment();
            if (contentId) {
                if (!this.fragmentContent || !contentId.equals(this.fragmentContent.getContentId())) {
                    new GetContentByIdRequest(contentId).sendAndParse().then((content: Content)=> {
                        this.fragmentContent = content;
                        this.notifyFragmentContentLoaded();
                    }).catch((reason: any) => {
                        this.fragmentContent = null;
                        this.notifyFragmentContentLoaded();
                    }).done();
                }
            } else {
                this.fragmentContent = null;
                this.notifyFragmentContentLoaded();
            }
        }

        protected getComponentContextMenuActions(actions: Action[], liveEditModel: LiveEditModel): Action[] {
            if (this.fragmentComponent && !this.fragmentComponent.isEmpty()) {
                actions.push(new Action("Edit in new tab").onExecuted(() => {
                    this.deselect();
                    new GetContentByIdRequest(this.fragmentComponent.getFragment()).sendAndParse().then((content: Content)=> {
                        var contentAndSummary = ContentSummaryAndCompareStatus.fromContentSummary(content);
                        new EditContentEvent([contentAndSummary]).fire();
                    });
                }));
            }
            return actions;
        }

        private parseContentViews(parentElement?: Element, parentType?: ItemType) {
            var children = parentElement.getChildren();
            children.forEach((childElement: Element) => {
                var itemType = ItemType.fromElement(childElement);
                if (itemType) {
                    if (LayoutItemType.get().equals(itemType)) {
                        this.fragmentContainsLayout = true;
                    }

                    // remove component-type attributes to avoid inner components of fragment to be affected by d&d sorting
                    var htmlElement = childElement.getHTMLElement();
                    htmlElement.removeAttribute("data-" + ItemType.ATTRIBUTE_TYPE);
                    htmlElement.removeAttribute("data-" + ItemType.ATTRIBUTE_REGION_NAME);
                }

                var isTextComponent = TextItemType.get().equals(parentType);
                if (isTextComponent && childElement.getEl().getTagName().toUpperCase() == 'SECTION') {
                    // convert image urls in text component for web
                    childElement.setHtml(HTMLAreaHelper.prepareImgSrcsInValueForEdit(childElement.getHtml()), false);
                    return;
                }
                this.parseContentViews(childElement, itemType);
            });
        }

        onFragmentContentLoaded(listener: (event: FragmentComponentLoadedEvent) => void) {
            this.fragmentContentLoadedListeners.push(listener);
        }

        unFragmentContentLoaded(listener: (event: FragmentComponentLoadedEvent) => void) {
            this.fragmentContentLoadedListeners = this.fragmentContentLoadedListeners.filter((curr) => {
                return curr != listener;
            })
        }

        notifyFragmentContentLoaded() {
            var event = new FragmentComponentLoadedEvent(this);
            this.fragmentContentLoadedListeners.forEach((listener) => {
                listener(event);
            });
        }

    }
