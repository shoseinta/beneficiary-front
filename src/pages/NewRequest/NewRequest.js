import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form1 from './components/Form1';
import Form2 from './components/Form2';
import Form3 from './components/Form3';
import Form4 from './components/Form4';
import { useLookup } from '../../context/LookUpContext';

function NewRequest() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'صفحه ایجاد درخواست خیریه';
  }, []);

  const {
    loading,
    error,
    duration,
    typeLayerOne,
    typeLayerTwo,
  } = useLookup();
  const [files, setFiles] = useState([]);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [requestData, setRequestData] = useState({
    beneficiary_request_title: '',
    beneficiary_request_description: '',
    beneficiary_request_document: null,
    beneficiary_request_amount: '',
    beneficiary_request_type_layer1: '',
    beneficiary_request_type_layer2: '',
    beneficiary_request_duration: '',
  });
  const [step, setStep] = useState(1);
  const [onetimeData, setOneTimeData] = useState({
    beneficiary_request_duration_onetime_deadline: '',
  });
  const [recurringData, setRecurringData] = useState({
    beneficiary_request_duration_recurring_limit: '',
  });
  useEffect(() => {
    console.log(recurringData);
  });
  const [nextActive, setNextActive] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setIsLoadingButton(true);
    try {
      const formData = new FormData();
      Object.entries(requestData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await fetch(
        `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-create/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${localStorage.getItem('access_token')}`,
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
        (d) =>
          d.beneficiary_request_duration_id ===
          requestData.beneficiary_request_duration
      );

      if (!selectedDuration) {
        throw new Error('Duration not found');
      }

      if (selectedDuration.beneficiary_request_duration_name === 'one_time') {
        const durationResponse = await fetch(
          `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-create-onetime/${result.beneficiary_request_id}/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({
              beneficiary_request_duration_onetime_deadline:
                onetimeData.beneficiary_request_duration_onetime_deadline,
            }),
          }
        );

        if (!durationResponse.ok) {
          throw new Error('One-time duration creation failed');
        }
      } else if (
        selectedDuration.beneficiary_request_duration_name === 'recurring'
      ) {
        const durationResponse = await fetch(
          `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-create-recurring/${result.beneficiary_request_id}/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({
              beneficiary_request_duration_recurring_limit:
                recurringData.beneficiary_request_duration_recurring_limit,
            }),
          }
        );

        if (!durationResponse.ok) {
          throw new Error('Recurring duration creation failed');
        }
      }

      setSubmitSuccess(true);
      setIsLoadingButton(false);
      setTimeout(() => {
        setSubmitSuccess(false);
        navigate('/requests')}, 1000);
    } catch (err) {
      setIsLoadingButton(false);
      console.error('Submission error:', err);
      alert(`Submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log(onetimeData);
  });
  if (loading) return <p>Loading lookups...</p>;
  if (error) return <p>Error loading lookups: {error}</p>;
  

  return (
    <>
      {step === 1 && (
        <Form1
          requestData={requestData}
          setRequestData={setRequestData}
          nextActive={nextActive}
          setNextActive={setNextActive}
          typeLayerOne={typeLayerOne}
          typeLayerTwo={typeLayerTwo}
          setStep={setStep}
        />
      )}
      {step === 2 && (
        <Form2
          duration={duration}
          setOneTimeData={setOneTimeData}
          setRecurringData={setRecurringData}
          setRequestData={setRequestData}
          onetimeData={onetimeData}
          recurringData={recurringData}
          requestData={requestData}
          nextActive={nextActive}
          setNextActive={setNextActive}
          setStep={setStep}
          typeLayerOne={typeLayerOne}
        />
      )}
      {step === 3 && (
        <Form3
          requestData={requestData}
          setRequestData={setRequestData}
          setStep={setStep}
          files={files}
          setFiles={setFiles}
        />
      )}
      {step === 4 && (
        <Form4
          requestData={requestData}
          onetimeData={onetimeData}
          recurringData={recurringData}
          typeLayerOne={typeLayerOne}
          typeLayerTwo={typeLayerTwo}
          duration={duration}
          setStep={setStep}
          handleSubmit={handleSubmit}
          files={files}
          setFiles={setFiles}
          submitSuccess={submitSuccess}
          isLoadingButton={isLoadingButton}
        />
      )}
    </>
  );
}

export default NewRequest;
