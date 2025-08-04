import { useState, useEffect, useRef } from 'react';
import Header from '../../../components/header/Header';
import NavigationBar from '../../../components/navigationBar/NavigationBar';
import back_icon from '../../../media/icons/back_icon.svg';
import next_icon from '../../../media/icons/next_icon.svg';
import './Form2.css';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import DateObject from 'react-date-object';
import FormHeader from './FormHeader';
import { doc } from 'prettier';

function Form2({
  setOneTimeData,
  setRecurringData,
  duration,
  setRequestData,
  onetimeData,
  recurringData,
  requestData,
  nextActive,
  setNextActive,
  setStep,
  typeLayerOne,
}) {
  
  const [selectedDuration, setSelectedDuration] = useState(
    requestData.beneficiary_request_duration
  );
  const [jalaliValue, setJalaliValue] = useState(null);
  const toPersianDigits = (num) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, (x) => persianDigits[x]);
  };
  const [dateSelected, setDateSelected] = useState(false);

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
      week.querySelectorAll('.rmdp-week-day').forEach((item) => {
        item.style.textAlign = 'center';
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
  // Add commas as thousand separators
  const addCommas = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const formattedValue =
    requestData.beneficiary_request_amount === ''
      ? ''
      : toPersianDigits(addCommas(requestData.beneficiary_request_amount));
  const [dispalyValue, setDisplayValue] = useState(formattedValue);
  
  const todayJalali = new DateObject({ calendar: persian, locale: persian_fa });

  const datepickerRef = useRef();
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

  useEffect(() => {
    const wrapperDiv = datepickerRef.current?.querySelector('.rmdp-wrapper');
    if (wrapperDiv) {
      wrapperDiv.style.display = 'block';
      wrapperDiv.style.width = '100%';
      wrapperDiv.style.maxWidth = '100%';
    }
  }, [jalaliValue]); // or use [] if once is enough

  useEffect(() => {
    if (onetimeData?.beneficiary_request_duration_onetime_deadline) {
      const newDate = new DateObject({
        date: onetimeData.beneficiary_request_duration_onetime_deadline,
        calendar: 'gregorian',
      })
        .convert(persian)
        .setLocale(persian_fa);

      // Avoid unnecessary update that causes flicker
      if (
        !jalaliValue 
      ) {
        setJalaliValue(newDate);
      }
    }
  }, [onetimeData]);

  const handleJalaliDateChange = (dateObj) => {
    if (dateObj) {
      const gregorianDate = dateObj.toDate(); // native JS Date
      const isoDate = gregorianDate.toISOString().split('T')[0]; // "YYYY-MM-DD"

      setOneTimeData((prev) => ({
        ...prev,
        beneficiary_request_duration_onetime_deadline: isoDate,
      }));
    }
  };

  const handleDeadLineChange = (event) => {
    setOneTimeData((pre) => ({
      ...pre,
      beneficiary_request_duration_onetime_deadline: event.target.value,
    }));
  };
  const handleLimitChange = (event) => {
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

    // Enforce max limit of 12
    if (englishValue && Number(englishValue) > 12) {
      englishValue = '12';
    }
    if (englishValue && Number(englishValue) < 1) {
      englishValue = '1';
    }

    // Update the state with the English number (or empty string)
    const newValue = englishValue === '' ? '' : Number(englishValue);
    setRecurringData((prev) => ({
      ...prev,
      beneficiary_request_duration_recurring_limit: newValue,
    }));

    // Update the displayed value with Persian digits (no commas)
    const displayValue =
      englishValue === '' ? '' : toPersianDigits(englishValue);
    event.target.value = displayValue;
  };

  // Convert Persian digits to English
  const toEnglishDigits = (str) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str
      .toString()
      .split('')
      .map((c) => {
        const index = persianDigits.indexOf(c);
        return index >= 0 ? index : c;
      })
      .join('')
      .replace(/,/g, '');
  };

  const handleDurationChange = (event) => {
    setSelectedDuration(Number(event.target.value));
    if (!event.target.value) {
      setRequestData((pre) => ({ ...pre, beneficiary_request_duration: '' }));
    } else {
      setRequestData((pre) => ({
        ...pre,
        beneficiary_request_duration: Number(event.target.value),
      }));
    }
  };

  //  useEffect(() => {
  //         if(selectedDuration){
  //             setRequestData(pre => ({...pre, beneficiary_request_duration:selectedDuration.beneficiary_request_duration_id}))
  //         }

  //     },[selectedDuration])
  // useEffect(() => {
  //         if (duration && duration.length > 0) {
  //             setSelectedDuration(duration[0]);
  //         }
  //     }, [duration]);

  //     useEffect(() => {
  //         if (selectedDuration){
  // console.log(selectedDuration.beneficiary_request_duration_name)
  //         }

  //     })

  useEffect(() => {
    let isFormComplete = false;
    if (requestData.beneficiary_request_type_layer1 === typeLayerOne[1].beneficiary_request_type_layer1_id){
    if (
      requestData.beneficiary_request_duration &&
      selectedDuration === 1 &&
      onetimeData?.beneficiary_request_duration_onetime_deadline &&
      requestData.beneficiary_request_amount
    ) {
      isFormComplete = true;
    }
    if (
      requestData.beneficiary_request_duration &&
      selectedDuration === 2 &&
      recurringData?.beneficiary_request_duration_recurring_limit &&
      requestData.beneficiary_request_amount
    ) {
      isFormComplete = true;
    }
    if (requestData.beneficiary_request_duration && selectedDuration === 3 && requestData.beneficiary_request_type_layer1 === typeLayerOne[2].beneficiary_request_type_layer1_id) {
      isFormComplete = true;
    }
  } else {
    if (
      requestData.beneficiary_request_duration &&
      selectedDuration === 1 &&
      onetimeData?.beneficiary_request_duration_onetime_deadline
    ) {
      isFormComplete = true;
    }
    if (
      requestData.beneficiary_request_duration &&
      selectedDuration === 2 &&
      recurringData?.beneficiary_request_duration_recurring_limit
    ) {
      isFormComplete = true;
    }
    if (requestData.beneficiary_request_duration && selectedDuration === 3 && requestData.beneficiary_request_type_layer1 === typeLayerOne[2].beneficiary_request_type_layer1_id) {
      isFormComplete = true;
    }
  }
    setNextActive(isFormComplete);
  }, [requestData, onetimeData, recurringData]);

  const handleAmountChange = (event) => {
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
    const inputValue = englishValue === '' ? null : englishValue;
    if (!inputValue) {
      setRequestData((pre) => {
        return { ...pre, beneficiary_request_amount: '' };
      });
    } else {
      setRequestData((pre) => {
        return { ...pre, beneficiary_request_amount: inputValue};
      });
    }
    const formattedValue =
      inputValue === '' ? '' : toPersianDigits(addCommas(englishValue));
    setDisplayValue(formattedValue);
    // Update the displayed value with Persian digits (no commas)
    const displayValue =
      englishValue === '' ? '' : toPersianDigits(englishValue);
    event.target.value = displayValue;
  };

useEffect(() => {
    setDateSelected(false);
  },[jalaliValue])

  useEffect(() => {
    const input = document.getElementById('time-layer2-recurring-id');
    if (!input) return;
    if(!recurringData.beneficiary_request_duration_recurring_limit) return;
    let span = document.getElementById('duration-unit-span');
    if (!span) {
      span = document.createElement('span');
      span.id = 'duration-unit-span';
      span.innerText = 'دوره ماهانه';
      span.style.position = 'absolute';
      span.style.whiteSpace = 'nowrap';
      span.style.pointerEvents = 'none';
      span.style.fontSize = '14px';
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
        rect.left +
        inputWidth/2 -
        textWidth -
        70  +
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
  }, [recurringData]);

  useEffect(() => {
    const input = document.getElementById('cash-amount');
    if (!input) return;
    if(!requestData.beneficiary_request_amount) return;
    let span = document.getElementById('amount-unit-span');
    if (!span) {
      span = document.createElement('span');
      span.id = 'amount-span';
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
        rect.left +
        inputWidth/2 -
        textWidth/2 -
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
  }, [requestData.beneficiary_request_amount]);
  useEffect(() => {
    document.documentElement.classList.add('form2-html');
    document.body.classList.add('form2-body');

    return () => {
      document.documentElement.classList.remove('form2-html');
      document.body.classList.remove('form2-body');
    };
  }, []);
  if (!duration || !Array.isArray(duration)) {
    return <p>Loading options...</p>;
  }

  
  return (
    <div className="form2-container">
      <Header />
      <main className="main">
        <FormHeader step={2} />

        <div className="form2-forms">

        <form className="form">
          <fieldset className="time-layer1 input-space">
            <legend className="label-space">
              {' '}
              درخواست شما در کدامیک از گزینه‌های زمانی زیر قرار دارد؟{' '}
              <sup>*</sup>
            </legend>

            <div className="choice-group2">
              <input
                type="radio"
                id="one-time"
                name="request_time"
                value={duration[0].beneficiary_request_duration_id}
                onChange={handleDurationChange}
                checked={
                  selectedDuration ===
                  duration[0].beneficiary_request_duration_id
                }
              />
              <label htmlFor="one-time">فقط یکبار </label>

              <input
                type="radio"
                id="recurring"
                name="request_time"
                value={duration[1].beneficiary_request_duration_id}
                onChange={handleDurationChange}
                checked={
                  selectedDuration ===
                  duration[1].beneficiary_request_duration_id
                }
              />
              <label htmlFor="recurring"> به‌صورت ماهانه </label>

              {requestData.beneficiary_request_type_layer1 === typeLayerOne[2].beneficiary_request_type_layer1_id ?
                <>
                <input
                type="radio"
                id="permanent"
                name="request_time"
                value={duration[2].beneficiary_request_duration_id}
                onChange={handleDurationChange}
                checked={
                  selectedDuration ===
                  duration[2].beneficiary_request_duration_id
                }
              />
              <label htmlFor="permanent"> به‌صورت دائمی </label>
              </>:
              <>
                <input
                type="radio"
                id="permanent"
                name="request_time"
                value={null}
                checked={false}
                onClick={() => {alert('برای درخواست از نوع کالا و وجه نقد، نمی‌توان درخواست دائمی ثبت کرد.')}}
              />
              <label htmlFor="permanent" style={{color:"rgba(0, 0, 0, 0.5)", borderColor:"rgba(0, 0, 0, 0.5)"}}> به‌صورت دائمی </label>
              </>
              }
            </div>
          </fieldset>

          {duration.find(
            (item) => item.beneficiary_request_duration_name === 'one_time'
          ).beneficiary_request_duration_id === selectedDuration ? (
            <div className="time-layer2 input-space" id="time-layer2-one-time">
              <label htmlFor="time-layer2-one-time-id" className="label-space">
                {' '}
                آخرین زمانی که می‌خواهید درخواست شما انجام شود، چه تاریخی است؟
                <sup>*</sup>
              </label>

              <DatePicker
                value={jalaliValue}
                onChange={(dateObj) => {
                  setJalaliValue(dateObj);
                  const gregorianDate = dateObj.toDate();
                  const isoDate = gregorianDate.toISOString().split('T')[0];
                  setOneTimeData((prev) => ({
                    ...prev,
                    beneficiary_request_duration_onetime_deadline: isoDate,
                  }));
                }}
                calendar={persian}
                locale={persian_fa}
                arrow={false}
                calendarPosition="bottom-center"
                placeholder="تاریخ را انتخاب کنید"
                inputClass="custom-datepicker-input"
                minDate={todayJalali}
                onOpenPickNewDate={false}
                onOpen={() => setDateSelected(true)}
                onClose={() => setDateSelected(false)}
                onFocusedDateChange={() => setDateSelected(true)}
                
              />
            </div>
          ) : null}
          {duration.find(
            (item) => item.beneficiary_request_duration_name === 'recurring'
          ).beneficiary_request_duration_id === selectedDuration ? (
            <div className="time-layer2 input-space" id="time-layer2-recurring">
              <label htmlFor="time-layer2-recurring-id" className="label-space">
                {' '}
                دوره‌های ماهانه درخواست شما چه تعداد است؟ <sup>*</sup>
              </label>
              <input
                type="text"
                id="time-layer2-recurring-id"
                placeholder="برای مثال: ۱۲"
                value={
                  recurringData.beneficiary_request_duration_recurring_limit
                    ? toPersianDigits(
                        recurringData.beneficiary_request_duration_recurring_limit.toString()
                      )
                    : ''
                }
                onChange={handleLimitChange}
                inputMode="numeric"
                style={{direction:"ltr"}}
              />
            </div>
          ) : null}

          { requestData.beneficiary_request_type_layer1 === typeLayerOne[1].beneficiary_request_type_layer1_id &&
            <div className="cash-input-wrapper input-space">
            {duration.find(
              (item) => item.beneficiary_request_duration_name === 'one_time'
            ).beneficiary_request_duration_id === selectedDuration ? (
              <label
                htmlFor="cash-amount"
                className="label-space"
                id="cash-input-one-time-permanent"
              >
                {' '}
                مبلغ (به تومان) مورد نیاز شما برای این درخواست چه مقدار است؟{' '}
                <sup>*</sup>
              </label>
            ) : null}
            {duration.find(
              (item) => item.beneficiary_request_duration_name === 'recurring'
            ).beneficiary_request_duration_id === selectedDuration ? (
              <label
                htmlFor="cash-amount"
                className="label-space"
                id="cash-input-recurring"
              >
                {' '}
                مبلغ (به تومان) مورد نیاز شما برای هر ماه چه مقدار است؟{' '}
                <sup>*</sup>
              </label>
            ) : null}
            {duration.find(
              (item) => item.beneficiary_request_duration_name === 'one_time'
            ).beneficiary_request_duration_id === selectedDuration ||
            duration.find(
              (item) => item.beneficiary_request_duration_name === 'recurring'
            ).beneficiary_request_duration_id === selectedDuration ? (
              <>
                <div className="cash-input-box">
                  <input
                    type="text"
                    id="cash-amount"
                    name="cash_amount"
                    inputMode="numeric"
                    placeholder="برای مثال: ۱٫۰۰۰٫۰۰۰"
                    value={dispalyValue}
                    onChange={handleAmountChange}
                    style={{direction:"ltr"}}
                  />
                </div>
                <div id="cash-in-words" className="amount-preview"></div>
              </>
            ) : null}
          </div>}

          <div></div>
        </form>
        </div>

        <div className="next-back-btn">
          <button onClick={() => setStep((pre) => pre - 1)}>
            <svg width="21" height="32" viewBox="0 0 21 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.68164 1.22266C4.26572 0.75704 5.11602 0.790223 5.66211 1.32227L19.6143 14.9258L19.7207 15.041C20.1828 15.5952 20.1828 16.4048 19.7207 16.959L19.6143 17.0742L5.66211 30.6777C5.11602 31.2098 4.26572 31.243 3.68164 30.7773L3.56836 30.6777L1.38477 28.5479C0.781478 27.9596 0.781108 26.9903 1.38379 26.4014L11.6621 16.3574L11.7285 16.2783C11.8411 16.1106 11.8411 15.8894 11.7285 15.7217L11.6621 15.6426L1.38379 5.59863C0.781108 5.00974 0.781477 4.04041 1.38477 3.45215L3.56836 1.32227L3.68164 1.22266Z" fill="#FF0000" stroke="black"/>
            </svg>

            <span> قبلی</span>
          </button>

          {nextActive ? (
            <div className="next-btn">
              <button onClick={() => setStep((pre) => pre + 1)}>
                <span> بعدی</span>
                <svg width="21" height="32" viewBox="0 0 21 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.3184 1.22266C16.7343 0.75704 15.884 0.790223 15.3379 1.32227L1.38574 14.9258L1.2793 15.041C0.817171 15.5952 0.81717 16.4048 1.2793 16.959L1.38574 17.0742L15.3379 30.6777C15.884 31.2098 16.7343 31.243 17.3184 30.7773L17.4316 30.6777L19.6152 28.5479C20.2185 27.9596 20.2189 26.9903 19.6162 26.4014L9.33789 16.3574L9.27148 16.2783C9.15894 16.1106 9.15894 15.8894 9.27148 15.7217L9.33789 15.6426L19.6162 5.59863C20.2189 5.00974 20.2185 4.04041 19.6152 3.45215L17.4316 1.32227L17.3184 1.22266Z" fill="#3F9633" stroke="black"/>
                </svg>

              </button>
            </div>
          ) : (
            <div class="next-lock-btn">
              <button>
                <span> بعدی</span>
                <svg
                  width="21"
                  height="32"
                  viewBox="0 0 21 32"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.3184 1.22266C16.7343 0.75704 15.884 0.790223 15.3379 1.32227L1.38574 14.9258L1.2793 15.041C0.817171 15.5952 0.81717 16.4048 1.2793 16.959L1.38574 17.0742L15.3379 30.6777C15.884 31.2098 16.7343 31.243 17.3184 30.7773L17.4316 30.6777L19.6152 28.5479C20.2185 27.9596 20.2189 26.9903 19.6162 26.4014L9.33789 16.3574L9.27148 16.2783C9.15894 16.1106 9.15894 15.8894 9.27148 15.7217L9.33789 15.6426L19.6162 5.59863C20.2189 5.00974 20.2185 4.04041 19.6152 3.45215L17.4316 1.32227L17.3184 1.22266Z" />
                </svg>
              </button>
            </div>
          )}
        </div>

      </main>
      <NavigationBar selected={2} />
      {/* <p>select duration</p>
            {duration.map(element => {
                return (
                    <div 
                        key={element.beneficiary_request_duration_id} 
                        onClick={() => durationSelection(element)}
                        style={{
                            padding: '10px',
                            margin: '5px',
                            border: selectedDuration?.beneficiary_request_duration_id === element.beneficiary_request_duration_id 
                                ? '2px solid blue' 
                                : '1px solid gray',
                            cursor: 'pointer'
                        }}
                    >
                        {element.beneficiary_request_duration_name}
                    </div>
                );
            })} */}
      {/* {selectedDuration.beneficiary_request_duration_name === 'one_time'?
            <>
                <p>select deadline:</p>
                <input type="date" value={onetimeData.beneficiary_request_duration_onetime_deadline} onChange={handleDeadLineChange}/>
            </>:null}
            {
                selectedDuration.beneficiary_request_duration_name === 'recurring'?
                <>
                <p>how many times?</p>
                <input type="number" min={1} max={12} value={recurringData.beneficiary_request_duration_recurring_limit} onChange={handleLimitChange}/>
                </>:null
            } */}
    </div>
  );
}

export default Form2;
