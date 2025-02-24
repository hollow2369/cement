// 回转窑的热量收支计算方程流程
// 部分常量定义
//////////////////////////////////////////////////////////////////////////////////////////////
// 各个一次空气的体积分数
// const carbonMonoxideVolumeFractionFirst = 0.1;
// const carbonDioxideVolumeFractionFirst = 0.1;
// const waterVaporVolumeFractionFirst = 0.1;
// const oxygenVolumeFractionFirst = 0.2;
// const nitrogenVolumeFractionFirst = 0.2;
// 各个二次空气的体积分数
// const carbonMonoxideVolumeFractionSecond = 0.1;
// const carbonDioxideVolumeFractionSecond = 0.1;
// const waterVaporVolumeFractionSecond = 0.1;
// const oxygenVolumeFractionSecond = 0.2;
// const nitrogenVolumeFractionSecond = 0.2;
// 窑尾废气的体积分数
// const carbonMonoxideVolumeFractionWasterGas = 0.1;
// const carbonDioxideVolumeFractionWasterGas = 0.1;
// const waterVaporVolumeFractionWasterGas = 0.1;
// const oxygenVolumeFractionWasterGas = 0.2;
// const nitrogenVolumeFractionWasterGas = 0.2;
// 各个气体的常压下密度
// const carbonMonoxideDensity = 1.14;
// const carbonDioxideDensity = 1.98;
// const waterVaporDensity = 0.6;
// const oxygenDensity = 1.429;
// const nitrogenDensity = 0.81;
// const standardAirDensity = 1.293; // 标准情况下的空气密度
// const standardAirSpecificHeat = 1009; // 标准情况下空气的比热
// 各个气体的比热
// // 一次空气的比热
// const carbonMonoxideSpecificHeatFirst = 1040;
// const carbonDioxideSpecificHeatFirst = 840;
// const waterVaporSpecificHeatFirst = 1850;
// const oxygenSpecificHeatFirst = 918;
// const nitrogenSpecificHeatFirst = 1040;
// // 二次空气的比热
// const carbonMonoxideSpecificHeatSecond = 1040;
// const carbonDioxideSpecificHeatSecond = 840;
// const waterVaporSpecificHeatSecond = 1850;
// const oxygenSpecificHeatSecond = 918;
// const nitrogenSpecificHeatSecond = 1040;
// // 窑尾废气的比热
// const carbonMonoxideSpecificHeatWasterGas = 1040;
// const carbonDioxideSpecificHeatWasterGas = 840;
// const waterVaporSpecificHeatWasterGas = 1850;
// const oxygenSpecificHeatWasterGas = 918;
// const nitrogenSpecificHeatWasterGas = 1040;
// 煤粉的比热
// const coalPowderSpecificHeat = 1000;
// 生料的比热
// 飞灰的比热
// const ashSpecificHeat = 1200;
// 熟料的比热
// const clinkerSpecificHeat = 1200;
// 温度常量
// 流程执行函数
export function fun4(	
    hourlyClinkerProduction,
    hourlyCoalPowder,
    hourlyFirstAirVolume, 
    standardAirDensity,
    hourlySecondAirVolume, 
    secondAirDensity,
    hourlySendCoalAirVolume,
    standardAirDensityTemp,
    coalPowderSpecificHeat, 
    coalPowderTemperature,
    standardAirSpecificHeat,
    envTemperature,
    secondAirTemperature, 
    secondAirSpecificHeat, 
    coalHeatingValue,
    clinkerSpecificHeat, 
    clinkerTemperature,
    hourlyWasterGasVolume,
    carbonMonoxideVolumeFractionWasterGas,
    rawMaterialLoss,
    aluminumOxideContent, 
    magnesiumOxideContent, 
    calciumOxideContent, 
    siliconDioxideContent, 
    ironOxideContent,

    outRawMaterialMassStreamSF,
    rawMaterialSensibleSF,
    wasterGasMassStreamSF,
    wasterGasSensibleSF,
    coalPowderBurningSensibleSF,
    ashSensibleSF,
    thirdAirMassStreamSF
){
    let totalEnteringMassStream = cal_total_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, hourlyFirstAirVolume, standardAirDensity, hourlySecondAirVolume, secondAirDensity, hourlySendCoalAirVolume, outRawMaterialMassStreamSF)
    let totalEnteringSensible = cal_total_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalPowderSpecificHeat, coalPowderTemperature, hourlyFirstAirVolume, standardAirSpecificHeat, envTemperature, hourlySecondAirVolume, secondAirTemperature, secondAirSpecificHeat, coalHeatingValue, hourlySendCoalAirVolume, rawMaterialSensibleSF)
    let totalLeavingMassStream = cal_total_massStream_leavingNode(wasterGasMassStreamSF)
    let totalLeavingSensible = cal_total_sensible_leavingNode(clinkerSpecificHeat, clinkerTemperature, hourlyWasterGasVolume, hourlyClinkerProduction, carbonMonoxideVolumeFractionWasterGas, rawMaterialLoss, aluminumOxideContent, magnesiumOxideContent, calciumOxideContent, siliconDioxideContent, ironOxideContent, wasterGasSensibleSF)

    let clinkerFormationSensible = cal_clinkerFormation_sensible_leavingNode(aluminumOxideContent, magnesiumOxideContent, calciumOxideContent, siliconDioxideContent, ironOxideContent)
    let coalPowderBurningSensible = cal_coalPowderBurning_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalHeatingValue)

    // 可计算物质流损失比和热效率
    let massStreamRatio = totalLeavingMassStream / totalEnteringMassStream * 100;
    // let thermalEfficiency = totalLeavingSensible / totalEnteringSensible * 100;
    let thermalEfficiency = clinkerFormationSensible / (coalPowderBurningSensible + coalPowderBurningSensibleSF) * 100;

    let clinkerSensibleRK = cal_clinker_sensible_leavingNode( clinkerSpecificHeat, clinkerTemperature)
    let secondAirMassStreamRK = cal_secondAir_massStream_enteringNode(hourlySecondAirVolume, hourlyClinkerProduction, secondAirDensity)
    let thirdAirMassStreamRK = thirdAirMassStreamSF
    // let ashSensibleRK = ashSensibleSF
    let secondAirSensibleRK = cal_secondAir_sensible_enteringNode(hourlySecondAirVolume, hourlyClinkerProduction, secondAirTemperature, secondAirSpecificHeat)
    
    return [
        [massStreamRatio, thermalEfficiency], 
        [clinkerSensibleRK, secondAirMassStreamRK, thirdAirMassStreamRK, secondAirSensibleRK],
        [totalEnteringMassStream, totalEnteringSensible, totalLeavingMassStream, totalLeavingSensible]
    ];
}
// 1.进入冷却炉的物质流
function cal_total_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, hourlyFirstAirVolume, standardAirDensity, hourlySecondAirVolume, secondAirDensity, hourlySendCoalAirVolume, outRawMaterialMassStreamSF){
    let coalPowderMassStream = cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction)
    let firstAirMassStream = cal_firstAir_massStream_enteringNode(hourlyFirstAirVolume, hourlyClinkerProduction, standardAirDensity)
    let secondAirMassStream = cal_secondAir_massStream_enteringNode(hourlySecondAirVolume, hourlyClinkerProduction, secondAirDensity)
    let leakageMassStream = cal_leakage_massStream_enteringNode(outRawMaterialMassStreamSF)
	let sendCoalAirMassStream = cal_sendCoalAir_massStream_enteringNode(hourlySendCoalAirVolume, hourlyClinkerProduction, standardAirDensity)
	let organicWasterLiquidMassStream = cal_organicWasterLiquid_massStream_enteringNode()
	
    let totalEnteringNodeMassStream = coalPowderMassStream + firstAirMassStream + secondAirMassStream + leakageMassStream + sendCoalAirMassStream + organicWasterLiquidMassStream
    return totalEnteringNodeMassStream;
}
// (success)1-1: 煤粉的物质流
function cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction){
    let coalPowderMassStream = hourlyCoalPowder / hourlyClinkerProduction;
    
    return coalPowderMassStream;
}
// (success)1-2: 一次空气的物质流
function cal_firstAir_massStream_enteringNode(hourlyFirstAirVolume, hourlyClinkerProduction, standardAirDensity){

    let firstAirMassStream = hourlyFirstAirVolume * standardAirDensity / hourlyClinkerProduction;

    return firstAirMassStream;
}
// (success)1-3: 二次空气的物质流
function cal_secondAir_massStream_enteringNode(hourlySecondAirVolume, hourlyClinkerProduction, secondAirDensity){

    let secondAirMassStream = (hourlySecondAirVolume * secondAirDensity / hourlyClinkerProduction);

    return secondAirMassStream;
}
// (success)1-4: 漏风的物质流
function cal_leakage_massStream_enteringNode(outRawMaterialMassStreamSF){

    return outRawMaterialMassStreamSF;
}

// (success)1-5：送煤空气
function cal_sendCoalAir_massStream_enteringNode(hourlySendCoalAirVolume, hourlyClinkerProduction, standardAirDensity){
    let sendCoalAirMassStream = hourlySendCoalAirVolume * standardAirDensity / hourlyClinkerProduction;

    return sendCoalAirMassStream;
}
// (success)1-6：有机废液
function cal_organicWasterLiquid_massStream_enteringNode(){
	// let organicWasterLiquidMassStream = hourlyOrganicWasterLiquidVolume * OrganicWasterLiquidDensity / hourlyClinkerProduction
	let organicWasterLiquidMassStream = 0;
	return organicWasterLiquidMassStream;
}

// 2.进入冷却炉的能量流
function cal_total_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalPowderSpecificHeat, coalPowderTemperature, hourlyFirstAirVolume, standardAirSpecificHeat, envTemperature, hourlySecondAirVolume, secondAirTemperature, secondAirSpecificHeat, coalHeatingValue, hourlySendCoalAirVolume, rawMaterialSensibleSF){
    let coalPowderSensible = cal_coalPowder_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalPowderSpecificHeat, coalPowderTemperature)
    let firstAirSensible = cal_firstAir_sensible_enteringNode(hourlyFirstAirVolume, hourlyClinkerProduction, standardAirSpecificHeat, envTemperature)
    let secondAirSensible = cal_secondAir_sensible_enteringNode(hourlySecondAirVolume, hourlyClinkerProduction, secondAirTemperature, secondAirSpecificHeat)
    let coalPowderBurningSensible = cal_coalPowderBurning_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalHeatingValue)
    // let leakageSensible = cal_leakage_sensible_enteringNode(hourlyLeakageVolume, hourlyClinkerProduction, AirTemperature)
    let rawMaterialSensible = cal_rawMaterial_sensible_enteringNode(rawMaterialSensibleSF)
	let sendCoalAirSensible = cal_sendCoalAir_sensible_enteringNode(hourlySendCoalAirVolume, hourlyClinkerProduction, standardAirSpecificHeat, envTemperature)
	let organicWasterLiquidBurningSensible = cal_organicWasterLiquidBurning_Sensible_enteringNode()

    let totalEnteringNodeSensible = coalPowderBurningSensible + firstAirSensible + secondAirSensible + coalPowderSensible + rawMaterialSensible + sendCoalAirSensible + organicWasterLiquidBurningSensible
    
    return totalEnteringNodeSensible
}
// (success)2-1: 煤粉的显热
function cal_coalPowder_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalPowderSpecificHeat, coalPowderTemperature){
    let coalPowderMassStream = cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction);
    let coalPowderSensible = coalPowderMassStream * coalPowderSpecificHeat * coalPowderTemperature;


    return coalPowderSensible;
}
// (success)2-2: 一次空气的显热
function cal_firstAir_sensible_enteringNode(hourlyFirstAirVolume, hourlyClinkerProduction, standardAirSpecificHeat, envTemperature){

    let firstAirSensible = hourlyFirstAirVolume * standardAirSpecificHeat * envTemperature / hourlyClinkerProduction;

    return firstAirSensible;
}
// (success)2-3: 二次空气的显热
function cal_secondAir_sensible_enteringNode(hourlySecondAirVolume, hourlyClinkerProduction, secondAirTemperature, secondAirSpecificHeat){
    let secondAirSensible = (hourlySecondAirVolume * secondAirSpecificHeat * secondAirTemperature / hourlyClinkerProduction);

    return secondAirSensible;
}
// (success)2-4: 煤粉燃烧的显热
function cal_coalPowderBurning_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalHeatingValue){
    let coalPowderMassStream = cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction)
    let coalPowderBurningSensible = coalPowderMassStream * coalHeatingValue


    return coalPowderBurningSensible;
}

// (success)2-5: 生料的显热
function cal_rawMaterial_sensible_enteringNode(rawMaterialSensibleSF){

    return rawMaterialSensibleSF;
}
// (success)2-6: 送煤空气
function cal_sendCoalAir_sensible_enteringNode(hourlySendCoalAirVolume, hourlyClinkerProduction, standardAirSpecificHeat, envTemperature){
	let senCoalAirSensible = hourlySendCoalAirVolume * standardAirSpecificHeat * envTemperature / hourlyClinkerProduction;
    
	return senCoalAirSensible;
}
// (success)2-7: 有机废液燃烧热
function cal_organicWasterLiquidBurning_Sensible_enteringNode(){
	// let organicWasterLiquidBurningSensible = (hourlyOrganicWasterLiquidVolume * OrganicWasterLiquidDensity / hourlyClinkerProduction) * OrganicWasterLiquidHeatingValue
	let organicWasterLiquidBurningSensible = 0;
	return organicWasterLiquidBurningSensible;
}

// (success)3.离开冷却炉的物质流
function cal_total_massStream_leavingNode(wasterGasMassStreamSF){
    let wasterGasMassStream =  cal_wasterGas_massStream_leavingNode(wasterGasMassStreamSF)
    // let ashMassStream = cal_ash_massStream_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction, ashContent)
    let clinkerMassStream = cal_clinker_massStream_leavingNode()

    let totalLeavingNodeMassStream = wasterGasMassStream + clinkerMassStream;
    return totalLeavingNodeMassStream;
}
// (success)3-1: 废气的物质流
function cal_wasterGas_massStream_leavingNode(wasterGasMassStreamSF){

    return wasterGasMassStreamSF;
}
// (success)3-2: 飞灰的物质流
// function cal_ash_massStream_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction, ashContent){
//     let ashMassStream = hourlyWasterGasVolume * ashContent / hourlyClinkerProduction;
//     return ashMassStream;
// }
// (success)3-2: 水泥熟料的物质流
function cal_clinker_massStream_leavingNode(){
	// let clinkerMassStream = 1 + SecondDustContent + ThirdDustContent
	let clinkerMassStream = 1;
    return clinkerMassStream
}
// 4.离开冷却炉的能量流
function cal_total_sensible_leavingNode(clinkerSpecificHeat, clinkerTemperature, hourlyWasterGasVolume, hourlyClinkerProduction, carbonMonoxideVolumeFractionWasterGas, rawMaterialLoss, aluminumOxideContent, magnesiumOxideContent, calciumOxideContent, siliconDioxideContent, ironOxideContent, wasterGasSensibleSF){
    let wasterGasSensible = cal_wasterGas_sensible_leavingNode(wasterGasSensibleSF)
    // let ashSensible = cal_ash_sensible_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction, ashContent, ashSpecificHeat, wasterGasTemperature)
    let clinkerSensible = cal_clinker_sensible_leavingNode(clinkerSpecificHeat, clinkerTemperature)
    let coalPowderChemistryBurningSensible = cal_coalPowderChemistryBurning_sensible_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction, carbonMonoxideVolumeFractionWasterGas)
    let coalPowderMachineryBurningSensible = cal_coalPowderMachineryBurning_sensible_leavingNode(rawMaterialLoss)
    let clinkerFormationSensible = cal_clinkerFormation_sensible_leavingNode(aluminumOxideContent, magnesiumOxideContent, calciumOxideContent, siliconDioxideContent, ironOxideContent)
    let totalLeavingNodeSensible = wasterGasSensible + clinkerSensible + coalPowderChemistryBurningSensible + coalPowderMachineryBurningSensible + clinkerFormationSensible
    return totalLeavingNodeSensible
}
// (success)4-1: 窑尾废气显热
function cal_wasterGas_sensible_leavingNode(wasterGasSensibleSF){
    // let wasterGasSpecificHeat = (
    //     (carbonMonoxideVolumeFractionWasterGas * carbonMonoxideSpecificHeatWasterGas) +
    //     (carbonDioxideVolumeFractionWasterGas * carbonDioxideSpecificHeatWasterGas) +
    //     (oxygenVolumeFractionWasterGas * oxygenSpecificHeatWasterGas) +
    //     (nitrogenVolumeFractionWasterGas * nitrogenSpecificHeatWasterGas)) / 100;

    // let wasterGasSensible = hourlyWasterGasVolume * wasterGasSpecificHeat * wasterGasTemperature / hourlyClinkerProduction;

    return wasterGasSensibleSF;
}
// (success)4-2: 窑尾飞灰显热
// function cal_ash_sensible_leavingNode(ashSensibleSF){
//     // let ashMassStream = hourlyWasterGasVolume * ashContent / hourlyClinkerProduction;
//     // let ashSensible = ashMassStream * ashSpecificHeat * wasterGasTemperature;

//     return ashSensibleSF;
// }


// (success)4-2: 高温水泥熟料
function cal_clinker_sensible_leavingNode( clinkerSpecificHeat, clinkerTemperature){
	let clinkerMassStream = cal_clinker_massStream_leavingNode()
    let clinkerSensible = clinkerMassStream * clinkerSpecificHeat * clinkerTemperature;

    return clinkerSensible
}

// (success)4-3: 煤粉的化学不完全燃烧
function cal_coalPowderChemistryBurning_sensible_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction, carbonMonoxideVolumeFractionWasterGas){
    let coalPowderChemistryBurningSensible = (hourlyWasterGasVolume / hourlyClinkerProduction) * (carbonMonoxideVolumeFractionWasterGas / 100) * 12630;


    return coalPowderChemistryBurningSensible;
}
// (success)4-4: 煤粉的机械不完全燃烧
function cal_coalPowderMachineryBurning_sensible_leavingNode(rawMaterialLoss){
    let coalPowderMachineryBurningSensible = rawMaterialLoss * 33874 / 100

    return coalPowderMachineryBurningSensible
}
// (success)4-5: 熟料形成热
function cal_clinkerFormation_sensible_leavingNode(aluminumOxideContent, magnesiumOxideContent, calciumOxideContent, siliconDioxideContent, ironOxideContent){
    let tempSensible = 17.19 * aluminumOxideContent + 27.10 * magnesiumOxideContent + 32.01 * calciumOxideContent - 21.40 * siliconDioxideContent - 2.47 * ironOxideContent;
    // let clinkerFormationSensible = tempSensible - 107.90 * (sodiumOxideContent - sodiumOxideContentRaw) - 71.90 * (potassiumOxideContent - potassiumOxideContentRaw) + 83.64 * (sulfurTioxideContent - sulfurTrioxideContentRaw)
    let clinkerFormationSensible = tempSensible; 

    return clinkerFormationSensible;
}