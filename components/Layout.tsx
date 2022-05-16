// @ts-nocheck
import React from 'react'
import Tabela from './Tabela'
import { AppBar, Box, Container, CssBaseline, Divider, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material'
import prisma from '../lib/prisma'
import Navbar from './Navbar'
import Footer from './Footer'
import { Drawer } from '@mui/material'
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { flexbox } from '@mui/system'
import { ClassNames, ThemeContext } from '@emotion/react'
import Link from 'next/link'


function Layout({ children, window, series, competitions }) {
    series = JSON.parse(series);
    competitions = JSON.parse(competitions);
    const styles = theme => ({
        // Load app bar information from the theme
        toolbar: theme.mixins.toolbar,
        content: {
            padding: '300px'
        }
    });
    const drawerWidth = 300;
    const container = window !== undefined ? () => window().document.body : undefined;

    var seriesContainerOnClick = (e) => {
        if(e.target.parentElement.querySelector('.nav-item ul').classList.contains('open')) e.target.parentElement.querySelector('.nav-item ul').classList.remove('open');
        else e.target.parentElement.querySelector('.nav-item ul').classList.add('open')
    }


    var navbarTogglerOnClick = (e) => {
        var navbar = document.querySelector('.navbar');
        var navbarToggler = document.querySelector('.navbar-toggler');
        var gridContainer = document.querySelector('.grid-container');
        if(!navbar.classList.contains('collapsed')) {
            navbar.classList.add('collapsed');
            navbarToggler.classList.add('collapsed');
            gridContainer.classList.add('collapsed');
        }
        else {
            navbar.classList.remove('collapsed');
            navbarToggler.classList.remove('collapsed');
            gridContainer.classList.remove('collapsed');
        }
    }

    return (
        <div>
        <div className='navbar'>
                <ul className='navbar-nav'>
                    <li>
                        <div className='flag-flex'>
                            <a>
                                <span className='fi fi-gb' />
                            </a>
                            <a>
                                <span className="fi fi-pl" />
                            </a>
                        </div>
                    </li>
                    <li>  
                        <Link href="/">
                        <a className='logo' >
                            <img src="/croppedRectangle.png" />
                        </a>
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <p className='nav-header' onClick={seriesContainerOnClick}>LIGA</p>
                        <ul className='seriesContainer open'>
                            {series.map(s => (
                                s.type == 'liga' &&
                                <li>
                                    <Link href={`/competitions/${competitions.filter(c => c.seriesid == s.pk)[0].pk}`}>
                                        <a>{s.name}</a>
                                    </Link>

                                </li>
                            ))}
                        </ul>
                    </li>
                    <li className='nav-item'>
                        <p className='nav-header' onClick={seriesContainerOnClick}>TURNIEJE</p>
                        <ul className='seriesContainer open'>
                            {series.map(s => (
                                s.type != 'liga' &&
                                <li>
                                    <Link href={`/competitions/${competitions.filter(c => c.seriesid == s.pk)[0].pk}`}>
                                        <a>{s.name}</a>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>

                    <li className='nav-item'>
                        <Link href='/archive'>
                            <a><p className='nav-header'>ARCHIWUM</p> </a>
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link href='/players'>
                            <a><p className='nav-header'>ZAWODNICY</p></a>
                        </Link>
                    </li>
                    {/* <li className='nav-item'>
                        <Link href='/matches'>
                            <a><p className='nav-header'>MECZE</p></a>
                        </Link>
                    </li> */}
                    <li className='nav-item'>
                        <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "space-evenly" }}>
                            <a href='https://discord.gg/qUrgBbssvE'>
                                <i className="bi bi-discord" style={{ color: 'white', fontSize: 50}}></i>
                            </a>
                            <a href='https://www.facebook.com/groups/479747842604803'>
                                <i className="bi bi-facebook" style={{ color: 'white', fontSize: 50}}></i>
                            </a>
                        </div>
                    </li>

                </ul>

            </div>

            <i className="bi bi-list navbar-toggler" onClick={navbarTogglerOnClick}></i>  
        <div className='grid-container'>
            <div className='header'>
            </div>          
            <div className='sidebar'></div>
            <div className='content'>{children}</div>
            <div className='footer'></div>
        </div>
        </div>
    )
}

export default Layout