/** @jsx React.DOM */

define(['jsx!view/dateInput'],function(DateInput){
  return React.createClass({
    getInitialState: function() {
      return {show:false,from:"",to:"",date:"",passenger:1,luggage:0};
    },
    search:function(e){
      if(e)e.preventDefault();
      var dateTest=/^(|[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]))$/
      if(!dateTest.test(this.state.date)){
        this.refs.dateInput.setError();
      }else{
        var that=this
        var data=JSON.parse(JSON.stringify(this.state))
        delete data["show"]
        this.props.onSubmit(data);
        this.setState({show:false})
      }
    },
    handleChange:function(e){
      var nextState={}
      nextState[$(e.target).attr("data-change")]=($(e.target).attr("data-html"))?e.target.innerHTML:e.target.value
      this.setState(nextState);
    },
    componentDidMount:function(e){
      //$('.display').tooltip()
      //this.search();
    },
    render: function() {
      var classString="filterPanel sideView " + (this.props.show?"show":"");
      return(
        <div className={classString}>
          <form role='form' onSubmit={this.search}>
            <div className="merge-input"> 
              <label>From</label>
              <input value={this.state.from} placeholder="optional" data-change="from" onChange={this.handleChange} />
            </div>
            <div className="merge-input"> 
              <label>To</label>
              <input value={this.state.to} placeholder="optional" data-change="to" onChange={this.handleChange} />
            </div>

            <div className="col-xs-6">
            <DateInput value={this.state.date} onChange={this.handleChange} ref='dateInput'/>
            </div>
            <div className="col-xs-3">
            <div className="form-group">
              <label>Passenger</label>
              <div className="dropdown fullwidth">
                <button type="button" className="btn dropdown-toggle btn-default fullwidth" data-toggle="dropdown">{this.state.passenger}</button>
                <ul className="dropdown-menu fullwidth">
                  <li><a data-change="passenger" data-html="true" onClick={this.handleChange}>1</a></li>
                  <li><a data-change="passenger" data-html="true" onClick={this.handleChange}>2</a></li>
                  <li><a data-change="passenger" data-html="true" onClick={this.handleChange}>3</a></li>
                  <li><a data-change="passenger" data-html="true" onClick={this.handleChange}>4</a></li>
                  <li><a data-change="passenger" data-html="true" onClick={this.handleChange}>5</a></li>
                  <li><a data-change="passenger" data-html="true" onClick={this.handleChange}>6</a></li>
                  <li><a data-change="passenger" data-html="true" onClick={this.handleChange}>7</a></li>
                </ul>
              </div>
              </div>
            </div>

            <div className="col-xs-3">
            <div className="form-group">
              <label>Luggage</label>
                <div className="dropdown fullwidth">
                  <button type="button" className="btn dropdown-toggle btn-default fullwidth" data-toggle="dropdown">{this.state.luggage}</button>
                  <ul className="dropdown-menu fullwidth">
                    <li><a data-change="luggage" data-html="true" onClick={this.handleChange}>0</a></li>
                    <li><a data-change="luggage" data-html="true" onClick={this.handleChange}>1</a></li>
                    <li><a data-change="luggage" data-html="true" onClick={this.handleChange}>2</a></li>
                    <li><a data-change="luggage" data-html="true" onClick={this.handleChange}>3</a></li>
                    <li><a data-change="luggage" data-html="true" onClick={this.handleChange}>4</a></li>
                    <li><a data-change="luggage" data-html="true" onClick={this.handleChange}>5</a></li>
                    <li><a data-change="luggage" data-html="true" onClick={this.handleChange}>6</a></li>
                    <li><a data-change="luggage" data-html="true" onClick={this.handleChange}>7</a></li>
                  </ul>
                </div>
            </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block searchBtn">Search</button>
          </form>
        </div>
      );
    }
  });
})
