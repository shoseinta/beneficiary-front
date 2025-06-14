import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import observe_icon from '../../../media/icons/observe_icon.svg';

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
      // Extract YYYY-MM-DD part from ISO string
      const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
      
      // Simple conversion algorithm (approximate)
      const gregorianYear = year;
      const gregorianMonth = month;
      const gregorianDay = day;
      
      let jalaliYear, jalaliMonth, jalaliDay;
      
      if (gregorianMonth > 2 || (gregorianMonth === 2 && gregorianDay > 20)) {
        jalaliYear = gregorianYear - 621;
      } else {
        jalaliYear = gregorianYear - 622;
      }
      
      // Simple month/day conversion (not precise for all dates)
      if (gregorianMonth < 3) {
        jalaliMonth = gregorianMonth + 9;
        jalaliDay = gregorianDay + 10;
        if (jalaliDay > 30) {
          jalaliDay -= 30;
          jalaliMonth++;
        }
      } else {
        jalaliMonth = gregorianMonth - 3;
        jalaliDay = gregorianDay + 10;
        if (jalaliDay > 31) {
          jalaliDay -= 31;
          jalaliMonth++;
        }
      }
      
      // Format with Persian digits
      return `${toPersianDigits(jalaliYear)}/${toPersianDigits(jalaliMonth)}/${toPersianDigits(jalaliDay)}`;
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
