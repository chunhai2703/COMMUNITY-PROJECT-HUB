import React from 'react'
import { Header } from "../../layout/Header/Header";
import { Footer } from "../../layout/Footer/Footer";
import classes from './LayoutDH.module.css'
import classNames from 'classnames/bind';
import { Outlet } from 'react-router-dom';
import { SideBarAdmin } from '../SideBar/SideBarAdmin';

const cx = classNames.bind(classes);
export const LayoutAdmin = () => {
  return (
    <div className={cx("layout-container")}>
      <Header />
      <div className={cx("wrapper")}>
        <SideBarAdmin />
        <main className={cx("main")}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
