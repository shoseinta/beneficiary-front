import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../components/navigationBar/NavigationBar";
import Form1 from "./components/Form1";
import Form2 from "./components/Form2";
import Form3 from "./components/Form3";
import Form4 from "./components/Form4";
import { useLookup } from "../../context/LookUpContext";

function NewRequest() {
    const navigate = useNavigate();

    const {loading, error, duration, typeLayerOne, typeLayerTwo, setActiveEndpoint} = useLookup()
    
    const [requestData, setRequestData] = useState({
        beneficiary_request_title: "",
        beneficiary_request_description: "",
        beneficiary_request_document: null,
        beneficiary_request_amount: "",
        beneficiary_request_type_layer1: "",
        beneficiary_request_type_layer2: "",
        beneficiary_request_duration: "",
    });
    const [step, setStep] = useState(1);
    const [onetimeData, setOneTimeData] = useState({
        beneficiary_request_duration_onetime_deadline: "",
    });
    const [recurringData, setRecurringData] = useState({
        beneficiary_request_duration_recurring_limit: "",
    });
    const [nextActive, setNextActive] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            Object.entries(requestData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            const response = await fetch(
                `http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-create/`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('access_token')}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Request creation failed');
            }

            const result = await response.json();
            const selectedDuration = duration.find(
                d => d.beneficiary_request_duration_id === requestData.beneficiary_request_duration
            );

            if (!selectedDuration) {
                throw new Error('Duration not found');
            }

            if (selectedDuration.beneficiary_request_duration_name === 'one_time') {
                const durationResponse = await fetch(
                    `http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-create-onetime/${result.beneficiary_request_id}/`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Token ${localStorage.getItem('access_token')}`,
                        },
                        body: JSON.stringify({
                            beneficiary_request_duration_onetime_deadline: 
                                onetimeData.beneficiary_request_duration_onetime_deadline
                        }),
                    }
                );
                
                if (!durationResponse.ok) {
                    throw new Error('One-time duration creation failed');
                }
            } 
            else if (selectedDuration.beneficiary_request_duration_name === 'recurring') {
                const durationResponse = await fetch(
                    `http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-create-recurring/${result.beneficiary_request_id}/`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Token ${localStorage.getItem('access_token')}`,
                        },
                        body: JSON.stringify({
                            beneficiary_request_duration_recurring_limit: 
                                recurringData.beneficiary_request_duration_recurring_limit
                        }),
                    }
                );
                
                if (!durationResponse.ok) {
                    throw new Error('Recurring duration creation failed');
                }
            }

            setSubmitSuccess(true);
            setActiveEndpoint(0);
            setTimeout(() => navigate('/requests'), 5000);
        } catch (err) {
            console.error('Submission error:', err);
            alert(`Submission failed: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <p>Loading lookups...</p>;
    if (error) return <p>Error loading lookups: {error}</p>;
    if (submitSuccess) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
                padding: '20px'
            }}>
                <h2 style={{ color: 'green', marginBottom: '20px' }}>
                    Request Submitted Successfully!
                </h2>
                <p style={{ fontSize: '18px' }}>
                    You will be redirected to your requests page shortly...
                </p>
            </div>
        );
    }

    return (
        <>
            {step === 1 && <Form1 requestData={requestData} setRequestData={setRequestData} setNextActive={setNextActive} typeLayerOne={typeLayerOne} typeLayerTwo={typeLayerTwo} />}
            {step === 2 && <Form2 duration={duration} setOneTimeData={setOneTimeData} setRecurringData={setRecurringData} setRequestData={setRequestData} onetimeData={onetimeData} recurringData={recurringData} requestData={requestData} setNextActive={setNextActive} />}
            {step === 3 && <Form3 requestData={requestData} setRequestData={setRequestData} />}
            {step === 4 && <Form4 requestData={requestData} onetimeData={onetimeData} recurringData={recurringData} typeLayerOne={typeLayerOne} typeLayerTwo={typeLayerTwo} duration={duration} />}
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '20px 0' }}>
                {step !== 1 && (
                    <button 
                        onClick={() => setStep(pre => pre - 1)}
                        style={{ padding: '10px 20px' }}
                    >
                        Previous
                    </button>
                )}
                {step !== 4 && nextActive && (
                    <button 
                        onClick={() => setStep(pre => pre + 1)}
                        style={{ padding: '10px 20px' }}
                    >
                        Next
                    </button>
                )}
                {step === 4 && (
                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        style={{ 
                            padding: '10px 20px',
                            backgroundColor: isSubmitting ? '#ccc' : '#4CAF50',
                            color: 'white'
                        }}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                )}
            </div>
            <NavigationBar />
        </>
    );
}

export default NewRequest;