var SnakeGame = React.createClass({
	getInitialState:function(){
		return {
			buttonText:'点击开始',
			begin:false
		};
	},
	handleClick:function(){
		if(this.state.buttonText == '点击开始'){
			this.setState({buttonText:'点击暂停',begin:true});
			console.log('您点击了开始');
		}else{
			this.setState({buttonText:'点击开始',begin:false});
			console.log('您点击了暂停');
		}
	},
	reStart:function(){
		window.location.reload();
	},
	render:function(){
		console.log('snake render');
		return <div className="mapWrap"><Map begin={this.state.begin} /><input type="button" value={this.state.buttonText} onClick={this.handleClick}/><input type="button" value="重新开始" onClick={this.reStart}/></div>;
	}
});
var Map = React.createClass({
	getInitialState:function(){
		var headX = Math.floor(Math.random()*10)+5;
		var headY = Math.floor(Math.random()*10)+5;
		var flag = true;
		do{
			var foodX = Math.floor(Math.random()*20);
			var foodY = Math.floor(Math.random()*20);
			if(foodX != headX && foodY != headY){
				flag = false;
			}
		}while(flag);
		return {
			x:headX,
			y:headY,
			dir:Math.floor(Math.random()*4)+37,
			body:[],
			eaten:false,
			food:{x:foodX,y:foodY},
			score:0
		};
	},
	getFood:function(){
		var flag = true;
		do{
			var x = Math.floor(Math.random()*20);
			var y = Math.floor(Math.random()*20);
			if(x != this.state.x && y != this.state.y){
				var flag2 = false;
				for(var pos in this.state.body){
					if(x == pos.x && y == pos.y ){
						flag2 = true;
						break;
						//console.log(11)
					}
				}
				if(!flag2){
					flag = false;
				}
			}
			
		}while(flag)
		return {x:x,y:y};
	},
	componentWillReceiveProps:function(nextProps){
		console.log('will update')
		console.log(nextProps.begin);
		if(nextProps.begin){
			console.log('timer')
			if(this.timer){
				clearInterval(this.timer);
			}
			this.timer = setInterval(this.run,300);
		}else{
			if(this.timer){
				clearInterval(this.timer);
			}
		}
	},
	/*componentWillUnmount:function(){
		console.log('will unmount')
		if(this.timer){
			clearInterval(this.timer);
		}
	},*/
	handleKeyDown:function(event){
		var dir = 0;
		console.log('key down')
		switch(event.keyCode){
			case 37://左
			dir = this.state.dir==39?this.state.dir:37;
			break;
			case 38://上
			dir = this.state.dir==40?this.state.dir:38;
			break;
			case 39://右
			dir = this.state.dir==37?this.state.dir:39;
			break;
			case 40://下
			dir = this.state.dir==38?this.state.dir:40;
			break;
		}
		if(this.state.dir != dir){
			this.setState({dir:dir});
		}
		
	},
	render:function(){
		var cells = [];
		var x = 0;
		var y = 0;
		for(var y=0;y<20;y++){
			cells[y] = [];
			for(var x=0;x<20;x++){
				var flag = false;
				if(this.state.x == x && this.state.y == y){
					cells[y].push(<Head x={this.state.x}  y={this.state.y} handleKeyDown={this.handleKeyDown}/>);
					//flag = true;
				}else if(!this.state.eaten && this.state.food && this.state.food.x == x && this.state.food.y == y){
					cells[y].push(<Food/>);
					//flag = true;
				}else{
					cells[y].push(<Cell/>);
				}
			}
			
		}
		var length = this.state.body.length;
		for(var i=0;i<length;i++){
			var x = this.state.body[i].x;
			var y = this.state.body[i].y;
			cells[y][x] = <Body/>;
			console.log('length')
		}
		//console.log(1)
		console.log('map render');
		return <div><div className="map">{cells}</div><p>作者：刘北京<br/>QQ:1573018715<br/>write with React.js<br/>分数:{this.state.body.length}</p></div>;
	},
	run:function(){
		var posX = this.state.x;
		var posY = this.state.y;
		switch(this.state.dir){
			case 38://上
			if(posX==this.state.food.x && posY-1==this.state.food.y){
				this.state.eaten = true;
			}
			posY--;
			break;
			case 39://右
			if(posX+1==this.state.food.x && posY==this.state.food.y){
				this.state.eaten = true;
			}
			posX++;
			break;
			case 40://下
			if(posX==this.state.food.x && posY+1==this.state.food.y){
				this.state.eaten = true;
			}
			posY++;
			break;
			case 37://左边
			if(posX-1==this.state.food.x && posY==this.state.food.y){
				this.state.eaten = true;
			}
			posX--;
			break;
		}
		if(this.state.eaten){
			var tmp = {};
			this.state.body.push(tmp);
		}
		for(var i=this.state.body.length-1;i>=0;i--){
			if(i==0){
				this.state.body[i].x = this.state.x;
				this.state.body[i].y = this.state.y;
			}else{
				this.state.body[i].x = this.state.body[i-1].x;
				this.state.body[i].y = this.state.body[i-1].y;
			}
		}
		if(this.state.eaten){
			this.setState({
				eaten:false,
				body:this.state.body,
				dir:this.state.dir,
				x:posX,
				y:posY,
				food:this.getFood(),
			});
		}else{
			this.setState({x:posX,y:posY});
		}		
		this.collistionDection();
		
	},
	collistionDection:function(){
		if(this.state.x<0 || this.state.x>=20 || this.state.y<0 || this.state.y>=20){
			alert("you died!");
			clearInterval(this.timer);
		}
		for(var i=0;i<this.state.body.length;i++){
			if(this.state.body[i].x == this.state.x && this.state.body[i].y == this.state.y){
				alert('you died!');
				clearInterval(this.timer);
			}
		}
	}
	
});
var Cell = React.createClass({
	render:function(){
		return <div className="cell"></div>;
	}
});
var Head = React.createClass({
	render:function(){
		return <div className="head" ref="head" tabindex="1"></div>;
	},
	componentDidMount:function(){
		window.addEventListener('keydown',this.props.handleKeyDown);
		ReactDOM.findDOMNode(this.refs.head).focus();
		console.log('focus')
	},
	componentWillUnmount: function() {
		window.removeEventListener('keydown', this.props.handleKeyDown);
	}
});
var Food = React.createClass({
	render:function(){
		return <div className="food"></div>;
	}
});
var Body = React.createClass({
	render:function(){
		return <div className="body"></div>
	}
});
ReactDOM.render(<SnakeGame/>,document.getElementById('snake'));
