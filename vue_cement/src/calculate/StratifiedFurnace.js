// 分解炉的热量收支计算方程流程
// 部分常量定义
//////////////////////////////////////////////////////////////////////////////////////////////
// 各个一次空气的体积分数
// const carbonMonoxideVolumeFractionFirst = 0.1;
// const carbonDioxideVolumeFractionFirst = 0.1;
// const waterVaporVolumeFractionFirst = 0.1;
// const oxygenVolumeFractionFirst = 0.2;
// const nitrogenVolumeFractionFirst = 0.2;
// 各个三次空气的体积分数
// const carbonMonoxideVolumeFractionThird = 0.1;
// const carbonDioxideVolumeFractionThird = 0.1;
// const waterVaporVolumeFractionThird = 0.1;
// const oxygenVolumeFractionThird = 0.2;
// const nitrogenVolumeFractionThird = 0.2;
// 窑尾废气
// const carbonMonoxideVolumeFractionWasterGas = 0.1;
// const carbonDioxideVolumeFractionWasterGas = 0.1;
// const waterVaporVolumeFractionWasterGas = 0.1;
// const oxygenVolumeFractionWasterGas = 0.2;
// const nitrogenVolumeFractionWasterGas = 0.2;
//////////////////////////////////////////////////////////////////////////////////////////////
// 各个气体的常压下密度
// const carbonMonoxideDensity = 1.14;
// const carbonDioxideDensity = 1.98;
// const waterVaporDensity = 0.6;
// const oxygenDensity = 1.429;
// const nitrogenDensity = 0.81;
// const standardAirDensity = 1.293; // 标准情况下的空气密度
//---------------------------------------------------------------------------------------------
// const standardAirSpecificHeat = 1009;
// 各个一次空气的比热
// const carbonMonoxideSpecificHeatFirst = 1040;
// const carbonDioxideSpecificHeatFirst = 840;
// const waterVaporSpecificHeatFirst = 1850;
// const oxygenSpecificHeatFirst = 918;
// const nitrogenSpecificHeatFirst = 1040;
// 各个三次空气的比热
// const carbonMonoxideSpecificHeatThird = 1040;
// const carbonDioxideSpecificHeatThird = 840;
// const waterVaporSpecificHeatThird = 1850;
// const oxygenSpecificHeatThird = 918;
// const nitrogenSpecificHeatThird = 1040;
// 窑尾废气的比热
// const carbonMonoxideSpecificHeatWasterGas = 1040;
// const carbonDioxideSpecificHeatWasterGas = 840;
// const waterVaporSpecificHeatWasterGas = 1850;
// const oxygenSpecificHeatWasterGas = 918;
// const nitrogenSpecificHeatWasterGas = 1040;

// const coalPowderSpecificHeat = 1000;
// const ashSpecificHeat = 1200;
// const rawMaterialSpecificHeat = 100;
//---------------------------------------------------------------------------------------------
// 流程执行函数

// 1.进入节点的物质流总量
export function fun3(
    hourlyClinkerProduction,
    hourlyCoalPowder,
    hourlySendCoalAirVolume,
    standardAirDensity,
    hourlyThirdAirVolume,
    thirdAirDensity,
    hourlyLeakageVolume,
    airDensity,
    hourlySecondAirVolume,
    hourlyFirstAirVolumeRK,
    carbonDioxideVolumeFractionWasterGasRK, 
    carbonMonoxideVolumeFractionWasterGasRK, 
    oxygenVolumeFractionWasterGasRK, 
    nitrogenVolumeFractionWasterGasRK,
    carbonDioxideDensityWasterGasRK, 
    carbonMonoxideDensityWasterGasRK, 
    oxygenDensityWasterGasRK, 
    nitrogenDensityWasterGasRK,
    hourlyOthersMass,
    coalPowderSpecificHeat,
    coalPowderTemperature,
    standardAirSpecificHeat,
    sendCoalAirTemperature,
    thirdAirSpecificHeat,
    thirdAirTemperature, 
    envTemperature,
    coalHeatingValue,
    carbonDioxideVolumeFractionWasterGas,
    carbonMonoxideVolumeFractionWasterGas,
    oxygenVolumeFractionWasterGas,
    nitrogenVolumeFractionWasterGas,
    carbonDioxideSpecificHeatWasterGas,
    carbonMonoxideSpecificHeatWasterGas,
    oxygenSpecificHeatWasterGas, 
    nitrogenSpecificHeatWasterGas,
    wasterGasTemperature,
    othersSpecificHeat,
    othersTemperature,
    othersHeatingValue,
    hourlyRawMaterial,
    calciumOxideContent,
    magnesiumOxideContent,
    rawMaterialSpecificHeat,
    rawMaterialTemperature,
    ashBurnLoss,
    rawMaterialBurnLoss, 
    rawMaterialWaterContent,

    rawMaterialMassStreamSP,
    rawMaterialSensibleSP,
    wasterGasMassStreamSP, 
    ashMassStreamSP,
    wasterGasSensibleSP, 
    ashSensibleSP
){
    let totalEnteringMassStream = cal_total_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, hourlySendCoalAirVolume, hourlyThirdAirVolume, thirdAirDensity, hourlyLeakageVolume, standardAirDensity, hourlySecondAirVolume, hourlyFirstAirVolumeRK, carbonMonoxideDensityWasterGasRK, carbonDioxideDensityWasterGasRK, oxygenDensityWasterGasRK, nitrogenDensityWasterGasRK, carbonMonoxideVolumeFractionWasterGasRK, carbonDioxideVolumeFractionWasterGasRK, oxygenVolumeFractionWasterGasRK, nitrogenVolumeFractionWasterGasRK, hourlyOthersMass, rawMaterialMassStreamSP);
    let totalEnteringSensible = cal_total_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalPowderTemperature, coalPowderSpecificHeat, hourlySendCoalAirVolume,standardAirSpecificHeat, sendCoalAirTemperature, hourlyThirdAirVolume, thirdAirSpecificHeat, thirdAirTemperature, rawMaterialSensibleSP, hourlyLeakageVolume, envTemperature, coalHeatingValue, wasterGasTemperature, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas, carbonMonoxideSpecificHeatWasterGas, carbonDioxideSpecificHeatWasterGas, oxygenSpecificHeatWasterGas, nitrogenSpecificHeatWasterGas, hourlyOthersMass, othersSpecificHeat, othersTemperature, othersHeatingValue, hourlySecondAirVolume, hourlyFirstAirVolumeRK)
    let totalLeavingMassStream = cal_total_massStream_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, calciumOxideContent, magnesiumOxideContent, wasterGasMassStreamSP, ashMassStreamSP)
    let totalLeavingSensible = cal_total_energyStream_leavingNode(rawMaterialSpecificHeat, rawMaterialTemperature, rawMaterialMassStreamSP, wasterGasSensibleSP, ashSensibleSP, ashMassStreamSP, calciumOxideContent, magnesiumOxideContent, ashBurnLoss, rawMaterialBurnLoss, rawMaterialWaterContent)

    // 可计算物质流损失比和热效率
    let massStreamRatio = totalLeavingMassStream / totalEnteringMassStream * 100;
    let thermalEfficiency = totalLeavingSensible / totalEnteringSensible * 100;

    // temp

    let leakageMassStreamSF = cal_leakage_massStream_enteringNode(hourlyLeakageVolume, hourlyClinkerProduction, standardAirDensity)
    let rawMaterialSensibleSF = cal_rawMaterial_sensible_leavingNode(rawMaterialSpecificHeat, rawMaterialTemperature, rawMaterialMassStreamSP)
    let wasterGasMassStreamSF = cal_wasterGas_massStream_leavingNode(wasterGasMassStreamSP)
    let wasterGasSensibleSF = cal_wasterGas_sensible_leavingNode(wasterGasSensibleSP)
    let coalPowderBurningSensible = cal_coalPowderBurning_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalHeatingValue)
    let thirdAirMassStreamSF = cal_thirdAir_massStream_enteringNode(hourlyThirdAirVolume, hourlyClinkerProduction, thirdAirDensity)

    console.log("ARG", ashMassStreamSP);
    
    return [
        [massStreamRatio, thermalEfficiency], 
        [leakageMassStreamSF, rawMaterialSensibleSF, wasterGasMassStreamSF, wasterGasSensibleSF, coalPowderBurningSensible, ashSensibleSP, thirdAirMassStreamSF], 
        [totalEnteringMassStream, totalEnteringSensible, totalLeavingMassStream, totalLeavingSensible]
    ];
}
// (success)1
function cal_total_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, hourlySendCoalAirVolume, hourlyThirdAirVolume, thirdAirDensity, hourlyLeakageVolume, standardAirDensity, hourlySecondAirVolume, hourlyFirstAirVolumeRK, carbonMonoxideDensityWasterGasRK, carbonDioxideDensityWasterGasRK, oxygenDensityWasterGasRK, nitrogenDensityWasterGasRK, carbonMonoxideVolumeFractionWasterGasRK, carbonDioxideVolumeFractionWasterGasRK, oxygenVolumeFractionWasterGasRK, nitrogenVolumeFractionWasterGasRK, hourlyOthersMass, rawMaterialMassStreamSP){
    let coalPowderMassStream = cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction)
    let sendCoalAirMassStream = cal_sendCoalAir_massStream_enteringNode(hourlySendCoalAirVolume, hourlyClinkerProduction, standardAirDensity)
    let thirdAirMassStream = cal_thirdAir_massStream_enteringNode(hourlyThirdAirVolume, hourlyClinkerProduction, thirdAirDensity)
    let rawMaterialMassStream = cal_rawMaterial_massStream_enteringNode(rawMaterialMassStreamSP)
    let leakageMassStream = cal_leakage_massStream_enteringNode(hourlyLeakageVolume, hourlyClinkerProduction, standardAirDensity)
    let wasterGasMassStream = cal_wasterGas_massStream_enteringNode(hourlySecondAirVolume, hourlyFirstAirVolumeRK, hourlyClinkerProduction, carbonMonoxideDensityWasterGasRK, carbonDioxideDensityWasterGasRK, oxygenDensityWasterGasRK, nitrogenDensityWasterGasRK, carbonMonoxideVolumeFractionWasterGasRK, carbonDioxideVolumeFractionWasterGasRK, oxygenVolumeFractionWasterGasRK, nitrogenVolumeFractionWasterGasRK)
	let othersMassStream = cal_others_massStream_enteringNode(hourlyOthersMass, hourlyClinkerProduction)

    console.log("SF", coalPowderMassStream, sendCoalAirMassStream, thirdAirMassStream, rawMaterialMassStream, leakageMassStream, wasterGasMassStream, othersMassStream);
    
    let totalEnteringNodeMassStream = coalPowderMassStream + sendCoalAirMassStream + thirdAirMassStream + rawMaterialMassStream + leakageMassStream + wasterGasMassStream + othersMassStream;
    // let totalEnteringNodeMassStream = coalPowderMassStream + sendCoalAirMassStream + thirdAirMassStream + rawMaterialMassStream + leakageMassStream + wasterGasMassStream;
    return totalEnteringNodeMassStream;
}
// [PASS] 2-48 (success)1-1:煤粉进入的物质流
function cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction){
    let coalPowderMassStream = hourlyCoalPowder / hourlyClinkerProduction;
    return coalPowderMassStream;
}
// [PASS] 2-49 (success)1-2:一次空气的物质流 -> 送煤空气
function cal_sendCoalAir_massStream_enteringNode(hourlySendCoalAirVolume, hourlyClinkerProduction, standardAirDensity){
    let sendCoalAirMassStream = hourlySendCoalAirVolume * standardAirDensity / hourlyClinkerProduction;
    return sendCoalAirMassStream;
}
// [PASS] 2-51 (success)1-3:三次空气的物质流
function cal_thirdAir_massStream_enteringNode(hourlyThirdAirVolume, hourlyClinkerProduction, thirdAirDensity){
	// let DustMassStream = hourlyThirdAirVolume * ThirdAirDustContent / hourlyClinkerProduction
	let DUSTMASSSTREAM = 0
    let thirdAirMassStream = (hourlyThirdAirVolume * thirdAirDensity / hourlyClinkerProduction) + DUSTMASSSTREAM;
    return thirdAirMassStream;
}
// [CHANGE] (success)1-4:出口生料的物质流
function cal_rawMaterial_massStream_enteringNode(rawMaterialMassStreamSP){
    return rawMaterialMassStreamSP;
}
// [PASS] 2-53(success)1-5:漏风的物质流
function cal_leakage_massStream_enteringNode(hourlyLeakageVolume, hourlyClinkerProduction, standardAirDensity){
    // 使用标准空气的密度
    let leakageMassStream = hourlyLeakageVolume * standardAirDensity / hourlyClinkerProduction;
    return leakageMassStream;
}
// (success)1-6:窑尾的废气的物质流
function cal_wasterGas_massStream_enteringNode(hourlySecondAirVolume, hourlyFirstAirVolumeRK, hourlyClinkerProduction, carbonMonoxideDensityWasterGasRK, carbonDioxideDensityWasterGasRK, oxygenDensityWasterGasRK, nitrogenDensityWasterGasRK, carbonMonoxideVolumeFractionWasterGasRK, carbonDioxideVolumeFractionWasterGasRK, oxygenVolumeFractionWasterGasRK, nitrogenVolumeFractionWasterGasRK){
    let wasterGasDensity = (
        carbonMonoxideDensityWasterGasRK * carbonMonoxideVolumeFractionWasterGasRK +
        carbonDioxideDensityWasterGasRK * carbonDioxideVolumeFractionWasterGasRK +
        oxygenDensityWasterGasRK * oxygenVolumeFractionWasterGasRK +
        nitrogenDensityWasterGasRK * nitrogenVolumeFractionWasterGasRK) / 100;

    let wasterGasVolume = hourlySecondAirVolume + hourlyFirstAirVolumeRK

    let wasterGasMassStream = wasterGasVolume * wasterGasDensity / hourlyClinkerProduction;
    return wasterGasMassStream
}

// (success)1-8:其他燃料
function cal_others_massStream_enteringNode(hourlyOthersMass, hourlyClinkerProduction){
	let othersMassStream = hourlyOthersMass / hourlyClinkerProduction;
	return othersMassStream;
}
// 2.进入冷却炉的能量流
function cal_total_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalPowderTemperature, coalPowderSpecificHeat, hourlySendCoalAirVolume,standardAirSpecificHeat, sendCoalAirTemperature, hourlyThirdAirVolume, thirdAirSpecificHeat, thirdAirTemperature, rawMaterialSensibleSP, hourlyLeakageVolume, envTemperature, coalHeatingValue, wasterGasTemperature, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas, carbonMonoxideSpecificHeatWasterGas, carbonDioxideSpecificHeatWasterGas, oxygenSpecificHeatWasterGas, nitrogenSpecificHeatWasterGas, hourlyOthersMass, othersSpecificHeat, othersTemperature, othersHeatingValue, hourlySecondAirVolume, hourlyFirstAirVolumeRK){
    let coalPowderSensible = cal_coalPowder_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalPowderTemperature, coalPowderSpecificHeat);
    let sendCoalAirSensible = cal_sendCoalAir_sensible_enteringNode(hourlySendCoalAirVolume, hourlyClinkerProduction, standardAirSpecificHeat, sendCoalAirTemperature);
    let thirdAirSensible = cal_thirdAir_sensible_enteringNode(hourlyThirdAirVolume, hourlyClinkerProduction, thirdAirSpecificHeat, thirdAirTemperature);
    let rawMaterialSensible = cal_rawMaterial_sensible_enteringNode(rawMaterialSensibleSP);
    let leakageSensible = cal_leakage_sensible_enteringNode(hourlyLeakageVolume, hourlyClinkerProduction, standardAirSpecificHeat, envTemperature)
    let coalPowderBurningSensible = cal_coalPowderBurning_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalHeatingValue)
    let wasterGasSensible = cal_wasterGas_sensible_enteringNode(hourlyClinkerProduction, wasterGasTemperature, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas, carbonMonoxideSpecificHeatWasterGas, carbonDioxideSpecificHeatWasterGas, oxygenSpecificHeatWasterGas, nitrogenSpecificHeatWasterGas, hourlySecondAirVolume, hourlyFirstAirVolumeRK)
	
    let othersSensible = cal_others_sensible_enteringNode(hourlyOthersMass, hourlyClinkerProduction, othersSpecificHeat, othersTemperature)
    let othersBurningSensible = cal_othersBurning_sensible_enteringNode(hourlyOthersMass, hourlyClinkerProduction, othersHeatingValue)

    let totalEnteringNodeSensible = coalPowderSensible + sendCoalAirSensible + thirdAirSensible + rawMaterialSensible + leakageSensible + coalPowderBurningSensible + wasterGasSensible + othersSensible + othersBurningSensible
    return totalEnteringNodeSensible;
}
// (success)2-1
function cal_coalPowder_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalPowderTemperature, coalPowderSpecificHeat){
    let coalPowderMassStream = cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction);
    let coalPowderSensible = coalPowderMassStream * coalPowderSpecificHeat * coalPowderTemperature;
    return coalPowderSensible;
}
// (success)2-2：送煤空气
function cal_sendCoalAir_sensible_enteringNode(hourlySendCoalAirVolume, hourlyClinkerProduction, standardAirSpecificHeat, sendCoalAirTemperature){
    let sendCoalAirSensible = hourlySendCoalAirVolume * standardAirSpecificHeat * sendCoalAirTemperature / hourlyClinkerProduction;
    return sendCoalAirSensible;
}
// (success)2-3: 三次空气显热
function cal_thirdAir_sensible_enteringNode(hourlyThirdAirVolume, hourlyClinkerProduction, thirdAirSpecificHeat, thirdAirTemperature){
    let thirdAirSensible = (hourlyThirdAirVolume / hourlyClinkerProduction) * thirdAirSpecificHeat * thirdAirTemperature
    return thirdAirSensible;
}
// (success)2-4
function cal_rawMaterial_sensible_enteringNode(rawMaterialSensibleSP){
    return rawMaterialSensibleSP;
}

// (success)2-5:漏风显热
function cal_leakage_sensible_enteringNode(hourlyLeakageVolume, hourlyClinkerProduction, standardAirSpecificHeat, envTemperature){
    let leakageSensible = hourlyLeakageVolume / hourlyClinkerProduction * standardAirSpecificHeat * envTemperature;
    return leakageSensible;
}
// (success)2-6
function cal_coalPowderBurning_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalHeatingValue){
    // coalHeatingValue: 人分解炉煤粉收到基低位发热量
    let coalPowderMassStream = cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction);
    let coalPowderBurningSensible = coalPowderMassStream * coalHeatingValue;
    return coalPowderBurningSensible;
}
// （success）2-7 废气显热
function cal_wasterGas_sensible_enteringNode(hourlyClinkerProduction, wasterGasTemperature, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas, carbonMonoxideSpecificHeatWasterGas, carbonDioxideSpecificHeatWasterGas, oxygenSpecificHeatWasterGas, nitrogenSpecificHeatWasterGas, hourlySecondAirVolume, hourlyFirstAirVolumeRK){
    let wasterGasSpecificHeat = (
        (carbonMonoxideVolumeFractionWasterGas * carbonMonoxideSpecificHeatWasterGas) +
        (carbonDioxideVolumeFractionWasterGas * carbonDioxideSpecificHeatWasterGas) +
        (oxygenVolumeFractionWasterGas * oxygenSpecificHeatWasterGas) +
        (nitrogenVolumeFractionWasterGas * nitrogenSpecificHeatWasterGas)) / 100;

    let wasterGasVolume = hourlySecondAirVolume + hourlyFirstAirVolumeRK
    let wasterGasSensible = wasterGasVolume * wasterGasSpecificHeat * wasterGasTemperature / hourlyClinkerProduction;
    return wasterGasSensible;
}
// (success)2-8: 其他的
function cal_others_sensible_enteringNode(hourlyOthersMass, hourlyClinkerProduction, othersSpecificHeat, othersTemperature){
	let othersMassStream = cal_others_massStream_enteringNode(hourlyOthersMass, hourlyClinkerProduction)
	let othersSensible = othersMassStream * othersSpecificHeat * othersTemperature
	return othersSensible
}
// (success)2-9: 其他的燃烧热
function cal_othersBurning_sensible_enteringNode(hourlyOthersMass, hourlyClinkerProduction, othersHeatingValue){
	let othersMassStream = cal_others_massStream_enteringNode(hourlyOthersMass, hourlyClinkerProduction)
	let othersBurningSensible = othersMassStream * othersHeatingValue;
	return othersBurningSensible
}

// 3.离开冷却炉的物质流
function cal_total_massStream_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, calciumOxideContent, magnesiumOxideContent, wasterGasMassStreamSP, ashMassStreamSP){
    let outRawMaterialMassStream = cal_outRawMaterial_massStream_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, calciumOxideContent, magnesiumOxideContent)
    let wasterGasMassStream = cal_wasterGas_massStream_leavingNode(wasterGasMassStreamSP)
    let ashMassStream = cal_ash_massStream_leavingNode(ashMassStreamSP)

    console.log("QTEST", outRawMaterialMassStream, wasterGasMassStream, ashMassStream);
    
    let totalLeavingNodeMassStream = outRawMaterialMassStream + wasterGasMassStream + ashMassStream;
    return totalLeavingNodeMassStream;
}
// (success)3-1:煤粉
function cal_outRawMaterial_massStream_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, calciumOxideContent, magnesiumOxideContent){
    let carbonDioxideContent = ((calciumOxideContent / 100) * (44 / 56)) + ((magnesiumOxideContent / 100) * (44 / 40.3));
    let carbonDioxideMassStream = hourlyRawMaterial * carbonDioxideContent
    let outRawMaterial = hourlyRawMaterial - carbonDioxideMassStream
    let outRawMaterialMassStream = outRawMaterial / hourlyClinkerProduction;
    return outRawMaterialMassStream;
}
// (success)3-2:废气
function cal_wasterGas_massStream_leavingNode(wasterGasMassStreamSP){
    return wasterGasMassStreamSP;
}
// (success)3-3:飞灰
function cal_ash_massStream_leavingNode(ashMassStreamSP){
    return ashMassStreamSP;
}
// 4.离开冷却炉的能量流
function cal_total_energyStream_leavingNode(rawMaterialSpecificHeat, rawMaterialTemperature, rawMaterialMassStreamSP, wasterGasSensibleSP, ashSensibleSP, ashMassStreamSP, calciumOxideContent, magnesiumOxideContent, ashBurnLoss, rawMaterialBurnLoss, rawMaterialWaterContent){
    let rawMaterialSensible = cal_rawMaterial_sensible_leavingNode(rawMaterialSpecificHeat, rawMaterialTemperature, rawMaterialMassStreamSP)
    let wasterGasSensible = cal_wasterGas_sensible_leavingNode(wasterGasSensibleSP)
    let ashSensible = cal_ash_sensible_leavingNode(ashSensibleSP)
    let ashDehydrationAndDecompositionHeatSensible = cal_ashDehydrationAndDecompositionHeat_sensible_leavingNode(ashMassStreamSP, calciumOxideContent, magnesiumOxideContent, ashBurnLoss, rawMaterialBurnLoss, rawMaterialWaterContent)

    let totalLeavingSensible = rawMaterialSensible + wasterGasSensible + ashSensible + ashDehydrationAndDecompositionHeatSensible ;
    return totalLeavingSensible;
}
// (success)4-1: 生料显热
function cal_rawMaterial_sensible_leavingNode(rawMaterialSpecificHeat, rawMaterialTemperature, rawMaterialMassStreamSP){
    let rawMaterialMassStream = cal_rawMaterial_massStream_enteringNode(rawMaterialMassStreamSP)
    let rawMaterialSensible = rawMaterialMassStream * rawMaterialSpecificHeat * rawMaterialTemperature;
    return rawMaterialSensible;
}
// 4-2: 废气显热
function cal_wasterGas_sensible_leavingNode(wasterGasSensibleSP){
    return wasterGasSensibleSP;
}
// 4-3 飞灰显热
function cal_ash_sensible_leavingNode(ashSensibleSP){
    return ashSensibleSP;
}

// // 4-5 煤粉的燃烧
// function cal_coalPowderBurning_sensible_leavingNode(hourlyCoalPowder, hourlyClinkerProduction, carbonMonoxideVolumeFractionWasterGas){
//     let coalPowderBurningSensible = (hourlyCoalPowder / hourlyClinkerProduction) * (carbonMonoxideVolumeFractionWasterGas / 100) * 12630;
//     return coalPowderBurningSensible;
// }


// 4-4 飞灰脱水和碳酸盐分解热

function cal_ashDehydrationAndDecompositionHeat_sensible_leavingNode(ashMassStreamSP, calciumOxideContent, magnesiumOxideContent, ashBurnLoss, rawMaterialBurnLoss, rawMaterialWaterContent){
    let carbonDioxideContent = ((calciumOxideContent / 100) * (44 / 56)) + ((magnesiumOxideContent / 100) * (44 / 40.3));
    let ashMassStream = cal_ash_massStream_leavingNode(ashMassStreamSP)
    let ashDehydrationAndDecompositionHeatSensible = ashMassStream * ((100 - ashBurnLoss)/(100 - rawMaterialBurnLoss)) * (rawMaterialWaterContent / 100) * 6690 + ((ashMassStream * ((100 - ashBurnLoss)/(100 - rawMaterialBurnLoss)) * (carbonDioxideContent / 100) - ashMassStream * (ashBurnLoss / 100)) * (100/44) * 1660);
    return ashDehydrationAndDecompositionHeatSensible;
}