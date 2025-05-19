import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function RequestDetail() {
  const { id } = useParams();
  const [isEdit,setIsEdit] = useState(false)
  const [requestData,setRequestData] = useState(null)

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
        } catch (err) {
          console.log(err)
        }
      }
  useEffect(()=>{
    fetchData();
  },[requestData])

  if(!requestData){
    return <p>loading...</p>
  }

  
  return (
    <>
    <div style={{border:"1px solid blue"}}>
        <p>type layer one: {requestData.beneficiary_request_type_layer1}</p>
        <p>type layer two: {requestData.beneficiary_request_type_layer2}</p>
        <p>amount: {requestData.beneficiary_request_amount}</p>
        <p>duration: {requestData.beneficiary_request_duration}</p>
        {requestData.beneficiary_request_duration === 'one_time'?<p>deadline: {requestData.beneficiary_request_duration_onetime.beneficiary_request_duration_onetime_deadline}</p>:null}
        {requestData.beneficiary_request_duration === 'recurring'?<p>deadline: {requestData.beneficiary_request_duration_recurring.beneficiary_request_duration_recurring_limit}</p>:null}
        <p>title: {requestData.beneficiary_request_title}</p>
        <p>description: {requestData.beneficiary_request_description}</p>
        {requestData.beneficiary_request_document && (
        <div style={{ border: "1px solid green", marginTop: "20px", padding: "10px" }}>
            <h3>Attached Document</h3>
            <p>File name: {requestData.beneficiary_request_document.split('/').pop()}</p>
            <a
            href={`${requestData.beneficiary_request_document}`}
            download
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: "inline-block",
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                marginTop: "10px"
            }}
            >
            ⬇️ Download File
            </a>
        </div>
        )}

    </div>
    <div style={{border:"1px solid blue"}}>
        <p>effective_date: {requestData.effective_date}</p>
        <p>created by: {requestData.beneficiary_request_is_created_by_charity?"charity":"you"}</p>
        <p>processing stage: {requestData.beneficiary_request_processing_stage}</p>
    </div>
    <Link to={`/requests`} >back</Link>
    </>
  );
  
}

export default RequestDetail;
