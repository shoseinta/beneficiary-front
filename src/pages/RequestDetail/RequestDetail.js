import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useLookup } from '../../context/LookUpContext';

function RequestDetail() {
  const { id } = useParams();
  const {duration} = useLookup();
  const [isEdit,setIsEdit] = useState(false)
  const [requestData,setRequestData] = useState(null)
  const [updateData, setUpdateData] = useState(null)
  const navigate = useNavigate();

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

  // useEffect(() => {
  //   console.log(updateData)
  //   console.log(duration)
  // })

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
    <button onClick={handleDelete}>delete</button>
    <Link to={`/requests`} >back</Link>
    </>
  );
  
}

export default RequestDetail;
