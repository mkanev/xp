import {FragmentComponent} from "../../../../../../../../../common/js/content/page/region/FragmentComponent";
import {ContentSummary} from "../../../../../../../../../common/js/content/ContentSummary";
import {ContentId} from "../../../../../../../../../common/js/content/ContentId";
import {GetContentSummaryByIdRequest} from "../../../../../../../../../common/js/content/resource/GetContentSummaryByIdRequest";
import {ContentTypeName} from "../../../../../../../../../common/js/schema/content/ContentTypeName";
import {FragmentComponentView} from "../../../../../../../../../common/js/liveedit/fragment/FragmentComponentView";
import {ComponentPropertyChangedEvent} from "../../../../../../../../../common/js/content/page/region/ComponentPropertyChangedEvent";
import {Option} from "../../../../../../../../../common/js/ui/selector/Option";
import {SelectedOption} from "../../../../../../../../../common/js/ui/selector/combobox/SelectedOption";
import {GetContentByIdRequest} from "../../../../../../../../../common/js/content/resource/GetContentByIdRequest";
import {Content} from "../../../../../../../../../common/js/content/Content";
import {LayoutComponentType} from "../../../../../../../../../common/js/content/page/region/LayoutComponentType";
import {QueryExpr} from "../../../../../../../../../common/js/query/expr/QueryExpr";
import {FieldExpr} from "../../../../../../../../../common/js/query/expr/FieldExpr";
import {ValueExpr} from "../../../../../../../../../common/js/query/expr/ValueExpr";
import {FragmentDropdown} from "../../../../../../../../../common/js/content/page/region/FragmentDropdown";
import {OptionSelectedEvent} from "../../../../../../../../../common/js/ui/selector/OptionSelectedEvent";
import {LiveEditModel} from "../../../../../../../../../common/js/liveedit/LiveEditModel";
import {FragmentContentSummaryLoader} from "../../../../../../../../../common/js/content/resource/FragmentContentSummaryLoader";
import {ItemViewIconClassResolver} from "../../../../../../../../../common/js/liveedit/ItemViewIconClassResolver";
import {DefaultErrorHandler} from "../../../../../../../../../common/js/DefaultErrorHandler";
import {ObjectHelper} from "../../../../../../../../../common/js/ObjectHelper";
import {showWarning} from "../../../../../../../../../common/js/notify/MessageBus";
import {LayoutItemType} from "../../../../../../../../../common/js/liveedit/layout/LayoutItemType";

import {ComponentInspectionPanel, ComponentInspectionPanelConfig} from "./ComponentInspectionPanel";
import {FragmentSelectorForm} from "./FragmentSelectorForm";

export class FragmentInspectionPanel extends ComponentInspectionPanel<FragmentComponent> {

    private fragmentComponent: FragmentComponent;

    private fragmentView: FragmentComponentView;

    private fragmentSelector: FragmentDropdown;

    private fragmentForm: FragmentSelectorForm;

    private handleSelectorEvents: boolean = true;

    private componentPropertyChangedEventHandler: (event: ComponentPropertyChangedEvent) => void;

    private loader: FragmentContentSummaryLoader;

    constructor() {
        super(<ComponentInspectionPanelConfig>{
            iconClass: ItemViewIconClassResolver.resolveByType("fragment")
        });

        this.loader = new FragmentContentSummaryLoader();
    }

    setModel(liveEditModel: LiveEditModel) {
        super.setModel(liveEditModel);
        this.layout();

    }

    private layout() {

        this.removeChildren();

        this.fragmentSelector = new FragmentDropdown("", this.loader);

        this.fragmentForm = new FragmentSelectorForm(this.fragmentSelector, "Fragment");

        var sitePath = this.liveEditModel.getSiteModel().getSite().getPath().toString();
        this.loader.setParentSitePath(sitePath).setContentPath(this.liveEditModel.getContent().getPath());
        this.loader.load();

        this.componentPropertyChangedEventHandler = (event: ComponentPropertyChangedEvent) => {
            // Ensure displayed selector option is removed when fragment is removed
            if (event.getPropertyName() == FragmentComponent.PROPERTY_FRAGMENT) {
                if (!this.fragmentComponent.hasFragment()) {
                    // this.fragmentSelector.setContent(null);
                    this.fragmentSelector.setSelection(null);
                }
            }
        };

        this.initSelectorListeners();
        this.appendChild(this.fragmentForm);
    }

    setFragmentComponent(fragmentView: FragmentComponentView) {
        this.fragmentView = fragmentView;
        if (this.fragmentComponent) {
            this.unregisterComponentListeners(this.fragmentComponent);
        }

        this.fragmentComponent = fragmentView.getComponent();
        this.setComponent(this.fragmentComponent);

        var contentId: ContentId = this.fragmentComponent.getFragment();
        if (contentId) {
            var fragment: ContentSummary = this.fragmentSelector.getSelection(contentId);
            if (fragment) {
                this.setSelectorValue(fragment);
            } else {
                new GetContentSummaryByIdRequest(contentId).sendAndParse().then((fragment: ContentSummary) => {
                    this.setSelectorValue(fragment);
                }).catch((reason: any) => {
                    if (this.isNotFoundError(reason)) {
                        this.setSelectorValue(null);
                    } else {
                        DefaultErrorHandler.handle(reason);
                    }
                }).done();
            }
        } else {
            this.setSelectorValue(null);
        }

        this.registerComponentListeners(this.fragmentComponent);
    }

    private registerComponentListeners(component: FragmentComponent) {
        component.onPropertyChanged(this.componentPropertyChangedEventHandler);
    }

    private unregisterComponentListeners(component: FragmentComponent) {
        component.unPropertyChanged(this.componentPropertyChangedEventHandler);
    }

    private setSelectorValue(fragment: ContentSummary) {
        this.handleSelectorEvents = false;
        if (fragment) {
            var option = this.fragmentSelector.getOptionByValue(fragment.getId().toString());
            if (!option) {
                this.fragmentSelector.addFragmentOption(fragment);
            }
        }
        this.fragmentSelector.setSelection(fragment);
        this.handleSelectorEvents = true;
    }

    private initSelectorListeners() {

        this.fragmentSelector.onOptionSelected((selectedOption: OptionSelectedEvent<ContentSummary>) => {
            if (this.handleSelectorEvents) {
                var option: Option<ContentSummary> = selectedOption.getOption();
                var fragmentContent = option.displayValue;

                if (this.isInsideLayout()) {
                    new GetContentByIdRequest(fragmentContent.getContentId()).sendAndParse().done((content: Content) => {
                        let fragmentComponent = content.getPage() ? content.getPage().getFragment() : null;

                        if (fragmentComponent &&
                            ObjectHelper.iFrameSafeInstanceOf(fragmentComponent.getType(), LayoutComponentType)) {
                            showWarning("Layout within layout not allowed");

                        } else {
                            this.fragmentComponent.setFragment(fragmentContent.getContentId(), fragmentContent.getDisplayName());
                        }
                    });
                } else {
                    this.fragmentComponent.setFragment(fragmentContent.getContentId(), fragmentContent.getDisplayName());
                }
            }
        });
    }

    private isInsideLayout(): boolean {
        let parentRegion = this.fragmentView.getParentItemView();
        if (!parentRegion) {
            return false;
        }
        let parent = parentRegion.getParentItemView();
        if (!parent) {
            return false;
        }
        return ObjectHelper.iFrameSafeInstanceOf(parent.getType(), LayoutItemType);
    }

    getComponentView(): FragmentComponentView {
        return this.fragmentView;
    }

}
