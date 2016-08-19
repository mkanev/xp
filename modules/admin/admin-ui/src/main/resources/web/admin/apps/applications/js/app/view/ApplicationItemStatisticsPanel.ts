import {ContentTypeSummary} from "../../../../../common/js/schema/content/ContentTypeSummary";
import {Mixin} from "../../../../../common/js/schema/mixin/Mixin";
import {RelationshipType} from "../../../../../common/js/schema/relationshiptype/RelationshipType";
import {RelationshipTypeName} from "../../../../../common/js/schema/relationshiptype/RelationshipTypeName";
import {PageDescriptor} from "../../../../../common/js/content/page/PageDescriptor";
import {PartDescriptor} from "../../../../../common/js/content/page/region/PartDescriptor";
import {LayoutDescriptor} from "../../../../../common/js/content/page/region/LayoutDescriptor";
import {ItemDataGroup} from "../../../../../common/js/app/view/ItemDataGroup";
import {ApplicationKey} from "../../../../../common/js/application/ApplicationKey";
import {Application} from "../../../../../common/js/application/Application";
import {MacroDescriptor} from "../../../../../common/js/macro/MacroDescriptor";
import {ItemStatisticsPanel} from "../../../../../common/js/app/view/ItemStatisticsPanel";
import {DivEl} from "../../../../../common/js/dom/DivEl";
import {ActionMenu} from "../../../../../common/js/ui/menu/ActionMenu";
import {ViewItem} from "../../../../../common/js/app/view/ViewItem";
import {StringHelper} from "../../../../../common/js/util/StringHelper";
import {GetMacrosRequest} from "../../../../../common/js/macro/resource/GetMacrosRequest";
import {DefaultErrorHandler} from "../../../../../common/js/DefaultErrorHandler";
import {GetPageDescriptorsByApplicationRequest} from "../../../../../common/js/content/page/GetPageDescriptorsByApplicationRequest";
import {GetPartDescriptorsByApplicationRequest} from "../../../../../common/js/content/page/region/GetPartDescriptorsByApplicationRequest";
import {GetLayoutDescriptorsByApplicationRequest} from "../../../../../common/js/content/page/region/GetLayoutDescriptorsByApplicationRequest";
import {GetContentTypesByApplicationRequest} from "../../../../../common/js/schema/content/GetContentTypesByApplicationRequest";
import {GetMixinsByApplicationRequest} from "../../../../../common/js/schema/mixin/GetMixinsByApplicationRequest";
import {GetRelationshipTypesByApplicationRequest} from "../../../../../common/js/schema/relationshiptype/GetRelationshipTypesByApplicationRequest";
import {AuthApplicationRequest} from "../../../../../common/js/application/AuthApplicationRequest";

import {ApplicationBrowseActions} from "../browse/ApplicationBrowseActions";

export class ApplicationItemStatisticsPanel extends ItemStatisticsPanel<Application> {

    private applicationDataContainer: DivEl;
    private actionMenu: ActionMenu;

    constructor() {
        super("application-item-statistics-panel");

        this.actionMenu =
            new ActionMenu("Application actions", ApplicationBrowseActions.get().START_APPLICATION,
                ApplicationBrowseActions.get().STOP_APPLICATION);

        this.appendChild(this.actionMenu);

        this.applicationDataContainer = new DivEl("application-data-container");
        this.appendChild(this.applicationDataContainer);
    }

    setItem(item: ViewItem<Application>) {
        var currentItem = this.getItem();

        if (currentItem && currentItem.equals(item)) {
            // do nothing in case item has not changed
            return;
        }

        super.setItem(item);
        var currentApplication = item.getModel();

        if (currentApplication.getIconUrl()) {
            this.getHeader().setIconUrl(currentApplication.getIconUrl());
        }

        if (currentApplication.getDescription()) {
            this.getHeader().setHeaderSubtitle(currentApplication.getDescription(), "app-description");
        }

        this.actionMenu.setLabel(StringHelper.capitalize(currentApplication.getState()));

        if (currentApplication.isStarted()) {
            ApplicationBrowseActions.get().START_APPLICATION.setEnabled(false);
            ApplicationBrowseActions.get().STOP_APPLICATION.setEnabled(true);
        } else {
            ApplicationBrowseActions.get().START_APPLICATION.setEnabled(true);
            ApplicationBrowseActions.get().STOP_APPLICATION.setEnabled(false);
        }


        this.applicationDataContainer.removeChildren();

        var infoGroup = new ItemDataGroup("Info", "info");
        infoGroup.addDataList("Build date", "TBA");
        infoGroup.addDataList("Version", currentApplication.getVersion());
        infoGroup.addDataList("Key", currentApplication.getApplicationKey().toString());
        infoGroup.addDataList("System Required",
            ">= " + currentApplication.getMinSystemVersion() + " and < " + currentApplication.getMaxSystemVersion());


        var descriptorResponse = this.initDescriptors(currentApplication.getApplicationKey());
        var schemaResponse = this.initSchemas(currentApplication.getApplicationKey());
        var macroResponse = this.initMacros(currentApplication.getApplicationKey());
        var providerResponse = this.initProviders(currentApplication.getApplicationKey());


        wemQ.all([descriptorResponse, schemaResponse, macroResponse, providerResponse]).spread((descriptorsGroup, schemasGroup, macrosGroup, providersGroup) => {
            if (!infoGroup.isEmpty()) {
                this.applicationDataContainer.appendChild(infoGroup);
            }
            if (descriptorsGroup && !descriptorsGroup.isEmpty()) {
                this.applicationDataContainer.appendChild(descriptorsGroup);
            }

            if (schemasGroup && !schemasGroup.isEmpty()) {
                this.applicationDataContainer.appendChild(schemasGroup);
            }

            if (macrosGroup && !macrosGroup.isEmpty()) {
                this.applicationDataContainer.appendChild(macrosGroup);
            }

            if (providersGroup && !providersGroup.isEmpty()) {
                this.applicationDataContainer.appendChild(providersGroup);
            }
        });

    }

    private initMacros(applicationKey: ApplicationKey): wemQ.Promise<any> {
        var macroPromises = [new GetMacrosRequest([applicationKey]).sendAndParse()]

        return wemQ.all(macroPromises).spread((macros: MacroDescriptor[])=> {

            var macrosGroup = new ItemDataGroup("Macros", "macros");

            var macroNames = macros.
            filter((macro: MacroDescriptor) => {
                return !ApplicationKey.SYSTEM.equals(macro.getKey().getApplicationKey());
            }).map((macro: MacroDescriptor) => {
                return macro.getDisplayName();
            });
            macrosGroup.addDataArray("Name", macroNames);

            return macrosGroup;
        }).catch((reason: any) => DefaultErrorHandler.handle(reason));
    }

    private initDescriptors(applicationKey: ApplicationKey): wemQ.Promise<any> {

        var descriptorPromises = [
            new GetPageDescriptorsByApplicationRequest(applicationKey).sendAndParse(),
            new GetPartDescriptorsByApplicationRequest(applicationKey).sendAndParse(),
            new GetLayoutDescriptorsByApplicationRequest(applicationKey).sendAndParse()
        ];

        return wemQ.all(descriptorPromises).spread(
            (pageDescriptors: PageDescriptor[], partDescriptors: PartDescriptor[], layoutDescriptors: LayoutDescriptor[]) => {

                var descriptorsGroup = new ItemDataGroup("Descriptors", "descriptors");

                var pageNames = pageDescriptors.map((descriptor: PageDescriptor) => descriptor.getName().toString()).sort(
                    this.sortAlphabeticallyAsc);
                descriptorsGroup.addDataArray("Page", pageNames);

                var partNames = partDescriptors.map((descriptor: PartDescriptor) => descriptor.getName().toString()).sort(
                    this.sortAlphabeticallyAsc);
                descriptorsGroup.addDataArray("Part", partNames);

                var layoutNames = layoutDescriptors.map((descriptor: LayoutDescriptor) => descriptor.getName().toString()).sort(
                    this.sortAlphabeticallyAsc);
                descriptorsGroup.addDataArray("Layout", layoutNames);

                return descriptorsGroup;
            }).catch((reason: any) => DefaultErrorHandler.handle(reason));
    }

    private initSchemas(applicationKey: ApplicationKey): wemQ.Promise<any> {

        var schemaPromises: wemQ.Promise<any>[] = [
            new GetContentTypesByApplicationRequest(applicationKey).sendAndParse(),
            new GetMixinsByApplicationRequest(applicationKey).sendAndParse(),
            new GetRelationshipTypesByApplicationRequest(applicationKey).sendAndParse()
        ];

        return wemQ.all(schemaPromises).spread<any>(
            (contentTypes: ContentTypeSummary[], mixins: Mixin[], relationshipTypes: RelationshipType[]) => {
                var schemasGroup = new ItemDataGroup("Schemas", "schemas");


                var contentTypeNames = contentTypes.map(
                    (contentType: ContentTypeSummary) => contentType.getContentTypeName().getLocalName()).sort(this.sortAlphabeticallyAsc);
                schemasGroup.addDataArray("Content Types", contentTypeNames);

                var mixinsNames = mixins.map((mixin: Mixin) => mixin.getMixinName().getLocalName()).sort(this.sortAlphabeticallyAsc);
                schemasGroup.addDataArray("Mixins", mixinsNames);

                var relationshipTypeNames = relationshipTypes.map(
                    (relationshipType: RelationshipType) => relationshipType.getRelationshiptypeName().getLocalName()).sort(
                    this.sortAlphabeticallyAsc);
                schemasGroup.addDataArray("RelationshipTypes", relationshipTypeNames);

                return schemasGroup;

            }).catch((reason: any) => DefaultErrorHandler.handle(reason))
    }

    private initProviders(applicationKey: ApplicationKey): wemQ.Promise<ItemDataGroup> {
        var providersPromises = [new AuthApplicationRequest(applicationKey).sendAndParse()];

        return wemQ.all(providersPromises).spread(
            (application: Application) => {
                if(application) {
                    var providersGroup = new ItemDataGroup("ID Providers", "providers");

                    providersGroup.addDataList("Key", application.getApplicationKey().toString());
                    providersGroup.addDataList("Name", application.getDisplayName());

                    return providersGroup;
                }
                return null;
            });
    }

    private sortAlphabeticallyAsc(a: string, b: string): number {
        return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());
    }

}
