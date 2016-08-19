import {ContentSummaryAndCompareStatus} from "../../../../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {ContentDependencyJson} from "../../../../../../../../common/js/content/json/ContentDependencyJson";
import {ContentDependencyGroupJson} from "../../../../../../../../common/js/content/json/ContentDependencyGroupJson";
import {ActionButton} from "../../../../../../../../common/js/ui/button/ActionButton";
import {Action} from "../../../../../../../../common/js/ui/Action";
import {DivEl} from "../../../../../../../../common/js/dom/DivEl";
import {NamesAndIconView} from "../../../../../../../../common/js/app/NamesAndIconView";
import {NamesAndIconViewBuilder} from "../../../../../../../../common/js/app/NamesAndIconView";
import {NamesAndIconViewSize} from "../../../../../../../../common/js/app/NamesAndIconViewSize";
import {ResolveDependenciesRequest} from "../../../../../../../../common/js/content/resource/ResolveDependenciesRequest";
import {JsonResponse} from "../../../../../../../../common/js/rest/JsonResponse";

import {WidgetItemView} from "../../WidgetItemView";
import {DependencyGroup, DependencyType} from "./DependencyGroup";
import {ToggleSearchPanelWithDependenciesEvent} from "../../../../browse/ToggleSearchPanelWithDependenciesEvent";

export class DependenciesWidgetItemView extends WidgetItemView {

    private mainContainer: DivEl;
    private nameAndIcon: NamesAndIconView;

    private noInboundDependencies: DivEl;
    private noOutboundDependencies: DivEl;

    private item: ContentSummaryAndCompareStatus;
    private inboundDependencies: DependencyGroup[];
    private outboundDependencies: DependencyGroup[];

    private inboundButton: ActionButton;
    private outboundButton: ActionButton;

    constructor() {
        super("dependency-widget-item-view");

        this.inboundButton = this.appendButton("Show Inbound", "btn-inbound");
        this.appendMainContainer();
        this.outboundButton = this.appendButton("Show Outbound", "btn-outbound");
        this.manageButtonClick();
    }

    private manageButtonClick() {
        this.inboundButton.getAction().onExecuted((action: Action) => {
            new ToggleSearchPanelWithDependenciesEvent(this.item.getContentSummary(), true).fire();
        });

        this.outboundButton.getAction().onExecuted((action: Action) => {
            new ToggleSearchPanelWithDependenciesEvent(this.item.getContentSummary(), false).fire();
        });
    }

    private setButtonDecoration(button: ActionButton, dependencies: DependencyGroup[]) {
        if (dependencies.length == 0) {
            button.hide();
        }
        else {
            button.setLabel(button.getAction().getLabel() + " (" + this.getTotalItemCount(dependencies) + ")");
            button.show();
        }
    }

    private appendButton(label: string, cls: string): ActionButton {
        var action = new Action(label)
        var button = new ActionButton(action);

        button.addClass(cls);
        this.appendChild(button);

        return button;
    }

    public setItem(item: ContentSummaryAndCompareStatus): wemQ.Promise<any> {
        if (DependenciesWidgetItemView.debug) {
            console.debug('DependenciesWidgetItemView.setItem: ', item);
        }

        this.item = item;
        return this.resolveDependencies(item);
    }

    private resetContainers() {
        this.mainContainer.removeChildren();

        this.removeClass("no-inbound");
        this.removeClass("no-outbound");
    }

    private appendMainContainer() {
        this.mainContainer = new DivEl("main-container");
        this.appendChild(this.mainContainer);
    }

    private appendContentNamesAndIcon(item: ContentSummaryAndCompareStatus) {
        this.nameAndIcon =
            new NamesAndIconView(new NamesAndIconViewBuilder().setSize(NamesAndIconViewSize.medium))
                .setIconUrl(item.getIconUrl())
                .setMainName(item.getDisplayName())
                .setSubName(item.getPath().toString());

        this.nameAndIcon.addClass("main-content");

        this.mainContainer.appendChild(this.nameAndIcon);
    }

    private createDependenciesContainer(type: DependencyType, dependencies: DependencyGroup[]): DivEl {
        var typeAsString = DependencyType[type].toLowerCase();
        var div = new DivEl("dependencies-container " + typeAsString);
        if (dependencies.length == 0) {
            this.addClass("no-"  + typeAsString);
            div.addClass("no-dependencies");
            div.setHtml("No " + typeAsString + " dependencies");
        }
        else {
            this.appendDependencies(div, dependencies);
        }

        this.mainContainer.appendChild(div);

        return div;
    }

    private renderContent(item: ContentSummaryAndCompareStatus) {
        this.resetContainers();

        this.noInboundDependencies = this.createDependenciesContainer(DependencyType.INBOUND, this.inboundDependencies);
        this.appendContentNamesAndIcon(item);
        this.noOutboundDependencies = this.createDependenciesContainer(DependencyType.OUTBOUND, this.outboundDependencies);

        this.setButtonDecoration(this.inboundButton, this.inboundDependencies);
        this.setButtonDecoration(this.outboundButton, this.outboundDependencies);
    }

    private getTotalItemCount(dependencies: DependencyGroup[]): number {
        var sum = 0;
        dependencies.forEach((dependencyGroup: DependencyGroup) => {
            sum += dependencyGroup.getItemCount();
        });

        return sum;
    }

    private appendDependencies(container: DivEl, dependencies: DependencyGroup[]) {
        dependencies.forEach((dependencyGroup: DependencyGroup) => {
            var dependencyGroupView = new NamesAndIconView(new NamesAndIconViewBuilder().setSize(NamesAndIconViewSize.small))
                .setIconUrl(dependencyGroup.getIconUrl())
                .setMainName("(" + dependencyGroup.getItemCount().toString() + ")");

            /* Tooltip is buggy
            dependencyGroupView.getEl().setTitle(dependencyGroup.getName());
            */

            container.appendChild(dependencyGroupView);
        });
    }

    /**
     * Perform request to resolve dependency items of given item.
     */
    private resolveDependencies(item: ContentSummaryAndCompareStatus): wemQ.Promise<any> {

        var resolveDependenciesRequest = new ResolveDependenciesRequest(item.getContentId());

        return resolveDependenciesRequest.send().then((jsonResponse: JsonResponse<ContentDependencyJson>) => {
            this.initResolvedDependenciesItems(jsonResponse.getResult());
            this.renderContent(item);
        });
    }

    /**
     * Inits arrays of properties that store results of performing resolve request.
     */
    private initResolvedDependenciesItems(json: ContentDependencyJson) {
        this.inboundDependencies = DependencyGroup.fromDependencyGroupJson(DependencyType.INBOUND, json.inbound);
        this.outboundDependencies = DependencyGroup.fromDependencyGroupJson(DependencyType.OUTBOUND, json.outbound);
    }

}
