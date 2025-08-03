import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import charity_logo from '../../media/images/charity_logo.png';
import charity_typo_blue from '../../media/images/charity_typo_blue.png';
import alert_icon from '../../media/icons/alert_icon.svg';
import hide_icon from '../../media/icons/hide_icon.svg';

import { useLookup } from '../../context/LookUpContext';
import LoadingButton from '../../components/loadingButton/LoadingButton';
function Login() {
  useEffect(() => {
    document.title = 'صفحه ورود خیریه';
  }, []);
  const navigate = useNavigate();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState(false);
  const [userIncomplete, setUserIncomplete] = useState(false);
  const [passIncomplete, setPassIncomplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleUserChange = (event) => {
    setLoginError(false);
    setUserIncomplete(false);
    setFormData((pre) => {
      return { ...pre, username: event.target.value };
    });
  };

  const handlePassChange = (event) => {
    setLoginError(false);
    setPassIncomplete(false);
    setFormData((pre) => {
      return { ...pre, password: event.target.value };
    });
  };

  const handlePassShow = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoadingButton(true)
    let flag = 0;
    if (!formData.username) {
      setUserIncomplete(true);
      flag = 1;
    }
    if (!formData.password) {
      setPassIncomplete(true);
      flag = 1;
    }
    if (flag) {
      return;
    }
    try {
      const response = await fetch(
        'https://charity-backend-staging.liara.run/user-api/beneficiary/login/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        // Check for HTTP errors (4xx/5xx)
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }
      const result = await response.json();
      console.log(result);
      localStorage.setItem('access_token', result.token);
      localStorage.setItem('user_id', result.user_id);
      localStorage.setItem('username', result.username);
      setIsLoadingButton(false);
      navigate('/home');
    } catch (err) {
      setIsLoadingButton(false)
      setLoginError(true);
    }
  };
  useEffect(() => {
    document.body.classList.add('login-body');

    return () => {
      document.body.classList.remove('login-body');
    };
  }, []);
  useEffect(() => {
    if (userIncomplete || passIncomplete) {
      setIsLoadingButton(false);
    }
  })
  return (
    <div className="login-container">
      <div className="logo-typo">
        <img src={charity_logo} alt="لوگوی خیریه دست مهربان" id="logo" />
        <img
          src={charity_typo_blue}
          alt="تایپوگرافی نام خیریه دست مهربان"
          id="typo"
        />
      </div>

      <div className="form-container">
        <h1>ورود به سامانه مددجویان</h1>
        <div className="form-inside">
          <form>
            <div className="username-input">
              <label htmlFor="username">نام کاربری</label>
              <div className="username-icons">
                <input
                  type="text"
                  id="username"
                  name="username"
                  // pattern="\d{7}"
                  // maxLength="7"
                  title="کد مددجویی شما دارای ۷ رقم است، لطفا مقدار درست را وارد فرمایید."
                  placeholder="کد مددجویی خود در خیریه را وارد کنید"
                  autoComplete="on"
                  value={formData.username}
                  onChange={handleUserChange}
                  required
                />
                <svg id="alert-icon1" style={userIncomplete ? null : { display: 'none' }} width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 0C2.464 0 0 2.464 0 5.5C0 8.536 2.464 11 5.5 11C8.536 11 11 8.536 11 5.5C11 2.464 8.536 0 5.5 0ZM6.05 8.25H4.95V7.15H6.05V8.25ZM6.05 6.05H4.95V2.75H6.05V6.05Z" fill="#FF0000"/>
                </svg>

              </div>
            </div>
            <div className="password-input">
              <label htmlFor="password">رمز عبور</label>
              <div className="password-icons">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="برای اولین ورود، کد ملی خود را وارد کنید"
                  autoComplete="on"
                  value={formData.password}
                  onChange={handlePassChange}
                  required
                />
                <svg id="alert-icon2" style={passIncomplete ? null : { display: 'none' }} width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 0C2.464 0 0 2.464 0 5.5C0 8.536 2.464 11 5.5 11C8.536 11 11 8.536 11 5.5C11 2.464 8.536 0 5.5 0ZM6.05 8.25H4.95V7.15H6.05V8.25ZM6.05 6.05H4.95V2.75H6.05V6.05Z" fill="#FF0000"/>
                </svg>

                <svg id="hide-icon" onClick={handlePassShow} style={{ cursor: 'pointer' }} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 8.75003C7.46414 8.75003 7.90927 8.56565 8.23746 8.23746C8.56565 7.90927 8.75003 7.46414 8.75003 7C8.75003 6.84425 8.72378 6.69549 8.68528 6.55199L13.7438 1.49352C13.9078 1.32945 14 1.10692 14 0.874884C14 0.642851 13.9078 0.42032 13.7438 0.256248C13.5797 0.0921751 13.3571 0 13.1251 0C12.8931 0 12.6706 0.0921751 12.5065 0.256248L10.2227 2.54004C9.23037 2.0141 8.12306 1.74261 7 1.7499C2.08941 1.7499 0.142496 6.47412 0.0619942 6.67449C-0.020231 6.88371 -0.020231 7.11629 0.0619942 7.32551C0.109245 7.44188 0.792633 9.08516 2.32129 10.4414L0.256248 12.5065C0.175007 12.5877 0.110564 12.6842 0.0665968 12.7903C0.0226297 12.8965 8.56009e-10 13.0102 0 13.1251C-8.56008e-10 13.24 0.0226297 13.3538 0.0665968 13.4599C0.110564 13.5661 0.175007 13.6625 0.256248 13.7438C0.337488 13.825 0.433935 13.8894 0.540081 13.9334C0.646227 13.9774 0.759993 14 0.874884 14C0.989776 14 1.10354 13.9774 1.20969 13.9334C1.31583 13.8894 1.41228 13.825 1.49352 13.7438L6.55199 8.68528C6.69549 8.72291 6.84425 8.75003 7 8.75003ZM3.49993 7C3.49993 6.07172 3.86869 5.18147 4.52508 4.52508C5.18147 3.86869 6.07172 3.49993 7 3.49993C7.64926 3.49993 8.25302 3.68194 8.77191 3.99082L7.44801 5.31472C7.3021 5.27387 7.15151 5.2521 7 5.24997C6.53586 5.24997 6.09074 5.43435 5.76254 5.76254C5.43435 6.09074 5.24997 6.53586 5.24997 7C5.24997 7.15575 5.27709 7.30363 5.31472 7.44713L3.99082 8.77191C3.67057 8.23627 3.50097 7.62407 3.49993 7ZM12.377 4.24895L10.4064 6.21949C10.4624 6.47149 10.4992 6.73137 10.4992 7.00088C10.4992 7.92915 10.1304 8.81941 9.47405 9.4758C8.81766 10.1322 7.9274 10.5009 6.99913 10.5009C6.73137 10.5009 6.47237 10.4642 6.22036 10.4064L4.74858 11.8765C5.47318 12.1248 6.23401 12.2511 7 12.2501C11.9115 12.2501 13.8575 7.52589 13.9371 7.32463C14.02 7.11615 14.02 6.88385 13.9371 6.67537C13.8986 6.57824 13.4156 5.41797 12.3761 4.24895H12.377Z" fill="black" fill-opacity="0.5"/>
                </svg>

              </div>
            </div>
          </form>
        </div>
        <div className={loginError ? 'error1 show' : 'error1'}>
          <svg id="alert-icon3" width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 0C2.464 0 0 2.464 0 5.5C0 8.536 2.464 11 5.5 11C8.536 11 11 8.536 11 5.5C11 2.464 8.536 0 5.5 0ZM6.05 8.25H4.95V7.15H6.05V8.25ZM6.05 6.05H4.95V2.75H6.05V6.05Z" fill="#FF0000"/>
          </svg>

          <p>اطلاعات وارد شده معتبر نیست، دوباره تلاش کنید.</p>
        </div>
        <div
          className={
            userIncomplete || passIncomplete ? 'error2 show' : 'error2'
          }
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 0C2.464 0 0 2.464 0 5.5C0 8.536 2.464 11 5.5 11C8.536 11 11 8.536 11 5.5C11 2.464 8.536 0 5.5 0ZM6.05 8.25H4.95V7.15H6.05V8.25ZM6.05 6.05H4.95V2.75H6.05V6.05Z" fill="#FF0000"/>
          </svg>

          <p>لطفا تمامی بخش‌ها را پر کنید.</p>
        </div>
        <div className="submit-forgot">
          <a href="#" id="forgot">
            رمز عبور خود را فراموش کرده‌اید؟
          </a>
          <button style={!isLoadingButton?{paddingBottom:"5px"}:null} type="submit" id="submit" onClick={handleSubmit}>
           
            {isLoadingButton?<LoadingButton dimension={10} stroke={2} color={'#ffffff'} />: "ورود"}
          </button>
        </div>
      </div>

      <div className="empty"></div>
    </div>
  );
}

export default Login;
