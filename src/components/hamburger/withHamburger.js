import { useLookup } from "../../context/LookUpContext";
import Hamburger from "./Hamburger";

const withHamburger = (WrappedComponent) => {
    return function WithHam(props) {  // Accept props here
        const { hamburger } = useLookup();
        return (
            <>
                <WrappedComponent {...props} />  {/* Pass props through */}
                {hamburger && <Hamburger />}
            </>
        );
    }
}

export default withHamburger;