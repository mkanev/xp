import {ContentTypeName} from "../../schema/content/ContentTypeName";
import {FragmentComponent} from "../../content/page/region/FragmentComponent";
import {GetContentByIdRequest} from "../../content/resource/GetContentByIdRequest";
import {Content} from "../../content/Content";
import {LayoutComponentType} from "../../content/page/region/LayoutComponentType";
import {QueryExpr} from "../../query/expr/QueryExpr";
import {FieldExpr} from "../../query/expr/FieldExpr";
import {ValueExpr} from "../../query/expr/ValueExpr";
import {SelectedOptionEvent} from "../../ui/selector/combobox/SelectedOptionEvent";
import {ItemViewPlaceholder} from "../ItemViewPlaceholder";
import {ContentComboBox} from "../../content/ContentComboBox";
import {DivEl} from "../../dom/DivEl";
import {FragmentContentSummaryLoader} from "../../content/resource/FragmentContentSummaryLoader";
import {ContentSummary} from "../../content/ContentSummary";
import {ObjectHelper} from "../../ObjectHelper";
import {ShowWarningLiveEditEvent} from "../ShowWarningLiveEditEvent";
import {LayoutItemType} from "../layout/LayoutItemType";
import {FragmentComponentView} from "./FragmentComponentView";

export class FragmentPlaceholder extends ItemViewPlaceholder {

        private fragmentComponentView: FragmentComponentView;

        private comboBox: ContentComboBox;

        private comboboxWrapper: DivEl;

        constructor(fragmentView: FragmentComponentView) {
            super();
            this.addClassEx("fragment-placeholder");
            this.fragmentComponentView = fragmentView;

            this.comboboxWrapper = new DivEl('rich-combobox-wrapper');

            var sitePath = this.fragmentComponentView.getLiveEditModel().getSiteModel().getSite().getPath().toString();
            var loader = new FragmentContentSummaryLoader().setParentSitePath(sitePath);
            
            this.comboBox = ContentComboBox.create().setMaximumOccurrences(1).setLoader(loader).setMinWidth(270).build();

            this.comboboxWrapper.appendChildren(this.comboBox);
            this.appendChild(this.comboboxWrapper);

            this.comboBox.onOptionSelected((event: SelectedOptionEvent<ContentSummary>) => {

                var component: FragmentComponent = this.fragmentComponentView.getComponent();
                var fragmentContent = event.getSelectedOption().getOption().displayValue;

                if (this.isInsideLayout()) {
                    new GetContentByIdRequest(fragmentContent.getContentId()).sendAndParse().done((content: Content) => {
                        let fragmentComponent = content.getPage() ? content.getPage().getFragment() : null;
                        
                        if (fragmentComponent && ObjectHelper.iFrameSafeInstanceOf(fragmentComponent.getType(), LayoutComponentType)) {
                            this.comboBox.clearSelection();
                            new ShowWarningLiveEditEvent("Layout within layout not allowed").fire();
                            
                        } else {
                            component.setFragment(fragmentContent.getContentId(), fragmentContent.getDisplayName());
                            this.fragmentComponentView.showLoadingSpinner();
                        }
                    });
                } else {
                    component.setFragment(fragmentContent.getContentId(), fragmentContent.getDisplayName());
                    this.fragmentComponentView.showLoadingSpinner();
                }
            });
        }

        private isInsideLayout(): boolean {
            let parentRegion = this.fragmentComponentView.getParentItemView();
            if (!parentRegion) {
                return false;
            }
            let parent = parentRegion.getParentItemView();
            if (!parent) {
                return false;
            }
            return ObjectHelper.iFrameSafeInstanceOf(parent.getType(), LayoutItemType);
        }

        select() {
            this.comboboxWrapper.show();
            this.comboBox.giveFocus();
        }

        deselect() {
            this.comboboxWrapper.hide();
        }
    }
