import {Element} from "../dom/Element";
import {Body} from "../dom/Body";
import {WindowDOM} from "../dom/WindowDOM";

export class AppHelper {

        // Returns a function, that, as long as it continues to be invoked, will not
        // be triggered. The function will be called after it stops being called for
        // N milliseconds. If `immediate` is passed, trigger the function on the
        // leading edge, instead of the trailing.
        static debounce(func, wait, immediate) {
            var timeout;
            return function (...anyArgs: any[]) {
                var context = this, args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate) {
                        func.apply(context, args);
                    }
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    func.apply(context, args);
                }
            };
        }

        static preventDragRedirect(message: String = "", element?: Element) {
            element = element || Body.get();

            var window = WindowDOM.get();
            var timeout = null;

            var beforeUnloadHandler = (event) => {
                (event || window.asWindow().event)['returnValue'] = message;
                event.preventDefault();
                return message;
            };

            var unBeforeUnload = () => {
                timeout = null;
                window.unBeforeUnload(beforeUnloadHandler);
            };

            element.onDragOver(() => {
                if (!timeout) {
                    window.onBeforeUnload(beforeUnloadHandler);
                }
                clearTimeout(timeout);
                timeout = setTimeout(unBeforeUnload, 100);
            });
        }

        static dispatchCustomEvent(name: string, element: Element) {
            wemjq(element.getHTMLElement()).trigger(name);
        }

        static focusInOut(element: Element, onFocusOut: () => void, wait: number = 50, preventMouseDown: boolean = true) {
            let target,
                focusOutTimeout = 0;

            element.onFocusOut((event) => {
                if(target == event.target) {
                    focusOutTimeout = setTimeout(onFocusOut, wait);
                }
            });

            element.onFocusIn((event) => {
                target = event.target;
                clearTimeout(focusOutTimeout);
            });

            // Prevent focus loss on mouse down
            if (preventMouseDown) {
                element.onMouseDown((e) => {
                    e.preventDefault();
                });
            }
        }
    }

