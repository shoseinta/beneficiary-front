import NavigationBar from "../../components/navigationBar/NavigationBar";
import Header from "../../components/header/Header";
import Account1 from "./components/Account1";
import { useState,useEffect } from "react";
import Account2 from "./components/Account2";
import Account3 from "./components/Account3";
import Account4 from "./components/Account4";

function Account() {
    const [step, setStep] = useState(1);
    const [accountData, setAccountData] = useState(null);
    const [load,setLoad] = useState(true)
    const [hasInformation,setHasInformation] = useState(false)
    const [hasAddress, setHasAddress] = useState(false)


    useEffect(() => {
        document.title = "صفحه حساب کاربری خیریه"
    },[])

    useEffect(() => {
        console.log(accountData)
    })
    

     // Function to load account data
    const loadAccountData = async () => {
            try {
                const response = await fetch(`https://charity-backend-staging.liara.run/beneficiary-platform/beneficiary/${localStorage.getItem('user_id')}/information/`,
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
                setLoad(false)
                if (data.beneficiary_user_information){
                    setHasInformation(true)
                }
                if (data.beneficiary_user_address){
                    setHasAddress(true)
                }
                // Process the data as needed
            }catch (error) {
                console.error('Error fetching account data:', error);
            }
        }
    useEffect(() => {
        if (load) {
            loadAccountData();
        }
        
    }, [load]);
    return(
        <>
        {step === 1 && <Account1 accountData={accountData} setAccountData={setAccountData} setStep={setStep} setLoad={setLoad}/>}
        {step === 2 && <Account2 accountData={accountData} setAccountData={setAccountData} setStep={setStep} setLoad={setLoad} hasInformation={hasInformation}/>}
        {step === 3 && <Account3 accountData={accountData} setAccountData={setAccountData} setStep={setStep} setLoad={setLoad} hasAddress={hasAddress} />}
        {step === 4 && <Account4 accountData={accountData} setAccountData={setAccountData} setStep={setStep} setLoad={setLoad}/>}
        </>
    )
}

export default Account