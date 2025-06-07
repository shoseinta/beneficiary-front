import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import './Login.css';
import charity_logo from '../../media/images/charity_logo.png';
import charity_typo_blue from '../../media/images/charity_typo_blue.png';
import alert_icon from '../../media/icons/alert_icon.svg';
import hide_icon from '../../media/icons/hide_icon.svg';

import { useLookup } from "../../context/LookUpContext"
function Login() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({username:"",
        password:"",
    })
    const [loginError, setLoginError] = useState(false)
    const [userIncomplete, setUserIncomplete] = useState(false)
    const [passIncomplete, setPassIncomplete] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const handleUserChange = event => {
        setLoginError(false)
        setUserIncomplete(false)
        setFormData(pre => {
            return {...pre,username:event.target.value}
        })
    }

    const handlePassChange = event => {
        setLoginError(false)
        setPassIncomplete(false)
        setFormData(pre => {
            return {...pre,password:event.target.value}
        })
    }

    const handlePassShow = () => {
      setShowPassword(!showPassword)
    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        let flag = 0
        if (!formData.username){
          setUserIncomplete(true);
          flag = 1
        }
        if (!formData.password){
          setPassIncomplete(true);
          flag = 1
        }
        if (flag) {
          return
        }
        try {
          const response = await fetch('http://localhost:8000/user-api/beneficiary/login/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          if (!response.ok) {  // Check for HTTP errors (4xx/5xx)
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
          }
          const result = await response.json();
          console.log(result)
          localStorage.setItem('access_token', result.token);
          localStorage.setItem('user_id', result.user_id);
          localStorage.setItem('username', result.username);
          navigate('/home')

        } catch (err) {
          setLoginError(true)
        }
      };

  return (
    <div className="login-container">
      <div className="logo-typo">
        <img 
          src={charity_logo} 
          alt="لوگوی خیریه دست مهربان" 
          id="logo" 
        />
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
                <img src={alert_icon} alt="" id="alert-icon1" style={userIncomplete?null:{display: "none"}} />
              </div>
            </div>
            <div className="password-input">
              <label htmlFor="password">رمز عبور</label>
              <div className="password-icons">
                <input 
                  type={showPassword?"text":"password"}
                  id="password" 
                  name="password" 
                  placeholder="برای اولین ورود، کد ملی خود را وارد کنید" 
                  autoComplete="on"
                  value={formData.password}
                  onChange={handlePassChange} 
                  required 
                />
                <img src={alert_icon} alt="" id="alert-icon2" style={passIncomplete?null:{display: "none"}}/>
                <img src={hide_icon} alt="" id="hide-icon" onClick={handlePassShow} style={{cursor: "pointer"}}/>
              </div>
            </div>
          </form>
        </div>
        <div className={loginError ? "error1 show" : "error1"}>
          <img src={alert_icon} alt="" id="alert-icon3" />
          <p>اطلاعات وارد شده معتبر نیست، دوباره تلاش کنید.</p>
        </div>
        <div className={userIncomplete || passIncomplete ? "error2 show" : "error2"}>
          <img src={alert_icon} alt="" />
          <p>لطفا تمامی بخش‌ها را پر کنید.</p>
        </div>
        <div className="submit-forgot">
          <a href="#" id="forgot">رمز عبور خود را فراموش کرده‌اید؟</a>
          <button type="submit" id="submit" onClick={handleSubmit}>ورود</button>
        </div>
      </div>

      <div className="empty"></div>
    </div>
  );
    
}

export default Login
