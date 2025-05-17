import { useState,useEffect } from "react";
function Form2({setOneTimeData, setRecurringData, duration, setRequestData, onetimeData, recurringData, requestData, setNextActive}){
    const [selectedDuration,setSelectedDuration] = useState(null);
    const durationSelection = (element) => {
            setSelectedDuration(element);
            //setRequestData(pre => ({...pre, beneficiary_request_type_layer1:typeLayerOne.beneficiary_request_type_layer1_id}))
            
        }
    const handleDeadLineChange = (event) => {
        setOneTimeData(pre => ({...pre,beneficiary_request_duration_onetime_deadline:event.target.value}))
    }
    const handleLimitChange = (event) => {
        setRecurringData(pre => ({...pre,beneficiary_request_duration_recurring_limit:Number(event.target.value)}))
    }
     useEffect(() => {
            if(selectedDuration){
                setRequestData(pre => ({...pre, beneficiary_request_duration:selectedDuration.beneficiary_request_duration_id}))
            }
            
        },[selectedDuration])
    useEffect(() => {
            if (duration && duration.length > 0) {
                setSelectedDuration(duration[0]);
            }
        }, [duration]);


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
    if (!duration || !Array.isArray(duration)) {
        return <p>Loading options...</p>;
    }

    if (!selectedDuration) {
        return <p>Loading selection...</p>;
    }
    return(
        <>
            <p>select duration</p>
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
            })}
            {selectedDuration.beneficiary_request_duration_name === 'one_time'?
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
            }
        </>
    )
}

export default Form2;