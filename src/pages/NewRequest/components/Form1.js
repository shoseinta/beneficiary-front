import { useState, useEffect } from "react";
import Header from '../../../components/header/Header';
import NavigationBar from '../../../components/navigationBar/NavigationBar';
import step1_active from '../../../media/icons/step1_active.svg'
import step2 from '../../../media/icons/step2.svg';
import step3 from '../../../media/icons/step3.svg';
import step4 from '../../../media/icons/step4.svg';
import next_icon from '../../../media/icons/next_icon.svg';
import './Form1.css'

function Form1({ requestData, setRequestData, setNextActive, typeLayerOne, typeLayerTwo, setStep }) {
    // Initialize with null and only set after typeLayerOne is loaded
    const [selectedTypeLayerOne, setSelectedTypeLayerOne] = useState(requestData.beneficiary_request_type_layer1);
    

    // Set the default selection when typeLayerOne loads
    // useEffect(() => {
    //     if (typeLayerOne && typeLayerOne.length > 0) {
    //         setSelectedTypeLayerOne(typeLayerOne[0]);
    //     }
    // }, [typeLayerOne]);

    useEffect(() => {
        const isFormComplete = (requestData.beneficiary_request_type_layer1 && requestData.beneficiary_request_type_layer2)
        setNextActive(isFormComplete)
    },[requestData])

    // useEffect(() => {
    //     if(selectedTypeLayerOne){
    //         setRequestData(pre => ({...pre, beneficiary_request_type_layer1:selectedTypeLayerOne, beneficiary_request_type_layer2:""}))
    //     }
        
    // },[selectedTypeLayerOne])
    const typeLayerOneSelection = (e) => {
        setSelectedTypeLayerOne(Number(e.target.value));
        setRequestData(pre => ({...pre, beneficiary_request_type_layer1:Number(e.target.value),beneficiary_request_type_layer2:""}))
        
    }

    const handleTypeLayerTwoSelection = (event) => {
        const selectedId = event.target.value;
        const selectedItem = typeLayerTwo.find(
            item => item.beneficiary_request_type_layer2_id.toString() === selectedId
        );
        setRequestData(pre => ({...pre,beneficiary_request_type_layer2:selectedItem.beneficiary_request_type_layer2_id}));
    };

    // Add loading state
    if (!typeLayerOne || !Array.isArray(typeLayerOne)) {
        return <p>Loading options...</p>;
    }

    // if (!selectedTypeLayerOne) {
    //     return <p>Loading selection...</p>;
    // }

    return (
        <div className="form1-container">
            <Header />
            <main className="main">
                <nav className="nav-up">
                <ol className="nav-list-up">
                    <li className="nav-item-up" id="active-nav-up">
                    <div> 
                        <span className="step-icon"><img src={step1_active} alt="" /></span>
                        <p> نوع درخواست </p> 
                    </div>
                    </li>
                    <li className="nav-item-up">
                    <div> 
                        <span className="step-icon"><img src={step2} alt="" /></span>
                        <p> تعیین تاریخ </p> 
                    </div>
                    </li>
                    <li className="nav-item-up">
                    <div> 
                        <span className="step-icon"><img src={step3} alt="" /></span>
                        <p> اطلاعات تکمیلی </p>
                    </div>
                    </li>
                    <li className="nav-item-up">
                    <div> 
                        <span className="step-icon"><img src={step4} alt="" /></span>
                        <p> تأیید نهایی </p> 
                    </div>
                    </li>
                </ol>
                </nav>

                <form className="form">
                    
                <fieldset className="type-layer1 input-space">
                    <legend className="label-space"> نوع درخواست شما در کدامیک از دسته‌های زیر قرار دارد؟ <sup>*</sup></legend>
                    
                    <div className="choice-group">
                        <input 
                        type="radio" 
                        id="type-good" 
                        name="request_type" 
                        value={typeLayerOne[0].beneficiary_request_type_layer1_id} 
                        checked={selectedTypeLayerOne === typeLayerOne[0].beneficiary_request_type_layer1_id} 
                        onChange={typeLayerOneSelection}
                        />
                        <label htmlFor="type-good">کالا</label>

                        <input 
                        type="radio" 
                        id="type-cash" 
                        name="request_type" 
                        value={typeLayerOne[1].beneficiary_request_type_layer1_id} 
                        checked={selectedTypeLayerOne === typeLayerOne[1].beneficiary_request_type_layer1_id}
                        onChange={typeLayerOneSelection}
                        />
                        <label htmlFor="type-cash"> وجه نقد </label>

                        <input 
                        type="radio" 
                        id="type-service" 
                        name="request_type" 
                        value={typeLayerOne[2].beneficiary_request_type_layer1_id}
                        checked={selectedTypeLayerOne === typeLayerOne[2].beneficiary_request_type_layer1_id} 
                        onChange={typeLayerOneSelection}
                        />
                        <label htmlFor="type-service"> خدمت </label>
                    </div>
                </fieldset>

                <div className="type-layer2 input-space">
                    <label htmlFor="type-layer2-id" className="label-space"> {selectedTypeLayerOne === 1 &&
                    'کالای درخواستی شما در کدامیک از دسته های زیر قرار دارد؟' }
                   { selectedTypeLayerOne === 2 &&
                'وجه نقد درخواستی شما در کدامیک از دسته های زیر قرار دارد؟' }
                {selectedTypeLayerOne === 3 && 'خدمت درخواستی شما در کدامیک از دسته های زیر قرار دارد؟'}<sup>*</sup></label>
                    {selectedTypeLayerOne && <select 
                    id="type-layer2-id" 
                    name="type-layer2" 
                    required
                    value={requestData.beneficiary_request_type_layer2}
                    onChange={handleTypeLayerTwoSelection}
                    >
                        <option value="" disabled>انتخاب کنید</option>
                        {typeLayerTwo
                            .filter((element) => {
                                return element.beneficiary_request_type_layer1 === 
                                    selectedTypeLayerOne
                            })
                            .map((item) => {
                                return (
                                    <option value={item.beneficiary_request_type_layer2_id}>{item.beneficiary_request_type_layer2_name}</option>
                                );
                            })
                        }

                    </select>}
                </div>

                <div></div>
                </form>

                <div className="next-btn">
                <button onClick={() => setStep(pre => pre + 1)}>
                    <span> بعدی</span>
                    <img src={next_icon} alt="دکمه بعدی" />
                </button>
                </div>

                <div></div>
            </main>

            <NavigationBar />
        </div>
    );
}

export default Form1;
