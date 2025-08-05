import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import observe_icon from '../../../media/icons/observe_icon.svg';
import { toJalaali } from 'jalaali-js';
import LoadingPage from '../../../components/loadingPage/LoadingPage';

function RequestsList({ data, index }) {
  useEffect(() => {
    console.log(data);
  });

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
  if (!data) {
    return (
    <>
    <table className="request-table">
      <thead>
        <tr>
          <th>تاریخ ثبت</th>
          <th>نوع درخواست</th>
          <th>وضعیت درخواست</th>
          <th>عملیات</th>
        </tr>
      </thead>
    </table>
    </>
    )
  }

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

  return (
    <table className="request-table">
      <thead>
        <tr>
          <th>تاریخ ثبت</th>
          <th>نوع درخواست</th>
          <th>وضعیت درخواست</th>
          <th>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 && data.map((request, idx) => (
          <tr key={idx}>
            <td>{gregorianToJalali(request.effective_date)}</td>
            <td>{`${convertTypeLayer1(request.beneficiary_request_type_layer1)} - ${request.beneficiary_request_type_layer2}`}</td>
            <td>
              {convertStage(request.beneficiary_request_processing_stage)}
            </td>
            <td>
              <Link to={`/${request.beneficiary_request_id}/request-detail`} style={{color:"#185EA0"}}>
                مشاهده
              </Link>
              <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1.2C9.41182 1.2 11.5627 2.478 12.6127 4.5C11.5627 6.522 9.41818 7.8 7 7.8C4.58182 7.8 2.43727 6.522 1.38727 4.5C2.43727 2.478 4.58818 1.2 7 1.2ZM7 0C3.81818 0 1.10091 1.866 0 4.5C1.10091 7.134 3.81818 9 7 9C10.1818 9 12.8991 7.134 14 4.5C12.8991 1.866 10.1818 0 7 0ZM7 3C7.87818 3 8.59091 3.672 8.59091 4.5C8.59091 5.328 7.87818 6 7 6C6.12182 6 5.40909 5.328 5.40909 4.5C5.40909 3.672 6.12182 3 7 3ZM7 1.8C5.42182 1.8 4.13636 3.012 4.13636 4.5C4.13636 5.988 5.42182 7.2 7 7.2C8.57818 7.2 9.86364 5.988 9.86364 4.5C9.86364 3.012 8.57818 1.8 7 1.8Z" fill="#185EA0"/>
              </svg>
            </td>
          </tr>
        ))}
        {data.length === 0 && (
          <tr>
            <td colSpan="4" style={{ textAlign: 'center' }}>
              هیچ موردی وجود ندارد
            </td>
          </tr>
        )}
      </tbody>

    </table>
  );
}

export default RequestsList;
