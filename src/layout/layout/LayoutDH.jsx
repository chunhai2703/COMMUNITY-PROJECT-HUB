import React from 'react'
import { Header } from "../../layout/Header/Header";
import { Footer } from "../../layout/Footer/Footer";
import { SideBarDH } from "../../layout/SideBar/SideBarDH";
import classes from './Layout.module.css'
import classNames from 'classnames/bind';
import { Outlet } from 'react-router-dom';

const cx = classNames.bind(classes);
export const LayoutDH = () => {
  return (
    <div className={cx("layout-container")}>
      <Header />
      <div className={cx("wrapper")}>
        <SideBarDH />
        <main className={cx("main")}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
