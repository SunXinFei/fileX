import { Modal, Button } from 'antd';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import React, { Component } from 'react';
import { setReaderModalObj } from '../../store/action';
import { Map, is } from 'immutable';
import Immutable from 'immutable';
import pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import * as fs from 'fs';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

class ReaderModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfPath: ""
    };
  }

  /**
	 * 检测redux中打开的文件变化
	 * @param {*} nextProps 
	 */
  async componentWillReceiveProps(nextProps) {
    //如果前后不相等并且visible为true
    if (!Immutable.is(this.props.readerModalObj, nextProps.readerModalObj) && nextProps.readerModalObj.get('visible') === true) {
      console.log('OpenPdf');
      // this.setState({ pdfPath: extProps.readerModalObj.get('filePath') })
      // console.log('extProps.readerModalObj.get(filePath)',);
      var rawData = new Uint8Array(fs.readFileSync(nextProps.readerModalObj.get('filePath')));
      var loadingTask = pdfjsLib.getDocument({ data: rawData });
      loadingTask.promise.then(function (pdfDocument) {
        // Request a first page
        return pdfDocument.getPage(1).then(function (pdfPage) {
          // Display page on the existing canvas with 100% scale.
          var viewport = pdfPage.getViewport({ scale: 1.5, });
          var canvas = document.getElementById('theCanvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          var ctx = canvas.getContext('2d');
          var renderTask = pdfPage.render({
            canvasContext: ctx,
            viewport: viewport,
          });
          return renderTask.promise;
        });
      }).catch(function (reason) {
        console.error('Error: ' + reason);
      });
    }
  }


  handleCancel = e => {
    this.props.setReaderModalObj(Map({ filePath: "", visible: false }));
  };

  render() {
    let { readerModalObj } = this.props;
    const visible = readerModalObj.get("visible");
    const fileName = readerModalObj.get("fileName");
    const filePath = readerModalObj.get("filePath");
    return (
      <Modal
        width={'80%'}
        style={{ top: 15 }}
        bodyStyle={{ textAlign: 'center' }}
        title={fileName}
        visible={visible}
        onCancel={this.handleCancel}
        footer={null}
      >
        <canvas id="theCanvas"></canvas>
      </Modal>
    );
  }
}


ReaderModal.propTypes = {
  readerModalObj: propTypes.instanceOf(Map)
};

export default connect(
  (state) => ({
    readerModalObj: state.get('readerModalObj')
  }),
  {
    setReaderModalObj
  }
)(ReaderModal);