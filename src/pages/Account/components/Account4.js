import Header from "../../../components/header/Header";
import NavigationBar from "../../../components/navigationBar/NavigationBar";
import { useState,useEffect } from "react";
import './Account4.css';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import attach_icon from '../../../media/icons/attach_icon.svg';
import JSZip from "jszip";

function Account4 ({accountData,setAccountData,setStep,setLoad}) {
    useEffect(()=>{
                document.documentElement.classList.add('account-container4-html')
                document.body.classList.add('account-container4-body')
        
                return ()=>{
                    document.documentElement.classList.remove('account-container4-html')
                    document.body.classList.remove('account-container4-body')
                }
            },[])

    
    const [addFamily, setAddFamily] = useState(false)
    const [addAdditional, setAddAdditional] = useState(false)
    const [removeFamily,setRemoveFamily] = useState(false)
    const [removeAdditional,setRemoveAdditional] = useState(false)
    const [familyIndex, setFamilyIndex] = useState(null)
    const [additionalIndex, setAdditionalIndex] = useState(null)

    const [familyData, setFamilyData] = useState(
      {
    beneficiary_user_family_info_family_relation: null,
    beneficiary_user_family_info_identification_number: null,
    beneficiary_user_family_info_first_name: null,
    beneficiary_user_family_info_last_name: null,
    beneficiary_user_family_info_birth_date: null,
    beneficiary_user_family_info_gender: null
}
    )

    const [additionalData, setAdditionalData] = useState({
    beneficiary_user_additional_info_title: null,
    beneficiary_user_additional_info_description: null,
    beneficiary_user_additional_info_document: null
})

    useEffect(() => {
      console.log(additionalData)
    })
    const [files,setFiles] = useState([])
    const handleFileChange = async (e) => {
            const selectedFiles = Array.from(e.target.files);
            setFiles(pre => {
              return [...pre,...selectedFiles]
            });
            
            if (selectedFiles.length > 0) {
                try {
                    const zip = new JSZip();
                    
                    // Add each file to the zip
                    files.forEach((file, index) => {
                        zip.file(file.name, file);
                    });
                    
                    // Generate the zip file
                    const zipContent = await zip.generateAsync({ type: "blob" });
                    
                    // Create a File object from the zip blob
                    const zipFile = new File([zipContent], `beneficiary_${localStorage.getItem('user_id')}_additional_info.zip`, {
                        type: "application/zip"
                    });
                    
                    // Update requestData with the zip file
                    setAdditionalData(pre => {
                      return {...pre,beneficiary_user_additional_info_document:zipFile}
                    })
                    
                } catch (error) {
                    console.error("Error creating zip file:", error);
                }
            } 
        };

    const [jalaliValue, setJalaliValue] = useState(null);
        const todayJalali = new DateObject({ calendar: persian, locale: persian_fa });
    
    
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
      if(removeFamily || removeAdditional || addFamily || addAdditional){
        document.documentElement.classList.add('family-delete-overlay-body')
        document.body.classList.add('family-delete-overlay-body')
      }else {
        document.documentElement.classList.remove('family-delete-overlay-body')
        document.body.classList.remove('family-delete-overlay-body')
      }
    },[removeFamily,removeAdditional,addFamily,addAdditional])

    const handleFamilyDelete = async(index) => {
      try {
          const response = await fetch(`http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/delete-user-family/${accountData.beneficiary_user_family_info[index].beneficiary_user_family_info_id}/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('access_token')}`,
            },
          });
          if (!response.ok) {  // Check for HTTP errors (4xx/5xx)
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
          }
          setAccountData((pre) => {
            const data = {...pre}
            const newFamily = data.beneficiary_user_family_info.filter((item,idx) => {
              return idx !== index
            })
            data.beneficiary_user_family_info = newFamily
            return data
          })
          setRemoveFamily(false)

        } catch (err) {
          console.log(err)
        }
    }

    const handleAdditionalDelete = async(index) => {
      try {
          const response = await fetch(`http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/update-user-additional-info/${accountData.beneficiary_user_additional_info[index].beneficiary_user_additional_info_id}/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('access_token')}`,
            },
          });
          if (!response.ok) {  // Check for HTTP errors (4xx/5xx)
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
          }
          setAccountData((pre) => {
            const data = {...pre}
            const newFamily = data.beneficiary_user_additional_info.filter((item,idx) => {
              return idx !== index
            })
            data.beneficiary_user_additional_info = newFamily
            return data
          })
          setRemoveAdditional(false)

        } catch (err) {
          console.log(err)
        }
    }

    const handleAddFamily = async (e) => {
      e.preventDefault()
      try {
          const response = await fetch(`http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/create-user-family/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify(familyData)
          });
          if (!response.ok) {  // Check for HTTP errors (4xx/5xx)
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
          }
          setLoad(true)
          setFamilyData({
    beneficiary_user_family_info_family_relation: null,
    beneficiary_user_family_info_identification_number: null,
    beneficiary_user_family_info_first_name: null,
    beneficiary_user_family_info_last_name: null,
    beneficiary_user_family_info_birth_date: null,
    beneficiary_user_family_info_gender: null
})
        setTimeout(() => setAddFamily(false),3000)

        } catch (err) {
          console.log(err)
        }
    }

    const handleAddAdditional = async (e) => {
      e.preventDefault()
      try {
          const formData = new FormData();
          formData.append("beneficiary_user_additional_info_title", additionalData.beneficiary_user_additional_info_title)
          formData.append("beneficiary_user_additional_info_description",additionalData.beneficiary_user_additional_info_description)
          formData.append("beneficiary_user_additional_info_document",additionalData.beneficiary_user_additional_info_document)
          const response = await fetch(`http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/create-user-additional-info/`, {
            method: 'POST',
            headers: {
              // 'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('access_token')}`,
            },
            body: formData
          });
          if (!response.ok) {  // Check for HTTP errors (4xx/5xx)
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
          }
          setLoad(true)
          setAdditionalData(
            {
    beneficiary_user_additional_info_title: null,
    beneficiary_user_additional_info_description: null,
    beneficiary_user_additional_info_document: null
}
          )
        setTimeout(() => setAddAdditional(false),3000)

        } catch (err) {
          console.log(err)
        }
    }
    return(
      <>
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
              accountData.beneficiary_user_family_info.map((item,index) => {
                return(
             <div className="additional-info-value" key={item.beneficiary_user_family_info_id}> {item.beneficiary_user_family_info_first_name} {item.beneficiary_user_family_info_last_name}
                <button title="حذف" onClick={() => {
                  setRemoveFamily(true)
                  setFamilyIndex(index)
                }
                  }><svg width="30" height="30" viewBox="0 0 30 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M29.2929 3.72853C29.6834 3.33801 29.6834 2.70485 29.2929 2.31432L27.6857 0.707107C27.2952 0.316583 26.662 0.316583 26.2715 0.707107L15.7071 11.2715C15.3166 11.662 14.6834 11.662 14.2929 11.2715L3.72853 0.707106C3.33801 0.316582 2.70485 0.316582 2.31432 0.707107L0.707107 2.31432C0.316583 2.70485 0.316583 3.33801 0.707107 3.72853L11.2715 14.2929C11.662 14.6834 11.662 15.3166 11.2715 15.7071L0.707106 26.2715C0.316582 26.662 0.316582 27.2952 0.707107 27.6857L2.31432 29.2929C2.70485 29.6834 3.33801 29.6834 3.72853 29.2929L14.2929 18.7285C14.6834 18.338 15.3166 18.338 15.7071 18.7285L26.2715 29.2929C26.662 29.6834 27.2952 29.6834 27.6857 29.2929L29.2929 27.6857C29.6834 27.2952 29.6834 26.662 29.2929 26.2715L18.7285 15.7071C18.338 15.3166 18.338 14.6834 18.7285 14.2929L29.2929 3.72853Z"/>
                </svg></button>
              </div>
                )
              }): null
            }
            </div>

            <div className="additional-info-button-container">
              <button type="button" class="additional-info-button" onClick={() => setAddFamily(true)}>
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
              accountData.beneficiary_user_additional_info.map((item,index) => {
                return(
             <div className="additional-info-value" key={item.beneficiary_user_additional_info_id}> {item.beneficiary_user_additional_info_title}
                <button title="حذف" onClick={() => {
                  setRemoveAdditional(true)
                  setAdditionalIndex(index)
                  }}><svg width="30" height="30" viewBox="0 0 30 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M29.2929 3.72853C29.6834 3.33801 29.6834 2.70485 29.2929 2.31432L27.6857 0.707107C27.2952 0.316583 26.662 0.316583 26.2715 0.707107L15.7071 11.2715C15.3166 11.662 14.6834 11.662 14.2929 11.2715L3.72853 0.707106C3.33801 0.316582 2.70485 0.316582 2.31432 0.707107L0.707107 2.31432C0.316583 2.70485 0.316583 3.33801 0.707107 3.72853L11.2715 14.2929C11.662 14.6834 11.662 15.3166 11.2715 15.7071L0.707106 26.2715C0.316582 26.662 0.316582 27.2952 0.707107 27.6857L2.31432 29.2929C2.70485 29.6834 3.33801 29.6834 3.72853 29.2929L14.2929 18.7285C14.6834 18.338 15.3166 18.338 15.7071 18.7285L26.2715 29.2929C26.662 29.6834 27.2952 29.6834 27.6857 29.2929L29.2929 27.6857C29.6834 27.2952 29.6834 26.662 29.2929 26.2715L18.7285 15.7071C18.338 15.3166 18.338 14.6834 18.7285 14.2929L29.2929 3.72853Z"/>
                </svg></button>
              </div>
                )
              }): null
            }
            </div>
            <div className="additional-info-button-container">
              <button type="button" class="additional-info-button" onClick={() => setAddAdditional(true)}>
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
    {
      removeFamily && 
      <>
      <div className="family-block-overlay-container"></div>
      <div className="family-delete-overlay-container">
        <p>آیا از حذف این مورد اطمینان دارید؟</p>
        <div className="family-delete-overlay-buttons">
          <button className="family-no-button" onClick={() => setRemoveFamily(false)}>خیر</button>
          <button className="family-yes-button" onClick={() => handleFamilyDelete(familyIndex)}>بلی</button>
        </div>
      </div>
      </>
    }

    {
      removeAdditional && 
      <>
      <div className="family-block-overlay-container"></div>
      <div className="family-delete-overlay-container">
        <p>آیا از حذف این مورد اطمینان دارید؟</p>
        <div className="family-delete-overlay-buttons">
          <button className="family-no-button" onClick={() => setRemoveAdditional(false)}>خیر</button>
          <button className="family-yes-button" onClick={() => handleAdditionalDelete(additionalIndex)}>بلی</button>
        </div>
      </div>
      </>
    }

    {
      addFamily && 
      <>
      <div className="family-block-overlay-container"></div>
      <div class="family-overlay-container">
    <form action="">
      <div>
        <label htmlFor="family-relation">نسبت فامیلی:<sup>*</sup></label>
        <select id="family-relation" value={familyData.beneficiary_user_family_info_family_relation} onChange={(e) => {
          setFamilyData(pre => {
            return {...pre, beneficiary_user_family_info_family_relation:e.target.value}
          })
        }}>
          <option value="">انتخاب کنید</option>
          <option value="child">فرزند</option>
          <option value="partner">همسر</option>
        </select>
      </div>

      <div>
      <label htmlFor="family-ident-num">کد ملی:<sup>*</sup></label>
      <input type="number" id="family-ident-num" inputMode="numeric"  value={familyData.beneficiary_user_family_info_identification_number}
      onChange={(e) => {
        setFamilyData(pre => {
          return {...pre, beneficiary_user_family_info_identification_number:Number(e.target.value)}
        })
      }}
      />
      </div>

      <div>
      <label htmlFor="family-fn">نام:</label>
      <input type="text" id="family-fn" value={familyData.beneficiary_user_family_info_first_name} onChange={e => {
        setFamilyData(pre => {
          return {...pre, beneficiary_user_family_info_first_name:e.target.value}
        })
      }}/>
      </div>

      <div>
      <label htmlFor="family-ln">نام خانوادگی:</label>
      <input type="text" id="family-ln" value={familyData.beneficiary_user_family_info_last_name} onChange={e => {
        setFamilyData(pre => {
          return {...pre, beneficiary_user_family_info_last_name:e.target.value}
        })
      }}/>
      </div>

      <div>
      <label htmlFor="family-bd">تاریخ تولد:</label>
      <DatePicker
          value={jalaliValue}
          onChange={(dateObj) => {
            setJalaliValue(dateObj);
            const gregorianDate = dateObj.toDate();
            const isoDate = gregorianDate.toISOString().split("T")[0];
            setFamilyData(prev => ({
              ...prev,
              beneficiary_user_family_info_birth_date: isoDate,
            }));
          }}
          calendar={persian}
          locale={persian_fa_custom}
          calendarPosition="bottom-center"
          placeholder="تاریخ را انتخاب کنید"
          inputClass="custom-datepicker-input"
          maxDate={todayJalali}
        />
      </div>

      <div>
        <label htmlFor="family-gender"> جنسیت: </label>
        <select id="family-gender" value={familyData.beneficiary_user_family_info_gender} onChange={e => {
          setFamilyData(pre => {
            return {...pre, beneficiary_user_family_info_gender:e.target.value}
          })
        }}>
          <option value="" >انتخاب کنید</option>
          <option value="female">زن</option>
          <option value="male">مرد</option>
        </select>
      </div>

      <div className="family-overlay-buttons">
        <button type="button" class="no-button" onClick={() => setAddFamily(false)}>لغو</button>
        <button type="submit" class="yes-button" onClick={handleAddFamily}>تأیید</button>
      </div>

    </form>

    
   </div>
      </>
    }

    {
      addAdditional && 
      <>
      <div className="family-block-overlay-container"></div>
      <div className="additional-info-overlay-container">
      <form>
        <div>
        <label htmlFor="additional-info-title">عنوان:<sup>*</sup></label>
        <input type="text" id="additional-info-title" value={additionalData.beneficiary_user_additional_info_title} onChange={e => {
          setAdditionalData(pre => {
            return {...pre, beneficiary_user_additional_info_title:e.target.value}
          })
        }}/>
        </div>

        <div>
        <label htmlFor="additional-info-description">توضیحات:</label>
        <textarea id="additional-info-description" value={additionalData.beneficiary_user_additional_info_description} onChange={e => {
          setAdditionalData(pre => {
            return {...pre, beneficiary_user_additional_info_description:e.target.value}
          })
        }}></textarea>
        </div>

        <div>
        <label htmlFor="additional-info-document">مستندات:</label>
        <input type="file" id="additional-info-document" multiple hidden onChange={handleFileChange}/>
        <label htmlFor="additional-info-document" className="upload-label"><img src={attach_icon} alt="" />برای انتخاب فایل کلیک کنید </label>
        </div>

      </form>

      <div className="additional-info-overlay-buttons">
        <button className="no-button" onClick={() => setAddAdditional(false)}>لغو</button>
        <button className="yes-button" onClick={handleAddAdditional}>تأیید</button>
      </div>
    </div>
      </>
    }
    </>
    )
}

export default Account4;