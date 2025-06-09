import { useState,useEffect,useRef } from "react";
import Header from "../../../components/header/Header";
import NavigationBar from "../../../components/navigationBar/NavigationBar";
import step1_completed from '../../../media/icons/step1_completed.svg';
import step2_active from '../../../media/icons/step2_active.svg';
import step3 from '../../../media/icons/step3.svg';
import step4 from '../../../media/icons/step4.svg';
import back_icon from '../../../media/icons/back_icon.svg'
import next_icon from '../../../media/icons/next_icon.svg'
import './Form2.css'
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";



function Form2({setOneTimeData, setRecurringData, duration, setRequestData, onetimeData, recurringData, requestData, nextActive, setNextActive, setStep}){
    const [selectedDuration,setSelectedDuration] = useState(requestData.beneficiary_request_duration);
    const [dispalyValue, setDisplayValue] = useState("")
    const [jalaliValue, setJalaliValue] = useState(null);
    const todayJalali = new DateObject({ calendar: persian, locale: persian_fa });


    const datepickerRef = useRef();
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
  const wrapperDiv = datepickerRef.current?.querySelector(".rmdp-wrapper");
  if (wrapperDiv) {
    wrapperDiv.style.display = "block";
    wrapperDiv.style.width = "100%";
    wrapperDiv.style.maxWidth = "100%";
  }
}, [jalaliValue]); // or use [] if once is enough

useEffect(() => {
  if (onetimeData?.beneficiary_request_duration_onetime_deadline) {
    const newDate = new DateObject({
      date: onetimeData.beneficiary_request_duration_onetime_deadline,
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
}, [onetimeData]);


    const handleJalaliDateChange = (dateObj) => {
  if (dateObj) {
    const gregorianDate = dateObj.toDate(); // native JS Date
    const isoDate = gregorianDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
    
    setOneTimeData(prev => ({
      ...prev,
      beneficiary_request_duration_onetime_deadline: isoDate,
    }));
  }
};

    const handleDeadLineChange = (event) => {
        setOneTimeData(pre => ({...pre,beneficiary_request_duration_onetime_deadline:event.target.value}))
    }
    const handleLimitChange = (event) => {
        if (!event.target.value){
         setRecurringData(pre => ({...pre,beneficiary_request_duration_recurring_limit:""})) 
        }else{
        setRecurringData(pre => ({...pre,beneficiary_request_duration_recurring_limit:Number(event.target.value)}))
        }
    }

    const toPersianDigits = (num) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, (x) => persianDigits[x]);
  };

  // Add commas as thousand separators
  const addCommas = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Convert Persian digits to English
  const toEnglishDigits = (str) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.toString().split('').map((c) => {
      const index = persianDigits.indexOf(c);
      return index >= 0 ? index : c;
    }).join('').replace(/,/g, '');
  };

    const handleDurationChange = (event) => {
      setSelectedDuration(Number(event.target.value))
      if (!event.target.value){
        setRequestData(pre => ({...pre, beneficiary_request_duration:""}))
      }else{
      setRequestData(pre => ({...pre, beneficiary_request_duration:Number(event.target.value)}))
      }
    }

    
    //  useEffect(() => {
    //         if(selectedDuration){
    //             setRequestData(pre => ({...pre, beneficiary_request_duration:selectedDuration.beneficiary_request_duration_id}))
    //         }
            
    //     },[selectedDuration])
    // useEffect(() => {
    //         if (duration && duration.length > 0) {
    //             setSelectedDuration(duration[0]);
    //         }
    //     }, [duration]);

//     useEffect(() => {
//         if (selectedDuration){
// console.log(selectedDuration.beneficiary_request_duration_name)
//         }
        
//     })


    useEffect(() => {
        let isFormComplete = false
        if (requestData.beneficiary_request_duration && selectedDuration===1 && onetimeData?.beneficiary_request_duration_onetime_deadline && requestData.beneficiary_request_amount){
            isFormComplete = true
        }
        if (requestData.beneficiary_request_duration && selectedDuration===2 && recurringData?.beneficiary_request_duration_recurring_limit && requestData.beneficiary_request_amount){
            isFormComplete = true
        }
        if(requestData.beneficiary_request_duration && selectedDuration===3){
            isFormComplete = true
        }
       setNextActive(isFormComplete) 
    },[requestData,onetimeData,recurringData])

    const handleAmountChange = e => {
      const inputValue = e.target.value;
    
    // Convert Persian to English and remove commas for storage
      const englishValue = toEnglishDigits(inputValue);
      if(!englishValue){
        setRequestData(pre => {
            return {...pre, beneficiary_request_amount:""}
        })
      }else {
        setRequestData(pre => {
            return {...pre, beneficiary_request_amount:englishValue}
        })
      }
      const formattedValue = englishValue === '' 
        ? '' 
        : toPersianDigits(addCommas(englishValue));
      setDisplayValue(formattedValue);
    }

    useEffect(()=>{
        document.documentElement.classList.add('form2-html')
        document.body.classList.add('form2-body')

        return ()=>{
            document.documentElement.classList.remove('form2-html')
            document.body.classList.remove('form2-body')
        }
    },[])
    if (!duration || !Array.isArray(duration)) {
        return <p>Loading options...</p>;
    }

    // if (!selectedDuration) {
    //     return <p>Loading selection...</p>;
    // }
    return(
        <div className="form2-container">
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
        <li className="nav-item-up" id="active-nav-up">
          <div> 
            <span className="step-icon"><img src={step2_active} alt="" /></span>
            <p> تعیین تاریخ </p> 
          </div>
        </li>
        <li className="nav-item-up">
          <div> 
            <span className="step-icon"><img src={step3} alt="" /></span>
            <p> اطلاعات تکمیلی </p>
          </div>
        </li>
        <li className="nav-item-up">
          <div> 
            <span className="step-icon"><img src={step4} alt="" /></span>
            <p> تأیید نهایی </p> 
          </div>
        </li>
      </ol>
    </nav>

    <form className="form">
      <fieldset className="time-layer1 input-space">
        <legend className="label-space"> درخواست شما در کدامیک از گزینه‌های زمانی زیر قرار دارد؟ <sup>*</sup></legend>
        
        <div className="choice-group2">
                    
          <input 
          type="radio" 
          id="one-time" 
          name="request_time" 
          value={duration[0].beneficiary_request_duration_id}
          onChange={handleDurationChange}
          checked={selectedDuration === duration[0].beneficiary_request_duration_id}/>
          <label htmlFor="one-time">فقط یکبار </label>

          <input 
          type="radio" 
          id="recurring" 
          name="request_time" 
          value={duration[1].beneficiary_request_duration_id}
          onChange={handleDurationChange} 
          checked={selectedDuration === duration[1].beneficiary_request_duration_id}
          />
          <label htmlFor="recurring"> به‌صورت ماهانه </label>

          <input 
          type="radio" 
          id="permanent" 
          name="request_time" 
          value={duration[2].beneficiary_request_duration_id}
          onChange={handleDurationChange}
          checked={selectedDuration === duration[2].beneficiary_request_duration_id}
          />
          <label htmlFor="permanent"> به‌صورت دائمی </label>
        </div>
      </fieldset>

      {duration.find(item => item.beneficiary_request_duration_name=== 'one_time').beneficiary_request_duration_id === selectedDuration ?
            <div className="time-layer2 input-space" id="time-layer2-one-time">
        <label htmlFor="time-layer2-one-time-id" className="label-space"> آخرین زمانی که می‌خواهید درخواست شما انجام شود، چه تاریخی است؟<sup>*</sup></label>
        
  <DatePicker
    value={jalaliValue}
    onChange={(dateObj) => {
      setJalaliValue(dateObj);
      const gregorianDate = dateObj.toDate();
      const isoDate = gregorianDate.toISOString().split("T")[0];
      setOneTimeData(prev => ({
        ...prev,
        beneficiary_request_duration_onetime_deadline: isoDate,
      }));
    }}
    calendar={persian}
    locale={persian_fa_custom}
    calendarPosition="bottom-center"
    placeholder="تاریخ را انتخاب کنید"
    inputClass="custom-datepicker-input"
    minDate={todayJalali}
  />



</div>:null}
            {
                duration.find(item => item.beneficiary_request_duration_name=== 'recurring').beneficiary_request_duration_id === selectedDuration ?
                 <div className="time-layer2 input-space" id="time-layer2-recurring">
        <label htmlFor="time-layer2-recurring-id" className="label-space"> دوره‌های ماهانه درخواست شما چه تعداد است؟ <sup>*</sup></label>
        <input type="number" id="time-layer2-recurring-id" placeholder=" برای مثال: ۱۲" required min="1" step="1" value={recurringData.beneficiary_request_duration_recurring_limit} onChange={handleLimitChange}/>
      </div>:null
            }

      
     

      <div className="cash-input-wrapper input-space">
        {duration.find(item => item.beneficiary_request_duration_name=== 'one_time').beneficiary_request_duration_id === selectedDuration ?<label htmlFor="cash-amount" className="label-space" id="cash-input-one-time-permanent"> مبلغ (به تومان) مورد نیاز شما برای این درخواست چه مقدار است؟ <sup>*</sup></label>:null}
        {duration.find(item => item.beneficiary_request_duration_name=== 'recurring').beneficiary_request_duration_id === selectedDuration ?<label htmlFor="cash-amount" className="label-space" id="cash-input-recurring"> مبلغ (به تومان) مورد نیاز شما برای هر ماه چه مقدار است؟ <sup>*</sup></label>:null}
        {
            duration.find(item => item.beneficiary_request_duration_name=== 'one_time').beneficiary_request_duration_id === selectedDuration || duration.find(item => item.beneficiary_request_duration_name=== 'recurring').beneficiary_request_duration_id === selectedDuration?
                <><div className="cash-input-box">
          <input type="text" id="cash-amount" name="cash_amount" inputMode="numeric" placeholder="برای مثال: ۱٫۰۰۰٫۰۰۰" value={dispalyValue} onChange={handleAmountChange}/>
        </div>
        <div id="cash-in-words" className="amount-preview"></div></>:
        null
        }
        
        
      </div>

      <div></div>
    </form>

    <div className="next-back-btn">
      <button onClick={() => setStep(pre => pre - 1)}>
        <img src={back_icon} alt=" " />
        <span> قبلی</span>
      </button>

      {nextActive ?<div className="next-btn">
                <button onClick={() => setStep(pre => pre + 1)}>
                    <span> بعدی</span>
                    <img src={next_icon} alt="دکمه بعدی" />
                </button>
                </div>:
                <div class="next-lock-btn">
                    <button>
                    <span> بعدی</span>
                    <svg width="21" height="32" viewBox="0 0 21 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.3184 1.22266C16.7343 0.75704 15.884 0.790223 15.3379 1.32227L1.38574 14.9258L1.2793 15.041C0.817171 15.5952 0.81717 16.4048 1.2793 16.959L1.38574 17.0742L15.3379 30.6777C15.884 31.2098 16.7343 31.243 17.3184 30.7773L17.4316 30.6777L19.6152 28.5479C20.2185 27.9596 20.2189 26.9903 19.6162 26.4014L9.33789 16.3574L9.27148 16.2783C9.15894 16.1106 9.15894 15.8894 9.27148 15.7217L9.33789 15.6426L19.6162 5.59863C20.2189 5.00974 20.2185 4.04041 19.6152 3.45215L17.4316 1.32227L17.3184 1.22266Z"/>
                    </svg>

                    </button>
                </div>}
    </div>

    <div></div>
  </main>
  <NavigationBar selected={2}/>
            {/* <p>select duration</p>
            {duration.map(element => {
                return (
                    <div 
                        key={element.beneficiary_request_duration_id} 
                        onClick={() => durationSelection(element)}
                        style={{
                            padding: '10px',
                            margin: '5px',
                            border: selectedDuration?.beneficiary_request_duration_id === element.beneficiary_request_duration_id 
                                ? '2px solid blue' 
                                : '1px solid gray',
                            cursor: 'pointer'
                        }}
                    >
                        {element.beneficiary_request_duration_name}
                    </div>
                );
            })} */}
            {/* {selectedDuration.beneficiary_request_duration_name === 'one_time'?
            <>
                <p>select deadline:</p>
                <input type="date" value={onetimeData.beneficiary_request_duration_onetime_deadline} onChange={handleDeadLineChange}/>
            </>:null}
            {
                selectedDuration.beneficiary_request_duration_name === 'recurring'?
                <>
                <p>how many times?</p>
                <input type="number" min={1} max={12} value={recurringData.beneficiary_request_duration_recurring_limit} onChange={handleLimitChange}/>
                </>:null
            } */}
        </div>
    )
}

export default Form2;