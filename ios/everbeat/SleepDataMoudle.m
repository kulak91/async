#import "SleepDataMoudle.h"
#import <React/RCTBridge.h>

#import "Sleepv4/SleepStagingV2+sleepCLibCall.h"
#import "Sleepv4/SleepStagingResultV2.h"

@implementation SleepDataMoudle

RCT_EXPORT_MODULE(SleepDataMoudle);

RCT_EXPORT_METHOD(getSleepData:(NSArray *)params callback:(RCTResponseSenderBlock)callback){
  NSLog(@"params = %@", params);

  dispatch_async(dispatch_get_main_queue(), ^{

    NSLog(@"params = %@", params);
    SleepStagingV2 *calcObj = [[SleepStagingV2 alloc]init];
    NSMutableArray<SleepSourceData *> *sourceDatas = [NSMutableArray new];

    [params enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
      NSDictionary *dict = (NSDictionary *)obj;
      SleepSourceData *sd = [[SleepSourceData alloc]init];
      sd.time = @([dict[@"ts"] doubleValue]/1000.0f); //时间戳
      sd.soprtTimes = dict[@"motion"];// 运动计数 /1000.0f
      sd.deviceModifyHeartRate  = dict[@"hr"]; // 心率
      sd.hrv = dict[@"hrv"]; // hrv
      sd.steps  = dict[@"steps"]; // 计步
      [sourceDatas addObject:sd];
    }];

    SleepStagingResultV2 *sleepResult = [calcObj findSleepDataByLib:sourceDatas];// 计算睡眠
    NSMutableArray * res = [self trasnResToArray:sleepResult];// trans to array

    NSLog(@"params = %@", res);
    if (callback) {
//      callback(@[params]);[NSArray arrayWithArray:res]
      callback(@[[NSNull null], res]);
    }
  });
}

-(NSMutableArray<NSMutableDictionary *> *)trasnResToArray:(SleepStagingResultV2 *)sleepResult {
  NSMutableArray<NSMutableDictionary *> * res = [NSMutableArray new];

  for (StagingDataV2 *stgData in sleepResult.stagingDataList) {
    NSMutableDictionary *stagDataDict = [NSMutableDictionary new];
    stagDataDict[@"startTime"] = @(stgData.startTime * 1000); // sleep start time
    stagDataDict[@"endTime"] = @(stgData.endTime * 1000);// sleep end time

    NSMutableArray<NSMutableDictionary *> *stagingList = [NSMutableArray new];// staging list
    [stgData.ousideStagingList enumerateObjectsUsingBlock:^(StagingSubObj * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
      NSMutableDictionary *stagesubDict = [NSMutableDictionary new];

      stagesubDict[@"stagingType"] = [self typeTostring:obj.type];//@(obj.type);// 分期类型
      stagesubDict[@"startTime"] = @(obj.list.firstObject.time.doubleValue * 1000);// 分期开始时间 秒
      stagesubDict[@"endTime"] = @(obj.list.lastObject.time.doubleValue * 1000);// 分期结束时间 秒

      [stagingList addObject:stagesubDict];
    }];

    stagDataDict[@"stagingList"] = stagingList;

    [res addObject:stagDataDict];
  }


  return res;
}

-(NSString *)typeTostring:(SleepStagingType)type {
  NSString *typeStr = @"";
  switch (type) {

    case NONE:
    {
      typeStr = @"NONE";
    }
      break;
    case WAKE:
    {
      typeStr = @"WAKE";
    }
      break;
    case NREM1:
    {
      typeStr = @"NREM1";
    }
      break;
    case NREM2:
    {
      typeStr = @"NREM2";
    }
      break;
    case NREM3:
    {
      typeStr = @"NREM3";
    }
      break;
    case REM:
    {
      typeStr = @"REM";
    }
      break;
    case NAP:
    {
      typeStr = @"NAP";

    }
      break;

    default:
      break;
  }

  return typeStr;
}

@end
