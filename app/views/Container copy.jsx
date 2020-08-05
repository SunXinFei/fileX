import React, { Component } from 'react';

class Container extends Component{
  constructor(props) {
		super(props);
		this.state = {};
  }
  render() {
		return (
			<div>
        <Sider></Sider>
        <Content></Content>
        <Introduction></Introduction>
			</div>
			
		);
	}
}

export default Container