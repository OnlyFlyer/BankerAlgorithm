/**
 * Created by 吴涛 on 2016/10/25.
 */
var express = require("express");
var fs = require("fs");
var url = require("url");
var app = express();

var Max = [[1,2,2],[7,4,3],[1,2,2],[1,2,2],[1,2,2]];
var Allocation = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
//运行的时候可以试一试不会成功的时候
var Need = [[1,2,2],[7,4,3],[1,2,2],[1,2,2],[1,2,2]];
var Available = [3,3,2];
//console.log(Need);
app.use(express.static("./public"));
app.get("/parse",function(req,res){
    var Process = url.parse(req.url,true).query.process;
    //var iPro = parseInt(Process);
    var Request1 = url.parse(req.url,true).query.resource1;
    var Request2 = url.parse(req.url,true).query.resource2;
    var Request3 = url.parse(req.url,true).query.resource3;
    var newRequest = [parseInt(Request1),parseInt(Request2),parseInt(Request3)];
    //console.log(newRequest);
        //主体是四个函数
        function judgeOne(i){
            //console.log(1);
            for(var j = 0; j<3; j++){
                if(Need[i][j] < newRequest[j]){
                    //字符串拼接
                    res.send("<script>" + "alert" + "('申请的资源大于所需的资源,请求失败!')" + "</script>");
                    return;
                }
            }
        }
        function judgeTwo(){
            //console.log(3);
            for(var i = 0; i<3; i++){
                if(Available[i] < newRequest[i]){
                    //字符串拼接
                    res.send("<script>" + "alert" + "('申请的资源大于系统还剩下的资源,请求失败!')" + "</script>");
                    return;
                }
            }
        }
        function assign(i){
            for(var j =0; j<3; j++){
                Available[j] = Available[j] + newRequest[j];
                //console.log(Available[j]);
                Allocation[i][j] = Allocation[i][j] + newRequest[j];
                //console.log(Allocation[i][j]);
                Need[i][j] = Need[i][j] - newRequest[j];
                //console.log(Need[i][j]);
            }
}
        function safeCheck(){
            //console.log(Available);
            var temp = [];      //存储正确的安全序列 记录p
            temp[0] = parseInt(Process);
            var j = parseInt(Process) + 1;
            var Work = [];
            var Finish = [];  //判断是否安全
            var m = 1;   //记录temp的值
            //设置work值
            for(var i=0; i<3; i++) {
                Work[i] = Available[i];   //Work:可提供给进程继续运行所需的各类资源数目
            }
            //这是一个bug
            for(var f=0; f<5; f++){
                for(j; j < 5; j++){
                    for(var k = 0; k<3; k++){
                        if(Need[j][k] <= Work[k]){
                            //console.log(Need[j][k]);
                            Work[k] = Work[k] + Allocation[j][k];
                            Finish[k] = true;
                            //console.log("work:"+Work + "need"+Need);
                        }else{
                            Finish[k] = false;
                        }
                        console.log(Finish[k]);
                    }
                    if((Finish[0] == false) || (Finish[1] == false) || (Finish[2] == false)){
                        //console.log(333);
                        console.log("此次分配失败!");
                    }else{
                        temp[m] = j;
                        console.log("此次分配成功!");
                        console.log("temp:" + temp[m]);
                        m++;
                    }
                }
                j = 0;
            }
            //输出安全序列
            console.log(temp);
        }
        function outRepeat(){
        }
        //判断newRequest 与 Need
        judgeOne(Process);
        //判断newRequest 与 Available
        judgeTwo();
        //资源分配
        assign(Process);
        //console.log(Available);
        //安全性检查
        safeCheck();
        //去重
        outRepeat();
});
app.listen(3000);
console.log("server start!");