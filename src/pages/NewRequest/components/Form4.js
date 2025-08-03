import Header from '../../../components/header/Header';
import NavigationBar from '../../../components/navigationBar/NavigationBar';
import step1_completed from '../../../media/icons/step1_completed.svg';
import step2_completed from '../../../media/icons/step2_completed.svg';
import step3_completed from '../../../media/icons/step3_completed.svg';
import step4_active from '../../../media/icons/step4_active.svg';
import back_icon from '../../../media/icons/back_icon.svg';
import { useEffect, useState } from 'react';
import './Form4.css';
import {
  FiFile,
  FiImage,
  FiVideo,
  FiMusic,
  FiFileText,
  FiX,
} from 'react-icons/fi';
import { toJalaali } from 'jalaali-js';
import FormHeader from './FormHeader';
import LoadingButton from '../../../components/loadingButton/LoadingButton';

function Form4({
  requestData,
  onetimeData,
  recurringData,
  typeLayerOne,
  typeLayerTwo,
  duration,
  setStep,
  handleSubmit,
  files,
  setFiles,
  submitSuccess,
  isLoadingButton
}) {
  const [typeLayerOneValue, setTypeLayerOneValue] = useState(null);
  const [typeLayerTwoValue, setTypeLayerTwoValue] = useState(null);
  const [durationValue, setDurationValue] = useState(null);
  const [durationTwoValue, setDurationTwoValue] = useState(null);
  const [amountValue, setAmountValue] = useState(null);

  const [borderDiff, setBorderDiff] = useState(0);

useEffect(() => {
  const button = document.querySelector('.submit-button-review');
  if (button && !isLoadingButton) {
    const rect = button.getBoundingClientRect();
    const leftX = rect.left;
    const rightX = rect.right;
    setBorderDiff(rightX - leftX);
    console.log(rightX - leftX);
  }
}, [isLoadingButton]);

  const getFileIcon = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();
    const type = file.type.split('/')[0];

    switch (type) {
      case 'image':
        return <FiImage className="file-icon" />;
      case 'video':
        return <FiVideo className="file-icon" />;
      case 'audio':
        return <FiMusic className="file-icon" />;
      default:
        switch (extension) {
          case 'pdf':
            return <FiFileText className="file-icon" />;
          case 'doc':
          case 'docx':
            return <FiFileText className="file-icon" />;
          case 'xls':
          case 'xlsx':
            return <FiFileText className="file-icon" />;
          case 'txt':
            return <FiFileText className="file-icon" />;
          default:
            return <FiFile className="file-icon" />;
        }
    }
  };

  function formatPersianNumber(number) {
    // Convert to Persian digits
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

    // Add commas and convert each digit
    return number
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '٬')
      .replace(/\d/g, (d) => persianDigits[d]);
  }

  const toPersianDigits = (num) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, (d) => persianDigits[d]);
  };

  // Function to convert Gregorian to Jalali date
  const gregorianToJalali = (dateString) => {
    if (!dateString) return 'تاریخ نامشخص';

    try {
      const [year, month, day] = dateString
        .split('T')[0]
        .split('-')
        .map(Number);
      const { jy, jm, jd } = toJalaali(year, month, day);
      return `${toPersianDigits(jy)}/${toPersianDigits(jm)}/${toPersianDigits(jd)}`;
    } catch (error) {
      console.error('Date conversion error:', error);
      return 'تاریخ نامشخص';
    }
  };

  useEffect(() => {
    const typeOne = typeLayerOne.find(
      (element) =>
        element.beneficiary_request_type_layer1_id ===
        requestData.beneficiary_request_type_layer1
    );
    if (typeOne.beneficiary_request_type_layer1_id === 1) {
      setTypeLayerOneValue('کالا');
    } else if (typeOne.beneficiary_request_type_layer1_id === 2) {
      setTypeLayerOneValue('وجه نقد');
    } else {
      setTypeLayerOneValue('خدمت');
    }

    const typeTwo = typeLayerTwo.find(
      (element) =>
        element.beneficiary_request_type_layer2_id ===
        requestData.beneficiary_request_type_layer2
    );
    setTypeLayerTwoValue(typeTwo.beneficiary_request_type_layer2_name);

    const dur = duration.find(
      (element) =>
        element.beneficiary_request_duration_id ===
        requestData.beneficiary_request_duration
    );
    if (dur.beneficiary_request_duration_name === 'one_time') {
      setDurationValue('فقط یکبار');
    } else if (dur.beneficiary_request_duration_name === 'recurring') {
      setDurationValue('به صورت ماهانه');
    } else {
      setDurationValue('به صورت دائمی');
    }

    if (dur.beneficiary_request_duration_name === 'one_time') {
      setDurationTwoValue(
        gregorianToJalali(
          onetimeData.beneficiary_request_duration_onetime_deadline
        )
      );
    } else if (dur.beneficiary_request_duration_name === 'recurring') {
      setDurationTwoValue(
        `${toPersianDigits(recurringData.beneficiary_request_duration_recurring_limit)} دوره ماهانه  `
      );
    }

    setAmountValue(
      `${formatPersianNumber(Number(requestData.beneficiary_request_amount))} تومان`
    );
  }, [requestData, onetimeData, recurringData]);

  useEffect(() => {
    document.documentElement.classList.add('form4-html');
    document.body.classList.add('form4-body');

    return () => {
      document.documentElement.classList.remove('form4-html');
      document.body.classList.remove('form4-body');
    };
  }, []);

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
    <>
    <div className="form4-container disabled">
      <Header />
      <main className="main">
        <FormHeader step={4} />

        <div className="form4-forms">

        <form className="form">
          <div className="request-type-review input-space">
            <label className="label-space" htmlFor="request-type-review1-id">
              {' '}
              نوع درخواست:{' '}
            </label>
            <input
              type="text"
              id="request-type-review1-id"
              readOnly
              value={typeLayerOneValue}
            />
          </div>

          <div className="request-type-review input-space">
            <label htmlFor="request-type-review2-id" className="label-space">
              {' '}
              دسته درخواست:{' '}
            </label>
            <input
              type="text"
              id="request-type-review2-id"
              readOnly
              value={typeLayerTwoValue}
            />
          </div>
        </form>

        <form className="form">
          <div className="request-time-review input-space">
            <label className="label-space" htmlFor="request-time-review1-id">
              {' '}
              نوع زمانی درخواست:{' '}
            </label>
            <input
              type="text"
              id="request-time-review1-id"
              readOnly
              value={durationValue}
            />
          </div>

          {(durationValue === 'فقط یکبار' ||
            durationValue === 'به صورت ماهانه') && (
            <div className="request-time-review input-space">
              {durationValue === 'فقط یکبار' && (
                <label
                  htmlFor="request-time-review2-id"
                  className="label-space"
                  id="request-time-review2-one-time-id"
                >
                  {' '}
                  تاریخ دریافت درخواست{' '}
                </label>
              )}
              {durationValue === 'به صورت ماهانه' && (
                <label
                  htmlFor="request-time-review2-id"
                  className="label-space"
                  id="request-time-review2-recurring-id"
                >
                  {' '}
                  تعداد دوره‌های درخواست:{' '}
                </label>
              )}
              <input
                type="text"
                id="request-time-review2-id"
                readOnly
                value={durationTwoValue}
              />
            </div>
          )}

          {durationValue !== "به صورت دائمی" && typeLayerOneValue === 'وجه نقد' &&
            <div className="request-cash-review input-space">
            <label className="label-space" htmlFor="request-cash-review1-id">
              {' '}
              مبلغ درخواست:{' '}
            </label>
            <input
              type="text"
              id="request-cash-review1-id"
              readOnly
              value={amountValue}
            />
          </div>}
        </form>

        <form className="form">
          <div className="request-title-review input-space">
            <label className="label-space" htmlFor="request-title-review1-id">
              {' '}
              عنوان درخواست:{' '}
            </label>
            {requestData.beneficiary_request_title === '' ? (
              <input
                type="text"
                id="request-title-review1-id"
                readOnly
                placeholder="اطلاعاتی وجود ندارد"
              />
            ) : (
              <input
                type="text"
                id="request-title-review1-id"
                readOnly
                value={requestData.beneficiary_request_title}
              />
            )}
          </div>

          <div className="request-description-review input-space">
            <label
              htmlFor="request-description-review1-id"
              className="label-space"
            >
              {' '}
              توضیحات درخواست:{' '}
            </label>
            {requestData.beneficiary_request_description === '' ? (
              <textarea
                type="text"
                id="request-description-review1-id"
                readOnly
                placeholder="اطلاعاتی وجود ندارد"
              ></textarea>
            ) : (
              <textarea
                type="text"
                id="request-description-review1-id"
                readOnly
                placeholder="اطلاعاتی وجود ندارد"
              >
                {requestData.beneficiary_request_description}
              </textarea>
            )}
          </div>

          <div className="request-document-review input-space">
            <label
              htmlFor="request-document-review1-id"
              className="label-space"
              readOnly
            >
              {' '}
              مستندات درخواست:{' '}
            </label>
            {files.length > 0 && (
              <label
                  htmlFor="request-document-review1-id"
                  className="upload-label"
                  id="label-for-file-input"
                  readOnly
                >
                
                
              <div className="file-previews">
                {files.map((file, index) => (
                  <div key={index} className="file-preview">
                    <div className="file-info">
                      {getFileIcon(file)}
                      <span
                        className="file-name"
                        onClick={() => window.open(URL.createObjectURL(file))}
                      >
                        {file.name}
                      </span>
                      {/* <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)}MB</span> */}
                    </div>
                  </div>
                ))}
              </div>
              </label>
            )}
            {files.length === 0 && (
              <>
                <input
                  type="file"
                  id="request-document-review1-id"
                  multiple
                  hidden
                  readOnly
                  disabled
                />
                <label
                  htmlFor="request-document-review1-id"
                  className="upload-label"
                  id="label-for-file-input"
                  readOnly
                >
                  اطلاعاتی وجود ندارد{' '}
                </label>
              </>
            )}
          </div>
        </form>
        </div>

        <div className="next-back-btn">
          <button
            onClick={() => setStep((pre) => pre - 1)}
            className="back-button-review"
          >
            <svg width="21" height="32" viewBox="0 0 21 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.68164 1.22266C4.26572 0.75704 5.11602 0.790223 5.66211 1.32227L19.6143 14.9258L19.7207 15.041C20.1828 15.5952 20.1828 16.4048 19.7207 16.959L19.6143 17.0742L5.66211 30.6777C5.11602 31.2098 4.26572 31.243 3.68164 30.7773L3.56836 30.6777L1.38477 28.5479C0.781478 27.9596 0.781108 26.9903 1.38379 26.4014L11.6621 16.3574L11.7285 16.2783C11.8411 16.1106 11.8411 15.8894 11.7285 15.7217L11.6621 15.6426L1.38379 5.59863C0.781108 5.00974 0.781477 4.04041 1.38477 3.45215L3.56836 1.32227L3.68164 1.22266Z" fill="#FF0000" stroke="black"/>
            </svg>

            <span> قبلی</span>
          </button>

          <button style={isLoadingButton? {width:borderDiff}:null} onClick={handleSubmit} className="submit-button-review">
            <span> {isLoadingButton? <LoadingButton dimension={10} stroke={2} color={'#ffffff'} />:"تأیید نهایی و ارسال"} </span>
          </button>
        </div>

      </main>
      <NavigationBar selected={2} />
    </div>
    {
      submitSuccess && (
        <>
        <div className='block-overlay-container'></div>
        <div className="final-form">
          <svg
            width="59"
            height="59"
            viewBox="0 0 59 59"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M26.25 42L12.5417 28.2917L16.625 24.2083L26.25 33.8333L50.75 9.33333C45.2083 3.79167 37.625 0 29.1667 0C13.125 0 0 13.125 0 29.1667C0 45.2083 13.125 58.3333 29.1667 58.3333C45.2083 58.3333 58.3333 45.2083 58.3333 29.1667C58.3333 23.625 56.875 18.6667 54.25 14.2917L26.25 42Z" />
          </svg>

          <h1>درخواست شما با موفقیت ثبت گردید.</h1>

          <p>تا لحظاتی دیگر به صفحه سوابق درخواست منتقل می‌شوید.</p>
        </div>
        </>
      )
    }
    </>
  );
}

export default Form4;
