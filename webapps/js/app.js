require.config({
    baseUrl:'js',
    paths: {
        "jQuery": "jquery.min",
        "bootstrap": "bootstrap.min",
        "cookie": "jquery.cookie.min",
        "table": "bootstrap-table",
        "table-zh-CN": "bootstrap-table-zh-CN",
        "layer": "layer",
        "select": "bootstrap-select.min",
        "select-zh-CN": "i18n/defaults-zh_CN.min",
        "dialog": "bootstrap-dialog.min",
        "datetimepicker": "bootstrap-datetimepicker.min",
        "datetimepicker-zh-CN": "bootstrap-datetimepicker.zh-CN",
        "Validator": "bootstrapValidator.min",
        "fileinput": "fileinput.min",
        "fileinput-zh-CN": "locales",
        "notify": "bootstrap-notify.min",
        "main": "main",
    },
    shim: {
    	'main': {
           deps: ['jQuery','bootstrap','cookie','table']
        }, 
        'cookie': {
           deps: ['jQuery']
        }, 
    }
});
