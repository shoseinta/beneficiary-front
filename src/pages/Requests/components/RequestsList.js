import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import observe_icon from '../../../media/icons/observe_icon.svg';
import { toJalaali } from 'jalaali-js';

function RequestsList({ data, index}) {
    useEffect(() => {
        console.log(data)
    })

    const convertTypeLayer1 = (type) => {
        if (type === 'Good'){
            return "کالا"
        }else if (type === 'Cash'){
            return "وجه نقد"

        }else if (type === 'Service'){
            return "خدمت"
        }
    }
    const convertStage = (type) => {
     if (type === 'Submitted'){
        return "ثبت شده";
     }else if (type === 'Pending Review'){
        return "در انتظار بررسی";
     }else if (type === 'Under Evaluation') {
        return "در حال ارزیابی";
     }else if (type === 'Approved'){
        return "تایید شده";

     }else if (type === 'Rejected'){
        return "رد شده";
     }else if (type === 'Completed'){
        return "تکمیل شده";
     }else if (type === 'In Progress'){
        return "در حال انجام";

     }
    }
    if (!data) {
        return <div>Loading...</div>;
    }



    

      // Function to convert Gregorian date to Persian digits
  const toPersianDigits = (num) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, (d) => persianDigits[d]);
  };

  // Function to convert Gregorian to Jalali date
  const gregorianToJalali = (dateString) => {
      if (!dateString) return "تاریخ نامشخص";
      
      try {
          const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
          const { jy, jm, jd } = toJalaali(year, month, day);
          return `${toPersianDigits(jy)}/${toPersianDigits(jm)}/${toPersianDigits(jd)}`;
      } catch (error) {
          console.error("Date conversion error:", error);
          return "تاریخ نامشخص";
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
            {
                data.map((request, idx) => (
                    <tr key={idx}>
                        <td>{gregorianToJalali(request.effective_date)}</td>
                        <td>{`${convertTypeLayer1(request.beneficiary_request_type_layer1)} - ${request.beneficiary_request_type_layer2}`}</td>
                        <td>{convertStage(request.beneficiary_request_processing_stage)}</td>
                        <td>
                            <Link to={`/${request.beneficiary_request_id}/request-detail`}>مشاهده</Link>
                            <img src={observe_icon} alt="مشاهده" />
                        </td>
                    </tr>
                ))
            }
        </tbody>
      </table>
    );
}

export default RequestsList;
