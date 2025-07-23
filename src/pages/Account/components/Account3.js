import Header from "../../../components/header/Header";
import NavigationBar from "../../../components/navigationBar/NavigationBar";
import { useState, useEffect } from "react";
import './Account3.css';
import { useLookup } from "../../../context/LookUpContext";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>موقعیت انتخاب شده</Popup>
    </Marker>
  );
}

function Account3({ accountData, setAccountData, setStep, setLoad, hasAddress }) {
  const { provinces, cities } = useLookup();
  const [submit, setSubmit] = useState(false);

  const [validation, setValidation] = useState({
    neighbor: true,
    street: true,
    alley: true,
    postal_code: true,
  });

  const [blur, setBlur] = useState({
    neighbor: true,
    street: true,
    alley: true,
    postal_code: true,
  });

  // Initialize position state with proper fallbacks
  const [position, setPosition] = useState(() => {
    if (accountData?.beneficiary_user_address?.latitude && 
        accountData?.beneficiary_user_address?.longitude) {
      return [
        accountData.beneficiary_user_address.latitude,
        accountData.beneficiary_user_address.longitude
      ];
    }
    return [35.6892, 51.3890]; // Default to Tehran coordinates
  });

  // Update position if accountData changes
  useEffect(() => {
    if (accountData?.beneficiary_user_address?.latitude && 
        accountData?.beneficiary_user_address?.longitude) {
      setPosition([
        accountData.beneficiary_user_address.latitude,
        accountData.beneficiary_user_address.longitude
      ]);
    }
  }, [accountData]);

  const isPersian = (text) => {
    const persianRegex = /^[\u0600-\u06FF\u0621-\u064A\s]+$/;
    return persianRegex.test(text);
  };

  const isDigit = (text) => {
    const digitRegex = /^[\u06F0-\u06F90-9]+$/;
    return digitRegex.test(text);
  };

  const handleMapConfirm = () => {
    setAccountData(pre => ({
      ...pre,
      beneficiary_user_address: {
        ...pre.beneficiary_user_address,
        latitude: position[0],
        longitude: position[1]
      }
    }));
  };

  const handleNeighborChange = e => {
    setBlur(pre => ({...pre, neighbor: false}));
    setAccountData(pre => {
      const newData = {...pre};
      newData.beneficiary_user_address.neighborhood = e.target.value;
      return newData;
    });
    setValidation(pre => ({...pre, neighbor: isPersian(e.target.value)}));
  };

  const handleStreetChange = e => {
    setBlur(pre => ({...pre, street: false}));
    setAccountData(pre => {
      const newData = {...pre};
      newData.beneficiary_user_address.street = e.target.value;
      return newData;
    });
    setValidation(pre => ({...pre, street: isPersian(e.target.value)}));
  };

  const handleAlleyChange = e => {
    setBlur(pre => ({...pre, alley: false}));
    setAccountData(pre => {
      const newData = {...pre};
      newData.beneficiary_user_address.alley = e.target.value;
      return newData;
    });
    setValidation(pre => ({...pre, alley: isPersian(e.target.value)}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasAddress && validation.neighbor && validation.street && validation.alley && validation.postal_code) {
      try {
        const response = await fetch(`https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/update-user-address/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({
            alley: accountData?.beneficiary_user_address?.alley || null,
            building_number: accountData?.beneficiary_user_address?.building_number || null,
            city: accountData?.beneficiary_user_address?.city || null,
            latitude: accountData?.beneficiary_user_address?.latitude || null,
            longitude: accountData?.beneficiary_user_address?.longitude || null,
            neighborhood: accountData?.beneficiary_user_address?.neighborhood || null,
            postal_code: accountData?.beneficiary_user_address?.postal_code || null,
            province: accountData?.beneficiary_user_address?.province || null,
            street: accountData?.beneficiary_user_address?.street || null,
            unit: accountData?.beneficiary_user_address?.unit || null,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Update failed');
        }
        
        const result = await response.json();
        console.log(result);
        setSubmit(true);
        setLoad(true);
        setTimeout(() => setSubmit(false), 5000);
      } catch (err) {
        console.error(err);
      }
    } else if (!hasAddress && validation.neighbor && validation.street && validation.alley && validation.postal_code) {
      try {
        const response = await fetch(`https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/create-user-address/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({
            alley: accountData?.beneficiary_user_address?.alley || null,
            building_number: accountData?.beneficiary_user_address?.building_number || null,
            city: accountData?.beneficiary_user_address?.city || null,
            latitude: accountData?.beneficiary_user_address?.latitude || null,
            longitude: accountData?.beneficiary_user_address?.longitude || null,
            neighborhood: accountData?.beneficiary_user_address?.neighborhood || null,
            postal_code: accountData?.beneficiary_user_address?.postal_code || null,
            province: accountData?.beneficiary_user_address?.province || null,
            street: accountData?.beneficiary_user_address?.street || null,
            unit: accountData?.beneficiary_user_address?.unit || null,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Creation failed');
        }
        
        const result = await response.json();
        console.log(result);
        setSubmit(true);
        setLoad(true);
        setTimeout(() => setSubmit(false), 5000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    document.documentElement.classList.add('account-container3-html');
    document.body.classList.add('account-container3-body');
    
    return () => {
      document.documentElement.classList.remove('account-container3-html');
      document.body.classList.remove('account-container3-body');
    };
  }, []);

  useEffect(() => {
    console.log(accountData)
  })

  return (
    <div className="account-container3">
      <Header />
      <main className="main">
        <section>
          <h1>
            با انتخاب هر یک از موارد زیر، می‌توانید با تکمیل بخش‌های خالی اقدام به اشتراک اطلاعات خود با خیریه کنید.
          </h1>
        </section>

        <nav className="nav-up">
          <ul className="nav-list-up">
            <li onClick={() => setStep(1)} className="nav-item-up">
              <a>اطلاعات حساب کاربری</a>
            </li>
            <li onClick={() => setStep(2)} className="nav-item-up">
              <a>اطلاعات شخصی کاربر</a>
            </li>
            <li onClick={() => setStep(3)} className="nav-item-up" id="active-nav-up">
              <a>اطلاعات آدرس کاربر</a>
            </li>
            <li onClick={() => setStep(4)} className="nav-item-up">
              <a>اطلاعات تکمیلی کاربر</a>
            </li>
          </ul>
        </nav>

        <form className="account-form3" onSubmit={handleSubmit}>
          <div className="form-up">
            <div>
              <label htmlFor="account-province"> استان: </label>
              <select 
                id="account-province" 
                value={accountData?.beneficiary_user_address?.province || ""} 
                onChange={(e) => {
                  setAccountData(pre => {
                    const newData = {...pre};
                    newData.beneficiary_user_address.province = Number(e.target.value);
                    return newData;
                  });
                }}
              >
                <option value=""></option>
                {provinces.map(item => (
                  <option key={item.id} value={item.id}>{item.province_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="account-city"> شهر: </label>
              {accountData?.beneficiary_user_address?.province ? (
                <select 
                  id="account-city" 
                  value={accountData?.beneficiary_user_address?.city || ""} 
                  onChange={(e) => {
                    setAccountData(pre => {
                      const newData = {...pre};
                      newData.beneficiary_user_address.city = Number(e.target.value);
                      return newData;
                    });
                  }}
                >
                  <option value=""> </option>
                  {cities
                    .filter(item => item.province === accountData.beneficiary_user_address.province)
                    .map(item => (
                      <option key={item.id} value={item.id}>{item.city_name}</option>
                    ))}
                </select>
              ) : (
                <select id="account-city" value={accountData?.beneficiary_user_address?.city || ""}>
                  <option value="">لطفا ابتدا استان محل زندگی خود را انتخاب کنید</option>
                </select>
              )}
            </div>

            <div>
              <label htmlFor="account-neighbor"> محله: </label>
              <input 
                type="text" 
                id="account-neighbor" 
                value={accountData?.beneficiary_user_address?.neighborhood || ""}
                onChange={handleNeighborChange} 
                onBlur={() => setBlur(pre => ({...pre, neighbor: true}))}
              />
            </div>

            <div>
              <label htmlFor="account-postal"> کد پستی:</label>
              <input 
                type="text" 
                id="account-postal" 
                pattern="^[0-9۰-۹]{10}$" 
                inputMode="numeric"
                value={accountData?.beneficiary_user_address?.postal_code || ""} 
                onChange={(e) => {
                  setBlur(pre => ({...pre, postal_code: false}));
                  if (isDigit(e.target.value) || e.target.value === '') {
                    setAccountData(pre => {
                      const newData = {...pre};
                      newData.beneficiary_user_address.postal_code = e.target.value;
                      return newData;
                    });
                  }
                  if ((e.target.value.length) !== 10 && e.target.value !== "") {
                    setValidation(pre => ({...pre, postal_code: false}));
                  } else {
                    setValidation(pre => ({...pre, postal_code: true}));
                  }
                }}
                onBlur={() => setBlur(pre => ({...pre, postal_code: true}))}
                maxLength={10}
              />
            </div>

            <div>
              <label htmlFor="account-street"> خیابان: </label>
              <input 
                type="text" 
                id="account-street"
                value={accountData?.beneficiary_user_address?.street || ""}
                onChange={handleStreetChange}
                onBlur={() => setBlur(pre => ({...pre, street: true}))}
              />
            </div>

            <div>
              <label htmlFor="account-alley"> کوچه: </label>
              <input 
                type="text" 
                id="account-alley"
                value={accountData?.beneficiary_user_address?.alley || ""}
                onChange={handleAlleyChange} 
                onBlur={() => setBlur(pre => ({...pre, alley: true}))}
              />
            </div>

            <div>
              <label htmlFor="account-building-num"> پلاک: </label>
              <input 
                type="text" 
                id="account-building-num" 
                inputMode="numeric" 
                value={accountData?.beneficiary_user_address?.unit || ""}
                onChange={(e) => {
                  if (isDigit(e.target.value) || e.target.value === '') {
                    setAccountData(pre => {
                      const newData = {...pre};
                      newData.beneficiary_user_address.unit = Number(e.target.value);
                      return newData;
                    });
                  }
                }}
              />
            </div>

            <div>
              <label htmlFor="account-unit"> واحد: </label>
              <input 
                type="text" 
                id="account-unit" 
                inputMode="numeric" 
                value={accountData?.beneficiary_user_address?.building_number || ""}
                onChange={(e) => {
                  if (isDigit(e.target.value) || e.target.value === '') {
                    setAccountData(pre => {
                      const newData = {...pre};
                      newData.beneficiary_user_address.building_number = Number(e.target.value);
                      return newData;
                    });
                  }
                }}
              />
            </div>
          </div>

          <section>
            <p>آدرس خود را برروی نقشه زیر تعیین کنید:</p>
            <div id="map" style={{ height: '400px', width: '100%' }}>
              <MapContainer
                center={position}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker 
                  position={position} 
                  setPosition={(latlng) => setPosition([latlng.lat, latlng.lng])} 
                />
              </MapContainer>
            </div>
            <button 
              type="button" 
              onClick={handleMapConfirm}
              style={{ marginTop: '10px' }}
            >
              ثبت موقعیت
            </button>
          </section>

          <div id="account-submit3">
            {submit ? (
              <div>
                <svg
                  width="16"
                  height="14"
                  viewBox="0 0 16 14"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14.7373 0L4.94741 11.1961L1.22585 6.93997L0 8.34191L4.94741 14L15.9631 1.40194L14.7373 0Z"/>
                </svg>
                تغییرات با موفقیت اعمال شد
              </div>
            ) : (
              <div style={{visibility: "hidden"}}>
                <svg
                  width="16"
                  height="14"
                  viewBox="0 0 16 14"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14.7373 0L4.94741 11.1961L1.22585 6.93997L0 8.34191L4.94741 14L15.9631 1.40194L14.7373 0Z"/>
                </svg>
                تغییرات با موفقیت اعمال شد
              </div>
            )}
            {(!validation.neighbor || !validation.street || !validation.alley) && 
              blur.neighbor && blur.street && blur.alley && (
              <div className="error-message">لطفا نام محله و خیابان و کوچه خود را به فارسی وارد کنید</div>
            )}
            {!validation.postal_code && blur.postal_code && (
              <div className="error-message">لطفا یک کدپستی ده رقمی معتبر وارد کنید</div>
            )}
            <input type="submit" value="تأیید" />
          </div>
        </form>
      </main>
      <NavigationBar selected={4} />
    </div>
  );
}

export default Account3;