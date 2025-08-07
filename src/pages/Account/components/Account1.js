import { useState, useEffect } from 'react';
import Header from '../../../components/header/Header';
import NavigationBar from '../../../components/navigationBar/NavigationBar';
import './Account1.css';
import LoadingButton from '../../../components/loadingButton/LoadingButton';
import {Tooltip} from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'


function Account1({ accountData, setAccountData, setStep, setLoad }) {
  const [showError, setShowError] = useState(false)
  const [account1Data, setAccount1Data] = useState(accountData);
  const [submit, setSubmit] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false)
  const [validation, setValidation] = useState({
    phone_number: true,
    email: true,
  });
  useEffect(() => {
    setAccount1Data(accountData);
  }, [accountData]);

  useEffect(() => {
    if(validation.email && validation.phone_number){
      setShowError(false)
    }
  },[validation])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validation.phone_number && validation.email) {
      setIsLoadingButton(true)
      try {
        const response = await fetch(
          `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/update-user-register/`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({
              email: account1Data.email,
              phone_number: account1Data.phone_number,
            }),
          }
        );
        if (!response.ok) {
          // Check for HTTP errors (4xx/5xx)
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Login failed');
        }
        const result = await response.json();
        console.log(result);
        setIsLoadingButton(false)
        setSubmit(true);
        // Reset after 5 seconds
        setLoad(true);
        setTimeout(() => setSubmit(false), 5000);
      } catch (err) {
        console.log(err);
        setIsLoadingButton(false)
      }
    } else {
      setShowError(true)
      return;
    }
  };

  const [blur, setBlur] = useState({
    phone_number: true,
    email: true,
  });

  const handleEmailChange = (e) => {
    setBlur((pre) => ({ ...pre, email: false }));
    const value = e.target.value;
    if (!value) {
      setAccount1Data((prev) => ({ ...prev, email: null }));
    } else {
      setAccount1Data((prev) => ({ ...prev, email: value }));
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = value === '' || emailRegex.test(value); // Allow empty or valid email

    setValidation((prev) => ({
      ...prev,
      email: isValidEmail,
    }));
  };
  const toPersianDigits = (num) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, (d) => persianDigits[d]);
  };
  const handlePhoneChange = (event) => {
    // Convert Persian digits to English and remove all non-digit characters
    setBlur((pre) => ({ ...pre, phone_number: false }));
    const phoneRegex = /^(۰۹|09)[0-9۰-۹]{9}$/;
    const isValidPhone = event.target.value === '' || phoneRegex.test(event.target.value);

    setValidation((prev) => ({
      ...prev,
      phone_number: isValidPhone,
    }));
    let englishValue = event.target.value
      .split('')
      .map((c) => {
        const persianDigits = [
          '۰',
          '۱',
          '۲',
          '۳',
          '۴',
          '۵',
          '۶',
          '۷',
          '۸',
          '۹',
        ];
        const index = persianDigits.indexOf(c);
        return index >= 0 ? index.toString() : c;
      })
      .join('')
      .replace(/\D/g, '');

    // Update the state with the English number (or empty string)
    const newValue = englishValue === '' ? null : englishValue;
    setAccount1Data((pre) => ({
      ...pre,
      phone_number: newValue
    }));
    // Update the displayed value with Persian digits (no commas)
    const displayValue =
      englishValue === '' ? '' : toPersianDigits(englishValue);
    event.target.value = displayValue;
  };

  useEffect(() => {
    document.documentElement.classList.add('account-container1-html');
    document.body.classList.add('account-container1-body');

    return () => {
      document.documentElement.classList.remove('account-container1-html');
      document.body.classList.remove('account-container1-body');
    };
  }, []);
  return (
    <div className="account-container1">
      <Header />
      <main className="main">
        <section style={{padding:"0 10px"}}>
          <h1>
            با انتخاب هر یک از موارد زیر، می‌توانید با تکمیل بخش‌های خالی اقدام
            به اشتراک اطلاعات خود با خیریه کنید.
          </h1>
        </section>

        <nav className="nav-up">
          <ul className="nav-list-up">
            <li
              onClick={() => setStep(1)}
              className="nav-item-up"
              id="active-nav-up"
            >
              <a style={{color:"#fff"}}>اطلاعات حساب کاربری</a>
            </li>
            <li onClick={() => setStep(2)} className="nav-item-up">
              <a style={{color:"#000"}}>اطلاعات شخصی کاربر</a>
            </li>
            <li onClick={() => setStep(3)} className="nav-item-up">
              <a style={{color:"#000"}}>اطلاعات آدرس کاربر</a>
            </li>
            <li onClick={() => setStep(4)} className="nav-item-up">
              <a style={{color:"#000"}}>اطلاعات تکمیلی کاربر</a>
            </li>
          </ul>
        </nav>

        <form className="account-form1">
          <div>
            <label htmlFor="account-support"> تحت پوشش خیریه: </label>
            <div className="input-icon-wrapper">
              <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.625 5.16667H8.9375V3.83333C8.9375 1.99333 7.3975 0.5 5.5 0.5C3.6025 0.5 2.0625 1.99333 2.0625 3.83333V5.16667H1.375C0.61875 5.16667 0 5.76667 0 6.5V13.1667C0 13.9 0.61875 14.5 1.375 14.5H9.625C10.3813 14.5 11 13.9 11 13.1667V6.5C11 5.76667 10.3813 5.16667 9.625 5.16667ZM3.4375 3.83333C3.4375 2.72667 4.35875 1.83333 5.5 1.83333C6.64125 1.83333 7.5625 2.72667 7.5625 3.83333V5.16667H3.4375V3.83333ZM9.625 13.1667H1.375V6.5H9.625V13.1667ZM5.5 11.1667C6.25625 11.1667 6.875 10.5667 6.875 9.83333C6.875 9.1 6.25625 8.5 5.5 8.5C4.74375 8.5 4.125 9.1 4.125 9.83333C4.125 10.5667 4.74375 11.1667 5.5 11.1667Z" fill="black"/>
              </svg>
              <input
                type="text"
                id="account-support"
                readOnly
                value={
                  account1Data?.beneficiary_user_information
                    ?.under_charity_support === true
                    ? 'هستید'
                    : account1Data?.beneficiary_user_information?.under_charity_support === null || account1Data?.beneficiary_user_information?.under_charity_support === undefined? "":'نیستید'
                }
                data-tooltip-id="account-support-lock"
        data-tooltip-content="این بخش قابل ویرایش نیست"
              />
              
      <Tooltip id="account-support-lock" place="top" openOnClick={true} style={{fontSize:"0.7rem", fontWeight:"normal",borderRadius:"6px"}}/>
            </div>
          </div>

          <div>
            <label htmlFor="account-id"> کد مددجویی: </label>
            <div className="input-icon-wrapper">
              <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.625 5.16667H8.9375V3.83333C8.9375 1.99333 7.3975 0.5 5.5 0.5C3.6025 0.5 2.0625 1.99333 2.0625 3.83333V5.16667H1.375C0.61875 5.16667 0 5.76667 0 6.5V13.1667C0 13.9 0.61875 14.5 1.375 14.5H9.625C10.3813 14.5 11 13.9 11 13.1667V6.5C11 5.76667 10.3813 5.16667 9.625 5.16667ZM3.4375 3.83333C3.4375 2.72667 4.35875 1.83333 5.5 1.83333C6.64125 1.83333 7.5625 2.72667 7.5625 3.83333V5.16667H3.4375V3.83333ZM9.625 13.1667H1.375V6.5H9.625V13.1667ZM5.5 11.1667C6.25625 11.1667 6.875 10.5667 6.875 9.83333C6.875 9.1 6.25625 8.5 5.5 8.5C4.74375 8.5 4.125 9.1 4.125 9.83333C4.125 10.5667 4.74375 11.1667 5.5 11.1667Z" fill="black"/>
              </svg>
              <input
                type="text"
                id="account-id"
                readOnly
                value={account1Data?.beneficiary_id || ''}
                style={{direction:"ltr"}
              }
                data-tooltip-id="account-id-lock"
                data-tooltip-content="این بخش قابل ویرایش نیست"
              />
              <Tooltip id="account-id-lock" place="top" openOnClick={true} style={{fontSize:"0.7rem", fontWeight:"normal",borderRadius:"6px"}}/>

            </div>
          </div>

          <div>
            <label htmlFor="account-password"> رمز عبور: </label>
            <input
              type="password"
              id="account-password"
              readOnly
              value={account1Data?.password || ''}
              style={{direction:"ltr"}}
            />
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
              value={account1Data?.phone_number ? toPersianDigits(account1Data?.phone_number) : null}
              onChange={handlePhoneChange}
              onBlur={() => setBlur((pre) => ({ ...pre, phone_number: true }))}
              className={
                !validation.phone_number && blur.phone_number
                  ? 'invalid-input'
                  : ''
              }
              style={{direction:"ltr"}}
            />
          </div>

          <div>
            <label htmlFor="account-email"> آدرس ایمیل: </label>
            <input
              type="email"
              id="account-email"
              value={account1Data?.email || ''}
              onChange={handleEmailChange}
              onBlur={() => setBlur((pre) => ({ ...pre, email: true }))}
              className={!validation.email && blur.email ? 'invalid-input' : ''}
              style={{direction:"ltr"}}
            />
          </div>

          <div id="account-submit1">
            {submit && (
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
                اطلاعات با موفقیت ثبت گردید
              </div>
            ) }
            
            {!submit && !showError &&(
              <div style={{ visibility: 'hidden' }}>
                <svg
                  width="16"
                  height="14"
                  viewBox="0 0 16 14"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14.7373 0L4.94741 11.1961L1.22585 6.93997L0 8.34191L4.94741 14L15.9631 1.40194L14.7373 0Z" />
                </svg>
                اطلاعات با موفقیت ثبت گردید
              </div>
            )}
            {
              showError &&
        <div className='submit-error'>
          <svg id="alert-icon3" width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 0C2.464 0 0 2.464 0 5.5C0 8.536 2.464 11 5.5 11C8.536 11 11 8.536 11 5.5C11 2.464 8.536 0 5.5 0ZM6.05 8.25H4.95V7.15H6.05V8.25ZM6.05 6.05H4.95V2.75H6.05V6.05Z" fill="#FF0000"/>
          </svg>

          <p>اطلاعات وارد شده معتبر نیست</p>
        </div>
            }

            {isLoadingButton? <button><LoadingButton dimension={10} stroke={2} color={'#fff'} /></button>
              :<input type="submit" value="تأیید" onClick={handleSubmit} />}
          </div>
        </form>
      </main>

      <NavigationBar selected={4} />
    </div>
  );
}

export default Account1;
