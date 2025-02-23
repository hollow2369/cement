// AQC锅炉的热量收支计算方程流程
// 部分常量定义
// 各个气体的常压下密度
// const standardAirDensity = 100;
// const standardAirSpecificHeat = 100;
// const waterVaporDensity = 0.6;
// const liquidWaterDensity = 1000;
// // 各个气体的比热
// const waterVaporSpecificHeat = 1850;
// const liquidWaterSpecificHeat = 4200;
// 温度常量
// 流程执行函数
export function fun6(
    hourlyClinkerProduction,
    hourlyAQCWater,
    liquidWaterDensity,
    liquidWaterTemperature,
    liquidWaterSpecificHeat,
    hourlyAQCAirVolume,
    standardAirSpecificHeat,
    hourlyWaterVaporMassStream,
    OutAQCAirTemperature,
    waterVaporTemperature,
    waterVaporSpecificHeat,

    AQCAirMassStreamC,
    AQCAirSensibleC
){
    let totalEnteringMassStream = cal_total_massStream_enteringNode(hourlyAQCWater, hourlyClinkerProduction, AQCAirMassStreamC)
    let totalEnteringSensible = cal_total_sensible_enteringNode(hourlyClinkerProduction, hourlyAQCWater, liquidWaterSpecificHeat, liquidWaterTemperature, AQCAirSensibleC)
    let totalLeavingMassStream = cal_total_massStream_leavingNode(hourlyWaterVaporMassStream, hourlyClinkerProduction, AQCAirMassStreamC)

    let totalLeavingSensible = cal_total_sensible_leavingNode(hourlyAQCAirVolume, standardAirSpecificHeat, OutAQCAirTemperature, hourlyWaterVaporMassStream, hourlyClinkerProduction, waterVaporSpecificHeat, waterVaporTemperature)

    // 可计算物质流损失比和热效率
    let massStreamRatio = totalLeavingMassStream / totalEnteringMassStream * 100;
    let thermalEfficiency = totalLeavingSensible / totalEnteringSensible * 100;

    return [[massStreamRatio, thermalEfficiency,] [totalEnteringMassStream, totalEnteringSensible, totalLeavingMassStream, totalLeavingSensible]];
}

function cal_total_massStream_enteringNode(hourlyAQCWater, hourlyClinkerProduction, AQCAirMassStreamC) {
    let AQCAirMassStream = cal_AQCAir_massStream_enteringNode(AQCAirMassStreamC)
    // let ashMassStream = cal_ash_massStream_enteringNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction)
    let liquidWaterMassStream = cal_liquidWater_massStream_enteringNode(hourlyAQCWater, hourlyClinkerProduction)

    let totalEnteringMassStream = AQCAirMassStream + liquidWaterMassStream
    return totalEnteringMassStream
}
// (success)1-1：来自冷却机的空气
function cal_AQCAir_massStream_enteringNode(AQCAirMassStreamC){
    return AQCAirMassStreamC;
}
// // (success)1-2：来自冷却机的飞灰
// function cal_ash_massStream_enteringNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction){
//     let ashMassStream = hourlyAQCAirVolume * ashContent / hourlyClinkerProduction
//     return ashMassStream
// }
// (success)1-3：来自冷却机的液态水
function cal_liquidWater_massStream_enteringNode(hourlyAQCWater, hourlyClinkerProduction){
    let liquidWaterMassStream = hourlyAQCWater / hourlyClinkerProduction;
    return liquidWaterMassStream;
}

// 2.进入冷却炉的能量流
function cal_total_sensible_enteringNode(hourlyClinkerProduction, hourlyAQCWater, liquidWaterSpecificHeat, liquidWaterTemperature, AQCAirSensibleC){
    let AQCAirSensible = cal_AQCAir_sensible_enteringNode(AQCAirSensibleC)
    // let ashSensible = cal_ash_sensible_enteringNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, ashSpecificHeat, AQCAirTemperature)
    let liquidWaterSensible = cal_liquidWater_sensible_enteringNode(hourlyAQCWater, hourlyClinkerProduction, liquidWaterSpecificHeat, liquidWaterTemperature)
    let totalEnteringSensible = AQCAirSensible + liquidWaterSensible
    return totalEnteringSensible
}
// (success)2-1：空气显热
function cal_AQCAir_sensible_enteringNode(AQCAirSensibleC){
    // let AQCAirSensible = hourlyAQCAirVolume * standardAirSpecificHeat * AQCAirTemperature / hourlyClinkerProduction
    return AQCAirSensibleC
}
// (success)2-2：冷却机飞灰显热
// function cal_ash_sensible_enteringNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, ashSpecificHeat, AQCAirTemperature){
//     let ashMassStream = cal_ash_massStream_enteringNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction)
//     let ashSensible = ashMassStream * ashSpecificHeat * AQCAirTemperature;
//     return ashSensible
// }
// (success)2-2：液态水显热
function cal_liquidWater_sensible_enteringNode(hourlyAQCWater, hourlyClinkerProduction, liquidWaterSpecificHeat, liquidWaterTemperature){
    let liquidWaterMassStream = cal_liquidWater_massStream_enteringNode(hourlyAQCWater, hourlyClinkerProduction)
    let liquidWaterSensible = liquidWaterMassStream * liquidWaterSpecificHeat * liquidWaterTemperature
    return liquidWaterSensible
}


// 3.离开冷却炉的物质流
function cal_total_massStream_leavingNode(hourlyWaterVaporMassStream, hourlyClinkerProduction, AQCAirMassStreamC){
    let AQCAirMassStream = cal_AQCAir_massStream_leavingNode(AQCAirMassStreamC)
    // let ashMassStream = cal_ash_massStream_leavingNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, ashFallVelocity)
    let waterVaporMassStream = cal_waterVapor_massStream_leavingNode(hourlyWaterVaporMassStream, hourlyClinkerProduction)
	// let ashFallMassStream = cal_ashFall_massStream_leavingNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, ashFallVelocity)
    let totalLeavingMassStream = AQCAirMassStream + waterVaporMassStream
    return totalLeavingMassStream;
}
// (success)3-1：离开的空气物质流
function cal_AQCAir_massStream_leavingNode(AQCAirMassStreamC){
    let AQCAirMassStream = cal_AQCAir_massStream_enteringNode(AQCAirMassStreamC)
    return AQCAirMassStream;
}
// // (success)3-2：离开的飞灰物质流
// function cal_ash_massStream_leavingNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, ashFallVelocity){
//     let tempMassStream = cal_ash_massStream_enteringNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction)
// 	let ashMassStream = (1 - ashFallVelocity) * tempMassStream
//     return ashMassStream
// }
// (success)3-2：离开的水蒸气物质流
function cal_waterVapor_massStream_leavingNode(hourlyWaterVaporMassStream, hourlyClinkerProduction){
    let waterVaporMassStream = hourlyWaterVaporMassStream / hourlyClinkerProduction;
    return waterVaporMassStream
}
// // (success)3-4: 沉降的飞灰
// function cal_ashFall_massStream_leavingNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, ashFallVelocity){
// 	let tempMassStream = cal_ash_massStream_enteringNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction)
// 	let ashFallMassStream = ashFallVelocity * tempMassStream
// 	return ashFallMassStream
// }


// 4.离开冷却炉的能量流
function cal_total_sensible_leavingNode(hourlyAQCAirVolume, standardAirSpecificHeat, OutAQCAirTemperature, hourlyWaterVaporMassStream, hourlyClinkerProduction, waterVaporSpecificHeat, waterVaporTemperature){
    let airSensible = cal_air_sensible_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, standardAirSpecificHeat, OutAQCAirTemperature)
    // let ashSensible = cal_ash_sensible_leavingNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, OutAQCAirTemperature)
    let waterVaporSensible = cal_waterVapor_sensible_leavingNode(hourlyWaterVaporMassStream, hourlyClinkerProduction, waterVaporSpecificHeat, waterVaporTemperature)
	// let ashFallSensible = cal_ashFall_sensible_leavingNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, ashFallVelocity, ashSpecificHeat, ashFallTemperature)
	
    let totalLeavingSensible = airSensible + waterVaporSensible;
    return totalLeavingSensible
}
// (success)4-1：空气显热
function cal_air_sensible_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, standardAirSpecificHeat, OutAQCAirTemperature){
    let airSensible = (hourlyAQCAirVolume / hourlyClinkerProduction) * standardAirSpecificHeat * OutAQCAirTemperature
    return airSensible
}
// // (success)4-2：飞灰显热
// function cal_ash_sensible_leavingNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, OutAQCAirTemperature){
//     let ashSensible = cal_ash_massStream_enteringNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction) * standardAirSpecificHeat * OutAQCAirTemperature
//     return ashSensible
// }
// (success)4-3：水蒸气显热
function cal_waterVapor_sensible_leavingNode(hourlyWaterVaporMassStream, hourlyClinkerProduction, waterVaporSpecificHeat, waterVaporTemperature){
    let temp = cal_waterVapor_massStream_leavingNode(hourlyWaterVaporMassStream, hourlyClinkerProduction)
    let waterVaporSensible = temp * waterVaporSpecificHeat * waterVaporTemperature
    return waterVaporSensible
}
// (success)4-4:飞灰沉降温度
// function cal_ashFall_sensible_leavingNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, ashFallVelocity, ashSpecificHeat, ashFallTemperature){
// 	let ashFallMassStream = cal_ashFall_massStream_leavingNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, ashFallVelocity)
// 	let ashFallSensible = ashFallMassStream * ashSpecificHeat * ashFallTemperature
// 	return ashFallSensible
// }