import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLookup } from '../../context/LookUpContext';
import close_icon from '../../media/icons/close_icon.svg';
import setting1_icon from '../../media/icons/setting1_icon.svg';
import setting2_icon from '../../media/icons/setting2_icon.svg';
import power_icon from '../../media/icons/power_icon.svg';
import './Hamburger.css';

function Hamburger() {
    const navigate = useNavigate();
    const { setHamburger } = useLookup();
    const [isActive, setIsActive] = useState(false);

    const signOut = () => {
        setHamburger(false);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        navigate('/');
    };

    useEffect(() => {
        document.body.classList.add('hamburger-body');
        setTimeout(() => setIsActive(true), 10);
        
        return () => {
            document.body.classList.remove('hamburger-body');
            setIsActive(false);
        };
    }, []);

    return (
        <>
            <div 
                className={`hamburger-block-overlay ${isActive ? 'active' : ''}`}
                onClick={() => setHamburger(false)}
            ></div>
            <div className={`hamburger-overlay ${isActive ? 'active' : ''}`}>
                <div className="hamburger-overlay-header"> 
                    <h4>تنظیمات سامانه</h4>
                    <button className="close-btn" onClick={() => setHamburger(false)}>
                        <img src={close_icon} alt="بستن تنظیمات" />
                    </button>
                </div>

                <div className="settings">
                    <div className="setting">
                        <h5>اندازه متن</h5>
                        <div className="setting-content">
                            <p>متوسط</p>
                            <div className="setting-image"> 
                                <img src={setting1_icon} alt="" />
                                <img src={setting2_icon} alt="" />
                            </div>
                            <p>بزرگ</p>
                        </div>
                    </div>

                    <div className="setting">
                        <h5>اندازه تصویر</h5>
                        <div className="setting-content">
                            <p>متوسط</p>
                            <div className="setting-image"> 
                                <img src={setting1_icon} alt="" />
                                <img src={setting2_icon} alt="" />
                            </div>
                            <p>بزرگ</p>
                        </div>
                    </div>

                    <div className="setting">
                        <h5>حالت تصویر</h5>
                        <div className="setting-content">
                            <p>روشن&nbsp;&nbsp;&nbsp;</p>
                            <div className="setting-image"> 
                                <img src={setting1_icon} alt="" />
                                <img src={setting2_icon} alt="" />
                            </div>
                            <p>تاریک</p>
                        </div>
                    </div>
                    <div className="empty"></div>
                </div>

                <button className="sign-out-btn" onClick={signOut}>
                    <img src={power_icon} alt="" /> خروج از سامانه
                </button>
            </div>
        </>
    );
}

export default Hamburger;