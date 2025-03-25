import React from 'react'
import { Header } from "../../layout/Header/Header";
import { Footer } from "../../layout/Footer/Footer";
import classes from './Layout.module.css'
import classNames from 'classnames/bind';
import { Outlet } from 'react-router-dom';
import { SideBarBR } from '../SideBar/SidebarBR';


const cx = classNames.bind(classes);

export const LayoutBR = () => {
   return (
      <div className={cx("layout-container")}>
        <Header />
        <div className={cx("wrapper")}>
          <SideBarBR />
          <main className={cx("main")}>
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
    )
}
