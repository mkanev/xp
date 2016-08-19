import {PageDescriptor} from "../content/page/PageDescriptor";
import {PageDescriptorDropdown} from "../content/page/PageDescriptorDropdown";
import {LoadedDataEvent} from "../util/loader/event/LoadedDataEvent";
import {GetContentTypeByNameRequest} from "../schema/content/GetContentTypeByNameRequest";
import {ContentType} from "../schema/content/ContentType";
import {DivEl} from "../dom/DivEl";
import {StyleHelper} from "../StyleHelper";
import {DefaultErrorHandler} from "../DefaultErrorHandler";
import {ItemViewPlaceholder} from "./ItemViewPlaceholder";
import {PagePlaceholderInfoBlock} from "./PagePlaceholderInfoBlock";
import {PageView} from "./PageView";

export class PagePlaceholder extends ItemViewPlaceholder {

        constructor(pageView: PageView) {
            super();
            this.addClassEx("page-placeholder");

            var pageDescriptorPlaceholder = new DivEl("page-descriptor-placeholder", StyleHelper.getCurrentPrefix());

            var infoBlock = new PagePlaceholderInfoBlock();
            var controllerDropdown = this.createControllerDropdown(pageView, infoBlock);

            pageDescriptorPlaceholder.appendChild(infoBlock);
            pageDescriptorPlaceholder.appendChild(controllerDropdown);

            this.appendChild(pageDescriptorPlaceholder);
        }

        private createControllerDropdown(pageView: PageView, infoBlock: PagePlaceholderInfoBlock): PageDescriptorDropdown {
            var controllerDropdown = new PageDescriptorDropdown(pageView.getLiveEditModel());
            controllerDropdown.addClassEx("page-descriptor-dropdown");
            controllerDropdown.load();

            this.addControllerDropdownEvents(controllerDropdown, pageView, infoBlock)

            return controllerDropdown;
        }

        private addControllerDropdownEvents(controllerDropdown: PageDescriptorDropdown, pageView: PageView, infoBlock: PagePlaceholderInfoBlock) {
            controllerDropdown.onLoadedData((event: LoadedDataEvent<PageDescriptor>) => {
                if (event.getData().length > 0) {
                    controllerDropdown.show();
                    var content = pageView.getLiveEditModel().getContent();
                    if (!content.isPageTemplate()) {
                        new GetContentTypeByNameRequest(content.getType()).sendAndParse().then((contentType: ContentType) => {
                            infoBlock.setTextForContent(contentType.getDisplayName());
                        }).catch((reason)=> {
                            infoBlock.setTextForContent(content.getType().toString());
                            DefaultErrorHandler.handle(reason);
                        }).done();
                    }
                    infoBlock.removeClass("empty");
                }
                else {
                    controllerDropdown.hide();
                    infoBlock.setNoControllersAvailableText();
                    infoBlock.addClass("empty");
                }
            });


            controllerDropdown.onClicked((event: MouseEvent) => {
                controllerDropdown.giveFocus();
                event.stopPropagation();
            });
        }
    }
