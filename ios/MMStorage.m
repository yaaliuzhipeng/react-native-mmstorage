// MMStorage.m

#import "MMStorage.h"

const int DOUBLE = 0;
const int FLOAT = 1;
const int INT = 2;
const int BOOLEAN = 3;
const int STRING = 4;

@implementation MMStorage
{
    NSMutableDictionary *instances;
    NSString *rootDir;
}

-(MMKV *) getInstance: (NSString *)id
{
    if(instances == nil) {
        instances = [NSMutableDictionary new];
    }
    if([id isEqualToString:@""] || id == nil){
        return MMKV.defaultMMKV;
    }
    MMKV* ins = [instances objectForKey:id];
    if(ins == nil){
        return nil;
    }else{
        return ins;
    }
    return MMKV.defaultMMKV;
}

RCT_EXPORT_MODULE()


RCT_EXPORT_METHOD(initMMStorage: (NSArray *)ids)
{
    instances = [NSMutableDictionary new];
    rootDir = [MMKV initializeMMKV:nil];
    for (NSString* id in ids) {
        MMKV* ins = [MMKV mmkvWithID:id];
        [instances setObject:ins forKey:id];
    }
}
RCT_EXPORT_METHOD(setBoolValue:
                  (NSString *)id
                  key:(NSString *) key
                  value:(BOOL)value)
{
    MMKV* ins = [self getInstance:id];
    if(ins != nil) {
        [ins setBool:value forKey:key];
    }
}
RCT_EXPORT_METHOD(setNumberValue:
                  (NSString *)id
                  key:(NSString *) key
                  value:(double) value
                  preciseType: (int) preciseType)
{
    MMKV* ins = [self getInstance:id];
    if(ins != nil) {
        switch (preciseType) {
            case DOUBLE:
                [ins setDouble:value forKey:key];
                break;
            case FLOAT:
                [ins setFloat:(float)value forKey: key];
                break;
            case INT:
                //浮点转整型会有精度损失、默认向下取整
                [ins setInt64:(int)value forKey:key];
                break;
            default:
                [ins setDouble:value forKey:key];
                break;
        }
    }
}
RCT_EXPORT_METHOD(setStringValue:
                  (NSString *)id
                  key:(NSString *) key
                  value:(NSString *) value)
{
    MMKV* ins = [self getInstance:id];
    if(ins != nil) {
        [ins setString:value forKey:key];
    }
}
RCT_EXPORT_METHOD(getValue:
                  (NSString *)id
                  key:(NSString *) key
                  type:(int) type
                  callback: (RCTResponseSenderBlock)callback)
{
    MMKV* ins = [self getInstance:id];
    if(ins != nil) {
        switch (type) {
            case DOUBLE:
                callback(@[[NSNumber numberWithDouble:[ins getDoubleForKey: key]]]);
                break;
            case FLOAT:
                callback(@[[NSNumber numberWithFloat:[ins getFloatForKey: key]]]);
                break;
            case INT:
                callback(@[[NSNumber numberWithLongLong:(int64_t)[ins getInt64ForKey: key]]]);
                break;
            case BOOLEAN:
                callback(@[[NSNumber numberWithBool:[ins getBoolForKey: key]]]);
                break;
            case STRING:
                callback(@[[ins getStringForKey:key]]);
                break;
            default:
                break;
        }
    }
}
RCT_EXPORT_METHOD(getStringValue:
                  (NSString *)id
                  key:(NSString *) key
                  callback: (RCTResponseSenderBlock)callback)
{
    MMKV* ins = [self getInstance:id];
    if(ins != nil) {
        callback(@[[ins getStringForKey:key]]);
    }
}
RCT_EXPORT_METHOD(hasKey: (NSString *)id
                  key:(NSString *) key
                  callback:(RCTResponseSenderBlock)callback)
{
    MMKV* ins = [self getInstance:id];
    if(ins != nil) {
        BOOL exist = [ins containsKey:key];
        NSNumber* e = [NSNumber numberWithBool:exist];
        callback(@[e]);
    }
}
RCT_EXPORT_METHOD(delValue:
                  (NSString *)id
                  key:(NSString *) key)
{
    MMKV* ins = [self getInstance:id];
    if(ins != nil) {
        [ins removeValueForKey:key];
    }
}
RCT_EXPORT_METHOD(delAllValue:(NSString *)id)
{
    MMKV* ins = [self getInstance:id];
    if(ins != nil) {
        [ins clearAll];
    }
}

@end
