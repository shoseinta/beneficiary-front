import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useLookup } from '../../context/LookUpContext';
import Header from '../../components/header/Header';
import NavigationBar from '../../components/navigationBar/NavigationBar';
import './RequestDetail.css';
import back_icon from '../../media/icons/back_icon.svg';
import confirm_icon from '../../media/icons/confirm_icon.svg';
import attach_icon from '../../media/icons/attach_icon.svg';
import RequestDetailEdit from './components/RequestDetailEdit';
import LoadingButton from '../../components/loadingButton/LoadingButton';
import JSZip from 'jszip';
import {
  FiFile,
  FiImage,
  FiVideo,
  FiMusic,
  FiFileText,
  FiX,
} from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import { toJalaali } from 'jalaali-js';

function RequestDetail() {
  const getMimeType = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const mimeTypes = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    txt: 'text/plain',
  };
  return mimeTypes[ext] || 'application/octet-stream';
};
  useEffect(() => {
    document.title = 'صفحه سوابق درخواست خیریه';
  }, []);
  const [isLoadingButtonChildCreation, setIsLoadingButtonChildCreation] = useState(false)
  const [childCreateBorderDiff, setChildCreateBorderDiff] = useState(0);
  const [isChildCreate, setIsChildCreate] = useState(false);
useEffect(() => {
  const button = document.querySelector('.child-creation-overlay-buttons .yes-button');
  console.log(button)
  if (button && !isLoadingButtonChildCreation && isChildCreate) {
    const rect = button.getBoundingClientRect();
    const leftX = rect.left;
    const rightX = rect.right;
    setChildCreateBorderDiff(rightX - leftX);
    console.log(rightX - leftX)
  }
}, [isLoadingButtonChildCreation, isChildCreate]);
  const [isDelete, setIsDelete] = useState(false);
  const [isLoadingButtonDelete, setIsLoadingButtonDelete] = useState(false)
  const [childIndex, setChildIndex] = useState(null);
  const [childId, setChildId] = useState(null);
  useEffect(() => {
  const button = document.querySelector('.delete-overlay-buttons .yes-button');
  console.log(button)
  if (button && !isLoadingButtonDelete && isDelete) {
    const rect = button.getBoundingClientRect();
    const leftX = rect.left;
    const rightX = rect.right;
    setChildCreateBorderDiff(rightX - leftX);
    console.log(rightX - leftX)
  }
}, [isLoadingButtonDelete, isDelete]);
  const { id } = useParams();
  const [loadingFiles, setLoadingFiles] = useState(true)
  const { duration, processingStage,isDeleteFinished,setIsDeleteFinished } = useLookup();
  const [isEdit, setIsEdit] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const [childSeeData, setChildSeeData] = useState(null);
  const [isChildCreateFinish, setIsChildCreateFinish] = useState(false);
  const [childCreationValidation, setChildCreationValidation] = useState(true);
  const [childData, setChildData] = useState({
    beneficiary_request_child_description: null,
    beneficiary_request_child_document: [],
  });
  const [isChildSee, setIsChildSee] = useState(false);
  const navigate = useNavigate();
  const [isChildRemove, setIsChildRemove] = useState(false);

  const [files, setFiles] = useState([]);
  const [childFiles, setChildFiles] = useState([]);
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setChildData((pre) => {
          const document = pre.beneficiary_request_child_document;
          return {
            ...pre,
            beneficiary_request_child_document: [...document, ...acceptedFiles],
          };
        });
      }
    },
    [setChildData]
  );

  const handleRemoveFile = (indexToRemove) => {
    setChildData((prev) => {
      const updatedFiles = [...prev.beneficiary_request_child_document];
      updatedFiles.splice(indexToRemove, 1);

      return {
        ...prev,
        beneficiary_request_child_document:
          updatedFiles.length > 0 ? updatedFiles : [],
      };
    });
  };

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

  const downloadAndExtractZip = async (url) => {
    setLoadingFiles(true);
    const filename = url.split('/').pop();
    try {
      const response = await fetch(
        `https://charity-backend-staging.liara.run/beneficiary-platform/request-docs/${filename}/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch ZIP file');

      const blob = await response.blob();
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(blob);

      const extractedFiles = [];
      const filePromises = [];

      zipContent.forEach((relativePath, file) => {
  if (!file.dir) {
    filePromises.push(
      file.async('blob').then((blob) => {
        const fileName = relativePath.split('/').pop();
        const mimeType = getMimeType(fileName);

        const fileObj = new File([blob], fileName, {
          type: mimeType,
          lastModified: Date.now(),
        });

        fileObj.preview = URL.createObjectURL(fileObj);
        fileObj.path = relativePath;

        extractedFiles.push(fileObj);
      })
    );
  }
});

      await Promise.all(filePromises);
      setLoadingFiles(false);
      return extractedFiles;
    } catch (error) {
      console.error('ZIP download/extraction failed:', error);
      return [];
    }
  };

  const downloadAndExtractZipChild = async (url) => {
    setLoadingFiles(true);
    const filename = url.split('/').pop();
    try {
      const response = await fetch(
        `https://charity-backend-staging.liara.run/beneficiary-platform/child-docs/${filename}/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch ZIP file');

      const blob = await response.blob();
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(blob);

      const extractedFiles = [];
      const filePromises = [];

      zipContent.forEach((relativePath, file) => {
  if (!file.dir) {
    filePromises.push(
      file.async('blob').then((blob) => {
        const fileName = relativePath.split('/').pop();
        const mimeType = getMimeType(fileName);

        const fileObj = new File([blob], fileName, {
          type: mimeType,
          lastModified: Date.now(),
        });

        fileObj.preview = URL.createObjectURL(fileObj);
        fileObj.path = relativePath;

        extractedFiles.push(fileObj);
      })
    );
  }
});

      await Promise.all(filePromises);
      setLoadingFiles(false);
      return extractedFiles;
    } catch (error) {
      console.error('ZIP download/extraction failed:', error);
      return [];
    }
  };
  const handleChildRemove = async (index, requestId) => {
    const newData = [...childSeeData];
    const filterData = newData.filter((item, ind) => {
      return ind !== index;
    });
    setChildSeeData(filterData);

    try {
      // Create FormData instead of JSON
      const response = await fetch(
        `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-single-child-update/${requestId}/`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('access_token')}`,
            // Don't set Content-Type - let the browser set it with the correct boundary
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Request creation failed');
      }
    } catch (err) {
      console.error('Error creating child request:', err);
      // Add error handling UI here
    }
  };

  const createChildRequestBody = async () => {
    const data = {
      beneficiary_request_child_description:
        childData.beneficiary_request_child_description,
      beneficiary_request_child_document: null,
    };

    try {
      if (childData.beneficiary_request_child_document.length !== 0) {
        const zip = new JSZip();

        // Add each file to the zip
        childData.beneficiary_request_child_document.forEach((file, index) => {
          zip.file(file.name, file);
        });

        // Generate the zip file
        const zipContent = await zip.generateAsync({ type: 'blob' });

        // Create a File object from the zip blob
        const zipFile = new File(
          [zipContent],
          `child_documents_beneficiary_${localStorage.getItem('user_id')}_request_${id}.zip`,
          {
            type: 'application/zip',
          }
        );
        data.beneficiary_request_child_document = zipFile;
      }
      console.log(data);
      return data;
    } catch (error) {
      console.log(data);
      console.error('Error creating zip file:', error);
      return data;
    }
  };
  const handleChildDescriptionChange = (e) => {
    setChildCreationValidation(true);
    setChildData((pre) => {
      return { ...pre, beneficiary_request_child_description: e.target.value };
    });
  };

  useEffect(() => {
    console.log(childData);
  });

  const handleChildCreation = async () => {
    if (!childData.beneficiary_request_child_description) {
      setChildCreationValidation(false);
      return;
    }
    setIsLoadingButtonChildCreation(true)
    try {
      // Create FormData instead of JSON
      const formData = new FormData();
      formData.append(
        'beneficiary_request_child_description',
        childData.beneficiary_request_child_description
      );

      // Only add the zip file if documents exist
      if (childData.beneficiary_request_child_document.length > 0) {
        const zip = new JSZip();

        // Add each file to the zip
        childData.beneficiary_request_child_document.forEach((file) => {
          zip.file(file.name, file);
        });

        // Generate the zip file
        const zipContent = await zip.generateAsync({ type: 'blob' });

        // Create a File object from the zip blob
        const zipFile = new File(
          [zipContent],
          `child_documents_beneficiary_${localStorage.getItem('user_id')}_request_${id}.zip`,
          {
            type: 'application/zip',
          }
        );

        formData.append('beneficiary_request_child_document', zipFile);
      }

      const response = await fetch(
        `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-child-create/${id}/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${localStorage.getItem('access_token')}`,
            // Don't set Content-Type - let the browser set it with the correct boundary
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Request creation failed');
      }

      setIsChildCreateFinish(true);

      // Handle success
      setIsChildCreate(false);
      setIsLoadingButtonChildCreation(false)
      setChildData({
        beneficiary_request_child_description: null,
        beneficiary_request_child_document: [],
      });
      await fetchData();
      setIsChildCreateFinish(false);
      // fetchData();
    } catch (err) {
      console.error('Error creating child request:', err);
      setIsLoadingButtonChildCreation(false)
      // Add error handling UI here
    }
  };

  useEffect(() => {
    document.documentElement.classList.add('request-detail-html');
    document.body.classList.add('request-detail-body');

    return () => {
      document.documentElement.classList.remove('request-detail-html');
      document.body.classList.remove('request-detail-body');
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);
  const formatPersianNumber = (number) => {
    if (number === null || number === undefined || number === '') return '';

    // Convert to Persian digits
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

    // Add commas and convert each digit
    return number
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '٬')
      .replace(/\d/g, (d) => persianDigits[d]);
  };
  const convertTypeLayer1 = (type) => {
    if (type === 'Good') {
      return 'کالا';
    } else if (type === 'Cash') {
      return 'وجه نقد';
    } else if (type === 'Service') {
      return 'خدمت';
    }
  };
  const convertStage = (type) => {
    if (type === 'Submitted') {
      return 'ثبت شده';
    } else if (type === 'Pending Review') {
      return 'در انتظار بررسی';
    } else if (type === 'Under Evaluation') {
      return 'در حال ارزیابی';
    } else if (type === 'Approved') {
      return 'تایید شده';
    } else if (type === 'Rejected') {
      return 'رد شده';
    } else if (type === 'Completed') {
      return 'تکمیل شده';
    } else if (type === 'In Progress') {
      return 'در حال انجام';
    }
  };

  const convertStageChild = (proccesingId) => {
    let type = 'pending_review';
    if (processingStage) {
      processingStage.forEach((item, idx) => {
        if (
          Number(item.beneficiary_request_processing_stage_id) ===
          Number(proccesingId)
        ) {
          type = item.beneficiary_request_processing_stage_name;
        }
      });
    }

    if (type === 'submitted') {
      return 'ثبت شده';
    } else if (type === 'pending_review') {
      return 'در انتظار بررسی';
    } else if (type === 'under_evaluation') {
      return 'در حال ارزیابی';
    } else if (type === 'approved') {
      return 'تایید شده';
    } else if (type === 'rejected') {
      return 'رد شده';
    } else if (type === 'completed') {
      return 'تکمیل شده';
    } else if (type === 'in_progress') {
      return 'در حال انجام';
    }
  };
  // if (!data) {
  //     return <div>Loading...</div>;
  // }

  // Function to convert Gregorian date to Persian digits
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

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-single-get/${id}/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('access_token')}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }
      const result = await response.json();
      setRequestData(result);

      // Handle document download if exists
      if (result.beneficiary_request_document) {
        const extractedFiles = await downloadAndExtractZip(
          result.beneficiary_request_document
        );
        setFiles(extractedFiles);
      }

      let updateDuration;
      if (result.beneficiary_request_duration === 'One Time') {
        updateDuration = 1;
      } else if (result.beneficiary_request_duration === 'Recurring') {
        updateDuration = 2;
      } else {
        updateDuration = 3;
      }

      let updateDurationOnetime =
        result.beneficiary_request_duration_onetime || {
          beneficiary_request_duration_onetime_deadline: null,
        };

      let updateDurationRecurring =
        result.beneficiary_request_duration_recurring || {
          beneficiary_request_duration_recurring_limit: null,
        };

      setUpdateData({
        beneficiary_request_title: result.beneficiary_request_title,
        beneficiary_request_description: result.beneficiary_request_description,
        beneficiary_request_amount: result.beneficiary_request_amount,
        beneficiary_request_duration_onetime:
          result.beneficiary_request_duration_onetime,
        beneficiary_request_duration_recurring:
          result.beneficiary_request_duration_recurring,
        beneficiary_request_duration: updateDuration,
        beneficiary_request_duration_onetime: updateDurationOnetime,
        beneficiary_request_duration_recurring: updateDurationRecurring,
      });
    } catch (err) {
      console.log(err);
    }

    try {
      const response = await fetch(
        `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-childs-get/${id}/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const result = await response.json();
      setChildSeeData(result);

      // Process child documents
      if (result.length > 0) {
        const childFilesPromises = result.map(async (item) => {
          if (item.beneficiary_request_child_document) {
            return await downloadAndExtractZipChild(
              item.beneficiary_request_child_document
            );
          }
          return [];
        });

        const childFiles = await Promise.all(childFilesPromises);
        setChildFiles(childFiles);
      } else {
        setChildFiles([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditClick = () => {
    if (
      requestData.beneficiary_request_is_created_by_charity ||
      (requestData.beneficiary_request_processing_stage !== 'Submitted' &&
        requestData.beneficiary_request_processing_stage !== 'Pending Review' &&
        requestData.beneficiary_request_processing_stage !== 'Under Evaluation')
    ) {
      return;
    }
    setIsEdit(true);
  };

  const handleDelete = async () => {
    if (
      requestData.beneficiary_request_is_created_by_charity ||
      (requestData.beneficiary_request_processing_stage !== 'Submitted' &&
        requestData.beneficiary_request_processing_stage !== 'Pending Review' &&
        requestData.beneficiary_request_processing_stage !== 'Under Evaluation')
    ) {
      return;
    }
    setIsLoadingButtonDelete(true)
    try {
      const response = await fetch(
        `https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/request-single-update/${id}/`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'request delete failed');
      }
      setIsDelete(false)
      setIsDeleteFinished(true);
      setIsLoadingButtonDelete(false)
      setTimeout(() => {
        setIsDeleteFinished(false);
        navigate('/requests');
      },1000)
      
      
      
    } catch (err) {
      console.log(err);
      setIsLoadingButtonDelete(false)
    }
  };
  useEffect(() => {
    const input = document.getElementById('observe-cash');
    if (!input) return;
    let span = document.getElementById('amount-unit-span');
    // if (span) {
    //   span.parentElement.removeChild(span); // Remove the existing span if it exists
    // }
    if (!span) {
      span = document.createElement('span');
      span.id = 'amount-unit-span';
      span.innerText = "تومان";
      span.style.position = 'absolute';
      span.style.whiteSpace = 'nowrap';
      span.style.pointerEvents = 'none';
      span.style.fontSize = '14px';
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
        40  +
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
  }, [requestData]);

  if ((!isDelete && !isEdit && !isChildCreate && !isChildSee && !isChildCreateFinish && !isDeleteFinished) && (!requestData || (requestData?.beneficiary_request_document && loadingFiles) || (childSeeData?.beneficiary_request_child_document && loadingFiles))) {
    return <p>loading...</p>;
  }

  if (isEdit) {
    return (
      <RequestDetailEdit
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        updateData={updateData}
        setUpdateData={setUpdateData}
        requestData={requestData}
        setRequestData={setRequestData}
        fetchData={fetchData}
        id={id}
        convertTypeLayer1={convertTypeLayer1}
        convertStage={convertStage}
        formatPersianNumber={formatPersianNumber}
        files={files}
        setFiles={setFiles}
      />
    );
  }



  return (
    <>
      <div className="request-detail-container">
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
                    value={
                      requestData?.beneficiary_request_type_layer1
                        ? convertTypeLayer1(
                            requestData.beneficiary_request_type_layer1
                          )
                        : null
                    }
                  />
                </div>

                <div>
                  <label htmlFor="observe-type2">دسته درخواست:</label>
                  <input
                    type="text"
                    id="observe-type2"
                    readOnly
                    value={requestData?.beneficiary_request_type_layer2 || null}
                  />
                </div>

                <div>
                  <label htmlFor="observe-time1">نوع زمانی درخواست:</label>
                  <input
                    type="text"
                    id="observe-time1"
                    readOnly
                    value={
                      requestData?.beneficiary_request_duration
                        ? requestData.beneficiary_request_duration ===
                          'Permanent'
                          ? 'به طور دائمی'
                          : requestData.beneficiary_request_duration ===
                              'One Time'
                            ? 'فقط یکبار'
                            : 'به صورت ماهانه'
                        : null
                    }
                  />
                </div>

                {requestData?.beneficiary_request_duration !== 'Permanent' && (
                  <div>
                    {requestData?.beneficiary_request_duration_onetime && (
                      <>
                        <label htmlFor="observe-time2">
                          تاریخ دریافت درخواست:
                        </label>
                        <input
                          type="text"
                          id="observe-time2"
                          readOnly
                          value={gregorianToJalali(
                            requestData.beneficiary_request_duration_onetime
                              .beneficiary_request_duration_onetime_deadline
                          )}
                        />
                      </>
                    )}
                    {requestData?.beneficiary_request_duration_recurring && (
                      <>
                        <label htmlFor="observe-time2">
                          تعداد دوره‌های درخواست:
                        </label>
                        <input
                          type="text"
                          id="observe-time2"
                          readOnly
                          value={`${toPersianDigits(requestData.beneficiary_request_duration_recurring.beneficiary_request_duration_recurring_limit)} دوره ماهانه`}
                        />
                      </>
                    )}
                  </div>
                )}

                {requestData?.beneficiary_request_duration !== 'Permanent' && requestData?.beneficiary_request_type_layer1 === 'Cash' && (
                  <div>
                    <label htmlFor="observe-cash">مبلغ درخواست:</label>
                    <input
                      type="text"
                      id="observe-cash"
                      readOnly
                      value={formatPersianNumber(
                        requestData.beneficiary_request_amount
                      )}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="observe-title">عنوان درخواست:</label>
                  <input
                    type="text"
                    id="observe-title"
                    readOnly
                    value={requestData?.beneficiary_request_title}
                    placeholder={
                      !requestData?.beneficiary_request_title &&
                      'اطلاعاتی وجود ندارد'
                    }
                  />
                </div>

                <div>
                  <label htmlFor="observe-description">توضیحات درخواست:</label>
                  <textarea
                    id="observe-description"
                    readOnly
                    value={requestData?.beneficiary_request_description}
                    placeholder={
                      !requestData?.beneficiary_request_description &&
                      'اطلاعاتی وجود ندارد'
                    }
                  />
                </div>

                <div>
                  <label htmlFor="observe-document" readOnly>مستندات درخواست:</label>
                  {files.length === 0 && (
                    <>
                      <input
                        type="file"
                        id="observe-document"
                        multiple
                        hidden
                        readOnly
                        disabled
                      />
                      <label
                        htmlFor="observe-document"
                        className="upload-label"
                        readOnly
                      >
                        اطلاعاتی وجود ندارد
                      </label>
                    </>
                  )}
                  {files.length > 0 && (
                    <label className='document-label' readOnly>
                    <div className="file-previews">
                      
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
                        </div>
                      ))}
                      
                    </div>
                    </label>
                  )}
                </div>
                
              </form>

              <form id="form2">
                <div>
                  <label htmlFor="observe-created-at">تاریخ ثبت:</label>
                  <input
                    type="text"
                    id="observe-created-at"
                    readOnly
                    value={
                      gregorianToJalali(requestData?.effective_date) || null
                    }
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
                  />
                </div>
              </form>
            </div>

            <div className="buttons-container">
              <div className="observe-line-button">
                <div className="observe-child-creation-container">
                  <button
                    className="observe-chid-creation"
                    onClick={() => setIsChildCreate(true)}
                  >
                    ایجاد درخواست جزئی
                    <svg
                      width="13"
                      height="14"
                      viewBox="0 0 13 14"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.8653 0C6.14368 0.000245073 6.41058 0.111031 6.6073 0.308L9.4927 3.192C9.59027 3.28963 9.66763 3.40554 9.72036 3.5331C9.77309 3.66067 9.80015 3.79737 9.8 3.9354V7C8.68609 7 7.6178 7.4425 6.83015 8.23015C6.0425 9.0178 5.6 10.0861 5.6 11.2V14H1.05C0.771523 14 0.504451 13.8894 0.307538 13.6925C0.110625 13.4955 0 13.2285 0 12.95V1.05C0 0.771523 0.110625 0.504451 0.307538 0.307538C0.504451 0.110625 0.771523 0 1.05 0L5.8653 0ZM2.1 3.5H7.7V4.9H2.1V3.5ZM5.6 6.3H2.1V7.7H5.6V6.3ZM2.1 9.1H4.2V10.5H2.1V9.1ZM12.3949 10.7051C12.2637 10.5738 12.0856 10.5 11.9 10.5H10.5V9.1C10.5 8.91435 10.4263 8.7363 10.295 8.60502C10.1637 8.47375 9.98565 8.4 9.8 8.4C9.61435 8.4 9.4363 8.47375 9.30503 8.60502C9.17375 8.7363 9.1 8.91435 9.1 9.1V10.5H7.7C7.51435 10.5 7.3363 10.5737 7.20503 10.705C7.07375 10.8363 7 11.0143 7 11.2C7 11.3857 7.07375 11.5637 7.20503 11.695C7.3363 11.8262 7.51435 11.9 7.7 11.9H9.1V13.3C9.1 13.4857 9.17375 13.6637 9.30503 13.795C9.4363 13.9262 9.61435 14 9.8 14C9.98565 14 10.1637 13.9262 10.295 13.795C10.4263 13.6637 10.5 13.4857 10.5 13.3V11.9H11.9C12.0384 11.9 12.1737 11.8589 12.2888 11.782C12.4039 11.7051 12.4936 11.5957 12.5466 11.4679C12.5995 11.34 12.6134 11.1992 12.5864 11.0635C12.5594 10.9277 12.4928 10.803 12.3949 10.7051Z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="observe-edit-container">
                  <button className="observe-edit" onClick={handleEditClick}>
                    ویرایش درخواست
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8.60103 4.68222L9.31648 5.39778L2.2708 12.4444H1.55534V11.7289L8.60103 4.68222ZM11.4006 0C11.2062 0 11.004 0.0777778 10.8563 0.225556L9.43314 1.64889L12.3494 4.56556L13.7725 3.14222C14.0758 2.83889 14.0758 2.34889 13.7725 2.04556L11.9528 0.225556C11.7973 0.07 11.6028 0 11.4006 0ZM8.60103 2.48111L0 11.0833V14H2.91626L11.5173 5.39778L8.60103 2.48111Z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="observe-line-button">
                <div className="observe-child-list-container">
                  <button
                    className="observe-child-list"
                    onClick={() => setIsChildSee(true)}
                  >
                    مشاهده درخواست‌های جزئی
                    <svg
                      width="14"
                      height="9"
                      viewBox="0 0 14 9"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 1.2C9.41182 1.2 11.5627 2.478 12.6127 4.5C11.5627 6.522 9.41818 7.8 7 7.8C4.58182 7.8 2.43727 6.522 1.38727 4.5C2.43727 2.478 4.58818 1.2 7 1.2ZM7 0C3.81818 0 1.10091 1.866 0 4.5C1.10091 7.134 3.81818 9 7 9C10.1818 9 12.8991 7.134 14 4.5C12.8991 1.866 10.1818 0 7 0ZM7 3C7.87818 3 8.59091 3.672 8.59091 4.5C8.59091 5.328 7.87818 6 7 6C6.12182 6 5.40909 5.328 5.40909 4.5C5.40909 3.672 6.12182 3 7 3ZM7 1.8C5.42182 1.8 4.13636 3.012 4.13636 4.5C4.13636 5.988 5.42182 7.2 7 7.2C8.57818 7.2 9.86364 5.988 9.86364 4.5C9.86364 3.012 8.57818 1.8 7 1.8Z" />
                    </svg>
                  </button>
                </div>
                <div className="observe-delete-container">
                  <button
                    className="observe-delete"
                    onClick={() => setIsDelete(true)}
                  >
                    حذف درخواست
                    <svg
                      width="11"
                      height="14"
                      viewBox="0 0 11 14"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8.64286 4.66667V12.4444H2.35714V4.66667H8.64286ZM7.46429 0H3.53571L2.75 0.777778H0V2.33333H11V0.777778H8.25L7.46429 0ZM10.2143 3.11111H0.785714V12.4444C0.785714 13.3 1.49286 14 2.35714 14H8.64286C9.50714 14 10.2143 13.3 10.2143 12.4444V3.11111Z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="observe-line-button">
                <div className="observe-back-container">
                  <button
                    className="observe-back"
                    onClick={() => {
                      navigate('/requests');
                    }}
                  >
                    <svg width="21" height="32" viewBox="0 0 21 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.68164 1.22266C4.26572 0.75704 5.11602 0.790223 5.66211 1.32227L19.6143 14.9258L19.7207 15.041C20.1828 15.5952 20.1828 16.4048 19.7207 16.959L19.6143 17.0742L5.66211 30.6777C5.11602 31.2098 4.26572 31.243 3.68164 30.7773L3.56836 30.6777L1.38477 28.5479C0.781478 27.9596 0.781108 26.9903 1.38379 26.4014L11.6621 16.3574L11.7285 16.2783C11.8411 16.1106 11.8411 15.8894 11.7285 15.7217L11.6621 15.6426L1.38379 5.59863C0.781108 5.00974 0.781477 4.04041 1.38477 3.45215L3.56836 1.32227L3.68164 1.22266Z" fill="#FF0000" stroke="black"/>
                    </svg>

                    بازگشت
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <NavigationBar selected={3} />
      </div>

      {isDelete && (
        <>
          <div className="block-overlay-container" onClick={() => setIsDelete(false)}></div>
          <div className="delete-overlay-container">
            <p>آیا از حذف این درخواست اطمینان دارید؟</p>
            <div className="delete-overlay-buttons">
              <button className="no-button" onClick={() => setIsDelete(false)}>
                خیر
              </button>
              <button className="yes-button" onClick={handleDelete}>
                 {isLoadingButtonDelete?<LoadingButton dimension={10} stroke={2} color={'#fffff'} />:" بلی "}
              </button>
            </div>
          </div>
        </>
      )}
      {isChildCreate && (
        <>
          <div className="block-overlay-container" onClick={() => setIsChildCreate(false)}></div>
          <div className="child-creation-overlay-container">
            <form>
              <div>
                <label for="child-creation-description">
                  توضیحات درخواست:<sup>*</sup>
                </label>
                <textarea
                  id="child-creation-description"
                  value={childData.beneficiary_request_child_description}
                  onChange={handleChildDescriptionChange}
                ></textarea>
              </div>

              <div>
                <label for="child-creation-document">مستندات درخواست:</label>
                <div
                  {...getRootProps()}
                  className={`dropzone ${isDragActive ? 'active' : ''}`}
                >
                  {childData.beneficiary_request_child_document.length ===
                    0 && (
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
                  {childData.beneficiary_request_child_document.length > 0 && (
                    <div className="upload-files-wrapper">
                      <input {...getInputProps()} />
                      <div className="upload-content-with-files">
                        <svg width="7" height="14" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.04545 3.18182V10.5C6.04545 11.9064 4.90636 13.0455 3.5 13.0455C2.09364 13.0455 0.954545 11.9064 0.954545 10.5V2.54545C0.954545 1.66727 1.66727 0.954545 2.54545 0.954545C3.42364 0.954545 4.13636 1.66727 4.13636 2.54545V9.22727C4.13636 9.57727 3.85 9.86364 3.5 9.86364C3.15 9.86364 2.86364 9.57727 2.86364 9.22727V3.18182H1.90909V9.22727C1.90909 10.1055 2.62182 10.8182 3.5 10.8182C4.37818 10.8182 5.09091 10.1055 5.09091 9.22727V2.54545C5.09091 1.13909 3.95182 0 2.54545 0C1.13909 0 0 1.13909 0 2.54545V10.5C0 12.4345 1.56545 14 3.5 14C5.43455 14 7 12.4345 7 10.5V3.18182H6.04545Z" fill="black"/>
                        </svg>

                        <p>افزودن</p>
                      </div>

                      <div className="file-previews">
                        {childData.beneficiary_request_child_document.map(
                          (file, index) => (
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
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
            {!childCreationValidation && (
              <div>لطفا بخش توضیحات درخواست را پر کنید</div>
            )}

            <div className="child-creation-overlay-buttons">
              <button
                className="no-button"
                onClick={() => setIsChildCreate(false)}
              >
                لغو
              </button>
              <button style={isLoadingButtonChildCreation?{width:`${childCreateBorderDiff}px`}:null} className="yes-button" onClick={handleChildCreation}>
{   isLoadingButtonChildCreation?<LoadingButton dimension={10} stroke={2} color={'#ffffff'} />:            " ایجاد درخواست جزئی"
}              </button>
            </div>
          </div>
        </>
      )}
      {
        isDeleteFinished && (
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

        <h1>درخواست شما با موفقیت حذف گردید.</h1>

        <p>تا لحظاتی دیگر به صفحه سوابق درخواست منتقل می‌شوید.</p>
      </div>
          </>
        )
      }
      {
        isChildCreateFinish && (
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
      {isChildSee && (
        <>
          <div className="block-overlay-container" onClick={() => setIsChildSee(false)}></div>
          <div className="child-request-list-overlay">
            <div className="button-container" id="close-button-sticky">
              <button onClick={() => setIsChildSee(false)}>
                بستن
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
            {childSeeData.length === 0 && <div style={{textAlign:"center", fontSize:"0.8rem"}}>موردی وجود ندارد.</div>}
            {/* Repeatable request section */}
            {childSeeData.length > 0 &&
              childSeeData.slice().reverse().map((item, reversedIndex) => {
                const index = childSeeData.length - 1 - reversedIndex;
                return(
                <section key={item.beneficiary_request_child_id}>
                  <div className='title-div'>
                    <h2>{`درخواست جزئی شماره ${toPersianDigits(index + 1)}`}</h2>
                    <span>
                        {gregorianToJalali(
                          item.beneficiary_request_child_created_at
                        )}
                      </span>
                  </div>


                  <div className="textarea-div">
                    <label htmlFor={`request-description-${index}`}>
                      توضیحات
                      <br />
                      درخواست:
                    </label>
                    <textarea
                      id={`request-description-${index}`}
                      readOnly
                      value={item.beneficiary_request_child_description}
                      style={{pointerEvents:"none"}}
                    />
                  </div>

                  <div className="file-input-div">
                    

                    {childFiles[index].length > 0 && (
                      <>
                        <label htmlFor={`request-document-${index}`}>
                          مستندات
                          <br />
                          درخواست:
                        </label>
                        <label
                          htmlFor="request-document-review1-id"
                          className="upload-label"
                          id="label-for-file-input"
                          readOnly
                        >
                        <div className="file-previews">
                          {childFiles[index].map((file, idx) => (
                            <div key={idx} className="file-preview">
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
                            </div>
                          ))}
                        </div>
                        </label>
                      </>
                    )}
                  </div>

                  <hr className="input-divider" />

                  <div className="metadata-container">
                    <div className="text-input-div">
                      <p>ایجاد شده توسط:</p>
                      <span>
                        {item.beneficiary_request_child_is_created_by_charity
                          ? 'اپراتور خیریه'
                          : 'شخص کاربر'}
                      </span>
                    </div>
                    <div className="text-input-div">
                      <p>وضعیت درخواست:</p>
                      <span>
                        {convertStageChild(
                          item.beneficiary_request_child_processing_stage
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="button-container">
                    <button
                    onClick={() => {
                            setIsChildRemove(true);
                          setChildIndex(index);
                          setChildId(item.beneficiary_request_child_id);
                        
                        }}
                    >
                      حذف
                      <svg
                        width="11"
                        height="14"
                        viewBox="0 0 11 14"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8.64286 4.66667V12.4444H2.35714V4.66667H8.64286ZM7.46429 0H3.53571L2.75 0.777778H0V2.33333H11V0.777778H8.25L7.46429 0ZM10.2143 3.11111H0.785714V12.4444C0.785714 13.3 1.49286 14 2.35714 14H8.64286C9.50714 14 10.2143 13.3 10.2143 12.4444V3.11111Z" />
                      </svg>
                    </button>
                  </div>
                </section>
)})}
          </div>
          {
            isChildRemove && (
              <>
              <div className="block-overlay-container"  style={{zIndex:"9999"}} onClick={() => setIsChildRemove(false)}></div>
          <div className="delete-overlay-container" style={{zIndex:"10000"}}>
            <p>آیا از حذف این درخواست اطمینان دارید؟</p>
            <div className="delete-overlay-buttons">
              <button className="no-button" onClick={() => setIsChildRemove(false)}>
                خیر
              </button>
              <button className="yes-button" onClick={() =>{
                        handleChildRemove(
                          childIndex,
                          childId,
                        )
                        setIsChildRemove(false)
                      }
                      }>
                 بلی
              </button>
            </div>
          </div>
              </>
            )
          }
        </>
      )}
    </>
  );
}

export default RequestDetail;
