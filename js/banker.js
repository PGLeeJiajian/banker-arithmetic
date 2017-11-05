 var Max = new Vue({
     el:".Max",
     data:{
         max:[  {name:"PA",arr:[7,5,3]},
                {name:"PB",arr:[3,2,2]},
                {name:"PC",arr:[9,0,2]},
                {name:"PD",arr:[2,2,2]},
                {name:"PE",arr:[4,3,3]}]
     }
 });
 var Allocation = new Vue({
     el:".Allocation",
     data:{
         allocation:[   {name:"PA",arr:[0,1,0]},
                        {name:"PB",arr:[2,0,0]},
                        {name:"PC",arr:[3,0,2]},
                        {name:"PD",arr:[2,1,1]},
                        {name:"PE",arr:[0,0,2]}]

     }
 });
 var Request =new Vue({
     el:'#request',
     data:{
         arr:[],
         msg:''
     },
     methods:{
         add(){
             var Array =  this.msg.split(",");
             for(var i = 0;i <=Array.length-1;i++){
                 Array[i]=parseInt(Array[i]);
             }
             this.arr =Array;
         }
     }
 });
 var Resource = new Vue({
     el:"#resource",
     data:{
        arr:[10,5,7]
     }
 });
// var Process_num = new Vue({
//     el:'#process_num',
//     data:{
//         arr:[{name:'请选择',value:-1},
//             {name:'PA',value:0},
//             {name:'PB',value:1},
//             {name:'PC',value:2},
//             {name:'PD',value:3},
//             {name:'PE',value:4}],
//         process_num:''
//         // nowIndex:this.arr.index
//     },
//     methods:{
//         selected(){
//            // var s =this.arr.value.toString();
//            //  this.process_num.concat(s);
//            //  this.process_num = parseInt(this.process_num);
//            //  console.log(this.value);
//             console.log(123);
//         }
//     }
// })
 Array.prototype.indexOf = function (e1) {
     for(var i = 0 ,n = this.length;i <n ;i++){
         if(this[i] == e1){
             return i+1;
         }
     }
     return null;
 }

 function printText(str){
     $("#print").append(str);
 }
 function copy(arr1,arr2) {                     //实现深拷贝
     for (var i =  0; i <=arr2.length-1; i++) {
         if(typeof arr2[i] == "Object")
             for (val in arr2[i]){
                 arr1[i] = arr2[i].val;
             }   else{
             arr1[i] = arr2[i]
         }
     }
 }

 function getNeed(Max,Allocation){

     var need1 =new Array();
     for (var i = 0; i <= Max.length - 1; i++) {
          need1[i] =new Array();
         for(var j = 0;j <=2;j++) {
             need1[i][j] = Max[i].arr[j] - Allocation[i].arr[j];
             // console.log(need1[i][j]);
         }
     }
     // console.log(Max);

     return need1;
 }
 // console.log(Max.max);


function getAvailable() {
    var Available = [];
    var sumA = 0,sumB = 0,sumC = 0;
    for(var  i = 0 ; i<=4;i++){
        sumA += Allocation.allocation[i].arr[0];
        sumB += Allocation.allocation[i].arr[1];
        sumC += Allocation.allocation[i].arr[2];
        
    }
    Available=[Resource.arr[0]-sumA,Resource.arr[1]-sumB,Resource.arr[2]-sumC];
    return Available;
}
function isSafe1() {
    var work = [];
    copy(work,Available); //把Avilable深拷贝到work数组里
    var finish = [false,false,false,false,false];

    var i ;
     safe = [];
// console.log(work);
    for ( i = 0 ; i<= 4 ; i++) {
        if(finish[i] ==false) {
            if (need[i][0] <= work[0] && need[i][1] <= work[1] && need[i][2] <= work[2]) {
                work[0] += Allocation.allocation[i].arr[0];
                work[1] += Allocation.allocation[i].arr[1];
                work[2] += Allocation.allocation[i].arr[2];

                Work_Allocation.splice(i,0,[work[0],work[1],work[2]]);
                //Work_Allocation[i] = work; //结果全部都是最后的数组10，5，7 why？
                finish[i] = true;
                safe.push(i);
                i = -1;     //重头开始
            }
        }
    }
    // console.log(safe);
    // console.log(finish);
    // console.log(work);
    for ( i = 0 ; i<= 4 ; i++) {
        if (finish[i] == false) {
            return false;
        }
    }
    return true ;

}

// function isSafe2(argument) {     //用第二种方法列安全序列
//      var work = [];             
//     copy(work,Resource); //把Resource深拷贝到work数组里
//     var safe = [];
//     var finish = [false,false,false,false,false];
//     for (var i = 0 ; i< = Max.max.length -1 ; i++) {
//      if (need[i][0]<=Resource.arr[0]&&need[i][1]<=Resource.arr[1]&&need[i][2]<=Resource.arr[2]) {
//             work[0] += Allocation.allocation[i].arr[0];
//             work[1] += Allocation.allocation[i].arr[0];
//             work[2] += Allocation.allocation[i].arr[0];

//             Work_Allocation[i] = work;
//             finish[i] = true;
//             safe.push(i);
//             i = -1;     //重头开始
//      }
//      return true ; 
//     }
//     for (var i = 0 ; i< = Max.max.length -1 ; i++) {
//         if (finish[i] == false) {
//             return false;
//         }
//     }
// }
 function getProcess_num(){

     var num = parseInt($('#process_num').val());
     return num;
 }

function doAlloc(process_num,Request) {
    Available[0] -= Request[0];
    Available[1] -= Request[1];
    Available[2] -= Request[2];

    Allocation.allocation[process_num].arr[0] +=Request[0];
    Allocation.allocation[process_num].arr[1] +=Request[1];
    Allocation.allocation[process_num].arr[2] +=Request[2];

    need[process_num][0] -=Request[0];
    need[process_num][1] -=Request[1];
    need[process_num][2] -=Request[2];
}
function callback(process_num,Request) {
    Available[0] += Request[0];
    Available[1] += Request[1];
    Available[2] += Request[2];

    Allocation.allocation[process_num].arr[0] -=Request[0];
    Allocation.allocation[process_num].arr[1] -=Request[1];
    Allocation.allocation[process_num].arr[2] -=Request[2];

    need[process_num][0] +=Request[0];
    need[process_num][1] +=Request[1];
    need[process_num][2] +=Request[2];
}

function tryAlloc(process_num,Request) {
    if(!(Request[0]<=need[process_num][0]&&Request[1]<=need[process_num][1]&&Request[2]<=need[process_num][2])){
        printText("分配失败。原因：请求资源大于需求资源。\n");
        return false;
    }
    if(!(Request[0]<=Available[0]&&Request[1]<=Available[1]&&Request[2]<=Available[2])){
        printText("分配失败。原因：请求资源大于可用资源。\n");
        return false;
    }

    doAlloc(process_num,Request);
    if(isSafe1()){                      //检查是否存在安全序列，否则回滚
        printText("分配成功");
        return true;
    }else {
        printText("安全性检查失败。原因：系统将进入不安全状态，有可能引起死锁。\n");

        printText("正在回滚...\n");
        callback(process_num,Request);
        return false;

    }
}
var process_num ;
 var need = new Array();
 var Available;
 var safe;
 var Work_Allocation = [];
 var P =[];
function run() {
    Work_Allocation = [];
     P = ['PA','PB','PC','PD','PE'];
    need = getNeed(Max.max,Allocation.allocation);
    Available = getAvailable();

    process_num =getProcess_num();
    // console.log(isSafe1());
    if(true == tryAlloc(process_num,Request.arr)){
        printText('        '+ 'Max'+'        ' + 'Allocation' + '	      ' + 'Need' + '	      ' + 'Work+Allocation' + ' ' + 'Finish顺序' + '\n');
        for(var i=0;i<=5;i++){
            printText(P[i] + '                ' +Max.max[i].arr[0] +'  '+Max.max[i].arr[1] +'  '+Max.max[i].arr[2] +'          '+ Allocation.allocation[i].arr[0] +'  ' + Allocation.allocation[i].arr[1] + '  ' + Allocation.allocation[i].arr[2] + '	     ' + need[i][0] + '  ' + need[i][1] + '  ' + need[i][2] + '	        ' + Work_Allocation[i][0] + '  ' + Work_Allocation[i][1] + '  ' + Work_Allocation[i][2] + '	         ' + safe.indexOf(i) + '\n');
        }
// console.log(Work_Allocation);
    
    }else{
    
    }
}