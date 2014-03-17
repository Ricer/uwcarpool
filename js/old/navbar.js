/** @jsx React.DOM */

MainView=React.createClass({
  getInitialState: function() {
    return {showProfile:false,user:data.user,type:data.type};
  },
  componentDidMount:function(){
  },
  switchTo:function (str){
    $('#requestLi,#offerLi').removeClass('active')
    $('#'+str+"Li").addClass('active');
    data.type=str;
    $(window).trigger('typeChange');
  },
  switchToRequest:function(){switchTo('request')},
  switchToOffer:function(){switchTo('offer')},
  hideProfile:function(){this.setState({showProfile:false})},
  showProfile:function(){
    if(!this.state.showProfile){
      var that=this;
      this.setState({showProfile:true},function(){
        setTimeout(function(){$(window).one('click',that.hideProfile.bind(that))},50)
      });
    }
  },
  changeUser:function(){

  },
  openSetting:function(){

  },
  render: function() {
    var userPage=this.props.user?(
                  <li><a onClick={this.showProfile}>{this.props.user.firstname}</a>
                    <div className={"profile "+(this.state.showProfile?"show":"")}>
                      <div className='info'>
                      <p className="name">{this.props.user.firstname+" "+this.props.user.lastname}</p>
                      <span className="makeoffer" onclick="makeRequest(this)">Make a request <i className="fa fa-angle-right"></i></span>
                      {(this.props.user.type>1)?(
                        <span className="makeoffer" onclick="makeOffer(this)">Make a offer <i className="fa fa-angle-right"></i></span>):""}
                      </div>
                      <div className='buttons'>
                        <a href="/dashboard"><i className="fa fa-tachometer"></i>Dashboard</a>
                        <a onClick={this.openSetting}><i className="fa fa-cog"></i>Settings</a>
                        <a href="/index/logout"><i className="fa fa-power-off"></i>Logout</a>
                      </div>
                    </div>
                  </li>):(<li><a href="login">Login</a></li>)
    
    return(
      <div>
        <nav className="navbar topbar navbar-default navbar-fixed-top" role="navigation"  data-spy="affix" data-offset-top="150">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="http://www.uwcarpool.com/"><span>UWCarpool </span><i className="fa fa-heart"></i></a>
            </div>

            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav navbar-right">

                {this.props.user&&this.props.user.type>1?(
                  <li className="active" id='requestLi'><a onClick={this.switchToRequest}><span>Requests</span></a></li>):""}

                {this.props.user&&this.props.user.type>1?(
                  <li id='offerLi'><a onClick={this.switchToOffer}><span>Offers</span></a></li>
                ):(
                  <li className="active"><a><span>Offers</span></a></li>
                )}

                {(this.props.user&&this.props.user.type==1)?(<li><a href='become_a_driver'><span>Become a driver</span></a></li>):{}}

                {userPage}
              </ul>
            </div>
          </div>
        </nav>

        <SettingsModel onSubmit={this.changeUser}/>
        <FilterView />
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