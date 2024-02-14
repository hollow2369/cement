// 回转窑的热量收支计算方程流程
// 部分常量定义
//////////////////////////////////////////////////////////////////////////////////////////////
// 各个一次空气的体积分数
const carbonMonoxideVolumeFractionFirst = 0.1;
const carbonDioxideVolumeFractionFirst = 0.1;
const waterVaporVolumeFractionFirst = 0.1;
const oxygenVolumeFractionFirst = 0.2;
const nitrogenVolumeFractionFirst = 0.2;
// 各个二次空气的体积分数
const carbonMonoxideVolumeFractionSecond = 0.1;
const carbonDioxideVolumeFractionSecond = 0.1;
const waterVaporVolumeFractionSecond = 0.1;
const oxygenVolumeFractionSecond = 0.2;
const nitrogenVolumeFractionSecond = 0.2;
// 窑尾废气的体积分数
const carbonMonoxideVolumeFractionWasterGas = 0.1;
const carbonDioxideVolumeFractionWasterGas = 0.1;
const waterVaporVolumeFractionWasterGas = 0.1;
const oxygenVolumeFractionWasterGas = 0.2;
const nitrogenVolumeFractionWasterGas = 0.2;
// 各个气体的常压下密度
const carbonMonoxideDensity = 1.14;
const carbonDioxideDensity = 1.98;
const waterVaporDensity = 0.6;
const oxygenDensity = 1.429;
const nitrogenDensity = 0.81;
const liquidWaterDensity = 1000;
const standardAirDensity = 1.293; // 标准情况下的空气密度
const standardAirSpecificHeat = 1009; // 标准情况下空气的比热
// 各个气体的比热
const carbonMonoxideSpecificHeat = 1040;
const carbonDioxideSpecificHeat = 840;
const waterVaporSpecificHeat = 1850;
const oxygenSpecificHeat = 918;
const nitrogenSpecificHeat = 1040;
const liquidWaterSpecificHeat = 4200;
// 一次空气的比热
const carbonMonoxideSpecificHeatFirst = 1040;
const carbonDioxideSpecificHeatFirst = 840;
const waterVaporSpecificHeatFirst = 1850;
const oxygenSpecificHeatFirst = 918;
const nitrogenSpecificHeatFirst = 1040;
// 二次空气的比热
const carbonMonoxideSpecificHeatSecond = 1040;
const carbonDioxideSpecificHeatSecond = 840;
const waterVaporSpecificHeatSecond = 1850;
const oxygenSpecificHeatSecond = 918;
const nitrogenSpecificHeatSecond = 1040;
// 窑尾废气的比热
const carbonMonoxideSpecificHeatWasterGas = 1040;
const carbonDioxideSpecificHeatWasterGas = 840;
const waterVaporSpecificHeatWasterGas = 1850;
const oxygenSpecificHeatWasterGas = 918;
const nitrogenSpecificHeatWasterGas = 1040;
// 煤粉的比热
const coalPowderSpecificHeat = 1000;
// 生料的比热
const rawMaterialSpecificHeat = 100;
// 飞灰的比热
const ashSpecificHeat = 1200;
// 熟料的比热
const clinkerSpecificHeat = 1200;
// 温度常量
const waterVaporTemperature = 100;
// 流程执行函数
export function fun4(){

}
// 1.进入冷却炉的物质流
function cal_total_massStream_enteringNode(
    hourlyCoalPowder,
    hourlyClinkerProduction,
    hourlyFirstAirVolume,
    hourlySecondAirVolume,
    hourlyLeakageVolume,
    hourlyRawMaterial
){
    let coalPowderMassStream = cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction)
    let firstAirMassStream = cal_firstAir_massStream_enteringNode(hourlyFirstAirVolume, hourlyClinkerProduction)
    let secondAirMassStream = cal_secondAir_massStream_enteringNode(hourlySecondAirVolume, hourlyClinkerProduction)
    let leakageMassStream = cal_leakage_massStream_enteringNode(hourlyLeakageVolume, hourlyClinkerProduction)
    let rawMaterialMassStream = cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction)

    let totalEnteringNodeMassStream = coalPowderMassStream + firstAirMassStream + secondAirMassStream + leakageMassStream + rawMaterialMassStream
    return totalEnteringNodeMassStream;
}
// 1-1: 煤粉的物质流
function cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction){
    let coalPowderMassStream = hourlyCoalPowder / hourlyClinkerProduction;
    return coalPowderMassStream;
}
// 1-2: 一次空气的物质流
function cal_firstAir_massStream_enteringNode(hourlyFirstAirVolume, hourlyClinkerProduction){
    let firstAirDensity = (
        carbonMonoxideDensity * carbonMonoxideVolumeFractionFirst +
        carbonDioxideDensity * carbonDioxideVolumeFractionFirst+
        waterVaporDensity * waterVaporVolumeFractionFirst +
        oxygenDensity * oxygenVolumeFractionFirst +
        nitrogenDensity * nitrogenVolumeFractionFirst
    ) / 100;

    let firstAirMassStream = hourlyFirstAirVolume * firstAirDensity / hourlyClinkerProduction;
    return firstAirMassStream;
}
// 1-3: 二次空气的物质流
function cal_secondAir_massStream_enteringNode(hourlySecondAirVolume, hourlyClinkerProduction){
    let secondAirDensity = (
        carbonMonoxideDensity * carbonMonoxideVolumeFractionSecond +
        carbonDioxideDensity * carbonDioxideVolumeFractionSecond+
        waterVaporDensity * waterVaporVolumeFractionSecond +
        oxygenDensity * oxygenVolumeFractionSecond +
        nitrogenDensity * nitrogenVolumeFractionSecond
    ) / 100;

    let secondAirMassStream = hourlySecondAirVolume * secondAirDensity / hourlyClinkerProduction;
    return secondAirMassStream;
}
// 1-4: 漏风的物质流
function cal_leakage_massStream_enteringNode(hourlyLeakageVolume, hourlyClinkerProduction){
    // 使用标准空气的密度
    let leakageMassStream = hourlyLeakageVolume * standardAirDensity / hourlyClinkerProduction;
    return leakageMassStream;
}
// 1-5: 生料的物质流
function cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction){
    let rawMaterialMassStream = hourlyRawMaterial / hourlyClinkerProduction;
    return rawMaterialMassStream;
}

// 2.进入冷却炉的能量流
function cal_total_energyStream_enteringNode(){

}
// 2-1: 煤粉的显热
function cal_coalPowder_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalPowderTemperature){
    let coalPowderMassStream = cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction);
    let coalPowderSensible = coalPowderMassStream * coalPowderSpecificHeat * coalPowderTemperature;
    return coalPowderSensible;
}
// 2-2: 一次空气的显热
function cal_firstAir_sensible_enteringNode(hourlyFirstAirVolume, hourlyClinkerProduction, firstAirTemperature){
    let firstAirSpecificHeat = (
        (carbonMonoxideVolumeFractionFirst * carbonMonoxideSpecificHeatFirst) +
        (carbonDioxideVolumeFractionFirst * carbonDioxideSpecificHeatFirst) +
        (waterVaporVolumeFractionFirst * waterVaporSpecificHeatFirst) +
        (oxygenVolumeFractionFirst * oxygenSpecificHeatFirst) +
        (nitrogenVolumeFractionFirst * nitrogenSpecificHeatFirst)) / 100;

    let firstAirSensible = hourlyFirstAirVolume * firstAirSpecificHeat * firstAirTemperature / hourlyClinkerProduction;
    return firstAirSensible;
}
// 2-3: 二次空气的显热
function cal_secondAir_sensible_enteringNode(hourlySecondAirVolume, hourlyClinkerProduction, secondAirTemperature){
    let secondAirSpecificHeat = (
        (carbonMonoxideVolumeFractionSecond * carbonMonoxideSpecificHeatSecond) +
        (carbonDioxideVolumeFractionSecond * carbonDioxideSpecificHeatSecond) +
        (waterVaporVolumeFractionSecond * waterVaporSpecificHeatSecond) +
        (oxygenVolumeFractionSecond * oxygenSpecificHeatSecond) +
        (nitrogenVolumeFractionSecond * nitrogenSpecificHeatSecond)) / 100;

    let secondAirSensible = hourlySecondAirVolume * secondAirSpecificHeat * secondAirTemperature / hourlyClinkerProduction;
    return secondAirSensible;
}
// 2-4: 煤粉燃烧的显热
function cal_coalPowderBurning_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, Q){
    let coalPowderMassStream = cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction)
    let coalPowderBurningSensible = coalPowderMassStream * Q
    return coalPowderBurningSensible;
}
// 2-5: 漏风的显热
function cal_leakage_sensible_enteringNode(hourlyLeakageVolume, hourlyClinkerProduction, airTemperature){
    let leakageSensible = hourlyLeakageVolume / hourlyClinkerProduction * standardAirSpecificHeat * airTemperature;
    return leakageSensible;
}
// 2-6: 生料的显热
function cal_rawMaterial_sensible_enteringNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialTemperature){
    let rawMaterialMassStream = cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction)
    let rawMaterialSensible = rawMaterialMassStream * rawMaterialSpecificHeat * rawMaterialTemperature;
    return rawMaterialSensible;
}
// 3.离开冷却炉的物质流
function cal_total_massStream_leavingNode(){

}
// 3-1: 废气的物质流
function cal_wasterGas_massStream_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction){
    let wasterGasDensity = (
        carbonMonoxideDensity * carbonMonoxideVolumeFractionWasterGas +
        carbonDioxideDensity * carbonDioxideVolumeFractionWasterGas+
        waterVaporDensity * waterVaporVolumeFractionWasterGas +
        oxygenDensity * oxygenVolumeFractionWasterGas +
        nitrogenDensity * nitrogenVolumeFractionWasterGas
    ) / 100;

    let wasterGasMassStream = hourlyWasterGasVolume * wasterGasDensity / hourlyClinkerProduction;
    return wasterGasMassStream;
}
// 3-2: 飞灰的物质流
function cal_ash_massStream_leavingNode(hourlyAshVolume, hourlyClinkerProduction, ashDensity){
    let ashMassStream = hourlyAshVolume * ashDensity / hourlyClinkerProduction;
    return ashMassStream;
}
// 3-3: 水泥熟料的物质流
function cal_clinker_massStream_leavingNode(){
    return 1
}
// 4.离开冷却炉的能量流
function cal_total_energyStream_leavingNode(){

}
// 4-1: 窑尾废气显热
function cal_wasterGas_sensible_leavingNode(hourlyAshVolume, hourlyClinkerProduction, wasterGasTemperature){
    let wasterGasSpecificHeat = (
        (carbonMonoxideVolumeFractionWasterGas * carbonMonoxideSpecificHeatWasterGas) +
        (carbonDioxideVolumeFractionWasterGas * carbonDioxideSpecificHeatWasterGas) +
        (waterVaporVolumeFractionWasterGas * waterVaporSpecificHeatWasterGas) +
        (oxygenVolumeFractionWasterGas * oxygenSpecificHeatWasterGas) +
        (nitrogenVolumeFractionWasterGas * nitrogenSpecificHeatWasterGas)) / 100;

    let wasterGasSensible = hourlyAshVolume * wasterGasSpecificHeat * wasterGasTemperature / hourlyClinkerProduction;
    return wasterGasSensible;
}
// 4-2: 窑尾飞灰显热
function cal_ash_sensible_leavingNode(hourlyAshVolume, hourlyClinkerProduction, ashDensity, ashTemperature){
    let ashMassStream = hourlyAshVolume * ashDensity / hourlyClinkerProduction;
    let ashSensible = ashMassStream * ashSpecificHeat * ashTemperature;
    return ashSensible;
}
// 4-3: 高温水泥熟料
function cal_clinker_sensible_leavingNode(clinkerTemperature){
    let clinkerSensible = clinkerSpecificHeat * clinkerTemperature;
    return clinkerSensible
}
// !!4-4: 壁面散热!!
function cal_wallHeat_sensible_leavingNode(hourlyClinkerProduction){
    let wallHeatSensible = (2 * Math.PI * (wall1Temperature - wall4Temperature)) / (hourlyClinkerProduction * )
}
// 4-5: 煤粉的化学不完全燃烧
function cal_coalPowderChemistryBurning_sensible_leavingNode(hourlyCoalPowder, hourlyClinkerProduction){
    let coalPowderChemistryBurningSensible = hourlyCoalPowder / hourlyClinkerProduction * carbonMonoxideVolumeFractionWasterGas / 100 * 12630;
    return coalPowderChemistryBurningSensible;
}
// 4-6: 煤粉的机械不完全燃烧
function cal_coalPowderMachineryBurning_sensible_leavingNode(rawMaterialLoss){
    let coalPowderMachineryBurningSensible = rawMaterialLoss * 33874 / 100
    return coalPowderMachineryBurningSensible
}
// 4-7: 熟料形成热
function cal_clinkerFormation_sensible_leavingNode(){
    
}