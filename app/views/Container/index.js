import React from 'react';
import Sider from '../Sider'
import Content from '../Content'
import Introduction from '../Introduction'
import NoPathModal from '../../components/InvalidPathModal';
import ReaderModal from '../../components/ReaderModal';
import "./style.scss";

const Container = () => {
  return (
    <div className="filex-container">
      <Sider />
      <Content />
      <Introduction />
      <NoPathModal />
      <ReaderModal />
    </div>
  )
}

export default Container