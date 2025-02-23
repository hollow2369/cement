// PH锅炉的热量收支计算方程流程
// 部分常量定义
// 各个气体的体积分数
// const carbonMonoxideVolumeFraction = 0.1;
// const carbonDioxideVolumeFraction = 0.1;
// const waterVaporVolumeFraction = 0.1;
// const oxygenVolumeFraction = 0.2;
// const nitrogenVolumeFraction = 0.2;
// 各个气体的常压下密度
// const carbonMonoxideDensity = 1.14;
// const carbonDioxideDensity = 1.98;
// const waterVaporDensity = 0.6;
// const oxygenDensity = 1.429;
// const nitrogenDensity = 0.81;
// const liquidWaterDensity = 1000;
// 各个气体的比热
// const carbonMonoxideSpecificHeat = 1040;
// const carbonDioxideSpecificHeat = 840;
// const waterVaporSpecificHeat = 840.7;
// const oxygenSpecificHeat = 918;
// const nitrogenSpecificHeat = 1040;
// 温度常量
// const waterVaporTemperature = 100;
// 流程执行函数
export function fun1(
    PH_hourlyWasterGasVolume,
    hourlyClinkerProduction,
	carbonDioxideVolumeFraction,
	carbonMonoxideVolumeFraction, 
	oxygenVolumeFraction, 
	nitrogenVolumeFraction, 
	carbonDioxideDensity, 
	carbonMonoxideDensity,
	oxygenDensity, 
	nitrogenDensity,
    PH_hourlyWasterGasVolumeTemp,
	ashConcentration,
    hourlyLiquidWaterMassStreamPH,
    wasterGasTemperature,
	carbonDioxideSpecificHeat,
	carbonMonoxideSpecificHeat,
	oxygenSpecificHeat,
	nitrogenSpecificHeat,
    ashSpecificHeat,
	liquidWaterSpecificHeat,
    liquidWaterTemperature,
	ashFallVelocity,
    hourlyWaterVaporMassStream,
	carbonDioxideSpecificHeatPH,
	carbonMonoxideSpecificHeatPH,
	oxygenSpecificHeatPH,
	nitrogenSpecificHeatPH,
	carbonDioxideVolumeFractionPH,
	carbonMonoxideVolumeFractionPH, 
	oxygenVolumeFractionPH, 
	nitrogenVolumeFractionPH, 
	wasterGasTemperaturePH,
	waterVaporSpecificHeat,
	waterVaporTemperature,
	ashFallTemperature,
){
    console.log("PH TEST", PH_hourlyWasterGasVolume);
    
    let totalEnteringMassStream = cal_total_massStream_enteringNode(PH_hourlyWasterGasVolume, hourlyClinkerProduction, hourlyLiquidWaterMassStreamPH, ashConcentration, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity);
    let totalEnteringSensible = cal_total_energyStream_enteringNode(PH_hourlyWasterGasVolume, hourlyClinkerProduction, wasterGasTemperature, ashConcentration, ashSpecificHeat, liquidWaterTemperature, liquidWaterSpecificHeat, carbonDioxideVolumeFraction,carbonMonoxideVolumeFraction,oxygenVolumeFraction,nitrogenVolumeFraction,carbonDioxideSpecificHeat,carbonMonoxideSpecificHeat,oxygenSpecificHeat,nitrogenSpecificHeat, hourlyLiquidWaterMassStreamPH);
    let totalLeavingMassStream = cal_total_massStream_leavingNode(PH_hourlyWasterGasVolume, hourlyClinkerProduction, ashConcentration, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity, ashFallVelocity, hourlyWaterVaporMassStream);
    let totalLeavingSensible = cal_total_energyStream_leavingNode(PH_hourlyWasterGasVolume, hourlyClinkerProduction, wasterGasTemperaturePH, ashConcentration, ashSpecificHeat, waterVaporTemperature, ashFallTemperature, carbonDioxideVolumeFractionPH, carbonMonoxideVolumeFractionPH, oxygenVolumeFractionPH, nitrogenVolumeFractionPH, carbonDioxideSpecificHeatPH, carbonMonoxideSpecificHeatPH, oxygenSpecificHeatPH, nitrogenSpecificHeatPH, ashFallVelocity, waterVaporSpecificHeat, hourlyWaterVaporMassStream);
    // 可计算物质流损失比和热效率
    let massStreamRatio = totalLeavingMassStream / totalEnteringMassStream * 100;
    let thermalEfficiency = totalLeavingSensible / totalEnteringSensible * 100;

    // 下一个需要使用的：
    let ashMassStreamPH = cal_Ash_massStream_enteringNode(ashConcentration, PH_hourlyWasterGasVolume, hourlyClinkerProduction);
    let wasterGasMassStreamPH = cal_wasteGas_massStream_enteringNode(PH_hourlyWasterGasVolume, hourlyClinkerProduction, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity);
    let wasterGasSensiblePH = cal_wasterGas_sensible_leavingNode(PH_hourlyWasterGasVolume, hourlyClinkerProduction, wasterGasTemperaturePH, carbonDioxideVolumeFractionPH, carbonMonoxideVolumeFractionPH, oxygenVolumeFractionPH, nitrogenVolumeFractionPH, carbonDioxideSpecificHeatPH, carbonMonoxideSpecificHeatPH, oxygenSpecificHeatPH, nitrogenSpecificHeatPH)
    let ashSensiblePH = cal_Ash_sensible_enteringNode(ashConcentration, PH_hourlyWasterGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterGasTemperature);
    console.log("RESULT", [totalEnteringMassStream, totalEnteringSensible, totalLeavingMassStream, totalLeavingSensible], [ashMassStreamPH, wasterGasMassStreamPH, wasterGasSensiblePH, ashSensiblePH], [massStreamRatio, thermalEfficiency]);
    
    return [[totalEnteringMassStream, totalEnteringSensible, totalLeavingMassStream, totalLeavingSensible], [ashMassStreamPH, wasterGasMassStreamPH, wasterGasSensiblePH, ashSensiblePH], [massStreamRatio, thermalEfficiency]];
    // return [, totalEnteringMassStream, totalEnteringSensible, totalLeavingMassStream, totalLeavingSensible];
}

// [PASS] 2-15 (success)1.进入节点的物质流总量
function cal_total_massStream_enteringNode(PH_hourlyWasterGasVolume, hourlyClinkerProduction, hourlyLiquidWaterMassStreamPH, ashConcentration, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity){
    // 进入锅炉的[预热器废气+预热器飞灰+液态水]质量总和
    let wasterGasMassStream = cal_wasteGas_massStream_enteringNode(PH_hourlyWasterGasVolume, hourlyClinkerProduction, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity);
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, PH_hourlyWasterGasVolume, hourlyClinkerProduction);
    let liquidWaterMassStream = cal_liquidWater_massStream_enteringNode(hourlyLiquidWaterMassStreamPH, hourlyClinkerProduction)

    let totalEnteringMassStream = wasterGasMassStream + ashMassStream + liquidWaterMassStream;
    return totalEnteringMassStream;
}
// [PASS] 2-11 (success)1-1.预热器废气物质流公式
function cal_wasteGas_massStream_enteringNode(PH_hourlyWasterGasVolume, hourlyClinkerProduction, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity){
    let wasterGasStandardDensity;
    let wasterGasMassStream;

    wasterGasStandardDensity = (
        (carbonDioxideVolumeFraction * carbonMonoxideDensity) +
        (carbonMonoxideVolumeFraction * carbonDioxideDensity) +
        (oxygenVolumeFraction * oxygenDensity) +
        (nitrogenVolumeFraction * nitrogenDensity)
    ) / 100;

    wasterGasMassStream = (PH_hourlyWasterGasVolume / hourlyClinkerProduction) * wasterGasStandardDensity;

    return wasterGasMassStream;
}
// [PASS] 2-13 (success)1-2.预热器飞灰物质流公式
function cal_Ash_massStream_enteringNode(ashConcentration, PH_hourlyWasterGasVolume, hourlyClinkerProduction){
    let ashMassStream = (ashConcentration * PH_hourlyWasterGasVolume) / hourlyClinkerProduction;
    return ashMassStream;
}
// [PASS] 2-14 (success)1-3.液态水物质流公式
function cal_liquidWater_massStream_enteringNode(hourlyLiquidWaterMassStreamPH, hourlyClinkerProduction){
    let liquidWaterMassStream = hourlyLiquidWaterMassStreamPH / hourlyClinkerProduction;
    return liquidWaterMassStream;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// [PASS] 2-20 (success)2.进入节点的能量流总量
function cal_total_energyStream_enteringNode(PH_hourlyWasterGasVolume, hourlyClinkerProduction, wasterGasTemperature, ashConcentration, ashSpecificHeat, liquidWaterTemperature, liquidWaterSpecificHeat, carbonDioxideVolumeFraction,carbonMonoxideVolumeFraction,oxygenVolumeFraction,nitrogenVolumeFraction,carbonDioxideSpecificHeat,carbonMonoxideSpecificHeat,oxygenSpecificHeat,nitrogenSpecificHeat, hourlyLiquidWaterMassStreamPH){
    let wasterGasSensible = cal_wasterGas_sensible_enteringNode(PH_hourlyWasterGasVolume, hourlyClinkerProduction, wasterGasTemperature, carbonDioxideVolumeFraction,carbonMonoxideVolumeFraction,oxygenVolumeFraction,nitrogenVolumeFraction,carbonDioxideSpecificHeat,carbonMonoxideSpecificHeat,oxygenSpecificHeat,nitrogenSpecificHeat);
    let ashSensible = cal_Ash_sensible_enteringNode(ashConcentration, PH_hourlyWasterGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterGasTemperature);
    let liquidWaterSensible = cal_liquidWater_sensible_enteringNode(hourlyClinkerProduction, liquidWaterTemperature, liquidWaterSpecificHeat, hourlyLiquidWaterMassStreamPH)

    let totalEnteringSensible = wasterGasSensible + ashSensible + liquidWaterSensible;
    return totalEnteringSensible;
}
// [PASS] (success)2-1.废气的显热
function cal_wasterGas_sensible_enteringNode(
	PH_hourlyWasterGasVolume, hourlyClinkerProduction, wasterGasTemperature, 
	carbonDioxideVolumeFraction,
	carbonMonoxideVolumeFraction,
	oxygenVolumeFraction,
	nitrogenVolumeFraction,
	carbonDioxideSpecificHeat,
	carbonMonoxideSpecificHeat,
	oxygenSpecificHeat,
	nitrogenSpecificHeat
){
    let wasterGasSpecificHeat;
    let wasterGasSensible;

    // [PASS] 2-17
    wasterGasSpecificHeat = (
        (carbonMonoxideSpecificHeat * carbonMonoxideVolumeFraction) +
        (carbonDioxideSpecificHeat * carbonDioxideVolumeFraction) +
        (oxygenSpecificHeat * oxygenVolumeFraction) +
        (nitrogenSpecificHeat * nitrogenVolumeFraction)
    ) / 100;
    wasterGasSensible = (PH_hourlyWasterGasVolume * wasterGasSpecificHeat * wasterGasTemperature) / hourlyClinkerProduction;
    return wasterGasSensible;
}
// [PASS] 2-18 (success)2-2.飞灰的显热
function cal_Ash_sensible_enteringNode(ashConcentration, PH_hourlyWasterGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterGasTemperature){
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, PH_hourlyWasterGasVolume, hourlyClinkerProduction);
    let ashSensible = ashMassStream * ashSpecificHeat * wasterGasTemperature;
    return ashSensible;
}
// [PASS] 2-19 (success)2-3.液态水的显热
function cal_liquidWater_sensible_enteringNode(hourlyClinkerProduction, liquidWaterTemperature, liquidWaterSpecificHeat, hourlyLiquidWaterMassStreamPH){
    let liquidWaterMassStream = cal_liquidWater_massStream_enteringNode(hourlyLiquidWaterMassStreamPH, hourlyClinkerProduction)
    let liquidWaterSensible = liquidWaterMassStream * liquidWaterSpecificHeat * liquidWaterTemperature;
    return liquidWaterSensible;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// [CHANGE] 2-24 (success)3.离开节点的物质流总量
function cal_total_massStream_leavingNode(PH_hourlyWasterGasVolume, hourlyClinkerProduction, ashConcentration, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity, ashFallVelocity, hourlyWaterVaporMassStream){
    let wasterGasMassStream = cal_wasterGas_massStream_leavingNode(PH_hourlyWasterGasVolume, hourlyClinkerProduction, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity);
    let ashMassStream = cal_Ash_massStream_leavingNode(ashConcentration, PH_hourlyWasterGasVolume, hourlyClinkerProduction, ashFallVelocity);
    let waterVaporMassStream = cal_waterVapor_massStream_leavingNode(hourlyWaterVaporMassStream, hourlyClinkerProduction)
	let ashFallMassStream = cal_ashFall_massStream_leavingNode(ashConcentration, PH_hourlyWasterGasVolume, hourlyClinkerProduction, ashFallVelocity)
	
    let totalLeavingMassStream = wasterGasMassStream + ashMassStream + waterVaporMassStream + ashFallMassStream;
    return totalLeavingMassStream;
}
// [PASS] 2-21 (success)3-1.离开锅炉的废气物质流
function cal_wasterGas_massStream_leavingNode(PH_hourlyWasterGasVolume, hourlyClinkerProduction, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity){
    let wasterGasMassStream = cal_wasteGas_massStream_enteringNode(PH_hourlyWasterGasVolume, hourlyClinkerProduction, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity);
    return wasterGasMassStream;
}
// [CHANGE] 2-22 (success)3-2.离开锅炉的飞灰物质流
function cal_Ash_massStream_leavingNode(ashConcentration, PH_hourlyWasterGasVolume, hourlyClinkerProduction, ashFallVelocity){
    // ashFallVelocity: 飞灰的沉降率
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, PH_hourlyWasterGasVolume, hourlyClinkerProduction);
	let PHAshMassStream = ashMassStream * (1 - ashFallVelocity)
    return PHAshMassStream;
}
// [PASS] 2-23 (success)3-3.离开锅炉的水蒸气物质流
function cal_waterVapor_massStream_leavingNode(hourlyWaterVaporMassStream, hourlyClinkerProduction){
    let waterVaporMassStream = hourlyWaterVaporMassStream / hourlyClinkerProduction;
    return waterVaporMassStream;
}
// [CHANGE] 2-24(success)3-4: 沉降的飞灰
function cal_ashFall_massStream_leavingNode(ashConcentration, PH_hourlyWasterGasVolume, hourlyClinkerProduction, ashFallVelocity){
	let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, PH_hourlyWasterGasVolume, hourlyClinkerProduction)
	let ashFallMassStream = ashMassStream * ashFallVelocity
	return ashFallMassStream
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 4.离开节点的能量总和
function cal_total_energyStream_leavingNode(PH_hourlyWasterGasVolume, hourlyClinkerProduction, wasterGasTemperaturePH, ashConcentration, ashSpecificHeat, waterVaporTemperature, ashFallTemperature, carbonDioxideVolumeFractionPH, carbonMonoxideVolumeFractionPH, oxygenVolumeFractionPH, nitrogenVolumeFractionPH, carbonDioxideSpecificHeatPH, carbonMonoxideSpecificHeatPH, oxygenSpecificHeatPH, nitrogenSpecificHeatPH, ashFallVelocity, waterVaporSpecificHeat, hourlyWaterVaporMassStream){
    let wasterGasSensible = cal_wasterGas_sensible_leavingNode(PH_hourlyWasterGasVolume, hourlyClinkerProduction, wasterGasTemperaturePH, carbonDioxideVolumeFractionPH, carbonMonoxideVolumeFractionPH, oxygenVolumeFractionPH, nitrogenVolumeFractionPH, carbonDioxideSpecificHeatPH, carbonMonoxideSpecificHeatPH, oxygenSpecificHeatPH, nitrogenSpecificHeatPH)
    let ashSensible = cal_Ash_sensible_leavingNode(ashConcentration, PH_hourlyWasterGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterGasTemperaturePH);
    let waterVaporSensible = cal_waterVapor_sensible_leavingNode(hourlyWaterVaporMassStream, hourlyClinkerProduction, waterVaporTemperature, waterVaporSpecificHeat);
	let ashFallSensible = cal_ashFall_sensible_leavingNode(ashConcentration, PH_hourlyWasterGasVolume, hourlyClinkerProduction, ashFallVelocity, ashSpecificHeat, ashFallTemperature)

    let totalLeavingSensible = wasterGasSensible + ashSensible + waterVaporSensible + ashFallSensible;
    return totalLeavingSensible;
}
// [PASS] 2-25 (success)4-1.离开的废气显热
function cal_wasterGas_sensible_leavingNode(PH_hourlyWasterGasVolume, hourlyClinkerProduction, wasterGasTemperaturePH, carbonDioxideVolumeFractionPH, carbonMonoxideVolumeFractionPH, oxygenVolumeFractionPH, nitrogenVolumeFractionPH, carbonDioxideSpecificHeatPH, carbonMonoxideSpecificHeatPH, oxygenSpecificHeatPH, nitrogenSpecificHeatPH){
    let wasterGasSensible;
	let wasterGasSpecificHeat = (
		(carbonMonoxideSpecificHeatPH * carbonMonoxideVolumeFractionPH) +
		(carbonDioxideSpecificHeatPH * carbonDioxideVolumeFractionPH) +
		(oxygenSpecificHeatPH * oxygenVolumeFractionPH) +
		(nitrogenSpecificHeatPH * nitrogenVolumeFractionPH)
	) / 100;
    wasterGasSensible = PH_hourlyWasterGasVolume * wasterGasSpecificHeat * wasterGasTemperaturePH / hourlyClinkerProduction;
    return wasterGasSensible;
}
// [PASS] 2-26 (success)4-2.离开的飞灰显热
function cal_Ash_sensible_leavingNode(ashConcentration, PH_hourlyWasterGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterGasTemperaturePH){
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, PH_hourlyWasterGasVolume, hourlyClinkerProduction);
    let ashSensible = ashMassStream * ashSpecificHeat * wasterGasTemperaturePH;
    return ashSensible;
}
// [PASS] 2-27 (success)4-3.离开的水蒸气显热
function cal_waterVapor_sensible_leavingNode(hourlyWaterVaporMassStream, hourlyClinkerProduction, waterVaporTemperature, waterVaporSpecificHeat){
    let waterVaporMassStream = cal_waterVapor_massStream_leavingNode(hourlyWaterVaporMassStream, hourlyClinkerProduction);
    let waterVaporSensible = waterVaporMassStream * waterVaporSpecificHeat * waterVaporTemperature;
    return waterVaporSensible;
}
// [PASS] 2-28 (success)4-4:沉降飞灰的温度
function cal_ashFall_sensible_leavingNode(
	ashConcentration, 
	PH_hourlyWasterGasVolume, 
	hourlyClinkerProduction, 
	ashFallVelocity,
	ashSpecificHeat,
	ashFallTemperature
){
	let ashFallMassStream = cal_ashFall_massStream_leavingNode(ashConcentration, PH_hourlyWasterGasVolume, hourlyClinkerProduction, ashFallVelocity)
	let ashFallSensible = ashFallMassStream * ashFallTemperature * ashSpecificHeat
	return ashFallSensible
}