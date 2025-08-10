import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLookup } from '../../context/LookUpContext';
import './Hamburger.css';

function Hamburger() {
    const navigate = useNavigate();
    const { hamburger, setHamburger,fontBig,setFontBig,darkMode,setDarkMode } = useLookup();
    const [isActive, setIsActive] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const signOut = () => {
        handleClose();
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        navigate('/');
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setHamburger(false);
            setIsClosing(false);
        }, 400); // Match the transition duration
    };

    useEffect(() => {
        document.body.classList.add('hamburger-body');
        setTimeout(() => setIsActive(true), 10);
        
        return () => {
            document.body.classList.remove('hamburger-body');
        };
    }, []);



    return (
        <>
            <div 
                className={`hamburger-block-overlay ${isActive ? 'active' : ''}${isClosing ? ' closing' : ''}`}
                onClick={handleClose}
            ></div>
            <div className={`hamburger-overlay ${isActive ? 'active' : ''}${isClosing ? ' closing' : ''}`}>
                <div className="hamburger-overlay-content">
                    <div className='hamburger-overlay-header-setting'>
                        <div className="hamburger-overlay-header"> 
                            <h4>تنظیمات سامانه</h4>
                            <button className="close-btn" onClick={handleClose}>
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M29.2929 3.72853C29.6834 3.33801 29.6834 2.70485 29.2929 2.31432L27.6857 0.707107C27.2952 0.316583 26.662 0.316583 26.2715 0.707107L15.7071 11.2715C15.3166 11.662 14.6834 11.662 14.2929 11.2715L3.72853 0.707106C3.33801 0.316582 2.70485 0.316582 2.31432 0.707107L0.707107 2.31432C0.316583 2.70485 0.316583 3.33801 0.707107 3.72853L11.2715 14.2929C11.662 14.6834 11.662 15.3166 11.2715 15.7071L0.707106 26.2715C0.316582 26.662 0.316582 27.2952 0.707107 27.6857L2.31432 29.2929C2.70485 29.6834 3.33801 29.6834 3.72853 29.2929L14.2929 18.7285C14.6834 18.338 15.3166 18.338 15.7071 18.7285L26.2715 29.2929C26.662 29.6834 27.2952 29.6834 27.6857 29.2929L29.2929 27.6857C29.6834 27.2952 29.6834 26.662 29.2929 26.2715L18.7285 15.7071C18.338 15.3166 18.338 14.6834 18.7285 14.2929L29.2929 3.72853Z" fill="#185EA0"/>
                                </svg>

                            </button>
                        </div>

                        <div className="settings">
                            <div className="setting">
                                <h5>اندازه متن</h5>
                                <div className="setting-content">
                                    <p>متوسط</p>
                                    {!fontBig &&
                                    <div className="setting-image" onClick={() => {
                                        setFontBig(true)
                                        localStorage.setItem('fontSize','big')
                                    }
                                    }> 
                                        <svg width="44" height="22" viewBox="0 0 44 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="44" height="22" rx="11" fill="#D9D9D9"/>
                                        </svg>

                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <ellipse cx="11.0333" cy="11" rx="10.9668" ry="10.9668" fill="#185EA0"/>
                                        </svg>

                                    </div>}
                                    
                                    {fontBig && 
                                    <div className="setting-image" onClick={() => {
                                        setFontBig(false)
                                        localStorage.removeItem('fontSize')
                                    }
                                    }> 
                                        <svg width="44" height="22" viewBox="0 0 44 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="44" height="22" rx="11" fill="#D9D9D9"/>
                                        </svg>

                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className='move-left'>
                                        <ellipse cx="11.0333" cy="11" rx="10.9668" ry="10.9668" fill="#185EA0"/>
                                        </svg>

                                    </div>}
                                    <p>بزرگ</p>
                                </div>
                            </div>

                            <div className="setting">
                                <h5>اندازه تصویر</h5>
                                <div className="setting-content">
                                    <p>متوسط</p>
                                    <div className="setting-image"> 
                                        <svg width="44" height="22" viewBox="0 0 44 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="44" height="22" rx="11" fill="#D9D9D9"/>
                                        </svg>

                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <ellipse cx="11.0333" cy="11" rx="10.9668" ry="10.9668" fill="#185EA0"/>
                                        </svg>

                                    </div>
                                    <p>بزرگ</p>
                                    
                                </div>
                            </div>

                            <div className="setting">
                                <h5>حالت تصویر</h5>
                                <div className="setting-content">
                                    <p>روشن&nbsp;&nbsp;&nbsp;</p>
                                    {!darkMode &&
                                    <div className="setting-image" onClick={() => {
                                        setDarkMode(true)
                                        localStorage.setItem('darkMode',true)
                                    }}> 
                                        <svg width="44" height="22" viewBox="0 0 44 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="44" height="22" rx="11" fill="#D9D9D9"/>
                                        </svg>

                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <ellipse cx="11.0333" cy="11" rx="10.9668" ry="10.9668" fill="#185EA0"/>
                                        </svg>

                                    </div>}
                                    {darkMode &&
                                        <div className="setting-image" onClick={() => {
                                            setDarkMode(false)
                                            localStorage.removeItem('darkMode')
                                        }}> 
                                        <svg width="44" height="22" viewBox="0 0 44 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="44" height="22" rx="11" fill="#D9D9D9"/>
                                        </svg>

                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className='move-left'>
                                        <ellipse cx="11.0333" cy="11" rx="10.9668" ry="10.9668" fill="#185EA0"/>
                                        </svg>

                                    </div>}
                                    <p>تاریک</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="sign-out-btn" onClick={signOut}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 0H8V10H10V0ZM14.83 2.17L13.41 3.59C14.99 4.86 16 6.81 16 9C16 12.87 12.87 16 9 16C5.13 16 2 12.87 2 9C2 6.81 3.01 4.86 4.58 3.58L3.17 2.17C1.23 3.82 0 6.26 0 9C0 13.97 4.03 18 9 18C13.97 18 18 13.97 18 9C18 6.26 16.77 3.82 14.83 2.17Z" fill="#FF0000"/>
                        </svg>
                        خروج از سامانه
                    </button>
                </div>
            </div>
        </>
    );
}

export default Hamburger;