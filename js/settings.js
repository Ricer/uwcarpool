/** @jsx React.DOM */
SettingsModel=React.createClass({
  getInitialState: function() {
    return {user:data.user};
  },
  componentWillUnmount: function() {
  },
  componentDidUpdate:function(previousProps){
  },
  handleChange:function(e){
    var user=this.state.user;
    var target=$(e.target);
    if(!target.attr("data-source")||target.attr("data-source")=="value"){
      user[target.attr("data-change")]=target.val();
    }else if(target.attr("data-source")=="html"){
      user[target.attr("data-change")]=target.html();
    }else{
      user[target.attr("data-change")]=target.attr(target.attr("data-source"))
    }
    this.setState({user:user});
  },

  componentDidMount:function(){
    settings=this.showSettings.bind(this)
    $(".settingsNav>li>a").tab();
  },

  showSettings:function(){
    $('#settingsModal').modal('show');
  },

  submit:function(e){
    e.preventDefault();
    return false;
  },
  uploadNew:function(){
    $("#profilePicFileInput").click();
  },
  refreshUser:function(){
    this.setState({user:data.user});
  },
  upload:function(){
    var that=this;
    console.log("try to upload")
    var formData = new FormData($('.profilePicForm').get(0));
    $.ajax({
        url: '/post',  //Server script to process data
        type: 'POST',
        dataType:'json',
        success: function(json){
          if(json.success==1){
            console.log(json)
            data.user=json.data;
            that.refreshUser();
          }
        },
        error: function(){
        },
        // Form data
        data: formData,
        //Options to tell jQuery not to process data or worry about content-type.
        processData: false,
        cache: false,
        contentType: false,
    });
  },
  render: function() {
    return(
      <div className="modal fade" id="settingsModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              <h4 className="modal-title" >Settings</h4>
            </div>
            <div className="modal-body noPadding">
              <div className='sidebar'>
                <div className="profilePicWrapper">
                  <img className="profilePic" src={this.state.user.profilePicture||"/images/no_profile.png"} />
                  <button className="changeProfilePic" onClick={this.uploadNew}><i className="fa fa-pencil"></i>{this.state.user.profilePicture?" Change Picture":" Upload Picture"}</button>
                  <form className="profilePicForm" action="/post" method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="model" value="User" />
                    <input type="hidden" name="func" value="changeProfilePicture" />
                    <input type="hidden" name="user_id" value={this.state.user.id} />
                    <input type="file" name="profilePicture" id="profilePicFileInput" onChange={this.upload} />
                  </form>
                  <span className="userName">{this.state.user.firstname+" "+this.state.user.lastname}</span>
                </div>
                <ul className="nav nav-pills nav-stacked settingsNav">
                  <li className="active"><a href="#general" data-toggle="pill"><i className="fa fa-fw fa-user"></i> General</a></li>
                  <li><a href="#password" data-toggle="pill"><i className="fa fa-fw fa-pencil-square"></i> Password</a></li>
                  <li><a href="#vehicle" data-toggle="pill"><i className="fa fa-fw fa-truck"></i> Vehicle</a></li>
                  <li><a href="#facebookConnect" data-toggle="pill"><i className="fa fa-fw fa-facebook-square"></i> Facebook Connect</a></li>
                  <li><a href="#about" data-toggle="pill"><i className="fa fa-fw fa-info-circle"></i> About UWCarpool</a></li>
                </ul>
              </div>
              <div className="tab-content">
                <div className="tab-pane fade in active" id="general">
                  <form role="form">
                    <div className="form-group">
                    <div className="col-sm-6">
                      <label for="general-firstname">First Name</label>
                      <input type="email" className="form-control" id="general-firstname" placeholder="First Name" data-change="firstname" onChange={this.handleChange} value={this.state.user.firstname} />
                    </div>
                    <div className="col-sm-6">
                      <label for="general-lastname">Last Name</label>
                      <input type="email" className="form-control" id="general-lastname" placeholder="Last Name" data-change="lastname" onChange={this.handleChange}  value={this.state.user.lastname} />
                    </div>
                    <p className="help-block col-sm-12">Please user your real name so people knows who is who. It does not have to be legal name.</p>
                    </div>
                    <div className="form-group col-sm-12">
                      <label for="general-email">Email address</label>
                      <input type="email" className="form-control" id="general-email" placeholder="Email" data-change="email" onChange={this.handleChange}   value={this.state.user.email} />
                      
                      <div className="checkbox">
                        <label>
                          <input type="checkbox" /> Let UWCarpool send you the lasted promotion infomation.
                        </label>
                      </div>
                    </div>
                    <div className="col-sm-12">
                      <label for="general-cellphone">Cell phone</label>
                      <input type="email" className="form-control" id="general-cellphone" placeholder="Cell phone"  data-change="cellphone" onChange={this.handleChange}  value={this.state.user.cellphone}  />
                    </div>
                    <div className="clearfix"></div>
                    <button type="submit" className="btn btn-primary btn-lg submitBtn">Save</button>
                  </form>
                </div>
                <div className="tab-pane fade" id="password">password</div>
                <div className="tab-pane fade" id="vehicle">vehicle</div>
                <div className="tab-pane fade" id="facebookConnect">Connect to facebook</div>
                <div className="tab-pane fade" id="about">Connect to facebook</div>
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});


$(function(){
  $('body').append($("<div id='settingsModalWrapper'></div>"))
  React.renderComponent(
    <SettingsModel />,
    $("#settingsModalWrapper").get(0)
  );
})