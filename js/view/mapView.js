/** @jsx React.DOM */

var ReactTransitionGroup = React.addons.TransitionGroup;
define(['jsx!view/carpoolRow'],function(CarpoolRow){
  return React.createClass({
    map:null,
    markers:[],
    directionsService: new google.maps.DirectionsService(),
    directionsDisplay: new google.maps.DirectionsRenderer(),
    geocoderService: new google.maps.Geocoder(),
    getInitialState: function() {
      return {};
    },

    componentDidMount:function(e){
      var that=this;
      var from = new google.maps.LatLng(43.472368, -80.544855);
      var to = new google.maps.LatLng(43.663339, -79.395622)
      function initialize() {;
        var mapOptions = {
          zoom: 14,
          center: from,
          disableDefaultUI: true
        };
        that.map = new google.maps.Map($(".map-canvas").get(0), mapOptions);
        // google.maps.event.addListenerOnce(map, 'idle', function() {
        //   google.maps.event.trigger(that.map, 'resize');
        // });
        //calcRoute();
      }

      setTimeout(initialize,1000);

    },

    calcRoute: function (from,to) {
      var that=this;
      var request = {
        origin: from,
        destination: to,
        provideRouteAlternatives: false,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
      };
      this.directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          that.directionsDisplay.setMap(that.map);
          that.directionsDisplay.setDirections(response);

        }
      });
    },


    fitMapBound: function(pointa,pointb){
      var bounds = new google.maps.LatLngBounds();

      var points = [
        pointa,
        pointb
      ];

      // Extend bounds with each point
      for (var i = 0; i < points.length; i++) {
        bounds.extend(points[i]);
      }

      // Apply fitBounds
      this.map.fitBounds(bounds);  
    },
    getGeocode:function(address,callback){
      var that=this;
      this.geocoderService.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          callback(results[0].geometry.location)
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    },

    updateMapDisplay:function(from,to,showDirection){
      var that=this;
      this.clearMapDisplay();
      if(from!=""&&to!=""){
        if(showDirection){
          that.getGeocode(from,function(fromLocation){
            that.getGeocode(to,function(toLocation){
              that.calcRoute(fromLocation,toLocation);
            })
          })
        }else{
          that.getGeocode(from,function(fromLocation){
            that.getGeocode(to,function(toLocation){
              that.addMapMarker(fromLocation,false);
              that.addMapMarker(toLocation,false);
              that.fitMapBound(fromLocation,toLocation)
            })
          })
        }
        
      }else if(from!=""){
        that.getGeocode(from,function(location){
          that.addMapMarker(location,true);
        })
      }else if(to!=""){
        that.getGeocode(to,function(location){
          that.addMapMarker(location,true);
        })
      }
    },

    clearMapDisplay:function(){
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
      this.markers.length=0;
      this.directionsDisplay.setMap(null);
    },

    addMapMarker:function(location,setCenter){
      if(setCenter)this.setMapCenter(location);
      var marker = new google.maps.Marker({
          map: this.map,
          position: location
      });
      this.markers.push(marker);
    },

    componentDidUpdate:function(previousProps){
      if(previousProps.from!=this.props.from||previousProps.to!=this.props.to||previousProps.showDirection!=this.props.showDirection){
        this.updateMapDisplay(this.props.from,this.props.to,this.props.showDirection);
      }
    },


    setMapCenter:function(latlng) {

      // latlng is the apparent centre-point
      // offsetx is the distance you want that point to move to the right, in pixels
      // offsety is the distance you want that point to move upwards, in pixels
      // offset can be negative
      // offsetx and offsety are both optional
      var offsetx=-150,offsety=0;
      var scale = Math.pow(2, this.map.getZoom());
      var nw = new google.maps.LatLng(
          this.map.getBounds().getNorthEast().lat(),
          this.map.getBounds().getSouthWest().lng()
      );

      var worldCoordinateCenter = this.map.getProjection().fromLatLngToPoint(latlng);
      var pixelOffset = new google.maps.Point((offsetx/scale) || 0,(offsety/scale) ||0)

      var worldCoordinateNewCenter = new google.maps.Point(
          worldCoordinateCenter.x - pixelOffset.x,
          worldCoordinateCenter.y + pixelOffset.y
      );

      var newCenter = this.map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);

      this.map.panTo(newCenter);

    },
    render: function() {
      var classString="map-canvas"
      return(

        <div className="map-wrapper" >
          <div id="map-canvas" className={classString}>
          </div>
        </div>
      );
    }
  });
})