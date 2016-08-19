import {WindowDOM} from "../../dom/WindowDOM";
import {Element} from "../../dom/Element";
import {Body} from "../../dom/Body";
import {ResponsiveItem} from "./ResponsiveItem";
import {ResponsiveListener} from "./ResponsiveListener";

export class ResponsiveManager {

        private static window = WindowDOM.get();

        private static responsiveListeners: ResponsiveListener[] = [];

        // Custom handler will be executed in addition on element update
        static onAvailableSizeChanged(el: Element, handler: (item: ResponsiveItem) => void = (item: ResponsiveItem) => {
        }): ResponsiveItem {
            var responsiveItem: ResponsiveItem = new ResponsiveItem(el, handler),
                listener = () => {
                    if (el.isVisible()) {
                        responsiveItem.update();
                    }
                },
                responsiveListener = new ResponsiveListener(responsiveItem, listener);

            this.updateItemOnShown(el, responsiveItem);

            ResponsiveManager.responsiveListeners.push(responsiveListener);

            ResponsiveManager.window.getHTMLElement().addEventListener('availablesizechange', listener);
            ResponsiveManager.window.onResized(listener);

            return responsiveItem;
        }

        private static updateItemOnShown(el: Element, responsiveItem: ResponsiveItem) {
            if (el.isVisible()) {
                responsiveItem.update();
            } else {
                var renderedHandler = (event) => {
                    responsiveItem.update();
                    el.unShown(renderedHandler); // update needs
                };
                el.onShown(renderedHandler);
            }
        }

        static unAvailableSizeChanged(el: Element) {

            ResponsiveManager.responsiveListeners =
                ResponsiveManager.responsiveListeners.filter((curr) => {
                    if (curr.getItem().getElement() === el) {
                        ResponsiveManager.window.getHTMLElement().removeEventListener('availablesizechange', curr.getListener());
                        ResponsiveManager.window.unResized(curr.getListener());
                        return false;
                    } else {
                        return true;
                    }
                });
        }

        static unAvailableSizeChangedByItem(item: ResponsiveItem) {

            ResponsiveManager.responsiveListeners =
                ResponsiveManager.responsiveListeners.filter((curr) => {
                    if (curr.getItem() === item) {
                        ResponsiveManager.window.getHTMLElement().removeEventListener('availablesizechange', curr.getListener());
                        ResponsiveManager.window.unResized(curr.getListener());
                        return false;
                    } else {
                        return true;
                    }
                });
        }

        // Manual event triggering
        static fireResizeEvent() {
            var customEvent = document.createEvent('Event');
            customEvent.initEvent('availablesizechange', false, true); // No bubbling
            ResponsiveManager.window.getHTMLElement().dispatchEvent(customEvent);
        }

        static getWindow(): WindowDOM {
            return ResponsiveManager.window;
        }
    }

    ResponsiveManager.onAvailableSizeChanged(Body.get());
