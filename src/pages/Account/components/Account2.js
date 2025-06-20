import Header from "../../../components/header/Header"
import NavigationBar from "../../../components/navigationBar/NavigationBar"
import { useState,useEffect } from "react"
import './Account2.css'
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

function Account2({accountData, setAccountData, setStep, setLoad, hasInformation}){
    const [submit,setSubmit] = useState(false)
    const todayJalali = new DateObject({ calendar: persian, locale: persian_fa });
    const [jalaliValue, setJalaliValue] = useState(null);

    const [validation, setValidation] = useState({
        first_name:true,
        last_name:true,
    })

    const [blur, setBlur] = useState({
        first_name:true,
        last_name:true,
    })

    const isPersian = (text) => {
  // Persian Unicode range: \u0600-\u06FF
  // Also includes Persian numbers \u06F0-\u06F9
  // And Arabic characters that might be used in Persian \u0621-\u064A
  const persianRegex = /^[\u0600-\u06FF\u0621-\u064A\s]+$/;
  return persianRegex.test(text);
};
    
    useEffect(()=>{
                document.documentElement.classList.add('account-container2-html')
                document.body.classList.add('account-container2-body')
        
                return ()=>{
                    document.documentElement.classList.remove('account-container2-html')
                    document.body.classList.remove('account-container2-body')
                }
            },[])

    const persian_fa_custom = {
  months: [
    ["فروردین", "فروردین"],
    ["اردیبهشت", "اردیبهشت"],
    ["خرداد", "خرداد"],
    ["تیر", "تیر"],
    ["مرداد", "مرداد"],
    ["شهریور", "شهریور"],
    ["مهر", "مهر"],
    ["آبان", "آبان"],
    ["آذر", "آذر"],
    ["دی", "دی"],
    ["بهمن", "بهمن"],
    ["اسفند", "اسفند"]
  ],
  weekDays: [
    ["شنبه", "شنبه"],
    ["یک‌شنبه", "یک"],
    ["دوشنبه", "دو"],
    ["سه‌شنبه", "سه"],
    ["چهارشنبه", "چهار"],
    ["پنج‌شنبه", "پنج"],
    ["جمعه", "جمعه"]
  ],
  digits: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
}
    useEffect(() => {
      if (accountData?.beneficiary_user_information?.birth_date) {
        const newDate = new DateObject({
          date: accountData.beneficiary_user_information.birth_date,
          calendar: "gregorian",
        }).convert(persian).setLocale(persian_fa);
    
        // Avoid unnecessary update that causes flicker
        if (
      !jalaliValue ||
      jalaliValue.year !== newDate.year ||
      jalaliValue.month.number !== newDate.month.number ||
      jalaliValue.day !== newDate.day
    ) {
      setJalaliValue(newDate);
    }
    
      }
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault()
        if(hasInformation && validation.first_name && validation.last_name){
            try {
          const response = await fetch(`http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/update-user-information/`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({first_name:accountData.beneficiary_user_information.first_name,
                last_name:accountData?.beneficiary_user_information?.last_name || null,
                birth_date:accountData?.beneficiary_user_information?.birth_date || null,
                gender:accountData?.beneficiary_user_information?.gender || null
            }),
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
        }else if (!hasInformation && validation.first_name && validation.last_name) {
            try {
          const response = await fetch(`http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/create-user-information/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({first_name:accountData.beneficiary_user_information.first_name,
                last_name:accountData?.beneficiary_user_information?.last_name || null,
                birth_date:accountData?.beneficiary_user_information?.birth_date || null,
                gender:accountData?.beneficiary_user_information?.gender || null
            }),
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
        }else {
            return
        }
    }
    return(
        <div className="account-container2">
            <Header />

            <main className="main">
            <section>
                <h1>
                با انتخاب هر یک از موارد زیر، می‌توانید با تکمیل بخش‌های خالی اقدام به اشتراک اطلاعات خود با خیریه کنید.
                </h1>
            </section>

            <nav className="nav-up">
                    <ul className="nav-list-up">
                    <li  onClick={() => setStep(1)} className="nav-item-up">
                        <a>اطلاعات حساب کاربری</a>
                    </li>
                    <li onClick={() => setStep(2)} className="nav-item-up" id="active-nav-up">
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

            <form action="" className="account-form2">
                <div>
                <label htmlFor="account-ident-num">کد ملی:</label>
                <input 
                    type="text" 
                    id="account-ident-num" 
                    readOnly 
                    value={accountData?.identification_number || ""} 
                />
                </div>

                <div>
                <label htmlFor="account-name">نام:</label>
                <input 
                    type="text" 
                    id="account-name"
                    value={accountData?.beneficiary_user_information?.first_name || ""}
                    onChange={(e) => {
                        setBlur(pre => ({...pre,first_name:false}))
                        setAccountData(pre => {
                        const newList = {...pre}
                        newList.beneficiary_user_information.first_name = e.target.value
                        return newList
                    })
                    
                        setValidation(pre => ({...pre,first_name:isPersian(e.target.value)}))
                    
                
                }
                }
                onBlur={() => setBlur(pre => ({...pre,first_name:true}))}
                />
                </div>

                <div>
                <label htmlFor="account-family">نام خانوادگی:</label>
                <input 
                    type="text" 
                    id="account-family"
                    value={accountData?.beneficiary_user_information?.last_name || ""} 
                    onChange={(e) => {
                        setBlur(pre => ({...pre,last_name:false}))
                        setAccountData(pre => {
                        const newList = {...pre}
                        newList.beneficiary_user_information.last_name = e.target.value
                        return newList
                    })
                    
                        setValidation(pre => ({...pre,last_name:isPersian(e.target.value)}))
                    
                
                }
                }
                onBlur={() => setBlur(pre => ({...pre,last_name:true}))}
                />
                </div>

                <div>
                <label htmlFor="account-bd">تاریخ تولد:</label>
                <DatePicker
                    value={jalaliValue}
                    onChange={(dateObj) => {
                      setJalaliValue(dateObj);
                      const gregorianDate = dateObj.toDate();
                      const isoDate = gregorianDate.toISOString().split("T")[0];
                      setAccountData(pre => {
                        const newData = {...pre}
                        newData.beneficiary_user_information.birth_date = isoDate
                        return newData
                      })
                    }}
                    calendar={persian}
                    locale={persian_fa_custom}
                    calendarPosition="bottom-center"
                    placeholder="مثال: ۱۳۲۲/۲/۲۲" 
                    inputClass="custom-datepicker-input"
                    id = "account-bd"
                    maxDate={todayJalali}
                  />
                {/* <input 
                    type="text" 
                    id="account-bd" 
                    readOnly 
                    placeholder="مثال: ۱۳۲۲/۲/۲۲" 
                /> */}
                </div>

                <div className="account-gender-div">
                <label htmlFor="account-gender">جنسیت:</label>
                <select id="account-gender" value={accountData.beneficiary_user_information.gender} onChange={e => {
                    setAccountData(pre => {
                        const newData = {...pre}
                        newData.beneficiary_user_information.gender = e.target.value
                        return newData
                    })
                }}>
                    <option value="" disabled>انتخاب کنید</option>
                    <option value="female">زن</option>
                    <option value="male">مرد</option>
                </select>
                </div>

                <div id="account-submit2">
                {submit ? 
                <div>
                    <svg
                    width="16"
                    height="14"
                    viewBox="0 0 16 14"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path d="M14.7373 0L4.94741 11.1961L1.22585 6.93997L0 8.34191L4.94741 14L15.9631 1.40194L14.7373 0Z"/>
                    </svg>
                    تغییرات با موفقیت اعمال شد
                </div>:
                <div style={{visibility:"hidden"}}>
                    <svg
                    width="16"
                    height="14"
                    viewBox="0 0 16 14"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path d="M14.7373 0L4.94741 11.1961L1.22585 6.93997L0 8.34191L4.94741 14L15.9631 1.40194L14.7373 0Z"/>
                    </svg>
                    تغییرات با موفقیت اعمال شد
                </div>
                }
                {(!validation.first_name ||!validation.last_name)  && blur.first_name && blur.last_name && (
                        <div className="error-message">  لطفا نام و نام خانوادگی خود را به فارسی وارد کنید</div>
                        )}
                <input type="submit" value="تأیید" onClick={handleSubmit} />
                </div>
            </form>
            </main>

            <NavigationBar selected={4}/>
        </div>
    )
}

export default Account2