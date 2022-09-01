import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Keyboard} from 'react-native';

import Picker from './src/components/Picker/index';

import api from './src/services/api';

function App(){

  const [moedas, setMoedas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [moedaSelecionada, setMoedaSelecionada] = useState(null);
  const [segundaMoedaSelecionada, setSegundaMoedaSelecionada] = useState(null);
  const [moedaBValor, setMoedaBValor] = useState(null);

  const [valorMoeda, setValorMoeda] = useState(null);
  const [valorConvertido, setValorConvertido] = useState(null);

  useEffect(()=>{
    async function getMoedas(){
      const response = await api.get('all');
      let arrayMoedas = Object.keys(response.data).map((item, index)=>{
        return {key:String(index), label:item, value:item}
      });
      arrayMoedas.push({key:String(arrayMoedas.length), label:'BRL', value:'BRL'})
      setMoedas(arrayMoedas);
      setLoading(false);
    }
    getMoedas();
  },[]);

  async function converter(){
    if(moedaSelecionada === null){
      alert('Por favor selecione uma moeda a ser convertida. ');
      return;
    }
    if(segundaMoedaSelecionada === null){
      alert('Por favor selecione uma moeda para converter. ');
      return;
    }
    if(moedaBValor === null || moedaBValor.trim().length === 0){
      alert('Por favor digite um valor a ser convertido. ');
      return;
    }
    
    const response = (moedaSelecionada!='BRL')&& 
    await api.get(`all/${moedaSelecionada}-BRL`);

    const secondResponse = (segundaMoedaSelecionada!='BRL')&&
    await api.get(`all/${segundaMoedaSelecionada}-BRL`);

    const convertida = (moedaSelecionada!='BRL')?
                       response.data[moedaSelecionada].ask:1;
    console.log(convertida);

    const conversor = (segundaMoedaSelecionada!='BRL')?
                      secondResponse.data[segundaMoedaSelecionada].ask:1;
    console.log(conversor);

    if(isNaN(
      ((convertida*moedaBValor)/conversor)
    )){
      alert('Por favor digite um valor válido. ');
      return;
    }
    let resultado = (((convertida*parseFloat(moedaBValor))/conversor));
    setValorConvertido(resultado.toFixed(2));
    let valorDisplay = parseFloat(moedaBValor);
    setValorMoeda(valorDisplay.toFixed(2));
    Keyboard.dismiss();
  }

  if(loading){
    return(
      <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#101215',}}>
        <ActivityIndicator
          color='#fff' size={45}
        />
      </View>
    );
  }else{
    return(
      <View style={[styles.container]}>
        <View style={[styles.areaMoeda]}>
          <Text style={[styles.titulo]} >Selecione a moeda a ser convertida</Text>
          <Picker
            moedas = {moedas}
            moedaSelecionada={moedaSelecionada}
            onChange={(moeda)=>{setMoedaSelecionada(moeda)}}
          />
        </View>
        <View style={[styles.areaMoedaC]}>
          <Text style={[styles.titulo]} >Selecione a moeda para converter</Text>
          <Picker
            moedas = {moedas}
            moedaSelecionada={segundaMoedaSelecionada}
            onChange={(moeda)=>{setSegundaMoedaSelecionada(moeda)}}
          />
        </View>
        
        <View style={[styles.areaValor]}>
          <Text style={[styles.titulo]} >Digite um valor a ser convertido</Text>
          <TextInput
            placeholder='Ex: 28'
            style={[styles.imput]}
            keyboardType='numeric'
            onChangeText={(value)=>{setMoedaBValor(value.replace(',','.'))}}
          />
        </View>

        <TouchableOpacity
          style={[styles.btnArea]}
          onPress={converter}
        >
          <Text style={[styles.btnTexto]} >Converter</Text>
        </TouchableOpacity>

        { valorConvertido!=null&&(
        <View style={[styles.areaResultado]} >
          <Text style={[styles.valorConvertido]} >{valorMoeda} {moedaSelecionada}</Text>
          <Text style={[styles.valorConvertido, {fontSize:18, margin:8,}]} >Corresponde a</Text>
          <Text style={[styles.valorConvertido]} >{valorConvertido} {segundaMoedaSelecionada}</Text>
        </View>
        )}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    backgroundColor:'#101215',
    paddingTop:40,
  },
  areaMoeda:{
    width:'90%',
    backgroundColor:'#f9f9f9',
    paddingTop:9,
    borderTopRightRadius:9,
    borderTopLeftRadius:9,
    marginBottom:2,
  },
  areaMoedaC:{
    width:'90%',
    backgroundColor:'#f9f9f9',
    paddingTop:9,
    marginBottom:1,
  },
  titulo:{
    fontSize:15,
    color:'#000',
    paddingTop:5,
    paddingLeft:5,
  },
  areaValor:{
    width:'90%',
    backgroundColor:'#f9f9f9',
    paddingBottom:9,
    paddingTop:9,
  },
  imput:{
    width:'100%',
    padding:10,
    height:45,
    fontSize:20,
    marginTop:8,
    color:'#000',
  },
  btnArea:{
    width:'90%',
    backgroundColor:'#fb4b57',
    height:45,
    borderBottomRightRadius:9,
    borderBottomLeftRadius:9,
    alignItems:'center',
    justifyContent:'center',
  },
  btnTexto:{
    fontSize:18,
    fontWeight:'bold',
    color:'#fff',
  },
  areaResultado:{
    width:'90%',
    backgroundColor:'#fff',
    marginTop:35,
    alignItems:'center',
    justifyContent:'center',
    padding:25,
  },
  valorConvertido:{
    fontSize:39,
    fontWeight:'bold',
    color:'#000',
  },
});

export default App;
