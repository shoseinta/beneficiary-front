import Header from '../../../components/header/Header';
import NavigationBar from '../../../components/navigationBar/NavigationBar';
import back_icon from '../../../media/icons/back_icon.svg';
import confirm_icon from '../../../media/icons/confirm_icon.svg';
import attach_icon from '../../../media/icons/attach_icon.svg';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import DateObject from 'react-date-object';
import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  FiFile,
  FiImage,
  FiVideo,
  FiMusic,
  FiFileText,
  FiX,
} from 'react-icons/fi';
import JSZip from 'jszip';
import { toJalaali } from 'jalaali-js';
import LoadingButton from '../../../components/loadingButton/LoadingButton';

function RequestDetailEdit({
  isEdit,
  setIsEdit,
  updateData,
  setUpdateData,
  requestData,
  setRequestData,
  fetchData,
  id,
  convertTypeLayer1,
  convertStage,
  formatPersianNumber,
  files,
  setFiles,
}) {
  const [isCreatingZip, setIsCreatingZip] = useState(false);
  const [files1, setFiles1] = useState(files);
  const [editApplied, setEditApplied] = useState(false);
  const [isLoadingButtonDelete, setIsLoadingButtonDelete] = useState(false)
  const [childCreateBorderDiff, setChildCreateBorderDiff] = useState(0)
  useEffect(() => {
    const button = document.querySelector('.delete-overlay-buttons .yes-button');
    console.log(button)
    if (button && !isLoadingButtonDelete && editApplied) {
      const rect = button.getBoundingClientRect();
      const leftX = rect.left;
      const rightX = rect.right;
      setChildCreateBorderDiff(rightX - leftX);
      console.log(rightX - leftX)
    }
  }, [isLoadingButtonDelete, editApplied]);
  const onDrop = useCallback((acceptedfiles1) => {
    setFiles1((prev) => {
      const newFiles = [...prev, ...acceptedfiles1];
      if (acceptedfiles1.length > 0) {
        setIsCreatingZip(true);
        const zip = new JSZip();

        // Add existing and new files1 to zip
        files1.forEach((file) => zip.file(file.name, file));
        acceptedfiles1.forEach((file) => zip.file(file.name, file));

        zip
          .generateAsync({ type: 'blob' })
          .then((zipContent) => {
            const zipFile = new File([zipContent], 'documents.zip');
            setUpdateData((prev) => ({
              ...prev,
              beneficiary_request_document: zipFile,
            }));
          })
          .finally(() => setIsCreatingZip(false));
      }
      return newFiles;
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.heic', '.heif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  });

  useEffect(() => {
    console.log(requestData)
  })

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

  const handleRemoveFile = (indexToRemove) => {
    setFiles1((prevfiles1) => {
      const updated = [...prevfiles1];
      updated.splice(indexToRemove, 1);

      if (updated.length > 0) {
        const zip = new JSZip();
        updated.forEach((file) => {
          zip.file(file.name, file);
        });

        zip.generateAsync({ type: 'blob' }).then((zipContent) => {
          const zipFile = new File([zipContent], 'documents.zip', {
            type: 'application/zip',
          });
          setUpdateData((prev) => ({
            ...prev,
            beneficiary_request_document: zipFile,
          }));
        });
      } else {
        setUpdateData((prev) => ({
          ...prev,
          beneficiary_request_document: null,
        }));
      }

      return updated;
    });
  };
  const gregorianToJalali = (dateString) => {
    if (!dateString) return null;

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
  const todayJalali = new DateObject({ calendar: persian, locale: persian_fa });
  const [jalaliValue, setJalaliValue] = useState(() => {
  const dateStr =
    updateData?.beneficiary_request_duration_onetime
      ?.beneficiary_request_duration_onetime_deadline;

  return dateStr
    ? new DateObject({ date: dateStr, calendar: 'gregorian' })
        .convert(persian)
        .setLocale(persian_fa)
    : null;
});
  

  const [validation, setValidation] = useState({
    deadline: true,
    limit: true,
    amount: true,
  });

  const [blur, setBlur] = useState({
    deadline: true,
    limit: true,
    amount: true,
  });
  const [finishEdit, setFinishEdit] = useState(false);
  useEffect(() => {
    const newValidation = {
      deadline:
        updateData.beneficiary_request_duration !== 1 ||
        !!updateData?.beneficiary_request_duration_onetime
          ?.beneficiary_request_duration_onetime_deadline,
      limit:
        updateData.beneficiary_request_duration !== 2 ||
        (updateData?.beneficiary_request_duration_recurring
          ?.beneficiary_request_duration_recurring_limit >= 1 &&
          updateData?.beneficiary_request_duration_recurring
            ?.beneficiary_request_duration_recurring_limit <= 12),
      amount:
        updateData?.beneficiary_request_duration === 3 ||
        (updateData?.beneficiary_request_duration !== 3 &&
          updateData?.beneficiary_request_amount) || 
          (requestData?.beneficiary_request_type_layer1 !== "Cash")
    };
    setValidation(newValidation);
  }, [updateData]);

  const persian_fa_custom = {
    months: [
      ['فروردین', 'فروردین'],
      ['اردیبهشت', 'اردیبهشت'],
      ['خرداد', 'خرداد'],
      ['تیر', 'تیر'],
      ['مرداد', 'مرداد'],
      ['شهریور', 'شهریور'],
      ['مهر', 'مهر'],
      ['آبان', 'آبان'],
      ['آذر', 'آذر'],
      ['دی', 'دی'],
      ['بهمن', 'بهمن'],
      ['اسفند', 'اسفند'],
    ],
    weekDays: [
      ['شنبه', 'شنبه'],
      ['یک‌شنبه', 'یک'],
      ['دوشنبه', 'دو'],
      ['سه‌شنبه', 'سه'],
      ['چهارشنبه', 'چهار'],
      ['پنج‌شنبه', 'پنج'],
      ['جمعه', 'جمعه'],
    ],
    digits: ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'],
  };

  const toPersianDigits = (num) => {
    if (num) {
      const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      return num.toString().replace(/\d/g, (d) => persianDigits[d]);
    } else {
      return null;
    }
  };

  // Function to convert Gregorian to Jalali date
  
  useEffect(() => {
    console.log(updateData);
  });

//   useEffect(() => {
//      if (updateData?.beneficiary_request_duration_onetime?.beneficiary_request_duration_onetime_deadline && updateData?.beneficiary_request_duration_onetime?.beneficiary_request_duration_onetime_deadline !== "") {
//   const newDate = new DateObject({
//     date: updateData.beneficiary_request_duration_onetime.beneficiary_request_duration_onetime_deadline,
//     calendar: 'gregorian',
//   }).convert(persian).setLocale(persian_fa);

//   setJalaliValue(newDate);
// } else {
//   setJalaliValue(null); // don't default to today
// }
//   }, [
//     updateData?.beneficiary_request_duration_onetime
//       ?.beneficiary_request_duration_onetime_deadline,
//   ]);

  const handleFinishEdit = async () => {
    if (
      (updateData?.beneficiary_request_duration === 1 &&
        !validation.deadline) ||
      (updateData?.beneficiary_request_duration === 2 && !validation.limit) ||
      !validation.amount
    ) {
      return;
    }
    setIsLoadingButtonDelete(true)
    try {
      var sendData;
      var requestHeaders;
      if (updateData.beneficiary_request_document) {
        // Prepare the main request data
        const requestDataToSend = new FormData();

        requestDataToSend.append(
          'beneficiary_request_title',
          updateData.beneficiary_request_title
        );
        requestDataToSend.append(
          'beneficiary_request_description',
          updateData.beneficiary_request_description
        );
        if (
          updateData.beneficiary_request_amount &&
          updateData.beneficiary_request_duration !== 3 &&
          requestData.beneficiary_request_type_layer1 === "Cash"
        ) {
          requestDataToSend.append(
            'beneficiary_request_amount',
            updateData.beneficiary_request_amount
          );
        } else {
          requestDataToSend.append('beneficiary_request_amount', "null");
        }
        requestDataToSend.append(
          'beneficiary_request_duration',
          updateData.beneficiary_request_duration
        );
        if (updateData.beneficiary_request_document) {
          requestDataToSend.append(
            'beneficiary_request_document',
            updateData.beneficiary_request_document
          );
        } else {
          requestDataToSend.append('beneficiary_request_document', "null");
        }
        sendData = requestDataToSend;
        requestHeaders = {
          // 'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('access_token')}`,
        };
      } else {
        sendData = JSON.stringify({
          beneficiary_request_title: updateData.beneficiary_request_title,
          beneficiary_request_description:
            updateData.beneficiary_request_description,
          beneficiary_request_amount:
            updateData?.beneficiary_request_amount || null,
          beneficiary_request_duration: updateData.beneficiary_request_duration,
          beneficiary_request_document: null,
        });
        requestHeaders = {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('access_token')}`,
        };
      }

      // Send main request update
      const response = await fetch(
        `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-single-update/${id}/`,
        {
          method: 'PATCH',
          headers: requestHeaders,
          body: sendData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'request update failed');
      }

      // Handle duration-specific updates
      if (updateData.beneficiary_request_duration === 1) {
        const updateOnetime = {
          beneficiary_request_duration_onetime_deadline:
            updateData.beneficiary_request_duration_onetime
              ?.beneficiary_request_duration_onetime_deadline,
        };

        if (requestData.beneficiary_request_duration_onetime) {
          const onetimeId =
            requestData.beneficiary_request_duration_onetime
              .beneficiary_request_duration_onetime_id;
          // Update existing one-time
          const onetimeResponse = await fetch(
            `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-single-update-onetime/${onetimeId}/`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('access_token')}`,
              },
              body: JSON.stringify(updateOnetime),
            }
          );
          if (!onetimeResponse.ok) {
            const errorData = await onetimeResponse.json();
            throw new Error(errorData.detail || 'onetime update failed');
          }
        } else {
          // Create new one-time
          const onetimeResponse = await fetch(
            `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-create-onetime/${id}/`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('access_token')}`,
              },
              body: JSON.stringify(updateOnetime),
            }
          );
          if (!onetimeResponse.ok) {
            const errorData = await onetimeResponse.json();
            throw new Error(errorData.detail || 'onetime create failed');
          }
        }
      } else if (updateData.beneficiary_request_duration === 2) {
        const updateRecurring = {
          beneficiary_request_duration_recurring_limit:
            updateData.beneficiary_request_duration_recurring
              ?.beneficiary_request_duration_recurring_limit,
        };

        if (requestData.beneficiary_request_duration_recurring) {
          const recurringId =
            requestData.beneficiary_request_duration_recurring
              .beneficiary_request_duration_recurring_id;
          // Update existing recurring
          const recurringResponse = await fetch(
            `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-single-update-recurring/${recurringId}/`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('access_token')}`,
              },
              body: JSON.stringify(updateRecurring),
            }
          );
          if (!recurringResponse.ok) {
            const errorData = await recurringResponse.json();
            throw new Error(errorData.detail || 'recurring update failed');
          }
        } else {
          // Create new recurring
          const recurringResponse = await fetch(
            `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-create-recurring/${id}/`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('access_token')}`,
              },
              body: JSON.stringify(updateRecurring),
            }
          );
          if (!recurringResponse.ok) {
            const errorData = await recurringResponse.json();
            throw new Error(errorData.detail || 'recurring create failed');
          }
        }
      }

      // Refresh data

      // setEditApplied(false)
      setFinishEdit(true);
      // setRequestData(null);
      setFiles([])
      setEditApplied(false);
      await fetchData();
      setIsLoadingButtonDelete(false)
      setIsEdit(false);
      setFinishEdit(false);
    } catch (err) {
      console.error('Error during update:', err);
      setIsLoadingButtonDelete(false)
    }
    //  else {
    //   // User canceled - reset to original data
    //   setIsEdit(false);
    //   let updateDuration;
    //   if (requestData.beneficiary_request_duration === 'One Time') {
    //     updateDuration = 1;
    //   } else if (requestData.beneficiary_request_duration === 'Recurring') {
    //     updateDuration = 2;
    //   } else {
    //     updateDuration = 3;
    //   }

    //   setUpdateData({
    //     beneficiary_request_title: requestData.beneficiary_request_title,
    //     beneficiary_request_description: requestData.beneficiary_request_description,
    //     beneficiary_request_amount: requestData.beneficiary_request_amount,
    //     beneficiary_request_duration: updateDuration,
    //     beneficiary_request_duration_onetime: requestData.beneficiary_request_duration_onetime ||
    //       { beneficiary_request_duration_onetime_deadline: null },
    //     beneficiary_request_duration_recurring: requestData.beneficiary_request_duration_recurring ||
    //       { beneficiary_request_duration_recurring_limit: null },
    //   });
    // }
  };

  // useEffect(() => {
  //   if(finishEdit){
  //     setRequestData(null);
  //     setIsEdit(false);
  //     setEditApplied(false)
  //   }
  // },[finishEdit])

  const handleAmountUpdate = (event) => {
    setBlur((pre) => ({ ...pre, amount: false }));
    // Remove Persian digits and commas from the input value
    const englishValue = event.target.value
      .replace(/[۰-۹]/g, (d) =>
        ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'].indexOf(d)
      )
      .replace(/٬/g, '');

    setUpdateData((pre) => {
      if (englishValue !== '') {
        return { ...pre, beneficiary_request_amount: Number(englishValue) };
      } else {
        return { ...pre, beneficiary_request_amount: null };
      }
    });
  };

  const handleDurationUpdate = (event) => {
    setUpdateData((pre) => {
      if(Number(event.target.value) === 3){
        return {
          ...pre,
          beneficiary_request_duration: Number(event.target.value),
          beneficiary_request_amount: null,
        }
      }
      return {
        ...pre,
        beneficiary_request_duration: Number(event.target.value),
      };
    });
    
  };

  const handleTitleChange = (event) => {
    setUpdateData((pre) => {
      return { ...pre, beneficiary_request_title: event.target.value };
    });
  };

  const handleDescriptionChange = (event) => {
    setUpdateData((pre) => {
      return { ...pre, beneficiary_request_description: event.target.value };
    });
  };

  const handleLimitChange = (event) => {
    setBlur((pre) => ({ ...pre, limit: false }));
    let englishValue = event.target.value
      .split('')
      .map((c) => {
        const persianDigits = [
          '۰',
          '۱',
          '۲',
          '۳',
          '۴',
          '۵',
          '۶',
          '۷',
          '۸',
          '۹',
        ];
        const index = persianDigits.indexOf(c);
        return index >= 0 ? index.toString() : c;
      })
      .join('')
      .replace(/\D/g, '');

    // Enforce max limit of 12
    if (englishValue && Number(englishValue) > 12) {
      englishValue = '12';
    }
    if (englishValue && Number(englishValue) < 1) {
      englishValue = '1';
    }

    // Update the state with the English number (or empty string)
    const newValue = englishValue === '' ? '' : Number(englishValue);
    setUpdateData((pre) => {
      const newData = { ...pre };
      const recurring = newData.beneficiary_request_duration_recurring;
      if (recurring) {
        newData.beneficiary_request_duration_recurring.beneficiary_request_duration_recurring_limit =
          newValue;
      } else {
        newData.beneficiary_request_duration_recurring = {
          beneficiary_request_duration_recurring_limit: newValue,
        };
      }
      return newData;
    });

    // Update the displayed value with Persian digits (no commas)
    const displayValue =
      englishValue === '' ? '' : toPersianDigits(englishValue);
    event.target.value = displayValue;
  };

  // useEffect(() => {
  //   if (editApplied) {
  //     document.documentElement.classList.add('delete-overlay-container-html');
  //     document.body.classList.add('delete-overlay-container-html');
  //     document
  //       .getElementById('form1')
  //       .classList.add('delete-overlay-container-form');
  //     document
  //       .getElementById('form2')
  //       .classList.add('delete-overlay-container-form');
  //     document
  //       .getElementById('dropzone-div')
  //       .classList.add('delete-overlay-container-form');
  //     const inputs = document.getElementsByTagName('input');
  //     const selects = document.getElementsByTagName('select');
  //     const textareas = document.getElementsByTagName('textarea');
  //     if (files1.length > 0) {
  //       const filePreviews =
  //         document.getElementsByClassName('file-previews')[0];
  //       filePreviews.classList.add('file-previews-transparent');
  //       const filePreview = document.getElementsByClassName('file-preview');

  //       for (var i = 0; i < filePreview.length; i++) {
  //         filePreview[i].classList.add('file-preview-transparent');
  //       }
  //     }

  //     if (files1.length === 0) {
  //       const uploadContent =
  //         document.getElementsByClassName('upload-content')[0];
  //       uploadContent.classList.add('file-previews-transparent');
  //     }

  //     for (var i = 0; i < inputs.length; i++) {
  //       inputs[i].classList.add('delete-overlay-container-form');
  //     }
  //     for (var i = 0; i < selects.length; i++) {
  //       selects[i].classList.add('delete-overlay-container-form');
  //     }
  //     for (var i = 0; i < textareas.length; i++) {
  //       textareas[i].classList.add('delete-overlay-container-form');
  //     }
  //   } else {
  //     if (
  //       document.documentElement?.classList?.contains(
  //         'delete-overlay-container-html'
  //       )
  //     ) {
  //       document.documentElement.classList.remove(
  //         'delete-overlay-container-html'
  //       );
  //       document.body.classList.remove('delete-overlay-container-html');
  //     }
  //     if (
  //       document
  //         .getElementById('form1')
  //         ?.classList?.contains('delete-overlay-container-form')
  //     ) {
  //       document
  //         .getElementById('form1')
  //         .classList.remove('delete-overlay-container-form');
  //     }
  //     if (
  //       document
  //         .getElementById('form2')
  //         ?.classList?.contains('delete-overlay-container-form')
  //     ) {
  //       document
  //         .getElementById('form2')
  //         .classList.remove('delete-overlay-container-form');
  //     }
  //     if (
  //       document
  //         .getElementById('dropzone-div')
  //         ?.classList?.contains('delete-overlay-container-form')
  //     ) {
  //       document
  //         .getElementById('dropzone-div')
  //         .classList.remove('delete-overlay-container-form');
  //     }
  //     const inputs = document.getElementsByTagName('input');
  //     const selects = document.getElementsByTagName('select');
  //     const textareas = document.getElementsByTagName('textarea');
  //     if (inputs[0]?.classList?.contains('delete-overlay-container-form')) {
  //       for (var i = 0; i < inputs.length; i++) {
  //         inputs[i].classList.remove('delete-overlay-container-form');
  //       }
  //     }

  //     if (selects[0]?.classList?.contains('delete-overlay-container-form')) {
  //       for (var i = 0; i < selects.length; i++) {
  //         selects[i].classList.remove('delete-overlay-container-form');
  //       }
  //     }

  //     if (textareas[0]?.classList?.contains('delete-overlay-container-form')) {
  //       for (var i = 0; i < textareas.length; i++) {
  //         textareas[i].classList.remove('delete-overlay-container-form');
  //       }
  //     }
  //     const filePreviews = document.getElementsByClassName('file-previews')[0];
  //     if (filePreviews?.classList?.contains('file-previews-transparent')) {
  //       filePreviews.classList.remove('file-previews-transparent');
  //     }

  //     const filePreview = document.getElementsByClassName('file-preview');
  //     if (filePreview[0]?.classList?.contains('file-preview-transparent')) {
  //       for (var i = 0; i < filePreview.length; i++) {
  //         filePreview[i].classList.remove('file-preview-transparent');
  //       }
  //     }

  //     const uploadContent =
  //       document.getElementsByClassName('upload-content')[0];
  //     if (uploadContent?.classList?.contains('file-previews-transparent')) {
  //       uploadContent.classList.remove('file-previews-transparent');
  //     }
  //   }
  // }, [editApplied]);

  return (
    <>
      <div className="request-detail-edit-container">
        <Header />
        <main className="main">
          <div className="main-container">
            <div className="observe-forms">
              <form id="form1">
                <div>
                  <label htmlFor="observe-type1">نوع درخواست:</label>
                  <input
                    type="text"
                    id="observe-type1"
                    readOnly
                    value={convertTypeLayer1(
                      requestData.beneficiary_request_type_layer1
                    )}
                    style={{ pointerEvents: 'none' }}
                  />
                </div>

                <div>
                  <label htmlFor="observe-type2">دسته درخواست:</label>
                  <input
                    type="text"
                    id="observe-type2"
                    readOnly
                    value={requestData.beneficiary_request_type_layer2}
                    style={{ pointerEvents: 'none' }}
                  />
                </div>

                <div>
                  <label htmlFor="observe-time1">نوع زمانی درخواست:</label>
                  <select
                    id="observe-time1"
                    value={updateData.beneficiary_request_duration}
                    onChange={handleDurationUpdate}
                  >
                    <option value={1}>به صورت یکبار</option>
                    <option value={2}>به صورت ماهانه</option>
                    {requestData.beneficiary_request_type_layer1 === "Service" &&
                    <option value={3}>به طور دائمی</option>}
                  </select>
                  {/* <input type="text" id="observe-time1" value="به صورت ماهانه" /> */}
                </div>

                {updateData.beneficiary_request_duration !== 3 && (
                  <div>
                    {/* <label htmlFor="observe-time2">
                      تعداد دوره‌های درخواست:
                    </label>
                    <input type="text" id="observe-time2" value="۱۲ دوره ماهانه" /> */}
                    {updateData.beneficiary_request_duration === 1 && (
                      <>
                        <label htmlFor="observe-time2">
                          آخرین تاریخ درخواست:
                        </label>
                        <DatePicker
                          value={jalaliValue}
                          onChange={(dateObj) => {
                            setJalaliValue(dateObj);
                            const gregorianDate = dateObj.toDate();
                            const isoDate = gregorianDate.toISOString().split('T')[0];
                            setUpdateData((pre) => {
                              const newData = { ...pre };

                              // Ensure duration is set to "once" if user picks a date
                              if (newData.beneficiary_request_duration !== 1) {
                                newData.beneficiary_request_duration = 1;
                              }

                              if (newData.beneficiary_request_duration_onetime) {
                                newData.beneficiary_request_duration_onetime.beneficiary_request_duration_onetime_deadline =
                                  isoDate;
                              } else {
                                newData.beneficiary_request_duration_onetime = {
                                  beneficiary_request_duration_onetime_deadline: isoDate,
                                };
                              }

                              return newData;
                            });
                          }}
                          calendar={persian}
                          locale={persian_fa_custom}
                          calendarPosition="bottom-left"
                          placeholder="تاریخ را انتخاب کنید"
                          inputClass="custom-datepicker-input"
                          minDate={todayJalali}
                          onOpenPickNewDate={false}
                        />
                      </>
                    )}
                    {updateData.beneficiary_request_duration === 2 && (
                      <>
                        <label htmlFor="observe-time2">
                          تعداد دوره‌های درخواست:
                        </label>
                        <input
                          type="text"
                          id="observe-time2"
                          value={
                            updateData?.beneficiary_request_duration_recurring
                              ?.beneficiary_request_duration_recurring_limit
                              ? toPersianDigits(
                                  updateData?.beneficiary_request_duration_recurring?.beneficiary_request_duration_recurring_limit.toString()
                                )
                              : null
                          }
                          onChange={handleLimitChange}
                          onBlur={() =>
                            setBlur((pre) => ({ ...pre, limit: true }))
                          }
                          inputMode="numeric"
                          style={{direction:"ltr"}}
                        />
                      </>
                    )}
                  </div>
                )}

                {updateData.beneficiary_request_duration !== 3 && requestData.beneficiary_request_type_layer1 === "Cash" && (
                  <div>
                    {updateData.beneficiary_request_duration === 1 ?<label htmlFor="observe-cash">مبلغ درخواست:</label>:<label htmlFor="observe-cash">مبلغ ماهانه درخواست:</label>}
                    <input
                      type="text"
                      id="observe-cash"
                      value={
                        updateData?.beneficiary_request_amount
                          ? formatPersianNumber(
                              updateData.beneficiary_request_amount
                            )
                          : ''
                      }
                      onChange={handleAmountUpdate}
                      onBlur={() => {
                        setBlur((pre) => ({ ...pre, amount: true }));
                      }}
                      {...(!editApplied ? { inputMode: 'numeric' } : {})}
                      style={{direction:"ltr"}}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="observe-title">عنوان درخواست:</label>
                  <input
                    type="text"
                    id="observe-title"
                    value={updateData.beneficiary_request_title}
                    onChange={handleTitleChange}
                  />
                </div>

                <div>
                  <label htmlFor="observe-description">توضیحات درخواست:</label>
                  <textarea
                    id="observe-description"
                    value={updateData.beneficiary_request_description}
                    onChange={handleDescriptionChange}
                  />
                </div>

                <div>
                  <label htmlFor="observe-document">مستندات درخواست:</label>

                  <div
                    {...getRootProps()}
                    className={`dropzone ${isDragActive ? 'active' : ''}`}
                    id="dropzone-div"
                  >
                    {files1.length === 0 && (
                      <>
                        <input {...getInputProps()} />
                        <div className="upload-content">
                          <svg width="7" height="14" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.04545 3.18182V10.5C6.04545 11.9064 4.90636 13.0455 3.5 13.0455C2.09364 13.0455 0.954545 11.9064 0.954545 10.5V2.54545C0.954545 1.66727 1.66727 0.954545 2.54545 0.954545C3.42364 0.954545 4.13636 1.66727 4.13636 2.54545V9.22727C4.13636 9.57727 3.85 9.86364 3.5 9.86364C3.15 9.86364 2.86364 9.57727 2.86364 9.22727V3.18182H1.90909V9.22727C1.90909 10.1055 2.62182 10.8182 3.5 10.8182C4.37818 10.8182 5.09091 10.1055 5.09091 9.22727V2.54545C5.09091 1.13909 3.95182 0 2.54545 0C1.13909 0 0 1.13909 0 2.54545V10.5C0 12.4345 1.56545 14 3.5 14C5.43455 14 7 12.4345 7 10.5V3.18182H6.04545Z" fill="black"/>
                          </svg>

                          <p>
                            {isDragActive
                              ? 'فایل‌ها را اینجا رها کنید'
                              : 'برای انتخاب مستندات کلیک کنید'}
                          </p>
                        </div>
                      </>
                    )}
                    {files1.length > 0 && (
                      <div className="upload-files-wrapper">
                        <input {...getInputProps()} />
                        <div className="upload-content-with-files">
                          <svg width="7" height="14" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.04545 3.18182V10.5C6.04545 11.9064 4.90636 13.0455 3.5 13.0455C2.09364 13.0455 0.954545 11.9064 0.954545 10.5V2.54545C0.954545 1.66727 1.66727 0.954545 2.54545 0.954545C3.42364 0.954545 4.13636 1.66727 4.13636 2.54545V9.22727C4.13636 9.57727 3.85 9.86364 3.5 9.86364C3.15 9.86364 2.86364 9.57727 2.86364 9.22727V3.18182H1.90909V9.22727C1.90909 10.1055 2.62182 10.8182 3.5 10.8182C4.37818 10.8182 5.09091 10.1055 5.09091 9.22727V2.54545C5.09091 1.13909 3.95182 0 2.54545 0C1.13909 0 0 1.13909 0 2.54545V10.5C0 12.4345 1.56545 14 3.5 14C5.43455 14 7 12.4345 7 10.5V3.18182H6.04545Z" fill="black"/>
                          </svg>

                          <p>افزودن</p>
                        </div>

                        <div className="file-previews">
                          {files1.map((file, index) => (
                            <div key={index} className="file-preview">
                              <div className="file-info">
                                {getFileIcon(file)}
                                <span
                                  className="file-name"
                                  onClick={() =>
                                    window.open(URL.createObjectURL(file))
                                  }
                                >
                                  {file.name}
                                </span>
                                {/* <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)}MB</span> */}
                              </div>
                              <button
                                className="remove-file"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRemoveFile(index);
                                }}
                              >
                                <FiX />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>

              <form id="form2">
                <div>
                  <label htmlFor="observe-created-at">تاریخ ثبت:</label>
                  <input
                    type="text"
                    id="observe-created-at"
                    readOnly
                    value={gregorianToJalali(requestData.effective_date)}
                    style={{ pointerEvents: 'none' }}
                  />
                </div>

                <div>
                  <label htmlFor="observe-created-by">ایجاد شده توسط:</label>
                  <input
                    type="text"
                    id="observe-created-by"
                    readOnly
                    value={
                      requestData?.beneficiary_request_is_created_by_charity
                        ? 'مدیر سامانه'
                        : 'شخص کاربر'
                    }
                    style={{ pointerEvents: 'none' }}
                  />
                </div>

                <div>
                  <label htmlFor="observe-proccesing-stage">
                    وضعیت درخواست:
                  </label>
                  <input
                    type="text"
                    id="observe-proccesing-stage"
                    readOnly
                    value={
                      convertStage(
                        requestData?.beneficiary_request_processing_stage
                      ) || null
                    }
                    style={{ pointerEvents: 'none' }}
                  />
                </div>
              </form>
            </div>

            {!validation.deadline &&
              blur.deadline &&
              updateData.beneficiary_request_duration === 1 && (
                <p>لطفا تاریح آخرین زمان دریافت کمک را مشخص کنید</p>
              )}

            {!validation.limit &&
              blur.limit &&
              updateData.beneficiary_request_duration === 2 && (
                <p>
                  لطفا تعداد دوره های درخواست را انتخاب کنید بین یک دوره تا
                  دوازده دوره
                </p>
              )}

            {!validation.amount && blur.amount && (
              <p>مبلغ درخواست نمی تواند خالی باشد</p>
            )}

            <div className="buttons">
              <div className="observe-back-container">
                <button
                  className="observe-back"
                  onClick={() => {
                    setIsEdit(false);
                  }}
                >
                  <svg width="21" height="32" viewBox="0 0 21 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.68164 1.22266C4.26572 0.75704 5.11602 0.790223 5.66211 1.32227L19.6143 14.9258L19.7207 15.041C20.1828 15.5952 20.1828 16.4048 19.7207 16.959L19.6143 17.0742L5.66211 30.6777C5.11602 31.2098 4.26572 31.243 3.68164 30.7773L3.56836 30.6777L1.38477 28.5479C0.781478 27.9596 0.781108 26.9903 1.38379 26.4014L11.6621 16.3574L11.7285 16.2783C11.8411 16.1106 11.8411 15.8894 11.7285 15.7217L11.6621 15.6426L1.38379 5.59863C0.781108 5.00974 0.781477 4.04041 1.38477 3.45215L3.56836 1.32227L3.68164 1.22266Z" fill="#FF0000" stroke="black"/>
                  </svg>

                  بازگشت
                </button>
              </div>

              <div className="observe-confirm-edit-container">
                <button
                  className="observe-confirm-edit"
                  onClick={() => {
                    setEditApplied(true);
                  }}
                >
                  اعمال ویرایش
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.83333 0C2.61858 0 0 2.61858 0 5.83333C0 9.04809 2.61858 11.6667 5.83333 11.6667C9.04809 11.6667 11.6667 9.04809 11.6667 5.83333C11.6667 2.61858 9.04809 0 5.83333 0ZM5.83333 1.16667C8.41757 1.16667 10.5 3.2491 10.5 5.83333C10.5 8.41757 8.41757 10.5 5.83333 10.5C3.2491 10.5 1.16667 8.41757 1.16667 5.83333C1.16667 3.2491 3.2491 1.16667 5.83333 1.16667ZM8.33757 3.6709L4.66667 7.3418L3.3291 6.00423L2.50423 6.8291L4.66667 8.99154L9.16244 4.49577L8.33757 3.6709Z" fill="#3F9633"/>
                  </svg>

                </button>
              </div>
            </div>
          </div>
        </main>
        <NavigationBar selected={3} />
      </div>
      {
        finishEdit && (
          <>
          <div className="block-overlay-container"></div>
          <div className="edit-finish-container">
        <svg
          width="59"
          height="59"
          viewBox="0 0 59 59"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M26.25 42L12.5417 28.2917L16.625 24.2083L26.25 33.8333L50.75 9.33333C45.2083 3.79167 37.625 0 29.1667 0C13.125 0 0 13.125 0 29.1667C0 45.2083 13.125 58.3333 29.1667 58.3333C45.2083 58.3333 58.3333 45.2083 58.3333 29.1667C58.3333 23.625 56.875 18.6667 54.25 14.2917L26.25 42Z" />
        </svg>

        <h1>درخواست جزئی شما با موفقیت ایجاد گردید.</h1>

        <p>تا لحظاتی دیگر به صفحه اصلی همین درخواست منتقل می‌شوید.</p>
      </div>
          </>
        )
      }

      {editApplied && (
        <>
          <div className="block-overlay-container" onClick={() => setEditApplied(false)}></div>
          <div className="delete-overlay-container">
            <p>آیا از اعمال ویرایش اطمینان دارید؟</p>
            <div className="delete-overlay-buttons">
              <button
                className="no-button"
                onClick={() => setEditApplied(false)}
              >
                خیر
              </button>
              <button style={isLoadingButtonDelete?{width:childCreateBorderDiff}:null} className="yes-button" onClick={handleFinishEdit}>
               {isLoadingButtonDelete ? <LoadingButton dimension={10} stroke={2} color={'#ffffff'} /> : "بلی"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default RequestDetailEdit;
