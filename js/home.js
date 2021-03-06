/** @jsx React.DOM */

/*=============================================
=            Patch Bootstrap popover 
=            to take a React component
=            instead of a plain HTML string   
=============================================*/
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
/*-----  End of Patch  ------*/



/**
*
* Make Request View
* use bootstrap modal
* 
* Self Registered Global functions:
*   makeOffer()  //show make offer modal
*   makeRequest()  //show make request modal
**/
MakeRequestModel=React.createClass({
  getInitialState: function() {
    return {people:"1",price:"",style:{}};
  },

  componentWillUnmount: function() {
  },

  componentDidUpdate:function(previousProps){
  },

  /**
  *
  * handleChange(e)
  * e: react event, e.target must be a html element
  * automatically change states according to input's data-values
  * 
  * data-source (default:value): html|value|<attr-name>
  * data-change (required): name of the state that the input is changing
  * 
  * eg:
  *   <a onClick={this.handleChange} 
  *      data-value="1" 
  *      data-change="people" 
  *      data-source="data-value"></a>
  *   POST: change state named "people" to 1
  **/
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
    var that=this;
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
      // take values from filter view's inputs
      $('#makeRequest-from').val($('#filter-from').val())
      $('#makeRequest-to').val($('#filter-to').val())
      $('#makeRequest-date').val($('#filter-date').val())
    })

    $('#makeRequest-from,#makeRequest-to').autocomplete({
      serviceUrl: '/index/getLocations',
      minChars:0,
      onSelect:function(){
        that.handleChange({target:this});
      }
    })

    //bind external functions:
    makeOffer=this.showMakeOffer.bind(this)
    makeRequest=this.showMakeRequest.bind(this)
  },

  fieldError:function(fieldElem,errorStr){
    fieldElem.tooltip({
        placement:fieldElem.is("#makeRequest-time")?"right":"left",
        trigger:'manual',
        container:'#makeRequest',
        title:errorStr,
    }).tooltip('show').addClass('has-tooltip').closest('.form-group').addClass('has-error')
    fieldElem.one('keypress blur change',function(){
        fieldElem.tooltip('destroy').removeClass('has-tooltip').closest('.form-group').removeClass('has-error')
    });
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
    if (  price.val() == ''      ){this.fieldError(price,"Cannot be empty");errorElem=price;}
    else if ( !re.test(price.val()) ){this.fieldError(price,"Not a valid price, only numbers and decimal point are allowed");errorElem=price;}

    if (  time.val() == ''      ){this.fieldError(time,"Cannot be empty");errorElem=time;}
    if (  date.val() == ''      ){this.fieldError(date,"Cannot be empty");errorElem=date;}
    if (  to.val() == ''      ){this.fieldError(to,"Cannot be empty");errorElem=to;}
    if (  from.val() == ''      ){this.fieldError(from,"Cannot be empty");errorElem=from;}

    if(errorElem){
      errorElem.focus();
      return false
    }

    var data={
      model:'Carpool',
      func:'make',
      user_id:this.props.user.id,
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


CarpoolDetail=React.createClass({
  getInitialState: function() {
    return {};
  },
  componentDidMount:function(e){
    showDetail=this.showDetail;
  },
  showDetail:function(id){
    $('#carpoolDetailModal').modal('show');
    $('#carpoolDetailModal .modal-content').load('/detail/'+id);
  },
  render: function() {
    return(
      <div className="modal fade" id="carpoolDetailModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
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

  openDetail:function(){
    showDetail(this.props.data.id);
  },

  render: function() {
    var data=this.props.data?this.props.data:{id:-1,type:"offer"}
    var classString="carpoolRow "+(this.props.className||"");
    var typeClassString="carpoolRow-type "+data.type
    var date=moment(data.date);
    return(
      <li key={data.id} className={classString}>
        <a onClick={this.openDetail} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.props.onMouseLeave}>
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
      //console.log("try loading page "+that.state.page);
      $.ajax({url: "/post", dataType:"json",data:data,type:"POST"}).done(function( json ) {
        if(rc!=that.state.requestCount)return;
        //console.log("done loading page "+that.state.page);
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
      if(that.props.user&&item.user_id==that.props.user.id){
        item.firstname=that.props.user.firstname;
        item.lastname=that.props.user.lastname;
      }
      return (<CarpoolRow key={item.id} data={item} onMouseEnter={that.showPreview.bind(that)} onMouseLeave={that.hidePreview.bind(that)}/>);
    })
    if(this.state.page==1&&this.state.loading){
      items=(<div className="loading"><i className="fa fa-spinner fa-spin"></i><p>Loading..</p></div>)
    }else if(this.state.loading){
      items.push(<div className="loadingPage"><i className="fa fa-spinner fa-spin"></i></div>)
    }else if(this.state.nomore&&this.state.list.length==0){
      items=(
        <div className="none"><i className="fa fa-frown-o"></i><p>Sorry, we cannot find any carpool that matches your criteria.</p>
          {this.props.user?(<span className="makeoffer" onClick={this.showMakeModal}>Make a {that.props.type=="offer"?"request ":"offer "} <i className="fa fa-angle-right"></i></span>):(
            <span href='/login' className="makeoffer">Login to make {that.props.type=="offer"?"request ":"offer "} <i className="fa fa-angle-right"></i></span>)}
        </div>)
    }else if(this.state.nomore)
      items.push(
        <div className="alert alert-danger"><i className="fa fa-exclamation-triangle"></i> Thats all matching {that.props.type} avaliable. 
          {this.props.user?(<a className="alert-link pull-right" onClick={this.showMakeModal}>Make a {that.props.type=="offer"?"request ":"offer "} <i className="fa fa-angle-right"></i></a>):(
            <a href='/login' className="alert-link pull-right">Login to make {that.props.type=="offer"?"request ":"offer "} <i className="fa fa-angle-right"></i></a>)}
        </div>)
    var preview=(
      <div className={"preview "+((this.state.showPreview)?"show":"")}><h5>{this.state.previewData.firstname+" "+this.state.previewData.lastname+": "}</h5>{this.state.previewData.description}</div>
    )
    var emailVerification=this.props.user&&this.props.user.emailverified==0?(
      <li className="alert alert-warning">Please verify your email address.<a href="/resendEmail" className="alert-link pull-right">Resend email</a></li>
    ):{}
    return(
      <div className={classString}>
        <div className="container">
          <ul id="carpoolList">
            {emailVerification}
            {items}
          </ul>
          {preview}
        </div>
      </div>
    );
  }
});

FilterView=React.createClass({
  getInitialState: function() {
    return {from:"",to:"",date:"",passenger:1,luggage:0,focus:false,select:0};
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
    this.setState({type:data.type});
  },
  componentDidMount: function() {
    $(window).on('scroll', this.handleScroll);
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
    $('#filter-from,#filter-to').keyup(function(e){
      if (e.keyCode == 38||e.keyCode==40) {
        that.handleChange(e);
      }
    })
  },
  componentWillUnmount: function() {
    $(window).off('scroll', this.handleScroll);
  },
  handleScroll: function(e){
    $('#filter-from,#filter-to').autocomplete('hide')
    $("#filter-from,#filter-to,#filter-date").blur()
  },
  handleBlur: function(e){
    this.setState({focus:false})
    $(e.target).autocomplete('disable')
  },
  handleFocus: function(e){
    this.setState({focus:true})
    $(e.target).autocomplete({
      serviceUrl: '/index/getLocations',
      minChars:0,
      onSelect:function(){
        that.handleChange({target:this});
      }
    })
  },

  render: function() {
    var that=this;
    var classString="filterPanel "+(this.state.isTop?"affix-top ":"affix ")+(this.state.focus?"focused":"");
    var list=(<ListView ref="list" type={this.props.type} from={this.state.from} to={this.state.to} date={this.state.date} passenger={this.state.passenger} luggage={this.state.luggage} user={this.props.user}/>)
    var text=this.props.type=="offer"?"Offered":"Requested";
    var seatsText=this.props.type=="offer"?"Seats":"# of People";

    return(
      <div>
        <form role='form' onSubmit={this.search}>
        <div className={classString}>
          <div className="container">
            <div className='inputs'>
            <div className="merge-input col-xs-12 col-sm-4"> 
              <label><span className="glyphicon glyphicon-map-marker from-marker"></span></label>
              <input id='filter-from' placeholder="FROM" data-change="from" onChange={this.handleChange} onBlur={this.handleBlur} onFocus={this.handleFocus}/>
            </div>
            <div className="merge-input col-xs-12 col-sm-4"> 
              <label><span className="glyphicon glyphicon-map-marker to-marker"></span></label>
              <input id='filter-to' placeholder="TO" data-change="to" onChange={this.handleChange} onBlur={this.handleBlur} onFocus={this.handleFocus}/>
            </div>
            <div className='merge-input col-xs-12 col-sm-4'> 
              <label><i className='fa fa-calendar date-marker'/></label>
              <input id='filter-date' type='text' ref='dateInput' id='filter-date' placeholder="DATE" className="form-control" data-format="YYYY-MM-DD"  value={this.state.date} data-change="date" onChange={this.handleChange} onBlur={this.handleBlur} onFocus={this.handleFocus}/>
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
      </div>
    );
  }
});

MainView=React.createClass({
  getInitialState: function() {
    return {showProfile:false,user:data.user,type:data.type};
  },
  componentDidMount:function(){
  },
  switchToRequest:function(){this.setState({type:'request'})},
  switchToOffer:function(){this.setState({type:'offer'})},
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
  makeRequest:function(){
    makeRequest();
  },
  makeOffer:function(){
    makeOffer();
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
                        <a href="/settings"><i className="fa fa-cog"></i>Settings</a>
                        <a href="/index/logout"><i className="fa fa-power-off"></i>Logout</a>
                      </div>
                    </div>
                  </li>):(<li><a href="login">Login</a></li>)
    var modals=this.state.user?(<MakeRequestModel user={this.state.user}/>):{}
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

                {this.state.user&&this.state.user.type>1?(
                  <li className={this.state.type=="request"?"active":""} id='requestLi'><a onClick={this.switchToRequest}><span>Requests</span></a></li>):""}

                {this.state.user&&this.state.user.type>1?(
                  <li className={this.state.type=="offer"?"active":""} id='offerLi'><a onClick={this.switchToOffer}><span>Offers</span></a></li>
                ):(
                  <li className="active"><a><span>Offers</span></a></li>
                )}

                {(this.state.user&&this.state.user.type==1)?(<li><a href='become_a_driver'><span>Become a driver</span></a></li>):{}}

                {userPage}
              </ul>
            </div>
          </div>
        </nav>
        <CarpoolDetail />
        {modals}
        <FilterView type={this.state.type} user={this.state.user}/>
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