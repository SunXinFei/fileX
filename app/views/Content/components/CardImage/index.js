import React from 'react'
import propTypes from 'prop-types';

const getImgSrc = (type, extension) => {
  if (type === "file") {
    let extensionTmp = '';
    try {
      let tmpArr = extension.split('.');
      extensionTmp = tmpArr[1] ? tmpArr[1] : 'file';
    } catch (e) {
      console.log(e);
      extensionTmp = 'file';
    }
    switch (extensionTmp) {
      default:
        return `${extensionTmp}.png`;
    }
  } else if (type === "directory") {
    return 'folder_mac.png'
  }
}

const requireImg = (type, extension) => {
  try {
    const imgSrc = getImgSrc(type, extension);
    return require(`@app/assets/icon_file/${imgSrc}`).default;
  } catch (e) {
    return require(`@app/assets/icon_file/file.png`).default;
  }
}

/**
 * 卡片中的图片组件
 */
const CardImage = ({ type, extension }) => {
  let imgSrc = requireImg(type, extension);
  return (
    <img src={imgSrc} alt="File-icon" />
  )
}

CardImage.propTypes = {
  type: propTypes.string, //"file","directory"
  extension: propTypes.string // .js"
};

export default CardImage
