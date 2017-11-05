Array.prototype.indexOf = function (e1) {
    for(var i = 0 ,n = this.length;i <n ;i++){
        if(this[i] == e1){
            return i+1;
        }
    }
    return null;
}

//
// function Resource(A,B,C) {
//     this.A = A;
//     this.B = B;
//     this.C = C;
// }

function getResouce() {
     return    getarr($("input[name='resource']").val());

}
function setDefault() {
    $("input[name='AM']").val("7,5,1");
    $("input[name='BM']").val('3,2,2');
    $("input[name='CM']").val('9,0,2');
    $("input[name='DM']").val('2,2,2');
    $("input[name='EM']").val('4,3,3');

    $("input[name='AA']").val('0,1,0');
    $("input[name='BA']").val('2,0,0');
    $("input[name='CA']").val('3,0,2');
    $("input[name='DA']").val('2,1,1');
    $("input[name='EA']").val('0,0,2');

    $("input[name='resource']").val('10,5,7');
    $("input[name='request']").val('');
    $("#process_num").val('-1');
}

function getarr(str) {
   var t = [];
   t = str.split(",");
   var s = {'A':parseInt(t[0]),'B':parseInt(t[1]),'C':parseInt(t[2])};
   return s;
}
// var max = [];
// function getOneresource () {
//
// }
function getMax() {
   var max =[];
   $(".Max input").each(function () {
       max.push(getarr($(this).val()));
       // console.log(this);
   });
   return max;
}
function getAlloction() {
    var alloction =[];
    $(".Allocation input").each(function () {
        alloction.push(getarr($(this).val()));
        // console.log(this);
    });
    return alloction;
}

function getNeed(Max,Allocation){
    var need = [];
    for (var i = 0; i <= Max.length - 1; i++) {
        need[i] = {'A':Max[i].A-Allocation[i].A,'B':Max[i].B-Allocation[i].B,'C':Max[i].C-Allocation[i].C};
    }
    return need;
}
function getAvailable(Allocation) {
    var Available;

    var sumA = 0,sumB = 0,sumC = 0;
    for(var i = 0 ;i<=Allocation.length-1;i++){
        // Allocation = [sumA:+]
        sumA += Allocation[i].A;
        sumB += Allocation[i].B;
        sumC += Allocation[i].C;
    }
    Available = {'A':Resource.A-sumA,'B':Resource.B-sumB,'C':Resource.C-sumC};
    return Available;
}

function getRequest(){
    var data = getarr($('#request').val());
    return {'process_num':parseInt($('#process_num').val()),'data':data};
}
function isSafe() {
    // var p = [PA,PB,PC,PD,PF,PE];
    var work =getAvailable(Allocation);
    var finish = [false,false,false,false,false];
    var i ;
    safe= [];

    for (i = 0;i<= 4;i++){
        if(finish[i] ==false){
            if(Need[i].A<=work.A && Need[i].B<=work.B && Need[i].C<=work.C){
                work.A += Allocation[i].A;
                work.B += Allocation[i].B;
                work.C += Allocation[i].C;

                // Work_Allocation.push({'A':Allocation.A,'B':Allocation.B,'C':Allocation.C});
                Work_Allocation.splice(i, 0, {'A':work.A,'B':work.B,'C':work.C});

                finish[i] = true;
                safe.push(i);
                i =-1;   //重新遍历序列

            }
        }

    }
    for(i = 0 ; i<=4;i++){
        if(finish[i] ==false){
            return false;
        }
    }
    return true;
}

function doAllot(process_num,request)
{
    Available.A -= request.A;
    Available.B -= request.B;
    Available.C -= request.C;

    Allocation[process_num].A += request.A;
    Allocation[process_num].B += request.B;
    Allocation[process_num].C += request.C;

    Need[process_num].A -= request.A;
    Need[process_num].B -= request.B;
    Need[process_num].C -= request.C;
}

function RollBack(process_num,request)
{
    Available.A += request.A;
    Available.B += request.B;
    Available.C += request.C;

    Allocation[process_num].A -= request.A;
    Allocation[process_num].B -= request.B;
    Allocation[process_num].C -= request.C;

    Need[process_num].A += request.A;
    Need[process_num].B += request.B;
    Need[process_num].C += request.C;
}

function tryAllot(process_num,request)
{
    //request向量需小于Need矩阵中对应的向量
    if(!(request.A <= Need[process_num].A && request.B <= Need[process_num].B && request.C <= Need[process_num].C)) {
        printText("分配失败。原因：请求资源大于需求资源。\n");
        return false;
    }

    //request向量需小于Available向量
    if(!(request.A <= Available.A && request.B <= Available.B && request.C <= Available.C)) {
        printText("分配失败。原因：请求资源大于可用资源。\n");
        return false;
    }

    //分配
    doAllot(process_num,request);

    //如果安全检查通过,则请求成功,否则回滚
    if(isSafe()) {
        printText("分配成功。\n");
        return true;
    }
    else{
        printText("安全性检查失败。原因：系统将进入不安全状态，有可能引起死锁。\n");
        printText("正在回滚...\n");
        RollBack(process_num,request);
        printText("已回滚~\n");
        return false;
    }

}
function printText(str){
    $("#print").append(str);
}

$(function () {
    setDefault();
});
var safe = [];

var Resource = [];
var Max = [];
var Allocation = [];
var Need = [];
var Available;
var request;
var P = ['PA','PB','PC','PD','PE'];
var Work_Allocation = [];

function run() {
    Work_Allocation = [];
    Max = getMax();
 Allocation = getAlloction();
 Need = getNeed(Max,Allocation);
 Resource = getResouce();
 Available = getAvailable(Allocation);
 request = getRequest();
 if (true == tryAllot(request.process_num,request.data)){
     printText('        '+ 'Max'+'        ' + 'Allocation' + '	      ' + 'Need' + '	      ' + 'Work+Allocation' + ' ' + 'Finish顺序' + '\n');
    for(var i =0 ;i<=P.length-1;i++){
        printText(P[i] + '    ' +Max[i].A +'  '+Max[i].B +'  '+Max[i].C +'    '+ Allocation[i].A +'  ' + Allocation[i].B + '  ' + Allocation[i].C + '	     ' + Need[i].A + '  ' + Need[i].B + '  ' + Need[i].C + '	        ' + Work_Allocation[i].A + '  ' + Work_Allocation[i].B + '  ' + Work_Allocation[i].C + '	         ' + safe.indexOf(i) + '\n')
     }
     console.log(safe)
     console.log(Work_Allocation)
     console.log(Allocation)
     console.log(Need)
     console.log(Available)
 }
 else{

 }
}
// console.log(Max);
// console.log(Alloction);

