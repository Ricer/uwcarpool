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
function fieldError(fieldElem,errorStr){
  fieldElem.tooltip({
      placement:fieldElem.is("#makeRequest-time")?"right":"left",
      trigger:'manual',
      container:'#makeRequest',
      title:errorStr,
  }).tooltip('show').addClass('has-tooltip').closest('.form-group').addClass('has-error')
  fieldElem.one('keypress blur change',function(){
      fieldElem.tooltip('destroy').removeClass('has-tooltip').closest('.form-group').removeClass('has-error')
  });
}
MakeRequestModel=React.createClass({
  getInitialState: function() {
    return {people:"1",price:"",style:{}};
  },

  componentWillUnmount: function() {
  },

  componentDidUpdate:function(previousProps){
  },
  handleChange:function(e){
    var nextState={};
    var target=$(e.target);
    if(!target.attr("data-source")||target.attr("data-source")=="value"){
      nextState[target.attr("data-change")]=target.val();
    }else if(target.attr("data-source")=="html"){
      nextState[target.attr("data-change")]=target.html();
    }else{
      nextState[target.attr("data-change")]=target.attr(target.attr("data-source"))
    }
    this.setState(nextState);
  },

  componentDidMount:function(){
    $('#makeRequest-date').pickadate({
      container:'body',
      min: new Date(),
      clear:""
    })
    $('#makeRequest-time').pickatime({
      container:'body',
      interval: 10,
      clear:""
    })
    $('#makeRequest').on('show.bs.modal', function (e) {
      $('#makeRequest-from').val($('#filter-from').val())
      $('#makeRequest-to').val($('#filter-to').val())
      $('#makeRequest-date').val($('#filter-date').val())
    }).on('shown.bs.modal', function (e) {
      $('#makeRequest-from').focus();
    })
    makeOffer=this.showMakeOffer.bind(this)
    makeRequest=this.showMakeRequest.bind(this)
  },

  showMakeOffer:function(e){
    this.setState({type:"offer"},function(){
      $('#makeRequest').modal('show');
    })
  },

  showMakeRequest:function(e){
    this.setState({type:"request"},function(){
      $('#makeRequest').modal('show');
    })
  },

  submit:function(e){
    e.preventDefault();
    var errorElem;
    var from=$('#makeRequest-from')
    var to=$('#makeRequest-to')
    var date=$('#makeRequest-date')
    var time=$('#makeRequest-time')
    var desc=$('#makeRequest-desc')
    var price=$('#makeRequest-price')
    var re=/^\d+(\.\d{2})?$/
    if (  price.val() == ''      ){fieldError(price,"Cannot be empty");errorElem=price;}
    else if ( !re.test(price.val()) ){fieldError(price,"Not a valid price, only numbers and decimal point are allowed");errorElem=price;}

    if (  time.val() == ''      ){fieldError(time,"Cannot be empty");errorElem=time;}
    if (  date.val() == ''      ){fieldError(date,"Cannot be empty");errorElem=date;}
    if (  to.val() == ''      ){fieldError(to,"Cannot be empty");errorElem=to;}
    if (  from.val() == ''      ){fieldError(from,"Cannot be empty");errorElem=from;}

    if(errorElem){
        errorElem.focus();
        return false
    }
    var data={
      model:'Carpool',
      func:'make',
      user_id:data.user.id,
      type:this.state.type,
      from:from.val(),
      to:to.val(),
      date:moment(date.val()+" "+time.val()).format('YYYY-MM-DD hh:mm'),
      description:desc.val(),
      price:price.val(),
      people:this.state.people
    }
    $.ajax({url: "/post", dataType:"json",data:data,type:"POST"}).done(function( json ) {
      window.location="/detail/"+(json.data.id)
    }).fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log(err)
    });
    $('#makeRequest').modal('hide');
    return false;
  },

  render: function() {
    var singleText=(this.state.type=="request")?"person":"seat avaliable";
    var multiText=(this.state.type=="request")?"people":"seats avaliable";
    var title=(this.state.type=="request")?"Request":"Offer";
    return(
      <form onSubmit={this.submit} action="post">
        <div className="modal fade" id="makeRequest" tabindex="-1" role="dialog" aria-labelledby="makeRequestLabel" aria-hidden="true">
          <div className="modal-dialog" style={this.state.style}>
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 className="modal-title" id="makeRequestLabel">Make a {title}</h4>
              </div>
              <div className="modal-body">
                <div className="form-group has-icon col-sm-12">
                  <input type="text" className="form-control" id="makeRequest-from" placeholder="From" />
                  <label><span className="glyphicon glyphicon-map-marker from-marker"></span></label>
                </div>
                <div className="form-group has-icon col-sm-12">
                  <input type="text" className="form-control" id="makeRequest-to" placeholder="To" />
                  <label><span className="glyphicon glyphicon-map-marker to-marker"></span></label>
                </div>
                <div className="col-sm-6 form-group has-icon">
                  <input type="text" className="form-control" id="makeRequest-date" placeholder="Date" />
                  <label><i className='fa  fa-fw fa-calendar date-marker'/></label>
                </div>
                <div className="col-sm-6 form-group has-icon">
                  <input type="text" className="form-control" id="makeRequest-time" placeholder="Time" />
                  <label><i className='fa  fa-fw fa-clock-o date-marker'/></label>
                </div>
                <div className="col-sm-6 form-group has-icon">
                  <input type="text" className="form-control" id="makeRequest-price" placeholder="Price" value={this.state.price} onChange={this.handleChange} data-change="price"/>
                  <label><i className='fa  fa-fw fa-dollar price-marker'/></label>
                </div>
                <div className="col-sm-6 form-group has-icon">
                  <div className="dropdown">
                    <button className="form-control" id="makeRequest-people" data-toggle="dropdown" >{this.state.people+" "+(this.state.people==1?singleText:multiText)}</button>
                    <ul className="dropdown-menu" role="menu" aria-labelledby="dLabel">
                      <li><a onClick={this.handleChange} data-value="1" data-change="people" data-source="data-value">{"1 "+singleText}</a></li>
                      <li><a onClick={this.handleChange} data-value="2" data-change="people" data-source="data-value">{"2 "+multiText}</a></li>
                      <li><a onClick={this.handleChange} data-value="3" data-change="people" data-source="data-value">{"3 "+multiText}</a></li>
                      <li><a onClick={this.handleChange} data-value="4" data-change="people" data-source="data-value">{"4 "+multiText}</a></li>
                      <li><a onClick={this.handleChange} data-value="5" data-change="people" data-source="data-value">{"5 "+multiText}</a></li>
                      <li><a onClick={this.handleChange} data-value="6" data-change="people" data-source="data-value">{"6 "+multiText}</a></li>
                    </ul>
                  </div>
                  <label><i className='fa  fa-fw fa-users people-marker'/></label>
                </div>
                <div className="form-group col-sm-12 nomargin">
                  <textarea className="form-control" style={{resize: "vertical"}} id="makeRequest-desc" placeholder="Description" rows="8"></textarea>
                </div>
                <div className=' clearfix'></div>
              </div>
              <button type="button" className="btn btn-primary modal-footer" type="submit" >Submit</button>
            </div>
          </div>
        </div>
      </form>
    );
  }
});

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

CarpoolRow=React.createClass({
  getInitialState: function() {
    return {};
  },
  componentDidMount:function(e){
  },

  handleMouseEnter:function(){
    this.props.onMouseEnter(this.props.data);
  },

  render: function() {
    var data=this.props.data?this.props.data:{id:-1,type:"offer"}
    var classString="carpoolRow "+(this.props.className||"")+(this.props.data.user_type>3?"pro":"");
    var typeClassString="carpoolRow-type "+data.type
    var date=moment(data.date);
    return(
      <li key={data.id} className={classString}>
        <a href={'/detail/'+data.id} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.props.onMouseLeave}>
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
            <td className="arrival">{data.arrival}</td>
            <td className="name"><a href={"/user/"+data.user_id}>{data.firstname+" "+data.lastname}</a></td>
            <td className={"passenger_remaining "+(data.passenger_remaining<2?"one":"")}>{data.passenger_remaining}</td>
            <td className="price">${data.price}</td>
          </tr>
          </tbody>
          </table>
        </a>
      </li>
    );
  }
});




ListView=React.createClass({
  
  getInitialState: function() {
    return {previewData:{name:"",description:""},showPreview:false,page:1,requestCount:0,list:[],sortBy:"date",sortAsc:true,nomore:false,loading:false};
  },

  loadNextPage:function(){
    var that=this;
    this.setState({loading:true},function(){
      var data={model:'Carpool',
                func:'search',
                from:that.props.from,
                to:that.props.to,
                date:(that.props.date==""?"":moment(that.props.date).format('YYYY-MM-DD')),
                passenger:that.props.passenger,
                luggage:that.props.luggage,
                page:that.state.page-1,
                type:that.props.type};
      var rc=that.state.requestCount;
      console.log("try loading page "+that.state.page);
      $.ajax({url: "/post", dataType:"json",data:data,type:"POST"}).done(function( json ) {
        if(rc!=that.state.requestCount)return;
        console.log("done loading page "+that.state.page);
        that.setState({page:that.state.page+1,list:that.state.list.concat(json)})
        if(json.length<5)that.setState({nomore:true});
        that.setState({loading:false})
        that.handleScroll();
      }).fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log(err)
        that.setState({loading:false})
      });
    });
  },

  handleScroll: function(e) {
    var scrollAmount = $(window).scrollTop()+$(window).height();
    var documentHeight = $(document).height();
    //console.log(documentHeight-scrollAmount);
    if(documentHeight-scrollAmount<100){
      if(!this.state.nomore&&!this.state.loading)this.loadNextPage();
    }
  },
  handleMouseMove:function(e){
    var previewElem=$(".preview").css({top:e.clientY+20,left:e.clientX+15});
  },

  reload:function(e){
    this.setState({requestCount:this.state.requestCount+1,list:[],page:1,nomore:false},this.loadNextPage.bind(this));
  },

  componentWillUnmount: function() {
    $(window).off('scroll resize', this.handleScroll);
    $(window).off('mousemove', this.handleMouseMove);
  },

  componentDidUpdate:function(previousProps){
    if(previousProps.from!=this.props.from||previousProps.to!=this.props.to||previousProps.date!=this.props.date||previousProps.type!=this.props.type){
      console.log(previousProps.type+this.props.type);
      this.reload();
    }
  },

  componentDidMount:function(){
    this.loadNextPage();
    $(window).on('scroll resize', this.handleScroll);
    $(window).on('mousemove', this.handleMouseMove);
  },

  compareItems:function(a,b){
    if (a[this.state.sortBy] < b[this.state.sortBy])
      return (this.state.sortAsc)?-1:1;
    if (a[this.state.sortBy] > b[this.state.sortBy])
      return (this.state.sortAsc)?1:-1;
    return 0;
  },

  sortBy:function(str){
    var sortAsc=true;
    if(str==this.state.sortBy){
      sortAsc=!this.state.sortAsc;
    }
    this.setState({sortBy:str,sortAsc:sortAsc})
  },

  showPreview:function(data){
    //console.log("showing:"+info)
    this.setState({previewData:data,showPreview:true});
  },

  hidePreview:function(){
    //console.log("hiding")
    this.setState({showPreview:false});
  },
  showMakeModal:function(e){
    this.props.type=="offer"?makeRequest(e):makeOffer(e);
  },

  render: function() {
    var classString="listContent";
    var sorted=this.state.list//.sort(this.compareItems)
    var that=this;
    var items=sorted.map(function(item,i){
      return (<CarpoolRow key={item.id} data={item} onMouseEnter={that.showPreview.bind(that)} onMouseLeave={that.hidePreview.bind(that)} />);
    })
    if(this.state.page==1&&this.state.loading){
      items=(<div className="loading"><i className="fa fa-spinner fa-spin"></i><p>Loading..</p></div>)
    }else if(this.state.loading){
      items.push(<div className="loadingPage"><i className="fa fa-spinner fa-spin"></i></div>)
    }else if(this.state.nomore&&this.state.list.length==0){
      items=(<div className="none"><i className="fa fa-frown-o"></i><p>Sorry, we cannot find any carpool that matches your criteria.</p><span className="makeoffer" onClick={this.showMakeModal}>Make a {that.props.type=="offer"?"request ":"offer "} <i className="fa fa-angle-right"></i></span></div>)
    }else if(this.state.nomore)
      items.push(<div className="nomore"><i className="fa fa-exclamation-triangle"></i> No more matching carpool {that.props.type} avaliable. <a className="makeoffer" onClick={this.showMakeModal}>Make a {that.props.type=="offer"?"request ":"offer "} <i className="fa fa-angle-right"></i></a></div>)
    var preview=(
      <div className={"preview "+((this.state.showPreview)?"show":"")}><h5>{this.state.previewData.firstname+" "+this.state.previewData.lastname+": "}</h5>{this.state.previewData.description}</div>
    )
    return(
      <div className={classString}>
        <div className="container">
          <ul id="carpoolList">
            {items}
          </ul>

          {preview}
        </div>
      </div>
    );
  }
});

var previousScroll = 0;

FilterView=React.createClass({

  getInitialState: function() {
    return {hide:false,from:"",to:"",date:"",passenger:1,luggage:0,type:data.type};
  },
  componentWillUnmount: function() {
    $(window).off('typeChange', this.handleTypeChange.bind(this));
  },
  handleChange:function(e){
    var nextState={};
    nextState[$(e.target).attr("data-change")]=($(e.target).attr("data-html"))?e.target.innerHTML:e.target.value
    this.setState(nextState);
  },
  handleTypeChange:function(e){
    console.log("type changed")
    this.setState({type:data.type});
  },
  componentDidMount: function() {

    $(window).on('typeChange', this.handleTypeChange.bind(this));
    var that=this;
    $('#filter-date').pickadate({
      container: 'body',
      min: new Date(),
      onSet:function(){
        that.handleChange({target:$('#filter-date').get(0)});
      }
    })
    $('.filterPanel').on('affix.bs.affix',function(){
      that.setState({isTop:false})
    }).on('affix-top.bs.affix',function(){
      that.setState({isTop:true})
    }).affix({
      offset: {
        top: 150
      }
    })
  },
  render: function() {
    var classString="filterPanel "+(this.state.isTop?"affix-top":"affix");
    var list=(<ListView ref="list" type={this.state.type} from={this.state.from} to={this.state.to} date={this.state.date} passenger={this.state.passenger} luggage={this.state.luggage} />)
    var text=this.state.type=="offer"?"Offered":"Requested";
    var seatsText=this.state.type=="offer"?"Seats":"# of People";
    return(
      <div>
        <form role='form' onSubmit={this.search}>
        <div className={classString}>
          <div className="container">
            <div className='inputs'>
            <div className="merge-input col-xs-12 col-sm-4"> 
              <label><span className="glyphicon glyphicon-map-marker from-marker"></span></label>
              <input id='filter-from' value={this.state.from} placeholder="FROM" data-change="from" onChange={this.handleChange} />
            </div>
            <div className="merge-input col-xs-12 col-sm-4"> 
              <label><span className="glyphicon glyphicon-map-marker to-marker"></span></label>
              <input id='filter-to' value={this.state.to} placeholder="TO" data-change="to" onChange={this.handleChange}  />
            </div>
            <div className='merge-input col-xs-12 col-sm-4'> 
              <label><i className='fa fa-calendar date-marker'/></label>
              <input id='filter-date' type='text' ref='dateInput' id='filter-date' placeholder="DATE" className="form-control" data-format="YYYY-MM-DD"  value={this.state.date} data-change="date" onChange={this.handleChange}/>
            </div>
            </div>

            <div className="carpoolHeader">
              <table>
                <thead>
                  <tr>
                    <td>Date</td>
                    <td>Origin</td>
                    <td>Destination</td>
                    <td>{text} by</td>
                    <td>{seatsText}</td>
                    <td>Price</td>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
        {list}
        </form>
        <MakeRequestModel />
        <SettingsModel />
      </div>
    );
  }
});


React.renderComponent(
  <FilterView />,
  $("#filterWrapper").get(0)
);