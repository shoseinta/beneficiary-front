import Header from "../header/Header";
import NavigationBar from "../navigationBar/NavigationBar";
import LoadingButton from "../loadingButton/LoadingButton";
import './LoadingPage.css'; // Assuming you have a CSS file for styling
function LoadingPage () {
    return (
    <div className='loading-container'>
        <LoadingButton dimension={30} stroke={4} color={'#185ea0'} />
        <p>لطفا کمی منتظر بمانید...</p>
    </div>
    )
}

export default LoadingPage;