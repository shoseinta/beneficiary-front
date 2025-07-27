import { useState, useEffect } from "react";
import Header from '../../../components/header/Header';
import NavigationBar from '../../../components/navigationBar/NavigationBar';
import next_icon from '../../../media/icons/next_icon.svg';
import './Form1.css'
import FormHeader from "./FormHeader";

function Form1({ requestData, setRequestData,nextActive,setNextActive, typeLayerOne, typeLayerTwo, setStep}) {
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

    useEffect(()=>{
        document.documentElement.classList.add('form1-html')
        document.body.classList.add('form1-body')

        return ()=>{
            document.documentElement.classList.remove('form1-html')
            document.body.classList.remove('form1-body')
        }
    },[])

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
                <FormHeader step={1} />

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
                {selectedTypeLayerOne === 3 && 'خدمت درخواستی شما در کدامیک از دسته های زیر قرار دارد؟'}{(selectedTypeLayerOne === 1 || selectedTypeLayerOne ===2 || selectedTypeLayerOne === 3) &&<sup>*</sup>}</label>
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

                {nextActive ?<div className="next-btn">
                <button onClick={() => setStep(pre => pre + 1)}>
                    <span> بعدی</span>
                    <img src={next_icon} alt="دکمه بعدی" />
                </button>
                </div>:
                <div class="next-lock-btn">
                    <button>
                    <span> بعدی</span>
                    <svg width="21" height="32" viewBox="0 0 21 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.3184 1.22266C16.7343 0.75704 15.884 0.790223 15.3379 1.32227L1.38574 14.9258L1.2793 15.041C0.817171 15.5952 0.81717 16.4048 1.2793 16.959L1.38574 17.0742L15.3379 30.6777C15.884 31.2098 16.7343 31.243 17.3184 30.7773L17.4316 30.6777L19.6152 28.5479C20.2185 27.9596 20.2189 26.9903 19.6162 26.4014L9.33789 16.3574L9.27148 16.2783C9.15894 16.1106 9.15894 15.8894 9.27148 15.7217L9.33789 15.6426L19.6162 5.59863C20.2189 5.00974 20.2185 4.04041 19.6152 3.45215L17.4316 1.32227L17.3184 1.22266Z"/>
                    </svg>

                    </button>
                </div>}

                <div></div>
            </main>

            <NavigationBar selected={2}/>
        </div>
    );
}

export default Form1;
