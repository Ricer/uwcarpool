/** @jsx React.DOM */

define(['jsx!view/carpoolRow'],function(CarpoolRow){
  return React.createClass({
    getInitialState: function() {
      return {};
    },
    componentDidMount:function(e){
    },
    componentDidUpdate:function(previousProps){
    },

    render: function() {
      var classString="carpoolDetail sideView hasTitle " + (this.props.show?"show ":"");
      var data=this.props.data?this.props.data:{};
      if(data&&data.type=="offer"){
        classString+="offer "
        var titleString="Offer detail"
      }
      else{
        classString+="request "
        var titleString="Request detail"
      }
      return(
        <div className={classString}>
          <div className="title has-tooltip" onClick={this.props.onBack} data-toggle="tooltip" data-placement="top" data-trigger="hover" title="Return to search results"><i className="fa fa-arrow-left"></i> {titleString}</div>
          <CarpoolRow data={data} onClick={this.props.onBack} />
          <div className="carpoolDetail-info">
            <h4>Description</h4>
            <div>{data.description}</div>
          </div>
        </div>
      );
    }
  });
})