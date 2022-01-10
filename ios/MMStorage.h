// MMStorage.h

#import <React/RCTBridgeModule.h>
#import <MMKV/MMKV.h>

@interface MMStorage : NSObject <RCTBridgeModule>
-(MMKV *) getInstance: (NSString *)id;
@end
