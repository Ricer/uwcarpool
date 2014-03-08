/** @jsx React.DOM */
/*open -a "Google Chrome" --args --allow-file-access-from-files*/



var ReactTransitionGroup = React.addons.TransitionGroup;

var TodoInput = React.createClass({
  timer:null,
  getInitialState: function() {
    return {value:"",haserror:false,errormsg:""};
  },
  handleChange: function(e){
    if(this.props.type=='number'){
      var tester=/^\d*(?:\.\d{0,2})?$/
      if(tester.test(e.target.value)){
        this.setState({value:e.target.value,haserror:false})
        if(this.timer){
          clearTimeout(this.timer);
          this.timer=null;
        }
      }else{
        this.setState({haserror:true,errormsg:"must be a valid currency value"})
        clearTimeout(this.timer);
        this.timer=null
        this.timer=setTimeout(this.removeError,1000);
      }
    }else{
      this.setState({value:e.target.value,haserror:false})
      if(this.timer){
        clearTimeout(this.timer);
        this.timer=null;
      }
    }
  },
  removeError:function(){
    this.setState({haserror:false})
  },
  render: function() {
    var value = this.state.value;
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
          <input type='text' value={value} id={id} className={classString} onChange={this.handleChange}/>
        </div>
      </div>
        <div className={errorClassString}>{this.state.errormsg}</div>
      </div>
    );
  }
});
var TodoList = React.createClass({
  getInitialState: function() {
    return {items: [{desc:'dinner',amount:9.53},{desc:'gift',amount:123.53}]};
  },
  handleSubmit: function(e) {
    e.preventDefault();
    console.log($(this.getDOMNode()))

    this.setState({haserror:true,errormsg:"must be a valid currency value"})
    var newItems = this.state.items.concat([{
      desc:$(this.getDOMNode()).find("#Todo-desc").val(),
      amount:$(this.getDOMNode()).find("#Todo-amount").val()}]);
    this.setState({items: newItems});
  },
  handleRemove: function(i) {
    var newItems = this.state.items;
    newItems.splice(i, 1)
    this.setState({items: newItems});
  },
  render: function() {
    var items = this.state.items.map(function(item, i) {
      return (
        <li key={item.desc} className='Todo-item'>
          <button type="button" className="close" aria-hidden="true" onClick={this.handleRemove.bind(this, i)}>&times;</button>
          
          <span className="Todo-amount label label-info">$ {item.amount}</span>
          {item.desc}
        </li>
      );
    }.bind(this));
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="form-horizontal" role="form">
          <TodoInput id='Todo-desc' name='Description'/>
          <TodoInput id='Todo-amount' name='Amount' type='number'/>
          <div className="form-group">
            <div className="col-sm-offset-3 col-sm-9">
              <input type='submit' value='add' className='btn btn-default'/>
            </div>
          </div>
        </form>
        <ul className="Todo-list">
          <ReactTransitionGroup transitionName="Todo-item">
            {items}
          </ReactTransitionGroup>
        </ul>
      </div>
    );
  }
});

React.renderComponent(
  <TodoList/>,
  $("#main").get(0)
);