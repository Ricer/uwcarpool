requirejs.config({
    //By default load any module IDs from /js/
    baseUrl: 'js',

    paths: {
        jsx: "lib/jsx",
        JSXTransformer: 'lib/react/JSXTransformer',
        facebook: '//connect.facebook.net/en_US/all'
    },

    shim: {
        JSXTransformer: {
            exports: "JSXTransformer"
        },

        facebook : {
            exports: 'FB'
        }
    }
});


require(["jsx!app"], function(app) {
    app.initialize();
});

  


  



