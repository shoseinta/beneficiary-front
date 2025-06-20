import Header from "../../../components/header/Header";
import NavigationBar from "../../../components/navigationBar/NavigationBar";
import step1_completed from '../../../media/icons/step1_completed.svg';
import step2_completed from '../../../media/icons/step2_completed.svg';
import step3_completed from '../../../media/icons/step3_completed.svg';
import step4_active from '../../../media/icons/step4_active.svg';
import back_icon from '../../../media/icons/back_icon.svg';
import { useEffect, useState } from "react";
import './Form4.css'

function Form4({ requestData, onetimeData, recurringData, typeLayerOne, typeLayerTwo, duration, setStep, handleSubmit }) {
    const [typeLayerOneValue, setTypeLayerOneValue] = useState(null)
    const [typeLayerTwoValue, setTypeLayerTwoValue] = useState(null)
    const [durationValue, setDurationValue] = useState(null)
    const [durationTwoValue, setDurationTwoValue] = useState(null)
    const [amountValue, setAmountValue] = useState(null)

function formatPersianNumber(number) {
  // Convert to Persian digits
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  // Add commas and convert each digit
  return number.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "٬")
    .replace(/\d/g, d => persianDigits[d]);
}



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

    useEffect(() => {
        const typeOne = typeLayerOne.find(
                            element => element.beneficiary_request_type_layer1_id === 
                            requestData.beneficiary_request_type_layer1
                        )
        if (typeOne.beneficiary_request_type_layer1_id === 1){
            setTypeLayerOneValue('کالا')
        } else if (typeOne.beneficiary_request_type_layer1_id === 2){
            setTypeLayerOneValue('وجه نقد')
        }else {
            setTypeLayerOneValue('خدمت')
        }

        const typeTwo = typeLayerTwo.find(
                            element => element.beneficiary_request_type_layer2_id === 
                            requestData.beneficiary_request_type_layer2
                        )
        setTypeLayerTwoValue(typeTwo.beneficiary_request_type_layer2_name)

        const dur = duration.find(
                            element => element.beneficiary_request_duration_id === 
                            requestData.beneficiary_request_duration
                        )
        if (dur.beneficiary_request_duration_name === 'one_time'){
            setDurationValue("فقط یکبار")
        }else if(dur.beneficiary_request_duration_name === 'recurring'){
            setDurationValue("به صورت ماهانه")
        }else {
            setDurationValue("به صورت دائمی")
        }

        if (dur.beneficiary_request_duration_name === 'one_time'){
            setDurationTwoValue(gregorianToJalali(onetimeData.beneficiary_request_duration_onetime_deadline))
        }else if (dur.beneficiary_request_duration_name === 'recurring'){
            setDurationTwoValue(`${toPersianDigits(recurringData.beneficiary_request_duration_recurring_limit)} دوره ماهانه  `)   
        }

        setAmountValue(`${formatPersianNumber(Number(requestData.beneficiary_request_amount))} تومان`)
        
    },[requestData,onetimeData,recurringData])

    useEffect(()=>{
            document.documentElement.classList.add('form4-html')
            document.body.classList.add('form4-body')
    
            return ()=>{
                document.documentElement.classList.remove('form4-html')
                document.body.classList.remove('form4-body')
            }
        },[])

    // Function to render file preview based on file type
    const renderFilePreview = () => {
        const file = requestData.beneficiary_request_document;
        
        if (!file) {
            return <p>No file selected</p>;
        }

        // Check file type
        const fileType = file.type.split('/')[0]; // 'image', 'application', etc.
        const fileUrl = URL.createObjectURL(file); // Create a temporary URL for preview

        switch (fileType) {
            case 'image':
                return (
                    <div>
                        <img 
                            src={fileUrl} 
                            alt="Preview" 
                            style={{ maxWidth: '200px', maxHeight: '200px' }} 
                        />
                        <p>{file.name}</p>
                    </div>
                );
            case 'application':
                if (file.type.includes('pdf')) {
                    return (
                        <div>
                            <iframe 
                                src={fileUrl} 
                                width="200" 
                                height="200"
                                title="PDF Preview"
                            />
                            <p>{file.name}</p>
                        </div>
                    );
                }
                // Fallthrough for other application types
            default:
                return (
                    <div>
                        <p>File: {file.name}</p>
                        <p>(No preview available for this file type)</p>
                    </div>
                );
        }
    };

    return (
        <div className="form4-container">
            <Header />
            <main className="main">
    <nav className="nav-up">
      <ol className="nav-list-up">
        <li className="nav-item-up step-completed">
          <div> 
            <span className="step-icon"><img src={step1_completed} alt="" /></span>
            <p> نوع درخواست </p> 
          </div>
        </li>
        <li className="nav-item-up step-completed">
          <div> 
            <span className="step-icon"><img src={step2_completed} alt="" /></span>
            <p> تعیین تاریخ </p> 
          </div>
        </li>
        <li className="nav-item-up step-completed">
          <div> 
            <span className="step-icon"><img src={step3_completed} alt="" /></span>
            <p> اطلاعات تکمیلی </p>
          </div>
        </li>
        <li className="nav-item-up" id="active-nav-up">
          <div> 
            <span className="step-icon"><img src={step4_active} alt="" /></span>
            <p> تأیید نهایی </p> 
          </div>
        </li>
      </ol>
    </nav>

    <form className="form">
      <div className="request-type-review input-space">
        <label className="label-space" htmlFor="request-type-review1-id"> نوع درخواست: </label>
        <input type="text" id="request-type-review1-id" readOnly value={typeLayerOneValue} />
      </div>

      <div className="request-type-review input-space">
        <label htmlFor="request-type-review2-id" className="label-space"> دسته درخواست: </label>
        <input type="text" id="request-type-review2-id" readOnly value={typeLayerTwoValue} />
      </div>
    </form>

    <form className="form">
      <div className="request-time-review input-space">
        <label className="label-space" htmlFor="request-time-review1-id"> نوع زمانی درخواست: </label>
        <input type="text" id="request-time-review1-id" readOnly value={durationValue} />
      </div>

      {( durationValue === "فقط یکبار"|| durationValue === "به صورت ماهانه") && <div className="request-time-review input-space">
        {durationValue === "فقط یکبار" && <label htmlFor="request-time-review2-id" className="label-space" id="request-time-review2-one-time-id"> تاریخ دریافت درخواست </label>}
        {durationValue === "به صورت ماهانه" && <label htmlFor="request-time-review2-id" className="label-space" id="request-time-review2-recurring-id"> تعداد دوره‌های درخواست: </label>}
        <input type="text" id="request-time-review2-id" readOnly value={durationTwoValue} />
      </div>}

      <div className="request-cash-review input-space">
        <label className="label-space" htmlFor="request-cash-review1-id"> مبلغ درخواست: </label>
        <input type="text" id="request-cash-review1-id" readOnly value={amountValue} />
      </div>
    </form>

    <form className="form">
      <div className="request-title-review input-space">
        <label className="label-space" htmlFor="request-title-review1-id"> عنوان درخواست: </label>
        {requestData.beneficiary_request_title === ''?
            <input type="text" id="request-title-review1-id" readOnly value="اطلاعاتی وجود ندارد" />
        :
        <input type="text" id="request-title-review1-id" readOnly value={requestData.beneficiary_request_title} />
        }
      </div>

      <div className="request-description-review input-space">
        <label htmlFor="request-description-review1-id" className="label-space"> توضیحات درخواست: </label>
        {
            requestData.beneficiary_request_description === ''?
            <textarea type="text" id="request-description-review1-id" readOnly placeholder="اطلاعاتی وجود ندارد"></textarea>
            :
            <textarea type="text" id="request-description-review1-id" readOnly placeholder="اطلاعاتی وجود ندارد">{requestData.beneficiary_request_description}</textarea>
        }
      </div>

      <div className="request-document-review input-space">
        <label htmlFor="request-document-review1-id" className="label-space"> مستندات درخواست: </label>
        <input type="file" id="request-document-review1-id" multiple hidden readOnly />
        <label htmlFor="request-document-review1-id" className="upload-label" id="label-for-file-input">اطلاعاتی وجود ندارد </label>
      </div>
    </form>

    <div className="next-back-btn">
      <button onClick={() => setStep(pre => pre - 1)} className="back-button-review">
        <img src={back_icon} alt=" " />
        <span> قبلی</span>
      </button>

      <button onClick={handleSubmit} className="submit-button-review">
        <span> تأیید نهایی و ارسال</span>
      </button>
    </div>

    <div></div>
  </main>
  <NavigationBar selected={2}/>
            </div>
    );
}

export default Form4;