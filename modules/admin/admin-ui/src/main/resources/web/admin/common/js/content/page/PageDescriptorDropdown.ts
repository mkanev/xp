import {LoadedDataEvent} from "../../util/loader/event/LoadedDataEvent";
import {Option} from "../../ui/selector/Option";
import {SiteModel} from "../site/SiteModel";
import {LiveEditModel} from "../../liveedit/LiveEditModel";
import {DescriptorBasedDropdown} from "./DescriptorBasedDropdown";
import {ApplicationRemovedEvent} from "../site/ApplicationRemovedEvent";
import {BaseLoader} from "../../util/loader/BaseLoader";
import {DescriptorByDisplayNameComparator} from "./DescriptorByDisplayNameComparator";
import {OptionSelectedEvent} from "../../ui/selector/OptionSelectedEvent";
import {PageDescriptor} from "./PageDescriptor";
import {GetPageDescriptorsByApplicationsRequest} from "./GetPageDescriptorsByApplicationsRequest";
import {PageDescriptorsJson} from "./PageDescriptorsJson";
import {PageDescriptorViewer} from "./PageDescriptorViewer";
import {SetController} from "./PageModel";

export class PageDescriptorDropdown extends DescriptorBasedDropdown<PageDescriptor> {

        private loadedDataListeners: {(event: LoadedDataEvent<PageDescriptor>):void}[];

        private liveEditModel: LiveEditModel;

        constructor(model: LiveEditModel) {

            this.loadedDataListeners = [];

            this.liveEditModel = model;

            super('page-controller', this.createLoader(), {
                optionDisplayValueViewer: new PageDescriptorViewer(),
                dataIdProperty: 'value'
            });

            this.initListeners();
        }

        private createLoader(): BaseLoader<PageDescriptorsJson, PageDescriptor> {
            var request = new GetPageDescriptorsByApplicationsRequest(this.liveEditModel.getSiteModel().getApplicationKeys());

            return new BaseLoader<PageDescriptorsJson, PageDescriptor>(request).setComparator(
                new DescriptorByDisplayNameComparator());
        }

        handleLoadedData(event: LoadedDataEvent<PageDescriptor>) {
            super.handleLoadedData(event);
            this.notifyLoadedData(event);
        }

        private initListeners() {
            this.onOptionSelected((event: OptionSelectedEvent<PageDescriptor>) => {
                var pageDescriptor = event.getOption().displayValue;
                var setController = new SetController(this).setDescriptor(pageDescriptor);
                this.liveEditModel.getPageModel().setController(setController);
            });

            var onApplicationAddedHandler = () => {
                this.updateRequestApplicationKeys();
                this.load();
            }

            var onApplicationRemovedHandler = (event: ApplicationRemovedEvent) => {

                this.updateRequestApplicationKeys();
                this.load();

                let currentController = this.liveEditModel.getPageModel().getController();
                if (currentController) {
                    let removedApp = event.getApplicationKey();
                    if (removedApp.equals(currentController.getKey().getApplicationKey())) {
                        this.liveEditModel.getPageModel().reset();
                    }
                }
            }

            this.liveEditModel.getSiteModel().onApplicationAdded(onApplicationAddedHandler);

            this.liveEditModel.getSiteModel().onApplicationRemoved(onApplicationRemovedHandler);

            this.onRemoved(() => {
                this.liveEditModel.getSiteModel().unApplicationAdded(onApplicationAddedHandler);
                this.liveEditModel.getSiteModel().unApplicationRemoved(onApplicationRemovedHandler);
            })
        }

        onLoadedData(listener: (event: LoadedDataEvent<PageDescriptor>) => void) {
            this.loadedDataListeners.push(listener);
        }

        unLoadedData(listener: (event: LoadedDataEvent<PageDescriptor>) => void) {
            this.loadedDataListeners = this.loadedDataListeners.filter((currentListener: (event: LoadedDataEvent<PageDescriptor>)=>void)=> {
                return currentListener != listener;
            });
        }

        private notifyLoadedData(event: LoadedDataEvent<PageDescriptor>) {
            this.loadedDataListeners.forEach((listener: (event: LoadedDataEvent<PageDescriptor>)=>void)=> {
                listener.call(this, event);
            });
        }

        private updateRequestApplicationKeys() {
            (<GetPageDescriptorsByApplicationsRequest>this.getLoader().getRequest()).setApplicationKeys(
                this.liveEditModel.getSiteModel().getApplicationKeys());
        }

    }
