import React from 'react';

import RNPickerSelect from 'react-native-picker-select';

function Picker(props){

    const placeholder = {
        label: "Selecione uma moeda...",
        value: null,        
    }

    return(
        <RNPickerSelect
            selectedValue={props.moedaSelecionada}
            placeholder={placeholder}
            placeholderColor='blue'
            items={props.moedas}
            onValueChange={(value)=>{props.onChange(value)}}
            style={{
                inputAndroid:{
                    fontSize:20,
                    color: '#000',
                },
                inputIOS:{
                    fontSize:20,
                    color: '#000',
                },
                inputWeb:{

                },    
                placeholder: {
                    color: '#000',
                },                        
            }}
        />
    );
}

export default Picker;