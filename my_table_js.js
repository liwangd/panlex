 $(document).ready(function()
         {
             $("#myTable").tablesorter({
                 widgets: ["zebra", "filter"],
                 widgetOptions : {
                   filter_cssFilter : 'tablesorter-filter',
                   filter_childRows : false,
                   filter_startsWith : false,
                   filter_ignoreCase : true,
                   filter_searchDelay : 300,
                   filter_functions : {}
                 }
             });
         }
        );