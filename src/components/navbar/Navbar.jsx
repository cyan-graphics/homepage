'use client'
import Link from "next/link";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css"
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import { signOut, useSession } from "next-auth/react";
const links = [
    {
        id:1,
        title: "Home",
        url:"/"
    },
    {
        id:2,
        title: "Blogs",
        url:"/blog"
    },
    {
        id:3,
        title: "Portfolio",
        url:"/portfolio"
        
    },
    {
        id:4,
        title: "Categories",
        url:"/category"
        
    },
    {
        id:5,
        title: "About",
        url:"/about"
    },
    {
        id:6,
        title: "Dashboard",
        url:"/dashboard"
    },
    // {
    //     id:5,
    //     title: "Contact",
    //     url:"/contact"
    // },
    // {
    //     id:6,
    //     title: "Dashboard",
    //     url:"/dashboard"
    // },  
];
const Navbar = () => {
    const session = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    useEffect(() => {
        // Function to check the window width and update the menu state
        const handleResize = () => {
            const isMonitor = window.innerWidth > 600;
            setIsMenuOpen(!isMonitor);
        };

        // Call the function on component mount and add event listener for window resize
        handleResize();
        window.addEventListener('resize', handleResize);

        // Cleanup function to remove the event listener when the component unmounts
        return () => window.removeEventListener('resize', handleResize);
    }, []); 
    return(
        <div className={styles.container}>
            <Link href="/" className={styles.logo}>
                Lin&apos;s Homepage
            </Link>
            <button onClick={toggleMenu} className={styles.menuButton}>
                 &nbsp;Menu&nbsp; 
            </button>
            <div className={isMenuOpen ? styles.links : styles.linksHidden}>

                <DarkModeToggle />
                
                {links.map((link)=>(
                    <Link key = {link.id} href={link.url} className={styles.link}>
                        {link.title}
                    </Link>
                ))}

                {session.status === "authenticated" &&
                    <button onClick={signOut} className={styles.logout}>Logout</button>
                }
                
            </div>
            
        </div>
        
        );
};

export default Navbar;