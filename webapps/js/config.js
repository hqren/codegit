require.config({
    paths: {
        'geoJson': '../js/echarts/geoData/geoJson',
        'theme': '../js/echarts/theme',
        'data': './data',
        'map': '../js/echarts/map',
        'extension': '../js/echarts/extension'
    },
    packages: [
        {
            main: 'echarts',
            location: '../js/echarts/src',
            name: 'echarts'
        },
        {
            main: 'zrender',
            location: '../js/echarts/zrender/src',
            name: 'zrender'
        }
    ]
    // urlArgs: '_v_=' + +new Date()
});