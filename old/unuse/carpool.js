/** @jsx React.DOM */

// Patch Bootstrap popover to take a React component instead of a
// plain HTML string
$.extend($.fn.popover.Constructor.DEFAULTS, {react: false});
var oldSetContent = $.fn.popover.Constructor.prototype.setContent;
$.fn.popover.Constructor.prototype.setContent = function() {
    if (!this.options.react) {
        return oldSetContent.call(this);
    }

    var $tip = this.tip();
    var title = this.getTitle();
    var content = this.getContent();

    $tip.removeClass('fade top bottom left right in');

    // If we've already rendered, there's no need to render again
    if (!$tip.find('.popover-content').html()) {
        // Render title, if any
        var $title = $tip.find('.popover-title');
        if (title) {
            React.renderComponent(title, $title[0]);
        } else {
            $title.hide();
        }

        React.renderComponent(content,  $tip.find('.popover-content')[0]);
    }
};


var ReactTransitionGroup = React.addons.TransitionGroup;


var MainView = React.createClass({
  getInitialState: function() {
    return {tab:1,user:{}};
  },
  handleTabChange: function(e) {
    this.setState({tab:e})
  },
  logout:function(e){
    FB.logout();
  },
  componentDidMount:function(){
    var that=this;
    FB.api('/me', function(me) {
      FB.api('/me?fields=cover,picture', function(response) {
        console.log(response)
        me.picture=response.picture.data.url
        me.cover=response.cover.source
        that.setState({user:me})
      });
    });
  },
  render: function() {
    var page={}
    if(this.state.tab==1){
      page=<TransactionList bgurl={this.state.user.cover}/>
    }
    return(
      <div className='main'>
        <div className='sidebar'>
          <ul className="nav nav-pills nav-stacked">
            <li className="active"><a onClick={this.handleTabChange.bind(this,1)}><i className="fa fa-fw fa-th-list"></i><span>All Transactions</span></a></li>
            <li><a onClick={this.handleTabChange.bind(this,2)}><i className="fa fa-fw fa-cutlery"></i><span>Food</span></a></li>
            <li><a onClick={this.handleTabChange.bind(this,3)}><i className="fa fa-fw fa-gamepad"></i><span>Entertainment</span></a></li>
            <li><a onClick={this.handleTabChange.bind(this,4)}><i className="fa fa-fw fa-book"></i><span>Other</span></a></li>
          </ul>
          <a className='user-info' onClick={this.logout}><img src={this.state.user.picture}/> {this.state.user.name}</a>
        </div>
        {page}
      </div>
    );
  }
});


function initializeViews(){
  React.initializeTouchEvents(true);
  React.renderComponent(
    <MainView />,
    $("#main-wrapper").get(0)
  );
}

