import hamburger_icon from '../../media/icons/hamburger_icon.svg';
import charity_typo_white from '../../media/images/charity_typo_white.png';
import charity_logo from '../../media/images/charity_logo.png';
import { useLookup } from '../../context/LookUpContext';
function Header() {
  const {setHamburger} = useLookup();
  return (
    <header className="header">
      <button type="menu" id="hamburger" onClick={() => setHamburger(true)}>
        <img src={hamburger_icon} alt="منوی تنظیمات" />
      </button>
      <img src={charity_typo_white} id="typo" alt="تایپوگرافی نام خیریه" />
      <img src={charity_logo} id="logo" alt="لوگوی خیریه" />
    </header>
  );
}

export default Header;
