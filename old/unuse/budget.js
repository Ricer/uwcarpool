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
var CurrencyInput = React.createClass({
  timer:null,
  getInitialState: function() {
    return {haserror:false,errormsg:""};
  },
  handleChange: function(e){
    console.log(this.props.value+" "+e.target.value)
    if(this.props.type=='number'){
      var tester=/^\d*(?:\.\d{0,2})?$/
      if(tester.test(e.target.value)){
        this.clearTimer()
        this.setState({haserror:false})
        this.props.onChange(e)
      }else{
        this.setError("must be a valid currency value");
      }
    }else{
      this.clearTimer()
      this.setState({haserror:false})
      this.props.onChange(e)
    }
  },
  setError:function(errormsg){
    this.setState({haserror:true,errormsg:errormsg})
    this.clearTimer()
    this.timer=setTimeout(this.removeError,2000);
  },
  clearTimer:function(){
    if(this.timer){
      clearTimeout(this.timer);
      this.timer=null;
    }
  },
  removeError:function(){
    this.setState({haserror:false})
  },
  render: function() {
    var value = this.props.value;
    var classString='form-control '+this.props.className
    var name=this.props.name
    var id=this.props.id
    var divClassString='form-group'+((this.state.haserror)?" has-error":"");
    var errorClassString='alert alert-danger '+((this.state.haserror)?"":"hide")
    return (
      <div>
      <div className={divClassString}>
        <label for={id} className="col-sm-3 control-label">{name}</label>
        <div className="col-sm-9">

          <div className="input-group">
            <input type="text" value={value} id={id} className={classString} onChange={this.handleChange}/>
            <span className="input-group-addon">$</span>
          </div>
        </div>
      </div>
        <div className={errorClassString}>{this.state.errormsg}</div>
      </div>
    );
  }
});

var AddPanel = React.createClass({
  getInitialState: function() {
    return {elem:null};
  },

  handleSubmit: function(e) {
    e.preventDefault();
    if(this.refs.amountInput.state.value==""){
      this.refs.amountInput.setError("Please enter an amount.");
    }else{
      var that=this;

      $.post( "getTransactions.php",{
        id:this.state.elem.id,
        title:$("#add-title").val(),
        desc:$("#add-desc").val(),
        date:$("#add-date").val(),
        amount:Number($("#add-amount").val()),
        category:1
      },function( response ) {
        if(response.status=="success"){
          that.props.onSubmit(response.data[0]);
        }
      });

      this.setState({elem:null})
    }
  },

  componentDidMount: function() {
    $('#add-date-wrapper').datetimepicker({
      pickTime: false,
      defaultDate: new Date(),
      format:"YYYY-MM-DD"
    });
  },

  handleChange:function(e){
    console.log(e.target.id.substr(4));
    this.state.elem[e.target.id.substr(4)]=e.target.value;
    this.setState({elem:this.state.elem})
  },

  render: function() {
    var classes="col-xs-12 col-sm-6 col-md-5 col-lg-4"+((this.state.elem)?" show":"");
    var title = this.state.elem?this.state.elem.title:"";
    var amount = this.state.elem?this.state.elem.amount:"";
    var date = this.state.elem?this.state.elem.date:"";
    var desc = this.state.elem?this.state.elem.desc:"";
    var confirmText = (this.state.elem&&this.state.elem.id>=0)?"Edit":"Add Transaction"
    var confirmClasses = "btn btn-block btn-large "+((this.state.elem&&this.state.elem.id>=0)?"btn-primary":"btn-info")
    return (
      <div className={classes} id='add-panel-wrapper'>
        <div  id='add-panel'>
        <form role="form" onSubmit={this.handleSubmit}>
          <div className='form-horizontal popup-body'>
            
            <div className="form-group">
              <label className="col-sm-3 control-label" for="add-title">Description</label>
              <div className='col-sm-9'>
                <input type='text' className="form-control" id='add-title' onChange={this.handleChange} value={title} />
              </div>
            </div>

            <CurrencyInput ref='amountInput' type='number' id='add-amount' name='Amount' onChange={this.handleChange} value={amount} />
            
            <div className="form-group">
              <label className="col-sm-3 control-label" for="add-date">Date</label>
              <div className='col-sm-9'>
              <div className='input-group date' id='add-date-wrapper'>
                <input type='text' className="form-control" id='add-date' disabled data-format="YYYY/MM/DD"  onChange={this.handleChange} value={date}/>
                <span className="input-group-addon">
                  <i className="fa fa-calendar"></i>
                </span>
              </div>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-3 control-label" for="add-desc">Detail Description</label>
              <div className='col-sm-9'>
                <textarea className="form-control" id='add-desc' onChange={this.handleChange} value={desc}></textarea>
              </div>
            </div>
          </div>
          <input type='submit' className={confirmClasses} value={confirmText}/>
        </form>
      </div>
      </div>
    );
  }
});


var transactionRow = React.createClass({
  handlePopover: function(e) {
    e.preventDefault();
    $('.link-popover').not(this.getDOMNode()).popover('hide');
    $(this.getDOMNode()).popover('toggle')
  },
  handleRemove: function(e){
    var that=this
    $.ajax({
      url: 'getTransactions.php',
      type: 'DELETE',
      data: {id:that.props.key},
      success: function(result) {
        that.props.onRemove(that.props.key);
      }
    });
  },
  handleEdit:function(e){
    $(this.getDOMNode()).popover('hide');
    this.props.onEdit(this.props.key);
  },
  componentDidMount: function() {
    $(this.getDOMNode()).popover({
      container: 'body',
      react: true,
      //title:(<div>{this.props.title}<span className='pull-right'><strong>$ {this.props.amount}</strong></span></div>),
      content:(
        <div>
          <p>{this.props.desc}</p>
          <div className='btn-group btn-group-justified'>
            <a className='btn btn-danger btn-xs' onClick={this.handleRemove}>Remove</a>
            <a className='btn btn-primary btn-xs' onClick={this.handleEdit}>Edit</a>
          </div>
        </div>),
      placement:'bottom',
      trigger:'manual'
    })
  },

  componentDidUpdate: function(nextProps) {
    if(nextProps.desc!=this.props.desc){
      this.componentWillUnmount();
      this.componentDidMount();
    }
  },

  componentWillUpdate:function(){
    $('.link-popover').popover('hide');
  },

  componentWillUnmount: function() {
    $(this.getDOMNode()).popover('destroy')
  },

  render: function() {
    return (
      <tr className='link-popover' key={this.props.key} onClick={this.handlePopover}>
        <td>{this.props.title}</td>
        <td>{this.props.date}</td>
        <td>$ {this.props.amount}</td>
      </tr>
    );
  }
});


var TransactionList = React.createClass({
  getInitialState: function() {
    return {
      transactions:[],
      sortBy:"amount",
      sortAsc:true
    };
  },

  componentDidMount: function() {
    var that=this;
    var errHandler=function(response){
      if(response.errorCode){
        alert("Error: "+response.errorMsg)
      }else{
        alert("Cannot connect to server.")
      }
    }

    $.getJSON("getTransactions.php", function(response) {
      if(response.status=="success"){
        that.setState({transactions:response.data.map(function(trans){
          trans.date=moment(trans.date).format("YYYY-MM-DD")
          console.log(trans);
          return trans
        })})
      }else{
        errHandler(response)
      }
    }).fail(function() {
      errHandler({})
    })

    window.addEventListener('resize', this.handleResize);
  },
  componentWillUnmount:function(){
    window.removeEventListener('resize', this.handleResize);
  },

  deleteTransaction:function(id){
    this.setState({transactions: this.state.transactions.filter(function(item){
      return item.id!=id;
    })});
  },

  editTransaction:function(trans){

    var found=false
    this.setState({transactions: this.state.transactions.map(function(item){
      if(item.id===trans.id){
        found=true;
        return trans;
      }
      return item;
    })});
    if(!found){
      this.setState({transactions: this.state.transactions.concat([trans])});
    }
  },

  handleResize:function(){
    $(".main").removeClass("show")
  },

  handleAdd:function(e){
    if(this.refs.addPanel.state.elem){
      this.refs.addPanel.setState({elem:null})
    }else{
      this.refs.addPanel.setState({elem:{id:-1,title:"",desc:"",date:moment().format("YYYY-MM-DD"),amount:0}})
    }
  },

  handleEdit:function(id){
    this.refs.addPanel.setState({elem:this.state.transactions.filter(function(item){return item.id==id})[0]})
  },

  showSidebar:function(i){
    $(".main").toggleClass("show")
  },

  compareTransactions:function(a,b){
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

  render: function() {
    var that=this;
    var total=0;
    var items;

    if(this.state.transactions.length>0){
      var sorted=this.state.transactions.sort(this.compareTransactions)
      items=sorted.map(function(item,i){
        total+=item.amount;
        return (<transactionRow onRemove={that.deleteTransaction} onEdit={that.handleEdit} key={item.id} title={item.title} desc={item.desc} date={item.date} amount={item.amount} />);
      })
    }else{
      items=<tr><td colSpan='3'>No transactions</td></tr>
    }
    
    var backgroundStyle={"background-image":"url("+this.props.bgurl+")"}
    var sortLabel=(this.state.sortAsc)?(<i className="fa fa-sort-asc"></i>):(<i className="fa fa-sort-desc"></i>)
    return (
      <div className='content-wrapper'>

        <AddPanel ref='addPanel' onSubmit={this.editTransaction}/>
        <div className='topbar'>
          <a className='btn btn-default btn-sm showSidebarBtn' onClick={this.showSidebar}><i className="fa fa-bars"></i></a>
          <a id='add-trigger' className='brand btn btn-info btn-sm' onClick={this.handleAdd}><span>Add new</span></a>
          <span className='pull-right'>Total: <strong>$ {total.toFixed(2)}</strong></span>
        </div>
        <div className='content' style={backgroundStyle}>
          <div className='col-sm-12 col-md-8 transactions-wrapper'>
            <table className='table white table-striped table-condensed table-responsive transactions'>
              
              <thead>
                <tr><td onClick={this.sortBy.bind(this,"desc")} className='col-xs-4 col-sm-6 transition'>Description {(this.state.sortBy=="desc")?sortLabel:{}}</td>
                <td onClick={this.sortBy.bind(this,"date")}>Date {(this.state.sortBy=="date")?sortLabel:{}}</td>
                <td onClick={this.sortBy.bind(this,"amount")}>Amount {(this.state.sortBy=="amount")?sortLabel:{}}</td></tr>
              </thead>

              <tbody>{items}</tbody>

            </table>
          </div>
        </div>
      </div>
    );
  }
});

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


// var lastScrollLeft = 0;
// $(window).scroll(function() {
//     var documentScrollLeft = $(document).scrollLeft();
//     if (lastScrollLeft != documentScrollLeft) {
//         $(".main").removeClass("show")
//         lastScrollLeft = documentScrollLeft;
//         $(window).scrollTo($(window).scrollTop(),0);$(window).resize()
//         e.preventDefault()
//         return false;
//     }
// });
