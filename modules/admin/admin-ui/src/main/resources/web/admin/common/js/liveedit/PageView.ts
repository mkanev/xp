import {Content} from "../content/Content";
import {Page} from "../content/page/Page";
import {PageModel} from "../content/page/PageModel";
import {PageMode} from "../content/page/PageMode";
import {PageModeChangedEvent} from "../content/page/PageModeChangedEvent";
import {Site} from "../content/site/Site";
import {Regions} from "../content/page/region/Regions";
import {Component} from "../content/page/region/Component";
import {Region} from "../content/page/region/Region";
import {RegionPath} from "../content/page/region/RegionPath";
import {ComponentPath} from "../content/page/region/ComponentPath";
import {FragmentComponentView} from "./fragment/FragmentComponentView";
import {LayoutComponentView} from "./layout/LayoutComponentView";
import {Body} from "../dom/Body";
import {Action} from "../ui/Action";
import {PropertyChangedEvent} from "../PropertyChangedEvent";
import {ItemViewContextMenu} from "./ItemViewContextMenu";
import {Element} from "../dom/Element";
import {DivEl} from "../dom/DivEl";
import {TextItemType} from "./text/TextItemType";
import {TextComponentView} from "./text/TextComponentView";
import {ContentSummaryViewer} from "../content/ContentSummaryViewer";
import {ResponsiveManager} from "../ui/responsive/ResponsiveManager";
import {ResponsiveItem} from "../ui/responsive/ResponsiveItem";
import {AEl} from "../dom/AEl";
import {HtmlModalDialog} from "../util/htmlarea/dialog/HtmlModalDialog";
import {Highlighter} from "./Highlighter";
import {SelectedHighlighter} from "./SelectedHighlighter";
import {StringHelper} from "../util/StringHelper";
import {PageTemplateDisplayName} from "../content/page/PageMode";
import {assertNotNull} from "../util/Assert";
import {ObjectHelper} from "../ObjectHelper";
import {ComponentView} from "./ComponentView";
import {CreateItemViewConfig} from "./CreateItemViewConfig";
import {DragAndDrop} from "./DragAndDrop";
import {ItemType} from "./ItemType";
import {ItemViewBuilder} from "./ItemView";
import {ItemView} from "./ItemView";
import {ItemViewAddedEvent} from "./ItemViewAddedEvent";
import {ItemViewContextMenuPosition} from "./ItemViewContextMenuPosition";
import {ItemViewDeselectedEvent} from "./ItemViewDeselectedEvent";
import {ItemViewId} from "./ItemViewId";
import {ItemViewIdProducer} from "./ItemViewIdProducer";
import {ItemViewRemovedEvent} from "./ItemViewRemovedEvent";
import {ItemViewSelectedEvent} from "./ItemViewSelectedEvent";
import {LiveEditModel} from "./LiveEditModel";
import {PageInspectedEvent} from "./PageInspectedEvent";
import {PageItemType} from "./PageItemType";
import {PageLockedEvent} from "./PageLockedEvent";
import {PagePlaceholder} from "./PagePlaceholder";
import {PageSelectedEvent} from "./PageSelectedEvent";
import {PageTextModeStartedEvent} from "./PageTextModeStartedEvent";
import {PageUnlockedEvent} from "./PageUnlockedEvent";
import {PageViewContextMenuTitle} from "./PageViewContextMenuTitle";
import {Position} from "./Position";
import {RegionItemType} from "./RegionItemType";
import {RegionViewBuilder} from "./RegionView";
import {RegionView} from "./RegionView";
import {Shader} from "./Shader";

export class PageViewBuilder {

        liveEditModel: LiveEditModel;

        itemViewProducer: ItemViewIdProducer;

        element: Body;

        setLiveEditModel(value: LiveEditModel): PageViewBuilder {
            this.liveEditModel = value;
            return this;
        }

        setItemViewProducer(value: ItemViewIdProducer): PageViewBuilder {
            this.itemViewProducer = value;
            return this;
        }

        setElement(value: Body): PageViewBuilder {
            this.element = value;
            return this;
        }

        build(): PageView {
            return new PageView(this);
        }
    }

    export class PageView extends ItemView {

        private pageModel: PageModel;

        private regionViews: RegionView[];

        private fragmentView: ComponentView<Component>;

        private viewsById: {[s:number] : ItemView;};

        private ignorePropertyChanges: boolean;

        private itemViewAddedListeners: {(event: ItemViewAddedEvent) : void}[];

        private itemViewRemovedListeners: {(event: ItemViewRemovedEvent) : void}[];

        private pageLockedListeners: {(locked: boolean): void}[];

        private unlockedScreenActions: Action[];

        private itemViewAddedListener: (event: ItemViewAddedEvent) => void;

        private itemViewRemovedListener: (event: ItemViewRemovedEvent) => void;

        private scrolledListener: (event: WheelEvent) => void;

        public static debug;

        private propertyChangedListener: (event: PropertyChangedEvent) => void;

        private pageModeChangedListener: (event: PageModeChangedEvent) => void;

        private lockedContextMenu: ItemViewContextMenu;

        private disableContextMenu: boolean;

        private closeTextEditModeButton: Element;

        private editorToolbar: DivEl;

        private registerPageModel(pageModel: PageModel, resetAction: Action) {
            if (PageView.debug) {
                console.log('PageView.registerPageModel', pageModel);
            }
            this.propertyChangedListener = (event: PropertyChangedEvent) => {
                // don't parse on regions change during reset, because it'll be done when page is loaded later
                if (event.getPropertyName() === PageModel.PROPERTY_REGIONS && !this.ignorePropertyChanges) {
                    this.parseItemViews();
                }
                this.refreshEmptyState();
            };
            pageModel.onPropertyChanged(this.propertyChangedListener);

            this.pageModeChangedListener = (event: PageModeChangedEvent) => {
                var resetEnabled = event.getNewMode() != PageMode.AUTOMATIC && event.getNewMode() != PageMode.NO_CONTROLLER;
                if (PageView.debug) {
                    console.log('PageView.pageModeChangedListener setting reset enabled', resetEnabled);
                }
                resetAction.setEnabled(resetEnabled);
            };
            pageModel.onPageModeChanged(this.pageModeChangedListener);
        }

        private unregisterPageModel(pageModel: PageModel) {
            if (PageView.debug) {
                console.log('PageView.unregisterPageModel', pageModel);
            }
            pageModel.unPropertyChanged(this.propertyChangedListener);
            pageModel.unPageModeChanged(this.pageModeChangedListener);
        }

        constructor(builder: PageViewBuilder) {
// move super() call here?!
            this.liveEditModel = builder.liveEditModel;
            this.pageModel = builder.liveEditModel.getPageModel();

            this.regionViews = [];
            this.viewsById = {};
            this.itemViewAddedListeners = [];
            this.itemViewRemovedListeners = [];
            this.pageLockedListeners = [];
            this.ignorePropertyChanges = false;
            this.disableContextMenu = false;

            var inspectAction = new Action("Inspect").onExecuted(() => {
                new PageInspectedEvent().fire();
            });
            var resetAction = new Action('Reset');
            resetAction.onExecuted(() => {
                if (PageView.debug) {
                    console.log('PageView.reset');
                }
                this.setIgnorePropertyChanges(true);
                this.pageModel.reset(this);
                this.setIgnorePropertyChanges(false);
            });
            this.unlockedScreenActions = [inspectAction, resetAction];

            if (this.pageModel.getMode() == PageMode.AUTOMATIC || this.pageModel.getMode() == PageMode.NO_CONTROLLER) {
                resetAction.setEnabled(false);
            }

            this.registerPageModel(this.pageModel, resetAction);

            this.scrolledListener = (event: WheelEvent) => {
                this.toggleStickyToolbar();
            }

            this.itemViewAddedListener = (event: ItemViewAddedEvent) => {
                // register the view and all its child views (i.e layout with regions)
                var itemView = event.getView();
                itemView.toItemViewArray().forEach((itemView: ItemView) => {
                    this.registerItemView(itemView);
                });

                // adding anything except text should exit the text edit mode
                if (itemView.getType().equals(TextItemType.get())) {
                    if (!this.isTextEditMode()) {
                        this.setTextEditMode(true);
                    }
                    else {
                        (<TextComponentView>itemView).setEditMode(true);
                        this.closeTextEditModeButton.toggleClass("active", true);
                    }
                    new ItemViewSelectedEvent(itemView, null, event.isNew(), true).fire();
                    itemView.giveFocus();
                } else {
                    if (this.isTextEditMode()) {
                        this.setTextEditMode(false);
                    }
                    itemView.select(null, ItemViewContextMenuPosition.NONE, event.isNew());
                }
            };
            this.itemViewRemovedListener = (event: ItemViewRemovedEvent) => {
                // register the view and all its child views (i.e layout with regions)
                event.getView().toItemViewArray().forEach((itemView: ItemView) => {
                    this.unregisterItemView(itemView);
                });
            };

            super(new ItemViewBuilder().
                setLiveEditModel(builder.liveEditModel).
                setItemViewIdProducer(builder.itemViewProducer).
                setPlaceholder(new PagePlaceholder(this)).
                setViewer(new ContentSummaryViewer()).
                setType(PageItemType.get()).
                setElement(builder.element).
                setContextMenuActions(this.unlockedScreenActions).
                setContextMenuTitle(new PageViewContextMenuTitle(builder.liveEditModel.getContent())));

            this.addClassEx('page-view');

            this.parseItemViews();

            this.closeTextEditModeButton = this.createCloseTextEditModeEl();

            this.appendChild(this.closeTextEditModeButton);

            this.refreshEmptyState();

            // lock page by default for every content that has not been modified except for page template
            var isCustomized = this.liveEditModel.getPageModel().isCustomized();
            var isFragment = !!this.fragmentView;
            if (!this.liveEditModel.getContent().isPageTemplate() && !this.pageModel.isModified() && !isCustomized && !isFragment) {
                this.setLocked(true);
            }

            this.listenToMouseEvents();

            this.onRemoved(event => this.unregisterPageModel(this.pageModel));

            ResponsiveManager.onAvailableSizeChanged(this, (item: ResponsiveItem) => {
                if (this.isTextEditMode()) {
                    this.updateVerticalSpaceForEditorToolbar();
                }
            });
        }

        private createCloseTextEditModeEl(): Element {
            var closeButton = new AEl("close-edit-mode-button icon-close2");
            closeButton.onClicked((event: MouseEvent) => {
                this.setTextEditMode(false);
                event.stopPropagation();
                return false;
            });
            return closeButton;
        }

        private isPageScrolled() {
            return this.getEl().getScrollTop() > 0 || this.getEl().getParent().getScrollTop() > 0;
        }

        private toggleStickyToolbar() {
            if (!this.isPageScrolled()) {
                this.editorToolbar.removeClass("sticky-toolbar");
            }
            else if (!this.editorToolbar.hasClass("sticky-toolbar")) {
                this.editorToolbar.addClass("sticky-toolbar");
            }
        }

        appendContainerForTextToolbar() {
            if (!this.hasToolbarContainer()) {
                this.editorToolbar = new DivEl("mce-toolbar-container");
                this.appendChild(this.editorToolbar);
                this.addClass("has-toolbar-container");
            }
        }

        hasToolbarContainer(): boolean {
            return this.hasClass("has-toolbar-container");
        }

        getEditorToolbarHeight(): number {
            return !!this.editorToolbar ? this.editorToolbar.getEl().getHeightWithMargin() : 0;
        }

        private setIgnorePropertyChanges(value: boolean) {
            this.ignorePropertyChanges = value;
        }
/*
        highlight() {
            // Don't highlight page
        }

        unhighlight() {
            // Don't highlight page on hover
        }
*/
        highlightSelected() {
            var isDragging = DragAndDrop.get().isDragging();
            if (!this.isTextEditMode() && !this.isLocked() && !isDragging) {
                super.highlightSelected();
            }
        }

        showCursor() {
            if (!this.isTextEditMode() && !this.isLocked()) {
                super.showCursor();
            }
        }

        shade() {
            if (!this.isEmpty()) {
                super.shade();
            }
        }

        unshade() {
            if (!this.isLocked()) {
                super.unshade();
            }
        }

        private listenToMouseEvents() {
            Shader.get().onUnlockClicked((event: MouseEvent) => {
                if (this.isLocked()) {
                    this.setLocked(false);
                }
            });

            this.onMouseOverView(() => {
                var isDragging = DragAndDrop.get().isDragging();
                if (isDragging && this.lockedContextMenu) {
                    if (this.lockedContextMenu.isVisible()) {
                        this.lockedContextMenu.hide();
                    }
                }
            });
        }

        select(clickPosition?: Position, menuPosition?: ItemViewContextMenuPosition, isNew: boolean = false, rightClicked: boolean = false) {
            super.select(clickPosition, menuPosition, false, rightClicked);

            new PageSelectedEvent(this).fire();
        }

        selectWithoutMenu(isNew: boolean = false) {
            super.selectWithoutMenu(isNew);

            new PageSelectedEvent(this).fire();
        }

        showContextMenu(clickPosition?: Position, menuPosition?: ItemViewContextMenuPosition) {
            if (!this.isLocked()) {
                super.showContextMenu(clickPosition, menuPosition);
            }
        }

        createLockedContextMenu() {
            return new ItemViewContextMenu(this.getContextMenuTitle(), this.getLockedMenuActions());
        }

        getLockedMenuActions(): Action[] {
            var unlockAction = new Action("Customize");

            unlockAction.onExecuted(() => {
                this.setLocked(false);
            });

            return [unlockAction];
        }

        selectLocked(pos: Position) {
            this.setLockVisible(true);
            this.lockedContextMenu.showAt(pos.x, pos.y);

            new ItemViewSelectedEvent(this, pos).fire();
            new PageSelectedEvent(this).fire();
        }

        deselectLocked() {
            this.setLockVisible(false);
            this.lockedContextMenu.hide();

            new ItemViewDeselectedEvent(this).fire();
        }

        handleShaderClick(event: MouseEvent) {
            if (this.isLocked()) {
                if (!this.lockedContextMenu) {
                    this.lockedContextMenu = this.createLockedContextMenu();
                }
                if (this.lockedContextMenu.isVisible()) {
                    this.deselectLocked();
                }
                else {
                    this.selectLocked({x: event.pageX, y: event.pageY});
                }
            } else if (!this.isSelected() || event.which == 3) {
                this.handleClick(event);
            } else {
                this.deselect();
            }
        }

        handleClick(event: MouseEvent) {
            event.stopPropagation();

            if (this.isTextEditMode()) {
                if (!this.isTextEditorToolbarClicked(event) && !this.isTextEditorDialogClicked(event)) {
                    this.setTextEditMode(false);
                }
            } else {
                super.handleClick(event);
            }
        }

        private isTextEditorToolbarClicked(event: MouseEvent) {
            var target = <HTMLElement> event.target;
            if (!!target) {
                var parent = <HTMLElement> target.parentElement;
                return (target.id.indexOf("mce") >= 0 || target.className.indexOf("mce") >= 0 ||
                        parent.id.indexOf("mce") >= 0 || parent.className.indexOf("mce") >= 0)
            }
            return false;
        }

        private isTextEditorDialogClicked(event: MouseEvent) {
            var target = <HTMLElement> event.target;
            while (target) {
                if (target.classList.contains(HtmlModalDialog.CLASS_NAME)) {
                    return true;
                }
                target = target.parentElement;
            }
            return false;
        }

        hideContextMenu() {
            if (this.lockedContextMenu) {
                this.lockedContextMenu.hide();
            }
            return super.hideContextMenu();
        }

        isLocked() {
            return this.hasClass('locked');
        }

        setLockVisible(visible: boolean) {
            this.toggleClass('force-locked', visible);
        }

        setLocked(locked: boolean) {
            this.toggleClass('locked', locked);

            this.hideContextMenu();

            if (locked) {
                this.shade();

                new PageLockedEvent(this).fire();
            } else {
                this.unshade();

                if (!this.pageModel.isPageTemplate() || this.pageModel.getMode() == PageMode.AUTOMATIC) {
                    this.pageModel.initializePageFromDefault(this);
                }

                new PageUnlockedEvent(this).fire();
            }

            this.notifyPageLockChanged(locked);
        }

        isTextEditMode(): boolean {
            return this.hasClass('text-edit-mode');
        }

        setTextEditMode(flag: boolean) {
            this.toggleClass('text-edit-mode', flag);

            var textItemViews = this.getItemViewsByType(TextItemType.get());

            var textView: TextComponentView;
            textItemViews.forEach((view: ItemView) => {
                textView = <TextComponentView> view;
                if (textView.isEditMode() != flag) {
                    textView.setEditMode(flag);
                    this.closeTextEditModeButton.toggleClass("active", flag);
                }
            });

            if (flag) {
                this.addVerticalSpaceForEditorToolbar();

                this.onScrolled(this.scrolledListener);
                new PageTextModeStartedEvent(this).fire();
            }
            else {
                this.removeVerticalSpaceForEditorToolbar();
                this.unScrolled(this.scrolledListener);

                Highlighter.get().updateLastHighlightedItemView();
                SelectedHighlighter.get().updateLastHighlightedItemView();
            }

        }

        private addVerticalSpaceForEditorToolbar() {
            this.getPageView().getEl().setPosition("relative");
            this.updateVerticalSpaceForEditorToolbar()
            this.toggleStickyToolbar();
        }

        private updateVerticalSpaceForEditorToolbar() {
            var result = this.getEditorToolbarWidth();

            if (!!result) {
                this.getPageView().getEl().setTop(this.getEditorToolbarWidth() + "px");
            }
            else {
                this.waitUntilEditorToolbarShown();
            }

        }

        private waitUntilEditorToolbarShown() {
            var intervalId,
                toolbarHeight,
                attempts = 0;

            intervalId = setInterval(()=> {
                attempts++;
                toolbarHeight = this.getEditorToolbarWidth();
                if (!!toolbarHeight) {
                    this.getPageView().getEl().setTop(toolbarHeight + "px");
                    clearInterval(intervalId);
                }
                else if (attempts > 10) {
                    clearInterval(intervalId);
                }
            }, 50);

        }

        private removeVerticalSpaceForEditorToolbar() {
            this.getEl().setPosition("");
            this.getEl().setTop("");
        }

        private getEditorToolbarWidth(): number {
            return wemjq(".mce-toolbar-container .mce-tinymce-inline:not([style*='display: none'])").outerHeight();
        }

        hasTargetWithinTextComponent(target: HTMLElement) {
            var textItemViews = this.getItemViewsByType(TextItemType.get());
            var result: boolean = false;

            var textView: TextComponentView;
            textItemViews.forEach((view: ItemView) => {
                textView = <TextComponentView> view;
                if (textView.getEl().contains(target)) {
                    result = true;
                    return;
                }
            });

            return result;
        }

        isEmpty(): boolean {
            return !this.pageModel || this.pageModel.getMode() == PageMode.NO_CONTROLLER;
        }

        private isContentEmpty() {
            var content = this.liveEditModel.getContent();
            return (!content || StringHelper.isEmpty(content.getDisplayName()));
        }

        getName(): string {
            var pageTemplateDisplayName = PageTemplateDisplayName;
            if (this.pageModel.hasTemplate()) {
                return this.pageModel.getTemplate().getDisplayName();
            }
            if (this.pageModel.isCustomized()) {
                return this.pageModel.hasController()
                    ? this.pageModel.getController().getDisplayName()
                    : pageTemplateDisplayName[pageTemplateDisplayName.Custom];
            }
            if (this.pageModel.getMode() == PageMode.AUTOMATIC) {
                return this.pageModel.getDefaultPageTemplate().getDisplayName();
            }

            return pageTemplateDisplayName[pageTemplateDisplayName.Automatic];
        }

        getIconUrl(content: Content): string {
            return "";
        }

        getIconClass(): string {
            var largeIconCls = " icon-large";

            if (this.pageModel.hasTemplate()) {
                return "icon-newspaper" + largeIconCls;
            }
            if (this.pageModel.isCustomized()) {
                return "icon-cog" + largeIconCls;
            }

            return "icon-wand" + largeIconCls;
        }

        getParentItemView(): ItemView {
            return null;
        }

        setParentItemView(itemView: ItemView) {
            throw new Error("PageView is the topmost item view and cannot have a parent");
        }

        private registerRegionView(regionView: RegionView) {
            this.regionViews.push(regionView);

            regionView.onItemViewAdded(this.itemViewAddedListener);
            regionView.onItemViewRemoved(this.itemViewRemovedListener);
        }

        unregisterRegionView(regionView: RegionView) {
            var index = this.regionViews.indexOf(regionView);
            if (index > -1) {
                this.regionViews.splice(index, 1);

                regionView.unItemViewAdded(this.itemViewAddedListener);
                regionView.unItemViewRemoved(this.itemViewRemovedListener);
            }
        }

        getRegions(): RegionView[] {
            return this.regionViews;
        }

        getFragmentView(): ComponentView<Component> {
            return this.fragmentView;
        }

        toItemViewArray(): ItemView[] {

            var array: ItemView[] = [];
            array.push(this);
            this.regionViews.forEach((regionView: RegionView) => {
                var itemViews = regionView.toItemViewArray();
                array = array.concat(itemViews);
            });
            return array;
        }

        hasSelectedView(): boolean {
            return !!this.getSelectedView();
        }

        getSelectedView(): ItemView {
            for (var id in this.viewsById) {
                if (this.viewsById.hasOwnProperty(id) && this.viewsById[id].isSelected()) {
                    return this.viewsById[id];
                }
            }
            return null;
        }

        getItemViewById(id: ItemViewId): ItemView {
            assertNotNull(id, "value cannot be null");
            return this.viewsById[id.toNumber()];
        }

        getItemViewsByType(type: ItemType): ItemView[] {
            var views: ItemView[] = [];
            for (var key in this.viewsById) {
                if (this.viewsById.hasOwnProperty(key)) {
                    var view = this.viewsById[key];
                    if (type.equals(view.getType())) {
                        views.push(view);
                    }
                }
            }
            return views;
        }

        getItemViewByElement(element: HTMLElement): ItemView {
            assertNotNull(element, "element cannot be null");

            var itemId = ItemView.parseItemId(element);
            if (!itemId) {
                return null;
            }

            var itemView = this.getItemViewById(itemId);
            assertNotNull(itemView, "ItemView not found: " + itemId.toString());

            return itemView;
        }

        getRegionViewByElement(element: HTMLElement): RegionView {

            var itemView = this.getItemViewByElement(element);

            if (ObjectHelper.iFrameSafeInstanceOf(itemView, RegionView)) {
                return <RegionView>itemView;
            }
            return null;
        }

        getComponentViewByElement(element: HTMLElement): ComponentView<Component> {

            var itemView = this.getItemViewByElement(element);

            if (ObjectHelper.iFrameSafeInstanceOf(itemView, ComponentView)) {
                return <ComponentView<Component>> itemView;
            }

            return null;
        }

        getRegionViewByPath(path: RegionPath): RegionView {

            for (var i = 0; i < this.regionViews.length; i++) {
                var regionView = this.regionViews[i];

                if (path.hasParentComponentPath()) {
                    var componentView = this.getComponentViewByPath(path.getParentComponentPath());
                    if (ObjectHelper.iFrameSafeInstanceOf(componentView, LayoutComponentView)) {
                        var layoutView = <LayoutComponentView>componentView;
                        layoutView.getRegionViewByName(path.getRegionName());
                    }
                }
                else {
                    if (path.getRegionName() == regionView.getRegionName()) {
                        return regionView;
                    }
                }
            }

            return null;
        }

        getComponentViewByPath(path: ComponentPath): ComponentView<Component> {
            if (!path) {
                return this.fragmentView;
            }
            
            var firstLevelOfPath = path.getFirstLevel();

            for (var i = 0; i < this.regionViews.length; i++) {
                var regionView = this.regionViews[i];
                if (firstLevelOfPath.getRegionName() == regionView.getRegionName()) {
                    if (path.numberOfLevels() == 1) {
                        return regionView.getComponentViewByIndex(firstLevelOfPath.getComponentIndex());
                    }
                    else {
                        var layoutView: LayoutComponentView = <LayoutComponentView>regionView.getComponentViewByIndex(
                            firstLevelOfPath.getComponentIndex());
                        return layoutView.getComponentViewByPath(path.removeFirstLevel());
                    }
                }
            }

            return null;
        }


        private registerItemView(view: ItemView) {

            if (PageView.debug) {
                console.debug("PageView.registerItemView: " + view.toString());
            }

            this.viewsById[view.getItemId().toNumber()] = view;

            this.notifyItemViewAdded(view);
        }

        private unregisterItemView(view: ItemView) {

            if (PageView.debug) {
                console.debug("PageView.unregisterItemView: " + view.toString());
            }

            delete this.viewsById[view.getItemId().toNumber()];

            this.notifyItemViewRemoved(view);
        }

        private parseItemViews() {
            // unregister existing views
            for (var itemView in this.viewsById) {
                if (this.viewsById.hasOwnProperty(itemView)) {
                    this.unregisterItemView(this.viewsById[itemView]);
                }
            }

            // unregister existing regions
            this.regionViews.forEach((regionView: RegionView)=> {
                this.unregisterRegionView(regionView)
            });

            this.regionViews = [];
            this.viewsById = {};

            if (this.liveEditModel.getPageModel().getMode() === PageMode.FRAGMENT) {
                this.doParseFragmentItemViews();
            } else {
                this.doParseItemViews();
            }

            // register everything that was parsed
            this.toItemViewArray().forEach((itemView: ItemView) => {
                this.registerItemView(itemView);
            });
        }

        private doParseItemViews(parentElement?: Element) {

            var pageRegions = this.liveEditModel.getPageModel().getRegions();
            if (!pageRegions) {
                return;
            }
            var children = parentElement ? parentElement.getChildren() : this.getChildren();

            children.forEach((childElement: Element) => {
                var itemType = ItemType.fromElement(childElement);
                var isRegionView = ObjectHelper.iFrameSafeInstanceOf(childElement, RegionView);
                var region, regionName, regionView;

                if (isRegionView) {
                    regionName = RegionItemType.getRegionName(childElement);
                    region = pageRegions.getRegionByName(regionName);
                    if (region) {
                        // reuse existing region view
                        regionView = <RegionView> childElement;
                        // update view's data
                        regionView.setRegion(region);
                        // register it again because we unregistered everything before parsing
                        this.registerRegionView(regionView);
                    }

                } else if (itemType && RegionItemType.get().equals(itemType)) {
                    regionName = RegionItemType.getRegionName(childElement);
                    region = pageRegions.getRegionByName(regionName);

                    if (region) {
                        regionView = new RegionView(new RegionViewBuilder().
                            setLiveEditModel(this.liveEditModel).
                            setParentView(this).
                            setRegion(region).
                            setElement(childElement));

                        this.registerRegionView(regionView);
                    }

                } else {
                    this.doParseItemViews(childElement);
                }
            });
        }

        private doParseFragmentItemViews(parentElement?: Element) {

            var fragment = this.liveEditModel.getPageModel().getPage().getFragment();
            if (!fragment) {
                return;
            }
            var children = parentElement ? parentElement.getChildren() : this.getChildren();

            children.forEach((childElement: Element) => {
                var itemType = ItemType.fromElement(childElement);
                var component: Component = this.pageModel.getPage().getFragment();
                var componentView: ComponentView<Component>;

                if (itemType && itemType.isComponentType()) {
                    if (component) {
                        var itemViewConfig = new CreateItemViewConfig<PageView, Component>().setParentView(this).setData(
                            component).setElement(childElement).setParentElement(parentElement ? parentElement : this);
                        componentView = <ComponentView<Component>> itemType.createView(itemViewConfig);

                        this.registerFragmentComponentView(componentView);
                    }
                } else {
                    this.doParseFragmentItemViews(childElement);
                }
            });
        }

        registerFragmentComponentView(componentView: ComponentView<Component>) {
            componentView.onItemViewAdded(this.itemViewAddedListener);
            componentView.onItemViewRemoved(this.itemViewRemovedListener);

            this.registerItemView(componentView);
            if (componentView instanceof LayoutComponentView) {
                componentView.getRegions().forEach((regionView) => {
                    this.registerRegionView(regionView);
                });
            }
            this.fragmentView = componentView;
        }

        onItemViewAdded(listener: (event: ItemViewAddedEvent) => void) {
            this.itemViewAddedListeners.push(listener);
        }

        unItemViewAdded(listener: (event: ItemViewAddedEvent) => void) {
            this.itemViewAddedListeners = this.itemViewAddedListeners.filter((current) => (current != listener));
        }

        private notifyItemViewAdded(itemView: ItemView) {
            var event = new ItemViewAddedEvent(itemView);
            this.itemViewAddedListeners.forEach((listener) => listener(event));
        }

        onItemViewRemoved(listener: (event: ItemViewRemovedEvent) => void) {
            this.itemViewRemovedListeners.push(listener);
        }

        unItemViewRemoved(listener: (event: ItemViewRemovedEvent) => void) {
            this.itemViewRemovedListeners = this.itemViewRemovedListeners.filter((current) => (current != listener));
        }

        private notifyItemViewRemoved(itemView: ItemView) {
            var event = new ItemViewRemovedEvent(itemView);
            this.itemViewRemovedListeners.forEach((listener) => listener(event));
        }

        onPageLocked(listener: (event) => void) {
            this.pageLockedListeners.push(listener);
        }

        unPageLocked(listener: (event) => void) {
            this.pageLockedListeners = this.pageLockedListeners.filter((current) => (current != listener));
        }

        private notifyPageLockChanged(value) {
            this.pageLockedListeners.forEach((listener) => {
                listener(value);
            });
        }

        setDisabledContextMenu(value: boolean) {
            this.disableContextMenu = value;
        }

        isDisabledContextMenu(): boolean {
            return this.disableContextMenu;
        }
    }
