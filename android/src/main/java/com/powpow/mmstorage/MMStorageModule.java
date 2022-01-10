// MMStorageModule.java

package com.powpow.mmstorage;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableArray;

import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.ExceptionsManagerModule;
import com.tencent.mmkv.MMKV;

import java.util.HashMap;


public class MMStorageModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private HashMap<String, MMKV> instances;
    private String rootDir = "";

    private final int DOUBLE = 0;
    private final int FLOAT = 1;
    private final int INT = 2;
    private final int BOOLEAN = 3;
    private final int STRING = 4;

    public MMStorageModule(ReactApplicationContext reactContext) {
        super(reactContext);
        instances = new HashMap<String, MMKV>();
        this.reactContext = reactContext;
    }

    private MMKV getInstance(String id) {
        if (id.equals("")) {
            return MMKV.defaultMMKV();
        }
        if (instances.containsKey(id)) {
            return instances.get(id);
        }
        WritableNativeMap err = new WritableNativeMap();
        err.putString("message","instance with id "+id+" not existed, please init instance before using");
        ExceptionsManagerModule module = reactContext.getNativeModule(ExceptionsManagerModule.class);
        if(module != null) {
            module.reportException(err);
        }
        return null;
    }

    @Override
    public String getName() {
        return "MMStorage";
    }

    @ReactMethod
    public void initMMStorage(ReadableArray ids) {
        rootDir = MMKV.initialize(reactContext);
        for (int i = 0; i < ids.size(); i++) {
            MMKV ins = MMKV.mmkvWithID(ids.getString(i));
            instances.put(ids.getString(i), ins);
        }
    }

    @ReactMethod
    public void setBoolValue(String id, String key, boolean value) {
        MMKV ins = getInstance(id);
        if(ins != null) {
            ins.encode(key,value);
        }
    }

    @ReactMethod
    public void setNumberValue(String id, String key, double value,int preciseType) {
        MMKV ins = getInstance(id);
        if (ins != null) {
            switch (preciseType){
                case DOUBLE:
                    ins.encode(key,value);
                    break;
                case FLOAT:
                    ins.encode(key,(float)value);
                    break;
                case INT:
                    ins.encode(key,(int)value);
                    break;
                default:
                    //default to 0: double
                    ins.encode(key,value);
                    break;
            }
        }
    }

    @ReactMethod
    public void setStringValue(String id, String key, String value) {
        MMKV ins = getInstance(id);
        if(ins != null) {
            ins.encode(key,value);
        }
    }

    @ReactMethod
    public void getValue(String id,String key,int type,Callback callback) {
        MMKV ins = getInstance(id);
        if(ins != null) {
            switch (type) {
                case DOUBLE:
                    callback.invoke(ins.decodeDouble(key));
                    break;
                case FLOAT:
                    callback.invoke(ins.decodeFloat(key));
                    break;
                case INT:
                    callback.invoke(ins.decodeInt(key));
                    break;
                case BOOLEAN:
                    callback.invoke(ins.decodeBool(key));
                    break;
                case STRING:
                    callback.invoke(ins.decodeString(key));
                    break;
                default:
                    callback.invoke((Object) null);
                    // wrong type , return null;
                    break;
            }
        }
    }
    @ReactMethod
    public void getStringValue(String id,String key,Callback callback) {
        MMKV ins = getInstance(id);
        if(ins != null) {
            callback.invoke(ins.decodeString(key));
        }
    }

    @ReactMethod
    public void hasKey(String id,String key,Callback callback){
        MMKV ins = getInstance(id);
        if(ins != null) {
            boolean exist = ins.containsKey(key);
            callback.invoke(exist);
        }
    }

    @ReactMethod
    public void delValue(String id,String key) {
        MMKV ins = getInstance(id);
        if(ins != null) {
            ins.removeValueForKey(key);
        }
    }

    @ReactMethod
    public void delAllValue(String id) {
        MMKV ins = getInstance(id);
        if(ins != null) {
            ins.removeValuesForKeys(ins.allKeys());
        }
    }
}
