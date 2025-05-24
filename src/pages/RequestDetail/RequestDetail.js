import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLookup } from '../../context/LookUpContext';

function RequestDetail() {
  const { id } = useParams();
  const {duration, typeLayerOne, typeLayerTwo} = useLookup();
  const [isEdit,setIsEdit] = useState(false)
  const [requestData,setRequestData] = useState(null)
  const [updateData, setUpdateData] = useState(null)

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
  useEffect(()=>{
    fetchData();
  },[])

  const handleEditClick = () => {
    if(requestData.beneficiary_request_is_created_by_charity || (requestData.beneficiary_request_processing_stage !== 'Submitted' && requestData.beneficiary_request_processing_stage !== 'Pending Review' && requestData.beneficiary_request_processing_stage !== 'Under Evaluation')){
        return
    }
    setIsEdit(true)
  }

  const handleFinishEdit = async () => {
    const isConfirmed = window.confirm('are you sure about the edit?')
    if(isConfirmed){
      // try {
      //     const response = await fetch('http://localhost:8000/user-api/beneficiary/login/', {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify(formData),
      //     });
      //     if (!response.ok) {  // Check for HTTP errors (4xx/5xx)
      //       const errorData = await response.json();
      //       throw new Error(errorData.detail || 'Login failed');
      //     }
      //     const result = await response.json();
      //     console.log(result)
      //     localStorage.setItem('access_token', result.token);
      //     localStorage.setItem('user_id', result.user_id);
      //     localStorage.setItem('username', result.username);
      //     // Handle success
      //     setError(false)
      //     navigate('/home')

      //   } catch (err) {
      //     setError(true)
      //   }
      return
      
  } else {
    setIsEdit(false)
     let updateDuration;
    if (requestData.beneficiary_request_duration === 'One Time'){
      updateDuration = 1
    } else if (requestData.beneficiary_request_duration === 'Recurring'){
      updateDuration = 2
    } else {
      updateDuration = 3
    }
    let updateDurationOnetime;
    if (requestData.beneficiary_request_duration_onetime){
      updateDurationOnetime = requestData.beneficiary_request_duration_onetime
    } else {
      updateDurationOnetime = {beneficiary_request_duration_onetime_deadline: null}
    }
    let updateDurationRecurring;
    if (requestData.beneficiary_request_duration_recurring){
      updateDurationRecurring = requestData.beneficiary_request_duration_recurring
    }else {
      updateDurationRecurring = {beneficiary_request_duration_recurring_limit: null}
    }
    setUpdateData({
            beneficiary_request_title: requestData.beneficiary_request_title,
            beneficiary_request_description:requestData.beneficiary_request_description,
            beneficiary_request_amount:requestData.beneficiary_request_amount,
            beneficiary_request_duration_onetime:requestData.beneficiary_request_duration_onetime,
            beneficiary_request_duration_recurring:requestData.beneficiary_request_duration_recurring,
            beneficiary_request_duration: updateDuration,
            beneficiary_request_duration_onetime: updateDurationOnetime,
            beneficiary_request_duration_recurring: updateDurationRecurring,
          })
        }
  }

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

  useEffect(() => {
    console.log(updateData)
    console.log(duration)
  })

  if(!requestData){
    return <p>loading...</p>
  }
  
  
  return (
    <>
    {!isEdit?<div style={{border:"1px solid blue"}}>
        <p>type layer one: {requestData.beneficiary_request_type_layer1}</p>
        <p>type layer two: {requestData.beneficiary_request_type_layer2}</p>
        <p>amount: {requestData.beneficiary_request_amount}</p>
        <p>duration: {requestData.beneficiary_request_duration}</p>
        {requestData.beneficiary_request_duration === 'One Time' &&
            requestData.beneficiary_request_duration_onetime ? (
            <p>
                deadline: {
                requestData.beneficiary_request_duration_onetime
                    .beneficiary_request_duration_onetime_deadline
                }
            </p>
            ) : null}

            {requestData.beneficiary_request_duration === 'Recurring' &&
            requestData.beneficiary_request_duration_recurring ? (
            <p>
                limit: {
                requestData.beneficiary_request_duration_recurring
                    .beneficiary_request_duration_recurring_limit
                }
            </p>
            ) : null}

        <p>title: {requestData.beneficiary_request_title}</p>
        <p>description: {requestData.beneficiary_request_description}</p>
    </div>
    : 
    <div style={{border:"1px solid blue"}}>
        <p>type layer one: {requestData.beneficiary_request_type_layer1}</p>
        <p>type layer two: {requestData.beneficiary_request_type_layer2}</p>
        <p>amount</p>
        <input type='number' value={updateData.beneficiary_request_amount} onChange={handleAmountUpdate} />
        <p>duration</p>
        <select id="duration" name="duration" onChange={handleDurationUpdate}>
          {
          duration.map((item, index) => {
           let selectedItem;
           if (requestData.beneficiary_request_duration === 'One Time') {
            selectedItem = 0
           } else if (requestData.beneficiary_request_duration === 'Recurring') {
            selectedItem = 1
           }else {
            selectedItem = 2
           }
           if (selectedItem === index){
              return  <option key={index} value={Number(item.beneficiary_request_duration_id)} selected>{item.beneficiary_request_duration_name}</option>
           } else {
            return  <option key={index} value={Number(item.beneficiary_request_duration_id)}>{item.beneficiary_request_duration_name}</option>
           }
           
          })
        }
        </select>
        
        
        {updateData.beneficiary_request_duration == 1 &&
          updateData.beneficiary_request_duration_onetime ? (
          <>
            <p>deadline:</p>
            <input
              type="date"
              value={updateData.beneficiary_request_duration_onetime.beneficiary_request_duration_onetime_deadline}
              onChange={handleDeadlineChange}
            />
          </>
        ) : null}

        {updateData.beneficiary_request_duration == 2 &&
          updateData.beneficiary_request_duration_recurring && (
          <>
            <p>limit:</p>
            <input
              type="number"
              value={updateData.beneficiary_request_duration_recurring.beneficiary_request_duration_recurring_limit}
              onChange={handleLimitChange}  // Make sure this handler exists
            />
          </>
        )}

        <p>title:</p>
        <input type='text' value={updateData.beneficiary_request_title} onChange={handleTitleChange} />
        <p>description:</p>
        <textarea value={updateData.beneficiary_request_description} onChange={handleDescriptionChange} />
    </div>
    }
    <div style={{border:"1px solid blue"}}>
        <p>effective_date: {requestData.effective_date}</p>
        <p>created by: {requestData.beneficiary_request_is_created_by_charity?"charity":"you"}</p>
        <p>processing stage: {requestData.beneficiary_request_processing_stage}</p>
    </div>
    {!isEdit?<button onClick={handleEditClick}>edit</button>:<button onClick={handleFinishEdit}>finish editing</button>}
    <Link to={`/requests`} >back</Link>
    </>
  );
  
}

export default RequestDetail;
