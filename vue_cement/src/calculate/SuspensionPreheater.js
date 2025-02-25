// SP_hourlyWasterGasVolume// 悬浮预热器的热量收支计算方程流程
// 部分常量定义
// 各个气体的体积分数
// let carbonMonoxideVolumeFraction;
// let carbonDioxideVolumeFraction;
// let waterVaporVolumeFraction = 0.01;
// let oxygenVolumeFraction;
// let nitrogenVolumeFraction;
// const liquidWaterVolumeFraction = 0.1;
// // 各个气体的常压下密度
// const carbonMonoxideDensity = 1.14;
// const carbonDioxideDensity = 1.98;
// const waterVaporDensity = 0.6;
// const oxygenDensity = 1.429;
// const nitrogenDensity = 0.81;
// const standardAirDensity = 1.205; // 标准情况下的空气密度
// 各个气体的比热
// const carbonMonoxideSpecificHeat = 1040;
// const carbonDioxideSpecificHeat = 840;
// const waterVaporSpecificHeat = 1850;
// const oxygenSpecificHeat = 918;
// const nitrogenSpecificHeat = 1040;
// const liquidWaterSpecificHeat = 4200;
// let standardAirSpecificHeat;
// 温度常量
// const waterVaporTemperature = 100;
// 流程执行函数
export function fun2(
    hourlyClinkerProduction,
    hourlyRawMaterial, 
	hourlyAirVolume,
    standardAirDensity,
	SP_hourlyWasterGasVolume,
	rawMaterialTemperature,
	rawMaterialWaterContent,
    airTemperature,
	wasterTemperature,
	ashSpecificHeat,
	rawMaterialSpecificHeatC2,
	rawMaterialTemperatureC2,
	heatOfVaporization,
    
    ashMassStreamPH,
    wasterGasMassStreamPH,
    wasterGasSensiblePH, 
    ashSensiblePH
){
    let totalEnteringMassStream = cal_total_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction, hourlyAirVolume, SP_hourlyWasterGasVolume, standardAirDensity, ashMassStreamPH)
    let totalEnteringSensible = cal_total_sensible_enteringNode(hourlyAirVolume, hourlyClinkerProduction, SP_hourlyWasterGasVolume, rawMaterialTemperature, wasterTemperature, rawMaterialWaterContent, ashSpecificHeat, hourlyRawMaterial, airTemperature, ashMassStreamPH)[0]
    let totalLeavingMassStream = cal_total_massStream_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, wasterGasMassStreamPH, ashMassStreamPH, rawMaterialWaterContent)
    let totalLeavingSensible = cal_total_sensible_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialSpecificHeatC2, rawMaterialTemperatureC2, rawMaterialWaterContent, heatOfVaporization, wasterGasSensiblePH, ashSensiblePH)

    // 可计算物质流损失比和热效率
    let massStreamRatio = totalLeavingMassStream / totalEnteringMassStream * 100;
    // let thermalEfficiency = totalLeavingSensible / totalEnteringSensible * 100;
    let thermalEfficiency = totalLeavingSensible[1] / totalEnteringSensible * 100;

    // temp
    let rawMaterialMassStreamSP = cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction)
    let rawMaterialSensibleSP = cal_rawMaterial_sensible_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialSpecificHeatC2, rawMaterialTemperatureC2, rawMaterialWaterContent);
    let wasterGasMassStreamSP = cal_wasterGas_massStream_enteringNode(SP_hourlyWasterGasVolume, hourlyClinkerProduction)
    let ashMassStreamSP = cal_Ash_massStream_enteringNode(ashMassStreamPH)
    let wasterGasSensibleSP = cal_wasterGas_sensible_enteringNode(SP_hourlyWasterGasVolume, hourlyClinkerProduction, wasterTemperature)
    let ashSensibleSP = cal_Ash_sensible_enteringNode(ashMassStreamPH, ashSpecificHeat, wasterTemperature)



    let systemRatio_SP = cal_total_sensible_enteringNode(hourlyAirVolume, hourlyClinkerProduction, SP_hourlyWasterGasVolume, rawMaterialTemperature, wasterTemperature, rawMaterialWaterContent, ashSpecificHeat, hourlyRawMaterial, airTemperature, ashMassStreamPH)[1]

    return [
        [totalEnteringMassStream, totalEnteringSensible, totalLeavingMassStream, totalLeavingSensible], 
        [rawMaterialMassStreamSP, rawMaterialSensibleSP, wasterGasMassStreamSP, ashMassStreamSP, wasterGasSensibleSP, ashSensibleSP], 
        [massStreamRatio, thermalEfficiency], 
        [systemRatio_SP]
    ];
    //return [totalEnteringMassStream,totalEnteringSensible,totalLeavingMassStream,totalLeavingSensible];
}

// 1.进入悬浮预热器的物质总和
function cal_total_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction, hourlyAirVolume, SP_hourlyWasterGasVolume, standardAirDensity, ashMassStreamPH){
    let rawMaterialMassStream = cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction)
    let airMassStream = cal_air_massStream_enteringNode(hourlyAirVolume, hourlyClinkerProduction, standardAirDensity)
    let wasterGasMassStream = cal_wasterGas_massStream_enteringNode(SP_hourlyWasterGasVolume, hourlyClinkerProduction)
    let ashMassStream = cal_Ash_massStream_enteringNode(ashMassStreamPH)

    let totalEnteringMassStream = rawMaterialMassStream + ashMassStream + airMassStream + wasterGasMassStream


    return totalEnteringMassStream
}
// [PASS] 2-29 (success)1-1.进入的生料量
function cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction){
    let rawMaterialMassStream = hourlyRawMaterial / hourlyClinkerProduction;


    return rawMaterialMassStream;
}
// [PASS] 2-30 (success)1-2.进入的空气（生料代入的空气）
function cal_air_massStream_enteringNode(hourlyAirVolume, hourlyClinkerProduction, standardAirDensity){
    let airMassStream = hourlyAirVolume * standardAirDensity / hourlyClinkerProduction;

    return airMassStream;
}
// [PASS] 2-31 (success)1-3.来自分解炉的废气
function cal_wasterGas_massStream_enteringNode(SP_hourlyWasterGasVolume, hourlyClinkerProduction){
    // let wasterGasDensity = (
    //     carbonMonoxideDensity * carbonMonoxideVolumeFraction +
    //     carbonDioxideDensity * carbonDioxideVolumeFraction+
    //     oxygenDensity * oxygenVolumeFraction +
    //     nitrogenDensity * nitrogenVolumeFraction) / 100;

    let WASTERGASDENSITY = 0.349
    let wasterGasMassStream = (SP_hourlyWasterGasVolume * WASTERGASDENSITY) / hourlyClinkerProduction;


    return wasterGasMassStream;
}
// [PASS] 2-33 (success)1-4.来自分解炉的飞灰
// function cal_Ash_massStream_enteringNode(ashConcentration, SP_hourlyWasterGasVolume, hourlyClinkerProduction){
//     let ashMassStream = (ashConcentration * SP_hourlyWasterGasVolume) / hourlyClinkerProduction;
//     // let ashMassStream = (ashConcentration * SP_hourlyWasterGasVolume) / hourlyClinkerProduction;
//     return ashMassStream;
// }
function cal_Ash_massStream_enteringNode(ashMassStreamPH){

    return ashMassStreamPH;
}

// [PASS] 2-41 2.进入悬浮预热器的能量总和
function cal_total_sensible_enteringNode(hourlyAirVolume, hourlyClinkerProduction, SP_hourlyWasterGasVolume, rawMaterialTemperature, wasterTemperature, rawMaterialWaterContent, ashSpecificHeat, hourlyRawMaterial, airTemperature, ashMassStreamPH){
    let rawMaterialSensible = cal_rawMaterial_sensible_enteringNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialTemperature, rawMaterialWaterContent)
    let airSensible = cal_air_sensible_enteringNode(hourlyAirVolume, hourlyClinkerProduction, airTemperature)
    let wasterGasSensible = cal_wasterGas_sensible_enteringNode(SP_hourlyWasterGasVolume, hourlyClinkerProduction, wasterTemperature)
    let ashSensible = cal_Ash_sensible_enteringNode(ashMassStreamPH, ashSpecificHeat, wasterTemperature)
    let totalEnteringSensible = rawMaterialSensible + airSensible + wasterGasSensible + ashSensible

    let systemRatio_SP = (rawMaterialSensible + airSensible)

    return [totalEnteringSensible, systemRatio_SP];
}
// [PASS] 2-36 (success)2-1.进入的生料量的显热
function cal_rawMaterial_sensible_enteringNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialTemperature, rawMaterialWaterContent){
    // rawMaterialTemperature : 生料的温度
	let rawMaterialMassStream = cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction)

    let rawMaterialMassStreamSpecificHeat = (0.88 + 2.93 * 0.0001 * rawMaterialTemperature) * (1 - rawMaterialWaterContent) + 4.1816 * rawMaterialWaterContent;
	let rawMaterialSensible = rawMaterialMassStream * rawMaterialMassStreamSpecificHeat * rawMaterialTemperature


    return rawMaterialSensible;
}
// [PASS] 2-37 (success)2-2. 进入的空气显热（生料代入的空气）
function cal_air_sensible_enteringNode(hourlyAirVolume, hourlyClinkerProduction, airTemperature){
    let STANDARDAIRSPECIFICHEAT = 1.296
    let airSensible = hourlyAirVolume / hourlyClinkerProduction * STANDARDAIRSPECIFICHEAT * airTemperature;


    return airSensible;
}
// [PASS] 2-38 (success)2-3.来自分解炉的废气显热
function cal_wasterGas_sensible_enteringNode(SP_hourlyWasterGasVolume, hourlyClinkerProduction, wasterTemperature){

    let WASTERGASSPECIFICHEAT = 1.384
    let wasterGasSensible = SP_hourlyWasterGasVolume / hourlyClinkerProduction * WASTERGASSPECIFICHEAT * wasterTemperature;


    return wasterGasSensible;
}
// [PASS] 2-40（success）2-4.来自分解炉的飞灰显热
function cal_Ash_sensible_enteringNode(ashMassStreamPH, ashSpecificHeat, wasterTemperature){
    let ashMassStream = cal_Ash_massStream_enteringNode(ashMassStreamPH)
    let ashSensible = ashMassStream * ashSpecificHeat * wasterTemperature;


    return ashSensible
}
// 3.离开悬浮预热器的物质总和
function cal_total_massStream_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, wasterGasMassStreamPH, ashMassStreamPH, rawMaterialWaterContent){
    let rawMaterialMassStream = cal_rawMaterial_massStream_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialWaterContent)
    let wasterGasMassStream = cal_wasterGas_massStream_leavingNode(wasterGasMassStreamPH)
    let ashMassStream = cal_ash_massStream_leavingNode(ashMassStreamPH)

    let totalLeavingMassStream = rawMaterialMassStream + wasterGasMassStream + ashMassStream


    return totalLeavingMassStream;
}
// [PASS] 2-43 3-1.出口的生料
function cal_rawMaterial_massStream_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialWaterContent){
    // hourlyRawMaterialC5 : 每小时从C5出口的生料
    let temp_rawMaterialMassStream = cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction)
    // let rawMaterialMassStream = hourlyRawMaterialC5 / hourlyClinkerProduction;
    let rawMaterialMassStream = temp_rawMaterialMassStream * (100 - rawMaterialWaterContent)/100;


    return rawMaterialMassStream;
}
// [WARNING] (success)3-2.出口的废气
// function cal_wasterGas_massStream_leavingNode(SP_hourlyWasterGasVolume, hourlyClinkerProduction){
//     let wasterGasMassStream = cal_wasterGas_massStream_enteringNode(SP_hourlyWasterGasVolume, hourlyClinkerProduction)
//     return wasterGasMassStream;
// }
function cal_wasterGas_massStream_leavingNode(wasterGasMassStreamPH){

    return wasterGasMassStreamPH;
}

// [WARNING] (success)3-3.出口的飞灰
// function cal_ash_massStream_leavingNode(ashConcentration, SP_hourlyWasterGasVolume, hourlyClinkerProduction){
//     let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, SP_hourlyWasterGasVolume, hourlyClinkerProduction);
//     return ashMassStream;
// }
function cal_ash_massStream_leavingNode(ashMassStreamPH){


    return ashMassStreamPH;
}

// 4.离开悬浮预热器的能量总和
function cal_total_sensible_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialSpecificHeatC2, rawMaterialTemperatureC2, rawMaterialWaterContent, heatOfVaporization, wasterGasSensiblePH, ashSensiblePH){
    let rawMaterialSensible = cal_rawMaterial_sensible_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialSpecificHeatC2, rawMaterialTemperatureC2, rawMaterialWaterContent);
    let wasterGasSensible = cal_wasterGas_sensible_leavingNode(wasterGasSensiblePH)
    let ashSensible = cal_Ash_sensible_leavingNode(ashSensiblePH)
    let waterVaporSensible = cal_waterVapor_sensible_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialWaterContent, heatOfVaporization);

    // let totalLeavingSensible = rawMaterialSensible + wasterGasSensible + ashSensible + waterVaporSensible
    let totalLeavingSensible = rawMaterialSensible + wasterGasSensible + ashSensible + waterVaporSensible
    return [totalLeavingSensible, (rawMaterialSensible+waterVaporSensible)]
}
// [PASS] 2-45 4-1. 离开的生料显热
function cal_rawMaterial_sensible_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialSpecificHeatC2, rawMaterialTemperatureC2, rawMaterialWaterContent){
    let rawMaterialMassStream = cal_rawMaterial_massStream_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialWaterContent);
    let rawMaterialSensible = rawMaterialMassStream * rawMaterialSpecificHeatC2 * rawMaterialTemperatureC2;


    return rawMaterialSensible;
}
// (success)4-2. 废气
// function cal_wasterGas_sensible_leavingNode(SP_hourlyWasterGasVolume, hourlyClinkerProduction, wasterGasTemperaturePH){
//     let wasterGasSensible;

//     let WASTERGASSPECIFICHEAT = 1.384
//     wasterGasSensible = SP_hourlyWasterGasVolume * WASTERGASSPECIFICHEAT * wasterGasTemperaturePH / hourlyClinkerProduction;
//     return wasterGasSensible;
// }
function cal_wasterGas_sensible_leavingNode(wasterGasSensiblePH){

    return wasterGasSensiblePH;
}
// (success)4-3. 飞灰
// function cal_Ash_sensible_leavingNode(ashConcentration, SP_hourlyWasterGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterGasTemperaturePH){
//     let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, SP_hourlyWasterGasVolume, hourlyClinkerProduction);
//     let ashSensible = ashMassStream * ashSpecificHeat * wasterGasTemperaturePH;
//     return ashSensible;
// }
function cal_Ash_sensible_leavingNode(ashSensiblePH){

    return ashSensiblePH;
}
// [PASS] 2-46 4-4. 水蒸气
function cal_waterVapor_sensible_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialWaterContent, heatOfVaporization){
    let rawMaterialMassStream = cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction)
    let waterVaporSensible = rawMaterialMassStream * (rawMaterialWaterContent / 100) * heatOfVaporization
    // heatOfVaporization : 水的气化热

    return waterVaporSensible;
}