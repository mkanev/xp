// Type definitions for dialog-polyfill
// Definitions by: Mikita Taukachou <https://github.com/edloidas/>

declare module MaterialDesignLite {
    interface DialogPolyfill {

        /**
         * @param {!Element} element to upgrade
         */
        registerDialog(element: Element): void;
    }
}

declare var dialogPolyfill: MaterialDesignLite.DialogPolyfill;
