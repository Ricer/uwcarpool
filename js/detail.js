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
      <div id="map-wrapper">
        <div id="map" className={classString}>
        </div>
      </div>
    );
  }
});

CarpoolInfo=React.createClass({
  getInitialState: function() {
    return {};
  },
  componentDidMount:function(e){
  },
  payByCard:function(){
    handler.open({
      name: 'UWCarpool',
      description: 'carpool from '+this.props.data.departure+' to '+this.props.data.arrival,
      amount: this.props.data.price*100
    });
  },
  render: function() {
    var data=this.props.data
    var user=this.props.user
    var date=moment(data.date);
    var seatIndex=1;
    var seats=this.props.passengers.filter(function(item,i){
      return item.pending==0;
    }).map(function(item,i){
      var currentSeats=[(
        <div className='seatInfo'>
          <img className="profilePic" src={item.profilePicture||"/images/no_profile.png"} />
          <span className='seatName'>{item.firstname+" "+item.lastname}</span>
        </div>)]
      seatIndex+=1;
      for (var i = 1; i < item.passenger; i++) {
        currentSeats.push(
          <div className='seatInfo'>
            <img className="profilePic" src={item.profilePicture||"/images/no_profile.png"} />
            <span className='seatName'>{item.firstname+" "+item.lastname+"'s friend"}</span>
          </div>
        )
        seatIndex+=1
      };
      return (
        <div>
          {currentSeats}
        </div>)
    })
    var seatLeft=parseInt(data.passenger)+1-seatIndex;
    while(seatIndex<=data.passenger){
      seats.push(
        <div className='seatInfo empty'>
          <img className="profilePic" src="/images/no_profile.png" />
          <span className='seatName'>Empty Seat</span>
        </div>)
      seatIndex+=1
    }
    var confirm
    if(user&&user.id==data.user_id){
      var allPending=this.props.passengers.filter(function(item,i){
        return item.pending==1
      })
      if(allPending.length>0){
        confirm = [(<h4>Pending: <small>{allPending.length+" request"}</small></h4>)].concat(
        allPending.map(function(item,i){
          return (
            <div className='seatInfo pending'>
              <img className="profilePic" src={item.profilePicture||"/images/no_profile.png"} />
              <span className='seatName'>{item.firstname+" "+item.lastname}</span>
              <div className='seatDesc'>{item.passenger==1?"1 person":item.passenger+" people"}
              <form action="/detail/acceptPendingRequest" method="post" className="seatForm">
                <input type='hidden' name='passenger_id' value={item.id} />
                <input type='submit' className='seatBtn' value="accept" />
              </form>
              <form action="/detail/declinePendingRequest" method="post" className="seatForm">
                <input type='hidden' name='passenger_id' value={item.id} />
                <input type='submit' className='seatBtn' value="decline" />
              </form>
              </div>
            </div>)
      }))}else{
          confirm = (<div className='alert alert-info'>No Pending Requests</div>)
      }
    }else if(user){
      var mySeats=this.props.passengers.filter(function(item,i){
        return item.user_id==user.id;
      })
      if(mySeats.length>0&&mySeats[0].pending==1){
        confirm=(<div className='alert alert-info'>You request is still pending</div>)
      }else if(mySeats.length>0&&mySeats[0].paid==1){
        confirm=(<div>
          <div className='alert alert-info'>You have paid. Have fun!</div>
          </div>)
      }else if(mySeats.length>0){
        confirm=(<div>
            <div className='alert alert-info'>You are one of the passengers</div>
            <a className='btn btn-primary' onClick={this.payByCard}>Pay by Credit Card</a>
          </div>)
      }else{
        confirm =(
          <form action="/detail/applyForOffer" method="post" name="accept_form">
            <input type='hidden' name='carpool_id' value={data.id} />
            <input type='hidden' name='passenger' value="1" />
            <button type='submit' className='accept btn btn-primary'>{"apply this offer for $"+data.price}</button>
          </form>
        )
      }
    }else{

    }
    return(
      <div className="CarpoolInfo">
        <h4>Description: </h4>
        <div className="topRow">
        <table className='CarpoolInfo-date'>
          <tr>
          <td className='month'>{date.format("MMM")}
          </td>
          </tr>
          <tr>
          <td className='day'>{date.format("DD")}
          </td>
          </tr>
          <tr>
          <td className='time'>{date.format("hh:mm")}
          </td>
          </tr>
        </table>
        <table className='CarpoolInfo-location'>
          <tbody>
          <tr>
            <td className="departure">{data.departure}</td>
          </tr>
          <tr>
            <td className="arrival">{data.arrival}</td>
          </tr>
          </tbody>
        </table>
        <div className="clearfix" />
        </div>
          <div className='seatNote clearfix'>{data.description}</div>
        <div className=" seperator" />
        <h4>Driver:</h4>
        <div className='seatInfo'>
          <img className="profilePic" src={data.profilePicture||"/images/no_profile.png"} />
          <span className='seatName'>{data.firstname+" "+data.lastname}</span>
        </div>
        <div className=" seperator" />
        <h4>Seats: <small>{seatLeft+" out of "+data.passenger+" seats left.    $"+data.price+" per person"}</small></h4>
        {seats}
        <div className=" seperator" />

        {confirm}
        
      </div>
    );
  }
});

MainView=React.createClass({
  getInitialState: function() {
    return {showProfile:false,user:data.user,item:data.item};
  },
  componentDidMount:function(){
  },
  hideProfile:function(){this.setState({showProfile:false})},
  showProfile:function(){
    if(!this.state.showProfile){
      var that=this;
      this.setState({showProfile:true},function(){
        setTimeout(function(){$(window).one('click',that.hideProfile.bind(that))},50)
      });
    }
  },
  changeUser:function(userObj){
    this.setState({user:userObj})
  },
  openSetting:function(){
    settings();
  },
  render: function() {
    var userPage=this.state.user?(
                  <li><a onClick={this.showProfile}>{this.state.user.firstname}</a>
                    <div className={"profile "+(this.state.showProfile?"show":"")}>
                      <div className='info'>
                      <p className="name">{this.state.user.firstname+" "+this.state.user.lastname}</p>
                      <span className="makeoffer" onClick={this.makeRequest}>Make a request <i className="fa fa-angle-right"></i></span>
                      {(this.state.user.type>1)?(
                        <span className="makeoffer" onClick={this.makeOffer}>Make a offer <i className="fa fa-angle-right"></i></span>):""}
                      </div>
                      <div className='buttons'>
                        <a href="/dashboard"><i className="fa fa-tachometer"></i>Dashboard</a>
                        <a onClick={this.openSetting}><i className="fa fa-cog"></i>Settings</a>
                        <a href="/index/logout"><i className="fa fa-power-off"></i>Logout</a>
                      </div>
                    </div>
                  </li>):(<li><a href="login">Login</a></li>)
    var modals=this.state.user?(
      <div className="modals">
        <SettingsModel onSubmit={this.changeUser} user={this.state.user}/>
      </div>):{}
    return(
      <div>
        <MapView from={data.item.departure} to={data.item.arrival} showDirection="true" />
        {modals}
        <div className="infobar">
          <div className="header">
            <a className="navbar-brand" href="http://www.uwcarpool.com/"><span>UWCarpool </span><i className="fa fa-heart"></i></a>
            {userPage}
          </div>
          <CarpoolInfo data={data.item} passengers={data.passengers} user={data.user}/>
        </div>
      </div>
    );
  }
});

$(function(){
  $('body').append($("<div id='main'></div>"))
  React.renderComponent(
    <MainView />,
    $("#main").get(0)
  );
})