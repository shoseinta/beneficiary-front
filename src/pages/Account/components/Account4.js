import Header from '../../../components/header/Header';
import NavigationBar from '../../../components/navigationBar/NavigationBar';
import { useState, useEffect, useCallback, useRef } from 'react';
import './Account4.css';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import DateObject from 'react-date-object';
import attach_icon from '../../../media/icons/attach_icon.svg';
import JSZip from 'jszip';
import { useDropzone } from 'react-dropzone';
import {
  FiFile,
  FiImage,
  FiVideo,
  FiMusic,
  FiFileText,
  FiX,
} from 'react-icons/fi';
import LoadingButton from '../../../components/loadingButton/LoadingButton';

function Account4({ accountData, setAccountData, setStep, setLoad }) {
  const inputRef = useRef();
  const [isLoadingButton, setIsLoadingButton] = useState(false)
    const [dateSelected, setDateSelected] = useState(false);
    useEffect(() => {
      console.log(dateSelected)
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
  const toPersianDigits = (num) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, (x) => persianDigits[x]);
  };

  const handleIdentificationChange = (event) => {
    setFamilyBlur(pre => ({
      ...pre,
      beneficiary_user_family_info_identification_number: false,
    }))
    // Convert Persian digits to English and remove all non-digit characters
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

    // Update the state with the English number (or empty string)
    const newValue = englishValue === '' ? null : englishValue;
    setFamilyData(pre =>({
      ...pre,
      beneficiary_user_family_info_identification_number: newValue,
    }))

    if (newValue !== null && newValue.length !== 10) {
      setFamilyValidation((pre) => ({ ...pre, beneficiary_user_family_info_identification_number: false }));
    } else {
      setFamilyValidation((pre) => ({ ...pre, beneficiary_user_family_info_identification_number: true }));
    }

    // Update the displayed value with Persian digits (no commas)
    const displayValue =
      englishValue === '' ? '' : toPersianDigits(englishValue);
    event.target.value = displayValue;
  };
  useEffect(() => {
    document.documentElement.classList.add('account-container4-html');
    document.body.classList.add('account-container4-body');

    return () => {
      document.documentElement.classList.remove('account-container4-html');
      document.body.classList.remove('account-container4-body');
    };
  }, []);

  const isPersian = (text) => {
    // Persian Unicode range: \u0600-\u06FF
    // Also includes Persian numbers \u06F0-\u06F9
    // And Arabic characters that might be used in Persian \u0621-\u064A
    const persianRegex = /^[\u0600-\u06FF\u0621-\u064A\s]+$/;
    return persianRegex.test(text);
  };
  
  const [addFamily, setAddFamily] = useState(false);
  const [addAdditional, setAddAdditional] = useState(false);
  const [removeFamily, setRemoveFamily] = useState(false);
  const [removeAdditional, setRemoveAdditional] = useState(false);
  const [familyIndex, setFamilyIndex] = useState(null);
  const [additionalIndex, setAdditionalIndex] = useState(null);
  const [additionalError, setAdditionalError] = useState(null);
  const [familyValidation, setFamilyValidation] = useState({
    beneficiary_user_family_info_identification_number:true,
    beneficiary_user_family_info_first_name: true,
    beneficiary_user_family_info_last_name: true,
  });
  const [familyBlur, setFamilyBlur] = useState({
    beneficiary_user_family_info_identification_number:true,
    beneficiary_user_family_info_first_name: true,
    beneficiary_user_family_info_last_name: true,
  })
  const [familyError, setFamilyError] = useState(null);
  const [familyData, setFamilyData] = useState({
    beneficiary_user_family_info_family_relation: null,
    beneficiary_user_family_info_identification_number: null,
    beneficiary_user_family_info_first_name: null,
    beneficiary_user_family_info_last_name: null,
    beneficiary_user_family_info_birth_date: null,
    beneficiary_user_family_info_gender: null,
  });

  const [additionalData, setAdditionalData] = useState({
    beneficiary_user_additional_info_title: null,
    beneficiary_user_additional_info_description: null,
    beneficiary_user_additional_info_document: null,
  });
  const [files, setFiles] = useState([]);
  const [isCreatingZip, setIsCreatingZip] = useState(false);
  
    const onDrop = useCallback(
      (acceptedFiles) => {
        setFiles((prev) => {
          const newFiles = [...prev];
          acceptedFiles.forEach((file) => {
            const isDuplicate = newFiles.some(
              (f) => f.name === file.name && f.lastModified === file.lastModified
            );
            if (!isDuplicate) {
              newFiles.push(file);
            }
          });

          if (newFiles.length > 0) {
            setIsCreatingZip(true);
            const zip = new JSZip();
            newFiles.forEach((file) => zip.file(file.name, file));

            zip
              .generateAsync({ type: 'blob' })
              .then((zipContent) => {
                const zipFile = new File([zipContent], 'documents.zip');
                setAdditionalData((prev) => ({
                  ...prev,
                  beneficiary_user_additional_info_document: zipFile,
                }));
              })
              .finally(() => setIsCreatingZip(false));
          }

          return newFiles;
        });
      },
      [setFiles, setAdditionalData]
    );
  
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
        setFiles((prevFiles) => {
          const updated = [...prevFiles];
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
              setAdditionalData((prev) => ({
                ...prev,
                beneficiary_user_additional_info_document: zipFile,
              }));
            });
          } else {
            setAdditionalData((prev) => ({
              ...prev,
              beneficiary_user_additional_info_document: null,
            }));
          }
    
          return updated;
        });
      };
  useEffect(() => {
    if(familyData.beneficiary_user_family_info_birth_date !==null && familyData.beneficiary_user_family_info_birth_date !== ""
      && familyData.beneficiary_user_family_info_family_relation !== null && familyData.beneficiary_user_family_info_family_relation !== ""
      && familyData.beneficiary_user_family_info_first_name !== null && familyData.beneficiary_user_family_info_first_name !== ""
      && familyData.beneficiary_user_family_info_last_name !== null && familyData.beneficiary_user_family_info_last_name !== ""
      && familyData.beneficiary_user_family_info_gender !== null && familyData.beneficiary_user_family_info_gender !== ""
      && familyData.beneficiary_user_family_info_identification_number !== null && familyData.beneficiary_user_family_info_identification_number !== ""
    ){
      setFamilyError(null);
    }
  },[familyData])

  useEffect(() => {
    if(additionalData.beneficiary_user_additional_info_title !== null && additionalData.beneficiary_user_additional_info_title !== ''){
      setAdditionalError(null);
    }
  },[additionalData])
  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((pre) => {
      return [...pre, ...selectedFiles];
    });

    if (selectedFiles.length > 0) {
      try {
        const zip = new JSZip();

        // Add each file to the zip
        files.forEach((file, index) => {
          zip.file(file.name, file);
        });

        // Generate the zip file
        const zipContent = await zip.generateAsync({ type: 'blob' });

        // Create a File object from the zip blob
        const zipFile = new File(
          [zipContent],
          `beneficiary_${localStorage.getItem('user_id')}_additional_info.zip`,
          {
            type: 'application/zip',
          }
        );

        // Update requestData with the zip file
        setAdditionalData((pre) => {
          return { ...pre, beneficiary_user_additional_info_document: zipFile };
        });
      } catch (error) {
        console.error('Error creating zip file:', error);
      }
    }
  };

  const [jalaliValue, setJalaliValue] = useState(null);
  useEffect(() => {
    setDateSelected(false);
  },[jalaliValue])
  const todayJalali = new DateObject({ calendar: persian, locale: persian_fa });
  const minDate = new DateObject({
  calendar: persian,
  locale: persian_fa,
  year: todayJalali.year - 130,
  month: 1, // Month 1 (Farvardin)
  day: 1,   // Day 1
});

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

  const handleFamilyDelete = async (index) => {
    setIsLoadingButton(true)
    try {
      const response = await fetch(
        `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/delete-user-family/${accountData.beneficiary_user_family_info[index].beneficiary_user_family_info_id}/`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('access_token')}`,
          },
        }
      );
      if (!response.ok) {
        // Check for HTTP errors (4xx/5xx)
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }
      setAccountData((pre) => {
        const data = { ...pre };
        const newFamily = data.beneficiary_user_family_info.filter(
          (item, idx) => {
            return idx !== index;
          }
        );
        data.beneficiary_user_family_info = newFamily;
        return data;
      });
      setIsLoadingButton(false)
      setRemoveFamily(false);
    } catch (err) {
      console.log(err);
      setIsLoadingButton(false)
    }
  };

  const handleAdditionalDelete = async (index) => {
    setIsLoadingButton(true)
    try {
      const response = await fetch(
        `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/update-user-additional-info/${accountData.beneficiary_user_additional_info[index].beneficiary_user_additional_info_id}/`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('access_token')}`,
          },
        }
      );
      if (!response.ok) {
        // Check for HTTP errors (4xx/5xx)
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }
      setAccountData((pre) => {
        const data = { ...pre };
        const newFamily = data.beneficiary_user_additional_info.filter(
          (item, idx) => {
            return idx !== index;
          }
        );
        data.beneficiary_user_additional_info = newFamily;
        return data;
      });
      setIsLoadingButton(false)
      setRemoveAdditional(false);
    } catch (err) {
      console.log(err);
      setIsLoadingButton(false)
    }
  };

  const handleAddFamily = async (e) => {
    e.preventDefault();
    var flag = 0
    if(!familyValidation.beneficiary_user_family_info_first_name || !familyValidation.beneficiary_user_family_info_identification_number || !familyValidation.beneficiary_user_family_info_last_name){
      flag = 1
    }
    if(familyData.beneficiary_user_family_info_birth_date === null ||
      familyData.beneficiary_user_family_info_birth_date === "" ||
      familyData.beneficiary_user_family_info_family_relation === null ||
      familyData.beneficiary_user_family_info_family_relation === "" ||
      familyData.beneficiary_user_family_info_first_name === null ||
      familyData.beneficiary_user_family_info_first_name === "" ||
      familyData.beneficiary_user_family_info_gender === null ||
      familyData.beneficiary_user_family_info_gender === "" ||
      familyData.beneficiary_user_family_info_identification_number === null ||
      familyData.beneficiary_user_family_info_identification_number === "" ||
      familyData.beneficiary_user_family_info_last_name === null ||
      familyData.beneficiary_user_family_info_last_name === ""
    ){
      setFamilyError("لطفا همه فیلدها را پر کنید.")
      flag = 1
    }
    if(flag === 1){
      return
    }
    setIsLoadingButton(true)
    try {
      const response = await fetch(
        `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/create-user-family/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify(familyData),
        }
      );
      if (!response.ok) {
        // Check for HTTP errors (4xx/5xx)
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }
      setLoad(true);
      setFamilyData({
        beneficiary_user_family_info_family_relation: null,
        beneficiary_user_family_info_identification_number: null,
        beneficiary_user_family_info_first_name: null,
        beneficiary_user_family_info_last_name: null,
        beneficiary_user_family_info_birth_date: null,
        beneficiary_user_family_info_gender: null,
      });
      setJalaliValue(null);
      setFamilyValidation({
        beneficiary_user_family_info_identification_number:true,
        beneficiary_user_family_info_first_name:true,
        beneficiary_user_family_info_last_name:true
      })
      setFamilyError(null)
      setFamilyBlur({
        beneficiary_user_family_info_identification_number:true,
        beneficiary_user_family_info_first_name:true,
        beneficiary_user_family_info_last_name:true
      })
      setIsLoadingButton(false)
      setAddFamily(false)
    } catch (err) {
      console.log(err);
      setIsLoadingButton(false)
    }
  };

  const handleAddAdditional = async (e) => {
    e.preventDefault();
    if(additionalData.beneficiary_user_additional_info_title === null ||
      additionalData.beneficiary_user_additional_info_title === '') {
        setAdditionalError("لطفا عنوان را وارد کنید");
        return;
      }
    setIsLoadingButton(true)
    try {
      var formData;
      var formHeaders;
      if(additionalData?.beneficiary_user_additional_info_document){
      formData = new FormData();
      formData.append(
        'beneficiary_user_additional_info_title',
        additionalData.beneficiary_user_additional_info_title
      );
      formData.append(
        'beneficiary_user_additional_info_description',
        additionalData.beneficiary_user_additional_info_description
      );
      formData.append(
        'beneficiary_user_additional_info_document',
        additionalData.beneficiary_user_additional_info_document
      );
      formHeaders = {
        Authorization: `Token ${localStorage.getItem('access_token')}`,
      };
    }else {
      formData = JSON.stringify({
        beneficiary_user_additional_info_title:additionalData.beneficiary_user_additional_info_title,
        beneficiary_user_additional_info_description:additionalData.beneficiary_user_additional_info_description,
      })
      formHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Token ${localStorage.getItem('access_token')}`,
      };
    }
      const response = await fetch(
        `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/create-user-additional-info/`,
        {
          method: 'POST',
          headers: formHeaders,
          body: formData,
        }
      );
      if (!response.ok) {
        // Check for HTTP errors (4xx/5xx)
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }
      setLoad(true);
      setAdditionalData({
        beneficiary_user_additional_info_title: null,
        beneficiary_user_additional_info_description: null,
        beneficiary_user_additional_info_document: null,
      });
      setAdditionalError(null);
      setFiles([]);
      setIsLoadingButton(false)
      setAddAdditional(false);
    } catch (err) {
      console.log(err);
      setIsLoadingButton(false)
    }
  };
  return (
    <>
      <div className="account-container4">
        <Header />

        <main className="main">
          <section style={{padding:"0 10px"}}>
            <h1>
              با انتخاب هر یک از موارد زیر، می‌توانید با تکمیل بخش‌های خالی
              اقدام به اشتراک اطلاعات خود با خیریه کنید.
            </h1>
          </section>

          <nav className="nav-up">
            <ul className="nav-list-up">
              <li className="nav-item-up" onClick={() => setStep(1)}>
                <a style={{color:"#000"}}> اطلاعات حساب کاربری </a>
              </li>

              <li className="nav-item-up" onClick={() => setStep(2)}>
                <a style={{color:"#000"}}> اطلاعات شخصی کاربر </a>
              </li>

              <li className="nav-item-up" onClick={() => setStep(3)}>
                <a style={{color:"#000"}}> اطلاعات آدرس کاربر </a>
              </li>

              <li
                className="nav-item-up"
                id="active-nav-up"
                onClick={() => setStep(4)}
              >
                <a style={{color:"#fff"}}> اطلاعات تکمیلی کاربر </a>
              </li>
            </ul>
          </nav>

          <div className="additional-info-container">
            <div className="additional-info">
              <p>
                با افزودن اطلاعات بستگان خود، می‌توانید در بخش ثبت درخواست برای
                آنها درخواست ایجاد کنید:
              </p>

              {accountData?.beneficiary_user_family_info &&
                accountData?.beneficiary_user_family_info.length !== 0 &&
                <div className="additional-info-box">
                {accountData?.beneficiary_user_family_info &&
                accountData?.beneficiary_user_family_info.length !== 0
                  ? accountData.beneficiary_user_family_info.map(
                      (item, index) => {
                        return (
                          <div
                            className="additional-info-value"
                            key={item.beneficiary_user_family_info_id}
                          >
                            {' '}
                            {item.beneficiary_user_family_info_first_name}{' '}
                            {item.beneficiary_user_family_info_last_name}
                            <button
                              title="حذف"
                              onClick={() => {
                                setRemoveFamily(true);
                                setFamilyIndex(index);
                              }}
                            >
                              <svg
                                width="30"
                                height="30"
                                viewBox="0 0 30 30"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M29.2929 3.72853C29.6834 3.33801 29.6834 2.70485 29.2929 2.31432L27.6857 0.707107C27.2952 0.316583 26.662 0.316583 26.2715 0.707107L15.7071 11.2715C15.3166 11.662 14.6834 11.662 14.2929 11.2715L3.72853 0.707106C3.33801 0.316582 2.70485 0.316582 2.31432 0.707107L0.707107 2.31432C0.316583 2.70485 0.316583 3.33801 0.707107 3.72853L11.2715 14.2929C11.662 14.6834 11.662 15.3166 11.2715 15.7071L0.707106 26.2715C0.316582 26.662 0.316582 27.2952 0.707107 27.6857L2.31432 29.2929C2.70485 29.6834 3.33801 29.6834 3.72853 29.2929L14.2929 18.7285C14.6834 18.338 15.3166 18.338 15.7071 18.7285L26.2715 29.2929C26.662 29.6834 27.2952 29.6834 27.6857 29.2929L29.2929 27.6857C29.6834 27.2952 29.6834 26.662 29.2929 26.2715L18.7285 15.7071C18.338 15.3166 18.338 14.6834 18.7285 14.2929L29.2929 3.72853Z" />
                              </svg>
                            </button>
                          </div>
                        );
                      }
                    )
                  : null}
              </div>}

              <div className="additional-info-button-container">
                <button
                  type="button"
                  class="additional-info-button"
                  onClick={() => setAddFamily(true)}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" />
                  </svg>
                  افزودن
                </button>
              </div>
            </div>

            <div className="additional-info">
              <p>
                با افزودن اطلاعات تکمیلی خود (مانند معلولیت، وضعیت اشتغال و...)
                می‌توانید به ما در جهت خدمت‌رسانی بهتر کمک کنید:
              </p>

              {accountData?.beneficiary_user_additional_info &&
                accountData?.beneficiary_user_additional_info.length !== 0 &&
                <div className="additional-info-box">
                {accountData?.beneficiary_user_additional_info &&
                accountData?.beneficiary_user_additional_info.length !== 0
                  ? accountData.beneficiary_user_additional_info.map(
                      (item, index) => {
                        return (
                          <div
                            className="additional-info-value"
                            key={item.beneficiary_user_additional_info_id}
                          >
                            {' '}
                            {item.beneficiary_user_additional_info_title}
                            <button
                              title="حذف"
                              onClick={() => {
                                setRemoveAdditional(true);
                                setAdditionalIndex(index);
                              }}
                            >
                              <svg
                                width="30"
                                height="30"
                                viewBox="0 0 30 30"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M29.2929 3.72853C29.6834 3.33801 29.6834 2.70485 29.2929 2.31432L27.6857 0.707107C27.2952 0.316583 26.662 0.316583 26.2715 0.707107L15.7071 11.2715C15.3166 11.662 14.6834 11.662 14.2929 11.2715L3.72853 0.707106C3.33801 0.316582 2.70485 0.316582 2.31432 0.707107L0.707107 2.31432C0.316583 2.70485 0.316583 3.33801 0.707107 3.72853L11.2715 14.2929C11.662 14.6834 11.662 15.3166 11.2715 15.7071L0.707106 26.2715C0.316582 26.662 0.316582 27.2952 0.707107 27.6857L2.31432 29.2929C2.70485 29.6834 3.33801 29.6834 3.72853 29.2929L14.2929 18.7285C14.6834 18.338 15.3166 18.338 15.7071 18.7285L26.2715 29.2929C26.662 29.6834 27.2952 29.6834 27.6857 29.2929L29.2929 27.6857C29.6834 27.2952 29.6834 26.662 29.2929 26.2715L18.7285 15.7071C18.338 15.3166 18.338 14.6834 18.7285 14.2929L29.2929 3.72853Z" />
                              </svg>
                            </button>
                          </div>
                        );
                      }
                    )
                  : null}
              </div>}
              <div className="additional-info-button-container">
                <button
                  type="button"
                  class="additional-info-button"
                  onClick={() => setAddAdditional(true)}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" />
                  </svg>
                  افزودن
                </button>
              </div>
            </div>
          </div>
        </main>

        <NavigationBar selected={4} />
      </div>
      {removeFamily && (
        <>
          <div className="block-overlay-container" onClick={() => setRemoveFamily(false)}></div>
          <div className="family-delete-overlay-container">
            <p>آیا از حذف این مورد اطمینان دارید؟</p>
            <div className="family-delete-overlay-buttons">
              <button
                className="family-no-button"
                onClick={() => setRemoveFamily(false)}
              >
                خیر
              </button>
              <button
                className="family-yes-button"
                onClick={() => handleFamilyDelete(familyIndex)}
              >
      {isLoadingButton? <LoadingButton dimension={10} stroke={2} color={'#fff'} />: "بلی"}
              </button>
            </div>
          </div>
        </>
      )}

      {removeAdditional && (
        <>
          <div className="block-overlay-container" onClick={() => setRemoveAdditional(false)}></div>
          <div className="family-delete-overlay-container">
            <p>آیا از حذف این مورد اطمینان دارید؟</p>
            <div className="family-delete-overlay-buttons">
              <button
                className="family-no-button"
                onClick={() => setRemoveAdditional(false)}
              >
                خیر
              </button>
              <button
                className="family-yes-button"
                onClick={() => handleAdditionalDelete(additionalIndex)}
              >
        {isLoadingButton? <LoadingButton dimension={10} stroke={2} color={'#fff'} />: "بلی"}
              </button>
            </div>
          </div>
        </>
      )}

      {addFamily && (
        <>
          <div className="block-overlay-container" onClick={() => setAddFamily(false)}></div>
          <div class="family-overlay-container">
            <form action="">
              <div>
                <label htmlFor="family-relation">
                  نسبت فامیلی:<sup>*</sup>
                </label>
                <select
                  id="family-relation"
                  value={
                    familyData.beneficiary_user_family_info_family_relation
                  }
                  onChange={(e) => {
                    setFamilyData((pre) => {
                      return {
                        ...pre,
                        beneficiary_user_family_info_family_relation:
                          e.target.value,
                      };
                    });
                  }}
                >
                  <option value="">انتخاب کنید</option>
                  <option value="child">فرزند</option>
                  <option value="partner">همسر</option>
                </select>
              </div>

              <div>
                <label htmlFor="family-ident-num">
                  کد ملی:<sup>*</sup>
                </label>
                <input
                  type="text"
                  id="family-ident-num"
                  inputMode="numeric"
                  maxLength={10}
                  value={
                    familyData?.beneficiary_user_family_info_identification_number
                    ? toPersianDigits(
                        familyData?.beneficiary_user_family_info_identification_number
                      ).toString()
                    : null
                  }
                  onChange={handleIdentificationChange}
                  onBlur={() => {
                    setFamilyBlur(pre => ({
                      ...pre,
                      beneficiary_user_family_info_identification_number:true
                    }))
                  }}
                  style={{direction:"ltr"}}
                />
              </div>

              <div>
                <label htmlFor="family-fn">نام:<sup>*</sup></label>
                <input
                  type="text"
                  id="family-fn"
                  value={familyData.beneficiary_user_family_info_first_name}
                  onChange={(e) => {
                    setFamilyBlur(pre => ({
                      ...pre,
                      beneficiary_user_family_info_first_name:false
                    }))
                    setFamilyData((pre) => {
                      return {
                        ...pre,
                        beneficiary_user_family_info_first_name: e.target.value,
                      };
                    });
                    const nameValidation = e.target.value === null || e.target.value === ""?true:isPersian(e.target.value);
                    setFamilyValidation((prev) => ({
                      ...prev,
                      beneficiary_user_family_info_first_name: nameValidation,
                    }));
                  }}
                  onBlur={() => {
                    setFamilyBlur(pre => ({
                      ...pre,
                      beneficiary_user_family_info_first_name:true
                    }))
                  }}
                />
              </div>

              <div>
                <label htmlFor="family-ln">نام خانوادگی:<sup>*</sup></label>
                <input
                  type="text"
                  id="family-ln"
                  value={familyData.beneficiary_user_family_info_last_name}
                  onChange={(e) => {
                    setFamilyBlur(pre => ({
                      ...pre,
                      beneficiary_user_family_info_last_name:false
                    }))
                    setFamilyData((pre) => {
                      return {
                        ...pre,
                        beneficiary_user_family_info_last_name: e.target.value,
                      };
                    });
                    const nameValidation = e.target.value === null || e.target.value === ""?true:isPersian(e.target.value);
                    setFamilyValidation((prev) => ({
                      ...prev,
                      beneficiary_user_family_info_last_name: nameValidation,
                    }));
                  }
                  
                }
                onBlur={() => {
                    setFamilyBlur(pre => ({
                      ...pre,
                      beneficiary_user_family_info_last_name:true
                    }))
                  }}
                />
              </div>

              <div>
                <label htmlFor="family-bd">تاریخ تولد:<sup>*</sup></label>
                <DatePicker
                  value={jalaliValue}
                  onChange={(dateObj) => {
                    setJalaliValue(dateObj);
                    const gregorianDate = dateObj.toDate();
                    const isoDate = gregorianDate.toISOString().split('T')[0];
                    setFamilyData((prev) => ({
                      ...prev,
                      beneficiary_user_family_info_birth_date: isoDate,
                    }));
                  }}
                  calendar={persian}
                  locale={persian_fa_custom}
                  calendarPosition="bottom-center"
                  placeholder="تاریخ را انتخاب کنید"
                  inputClass="custom-datepicker-input"
                  maxDate={todayJalali}
                  minDate={minDate}
                  onOpen={() => setDateSelected(true)}
                          onClose={() => setDateSelected(false)}
                          onFocusedDateChange={() => setDateSelected(true)}
                />
              </div>

              <div>
                <label htmlFor="family-gender"> جنسیت: <sup>*</sup></label>
                <select
                  id="family-gender"
                  value={familyData.beneficiary_user_family_info_gender}
                  onChange={(e) => {
                    setFamilyData((pre) => {
                      return {
                        ...pre,
                        beneficiary_user_family_info_gender: e.target.value,
                      };
                    });
                  }}
                >
                  <option value="">انتخاب کنید</option>
                  <option value="female">زن</option>
                  <option value="male">مرد</option>
                </select>
              </div>
              {familyError && (
                <div>{familyError}</div>
              )}

              {
                (!familyValidation.beneficiary_user_family_info_first_name && familyBlur.beneficiary_user_family_info_first_name) ||
                (!familyValidation.beneficiary_user_family_info_last_name && familyBlur.beneficiary_user_family_info_last_name) 
                 ? (
                  <div >
                    لطفا نام و نام خانوادگی را به صورت فارسی وارد کنید.
                  </div>
                ) : null
              }
      
              {
                !familyValidation.beneficiary_user_family_info_identification_number && familyBlur.beneficiary_user_family_info_identification_number ? (
                  <div>
                    لطفا کد ملی را به صورت عددی و 10 رقمی وارد کنید.
                  </div>
                ) : null
              }
              <div className="family-overlay-buttons">
                <button
                  type="button"
                  class="no-button"
                  onClick={() => {
                    setAddFamily(false)
                    setFamilyData({
                      beneficiary_user_family_info_family_relation: null,
                      beneficiary_user_family_info_identification_number: null,
                      beneficiary_user_family_info_first_name: null,
                      beneficiary_user_family_info_last_name: null,
                      beneficiary_user_family_info_birth_date: null,
                      beneficiary_user_family_info_gender: null,
                    });
                    setJalaliValue(null);
                    setFamilyValidation({
                      beneficiary_user_family_info_identification_number:true,
                      beneficiary_user_family_info_first_name:true,
                      beneficiary_user_family_info_last_name:true
                    })
                    setFamilyError(null)
                    setFamilyBlur({
                      beneficiary_user_family_info_identification_number:true,
                      beneficiary_user_family_info_first_name:true,
                      beneficiary_user_family_info_last_name:true
                    })
                  }}
                >
                  لغو
                </button>
                <button
                  type="submit"
                  class="yes-button"
                  onClick={handleAddFamily}
                >
                  {isLoadingButton?<LoadingButton dimension={10} stroke={2} color={'#fff'} />:"تأیید"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {addAdditional && (
        <>
          <div className="block-overlay-container" onClick={() => setAddAdditional(false)}></div>
          <div className="additional-info-overlay-container">
            <form>
              <div>
                <label htmlFor="additional-info-title">
                  عنوان:<sup>*</sup>
                </label>
                <input
                  type="text"
                  id="additional-info-title"
                  value={additionalData.beneficiary_user_additional_info_title}
                  onChange={(e) => {
                    setAdditionalData((pre) => {
                      return {
                        ...pre,
                        beneficiary_user_additional_info_title: e.target.value,
                      };
                    });
                  }}
                />
              </div>

              <div>
                <label htmlFor="additional-info-description">توضیحات:</label>
                <textarea
                  id="additional-info-description"
                  value={
                    additionalData.beneficiary_user_additional_info_description
                  }
                  onChange={(e) => {
                    setAdditionalData((pre) => {
                      return {
                        ...pre,
                        beneficiary_user_additional_info_description:
                          e.target.value,
                      };
                    });
                  }}
                ></textarea>
              </div>

              <div>
                <label htmlFor="additional-info-document">مستندات:</label>
                {/* <input
                  type="file"
                  id="additional-info-document"
                  multiple
                  hidden
                  onChange={handleFileChange}
                /> */}
                {/* <label
                  htmlFor="additional-info-document"
                  className="upload-label"
                > */}
                  <div
                                {...getRootProps()}
                                className={`dropzone ${isDragActive ? 'active' : ''}`}
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
                                {files.length === 0 && (
                                  <>
                                    <input {...getInputProps()} ref={inputRef} width={'100%'} height={'100%'}/>
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
                                {files.length > 0 && (
                                  <div className="upload-files-wrapper">
                                    
                                    <div className="upload-content-with-files">
                                      <input {...getInputProps()} width={'100%'} height={'100%'} ref={inputRef}/>
                                      <svg width="7" height="14" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M6.04545 3.18182V10.5C6.04545 11.9064 4.90636 13.0455 3.5 13.0455C2.09364 13.0455 0.954545 11.9064 0.954545 10.5V2.54545C0.954545 1.66727 1.66727 0.954545 2.54545 0.954545C3.42364 0.954545 4.13636 1.66727 4.13636 2.54545V9.22727C4.13636 9.57727 3.85 9.86364 3.5 9.86364C3.15 9.86364 2.86364 9.57727 2.86364 9.22727V3.18182H1.90909V9.22727C1.90909 10.1055 2.62182 10.8182 3.5 10.8182C4.37818 10.8182 5.09091 10.1055 5.09091 9.22727V2.54545C5.09091 1.13909 3.95182 0 2.54545 0C1.13909 0 0 1.13909 0 2.54545V10.5C0 12.4345 1.56545 14 3.5 14C5.43455 14 7 12.4345 7 10.5V3.18182H6.04545Z" fill="black"/>
                                      </svg>

                                      <p>افزودن</p>
                                    </div>
                  
                                    <div className="file-previews" style={{cursor:"default"}}>
                                      {files.map((file, index) => (
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
                {/* </label> */}
              </div>
            </form>
            {additionalError && (
              <div>
                {additionalError}
              </div>
            )}

            <div className="additional-info-overlay-buttons">
              <button
                className="no-button"
                onClick={() => {
                  setAddAdditional(false)
                  setAdditionalData({
                    beneficiary_user_additional_info_title: null,
                    beneficiary_user_additional_info_description: null,
                    beneficiary_user_additional_info_document: null,
                  });
                  setAdditionalError(null);
                  setFiles([]);
                }}
              >
                لغو
              </button>
              <button className="yes-button" onClick={handleAddAdditional}>
                {isLoadingButton?<LoadingButton dimension={10} stroke={2} color={'#fff'} />:"تأیید"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Account4;
