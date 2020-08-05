import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import "./style.scss";

class ContentOption extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="filex-content-option">
        {/* 操作区 */}
			</div>
    );
  }
}

ContentOption.propTypes = {
  folderPathActiveInSider: propTypes.string
};

export default connect(
  (state) => ({
    folderPathActiveInSider: state.get('folderPathActiveInSider')
  })
)(ContentOption);