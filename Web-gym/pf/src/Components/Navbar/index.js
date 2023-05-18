import React, { useState, useEffect, Fragment } from 'react';
import { FaBars } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import { animateScroll as scroll } from 'react-scroll';
import {
    Nav,
    NavbarContainer,
    NavLogo,
    MobileIcon,
    NavMenu,
    NavItem,
    NavLinks,
    NavBtn,
    NavBtnLink,
    SubA,
    DropDownLi,
    Dropbtn,
    DropDownContent,

} from './NavbarElements';
import { HashLink, HashLink as Link } from 'react-router-hash-link'

const Navbar = ({ toggle }) => {
    const [scrollNav, setScrollNav] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

    const changeNav = () => {
        if (window.scrollY >= 80) {
            setScrollNav(true);
        } else {
            setScrollNav(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', changeNav);
    }, []);

    useEffect(() => {
        // console.log(localStorage.getItem('token'))
        if (localStorage.getItem('token') !== null) {
            // console.log("authenticated now")
            setIsAuth(true);
        }
      }, [isAuth]);

    const toggleHome = () => {
        scroll.scrollToTop();
    };

    const logout = () => {
        setIsAuth(false)
        localStorage.removeItem("token")
    }

    return (
        <>
            <IconContext.Provider value={{ color: '#fff' }}>
                <Nav scrollNav={scrollNav}>
                    <NavbarContainer>
                        <NavLogo to='/' onClick={toggleHome}>Toronto Fitness Clubs</NavLogo>
                        <MobileIcon onClick={toggle}>
                            <FaBars />
                        </MobileIcon>
                        <NavMenu>
                            <NavItem>
                                <NavLinks
                                    to='/#about'
                                    smooth='true'
                                    duration={500}
                                    spy='true'
                                    exact='true'
                                    offset={-80}>
                                    About</NavLinks>
                            </NavItem>

                            <NavItem>
                                <NavLinks to='/#Studios'
                                smooth='true'
                                duration={500}
                                spy='true'
                                exact='true'
                                offset={-80}>Studios</NavLinks>
                            </NavItem>

                            <NavItem>
                                <NavLinks to='/#subscriptions'
                                smooth='true'
                                duration={500}
                                spy='true'
                                exact='true'
                                offset={-80}>Subscriptions</NavLinks>
                            </NavItem>


                            
                        </NavMenu>
                        {isAuth === true ? (
                            <DropDownLi>
                                <Dropbtn>
                                Account
                                </Dropbtn>
                                <DropDownContent>
                                {" "}
                                <NavBtn>
                                    <NavBtnLink to='/profile'>Profile</NavBtnLink>
                                </NavBtn>
                                <NavBtn>
                                    <NavBtnLink to='/profile'>Manage Subscription</NavBtnLink>
                                </NavBtn>
                                <NavBtn>
                                    <NavBtnLink to='/' onClick={logout}>Logout</NavBtnLink>
                                </NavBtn>
                                </DropDownContent>
                            </DropDownLi>
                            ) : (
                            <Fragment>
                                {' '}
                                <NavBtn>
                                    <NavBtnLink to='/login'>Log In</NavBtnLink>
                                </NavBtn>
                                <NavBtn>
                                    <NavBtnLink to='/signup'>Sign Up</NavBtnLink>
                                </NavBtn>
                            </Fragment>
                            )}
                    </NavbarContainer>
                </Nav>
            </IconContext.Provider>
        </>
    );
};

export default Navbar;
