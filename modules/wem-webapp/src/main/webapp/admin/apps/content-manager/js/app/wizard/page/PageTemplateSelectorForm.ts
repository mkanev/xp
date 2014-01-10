module app.wizard.page {

    export class PageTemplateSelectorForm extends api.ui.form.Form {

        private pageTemplateComboBox: api.content.page.PageTemplateComboBox;

        private pageTemplateChangedListeners: {(changedTo: api.content.page.PageTemplateSummary): void;}[] = [];

        constructor() {
            super("PageTemplateSelectorForm");
            this.addClass("page-template-selector-form");

            this.pageTemplateComboBox =new api.content.page.PageTemplateComboBox();

            var fieldSet = new api.ui.form.Fieldset(this, "Page Template");
            fieldSet.add(new api.ui.form.FormItem("Selected", this.pageTemplateComboBox));
            this.fieldset(fieldSet);


            this.pageTemplateComboBox.addOptionSelectedListener((option: api.ui.combobox.Option<api.content.page.PageTemplateSummary>) => {
                this.notifyPageTemplateChanged(option.displayValue);
            });


            this.pageTemplateComboBox.addSelectedOptionRemovedListener(() => {
                this.notifyPageTemplateChanged(null);
            });
        }

        layoutExisting(siteTemplateKey: api.content.site.template.SiteTemplateKey,
                       selectedPageTemplate: api.content.page.PageTemplate): Q.Promise<void> {
            var deferred = Q.defer<void>();

            this.pageTemplateComboBox.setSiteTemplateKey(siteTemplateKey);
            this.pageTemplateComboBox.addLoadedListener((pageTemplates:api.content.page.PageTemplateSummary[]) => {
                    pageTemplates.forEach((template:api.content.page.PageTemplateSummary) => {
                        if (template.getKey() == selectedPageTemplate.getKey()) {
                            this.pageTemplateComboBox.setTemplate(template);
                        }
                    });
                    deferred.resolve(null);
                }
            );

            return deferred.promise;
        }

        private notifyPageTemplateChanged(changedTo: api.content.page.PageTemplateSummary) {
            this.pageTemplateChangedListeners.forEach((listener) => {
                listener(changedTo);
            });
        }

        addPageTemplateChangedListener(listener: {(changedTo: api.content.page.PageTemplateSummary): void;}) {
            this.pageTemplateChangedListeners.push(listener);
        }

        removePageTemplateChangedListener(listener: {(changedTo: api.content.page.PageTemplateSummary): void;}) {
            this.pageTemplateChangedListeners = this.pageTemplateChangedListeners.filter(function (curr) {
                return curr != listener;
            });
        }

        public getPageTemplateKey(): api.content.page.PageTemplateKey {
            return this.pageTemplateComboBox.getSelectedData()[0].displayValue.getKey();
        }
    }
}
