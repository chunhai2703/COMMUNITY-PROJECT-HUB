import React from 'react'
import { Carousel } from 'antd';
import img1 from '../../assets/activities3.png'
import img2 from '../../assets/activities4.png'
import img3 from '../../assets/activities5.png'
import img4 from '../../assets/activities7.png'
import classes from './Banner.module.css'
import classNames from 'classnames/bind';

const cx = classNames.bind(classes);


export const Banner = () => {
  return (
    <Carousel autoplay>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={img1} alt="" className={cx('img-banner')}></img>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={img2} alt="" className={cx('img-banner')}></img>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={img3} alt="" className={cx('img-banner')}></img>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={img4} alt="" className={cx('img-banner')}></img>
      </div>
    </Carousel>
  )

}
