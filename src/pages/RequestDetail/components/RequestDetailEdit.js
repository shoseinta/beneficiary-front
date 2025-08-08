import Header from '../../../components/header/Header';
import NavigationBar from '../../../components/navigationBar/NavigationBar';
import back_icon from '../../../media/icons/back_icon.svg';
import confirm_icon from '../../../media/icons/confirm_icon.svg';
import attach_icon from '../../../media/icons/attach_icon.svg';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import DateObject from 'react-date-object';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import {Tooltip} from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
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
  const inputRef = useRef();
  const [inputSelected, setInputSelected] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);
  useEffect(() => {
    const clickedInput = () => {
      setInputSelected(true);
    setTimeout(() => setInputSelected(false), 10);
    }
    document.body.addEventListener('click', clickedInput);

    return () => {
      document.body.removeEventListener('click', clickedInput);
    }
  })
 useEffect(() => {
  if (!dateSelected) return;
  const timeout = setTimeout(() => {
    const leftArrow = document.querySelector('.rmdp-left i');
    const rightArrow = document.querySelector('.rmdp-right i');
    // const disables = document.querySelectorAll('.rmdp-day.rmdp-disabled');
    // if(disables.length > 0) {
    //   disables.forEach((item) => {
    //     item.parentElement.removeChild(item);
    //   });
    // }
    const week = document.querySelector('.rmdp-week')
    if (week) {
      week.querySelectorAll('.rmdp-week-day').forEach((item,index) => {
        item.style.textAlign = 'center';
        item.style.fontSize = '8px';
        if(index === 5){
          item.style.paddingRight = '2px';
        }
      })
    }
    const spans = document.querySelectorAll('.rmdp-day span');
    if (spans.length > 0) {
      spans.forEach((item) => {
        item.style.position = 'relative';
        item.style.top = '0';
        item.style.left = '0';
        item.style.right = '0';
      });
    }
    // const arrows = document.querySelectorAll('.rmdp-arrow');
    // if (arrows.length > 0) {
    //   arrows.forEach((item) => {
    //     item.style.margin = '0';
    //   });
    // }
    // const leftArrowI = document.querySelector('.rmdp-left i');
    // const rightArrowI = document.querySelector('.rmdp-right i');
    // if (leftArrowI) leftArrowI.style.margin = '0';
    if (leftArrow) leftArrow.style.webkitTransform = 'rotate(-45deg)';
    // if (rightArrowI) rightArrowI.style.margin = '0';
    if (rightArrow) rightArrow.style.webkitTransform = 'rotate(135deg)';

    const header = document.querySelector('.rmdp-header-values');
    if (header) {
      const spanMonth = document.querySelectorAll('.rmdp-header-values span')[0];
      const spanYear = document.querySelectorAll('.rmdp-header-values span')[1];
      if (spanMonth) {
        spanMonth.style.paddingLeft = '15px';
        spanMonth.addEventListener('click', () => {
          setTimeout(() => {
            const months = document.querySelectorAll('.rmdp-ym .rmdp-day span')
            months.forEach((month) => {
              month.style.width = '60px';
            month.style.height = 'auto';
            month.style.borderRadius = '12px';
            })
            
          },50)
        })
      }
      if (spanYear) {
        spanYear.style.paddingRight = '15px';
        spanYear.addEventListener('click', () => {
          setTimeout(() => {
            const months = document.querySelectorAll('.rmdp-ym .rmdp-day span')
            months.forEach((month) => {
              month.style.width = '60px';
            month.style.height = 'auto';
            month.style.borderRadius = '12px';
            })
          },50)
        })
      }
    }
  }, 50); // wait a bit for DOM

  return () => clearTimeout(timeout);
}, [dateSelected]);
  useEffect(() => {
  if (!dateSelected) return;
  const timeout = setTimeout(() => {
    const leftArrow = document.querySelector('.rmdp-left i');
    const rightArrow = document.querySelector('.rmdp-right i');

    if (leftArrow) leftArrow.style.webkitTransform = 'rotate(-45deg)';
    if (rightArrow) rightArrow.style.webkitTransform = 'rotate(135deg)';
  }, 50); // wait a bit for DOM

  return () => clearTimeout(timeout);
}, [dateSelected]);
  const [isCreatingZip, setIsCreatingZip] = useState(false);
  const [files1, setFiles1] = useState(files);
  const [editApplied, setEditApplied] = useState(false);
  const [isLoadingButtonDelete, setIsLoadingButtonDelete] = useState(false)
  const [childCreateBorderDiff, setChildCreateBorderDiff] = useState(0)
  useEffect(() => {
    const button = document.querySelector('.delete-overlay-buttons .yes-button');

    if (button && !isLoadingButtonDelete && editApplied) {
      const rect = button.getBoundingClientRect();
      const leftX = rect.left;
      const rightX = rect.right;
      setChildCreateBorderDiff(rightX - leftX);
    }
  }, [isLoadingButtonDelete, editApplied]);
  const onDrop = useCallback((acceptedfiles1) => {
    setFiles1((prev) => {
      // Filter out duplicates by name and lastModified
      const newFiles = [...prev];
      acceptedfiles1.forEach((file) => {
        const isDuplicate = newFiles.some(
          (f) => f.name === file.name && f.lastModified === file.lastModified
        );
        if (!isDuplicate) {
          newFiles.push(file);
        }
      });
      if (acceptedfiles1.length > 0) {
        setIsCreatingZip(true);
        const zip = new JSZip();

        // Only add the updated newFiles list (without duplicates)
        newFiles.forEach((file) => zip.file(file.name, file));

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
    setInputSelected(true);
    setTimeout(() => setInputSelected(false), 10);
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

useEffect(() => {
    setDateSelected(false);
  },[jalaliValue])
  

  const [validation, setValidation] = useState({
    deadline: true,
    limit: true,
    amount: true,
  });

  const [blur, setBlur] = useState({deadline: false, limit: false, amount: false});
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
      ['یکشنبه',"یکشنبه"],
      ['دوشنبه', 'دوشنبه'],
      ['سه‌شنبه', 'سه‌شنبه'],
      ['چهارشنبه', 'چهارشنبه'],
      ['پنجشنبه', 'پنجشنبه'],
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
    setInputSelected(true);
    setTimeout(() => setInputSelected(false), 10);
    // Remove Persian digits and commas from the input value
    var englishValue = event.target.value
      .replace(/[۰-۹]/g, (d) =>
        ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'].indexOf(d)
      )
      .replace(/٬/g, '');
    if (englishValue !== '' && Number(englishValue) > 1000000000) {
      englishValue = '1000000000'; // Enforce max limit of 1 billion
    }

    setUpdateData((pre) => {
      if (englishValue !== '') {
        return { ...pre, beneficiary_request_amount: Number(englishValue) };
      } else {
        return { ...pre, beneficiary_request_amount: null };
      }
    });
  };

  const handleDurationUpdate = (event) => {
     setInputSelected(true);
    setTimeout(() => setInputSelected(false), 10);
    setUpdateData((pre) => {
      {
        return {
          ...pre,
          beneficiary_request_duration: Number(event.target.value),
          beneficiary_request_amount: null,
          beneficiary_request_duration_onetime: {
            beneficiary_request_duration_onetime_deadline: null,
          },
          beneficiary_request_duration_recurring: {
            beneficiary_request_duration_recurring_limit: null,
          },
        }
      }
    });
    setBlur({
      deadline: false,
      limit: false,
      amount: false,})
  };

  const handleTitleChange = (event) => {
    setInputSelected(true);
    setTimeout(() => setInputSelected(false), 10);
    setUpdateData((pre) => {
      return { ...pre, beneficiary_request_title: event.target.value };
    });
  };

  const handleDescriptionChange = (event) => {
    setInputSelected(true);
    setTimeout(() => setInputSelected(false), 10);
    setUpdateData((pre) => {
      return { ...pre, beneficiary_request_description: event.target.value };
    });
  };

  const handleLimitChange = (event) => {
    setInputSelected(true);
    setTimeout(() => setInputSelected(false), 10);
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

  useEffect(() => {
    const input = document.getElementById('observe-time2');
    if (!input) return;
    if(!updateData?.beneficiary_request_duration_recurring?.beneficiary_request_duration_recurring_limit) return;
    let span = document.getElementById('duration-unit-span');
    if(span) {
      span.parentElement.removeChild(span); // Remove the existing span if it exists
    }
    if (!span) {
      span = document.createElement('span');
      span.id = 'duration-unit-span';
      span.innerText = 'دوره ماهانه';
      span.style.position = 'absolute';
      span.style.whiteSpace = 'nowrap';
      span.style.pointerEvents = 'none';
      span.style.fontSize = '0.7rem';
      span.style.color = 'black';
      document.body.appendChild(span);
    }

    const updatePosition = () => {
      const rect = input.getBoundingClientRect();
      const computedStyle = getComputedStyle(input);
      const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
      const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
      const inputWidth = rect.width
      // Create a canvas to measure the rendered width of the input value
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // Use the computed font properties for accurate measurement
      ctx.font = computedStyle.font || `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
      // If the value is empty, use placeholder for width estimation; otherwise, use value
      const valueToMeasure = input.value || input.placeholder || '';
      const textWidth = ctx.measureText(valueToMeasure).width;
      // Calculate left position: input's left + left padding + text width + small padding (e.g., 4px)
      const left =
        rect.right -
        paddingRight -
        textWidth -
        55  +
        window.scrollX;
      // Vertically center the span to the input field
      const top =
        rect.top +
        rect.height / 2 -
        span.offsetHeight / 2 +
        window.scrollY;
      span.style.top = `${top}px`;
      span.style.left = `${left}px`;
    };

    updatePosition();

    window.addEventListener('resize', updatePosition);
    input.addEventListener('input', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      input.removeEventListener('input', updatePosition);
      if (span) {
        span.remove();
      }
    };
  }, [updateData,inputSelected]);

  useEffect(() => {
    const input = document.getElementById('observe-cash');
    if (!input) return;
    if(!updateData.beneficiary_request_amount) return;
    let span = document.getElementById('amount-unit-span');
    if (span) {
      span.parentElement.removeChild(span); // Remove the existing span if it exists
    }
    if (!span) {
      span = document.createElement('span');
      span.id = 'amount-unit-span';
      span.innerText = "تومان";
      span.style.position = 'absolute';
      span.style.whiteSpace = 'nowrap';
      span.style.pointerEvents = 'none';
      span.style.fontSize = '0.7rem';
      span.style.color = 'black';
      document.body.appendChild(span);
    }

    const updatePositionAmount = () => {
      const rect = input.getBoundingClientRect();
      const computedStyle = getComputedStyle(input);
      const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
      const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
      const inputWidth = rect.width
      // Create a canvas to measure the rendered width of the input value
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // Use the computed font properties for accurate measurement
      ctx.font = computedStyle.font || `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
      // If the value is empty, use placeholder for width estimation; otherwise, use value
      const valueToMeasure = input.value || input.placeholder || '';
      const textWidth = ctx.measureText(valueToMeasure).width;
      // Calculate left position: input's left + left padding + text width + small padding (e.g., 4px)
      const left =
        rect.right -
        paddingRight -
        textWidth -
        30 -
        window.scrollX;
      // Vertically center the span to the input field
      const top =
        rect.top +
        rect.height / 2 -
        span.offsetHeight / 2 +
        window.scrollY;
      span.style.top = `${top}px`;
      span.style.left = `${left}px`;
    };

    updatePositionAmount();
    if (span.getBoundingClientRect().left < input.getBoundingClientRect().left) {
      span.innerText = "";
    }

    window.addEventListener('resize', updatePositionAmount);
    input.addEventListener('input', updatePositionAmount);

    return () => {
      window.removeEventListener('resize', updatePositionAmount);
      input.removeEventListener('input', updatePositionAmount);
      if (span) {
        span.remove();
      }
    };
  }, [updateData, inputSelected]);

  useEffect(() => {
    const datePicker = document.querySelector('.custom-datepicker-input');
    if (!datePicker) return;
    datePicker.placeholder = ""
    datePicker.style.border = '';
    const onClickDatePicker = () => {
      setBlur(pre => ({...pre, deadline: false}));
    }
    datePicker.addEventListener('click', onClickDatePicker);
    if (!validation.deadline && blur.deadline) {
      datePicker.style.border = '1px solid #ff0000';
      datePicker.placeholder = 'تاریخ را وارد کنید';
    }
    return () => {
      datePicker.removeEventListener('click', onClickDatePicker);
    }
  },[validation.deadline, blur.deadline,updateData])
  
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
                  <div className="input-icon-wrapper">
                    <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.625 5.16667H8.9375V3.83333C8.9375 1.99333 7.3975 0.5 5.5 0.5C3.6025 0.5 2.0625 1.99333 2.0625 3.83333V5.16667H1.375C0.61875 5.16667 0 5.76667 0 6.5V13.1667C0 13.9 0.61875 14.5 1.375 14.5H9.625C10.3813 14.5 11 13.9 11 13.1667V6.5C11 5.76667 10.3813 5.16667 9.625 5.16667ZM3.4375 3.83333C3.4375 2.72667 4.35875 1.83333 5.5 1.83333C6.64125 1.83333 7.5625 2.72667 7.5625 3.83333V5.16667H3.4375V3.83333ZM9.625 13.1667H1.375V6.5H9.625V13.1667ZM5.5 11.1667C6.25625 11.1667 6.875 10.5667 6.875 9.83333C6.875 9.1 6.25625 8.5 5.5 8.5C4.74375 8.5 4.125 9.1 4.125 9.83333C4.125 10.5667 4.74375 11.1667 5.5 11.1667Z" fill="black"/>
                    </svg>
                    <input
                      type="text"
                      id="observe-type1"
                      readOnly
                      value={convertTypeLayer1(
                        requestData.beneficiary_request_type_layer1
                      )}
                      // style={{ pointerEvents: 'none' }}
                    data-tooltip-id="observe-time1-lock"
                  data-tooltip-content="این بخش قابل ویرایش نیست"
              />
              
      <Tooltip id="observe-time1-lock" place="top" openOnClick={true} style={{fontSize:"0.7rem", fontWeight:"normal",borderRadius:"6px"}}/>
            
                  </div>
                </div>

                <div>
                  <label htmlFor="observe-type2">دسته درخواست:</label>
                  <div className="input-icon-wrapper">
                    <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.625 5.16667H8.9375V3.83333C8.9375 1.99333 7.3975 0.5 5.5 0.5C3.6025 0.5 2.0625 1.99333 2.0625 3.83333V5.16667H1.375C0.61875 5.16667 0 5.76667 0 6.5V13.1667C0 13.9 0.61875 14.5 1.375 14.5H9.625C10.3813 14.5 11 13.9 11 13.1667V6.5C11 5.76667 10.3813 5.16667 9.625 5.16667ZM3.4375 3.83333C3.4375 2.72667 4.35875 1.83333 5.5 1.83333C6.64125 1.83333 7.5625 2.72667 7.5625 3.83333V5.16667H3.4375V3.83333ZM9.625 13.1667H1.375V6.5H9.625V13.1667ZM5.5 11.1667C6.25625 11.1667 6.875 10.5667 6.875 9.83333C6.875 9.1 6.25625 8.5 5.5 8.5C4.74375 8.5 4.125 9.1 4.125 9.83333C4.125 10.5667 4.74375 11.1667 5.5 11.1667Z" fill="black"/>
                    </svg>
                    <input
                      type="text"
                      id="observe-type2"
                      readOnly
                      value={requestData.beneficiary_request_type_layer2}
                      // style={{ pointerEvents: 'none' }}
                    data-tooltip-id="observe-time2-lock"
                  data-tooltip-content="این بخش قابل ویرایش نیست"
              />
              
              <Tooltip id="observe-time2-lock" place="top" openOnClick={true} style={{fontSize:"0.7rem", fontWeight:"normal",borderRadius:"6px"}}/>
            
                  </div>
                </div>

                <div>
                  <label htmlFor="observe-time1">نوع زمانی درخواست:</label>
                  <select
                    id="observe-time1"
                    value={updateData.beneficiary_request_duration}
                    onChange={
                      handleDurationUpdate
                     
                    }
                  >
                    <option value={1} >به صورت یکبار</option>
                    <option value={2} >به صورت ماهانه</option>
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
                          onOpen={() => setDateSelected(true)}
                          onClose={() => setDateSelected(false)}
                          onFocusedDateChange={() => setDateSelected(true)}
                        />
                      </>
                    )}
                    {updateData.beneficiary_request_duration === 2 && (
                      <>
                        <label htmlFor="observe-time2">
                          تعداد دوره‌های درخواست:
                        </label>
                        <input
                          onClick={() => {
                            setInputSelected(true)
                            setBlur(pre => ({...pre, limit: false}));
                          }}
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
                          inputMode="numeric"
                          style={!validation.limit && blur.limit ?{direction:"ltr", border:"1px solid #ff0000"}:{direction:"ltr"}}
                          placeholder={!validation.limit && blur.limit ?" تعداد دوره‌ها را وارد کنید": ""}
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
                      onClick={() => {
                        setBlur(pre => ({...pre, amount: false}));
                      }}
                      onChange={handleAmountUpdate}
                      {...(!editApplied ? { inputMode: 'numeric' } : {})}
                      style={!validation.amount && blur.amount ?{direction:"ltr", border:"1px solid #ff0000"}:{direction:"ltr"}}
                      placeholder={!validation.amount && blur.amount ?"مبلغ را وارد کنید": ""}
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
                    onClick={(e) => {
                const uploadArea = document.querySelector('.upload-content-with-files')
                if(uploadArea){
                  const rect = uploadArea.getBoundingClientRect();
                  const isInUploadArea = (
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom
                  );
                  if(!isInUploadArea){
                    return;
                  }
                  else {
                    if (inputRef.current) {
            inputRef.current.click();
          }
                  }
                }else {
                  if (inputRef.current) {
                    inputRef.current.click();
                  }
                }
              }}
                  >
                    {files1.length === 0 && (
                      <>
                        <input {...getInputProps()} width={'100%'} height={'100%'} ref={inputRef}/>
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
                        
                        <div className="upload-content-with-files">
                          <input {...getInputProps()} width={'100%'} height={'100%'} ref={inputRef}/>
                          <svg width="7" height="14" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.04545 3.18182V10.5C6.04545 11.9064 4.90636 13.0455 3.5 13.0455C2.09364 13.0455 0.954545 11.9064 0.954545 10.5V2.54545C0.954545 1.66727 1.66727 0.954545 2.54545 0.954545C3.42364 0.954545 4.13636 1.66727 4.13636 2.54545V9.22727C4.13636 9.57727 3.85 9.86364 3.5 9.86364C3.15 9.86364 2.86364 9.57727 2.86364 9.22727V3.18182H1.90909V9.22727C1.90909 10.1055 2.62182 10.8182 3.5 10.8182C4.37818 10.8182 5.09091 10.1055 5.09091 9.22727V2.54545C5.09091 1.13909 3.95182 0 2.54545 0C1.13909 0 0 1.13909 0 2.54545V10.5C0 12.4345 1.56545 14 3.5 14C5.43455 14 7 12.4345 7 10.5V3.18182H6.04545Z" fill="black"/>
                          </svg>

                          <p>افزودن</p>
                        </div>

                        <div className="file-previews" style={{cursor:"default"}}>
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
                  <div className="input-icon-wrapper">
                    <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.625 5.16667H8.9375V3.83333C8.9375 1.99333 7.3975 0.5 5.5 0.5C3.6025 0.5 2.0625 1.99333 2.0625 3.83333V5.16667H1.375C0.61875 5.16667 0 5.76667 0 6.5V13.1667C0 13.9 0.61875 14.5 1.375 14.5H9.625C10.3813 14.5 11 13.9 11 13.1667V6.5C11 5.76667 10.3813 5.16667 9.625 5.16667ZM3.4375 3.83333C3.4375 2.72667 4.35875 1.83333 5.5 1.83333C6.64125 1.83333 7.5625 2.72667 7.5625 3.83333V5.16667H3.4375V3.83333ZM9.625 13.1667H1.375V6.5H9.625V13.1667ZM5.5 11.1667C6.25625 11.1667 6.875 10.5667 6.875 9.83333C6.875 9.1 6.25625 8.5 5.5 8.5C4.74375 8.5 4.125 9.1 4.125 9.83333C4.125 10.5667 4.74375 11.1667 5.5 11.1667Z" fill="black"/>
                    </svg>
                    <input
                      type="text"
                      id="observe-created-at"
                      readOnly
                      value={gregorianToJalali(requestData.effective_date)}
                      // style={{ pointerEvents: 'none' }}
                    data-tooltip-id="observe-created-at-lock"
                  data-tooltip-content="این بخش قابل ویرایش نیست"
              />
              
                 <Tooltip id="observe-created-at-lock" place="top" openOnClick={true} style={{fontSize:"0.7rem", fontWeight:"normal",borderRadius:"6px"}}/>
            
                  </div>
                </div>

                <div>
                  <label htmlFor="observe-created-by">ایجاد شده توسط:</label>
                  <div className="input-icon-wrapper">
                    <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.625 5.16667H8.9375V3.83333C8.9375 1.99333 7.3975 0.5 5.5 0.5C3.6025 0.5 2.0625 1.99333 2.0625 3.83333V5.16667H1.375C0.61875 5.16667 0 5.76667 0 6.5V13.1667C0 13.9 0.61875 14.5 1.375 14.5H9.625C10.3813 14.5 11 13.9 11 13.1667V6.5C11 5.76667 10.3813 5.16667 9.625 5.16667ZM3.4375 3.83333C3.4375 2.72667 4.35875 1.83333 5.5 1.83333C6.64125 1.83333 7.5625 2.72667 7.5625 3.83333V5.16667H3.4375V3.83333ZM9.625 13.1667H1.375V6.5H9.625V13.1667ZM5.5 11.1667C6.25625 11.1667 6.875 10.5667 6.875 9.83333C6.875 9.1 6.25625 8.5 5.5 8.5C4.74375 8.5 4.125 9.1 4.125 9.83333C4.125 10.5667 4.74375 11.1667 5.5 11.1667Z" fill="black"/>
                    </svg>
                    <input
                      type="text"
                      id="observe-created-by"
                      readOnly
                      value={
                        requestData?.beneficiary_request_is_created_by_charity
                          ? 'مدیر سامانه'
                          : 'شخص کاربر'
                      }
                      // style={{ pointerEvents: 'none' }}
                    data-tooltip-id="observe-created-by-lock"
                  data-tooltip-content="این بخش قابل ویرایش نیست"
              />
              
                  <Tooltip id="observe-created-by-lock" place="top" openOnClick={true} style={{fontSize:"0.7rem", fontWeight:"normal",borderRadius:"6px"}}/>
            
                  </div>
                </div>

                <div>
                  <label htmlFor="observe-proccesing-stage">
                    وضعیت درخواست:
                  </label>
                  <div className="input-icon-wrapper">
                    <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.625 5.16667H8.9375V3.83333C8.9375 1.99333 7.3975 0.5 5.5 0.5C3.6025 0.5 2.0625 1.99333 2.0625 3.83333V5.16667H1.375C0.61875 5.16667 0 5.76667 0 6.5V13.1667C0 13.9 0.61875 14.5 1.375 14.5H9.625C10.3813 14.5 11 13.9 11 13.1667V6.5C11 5.76667 10.3813 5.16667 9.625 5.16667ZM3.4375 3.83333C3.4375 2.72667 4.35875 1.83333 5.5 1.83333C6.64125 1.83333 7.5625 2.72667 7.5625 3.83333V5.16667H3.4375V3.83333ZM9.625 13.1667H1.375V6.5H9.625V13.1667ZM5.5 11.1667C6.25625 11.1667 6.875 10.5667 6.875 9.83333C6.875 9.1 6.25625 8.5 5.5 8.5C4.74375 8.5 4.125 9.1 4.125 9.83333C4.125 10.5667 4.74375 11.1667 5.5 11.1667Z" fill="black"/>
                    </svg>
                    <input
                      type="text"
                      id="observe-proccesing-stage"
                      readOnly
                      value={
                        convertStage(
                          requestData?.beneficiary_request_processing_stage
                        ) || null
                      }
                      // style={{ pointerEvents: 'none' }}
                    data-tooltip-id="observe-proccesing-stage-lock"
                  data-tooltip-content="این بخش قابل ویرایش نیست"
              />
              
                  <Tooltip id="observe-proccesing-stage-lock" place="top" openOnClick={true} style={{fontSize:"0.7rem", fontWeight:"normal",borderRadius:"6px"}}/>
            
                  </div>
                </div>
              </form>
            </div>

            

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
                    var flag = 0
                    if(!validation.deadline && updateData.beneficiary_request_duration === 1){
                      setBlur(pre => ({...pre,deadline:true}));
                      flag = 1;
                    }
                    if ((!validation.limit && updateData.beneficiary_request_duration === 2)) {
                      setBlur(pre => ({...pre,limit:true}));
                      flag = 1;
                    }
                    if((!validation.amount && updateData.beneficiary_request_duration !== 3)){
                      setBlur(pre => ({...pre,amount:true}));
                      flag = 1;
                    }
                    if (flag === 1) {
                      return;
                    }
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

        <h1>درخواست شما با موفقیت ویرایش گردید.</h1>

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
