'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { mosyGetLSData, dayTime } from '../MosyUtils/hiveUtils';
import saAuthConfigs from '../auth/featureConfig/saAuthConfigs';
import {destroyAppSession} from '../auth/AuthUtils';

import {hiveRoutes} from '../appConfigs/hiveRoutes'; 
import initSidebarControls from './initSideBarControl'

export default function NavSidebar({
  appName = 'MosyApp',
  appLogo = '/img/sampleimg1.jpg',
  userAvatar = '/img/useravatar.png',
  appLogoStyle = { height: '50px', width: 'auto', marginRight: '20px' },
  indexPage = '/',
  commonRoot = ''
}) {
  const { sessionPrefix, usernameCol } = saAuthConfigs;
  const cookieKey = `${sessionPrefix}_sa_authsess_${usernameCol}_val`;

  const [username, setUsername] = useState('User');
  
  useEffect(() => {
    const usernameRaw = mosyGetLSData(cookieKey);
    if (usernameRaw) {
      setUsername(usernameRaw.split(' ')[0]);
    }

    initSidebarControls();


  }, []); // Empty dependency array ensures this runs only on the client side


  const userRole = 'User';
  const notificationCount = 0;
  const navRoutes = hiveRoutes;

  return (
    <>
      <div className="header">
        <div className="header-left">
          <a className="mobile_btn cpointer" id="mobile_btn">
            <i className="fa fa-bars" />
          </a>
          <span id="toggle_btn" className="cpointer">
            <i className="fe fe-text-align-left" />
          </span>
          <Link href={indexPage} className="logo logo-small text-dark" style={{ marginLeft: '-100px' }}>
            <Image src={appLogo} alt="Logo" style={appLogoStyle} width={30} height={30} />
            <span className="bold h5">{appName}</span>
          </Link>
        </div>

        <div className="top-nav-search pt-2">
          <Link href={indexPage} className="logo text-dark">
            <Image src={appLogo} alt="Logo" style={appLogoStyle} width={30} height={30} />
            <span className="bold h5">{appName}</span>
          </Link>
        </div>

        <ul className="nav user-menu">
          <li className="nav-item dropdown has-arrow">
            <a href="#" className="dropdown-toggle nav-link" data-bs-toggle="dropdown">
              <span className="text-primary mr-2">Good {dayTime()} {username}</span>
              <span className="user-img">
                <Image
                  className="rounded-circle"
                  src={userAvatar}
                  width={31}
                  height={31}
                  alt="Avatar"
                />
              </span>
            </a>
            <div className="dropdown-menu">
              <div className="user-header">
                <div className="avatar avatar-sm">
                  <Image
                    src={userAvatar}
                    alt="User Image"
                    className="avatar-img rounded-circle"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="user-text">
                  <h6>{username}</h6>
                  <p className="text-muted mb-0">{userRole}</p>
                </div>
              </div>
              <a className="dropdown-item d-none" href="/adminaccount">My Profile</a>
              <a className="dropdown-item d-none" href="/adminaccount">Account Settings</a>
              <a
                className="dropdown-item cpointer"
                onClick={() => {
                    destroyAppSession();
                  
                }}
              >
                Logout
              </a>
            </div>
          </li>
        </ul>
      </div>

      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
            <li className="menu-title p-4"> </li>    
            <li>
              <a className="nav-link" href={`${hiveRoutes.nextinvoice}/dashboard/main`}>
                <i className="fa fa-home"></i> <span> Dashboard </span>
              </a>
            </li>
              
              <li className="submenu">
                <a href="#"><i className="fa fa-copy"></i> <span> Invoices </span> <span className="menu-arrow"></span></a>
                <ul style={{display: "none"}} >
                  <li><a className="nav-link" href={`${hiveRoutes.nextinvoice}/docs/invoiceprofile`}>Create invoice</a></li>
                  <li><a className="nav-link" href={`${hiveRoutes.nextinvoice}/docs/invoices`}>Manage invoices</a></li>
                </ul>
               </li>   

               <li className="submenu">
                <a href="#"><i className="fa fa-file-text"></i> <span> Quotations </span> <span className="menu-arrow"></span></a>
                <ul style={{display: "none"}} >
                  <li><a className="nav-link" href={`${hiveRoutes.nextinvoice}/docs/quotation`}>Create quotation</a></li>
                  <li><a className="nav-link" href={`${hiveRoutes.nextinvoice}/docs/quotations`}>Manage Quotations</a></li>
                </ul>
               </li>     
               <li className="submenu">
                <a href="#"><i className="fa fa-list"></i> <span> Items </span> <span className="menu-arrow"></span></a>
                <ul style={{display: "none"}} >
                  <li><a className="nav-link" href={`${hiveRoutes.nextinvoice}/pns/profile`}>Add item</a></li>
                  <li><a className="nav-link" href={`${hiveRoutes.nextinvoice}/pns/list`}>Manage items</a></li>
                </ul>
               </li> 

               <li className="submenu">
                <a href="#"><i className="fa fa-users"></i> <span> Clients </span> <span className="menu-arrow"></span></a>
                <ul style={{display: "none"}} >
                  <li><a className="nav-link" href={`${hiveRoutes.nextinvoice}/clients/profile`}>Add client</a></li>
                  <li><a className="nav-link" href={`${hiveRoutes.nextinvoice}/clients/list`}>Manage clients</a></li>
                </ul>
               </li>  

               <li className="submenu">
                <a href="#"><i className="fa fa-briefcase"></i> <span> My businesses </span> <span className="menu-arrow"></span></a>
                <ul style={{display: "none"}} >
                  <li><a className="nav-link" href={`${hiveRoutes.nextinvoice}/vendors/business`}>Add company</a></li>
                  <li><a className="nav-link" href={`${hiveRoutes.nextinvoice}/vendors/businesslist`}>Manage companies</a></li>
                </ul>
               </li> 

               <li className="submenu">
                <a href="#"><i className="fa fa-credit-card"></i> <span> Payments </span> <span className="menu-arrow"></span></a>
                <ul style={{display: "none"}} >
                  <li><a className="nav-link" href={`${hiveRoutes.nextinvoice}/payments/profile`}>Add payment</a></li>
                  <li><a className="nav-link" href={`${hiveRoutes.nextinvoice}/payments/list`}>Manage Payments</a></li>
                </ul>
               </li>  

               <li className="submenu">
                <a href="#"><i className="fa fa-file-text"></i> <span> Notifications </span> <span className="menu-arrow"></span></a>
                <ul style={{display: "none"}} >
                  <li><a className="nav-link" href={`${hiveRoutes.nextinvoice}/docs/invoices/profile`}>SMS</a></li>
                  <li><a className="nav-link" href={`${hiveRoutes.nextinvoice}/docs/invoices/list`}>Email</a></li>
                  <li><a className="nav-link" href={`${hiveRoutes.nextinvoice}/docs/invoices/list`}>Manage notifications</a></li>
                </ul>
               </li>

               <li>
                <a className="nav-link" href={`${hiveRoutes.nextinvoice}/dashboard/main`}>
                  <i className="fa fa-database"></i> <span> Billing </span>
                </a>
              </li>
                      
               <li className="submenu">
                <a href="#"><i className="fa fa-gear"></i> <span> Settings </span> <span className="menu-arrow"></span></a>
                <ul style={{display: "none"}} >
                  <li><a className="nav-link" href={`${hiveRoutes.nextinvoice}/docs/invoices/profile`}>System users</a></li>
                  <li><a className="nav-link" href={`${hiveRoutes.nextinvoice}/docs/invoices/list`}>System settings</a></li>
                </ul>
               </li>  

            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
