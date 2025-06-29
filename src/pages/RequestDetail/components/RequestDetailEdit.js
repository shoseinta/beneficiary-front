import Header from "../../../components/header/Header";
import NavigationBar from "../../../components/navigationBar/NavigationBar";
import back_icon from '../../../media/icons/back_icon.svg'
import confirm_icon from '../../../media/icons/confirm_icon.svg'
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import { useState,useEffect } from "react";


function RequestDetailEdit ({isEdit, setIsEdit, updateData, setUpdateData, requestData, setRequestData, fetchData, id, convertTypeLayer1, convertStage, formatPersianNumber}) {

    const todayJalali = new DateObject({ calendar: persian, locale: persian_fa });
    const [jalaliValue, setJalaliValue] = useState(null);

    const [editApplied, setEditApplied] = useState(false);

    const [validation, setValidation] = useState({
        deadline:true,
        limit:true
    })

    const [blur, setBlur] = useState({
        deadline:true,
        limit:true,
    })
    const [finishEdit, setFinishEdit] = useState(false)
    useEffect(() => {
        if(updateData.beneficiary_request_duration === 1 && updateData?.beneficiary_request_duration_onetime?.beneficiary_request_duration_onetime_deadline){
            setValidation(pre => ({...pre,deadline:true}))
        }else {
            setValidation(pre => ({...pre,deadline:false}))
        }

        if(updateData.beneficiary_request_duration === 2 && updateData?.beneficiary_request_duration_recurring?.beneficiary_request_duration_recurring_limit !== "" && updateData?.beneficiary_request_duration_recurring?.beneficiary_request_duration_recurring_limit >= 1 && updateData?.beneficiary_request_duration_recurring?.beneficiary_request_duration_recurring_limit <= 12){
            setValidation(pre => ({...pre,limit:true}))
        }else {
            setValidation(pre => ({...pre,limit:false}))
        }
    },[updateData])
    
    useEffect(()=>{
        fetchData();
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

    const toPersianDigits = (num) => {
    if(num){
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, (d) => persianDigits[d]);
    } else {
        return null
    }
  };

  // Function to convert Gregorian to Jalali date
  const gregorianToJalali = (dateString) => {
    if (!dateString) return "تاریخ نامشخص";
    
    try {
      // Extract YYYY-MM-DD part from ISO string
      const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
      
      // Simple conversion algorithm (approximate)
      const gregorianYear = year;
      const gregorianMonth = month;
      const gregorianDay = day;
      
      let jalaliYear, jalaliMonth, jalaliDay;
      
      if (gregorianMonth > 2 || (gregorianMonth === 2 && gregorianDay > 20)) {
        jalaliYear = gregorianYear - 621;
      } else {
        jalaliYear = gregorianYear - 622;
      }
      
      // Simple month/day conversion (not precise for all dates)
      if (gregorianMonth < 3) {
        jalaliMonth = gregorianMonth + 9;
        jalaliDay = gregorianDay + 10;
        if (jalaliDay > 30) {
          jalaliDay -= 30;
          jalaliMonth++;
        }
      } else {
        jalaliMonth = gregorianMonth - 3;
        jalaliDay = gregorianDay + 10;
        if (jalaliDay > 31) {
          jalaliDay -= 31;
          jalaliMonth++;
        }
      }
      
      // Format with Persian digits
      return `${toPersianDigits(jalaliYear)}/${toPersianDigits(jalaliMonth)}/${toPersianDigits(jalaliDay)}`;
    } catch (error) {
      console.error("Date conversion error:", error);
      return "تاریخ نامشخص";
    }
  };

    useEffect(() => {
        console.log(updateData)
    })

    useEffect(() => {
      if (updateData?.beneficiary_request_duration_onetime?.beneficiary_request_duration_onetime_deadline) {
        const newDate = new DateObject({
          date: updateData.beneficiary_request_duration_onetime.beneficiary_request_duration_onetime_deadline,
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
    }, [updateData.beneficiary_request_duration_onetime]);

    const handleFinishEdit = async () => {
        if((updateData?.beneficiary_request_duration === 1 && !validation.deadline) || (updateData?.beneficiary_request_duration === 2 && !validation.limit)){
            return
        }
  
  
    try {
      // Prepare the main request data
      const requestDataToSend = {
        beneficiary_request_title: updateData.beneficiary_request_title,
        beneficiary_request_description: updateData.beneficiary_request_description,
        beneficiary_request_amount: updateData.beneficiary_request_amount,
        beneficiary_request_duration: updateData.beneficiary_request_duration,
      };

      // Send main request update
      const response = await fetch(`http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-single-update/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(requestDataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'request update failed');
      }

      // Handle duration-specific updates
      if (updateData.beneficiary_request_duration === 1) {
        const updateOnetime = {
          beneficiary_request_duration_onetime_deadline: 
            updateData.beneficiary_request_duration_onetime?.beneficiary_request_duration_onetime_deadline
        };

        if (requestData.beneficiary_request_duration_onetime) {
          const onetimeId = requestData.beneficiary_request_duration_onetime.beneficiary_request_duration_onetime_id
          // Update existing one-time
          const onetimeResponse = await fetch(`http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-single-update-onetime/${onetimeId}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify(updateOnetime),
          });
          if (!onetimeResponse.ok) {
            const errorData = await onetimeResponse.json();
            throw new Error(errorData.detail || 'onetime update failed');
          }
        } else {
          // Create new one-time
          const onetimeResponse = await fetch(`http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-create-onetime/${id}/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify(updateOnetime),
          });
          if (!onetimeResponse.ok) {
            const errorData = await onetimeResponse.json();
            throw new Error(errorData.detail || 'onetime create failed');
          }
        }
      } 
      else if (updateData.beneficiary_request_duration === 2) {
        const updateRecurring = {
          beneficiary_request_duration_recurring_limit: 
            updateData.beneficiary_request_duration_recurring?.beneficiary_request_duration_recurring_limit
        };

        if (requestData.beneficiary_request_duration_recurring) {
          const recurringId = requestData.beneficiary_request_duration_recurring.beneficiary_request_duration_recurring_id
          // Update existing recurring
          const recurringResponse = await fetch(`http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-single-update-recurring/${recurringId}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify(updateRecurring),
          });
          if (!recurringResponse.ok) {
            const errorData = await recurringResponse.json();
            throw new Error(errorData.detail || 'recurring update failed');
          }
        } else {
          // Create new recurring
          const recurringResponse = await fetch(`http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-create-recurring/${id}/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify(updateRecurring),
          });
          if (!recurringResponse.ok) {
            const errorData = await recurringResponse.json();
            throw new Error(errorData.detail || 'recurring create failed');
          }
        }
      }

      // Refresh data
      
      // setEditApplied(false)
      setFinishEdit(true)
      setTimeout(async () => {
        setFinishEdit(false)
        setRequestData(null);
        // setEditApplied(false);
        setIsEdit(false);
      // if (document.documentElement.classList.contains('delete-overlay-container-html')){
      //   document.documentElement.classList.remove('delete-overlay-container-html')
      //   document.body.classList.remove('delete-overlay-container-html')
      //   const containerDiv = document.getElementsByClassName('request-detail-edit-container')[0].querySelectorAll('*')
      //   for(var i=0; i<containerDiv.length; i++){
      //       containerDiv[i].classList.remove('delete-overlay-container-html')
      //   }
        
      //   }
      if(document.documentElement.classList.contains('edit-finish-body')){
        document.documentElement.classList.remove('edit-finish-body')
        document.body.classList.remove('edit-finish-body')
      }
      if (document.documentElement.classList.contains('delete-overlay-container-html')){
        document.documentElement.classList.remove('delete-overlay-container-html')
        document.body.classList.remove('delete-overlay-container-html')
        }
        await fetchData();
      }, 5000)
      
    } catch (err) {
      console.error('Error during update:', err);
    }
  //  else {
  //   // User canceled - reset to original data
  //   setIsEdit(false);
  //   let updateDuration;
  //   if (requestData.beneficiary_request_duration === 'One Time') {
  //     updateDuration = 1;
  //   } else if (requestData.beneficiary_request_duration === 'Recurring') {
  //     updateDuration = 2;
  //   } else {
  //     updateDuration = 3;
  //   }
    
  //   setUpdateData({
  //     beneficiary_request_title: requestData.beneficiary_request_title,
  //     beneficiary_request_description: requestData.beneficiary_request_description,
  //     beneficiary_request_amount: requestData.beneficiary_request_amount,
  //     beneficiary_request_duration: updateDuration,
  //     beneficiary_request_duration_onetime: requestData.beneficiary_request_duration_onetime || 
  //       { beneficiary_request_duration_onetime_deadline: null },
  //     beneficiary_request_duration_recurring: requestData.beneficiary_request_duration_recurring || 
  //       { beneficiary_request_duration_recurring_limit: null },
  //   });
  // }
};

  // useEffect(() => {
  //   if(finishEdit){
  //     setRequestData(null);
  //     setIsEdit(false);
  //     setEditApplied(false)
  //   }
  // },[finishEdit])

  const handleAmountUpdate = (event) => {
  // Remove Persian digits and commas from the input value
  const englishValue = event.target.value
    .replace(/[۰-۹]/g, d => ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'].indexOf(d))
    .replace(/٬/g, '');
  
  setUpdateData(pre => {
    if (englishValue !== '') {
      return {...pre, beneficiary_request_amount: Number(englishValue)}
    } else {
      return {...pre, beneficiary_request_amount: null}
    }
  })
}

  const handleDurationUpdate = (event) => {
    setUpdateData(pre => {
      return {...pre, beneficiary_request_duration:Number(event.target.value)}
    })
  }

  const handleTitleChange = (event) => {
    setUpdateData(pre => {
      return {...pre, beneficiary_request_title: event.target.value}
    })
  }

  const handleDescriptionChange = (event) => {
    setUpdateData(pre => {
      return {...pre, beneficiary_request_description: event.target.value}
    })
  }
  
  

  const handleLimitChange = (event) => {
    setBlur(pre => ({...pre, limit:false}))
    setUpdateData(pre => {
      const newData = {...pre}
      const recurring = newData.beneficiary_request_duration_recurring
      if (recurring) {
        newData.beneficiary_request_duration_recurring.beneficiary_request_duration_recurring_limit = Number(event.target.value)
      }else {
        newData.beneficiary_request_duration_recurring = {beneficiary_request_duration_recurring_limit:Number(event.target.value)}
      }
      return newData
      
    })
  }

  useEffect(() => {
    if(editApplied){
        document.documentElement.classList.add('delete-overlay-container-html')
        document.body.classList.add('delete-overlay-container-html')
        document.getElementById('form1').classList.add('delete-overlay-container-form')
        document.getElementById('form2').classList.add('delete-overlay-container-form')
        const inputs = document.getElementsByTagName('input')
        const selects = document.getElementsByTagName('select')
        const textareas = document.getElementsByTagName('textarea')
        for (var i=0;i<inputs.length;i++){
          inputs[i].classList.add('delete-overlay-container-form')
        }
        for (var i=0;i<selects.length;i++){
          selects[i].classList.add('delete-overlay-container-form')
        }
        for (var i=0;i<textareas.length;i++){
          textareas[i].classList.add('delete-overlay-container-form')
        }
        
    } else {
        if (document.documentElement.classList.contains('delete-overlay-container-html')){
        document.documentElement.classList.remove('delete-overlay-container-html')
        document.body.classList.remove('delete-overlay-container-html')
        }
        if(document.getElementById('form1').classList.contains('delete-overlay-container-form')){
          document.getElementById('form1').classList.remove('delete-overlay-container-form')
        }
        if(document.getElementById('form2').classList.contains('delete-overlay-container-form')){
          document.getElementById('form2').classList.remove('delete-overlay-container-form')
        }
        const inputs = document.getElementsByTagName('input')
        const selects = document.getElementsByTagName('select')
        const textareas = document.getElementsByTagName('textarea')
        if (inputs[0].classList.contains('delete-overlay-container-html')){
          for (var i=0;i<inputs.length;i++){
          inputs[i].classList.remove('delete-overlay-container-form')
        }
        
        }

        if (selects[0].classList.contains('delete-overlay-container-html')){
          for (var i=0;i<selects.length;i++){
          selects[i].classList.remove('delete-overlay-container-form')
        }
        
        }

        if (textareas[0].classList.contains('delete-overlay-container-html')){
          for (var i=0;i<textareas.length;i++){
          textareas[i].classList.remove('delete-overlay-container-form')
        }
        
        }

    }
  },[editApplied])



  useEffect(() => {
    if(finishEdit){
      document.documentElement.classList.add('edit-finish-body')
      document.body.classList.add('edit-finish-body')
    }
  },[finishEdit])
    if(finishEdit){
      return(
        <div className="edit-finish-container">

        <svg width="59" height="59" viewBox="0 0 59 59" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M26.25 42L12.5417 28.2917L16.625 24.2083L26.25 33.8333L50.75 9.33333C45.2083 3.79167 37.625 0 29.1667 0C13.125 0 0 13.125 0 29.1667C0 45.2083 13.125 58.3333 29.1667 58.3333C45.2083 58.3333 58.3333 45.2083 58.3333 29.1667C58.3333 23.625 56.875 18.6667 54.25 14.2917L26.25 42Z"/>
        </svg>

        <h1>
          درخواست شما با موفقیت ویرایش گردید.
        </h1>

        <p>
          تا لحظاتی دیگر به صفحه اصلی همین درخواست منتقل می‌شوید.
        </p>

      </div>
      )
    }
    return (
        <>
        <div className='request-detail-edit-container'>
                <Header />
                <main className="main">
            <div className="main-container">
        
              <div className="observe-forms">
                <form id="form1">
                  <div>
                    <label htmlFor="observe-type1">نوع درخواست:</label>
                    <input type="text" id="observe-type1" readOnly value={convertTypeLayer1(requestData.beneficiary_request_type_layer1)} />
                  </div>
        
                  <div>
                    <label htmlFor="observe-type2">دسته درخواست:</label>
                    <input type="text" id="observe-type2" readOnly value={requestData.beneficiary_request_type_layer2} />
                  </div>
        
                  <div>
                    <label htmlFor="observe-time1">نوع زمانی درخواست:</label>
                    <select id="observe-time1" value={updateData.beneficiary_request_duration} onChange={handleDurationUpdate}>
                        <option value={1}>به صورت یکبار</option>
                        <option value={2}>به صورت ماهانه</option>
                        <option value={3}>به طور دائمی</option>
                    </select>
                    {/* <input type="text" id="observe-time1" value="به صورت ماهانه" /> */}
                  </div>
        
                  {updateData.beneficiary_request_duration !== 3 &&
                  <div>
                    
                    {/* <label htmlFor="observe-time2">
                      تعداد دوره‌های درخواست:
                    </label>
                    <input type="text" id="observe-time2" value="۱۲ دوره ماهانه" /> */}
                    {
                        updateData.beneficiary_request_duration === 1 &&
                        <>
                            <label htmlFor="observe-time2">آخرین زمان دریافت کمک</label>
                            <DatePicker
                                value={jalaliValue}
                                onChange={(dateObj) => {
                                  setJalaliValue(dateObj);
                                  const gregorianDate = dateObj.toDate();
                                  const isoDate = gregorianDate.toISOString().split("T")[0];
                                  setUpdateData(pre => {
                                        const newData = {...pre}
                                        const onetime = newData.beneficiary_request_duration_onetime
                                        if (onetime) {
                                            newData.beneficiary_request_duration_onetime.beneficiary_request_duration_onetime_deadline = isoDate
                                        }else {
                                            newData.beneficiary_request_duration_onetime = {beneficiary_request_duration_onetime_deadline:isoDate}
                                        }
                                        return newData
                                        
                                        })
                                }}
                                calendar={persian}
                                locale={persian_fa_custom}
                                calendarPosition="bottom-left"
                                placeholder="تاریخ را انتخاب کنید"
                                inputClass="custom-datepicker-input"
                                minDate={todayJalali}
                              />
                            
                        </>
                    }
                    {
                        updateData.beneficiary_request_duration === 2 &&
                        <>
                            <label htmlFor="observe-time2">تعداد دوره‌های درخواست:</label>
                            <input type="number" id="observe-time2" value={updateData?.beneficiary_request_duration_recurring?.beneficiary_request_duration_recurring_limit || null} onChange={handleLimitChange} min={1} max={12} onBlur={() => {
                                setBlur(pre => ({...pre,limit:true}))
                            }}/>
                        </>
                    }


                  </div>}
        
                  { updateData.beneficiary_request_duration !== 3 &&
                    <div>
                    <label htmlFor="observe-cash">مبلغ درخواست:</label>
                    <input 
                        type="text" 
                        id="observe-cash" 
                        value={updateData?.beneficiary_request_amount ? formatPersianNumber(updateData.beneficiary_request_amount) : ''} 
                        onChange={handleAmountUpdate} 
                        inputMode="numeric"
                    />
                  </div>}
        
                  <div>
                    <label htmlFor="observe-title">عنوان درخواست:</label>
                    <input type="text" id="observe-title" value={updateData.beneficiary_request_title} onChange={handleTitleChange} />
                  </div>
        
                  <div>
                    <label htmlFor="observe-description">توضیحات درخواست:</label>
                    <textarea id="observe-description" value={updateData.beneficiary_request_description} placeholder="اطلاعاتی وجود ندارد" onChange={handleDescriptionChange} />
                  </div>
        
                  <div>
                    <label htmlFor="observe-document">مستندات درخواست:</label>
                    <input type="file" id="observe-document" multiple hidden />
                    <label htmlFor="observe-document" className="upload-label">
                      اطلاعاتی وجود ندارد
                    </label>
                  </div>
                </form>
        
                <form id="form2">
                  <div>
                    <label htmlFor="observe-created-at">تاریخ ثبت:</label>
                    <input type="text" id="observe-created-at" readOnly value={gregorianToJalali(requestData.effective_date)} />
                  </div>
        
                  <div>
                    <label htmlFor="observe-created-by">ایجاد شده توسط:</label>
                    <input type="text" id="observe-created-by" readOnly value={requestData?.beneficiary_request_is_created_by_charity ? "مدیر سامانه" : "شخص کاربر"} />
                  </div>
        
                  <div>
                    <label htmlFor="observe-proccesing-stage">وضعیت درخواست:</label>
                    <input type="text" id="observe-proccesing-stage" readOnly value={convertStage(requestData?.beneficiary_request_processing_stage) || null} />
                  </div>
                </form>
              </div>

              {
                !validation.deadline && blur.deadline && updateData.beneficiary_request_duration === 1 &&
                <p>لطفا تاریح آخرین زمان دریافت کمک را مشخص کنید</p>
              }

              {
                !validation.limit && blur.limit && updateData.beneficiary_request_duration === 2 &&
                <p>لطفا تعداد دوره های درخواست را انتخاب کنید بین یک دوره تا دوازده دوره</p>
              }
        
              <div className="buttons">
                <div className="observe-back-container">
                  <button className="observe-back" onClick={() => {
                    setIsEdit(false)
                  }}>
                    <img src={back_icon} alt="" />
                    بازگشت
                  </button>
                </div>
        
                <div className="observe-confirm-edit-container">
                  <button className="observe-confirm-edit" onClick={() => {
                    setEditApplied(true)
                  }}>
                    اعمال ویرایش
                    <img src={confirm_icon} alt="" />
                  </button>
                </div>
              </div>
        
            </div>
          </main>
                <NavigationBar selected={3}/>
              </div>

              {
                editApplied && 
                <>
                <div className="block-overlay-container"></div>
                <div className="delete-overlay-container">
                    <p>آیا از اعمال ویرایش اطمینان دارید؟</p>
                    <div className="delete-overlay-buttons">
                    <button className="no-button" onClick={() => setEditApplied(false)}>خیر</button>
                    <button className="yes-button" onClick={handleFinishEdit}>بلی</button>
                    </div>
                </div>
                </>
              }
              </>
    )
}

export default RequestDetailEdit;