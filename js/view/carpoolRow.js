/** @jsx React.DOM */

define([],function(){
  return React.createClass({
    getInitialState: function() {
      return {};
    },
    componentDidMount:function(e){
    },
    render: function() {
      var data=this.props.data?this.props.data:{id:-1,type:"offer"}
      var classString="carpoolRow "+(this.props.className||"")
      var typeClassString="carpoolRow-type "+data.type
      return(
        <li key={data.id} className={classString}>
          <a onClick={this.props.onClick}>

            <div className="carpoolRow-left">
              <table className="carpoolRow-location"><td>{data.departure}</td><td><i className="fa fa-arrow-right"></i></td><td>{data.arrival}</td></table>
              
              <div className="carpoolRow-info col-xs-12">
                <span className="carpoolRow-info-item carpoolRow-passenger"><i className="fa fa-users"></i>{" "+data.passenger_remaining} seats left</span>
                <span className="carpoolRow-info-item carpoolRow-date"><i className="fa fa-calendar"></i>{" "+moment(data.date).format("MMM DD - hh:mm")}</span>
              </div>
            </div>
            <div className="carpoolRow-price">
              <strong>$ {data.price}</strong>
            </div>
            <div className={typeClassString}>
              <strong>{data.type}</strong>
            </div>
          </a>
        </li>
      );
    }
  });
})