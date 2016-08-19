import {Component} from "../../common/js/content/page/region/Component";
import {Page} from "../../common/js/content/page/Page";
import {Regions} from "../../common/js/content/page/region/Regions";
import {Region} from "../../common/js/content/page/region/Region";
import {ComponentType} from "../../common/js/content/page/region/ComponentType";
import {ComponentName} from "../../common/js/content/page/region/ComponentName";
import {DescriptorBasedComponentBuilder} from "../../common/js/content/page/region/DescriptorBasedComponent";
import {DescriptorBasedComponent} from "../../common/js/content/page/region/DescriptorBasedComponent";
import {ComponentView} from "../../common/js/liveedit/ComponentView";
import {PageView} from "../../common/js/liveedit/PageView";
import {PageViewBuilder} from "../../common/js/liveedit/PageView";
import {ItemView} from "../../common/js/liveedit/ItemView";
import {RegionView} from "../../common/js/liveedit/RegionView";
import {ItemViewId} from "../../common/js/liveedit/ItemViewId";
import {LayoutComponentView} from "../../common/js/liveedit/layout/LayoutComponentView";
import {TextComponentView} from "../../common/js/liveedit/text/TextComponentView";
import {ComponentViewDragStartedEvent} from "../../common/js/liveedit/ComponentViewDragStartedEvent";
import {ComponentViewDragStoppedEvent} from "../../common/js/liveedit/ComponentViewDraggingStoppedEvent";
import {LiveComponentAddedEvent as ComponentAddedEvent} from "../../common/js/liveedit/LiveComponentAddedEvent";
import {ItemViewDeselectedEvent} from "../../common/js/liveedit/ItemViewDeselectedEvent";
import {LiveComponentRemovedEvent as ComponentRemoveEvent} from "../../common/js/liveedit/LiveComponentRemovedEvent";
import {ItemViewSelectedEvent} from "../../common/js/liveedit/ItemViewSelectedEvent";
import {LiveComponentResetEvent as ComponentResetEvent} from "../../common/js/liveedit/LiveComponentResetEvent";
import {ItemViewIdProducer} from "../../common/js/liveedit/ItemViewIdProducer";
import {Shader} from "../../common/js/liveedit/Shader";
import {Highlighter} from "../../common/js/liveedit/Highlighter";
import {SelectedHighlighter} from "../../common/js/liveedit/SelectedHighlighter";
import {Cursor} from "../../common/js/liveedit/Cursor";
import {DragAndDrop} from "../../common/js/liveedit/DragAndDrop";
import {Exception} from "../../common/js/Exception";
import {SkipLiveEditReloadConfirmationEvent} from "../../common/js/liveedit/SkipLiveEditReloadConfirmationEvent";
import {InitializeLiveEditEvent} from "../../common/js/liveedit/InitializeLiveEditEvent";
import {Body} from "../../common/js/dom/Body";
import {ObjectHelper} from "../../common/js/ObjectHelper";
import {LiveEditPageInitializationErrorEvent} from "../../common/js/liveedit/LiveEditPageInitializationErrorEvent";
import {Tooltip} from "../../common/js/ui/Tooltip";
import {LiveEditPageViewReadyEvent} from "../../common/js/liveedit/LiveEditPageViewReadyEvent";
import {WindowDOM} from "../../common/js/dom/WindowDOM";
import {PageUnloadedEvent} from "../../common/js/liveedit/PageUnloadedEvent";
import {ComponentLoadedEvent} from "../../common/js/liveedit/ComponentLoadedEvent";
import {LayoutItemType} from "../../common/js/liveedit/layout/LayoutItemType";

export class LiveEditPage {

    private pageView: PageView;

    private skipNextReloadConfirmation: boolean = false;

    constructor() {

        SkipLiveEditReloadConfirmationEvent.on((event: SkipLiveEditReloadConfirmationEvent) => {
            this.skipNextReloadConfirmation = event.isSkip();
        });

        InitializeLiveEditEvent.on((event: InitializeLiveEditEvent) => {

            var liveEditModel = event.getLiveEditModel();

            var body = Body.get().loadExistingChildren();
            try {
                this.pageView =
                    new PageViewBuilder().setItemViewProducer(new ItemViewIdProducer()).setLiveEditModel(liveEditModel).setElement(
                        body).build();
            } catch (error) {
                if (ObjectHelper.iFrameSafeInstanceOf(error, Exception)) {
                    new LiveEditPageInitializationErrorEvent('The Live edit page could not be initialized. ' +
                                                                          error.getMessage()).fire();
                } else {
                    new LiveEditPageInitializationErrorEvent('The Live edit page could not be initialized. ' +
                                                                          error).fire();
                }
                return;
            }

            DragAndDrop.init(this.pageView);

            Tooltip.allowMultipleInstances(false);

            this.registerGlobalListeners();

            new LiveEditPageViewReadyEvent(this.pageView).fire();
        });
    }


    private registerGlobalListeners(): void {

        WindowDOM.get().onBeforeUnload((event) => {
            if (!this.skipNextReloadConfirmation) {
                var message = "This will close this wizard!";
                (event || window.event)['returnValue'] = message;
                return message;
            }
        });

        WindowDOM.get().onUnload((event) => {

            if (!this.skipNextReloadConfirmation) {
                new PageUnloadedEvent(this.pageView).fire();
                // do remove to trigger model unbinding
            } else {
                this.skipNextReloadConfirmation = false;
            }
            this.pageView.remove();
        });

        ComponentLoadedEvent.on((event: ComponentLoadedEvent) => {

            if (LayoutItemType.get().equals(event.getNewComponentView().getType())) {
                DragAndDrop.get().createSortableLayout(event.getNewComponentView());
            } else {
                DragAndDrop.get().refreshSortable();
            }
        });

        ComponentResetEvent.on((event: ComponentResetEvent) => {
            DragAndDrop.get().refreshSortable();
        });

        ComponentViewDragStartedEvent.on(() => {
            Highlighter.get().hide();
            SelectedHighlighter.get().hide();
            Shader.get().hide();
            Cursor.get().hide();

            // dragging anything should exit the text edit mode
            //this.exitTextEditModeIfNeeded();
        });

        ComponentViewDragStoppedEvent.on(() => {
            Cursor.get().reset();

            if (this.pageView.isLocked()) {
                Highlighter.get().hide();
                Shader.get().shade(this.pageView);
            }
        });

    }

}
