/** @jsx React.DOM */

define([],function(){
  return React.createClass({
    timer:null,
    getInitialState: function() {
      return {haserror:false};
    },
    handleChange:function(e){
      
      var tester=/^([0-9]{0,4}|[0-9]{4}-|[0-9]{4}-[01]|[0-9]{4}-(0[1-9]|1[0-2])|[0-9]{4}-(0[1-9]|1[0-2])-|[0-9]{4}-(0[1-9]|1[0-2])-[0-3]|[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]))$/
      if(tester.test(e.target.value)){
        this.clearTimer()
        this.setState({haserror:false})
        this.props.onChange(e)
      }else{
        this.setError();
      }

    },

    setError:function(){
      this.setState({haserror:true})
      this.clearTimer()
      this.timer=setTimeout(this.removeError,2000);
    },

    clearTimer:function(){
      if(this.timer){
        clearTimeout(this.timer);
        this.timer=null;
      }
    },

    componentDidMount: function() {
      var that=this;
      $('#filter-date-wrapper').datetimepicker({
        pickTime: false,
        defaultDate: new Date(),
        format:"YYYY-MM-DD",
        useStrict: true
      }).on('change.dp', function(e) {
          e.target=that.refs.dateInput.getDOMNode()
          that.props.onChange(e)
      })
    },

    removeError:function(){
      this.setState({haserror:false})
    },

    render: function() {
      var divClassString='form-group'+((this.state.haserror|this.props.haserror)?" has-error":"");
      return (
        <div className={divClassString}> 
          <label>Date</label>
          <div className='input-group date' id='filter-date-wrapper'>
            <input type='text' ref='dateInput' placeholder="optional" className="form-control" data-format="YYYY-MM-DD"  value={this.props.value} data-change="date" onChange={this.handleChange}/>
            <span className="input-group-addon">
              <i className="fa fa-calendar"></i>
            </span>
          </div>
        </div>
      )
    }
  });
})