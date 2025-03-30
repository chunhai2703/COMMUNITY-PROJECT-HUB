import React from 'react'
import { Carousel } from 'antd';

import logo2 from '../../assets/logo-fpt-2.png'
import school from '../../assets/fptschool.png'
import students from '../../assets/fpt-students.png'
import students2 from '../../assets/fpt-students-2.png'
import classes from './Banner.module.css'
import classNames from 'classnames/bind';

const cx = classNames.bind(classes);


export const Banner = () => {
  return (
    <Carousel autoplay>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={logo2} alt="" className={cx('img-banner')}></img>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={school} alt="" className={cx('img-banner')}></img>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={students} alt="" className={cx('img-banner')}></img>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={students2} alt="" className={cx('img-banner')}></img>
      </div>
    </Carousel>
  )

}
