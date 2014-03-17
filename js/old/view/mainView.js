/** @jsx React.DOM */

define(['facebook','jsx!view/filterView','jsx!view/listView','jsx!view/mapView','jsx!view/detailView'],function(FB,FilterView,ListView,MapView,DetailView){
  return React.createClass({
    getInitialState: function() {
      return {page:1,listData:null,detailData:null,user:null};
    },
    logout:function(e){
      FB.logout();
    },
    login:function(e){
      FB.login();
    },
    getUser:function(){
      var that=this;
      FB.api('/me', function(me) {
        FB.api('/me?fields=cover,picture', function(response) {
          me.picture=response.picture.data.url
          me.cover=(response.cover)?response.cover.source:null
          that.setState({user:me});
        });
      });
    },
    componentDidMount:function(){
      var that=this,subscribed=false;
      var ConnectFn=function(response) {
        if (response.status === 'connected') {
          $("#loginModal").modal('hide');
          that.getUser();
        } else if (response.status === 'not_authorized') {
          that.setState({user:null})
        } else {
          that.setState({user:null})
        }

        if(!subscribed){
          FB.Event.subscribe('auth.authResponseChange', ConnectFn);
          that.clearLoadingScreen();
          subscribed=true;
        }
      }
      FB.init({
        appId      : '414737555322863',
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true  // parse XFBML
      });
      FB.getLoginStatus(ConnectFn);

      $(".has-tooltip").tooltip({
        container:'body'
      });
    },
    clearLoadingScreen:function(){
      $(".loading").fadeOut();
      $("#main-wrapper").fadeIn();
    },
    promptLogin:function(){
      $("#loginModal").modal('show');
    },
    showListView:function(data){
      var nextState={page:2}
      if(data)nextState.listData=data;
      this.setState(nextState)
    },
    showFilterView:function(){
      this.setState({page:1})
    },
    showDetailView:function(data){
      this.setState({page:3,detailData:data})
    },
    render: function() {
      var page={},userTab={}
      if(this.state.user){
        userTab=(
          <li className="dropdown">
            <a className="user-info dropdown-toggle" data-toggle="dropdown">{this.state.user.first_name} <span className="caret"></span></a>
            <ul className='dropdown-menu'>
              <li><img src={this.state.user.picture}/><span>{this.state.user.name}</span></li>
              <li className="divider"></li>
              <li><a onClick={this.logout}>Logout</a></li>
            </ul>
          </li>
        )
      }else{
        userTab=(<li><a onClick={this.promptLogin}>Login</a></li>)
      }
      console.log(this.state.detailData)
      var mapFrom="",mapTo="";
      if(this.state.page!=1){
        mapFrom=(this.state.page==2)?(this.state.listData?this.state.listData.from:""):(this.state.detailData?this.state.detailData.departure:"")
        mapTo=(this.state.page==2)?(this.state.listData?this.state.listData.to:""):(this.state.detailData?this.state.detailData.arrival:"")
      }
      return(
        <div className='main'>
          <nav className="navbar topbar navbar-default navbar-fixed-top" role="navigation">
            <div className="container">
              <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="#">Carpool Finder</a>
              </div>

              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="nav navbar-nav navbar-right">
                  <li className="active"><a><span>Home</span></a></li>
                  <li><a><span>Help</span></a></li>
                  <li><a><span>Offer a ride</span></a></li>
                  <li><a><span>Request a ride</span></a></li>
                  {userTab}
                </ul>
              </div>
            </div>
          </nav>
          <div className="modal fade bs-modal-sm" data-backdrop="static" data-keyboard="false" id="loginModal">
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Welcome.</h4>
                </div>
                <div className="modal-body">
                  <button type="button" className="btn btn-primary" onClick={this.login}>Log in with <i className="fa fa-facebook-square"></i> Facebook</button>
                </div>
              </div>
            </div>
          </div>
          <FilterView onSubmit={this.showListView} show={this.state.page==1}/>
          <ListView data={this.state.listData} onSubmit={this.showDetailView} onBack={this.showFilterView} show={this.state.page==2} />
          <DetailView data={this.state.detailData} onBack={this.showListView.bind(this,null)} show={this.state.page==3}/>
          <MapView from={mapFrom} to={mapTo} showDirection={this.state.detailData&&this.state.page==3}/>
        </div>
      );
    }
  });
})