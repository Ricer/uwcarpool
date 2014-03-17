/** @jsx React.DOM */

define(['jsx!view/mainView'], function(MainView){
  
  var app={
    initialize:function(){
      React.renderComponent(
        <MainView />,
        $("#main-wrapper").get(0)
      );
    }
  }

  return app
});