import NavigationBar from "../../components/navigationBar/NavigationBar";
import Header from "../../components/header/Header";
import Account1 from "./components/Account1";
import { useState,useEffect } from "react";

function Account() {
    const [step, setStep] = useState(1);
    const [accountData, setAccountData] = useState(null);
    

     // Function to load account data
    const loadAccountData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/information/`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Token ${localStorage.getItem('access_token')}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAccountData(data);
                // Process the data as needed
            }catch (error) {
                console.error('Error fetching account data:', error);
            }
        }
    useEffect(() => {
        loadAccountData();
    }, []);
    return(
        <>
        {step === 1 && <Account1 accountData={accountData} setAccountData={setAccountData} setStep={setStep}/>}
        </>
    )
}

export default Account