// main index.js

import { NativeModules } from 'react-native';
const { MMStorage: RNMMStorage } = NativeModules;

const DOUBLE:number = 0;
const FLOAT:number = 1;
const INT:number = 2;
const BOOLEAN:number = 3;
const STRING:number = 4;

export type PreciseTypeNumber = 'DOUBLE' | 'FLOAT' | 'INT'
export type PreciseType = PreciseTypeNumber | 'BOOLEAN' | 'STRING';
function typeMap(type: PreciseType) {
    switch (type) {
        case 'DOUBLE':
            return DOUBLE;
        case 'FLOAT':
            return FLOAT;
        case 'INT':
            return INT;
        case 'BOOLEAN':
            return BOOLEAN;
        case 'STRING':
            return STRING;
        default:
            return STRING;
    }
}

function initMMStorage(ids?: string[]){
    RNMMStorage.initMMStorage(ids ?? []);
}
function setBoolValue(key:string, value:boolean,id?:string){
    RNMMStorage.setBoolValue(id ?? "",key,value);
}
function setNumberValue(key:string, value:number,preciseType:PreciseTypeNumber,id?:string){
    RNMMStorage.setNumberValue(id ?? "",key,value,typeMap(preciseType))
}
function setStringValue(key:string, value:string,id?:string){
    RNMMStorage.setStringValue(id ?? "",key,value)
}
function getStringValue(key:string,id?:string){
    return new Promise(function(resolve,reject) {
        RNMMStorage.getStringValue(id ?? "",key,(v) => {
            resolve(v);
        })
    })
}
function _getValue(key:string,type:PreciseType,id?:string){
    return new Promise(function(resolve,reject) {
        RNMMStorage.getValue(id ?? "", key, typeMap(type), (v) => {
            resolve(v);
        })
    })
}

function hasKey(key:string,id?:string){
    return new Promise(function(resolve,reject) {
        RNMMStorage.hasKey(id ?? "",key,(v) => {
            resolve(v ? true : false);
        })
    })
}
function delValue(key:string,id?:string){
    RNMMStorage.delValue(id ?? "",key)
}
function delAllValue(id?:string){
    RNMMStorage.delAllValue(id ?? "")
}

function setValue(key:string,value:any,preciseType?:PreciseType,id?:string){
    if(preciseType) {
        if(preciseType == 'DOUBLE' || preciseType == 'FLOAT' || preciseType == 'INT'){
            setNumberValue(key,value,preciseType as PreciseTypeNumber,id ?? "");
        }else if(preciseType == 'BOOLEAN'){
            setBoolValue(key,value,id ?? "");
        }else if(preciseType == 'STRING'){
            setStringValue(key,value,id ?? "");
        }
    }else{
        if(typeof value === 'number'){
            setNumberValue(key,value,'DOUBLE',id ?? "");
        }else if(typeof value === 'string'){
            setStringValue(key,value,id ?? "");
        }else if(typeof value === 'boolean'){
            setBoolValue(key,value,id ?? "")
        }
    }
}
function setStringifyValue(key:string,value:any,id?:string) {
    let v = "";
    if(value !== undefined && value !== null) {
        v = (typeof value !== 'string') ? JSON.stringify(value) : value;
    }
    setStringValue(key,v,id);
}
function getParsedValue(key:string,id?:string) {
    return new Promise((resolve,reject) => {
        _getValue(key,'STRING',id).then((rs:any) => {
            try {
                let v = JSON.parse(rs);
                resolve(v);
            } catch (error) {
                resolve(rs);
            }
        })
    })
}

function getValue(key:string,preciseType?:PreciseType,id?:string){
    if(preciseType){
        return _getValue(key,preciseType,id)
    }else{
        return _getValue(key,'STRING',id)
    }
}

const MMStorage = {
    initMMStorage,
    delValue,
    delAllValue,
    hasKey,
    getValue,
    setValue,
    setStringifyValue,
    getParsedValue,
    getStringValue,
}
export default MMStorage;