<template>
  <div class="homepage">
    <div class="home_title">
      <!--   1-1: bread crumb   -->
      <el-page-header
          @back="isCollapse = !isCollapse"
          :title="isCollapse? '展开菜单' : '关闭菜单'"
          :icon="null">
<!--        <template #breadcrumb>-->
<!--          <el-breadcrumb separator="/">-->
<!--            <el-breadcrumb-item>-->
<!--                HomePage-->
<!--            </el-breadcrumb-item>-->
<!--          </el-breadcrumb>-->
<!--        </template>-->
        <template #content>
          <div class="flex items-center">
            <el-avatar
                class="mr-3"
                :size="32"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
            <span
                class="text-large font-600 mr-3"
                style="margin: 0 10px; font-size: 18px; font-weight: bolder; color: #808080"
            > 热平衡模型计算系统   </span>
            <span
                class="text-sm mr-2"
                style="color: var(--el-text-color-regular);margin-right: 20px; font-size: 14px"
            >
            {{ title }}
          </span>
            <el-tag>白日模式</el-tag>
          </div>
        </template>
        <template #extra>
          <div class="flex items-center">
			<a href="/flow_data_page/index.html" target="_blank" rel="noopener noreferrer" style="margin-right: 20px;">
				<el-button circle>
					<el-icon><PieChart /></el-icon>
				</el-button>
			</a>
			<a href="/big_data_page/index.html" target="_blank" rel="noopener noreferrer">
				<el-button circle>
					<el-icon><Histogram /></el-icon>
				</el-button>
			</a>
          </div>
        </template>
      </el-page-header>
    </div>
    <div class="home_body">
      <!--   2-1: menu options  -->
      <div class="menu_list">
        <!-- radio group and menu -->
        <el-menu
          default-active="2"
          :collapse="isCollapse"
          :collapse-transition="false"
          class="menu_list"
        >
          <el-menu-item 
			v-for="(item, index) in menuList" 
			:key="index" 
			@click="changeModel(item.title, index)"
			>
            <el-icon><component :is="item.icon" /></el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </el-menu>
        <el-button>demo</el-button>
      </div>
      <!--   2-2: analysis data - input/output   -->
      <div class="analysis_content">
        <!--    2-2-1: upload component    -->

        <div class="upload_data">

          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :limit="1"
            :file-list="uploadFiles"
            :on-change="handleSuccess"
          >
            <template #trigger>

              <el-button type="default" style="margin-right: 20px">上传文件</el-button>
              <!-- <el-option
                v-for="item in this.dataList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option> -->
            </template>
            <el-button type="primary" style="margin-right: 20px" @click="handleUpload">
              文件解析
            </el-button>
            <el-select v-model="date" placeholder="请选择日期" @change="handleChange">
              <el-option
                v-for="(item, index) in dateList"
                :key="index"
                :label="item"
                :value="index">
              </el-option>
            </el-select>
          </el-upload>

        </div>
        
        <!--    2-2-2: data wrap    -->
        <div class="data_wrap">
          <!--     2-2-2-1: input and output     -->
          <div class="data_stream">
            <!--      2-2-2-1-1: input data      -->
            <el-scrollbar class="data_input">
              <div class="output_title" >
                <el-text style="font-size: 16px;font-weight: bolder;color: #808080">
                  热量收支计算模型输入
                  <el-icon><Odometer/></el-icon>
                </el-text>
              </div>
              <el-form
                  class="input_wrap"
                  :model="inputList"
                  :rules="formRules"
                  ref="inputForm"
              >
                <el-form-item class="input_item" v-for="item in inputList" :key="item" :prop="[String(item.value)]">
                  <div v-katex style="width: 60%;margin-right: 10px; font-size: 12px">{{ item.latexItem }} : {{ item.title }}</div>
                  <el-input-number
                    v-model="item.value"
                    :precision="4"
                    :step="1"
                    class="input_component"
                    size="small"
                  />
                </el-form-item>
              </el-form>

            </el-scrollbar>
            <!--      2-2-2-1-2: output data      -->
            <el-scrollbar class="data_output">
              <!--       2-2-1-2-1: output title       -->
              <div class="output_title">
                <el-text style="font-size: 16px; font-weight: bolder; color: #808080;">
                  模型输出及结果展示
                  <el-icon><Odometer/></el-icon>
                </el-text>
                <el-button @click="starCalculate()">开始计算</el-button>
              </div>
              <!--       2-2-1-2-2: output draw       -->
              <div class="output_draw">
                <div class="chart_item">
                  <div class="chart_title">
                    
                  </div>
                  <div class="pie_chart" ref="pieChart1"></div>
                </div>
                <div class="chart_item">
                  <div class="chart_title">
                  </div>
                  <div class="pie_chart" ref="pieChart2"></div>
                </div>
                <div class="chart_item">
                  <div class="chart_title">
                  </div>
                  <div class="pie_chart" ref="pieChart3"></div>
                </div>
              </div>
              <!--       2-2-1-2-3: output context       -->
              <div class="output_context"></div>
            </el-scrollbar>
          </div>
          <!--     2-2-2-2: data introduce     -->
          <div class="data_introduce">
            <el-table
                :data="paramList"
                stripe
                style="width: 100%;height: 30%;margin-bottom: 10px;box-sizing: border-box;padding: 10px"
            >
              <el-table-column prop=latexItem label="符号" width="120" >
                <template v-slot="scope">
                  <div v-katex>{{scope.row.latexItem}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="value" label="数值" width="120" />
              <el-table-column prop="title" label="参数介绍" width="270" />
            </el-table>
            <div class="data_latex">
              <el-text style="margin-bottom: 20px;font-size: 16px;font-weight: bolder;color: #808080">相关公式</el-text>
				<el-carousel 
					height="150px"
					autoplay
					trigger="hover"
					interval=2000
				>
                <el-carousel-item class="latex_wrap" v-for="item in latexList" :key="item" >
                  <div v-katex class="latex_item">{{ item.latexItem }}</div>
                  <span class="latex_content">{{ item.latexContent }}</span>
                </el-carousel-item>
              </el-carousel>
            </div>

            <el-scrollbar class="data_markdown">
              <div v-html="renderedMarkDown" style="font-size: 14px"></div>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Odometer} from "@element-plus/icons-vue"
import * as echarts from 'echarts'
import katex from 'katex'
import MarkdownIt from 'markdown-it'
import cement_data from '@/data/cement_data.json'
import {fun1} from '@/calculate/PH_Boilder';
import {fun2} from '@/calculate/SuspensionPreheater';
import {fun3} from '@/calculate/StratifiedFurnace';
import {fun4} from '@/calculate/RotaryKiln';
import {fun5} from '@/calculate/Cooler';
import {fun6} from '@/calculate/AQC_Boilder'
import * as XLSX from 'xlsx';
export default {
  name: "HomePage",
  components: {Odometer},
  data(){
    return{
      isCollapse:true,
      title:"",
      flow: "", // 选择的流程
      // Collapse:"展开",
      uploadFiles:[],
      tempFile:"",
      menuList:[],
      // latexContent: '',
      inputList:[],
      latexList:[],
      paramList:[],
      markDownText:"",
      // cement_data:cement_data.data[0]
      formData:{},
      formRules:{}, // 动态生成表单验证规则
      dataList:[1],
      dateList:[],
      date: "",
      selectedIndex: null, // 选中的索引
      selectedDate: "", // 选中的日期
    }
  },
  methods:{
    handleChange(selectedItem) {
    // handleChange(value) {
      // 查找完整的 item 并赋值给 date
      // this.date = this.dateList.find(item => item === value) || "";
      // console.log(this.date);
      console.log(selectedItem, "ITEM");
      this.date = selectedItem
      // if (selectedItem) {
      //   this.date = selectedItem.value; // 选中的日期
      //   this.selectedIndex = selectedItem.index; // 选中的索引
      // } else {
      //   this.date = "";
      //   this.selectedIndex = -1; // 设为 -1 表示未选择
      // }
      // console.log("选中的日期:", this.date);
      // console.log("选中的索引:", this.selectedIndex);
    },
    // 分页切换
    changeModel(title, index){
      this.title = title
      this.inputList = JSON.parse(JSON.stringify(cement_data)).data[index].inputList
      this.paramList = JSON.parse(JSON.stringify(cement_data)).data[index].paramList
      this.markDownText = JSON.parse(JSON.stringify(cement_data)).data[index].markDownText
      this.latexList = JSON.parse(JSON.stringify(cement_data)).data[index].latexList
      this.flow = JSON.parse(JSON.stringify(cement_data)).data[index].name
      console.log(index, title, this.flow)
    },
    // 处理上传文件
    async handleUpload(){
        console.log(this.uploadFiles[0]);
      
        let file = this.uploadFiles[0]
        let reader = new FileReader()
    
        const readAsArrayBuffer = (file) => {
            return new Promise((resolve, reject) => {
				reader.onload = (e) => resolve(e.target.result);
				reader.onerror = reject;
				reader.readAsArrayBuffer(file.raw);
			});
        };
        try {
            // 读取文件为 ArrayBuffer
            const arrayBuffer = await readAsArrayBuffer(file);
            // 将 ArrayBuffer 转换为 xlsx 工作簿
            const workbook = XLSX.read(arrayBuffer, { type: 'array' , cellDates: true});
            // 假设您要读取第一个工作表
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
    
            // 将工作表数据转换为 JSON 对象
            // const jsonData = XLSX.utils.sheet_to_json(sheet);
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "NULL" });

            const startRow = 3;

            const dataList = jsonData.slice(startRow);
            console.log(dataList);
            
            this.dataList = dataList
            // this.dateList = this.dataList.map(item => item[0]);
            this.dateList = this.dataList.map(item => {
              
              // return new Date(item[0]+1).toLocaleDateString('zh-CN'); // 按照中国标准格式化日期
              let date = new Date(item[0]);  // 确保 item[0] 是有效的 Date 对象
              date.setDate(date.getDate() + 1);  // 日期加一天
              return date.toLocaleDateString('zh-CN'); // 格式化为中文日期
            });
            // this.dataList.forEach(item=>{
            //   console.log(item.slice(0,1));
            //   // let temp = [...item[0]]
            //   // console.log(temp);
              
            //   this.dateList.push(item.slice(0,1))
            // })
            //this.dateList.map((item, index) => {
            //  console.log(`索引 ${index}，值: ${item}`);
            //});
            
            // const dataList = jsonData.map((row) => row);
            // console.log("datalist", dataList[0]);
            
            this.inputList.forEach((item, index) => {
                  // 获取键名为 12 的值
                  item.value = dataList[index]['数值'];
            });
                  // 读取txt
                  // this.tempFile = await readAsText(file);
                  // const lines = this.tempFile.split("\n");
                  // console.log(this.tempFile)
                  // const dataList = []
                  // lines.forEach((line) => {
                  //   // 将每行数据按逗号分割成两部分
                  //   const parts = line.split(',');
                  //   // 提取第二部分的数值并转换为浮点数
                  //   dataList.push(parseFloat(parts[1]));
                  // });
                  // this.inputList.forEach((item, index)=>{
                  //   item.value = dataList[index];
                  // })
              } catch (error) {
            console.error('读取文件失败:', error);
            }
            },
    // 上传成功的处理
    handleSuccess(file, fileList){
      this.uploadFiles = fileList
    },
    createChart(param, values, plot_title="等待输出"){
      const myChart = echarts.init(param);
      let percentage = (values).toFixed(1);
      // let percentage = (values * 100).toFixed(1);
      const option = {
        // title: {
        //   text: percentage + "%" ,
        //   subtext: "SUBTEXTTTT",
        //   left: 'center',
        //   top: 61.5,
        //   textStyle:{
        //     color:'#1890fe'
        //   }
        // },
        title: [
          {
            text: plot_title ,
            left: 'center',
            top: 0,
            textStyle:{
              color:'#808080'
            }
          },
          {
            text: percentage + "%" ,
            left: 'center',
            top: 61.5,
            textStyle:{
              color:'#1890fe'
            }
          }
        ],
        visualMap: {
          show: false,
        },
        //鼠标划过时饼状图上显示的数据
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>{b}:{c} ({d}%)'
        },
        //图例
        legend: {//图例  标注各种颜色代表的模块
          // orient: 'vertical',//图例的显示方式  默认横向显示
          bottom: 10,//控制图例出现的距离  默认左上角
          left: 'center',//控制图例的位置
          // itemWidth: 16,//图例颜色块的宽度和高度
          // itemHeight: 12,
          textStyle: {//图例中文字的样式
            color: '#808080',
            fontSize: 16
          },
          data: ['未领取', '处理中', '已完成']//图例上显示的饼图各模块上的名字
        },
        //饼图中各模块的颜色
        color: ['#32dadd', '#b6a2de', '#5ab1ef'],
        // 饼图数据
        series: [
          {
            type: 'pie',
            //环形显示饼状图，实际上显示的是50-80之间的部分
            //上限不建议设置为100，echarts自带动画效果，设置为100动画效果很丑
            radius: ['50%', '80%'],
            center: ['50%', '50%'],
            data: [
              //itemSyle是单项的背景颜色设置。
              { value: 100 - percentage, itemStyle: { color: '#f1f1f1' } },
              { value: percentage, itemStyle: { color: '#1890fe' } },
            ],
            label: {
              //将视觉引导图关闭
              show: false,
            },
            itemStyle:{
              //设置的是每项之间的留白
              borderWidth:1,
              borderColor:'#fff'
            },
            // 初始化echarts的动画效果
            animationType: 'scale',
            animationEasing: 'elasticOut',
            // animationDelay: function (idx) {
            //   return Math.random() * 200;
            // }
          }
        ]
      }
      myChart.setOption(option)
    },
    // 表单校验规则
    validateNonZero(rule, value, callback) {
      // 自定义校验规则：确保输入的数字不为0且为数字类型的数据
      if (value !== 0.00 && value > 0 && !isNaN(value)) {
        console.log("pass")
        callback();
      } else {
        callback(new Error('请输入正确的数字，且不能为0'));
        console.log("fail")
      }
    },
	// 保存数据
	saveLocalStorageData(key, data){
		localStorage.setItem(key, JSON.stringify(data))
	},
	// 更新数据
	updateLocalStorageData(key, result){
		let data = JSON.parse(localStorage.getItem(key))
		console.log(result, "RESULT");	
		if(data == null){
			console.log("THIS IS FIRST DATA");
			data = {
				name:key,
				massStreamRatioList:[], 
				thermalEfficiencyList:[]
			}
		}
		// data.massStreamRatioList.push(result[0])
		// data.thermalEfficiencyList.push(result[1])
		this.saveLocalStorageData(key, data)	
	},
	// 加载数据
	getLocalStorageData(key){
		let dataList = localStorage.getItem(key)
		return dataList
	},
    starCalculate(){
      // console.log(this.formRules)
      console.log("TEST", this.date);
      
      
      const argList_PH = this.dataList[this.date].slice(1, 36)
      const result_PH = fun1(...argList_PH)
      // console.log(result_PH, "ARG_PH");
      
      const argList_SP = [...this.dataList[this.date].slice(36, 49), ...result_PH[1]]
      const result_SP = fun2(...argList_SP)
      // console.log(result_SP, "result ARG_SP");
      
      const argList_SF = [...this.dataList[this.date].slice(49, 96), ...result_SP[1]]
      const result_SF = fun3(...argList_SF)

      const argList_RK = [...this.dataList[this.date].slice(96, 121), ...result_SF[1]]
      const result_RK = fun4(...argList_RK)

      const argList_C = [...this.dataList[this.date].slice(121, 140), ...result_RK[1]]
      const result_C = fun5(...argList_C) 
      
      const argList_AQC = [...this.dataList[this.date].slice(140, 151), ...result_C[1]]
      const result_AQC = fun6(...argList_AQC) 
      // console.log(argList_AQC);
      // console.log(result_AQC);
      
      // console.log("dataList cal");
      let QZS = result_SP[3][0] + result_SF[3][0] + result_RK[3][0] + result_C[3][0]
      let Qsh = result_RK[3][1]
      let systemRatio = Qsh / QZS * 100

      // coal burn
      let coalBurnRatio = (result_SF[4][1]+result_RK[4][1]) / (result_SF[4][1]+result_RK[4][1] + result_SF[4][0]+result_RK[4][0]) * 100
      switch(this.flow){    
        case "PH_Boiler":
          this.createChart(this.$refs.pieChart1, result_PH[2][0], "PH锅炉物质比")
          this.createChart(this.$refs.pieChart2, result_PH[2][1], "PH锅炉热效率")
          this.createChart(this.$refs.pieChart3, (100 - result_PH[2][1]), "PH锅炉热损失")
          break
        case "SuspensionPreheater":
        
          this.createChart(this.$refs.pieChart1, result_SP[2][0], "预热器物质比")
          this.createChart(this.$refs.pieChart2, result_SP[2][1], "预热器热效率")
          this.createChart(this.$refs.pieChart3, (100 - result_SP[2][1]), "预热器热损失")
          break
        case "StratifiedFurnace":
          this.createChart(this.$refs.pieChart1, result_RK[0][3], "标准煤耗用量")
          this.createChart(this.$refs.pieChart2, result_SF[0][1], "分解炉热效率")
          this.createChart(this.$refs.pieChart3, coalBurnRatio, "燃料替代率")
          break
        case "RotaryKiln":

          this.createChart(this.$refs.pieChart1, systemRatio, "回转窑系统总热率")
          this.createChart(this.$refs.pieChart2, result_RK[0][1], "回转窑热效率")
          this.createChart(this.$refs.pieChart3, result_RK[0][2], "回转窑能效比")
          break
        case "Cooler":
          this.createChart(this.$refs.pieChart1, result_C[0][0], "冷却机物质比")
          this.createChart(this.$refs.pieChart2, result_C[0][1], "冷却机热效率")
          this.createChart(this.$refs.pieChart3, result_C[0][2], "冷却机回收比")
          break
        case "AQCBoilder":
          this.createChart(this.$refs.pieChart1, result_AQC[0], "AQC物质比")
          this.createChart(this.$refs.pieChart2, result_AQC[1], "AQC热效率")
          this.createChart(this.$refs.pieChart3, (100 - result_AQC[1]), "AQC热损失")
          console.log(argList_AQC, result_AQC);
          
          break
        default:
          this.createChart(this.$refs.pieChart1, result_PH[2][0], "PH锅炉物质比")
          this.createChart(this.$refs.pieChart2, result_PH[2][1], "PH锅炉热效率")
          this.createChart(this.$refs.pieChart3, (100 - result_PH[2][1]), "PH锅炉热损失")
          break
			}

      // this.$refs.inputForm.validate((valid)=>{
      //   console.log("before validate")
      //   // 通过验证
      //   if(valid){
      //     console.log("start validate")
      //     let params = []
      //     this.inputList.forEach((item)=>{
      //       params.push(item.value)
      //     })


			// let result

			// switch(this.flow){    
			// 	case "PH_Boiler":
			// 		result =  fun1(...params)
			// 		break
			// 	case "SuspensionPreheater":
			// 		result =  fun2(...params)
			// 		break
			// 	case "StratifiedFurnace":
			// 		result =  fun3(...params)
			// 		break
			// 	case "RotaryKiln":
			// 		result =  fun4(...params)
			// 		break
			// 	case "Cooler":
			// 		result =  fun5(...params)
			// 		break
			// 	case "AQCBoilder":
			// 		result =  fun6(...params)
			// 		break
			// 	default:
			// 		result = fun1(...params)
			// 		break
			// }



			// this.createChart(this.$refs.pieChart1, result[0])
			// this.createChart(this.$refs.pieChart2, result[1])
			// this.createChart(this.$refs.pieChart3, (1 - result[1]))
			// localStorage
			// this.updateLocalStorageData(this.flow, result_AQC)
        // }else{
          // this.$message.error('请填写非0的数值信息');
          // this.$refs.inputForm.clearValidate(); // 清空表单项的错误信息
          // console.log("error validate")
      //   }
      // })

    }
  },
  mounted() {
    this.createChart(this.$refs.pieChart1, 0)
    this.createChart(this.$refs.pieChart2, 0)
    this.createChart(this.$refs.pieChart3, 0)

    this.inputList = JSON.parse(JSON.stringify(cement_data)).data[0].inputList
    this.paramList = JSON.parse(JSON.stringify(cement_data)).data[0].paramList
    this.menuList = JSON.parse(JSON.stringify(cement_data)).menuList
    this.markDownText = JSON.parse(JSON.stringify(cement_data)).data[0].markDownText
    this.latexList = JSON.parse(JSON.stringify(cement_data)).data[0].latexList

    // 根据 formItems 动态生成表单验证规则
    this.inputList.forEach((item)=>{
      this.formRules[item.value] = [
        { required: true, message: `${item.title}是必须输入`, trigger: 'blur' },
        { validator: this.validateNonZero, message:`请输入非0且大于0的${item.title}`, trigger: 'blur' }
      ];
    })
    console.log(this.formRules, "RULES");
  },
  computed:{
    renderedLatex(){
      try {
        return katex.render(this.latexContent, this.$refs.LatexItem, {throwOnError: false})
      }catch (error){
        return `<p>Error rendering LaTeX: ${error.message}</p>`;
      }
    },
    renderedMarkDown(){
      const md = new MarkdownIt()
      // return md.render(this.markdownText)
      return md.render(this.markDownText)
      // return md.render(JSON.stringify(cement_data.data[0].markDownText))
    }
  }
}
</script>

<style scoped>
:root{
  --background-day: #fff;
  --background-night: #000
}
html {
  font-size: 16px; /* 设置根元素字体大小为 16px */
}

.homepage{
  width: 100%;
  height: 100vh;
  /*background-color: #42b983;*/
}
/* 1 home title */
.home_title{
  width: 100%;
  height: 8vh;
  box-sizing: border-box;
  padding: 10px;
}
.home_body{
  width: 100%;
  height: 92vh;
  display: flex;
}
.menu_list{
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  flex-shrink: 0;
}
.analysis_content{
  box-sizing: border-box;
  padding: 0 10px;
  flex-grow: 1;
  /*min-width: calc(95% - var(--el-menu-width));*/
  height: 100%;
  display: flex;
  flex-direction: column;
}
.upload_data{
  width: 100%;
  /*background-color: mediumvioletred;*/
  height: 8vh;
  box-sizing: border-box;
  margin-bottom: 10px;
  display: flex;
}
.data_wrap{
  width: 100%;
  /*background-color: deeppink;*/
  background-color: #e0e0e0;
  height: calc(100% - 60px);
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
}
.data_stream{
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 10px;
  /*margin-right: 10px;*/
  /*background-color: #42b983;*/
}
.data_input{
  width: 100%;
  height: 50%;
  background-color: #ffffff;
  box-sizing: border-box;
  margin-bottom: 10px;
  padding: 10px;
}
.input_item{
  width: 50%;
  height: 40px;
  /*background-color: #42b983;*/
  display: flex;
  box-sizing: border-box;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
}
.input_component{
  width: 35%;
}
.input_wrap{
  /*width: 100%;*/
  display: flex;
  flex-wrap: wrap;
}
.data_output{
  width: 100%;
  height: 50%;
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 10px;
}
.output_title{
  width: 100%;
  height: 60px;
  /*background-color: coral;*/
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 10px;
}
.output_draw{
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: space-between;
  /*background-color: peachpuff;*/
}
.chart_item{
  width: 30%;
  height: 100%;
  /*background-color: #42b983;*/
}
.chart_title{
  width: 100%;
  margin: 10px auto;
  text-align: center;
  font-weight: bolder;
  font-size: 14px;
  color: #808080;
}
.pie_chart{
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.output_context{
  width: 100%;
  /*height: 100px;*/
  background-color: violet;
}
.data_introduce{
  width: 40%;
  height: 100%;
  /*background-color: darkorange;*/
  box-sizing: border-box;
  padding: 10px 10px 10px 0;
}
.data_latex{
  background-color: #fff;
  box-sizing: border-box;
  padding: 10px;
  margin-bottom: 10px;
  height: 25%;
}
.latex_wrap{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.latex_item{
  font-size: 12px;
  margin-bottom: 30px;
}
.latex_content{
  font-size: 14px;
}
.data_markdown{
  /*background-color: #42b983;*/
  background-color: white;
  width: 100%;
  height: calc(45% - 20px);
  overflow: hidden;
  box-sizing: border-box;
  padding: 10px;
  margin-bottom: 10px;
}
/* inside */
.items-center{
  display: flex;
  align-items: center;
}
@media screen and (max-width: 767px){
  .homepage{
    background-color: #9C1A1C;
    width: 100%;
    height: 100%;
  }
  /* 1 home title */
  .home_title{
    background-color: #485F6E;
    height: 3rem;
  }
  .home_body{
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .menu_list{
    flex-basis: unset;
    width: 100%;
    height: 5rem;

  }
  .analysis_content{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: gold;
  }
  .upload_data{
    width: 100%;
    height: 3rem;
    background-color: chartreuse;
  }
  .data_wrap{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: khaki;
  }
  .data_stream{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: tan;
  }
  .data_input{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 10rem;
    background-color: linen;
  }
  .data_output{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: darksalmon;
  }
  .output_title{
    width: 100%;
    height: 3rem;
    background-color: yellow;
  }
  .output_draw{
    display: flex;
    flex-direction: column;
    background-color: orange;
    width: 100%;
    height: 15rem;
  }
  .output_context{
    width: 100%;
    height: 10rem;
    background-color: yellowgreen;
  }
  .data_introduce{
    width: 100%;
    height: 10rem;
  }
}
/* element plus */
/deep/ .el-page-header{
  /*background-color: #42b983;*/
  width: 100%;
}
/deep/ .el-menu{
  /*height: 70%;*/
  /*display: flex;*/
  /*flex-direction: column;*/
  /*justify-content: space-between;*/
}
/deep/ .el-menu-item{
  width: max-content;
}
</style>