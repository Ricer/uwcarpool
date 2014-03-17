/** @jsx React.DOM */

define(['jsx!view/carpoolRow'],function(CarpoolRow){
  return React.createClass({
    getInitialState: function() {
      return {page:1,type:"Both",list:[],sortBy:"date",sortAsc:true};
    },

    handleChange:function(e){
      this.reloadPage(e.target.innerHTML);
    },

    loadNextPage:function(){
      var data=$.extend({},this.props.data,{page:this.state.page,type:this.state.type});
      var that=this;
      $.getJSON("search.php",data).done(function( json ) {
        that.setState({page:that.state.page+1,list:that.state.list.concat(json)})
      }).fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log(err)
      });
    },

    reloadPage:function(type){
      if(!type)type="Both"
      var data=$.extend({},this.props.data,{page:1,type:type});
      var that=this;
      $.getJSON("search.php",data).done(function( json ) {
        that.setState({page:2,list:(json?json:[]),type:type})
      }).fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log(err)
      });
    },

    getButtonClass:function(str){
      var classes=str.toLowerCase()+" "
      if(str==this.state.type){
        classes+="active"
      }
      return classes;
    },

    componentDidUpdate:function(previousProps){
      if(JSON.stringify(previousProps.data) != JSON.stringify(this.props.data)){
        this.reloadPage();
      }
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

    showDetail:function(item){
      this.props.onSubmit(item);
    },

    render: function() {
      var classString="listContent sideView hasTitle " + (this.props.show? "show":"");
      var that=this;

      var data=this.props.data?this.props.data:{from:"",to:"",date:"",passenger:1,luggage:0,type:"Both"}
      var sorted=this.state.list.sort(this.compareItems)
      var items=sorted.map(function(item,i){
        return (<CarpoolRow key={item.id} data={item} onClick={that.showDetail.bind(that,item)} />);
      })
      var from=data.from==""?"":(<span> from <strong>{data.from}</strong></span>)
      var to=data.to==""?"":(<span> to <strong>{data.to}</strong></span>)
      var date=data.date==""?"":(<span> at <strong>{moment(data.date).format("MMMM DD, YYYY")}</strong></span>)
      var luggage=data.luggage==0?"":(<span> with <strong>{data.luggage}</strong> luggage{data.luggage>1?"s":""}</span>)
      var type=this.state.type=="Both"?"":this.state.type.toLowerCase()+"s";
      
    

      return(
        <div className={classString}>
          <div className="title has-tooltip" onClick={this.props.onBack} data-toggle="tooltip" data-placement="top" data-trigger="hover" title="Edit search filters"><i className="fa fa-arrow-left"></i>Search Result</div>
          <div className="display extend">
            Searching carpool{this.state.type=="Both"?"s":" "} <strong>{type}</strong>
            <span> {from}</span>
            <span> {to}</span>
            <span> {date}</span>
            <span> for <strong>{data.passenger}</strong> passenger{data.passenger>1?"s":""}</span>
            <span> {luggage}.</span>
          </div>
          <div className="extend">
          <ul className="nav nav-tabs  nav-justified type-select">
            <li className={this.getButtonClass("Both")} ><a type="button" onClick={this.handleChange} data-change="type" data-html="true">Both</a></li>
            <li className={this.getButtonClass("Offer")} ><a type="button" onClick={this.handleChange} data-change="type" data-html="true">Offer</a></li>
            <li className={this.getButtonClass("Request")} ><a type="button" onClick={this.handleChange} data-change="type" data-html="true">Request</a></li>
          </ul>
          </div>
          <ul>
            {items}
          </ul>
        </div>
      );
    }
  });
})