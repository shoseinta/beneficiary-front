
import { useState,useEffect } from "react";
import Header  from "../../../components/header/Header";
import NavigationBar from "../../../components/navigationBar/NavigationBar";
import './Account1.css';


function Account1({accountData, setAccountData, setStep, setLoad}) {
    const [account1Data, setAccount1Data] = useState(accountData)
    const [submit, setSubmit] = useState(false)
    const [validation, setValidation] = useState({
  phone_number: true,
  email: true,
});
  useEffect(() => {
    setAccount1Data(accountData)
  },[accountData])

const handleSubmit = async (e) => {
    e.preventDefault();
    if (validation.phone_number && validation.email){
        try {
          const response = await fetch(`https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/update-user-register/`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({email:account1Data.email,phone_number:account1Data.phone_number}),
          });
          if (!response.ok) {  // Check for HTTP errors (4xx/5xx)
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
          }
          const result = await response.json();
          console.log(result)
          
          setSubmit(true);
    
        // Reset after 5 seconds
        setLoad(true)
        setTimeout(() => setSubmit(false), 5000);

        } catch (err) {
          console.log(err)
        }
    } else {
        return
    }
    
      };


const [blur, setBlur] = useState(
    {
        phone_number:true,
        email: true,
    }
)

const handleEmailChange = (e) => {
  setBlur(pre => ({...pre,email:false}))
  const value = e.target.value;
  if (!value){
    setAccount1Data(prev => ({...prev, email: null}))
  } else{
    setAccount1Data(prev => ({...prev, email: value}));
  }
  
  
  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = value === '' || emailRegex.test(value); // Allow empty or valid email
  
  setValidation(prev => ({
    ...prev,
    email: isValidEmail
  }));
};

const handlePhoneChange = (e) => {
  setBlur(pre => ({...pre, phone_number:false}))
  const value = e.target.value;
  if (!value){
    setAccount1Data(prev => ({...prev,phone_number: null}))
  }else {
    setAccount1Data(prev => ({...prev, phone_number: value}));
  }
  
  
  const phoneRegex = /^(۰۹|09)[0-9۰-۹]{9}$/;
  const isValidPhone = value === '' || phoneRegex.test(value);
  
  setValidation(prev => ({
    ...prev,
    phone_number: isValidPhone
  }));
};
    
    useEffect(()=>{
            document.documentElement.classList.add('account-container1-html')
            document.body.classList.add('account-container1-body')
    
            return ()=>{
                document.documentElement.classList.remove('account-container1-html')
                document.body.classList.remove('account-container1-body')
            }
        },[])
    return(
        <div className="account-container1">
            
            <Header />
            <main className="main">
                <section>
                    <h1>
                    با انتخاب هر یک از موارد زیر، می‌توانید با تکمیل بخش‌های خالی اقدام به اشتراک اطلاعات خود با خیریه کنید.
                    </h1>
                </section>

                <nav className="nav-up">
                    <ul className="nav-list-up">
                    <li  onClick={() => setStep(1)} className="nav-item-up" id="active-nav-up">
                        <a>اطلاعات حساب کاربری</a>
                    </li>
                    <li onClick={() => setStep(2)} className="nav-item-up">
                        <a>اطلاعات شخصی کاربر</a>
                    </li>
                    <li onClick={() => setStep(3)} className="nav-item-up">
                        <a>اطلاعات آدرس کاربر</a>
                    </li>
                    <li onClick={() => setStep(4)} className="nav-item-up">
                        <a>اطلاعات تکمیلی کاربر</a>
                    </li>
                    </ul>
                </nav>

                <form  className="account-form1">
                    <div>
                    <label htmlFor="account-support"> تحت پوشش خیریه: </label>
                    <input type="text" id="account-support" readOnly value={account1Data?.beneficiary_user_information?.under_charity_support ?"هستید":"نیستید" || ""} />
                    </div>

                    <div>
                    <label htmlFor="account-id"> کد مددجویی: </label>
                    <input type="text" id="account-id" readOnly value={account1Data?.beneficiary_id || ""} />
                    </div>

                    <div>
                    <label htmlFor="account-password"> رمز عبور: </label>
                    <input type="password" id="account-password" readOnly value={account1Data?.password || ""} />
                    </div>

                    <div>
                    <label htmlFor="account-phone-number"> شماره تلفن همراه: </label>
                    <input
                        type="tel"
                        id="account-phone-number"
                        pattern="^(۰۹|09)[0-9۰-۹]{9}$"
                        maxLength="11"
                        inputMode="numeric"
                        placeholder="مثال: ۰۹۱۲۰۱۲۳۴۵۶"
                        value={account1Data?.phone_number || ""}
                        onChange={handlePhoneChange}
                        onBlur={() => setBlur(pre => ({...pre,phone_number:true}))}
                        className={!validation.phone_number && blur.phone_number ? "invalid-input" : ""}
                        
                    />
                    {!validation.phone_number && blur.phone_number && (
                        <div className="error-message"> شماره همراه وارد شده صحیح نیست</div>
                    )}
                    </div>

                    <div>
                    <label htmlFor="account-email"> آدرس ایمیل: </label>
                    <input 
                    type="email" 
                    id="account-email" 
                    value={account1Data?.email || ""} 
                    onChange={handleEmailChange} 
                    onBlur={() => setBlur(pre => ({...pre,email:true}))}
                    className={!validation.email && blur.email ? "invalid-input" : ""}
                    />
                    {!validation.email && blur.email && (
                        <div className="error-message">فرمت ایمیل وارد شده صحیح نیست</div>
                    )}
                    </div>

                    <div id="account-submit1">
                    {
                        submit ?
                    <div>
                        <svg
                        width="16"
                        height="14"
                        viewBox="0 0 16 14"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path d="M14.7373 0L4.94741 11.1961L1.22585 6.93997L0 8.34191L4.94741 14L15.9631 1.40194L14.7373 0Z" />
                        </svg>
                        تغییرات با موفقیت اعمال شد
                    </div>
                    :
                    <div style={{visibility:"hidden"}}>
                        <svg
                        width="16"
                        height="14"
                        viewBox="0 0 16 14"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path d="M14.7373 0L4.94741 11.1961L1.22585 6.93997L0 8.34191L4.94741 14L15.9631 1.40194L14.7373 0Z" />
                        </svg>
                        تغییرات با موفقیت اعمال شد
                    </div>
                    }
                    
                    <input type="submit" value="تأیید" onClick={handleSubmit} />
                    </div>
                </form>
                </main>

                <NavigationBar selected={4}/>
        </div>
    )
}

export default Account1;