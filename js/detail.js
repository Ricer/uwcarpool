/** @jsx React.DOM */


MapView = React.createClass({
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
    function initialize() {;
      var mapOptions = {
        zoom: 14,
        disableDefaultUI: true
      };
      that.map = new google.maps.Map($(".map-canvas").get(0), mapOptions);
      // google.maps.event.addListenerOnce(map, 'idle', function() {
      //   google.maps.event.trigger(that.map, 'resize');
      // });
      //calcRoute();
      that.updateMapDisplay(that.props.from,that.props.to,that.props.showDirection);
    }
    initialize();
    //setTimeout(initialize,1000);

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

      <div id="map" className={classString}>
      </div>
    );
  }
});

CarpoolRow=React.createClass({
  getInitialState: function() {
    return {};
  },
  componentDidMount:function(e){
  },

  render: function() {
    var data=this.props.data
    var date=moment(data.date);
    return(
      <li className="carpoolRow">
        <a href={'/detail/'+data.id}>
          <table>
          <tbody>
          <tr>
            <td><div className='carpoolRow-date'>
              <p className='month'>{date.format("MMM")}</p>
              <p className='day'>{date.format("DD")}</p>
              <p className='time'>{date.format("hh:mm")}</p>
            </div>
            </td>
            <td className="departure">{data.departure}</td>
            <td className="to">to</td>
            <td className="arrival">{data.arrival}</td>
          </tr>
          </tbody>
          </table>
        </a>
        <div className='hiddenInfo'>
          <div className='driverInfo'><img className="profilePic" src="https://fbcdn-profile-a.akamaihd.net/hprofile-ak-frc1/t1/p160x160/1888716_707739892580029_325955122_n.jpg" />
          {data.name}</div>
          <div className='desc'>{data.description}</div>
        </div>
      </li>
    );
  }
});

React.renderComponent(
  <MapView from={item.departure} to={item.arrival} showDirection="true" />,
  $("#map-wrapper").get(0)
);
React.renderComponent(
  <CarpoolRow data={item} />,
  $("#carpoolRow-wrapper").get(0)
);