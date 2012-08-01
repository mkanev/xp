Ext.define('Admin.controller.contentManager.FilterPanelController', {
    extend: 'Admin.controller.contentManager.Controller',

    /*      Controller for handling filter panel UI events       */

    stores: [],
    models: [],
    views: [
        'Admin.view.contentManager.FilterPanel'
    ],

    init: function () {
        this.control({
            'contentFilter': {
                search: this.doSearch
            }
        });
    },


    doSearch: function (values) {

        // set browse tab active
        this.getCmsTabPanel().setActiveTab(0);

        var filterPanel = this.getContentFilter();

        //TODO: submit the search

        // set the list mode
        var treeGridPanel = this.getContentTreeGridPanel();
        treeGridPanel.setActiveList(filterPanel.isDirty() ? 'grid' : 'tree');

        // update details to current selection
        var detailPanel = this.getContentDetailPanel();
        detailPanel.setData(treeGridPanel.getSelection());
    }


});