import more_icon from '../../media/icons/more_icon.svg';

function Carousel({ notification, notifIndex }) {
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

  if (!notification || !notification.items || notification.items.length === 0) {
    return null;
  }

  return (
    <main className="main">
      <div className="carousel">
        <article className="notification" id="notif1">
          <section className="h1">
            <img src="media/icons/bell_icon.svg" alt="" />
            <h1>{notification.title || "اطلاعیه‌های شما"}</h1>
          </section>
          <section className="h3">
            <h3>{notification.items[0]?.heading || "عنوان اطلاعیه"}</h3>
            <time dateTime={notification.items[0]?.date || ""}>
              {gregorianToJalali(notification.items[0]?.date) || "تاریخ"}
            </time>
          </section>
          <div>
            <p className="paragraph" id="para1">
              {notification.items[0]?.content || "توضیحات اطلاعیه"}
            </p>
          </div>
          <div className="details">
            <details>
              <summary className="summary"> موارد بیشتر <img src={more_icon} alt="" /> </summary>
            </details>
          </div>
        </article>
      </div>
      <div className="carousel-dots">
        {notifIndex === 0 ? <span className="dot active"></span> : <span className="dot"></span>}
        {notifIndex === 1 ? <span className="dot active"></span> : <span className="dot"></span>}
      </div>
    </main>
  );
}

export default Carousel;