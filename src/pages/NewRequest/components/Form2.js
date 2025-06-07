import { useState,useEffect } from "react";
import Header from "../../../components/header/Header";
import NavigationBar from "../../../components/navigationBar/NavigationBar";
import step1_completed from '../../../media/icons/step1_completed.svg';
import step2_active from '../../../media/icons/step2_active.svg';
import step3 from '../../../media/icons/step3.svg';
import step4 from '../../../media/icons/step4.svg';
import back_icon from '../../../media/icons/back_icon.svg'
import next_icon from '../../../media/icons/next_icon.svg'
import './Form2.css'
function Form2({setOneTimeData, setRecurringData, duration, setRequestData, onetimeData, recurringData, requestData, setNextActive, setStep}){
    const [selectedDuration,setSelectedDuration] = useState(requestData.beneficiary_request_duration);
    
    const handleDeadLineChange = (event) => {
        setOneTimeData(pre => ({...pre,beneficiary_request_duration_onetime_deadline:event.target.value}))
    }
    const handleLimitChange = (event) => {
        setRecurringData(pre => ({...pre,beneficiary_request_duration_recurring_limit:Number(event.target.value)}))
    }

    const handleDurationChange = (event) => {
      setSelectedDuration(Number(event.target.value))
      setRequestData(pre => ({...pre, beneficiary_request_duration:Number(event.target.value)}))
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
        if (requestData.beneficiary_request_duration && selectedDuration?.beneficiary_request_duration_name === 'one_time' && onetimeData?.beneficiary_request_duration_onetime_deadline){
            isFormComplete = true
        }
        if (requestData.beneficiary_request_duration && selectedDuration?.beneficiary_request_duration_name === 'recurring' && recurringData?.beneficiary_request_duration_recurring_limit){
            isFormComplete = true
        }
        if(requestData.beneficiary_request_duration && selectedDuration?.beneficiary_request_duration_name === 'permanent'){
            isFormComplete = true
        }
       setNextActive(isFormComplete) 
    },[requestData,onetimeData,recurringData])

    const handleAmountChange = e => {
        setRequestData(pre => {
            return {...pre, beneficiary_request_amount:Number(e.target.value)}
        })
    }
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
        <input type="date" id="time-layer2-one-time-id" placeholder="تاریخ را انتخاب کنید"  required value={onetimeData.beneficiary_request_duration_onetime_deadline} onChange={handleDeadLineChange}/>
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
          <input type="text" id="cash-amount" name="cash_amount" inputMode="numeric" placeholder="برای مثال: ۱٫۰۰۰٫۰۰۰" value={requestData.beneficiary_request_amount} onChange={handleAmountChange}/>
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

      <button onClick={() => setStep(pre => pre + 1)}>
        <span> بعدی</span>
        <img src={next_icon} alt=" " />
      </button>
    </div>

    <div></div>
  </main>
  <NavigationBar />
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