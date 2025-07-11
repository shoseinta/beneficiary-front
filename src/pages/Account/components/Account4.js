import Header from "../../../components/header/Header";
import NavigationBar from "../../../components/navigationBar/NavigationBar";
import { useState,useEffect } from "react";
import './Account4.css';

function Account4 ({accountData,setAccountData,setStep,setLoad}) {
    useEffect(()=>{
                document.documentElement.classList.add('account-container4-html')
                document.body.classList.add('account-container4-body')
        
                return ()=>{
                    document.documentElement.classList.remove('account-container4-html')
                    document.body.classList.remove('account-container4-body')
                }
            },[])
    return(
        <div className="account-container4">
            <Header />

        <main className="main">

        <section>
          <h1>
            با انتخاب هر یک از موارد زیر، می‌توانید با تکمیل بخش‌های خالی اقدام به اشتراک اطلاعات خود با خیریه کنید.
          </h1>
        </section>

        <nav className="nav-up">
          <ul className="nav-list-up">

            <li className="nav-item-up" onClick={() => setStep(1)}>
              <a>   اطلاعات حساب کاربری  </a>
            </li>

            <li className="nav-item-up" onClick={() => setStep(2)}>
              <a>  اطلاعات شخصی کاربر  </a>
            </li>

            <li className="nav-item-up" onClick={() => setStep(3)}>
              <a>  اطلاعات آدرس کاربر  </a>
            </li>

            <li className="nav-item-up" id="active-nav-up" onClick={() => setStep(4)}>
              <a>  اطلاعات تکمیلی کاربر </a>
            </li>
          </ul>
        </nav>

        <div className="additional-info-container">

          <div className="additional-info">

            <p>با افزودن اطلاعات بستگان خود، می‌توانید در بخش ثبت درخواست برای آنها درخواست ایجاد کنید:</p>

            <div className="additional-info-box">
              
            {accountData?.beneficiary_user_family_info && accountData?.beneficiary_user_family_info.length !== 0 ?
              accountData.beneficiary_user_family_info.map((item) => {
                return(
             <div className="additional-info-value" key={item.beneficiary_user_family_info_id}> {item.beneficiary_user_family_info_first_name} {item.beneficiary_user_family_info_last_name}
                <button title="حذف"><svg width="30" height="30" viewBox="0 0 30 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M29.2929 3.72853C29.6834 3.33801 29.6834 2.70485 29.2929 2.31432L27.6857 0.707107C27.2952 0.316583 26.662 0.316583 26.2715 0.707107L15.7071 11.2715C15.3166 11.662 14.6834 11.662 14.2929 11.2715L3.72853 0.707106C3.33801 0.316582 2.70485 0.316582 2.31432 0.707107L0.707107 2.31432C0.316583 2.70485 0.316583 3.33801 0.707107 3.72853L11.2715 14.2929C11.662 14.6834 11.662 15.3166 11.2715 15.7071L0.707106 26.2715C0.316582 26.662 0.316582 27.2952 0.707107 27.6857L2.31432 29.2929C2.70485 29.6834 3.33801 29.6834 3.72853 29.2929L14.2929 18.7285C14.6834 18.338 15.3166 18.338 15.7071 18.7285L26.2715 29.2929C26.662 29.6834 27.2952 29.6834 27.6857 29.2929L29.2929 27.6857C29.6834 27.2952 29.6834 26.662 29.2929 26.2715L18.7285 15.7071C18.338 15.3166 18.338 14.6834 18.7285 14.2929L29.2929 3.72853Z"/>
                </svg></button>
              </div>
                )
              }): null
            }
            </div>

            <div className="additional-info-button-container">
              <button type="button" class="additional-info-button">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z"/>
                </svg>
                افزودن
              </button>
            </div>
          </div>

          <div className="additional-info">
            <p>با افزودن اطلاعات تکمیلی خود (مانند معلولیت، وضعیت اشتغال و...) می‌توانید به ما در جهت خدمت‌رسانی بهتر کمک کنید:</p>

            <div className="additional-info-box">
            {accountData?.beneficiary_user_additional_info && accountData?.beneficiary_user_additional_info.length !== 0 ?
              accountData.beneficiary_user_additional_info.map((item) => {
                return(
             <div className="additional-info-value" key={item.beneficiary_user_additional_info_id}> {item.beneficiary_user_additional_info_title}
                <button title="حذف"><svg width="30" height="30" viewBox="0 0 30 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M29.2929 3.72853C29.6834 3.33801 29.6834 2.70485 29.2929 2.31432L27.6857 0.707107C27.2952 0.316583 26.662 0.316583 26.2715 0.707107L15.7071 11.2715C15.3166 11.662 14.6834 11.662 14.2929 11.2715L3.72853 0.707106C3.33801 0.316582 2.70485 0.316582 2.31432 0.707107L0.707107 2.31432C0.316583 2.70485 0.316583 3.33801 0.707107 3.72853L11.2715 14.2929C11.662 14.6834 11.662 15.3166 11.2715 15.7071L0.707106 26.2715C0.316582 26.662 0.316582 27.2952 0.707107 27.6857L2.31432 29.2929C2.70485 29.6834 3.33801 29.6834 3.72853 29.2929L14.2929 18.7285C14.6834 18.338 15.3166 18.338 15.7071 18.7285L26.2715 29.2929C26.662 29.6834 27.2952 29.6834 27.6857 29.2929L29.2929 27.6857C29.6834 27.2952 29.6834 26.662 29.2929 26.2715L18.7285 15.7071C18.338 15.3166 18.338 14.6834 18.7285 14.2929L29.2929 3.72853Z"/>
                </svg></button>
              </div>
                )
              }): null
            }
            </div>
            <div className="additional-info-button-container">
              <button type="button" class="additional-info-button">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z"/>
                </svg>
                افزودن
              </button>
            </div>
             
          </div>
         

        </div>

    </main>

            <NavigationBar />

        </div>
    )
}

export default Account4;