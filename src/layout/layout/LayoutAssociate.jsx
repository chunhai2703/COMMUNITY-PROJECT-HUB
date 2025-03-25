import React from 'react'
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import classes from './Layout.module.css'
import classNames from 'classnames/bind';
import { Outlet } from 'react-router-dom';
import { SideBarAssociate } from '../SideBar/SidebarAssociate';



const cx = classNames.bind(classes);

export const LayoutAssociate = () => {
  return (
    <div className={cx("layout-container")}>
      <Header />
      <div className={cx("wrapper")}>
        <SideBarAssociate />
        <main className={cx("main")}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
