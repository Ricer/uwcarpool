/** @jsx React.DOM */
var HeaderBar=React.createClass({
  getInitialState: function() {
    return {tab:1};
  },
  handleTabChange: function(e) {
    this.setState({tab:e})
  },
  logout:function(e){
    FB.logout();
  },
  render: function() {
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
                <li className="active"><a onClick={this.handleTabChange.bind(this,1)}><i className="fa fa-fw fa-th-list"></i> <span>Home</span></a></li>
                <li><a onClick={this.handleTabChange.bind(this,2)}><i className="fa fa-fw fa-cutlery"></i> <span>Offers</span></a></li>
                <li><a onClick={this.handleTabChange.bind(this,3)}><i className="fa fa-fw fa-gamepad"></i> <span>Request</span></a></li>
                <li className="dropdown">
                  <a className="user-info dropdown-toggle" data-toggle="dropdown"><i className="fa fa-fw fa-user"></i> {this.props.user.first_name}</a>
                  <ul className='dropdown-menu'>
                    <li><img src={this.props.user.picture}/><span>{this.props.user.name}</span></li>
                    <li className="divider"></li>
                    <li><a onClick={this.logout}>Logout</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
});

function initializeViews(){

  FB.api('/me', function(me) {
    FB.api('/me?fields=cover,picture', function(response) {
      me.picture=response.picture.data.url
      me.cover=(response.cover)?response.cover.source:null
      React.renderComponent(
        <HeaderBar user={me}/>,
        $("#main-wrapper").get(0)
      );
    });
  });
  $(".content").css("display","block")
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '414737555322863',
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });
  var subscribed=false;
  ConnectFn=function(response) {
    if (response.status === 'connected') {
      $("#loginModal").modal('hide');
      initializeViews();
    } else if (response.status === 'not_authorized') {
      propmtLogin();
    } else {
      propmtLogin();
    }

    if(!subscribed){FB.Event.subscribe('auth.authResponseChange', ConnectFn);subscribed=true}
  }
  FB.getLoginStatus(ConnectFn)
};

  // Load the SDK asynchronously
(function(d){
 var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement('script'); js.id = id; js.async = true;
 js.src = "http://connect.facebook.net/en_US/all.js";
 ref.parentNode.insertBefore(js, ref);
}(document));


function propmtLogin(){
  $("#loginModal").modal('show');
}