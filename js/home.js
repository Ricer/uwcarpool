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
      placement:'top',
      trigger:'manual',
      title:errorStr,
  }).tooltip('show').addClass('has-tooltip').closest('.form-group').addClass('has-error')
  fieldElem.one('keypress blur change',function(){
      fieldElem.tooltip('destroy').removeClass('has-tooltip').closest('.form-group').removeClass('has-error')
  });
}
MakeRequestModel=React.createClass({
  getInitialState: function() {
    return {hasError:false,errorMsg:""};
  },

  componentWillUnmount: function() {
  },

  componentDidUpdate:function(previousProps){
  },

  componentDidMount:function(){
    $('#makeRequest-date').pickadate({
      container:'body',
      min: new Date()
    })
    $('#makeRequest-time').pickatime({
      container:'body',
      interval: 10,
    })
    $('#makeRequest').on('show.bs.modal', function (e) {
      $('#makeRequest-from').val($('#filter-from').val())
      $('#makeRequest-to').val($('#filter-to').val())
      $('#makeRequest-date').val($('#filter-date').val())
    }).on('shown.bs.modal', function (e) {
      $('#makeRequest-from').focus();
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
    if (  from.val() == ''      ){fieldError(from,"Cannot be empty");errorElem=from;}
    if (  to.val() == ''      ){fieldError(to,"Cannot be empty");errorElem=to;}
    if (  date.val() == ''      ){fieldError(date,"Cannot be empty");errorElem=date;}
    if (  time.val() == ''      ){fieldError(time,"Cannot be empty");errorElem=time;}

    if(errorElem){
        //errorElem.focus();
        return false
    }
    $('#makeRequest').modal('hide');
    return false;
  },
  render: function() {
    return(
      <form onSubmit={this.submit} action="post">
        <div className="modal fade" id="makeRequest" tabindex="-1" role="dialog" aria-labelledby="makeRequestLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 className="modal-title" id="makeRequestLabel">Make a Request</h4>
              </div>
              <div className="modal-body">
                <div className="form-group col-sm-12">
                <input type="text" className="form-control" id="makeRequest-from" placeholder="From" />
                </div>
                <div className="form-group col-sm-12">
                    <input type="text" className="form-control" id="makeRequest-to" placeholder="To" />
                </div>
                <div className="col-sm-6 form-group">
                  <input type="text" className="form-control" id="makeRequest-date" placeholder="Date" />
                </div>
                <div className="col-sm-6 form-group">
                  <input type="text" className="form-control" id="makeRequest-time" placeholder="Time" />
                </div>
                <div className="form-group col-sm-12 nomargin">
                  <textarea className="form-control" style={{resize: "vertical"}} placeholder="Description" rows="8"></textarea>
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


CarpoolRow=React.createClass({
  getInitialState: function() {
    return {};
  },
  componentDidMount:function(e){
  },

  handleMouseEnter:function(){
    this.props.onMouseEnter(this.props.data.description);
  },

  render: function() {
    var data=this.props.data?this.props.data:{id:-1,type:"offer"}
    var classString="carpoolRow "+(this.props.className||"")
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
    return {previewHtml:"",showPreview:false,page:1,requestCount:0,list:[],sortBy:"date",sortAsc:true,nomore:false,loading:false};
  },

  loadNextPage:function(){
    var that=this;
    this.setState({loading:true},function(){
      var data={model:'Carpool',
                func:'search',
                from:that.props.from,
                to:that.props.to,
                date:that.props.date,
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
    $(window).off('scroll', this.handleScroll);
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
    $(window).on('scroll', this.handleScroll);
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

  showPreview:function(info){
    //console.log("showing:"+info)
    this.setState({previewHtml:info,showPreview:true});
  },

  hidePreview:function(){
    //console.log("hiding")
    this.setState({showPreview:false});
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
      items=(<div className="none"><i className="fa fa-frown-o"></i><p>Sorry, we cannot find any carpool that matches your criteria.</p><span className="makeoffer" data-toggle="modal" data-target="#makeRequest">Make a request <i className="fa fa-angle-right"></i></span></div>)
    }else if(this.state.nomore)
      items.push(<div className="nomore"><i className="fa fa-exclamation-triangle"></i> No more carpool {that.props.type} avaliable. <span className="makeoffer" data-toggle="modal" data-target={that.props.type=="offer"?"#makeRequest":"#makeOffer"}>Make a {that.props.type=="offer"?"request ":"offer "} <i className="fa fa-angle-right"></i></span></div>)
    var preview=(
      <div className={"preview "+((this.state.showPreview)?"show":"")}>{this.state.previewHtml}</div>
    )
    return(
      <div className={classString}>
        <div className="container">
          <ul>
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
    return {hide:false,from:"",to:"",date:"",passenger:1,luggage:0,type:"request"};
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
    this.setState({type:type});
  },
  componentDidMount: function() {
    $(window).on('typeChange', this.handleTypeChange.bind(this));
    var that=this;
    $('#filter-date').pickadate({
      format: 'yyyy-mm-dd',
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
        <MakeRequestModel type='request' />
      </div>
    );
  }
});


React.renderComponent(
  <FilterView />,
  $("#filterWrapper").get(0)
);