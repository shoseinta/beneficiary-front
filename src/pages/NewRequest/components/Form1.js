import { useState, useEffect } from "react";

function Form1({ requestData, setRequestData, setNextActive, typeLayerOne, typeLayerTwo }) {
    // Initialize with null and only set after typeLayerOne is loaded
    const [selectedTypeLayerOne, setSelectedTypeLayerOne] = useState(null);
    

    // Set the default selection when typeLayerOne loads
    useEffect(() => {
        if (typeLayerOne && typeLayerOne.length > 0) {
            setSelectedTypeLayerOne(typeLayerOne[0]);
        }
    }, [typeLayerOne]);

    useEffect(() => {
        const isFormComplete = (requestData.beneficiary_request_type_layer1 && requestData.beneficiary_request_type_layer2 && requestData.beneficiary_request_amount !== "")
        setNextActive(isFormComplete)
    },[requestData])

    useEffect(() => {
        console.log(requestData)
    },[requestData])
    useEffect(() => {
        if(selectedTypeLayerOne){
            setRequestData(pre => ({...pre, beneficiary_request_type_layer1:selectedTypeLayerOne.beneficiary_request_type_layer1_id, beneficiary_request_type_layer2:""}))
        }
        
    },[selectedTypeLayerOne])
    const typeLayerOneSelection = (typeLayerOne) => {
        setSelectedTypeLayerOne(typeLayerOne);
        //setRequestData(pre => ({...pre, beneficiary_request_type_layer1:typeLayerOne.beneficiary_request_type_layer1_id}))
        
    }

    const handleTypeLayerTwoSelection = (event) => {
        const selectedId = event.target.value;
        const selectedItem = typeLayerTwo.find(
            item => item.beneficiary_request_type_layer2_id.toString() === selectedId
        );
        setRequestData(pre => ({...pre,beneficiary_request_type_layer2:selectedItem.beneficiary_request_type_layer2_id}));
    };

    const handleAmountChange = (event) => {
        if (event.target.value !== ""){
            setRequestData(pre => ({...pre,beneficiary_request_amount:Number(event.target.value)}));
        }else {
            setRequestData(pre => ({...pre,beneficiary_request_amount:""}));
        }
        
    };

    // Add loading state
    if (!typeLayerOne || !Array.isArray(typeLayerOne)) {
        return <p>Loading options...</p>;
    }

    if (!selectedTypeLayerOne) {
        return <p>Loading selection...</p>;
    }

    return (
        <>
            <p>select type layer one</p>
            {typeLayerOne.map(element => {
                return (
                    <div 
                        key={element.beneficiary_request_type_layer1_id} 
                        onClick={() => typeLayerOneSelection(element)}
                        style={{
                            padding: '10px',
                            margin: '5px',
                            border: selectedTypeLayerOne?.beneficiary_request_type_layer1_id === element.beneficiary_request_type_layer1_id 
                                ? '2px solid blue' 
                                : '1px solid gray',
                            cursor: 'pointer'
                        }}
                    >
                        {element.beneficiary_request_type_layer1_name}
                    </div>
                );
            })}

            {selectedTypeLayerOne.beneficiary_request_type_layer1_name === 'good' ?
                <p>what type of good you want?</p> :
                selectedTypeLayerOne.beneficiary_request_type_layer1_name === 'cash' ?
                <p>for what you need cash?</p> :
                <p>what service you need?</p>
            }

            {typeLayerTwo
                .filter((element) => {
                    return element.beneficiary_request_type_layer1 === 
                        selectedTypeLayerOne.beneficiary_request_type_layer1_id;
                })
                .map((item) => {
                    return (
                        <div key={item.beneficiary_request_type_layer2_id}>
                            <input 
                                type="radio" 
                                id={item.beneficiary_request_type_layer2_id} 
                                name="options" 
                                onChange={handleTypeLayerTwoSelection}
                                value={item.beneficiary_request_type_layer2_id} 
                            />
                            <label htmlFor={item.beneficiary_request_type_layer2_id}>
                                {item.beneficiary_request_type_layer2_name}
                            </label>
                            <br/>
                        </div>
                    );
                })
            }
            <p>what amount?</p>
            <input type="number" onChange={handleAmountChange} />
        </>
    );
}

export default Form1;