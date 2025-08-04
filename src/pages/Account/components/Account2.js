import Header from '../../../components/header/Header';
import NavigationBar from '../../../components/navigationBar/NavigationBar';
import { useState, useEffect } from 'react';
import './Account2.css';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import DateObject from 'react-date-object';
import LoadingButton from '../../../components/loadingButton/LoadingButton';

function Account2({
  accountData,
  setAccountData,
  setStep,
  setLoad,
  hasInformation,
}) {
  const [dateSelected, setDateSelected] = useState(false);
 useEffect(() => {
  if (!dateSelected) return;
  const timeout = setTimeout(() => {
    const leftArrow = document.querySelector('.rmdp-left i');
    const rightArrow = document.querySelector('.rmdp-right i');
    // const disables = document.querySelectorAll('.rmdp-day.rmdp-disabled');
    // if(disables.length > 0) {
    //   disables.forEach((item) => {
    //     item.parentElement.removeChild(item);
    //   });
    // }
    const week = document.querySelector('.rmdp-week')
    if (week) {
      week.querySelectorAll('.rmdp-week-day').forEach((item) => {
        item.style.textAlign = 'center';
      })
    }
    const spans = document.querySelectorAll('.rmdp-day span');
    if (spans.length > 0) {
      spans.forEach((item) => {
        item.style.position = 'relative';
        item.style.top = '0';
        item.style.left = '0';
        item.style.right = '0';
      });
    }
    // const arrows = document.querySelectorAll('.rmdp-arrow');
    // if (arrows.length > 0) {
    //   arrows.forEach((item) => {
    //     item.style.margin = '0';
    //   });
    // }
    // const leftArrowI = document.querySelector('.rmdp-left i');
    // const rightArrowI = document.querySelector('.rmdp-right i');
    // if (leftArrowI) leftArrowI.style.margin = '0';
    if (leftArrow) leftArrow.style.webkitTransform = 'rotate(-45deg)';
    // if (rightArrowI) rightArrowI.style.margin = '0';
    if (rightArrow) rightArrow.style.webkitTransform = 'rotate(135deg)';

    const header = document.querySelector('.rmdp-header-values');
    if (header) {
      const spanMonth = document.querySelectorAll('.rmdp-header-values span')[0];
      const spanYear = document.querySelectorAll('.rmdp-header-values span')[1];
      if (spanMonth) {
        spanMonth.style.paddingLeft = '15px';
        spanMonth.addEventListener('click', () => {
          setTimeout(() => {
            const months = document.querySelectorAll('.rmdp-ym .rmdp-day span')
            months.forEach((month) => {
              month.style.width = '60px';
            month.style.height = 'auto';
            month.style.borderRadius = '12px';
            })
            
          },50)
        })
      }
      if (spanYear) {
        spanYear.style.paddingRight = '15px';
        spanYear.addEventListener('click', () => {
          setTimeout(() => {
            const months = document.querySelectorAll('.rmdp-ym .rmdp-day span')
            months.forEach((month) => {
              month.style.width = '60px';
            month.style.height = 'auto';
            month.style.borderRadius = '12px';
            })
          },50)
        })
      }
    }
  }, 50); // wait a bit for DOM

  return () => clearTimeout(timeout);
}, [dateSelected]);
  const [account1Data, setAccount1Data] = useState(accountData);
  const [submit, setSubmit] = useState(false);
  const todayJalali = new DateObject({ calendar: persian, locale: persian_fa });
  const [jalaliValue, setJalaliValue] = useState(null);
  useEffect(() => {
    setDateSelected(false);
  },[jalaliValue])
  const [isLoadingButton, setIsLoadingButton] = useState(false)
  useEffect(() => {
    setAccount1Data(accountData);
  }, [accountData]);

  const [validation, setValidation] = useState({
    first_name: true,
    last_name: true,
  });

  const [blur, setBlur] = useState({
    first_name: true,
    last_name: true,
  });
  const toPersianDigits = (num) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, (d) => persianDigits[d]);
  };
  const isPersian = (text) => {
    // Persian Unicode range: \u0600-\u06FF
    // Also includes Persian numbers \u06F0-\u06F9
    // And Arabic characters that might be used in Persian \u0621-\u064A
    const persianRegex = /^[\u0600-\u06FF\u0621-\u064A\s]+$/;
    return persianRegex.test(text);
  };

  useEffect(() => {
    document.documentElement.classList.add('account-container2-html');
    document.body.classList.add('account-container2-body');

    return () => {
      document.documentElement.classList.remove('account-container2-html');
      document.body.classList.remove('account-container2-body');
    };
  }, []);

  const persian_fa_custom = {
    months: [
      ['فروردین', 'فروردین'],
      ['اردیبهشت', 'اردیبهشت'],
      ['خرداد', 'خرداد'],
      ['تیر', 'تیر'],
      ['مرداد', 'مرداد'],
      ['شهریور', 'شهریور'],
      ['مهر', 'مهر'],
      ['آبان', 'آبان'],
      ['آذر', 'آذر'],
      ['دی', 'دی'],
      ['بهمن', 'بهمن'],
      ['اسفند', 'اسفند'],
    ],
    weekDays: [
      ['شنبه', 'شنبه'],
      ['یک‌شنبه', 'یک'],
      ['دوشنبه', 'دو'],
      ['سه‌شنبه', 'سه'],
      ['چهارشنبه', 'چهار'],
      ['پنج‌شنبه', 'پنج'],
      ['جمعه', 'جمعه'],
    ],
    digits: ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'],
  };
  useEffect(() => {
    if (account1Data?.beneficiary_user_information?.birth_date) {
      const newDate = new DateObject({
        date: account1Data.beneficiary_user_information.birth_date,
        calendar: 'gregorian',
      })
        .convert(persian)
        .setLocale(persian_fa);

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
    e.preventDefault();
    if (
      hasInformation &&
      (validation.first_name ||
        account1Data?.beneficiary_user_information?.first_name === '') &&
      (validation.last_name ||
        account1Data?.beneficiary_user_information?.last_name === '')
    ) {
      setIsLoadingButton(true)
      try {
        const response = await fetch(
          `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/update-user-information/`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({
              first_name:
                account1Data?.beneficiary_user_information?.first_name || null,
              last_name:
                account1Data?.beneficiary_user_information?.last_name || null,
              birth_date:
                account1Data?.beneficiary_user_information?.birth_date || null,
              gender:
                account1Data?.beneficiary_user_information?.gender || null,
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
    } else if (
      !hasInformation &&
      (validation.first_name ||
        account1Data?.beneficiary_user_information?.first_name === '') &&
      (validation.last_name ||
        account1Data?.beneficiary_user_information?.last_name === '')
    ) {
      setIsLoadingButton(true)
      try {
        const response = await fetch(
          `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/create-user-information/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({
              first_name:
                account1Data?.beneficiary_user_information?.first_name || null,
              last_name:
                account1Data?.beneficiary_user_information?.last_name || null,
              birth_date:
                account1Data?.beneficiary_user_information?.birth_date || null,
              gender:
                account1Data?.beneficiary_user_information?.gender || null,
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
      return;
    }
  };
  return (
    <div className="account-container2">
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
            <li onClick={() => setStep(1)} className="nav-item-up">
              <a style={{color:"#000"}}>اطلاعات حساب کاربری</a>
            </li>
            <li
              onClick={() => setStep(2)}
              className="nav-item-up"
              id="active-nav-up"
            >
              <a style={{color:"#fff"}}>اطلاعات شخصی کاربر</a>
            </li>
            <li onClick={() => setStep(3)} className="nav-item-up">
              <a style={{color:"#000"}}>اطلاعات آدرس کاربر</a>
            </li>
            <li onClick={() => setStep(4)} className="nav-item-up">
              <a style={{color:"#000"}}>اطلاعات تکمیلی کاربر</a>
            </li>
          </ul>
        </nav>

        <form action="" className="account-form2">
          <div>
            <label htmlFor="account-ident-num">کد ملی:</label>
            <div className="input-icon-wrapper">
              <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.625 5.16667H8.9375V3.83333C8.9375 1.99333 7.3975 0.5 5.5 0.5C3.6025 0.5 2.0625 1.99333 2.0625 3.83333V5.16667H1.375C0.61875 5.16667 0 5.76667 0 6.5V13.1667C0 13.9 0.61875 14.5 1.375 14.5H9.625C10.3813 14.5 11 13.9 11 13.1667V6.5C11 5.76667 10.3813 5.16667 9.625 5.16667ZM3.4375 3.83333C3.4375 2.72667 4.35875 1.83333 5.5 1.83333C6.64125 1.83333 7.5625 2.72667 7.5625 3.83333V5.16667H3.4375V3.83333ZM9.625 13.1667H1.375V6.5H9.625V13.1667ZM5.5 11.1667C6.25625 11.1667 6.875 10.5667 6.875 9.83333C6.875 9.1 6.25625 8.5 5.5 8.5C4.74375 8.5 4.125 9.1 4.125 9.83333C4.125 10.5667 4.74375 11.1667 5.5 11.1667Z" fill="black"/>
              </svg>
              <input
                type="text"
                id="account-ident-num"
                readOnly
                value={toPersianDigits(account1Data?.identification_number || '')}
              />
            </div>
          </div>

          <div>
            <label htmlFor="account-name">نام:</label>
            <input
              type="text"
              id="account-name"
              value={
                account1Data?.beneficiary_user_information?.first_name || ''
              }
              onChange={(e) => {
                setBlur((pre) => ({ ...pre, first_name: false }));
                if (!isPersian(e.target.value)) {
                  setValidation((pre) => ({ ...pre, first_name: false }));
                } else {
                  setValidation((pre) => ({ ...pre, first_name: true }));
                }
                setAccount1Data((pre) => ({
                  ...pre,
                  beneficiary_user_information: {
                    ...pre.beneficiary_user_information,
                    first_name: e.target.value,
                  },
                }));

                setValidation((pre) => ({
                  ...pre,
                  first_name: isPersian(e.target.value),
                }));
              }}
              onBlur={() => setBlur((pre) => ({ ...pre, first_name: true }))}
            />
          </div>

          <div>
            <label htmlFor="account-family">نام خانوادگی:</label>
            <input
              type="text"
              id="account-family"
              value={
                account1Data?.beneficiary_user_information?.last_name || ''
              }
              onChange={(e) => {
                setBlur((pre) => ({ ...pre, last_name: false }));
                if (!isPersian(e.target.value)) {
                  setValidation((pre) => ({ ...pre, last_name: false }));
                } else {
                  setValidation((pre) => ({ ...pre, last_name: true }));
                }
                setAccount1Data((pre) => ({
                  ...pre,
                  beneficiary_user_information: {
                    ...pre.beneficiary_user_information,
                    last_name: e.target.value,
                  },
                }));
              }}
              onBlur={() => setBlur((pre) => ({ ...pre, last_name: true }))}
            />
          </div>

          <div>
            <label htmlFor="account-bd">تاریخ تولد:</label>
            <DatePicker
              value={jalaliValue}
              onChange={(dateObj) => {
                setJalaliValue(dateObj);
                const gregorianDate = dateObj.toDate();
                const isoDate = gregorianDate.toISOString().split('T')[0];
                setAccount1Data((pre) => ({
                  ...pre,
                  beneficiary_user_information: {
                    ...pre.beneficiary_user_information,
                    birth_date: isoDate,
                  },
                }));
              }}
              calendar={persian}
              locale={persian_fa_custom}
              calendarPosition="bottom-center"
              placeholder="مثال: ۱۳۲۲/۲/۲۲"
              inputClass="custom-datepicker-input"
              id="account-bd"
              maxDate={todayJalali}
              onOpenPickNewDate={false}
              onOpen={() => setDateSelected(true)}
                          onClose={() => setDateSelected(false)}
                          onFocusedDateChange={() => setDateSelected(true)}
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
            <select
              id="account-gender"
              value={account1Data?.beneficiary_user_information?.gender || ''}
              onChange={(e) => {
                setAccount1Data((pre) => ({
                  ...pre,
                  beneficiary_user_information: {
                    ...pre.beneficiary_user_information,
                    gender: e.target.value,
                  },
                }));
              }}
            >
              <option value="" disabled>
                انتخاب کنید
              </option>
              <option value="female">زن</option>
              <option value="male">مرد</option>
            </select>
          </div>

          <div id="account-submit2">
            {submit ? (
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
            ) : (
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
            {((!validation.first_name &&
              blur.first_name &&
              account1Data?.beneficiary_user_information?.first_name !== '' &&
              account1Data?.beneficiary_user_information?.first_name !==
                null) ||
              (!validation.last_name &&
                blur.last_name &&
                account1Data?.beneficiary_user_information?.last_name !== '' &&
                account1Data?.beneficiary_user_information?.last_name !==
                  null)) && (
              <div> لطفا نام و نام خانوادگی خود را به فارسی وارد کنید</div>
            )}
            {isLoadingButton? <button><LoadingButton dimension={10} stroke={2} color={'#fff'} /></button>
              :<input type="submit" value="تأیید" onClick={handleSubmit} />}
          </div>
        </form>
      </main>

      <NavigationBar selected={4} />
    </div>
  );
}

export default Account2;
