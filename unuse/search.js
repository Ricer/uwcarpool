
//google.maps.visualRefresh = true;
function initialize() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      var mapOptions = {
                    // How zoomed in you want the map to start at (always required)
                    zoom: 12,

                    // The latitude and longitude to center the map (always required)
                    center: new google.maps.LatLng(position.coords.latitude, 
                                     position.coords.longitude), // New York

                    // How you would like to style the map. 
                    // This is where you would paste any style found on Snazzy Maps.
                    // styles: [{'featureType':'water','stylers':[{'visibility':'on'},{'color':'#acbcc9'}]},{'featureType':'landscape','stylers':[{'color':'#f2e5d4'}]},{'featureType':'road.highway','elementType':'geometry','stylers':[{'color':'#c5c6c6'}]},{'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#e4d7c6'}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#fbfaf7'}]},{'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#c5dac6'}]},{'featureType':'administrative','stylers':[{'visibility':'on'},{'lightness':33}]},{'featureType':'road'},{'featureType':'poi.park','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':20}]},{},{'featureType':'road','stylers':[{'lightness':20}]}]
                };
      var map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);
    });
  } else {
    alert('geolocation not supported');
  }
  
}
$(function(){
  $('#searchTrigger').click(function(){
    if($("#searchPanel").is(".show")){
      $("#searchPanel").removeClass("show")
    }else{
      $("#searchPanel").addClass("show")
    }
  })
  $('#searchDepartDatePicker,#searchReturnDatePicker').datetimepicker({
    pickTime: false
  });
  $('#searchDepartTimePicker,#searchReturnTimePicker').datetimepicker({
    pickDate: false
  });
  //initialize();
  $("#searchReturnToggle").wrap('<div class="switch" />').parent().bootstrapSwitch().on('switch-change', function (e, data) {
    var value = $(data.el).attr("checked")
    $("#searchReturnField").slideToggle(value);
  });
  $(".listItem").click(function(e){
    $(".fold").toggleClass("open")
  })
})