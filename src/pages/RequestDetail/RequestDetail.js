import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useLookup } from '../../context/LookUpContext';
import Header from '../../components/header/Header';
import NavigationBar from '../../components/navigationBar/NavigationBar';
import './RequestDetail.css'
import back_icon from '../../media/icons/back_icon.svg'
import confirm_icon from '../../media/icons/confirm_icon.svg'

function RequestDetail() {
  const { id } = useParams();
  const {duration} = useLookup();
  const [isEdit,setIsEdit] = useState(false)
  const [requestData,setRequestData] = useState(null)
  const [updateData, setUpdateData] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
      document.documentElement.classList.add('request-detail-html');
      document.body.classList.add('request-detail-body');
      
      return () => {
        document.documentElement.classList.remove('request-detail-html');
        document.body.classList.remove('request-detail-body');
      };
    }, []);

    useEffect(() => {
      console.log(requestData)
    })

    useEffect(()=>{
    fetchData();
  },[])
    function formatPersianNumber(number) {
  // Convert to Persian digits
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  // Add commas and convert each digit
  return number.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "٬")
    .replace(/\d/g, d => persianDigits[d]);
}
    const convertTypeLayer1 = (type) => {
        if (type === 'Good'){
            return "کالا"
        }else if (type === 'Cash'){
            return "وجه نقد"

        }else if (type === 'Service'){
            return "خدمت"
        }
    }
    const convertStage = (type) => {
     if (type === 'Submitted'){
        return "ثبت شده";
     }else if (type === 'Pending Review'){
        return "در انتظار بررسی";
     }else if (type === 'Under Evaluation') {
        return "در حال ارزیابی";
     }else if (type === 'Approved'){
        return "تایید شده";

     }else if (type === 'Rejected'){
        return "رد شده";
     }else if (type === 'Completed'){
        return "تکمیل شده";
     }else if (type === 'In Progress'){
        return "در حال انجام";

     }
    }
    // if (!data) {
    //     return <div>Loading...</div>;
    // }



    

      // Function to convert Gregorian date to Persian digits
  const toPersianDigits = (num) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, (d) => persianDigits[d]);
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


  const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-single-get/${id}/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('access_token')}`,
            },
          });
          if (!response.ok) {  // Check for HTTP errors (4xx/5xx)
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
          }
          const result = await response.json();
          setRequestData(result)
          let updateDuration;
          if (result.beneficiary_request_duration === 'One Time'){
            updateDuration = 1
          } else if (result.beneficiary_request_duration === 'Recurring'){
            updateDuration = 2
          } else {
            updateDuration = 3
          }
          let updateDurationOnetime;
          if (result.beneficiary_request_duration_onetime){
            updateDurationOnetime = result.beneficiary_request_duration_onetime
          } else {
            updateDurationOnetime = {beneficiary_request_duration_onetime_deadline: null}
          }
          let updateDurationRecurring;
          if (result.beneficiary_request_duration_recurring){
            updateDurationRecurring = result.beneficiary_request_duration_recurring
          }else {
            updateDurationRecurring = {beneficiary_request_duration_recurring_limit: null}
          }
          setUpdateData({
            beneficiary_request_title: result.beneficiary_request_title,
            beneficiary_request_description:result.beneficiary_request_description,
            beneficiary_request_amount:result.beneficiary_request_amount,
            beneficiary_request_duration_onetime:result.beneficiary_request_duration_onetime,
            beneficiary_request_duration_recurring:result.beneficiary_request_duration_recurring,
            beneficiary_request_duration: updateDuration,
            beneficiary_request_duration_onetime: updateDurationOnetime,
            beneficiary_request_duration_recurring: updateDurationRecurring,
          })
        } catch (err) {
          console.log(err)
        }
      }
  

  const handleEditClick = () => {
    if(requestData.beneficiary_request_is_created_by_charity || (requestData.beneficiary_request_processing_stage !== 'Submitted' && requestData.beneficiary_request_processing_stage !== 'Pending Review' && requestData.beneficiary_request_processing_stage !== 'Under Evaluation')){
        return
    }
    setIsEdit(true)
  }

  const handleDelete = async () => {
    if(requestData.beneficiary_request_is_created_by_charity || (requestData.beneficiary_request_processing_stage !== 'Submitted' && requestData.beneficiary_request_processing_stage !== 'Pending Review' && requestData.beneficiary_request_processing_stage !== 'Under Evaluation')){
        return
    }
    const isConfirmed = window.confirm('are you sure you want to delete this request?')
    if (!isConfirmed) {
      return
    } else {
      try {
        const response = await fetch(`http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-single-update/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('access_token')}`,
        },
      });

      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.detail || 'request delete failed');
      }

      if(requestData.beneficiary_request_duration === 'One Time' && requestData.beneficiary_request_duration_onetime){
        const onetimeResponse = await fetch(`http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-single-update-onetime/${id}/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('access_token')}`,
            },
          });
          if (!onetimeResponse.ok) {
            const errorData = await onetimeResponse.json();
            throw new Error(errorData.detail || 'onetime delete failed');
          }
      }

      if(requestData.beneficiary_request_duration === 'Recurring' && requestData.beneficiary_request_duration_recurring){
        const recurringResponse = await fetch(`http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-single-update-recurring/${id}/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('access_token')}`,
            },
          });
          if (!recurringResponse.ok) {
            const errorData = await recurringResponse.json();
            throw new Error(errorData.detail || 'recurring delete failed');
          }
      }
      } catch(err) {
        console.log(err)
      }
    }
    navigate('/requests');
  }

  const handleFinishEdit = async () => {
  const isConfirmed = window.confirm('are you sure about the edit?');
  if (isConfirmed) {
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
          // Update existing one-time
          const onetimeResponse = await fetch(`http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-single-update-onetime/${id}/`, {
            method: 'PATCH',
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
          // Update existing recurring
          const recurringResponse = await fetch(`http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-single-update-recurring/${id}/`, {
            method: 'PATCH',
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
      setRequestData(null);
      setIsEdit(false);
      await fetchData();
    } catch (err) {
      console.error('Error during update:', err);
    }
  } else {
    // User canceled - reset to original data
    setIsEdit(false);
    let updateDuration;
    if (requestData.beneficiary_request_duration === 'One Time') {
      updateDuration = 1;
    } else if (requestData.beneficiary_request_duration === 'Recurring') {
      updateDuration = 2;
    } else {
      updateDuration = 3;
    }
    
    setUpdateData({
      beneficiary_request_title: requestData.beneficiary_request_title,
      beneficiary_request_description: requestData.beneficiary_request_description,
      beneficiary_request_amount: requestData.beneficiary_request_amount,
      beneficiary_request_duration: updateDuration,
      beneficiary_request_duration_onetime: requestData.beneficiary_request_duration_onetime || 
        { beneficiary_request_duration_onetime_deadline: null },
      beneficiary_request_duration_recurring: requestData.beneficiary_request_duration_recurring || 
        { beneficiary_request_duration_recurring_limit: null },
    });
  }
};



  const handleAmountUpdate = (event) => {
    setUpdateData(pre => {
        if (event.target.value !== ''){
        return {...pre,beneficiary_request_amount:Number(event.target.value)}
        } else {
            return {...pre,beneficiary_request_amount:null}
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
  
  const handleDeadlineChange = (event) => {
    setUpdateData(pre => {
      const newData = pre
      const onetime = newData.beneficiary_request_duration_onetime
      if (onetime) {
        newData.beneficiary_request_duration_onetime.beneficiary_request_duration_onetime_deadline = event.target.value
      }else {
        newData.beneficiary_request_duration_onetime = {beneficiary_request_duration_onetime_deadline:event.target.value}
      }
      return newData
      
    })
  }

  const handleLimitChange = (event) => {
    setUpdateData(pre => {
      const newData = pre
      const recurring = newData.beneficiary_request_duration_recurring
      if (recurring) {
        newData.beneficiary_request_duration_recurring.beneficiary_request_duration_recurring_limit = Number(event.target.value)
      }else {
        newData.beneficiary_request_duration_recurring = {beneficiary_request_duration_recurring_limit:Number(event.target.value)}
      }
      return newData
      
    })
  }

 

  if(!requestData){
    return <p>loading...</p>
  }

  if (isEdit) {
    return (
      <div className='request-detail-edit-container'>
        <Header />
        <main className="main">
    <div className="main-container">

      <div className="observe-forms">
        <form id="form1">
          <div>
            <label htmlFor="observe-type1">نوع درخواست:</label>
            <input type="text" id="observe-type1" readOnly value="وجه نقد" />
          </div>

          <div>
            <label htmlFor="observe-type2">دسته درخواست:</label>
            <input type="text" id="observe-type2" readOnly value="اجاره خانه" />
          </div>

          <div>
            <label htmlFor="observe-time1">نوع زمانی درخواست:</label>
            <input type="text" id="observe-time1" value="به صورت ماهانه" />
          </div>

          <div>
            <label htmlFor="observe-time2">تعداد دوره‌های درخواست:</label>
            <label htmlFor="observe-time2" className="display-none-element">
              تعداد دوره‌های درخواست:
            </label>
            <input type="text" id="observe-time2" value="۱۲ دوره ماهانه" />
          </div>

          <div>
            <label htmlFor="observe-cash">مبلغ درخواست:</label>
            <input type="text" id="observe-cash" value="۸٫۰۰۰٫۰۰۰" />
          </div>

          <div>
            <label htmlFor="observe-title">عنوان درخواست:</label>
            <input type="text" id="observe-title" value="وجه نقد - اجاره خانه" />
          </div>

          <div>
            <label htmlFor="observe-description">توضیحات درخواست:</label>
            <textarea id="observe-description" placeholder="اطلاعاتی وجود ندارد" />
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
            <input type="text" id="observe-created-at" readOnly value="۱۴۰۴/۵/۲۳" />
          </div>

          <div>
            <label htmlFor="observe-created-by">ایجاد شده توسط:</label>
            <input type="text" id="observe-created-by" readOnly value="مدیر سامانه" />
          </div>

          <div>
            <label htmlFor="observe-proccesing-stage">وضعیت درخواست:</label>
            <input type="text" id="observe-proccesing-stage" readOnly value="ثبت شده" />
          </div>
        </form>
      </div>

      <div className="buttons">
        <div className="observe-back-container">
          <button className="observe-back">
            <img src={back_icon} alt="" />
            بازگشت
          </button>
        </div>

        <div className="observe-confirm-edit-container">
          <button className="observe-confirm-edit">
            اعمال ویرایش
            <img src={confirm_icon} alt="" />
          </button>
        </div>
      </div>

    </div>
  </main>
        <NavigationBar selected={3}/>
      </div>
    )
  }
  
  
  return (
    <div className='request-detail-container'>
      <Header />
      <main className="main">
        <div className="main-container">
          <div className="observe-forms">
            <form id="form1">
              <div>
                <label htmlFor="observe-type1">نوع درخواست:</label>
                <input type="text" id="observe-type1" readOnly value={requestData?.beneficiary_request_type_layer1 ? convertTypeLayer1(requestData.beneficiary_request_type_layer1) : null} />
              </div>

              <div>
                <label htmlFor="observe-type2">دسته درخواست:</label>
                <input type="text" id="observe-type2" readOnly value={requestData?.beneficiary_request_type_layer2 || null} />
              </div>

              <div>
                <label htmlFor="observe-time1">نوع زمانی درخواست:</label>
                <input type="text" id="observe-time1" readOnly value={
                  requestData?.beneficiary_request_duration ?
                  requestData.beneficiary_request_duration === 'Permanent' ? "به طور دائمی":
                  requestData.beneficiary_request_amount === 'One Time' ? "فقط یکبار" : "به صورت ماهانه"
                  : null
                } />
              </div>

              {requestData?.beneficiary_request_duration !== 'Permanent' && 
              <div>
                {
                  requestData?.beneficiary_request_duration_onetime &&
                  <>
                  <label htmlFor="observe-time2">تاریخ دریافت درخواست:</label>
                  <input type="text" id="observe-time2" readOnly value={gregorianToJalali(requestData.beneficiary_request_duration_onetime.beneficiary_request_duration_onetime_deadline)} />
                  </>
                }
                {
                  requestData?.beneficiary_request_duration_recurring &&
                  <>
                  <label htmlFor="observe-time2">تعداد دوره‌های درخواست:</label>
                  <input type="text" id="observe-time2" readOnly value={`${toPersianDigits(requestData.beneficiary_request_duration_recurring.beneficiary_request_duration_recurring_limit)} دوره ماهانه`} />
                  </>
                }
              </div>}

              {requestData?.beneficiary_request_duration !== 'Permanent' &&
              <div>
                <label htmlFor="observe-cash">مبلغ درخواست:</label>
                <input type="text" id="observe-cash" readOnly value={formatPersianNumber(requestData.beneficiary_request_amount)} />
              </div>}

              <div>
                <label htmlFor="observe-title">عنوان درخواست:</label>
                <input type="text" id="observe-title" readOnly value={requestData?.beneficiary_request_title || null} />
              </div>

              <div>
                <label htmlFor="observe-description">توضیحات درخواست:</label>
                <textarea id="observe-description" readOnly value={requestData?.beneficiary_request_description || null} />
              </div>

              <div>
                <label htmlFor="observe-document">مستندات درخواست:</label>
                <input type="file" id="observe-document" multiple hidden readOnly />
                <label htmlFor="observe-document" className="upload-label">
                  اطلاعاتی وجود ندارد
                </label>
              </div>
            </form>

            <form id="form2">
              <div>
                <label htmlFor="observe-created-at">تاریخ ثبت:</label>
                <input type="text" id="observe-created-at" readOnly value={gregorianToJalali(requestData?.effective_date) || null} />
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

          <div className="buttons-container">
            <div className="observe-line-button">
              <div className="observe-child-creation-container">
                <button className="observe-chid-creation">
                  ایجاد درخواست جزئی
                  <svg width="13" height="14" viewBox="0 0 13 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.8653 0C6.14368 0.000245073 6.41058 0.111031 6.6073 0.308L9.4927 3.192C9.59027 3.28963 9.66763 3.40554 9.72036 3.5331C9.77309 3.66067 9.80015 3.79737 9.8 3.9354V7C8.68609 7 7.6178 7.4425 6.83015 8.23015C6.0425 9.0178 5.6 10.0861 5.6 11.2V14H1.05C0.771523 14 0.504451 13.8894 0.307538 13.6925C0.110625 13.4955 0 13.2285 0 12.95V1.05C0 0.771523 0.110625 0.504451 0.307538 0.307538C0.504451 0.110625 0.771523 0 1.05 0L5.8653 0ZM2.1 3.5H7.7V4.9H2.1V3.5ZM5.6 6.3H2.1V7.7H5.6V6.3ZM2.1 9.1H4.2V10.5H2.1V9.1ZM12.3949 10.7051C12.2637 10.5738 12.0856 10.5 11.9 10.5H10.5V9.1C10.5 8.91435 10.4263 8.7363 10.295 8.60502C10.1637 8.47375 9.98565 8.4 9.8 8.4C9.61435 8.4 9.4363 8.47375 9.30503 8.60502C9.17375 8.7363 9.1 8.91435 9.1 9.1V10.5H7.7C7.51435 10.5 7.3363 10.5737 7.20503 10.705C7.07375 10.8363 7 11.0143 7 11.2C7 11.3857 7.07375 11.5637 7.20503 11.695C7.3363 11.8262 7.51435 11.9 7.7 11.9H9.1V13.3C9.1 13.4857 9.17375 13.6637 9.30503 13.795C9.4363 13.9262 9.61435 14 9.8 14C9.98565 14 10.1637 13.9262 10.295 13.795C10.4263 13.6637 10.5 13.4857 10.5 13.3V11.9H11.9C12.0384 11.9 12.1737 11.8589 12.2888 11.782C12.4039 11.7051 12.4936 11.5957 12.5466 11.4679C12.5995 11.34 12.6134 11.1992 12.5864 11.0635C12.5594 10.9277 12.4928 10.803 12.3949 10.7051Z"
                    />
                  </svg>
                </button>
              </div>
              <div className="observe-edit-container">
                <button className="observe-edit" onClick={handleEditClick}>
                  ویرایش درخواست
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.60103 4.68222L9.31648 5.39778L2.2708 12.4444H1.55534V11.7289L8.60103 4.68222ZM11.4006 0C11.2062 0 11.004 0.0777778 10.8563 0.225556L9.43314 1.64889L12.3494 4.56556L13.7725 3.14222C14.0758 2.83889 14.0758 2.34889 13.7725 2.04556L11.9528 0.225556C11.7973 0.07 11.6028 0 11.4006 0ZM8.60103 2.48111L0 11.0833V14H2.91626L11.5173 5.39778L8.60103 2.48111Z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="observe-line-button">
              <div className="observe-child-list-container">
                <button className="observe-child-list">
                  مشاهده درخواست‌های جزئی
                  <svg width="14" height="9" viewBox="0 0 14 9" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 1.2C9.41182 1.2 11.5627 2.478 12.6127 4.5C11.5627 6.522 9.41818 7.8 7 7.8C4.58182 7.8 2.43727 6.522 1.38727 4.5C2.43727 2.478 4.58818 1.2 7 1.2ZM7 0C3.81818 0 1.10091 1.866 0 4.5C1.10091 7.134 3.81818 9 7 9C10.1818 9 12.8991 7.134 14 4.5C12.8991 1.866 10.1818 0 7 0ZM7 3C7.87818 3 8.59091 3.672 8.59091 4.5C8.59091 5.328 7.87818 6 7 6C6.12182 6 5.40909 5.328 5.40909 4.5C5.40909 3.672 6.12182 3 7 3ZM7 1.8C5.42182 1.8 4.13636 3.012 4.13636 4.5C4.13636 5.988 5.42182 7.2 7 7.2C8.57818 7.2 9.86364 5.988 9.86364 4.5C9.86364 3.012 8.57818 1.8 7 1.8Z" />
                  </svg>
                </button>
              </div>
              <div className="observe-delete-container">
                <button className="observe-delete">
                  حذف درخواست
                  <svg width="11" height="14" viewBox="0 0 11 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.64286 4.66667V12.4444H2.35714V4.66667H8.64286ZM7.46429 0H3.53571L2.75 0.777778H0V2.33333H11V0.777778H8.25L7.46429 0ZM10.2143 3.11111H0.785714V12.4444C0.785714 13.3 1.49286 14 2.35714 14H8.64286C9.50714 14 10.2143 13.3 10.2143 12.4444V3.11111Z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="observe-line-button">
              <div className="observe-back-container">
                <button className="observe-back">
                  <img src={back_icon} alt="" />
                  بازگشت
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>


      <NavigationBar selected={3} />
    </div>
  );
  
}

export default RequestDetail;
