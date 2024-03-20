// ==UserScript==
// @name         安徽干部教育在线刷课脚本4.0
// @namespace    http://tampermonkey.net/
// @version      2024-02-23
// @description  自动浏览和选择课程章节，自动播放视频，通过页面显示的课程时间，来延迟执行完成函数，目前视频没问题，PPT有两种模式，还需要调整
// @author       You
// @match        https://www.ahgbjy.gov.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at        document-start
// ==/UserScript==
    //屏蔽弹窗
    (function () {
        'use strict';
        // 重写 window.alert 方法以阻止警告窗口显示
        unsafeWindow.alert = function() {
            console.log('警告窗口被屏蔽了！原始消息: ' );
        };
    
        // 重写 window.confirm 方法以阻止确认对话框显示
        unsafeWindow.confirm = function() {
            console.log('确认对话框被屏蔽了！原始消息: ' );
            // 默认情况下，confirm返回false
            return false;
        };
    
        // 重写 window.prompt 方法以阻止提示输入框显示
        unsafeWindow.prompt = function() {
            console.log('提示输入框被屏蔽了！原始消息: ' );
            // 默认情况下，prompt返回空字符串
            return '';
        };
    
    var currentURL = window.location.href;
    
    
    // 选课页面
    function xuanke() {
        //判断当前页课程是否全部学完，如果学完点击下页，否则进入未学习的课程
        var xxstat = document.getElementsByClassName("coursespan")
        //如果最后一个节点也学完了，则全部完成，跳转下页
            if (xxstat[xxstat.length-1].lastChild.innerHTML == "已完成"){
                var NextPage= "https://www.ahgbjy.gov.cn/"+document.getElementsByClassName("pagination")[0].lastChild.previousSibling.previousSibling.firstChild.getAttribute("href");
                window.location.href = NextPage;
         //否则，找到第一个未学完的页面，点击开始学习
        }else{
            for(var n=0;n<xxstat.length;n++){
                if (xxstat[n].lastChild.innerHTML!="已完成"){
                    xxstat[n].click();
                    break;
                }
            }
        }
    }
    
    
    // 课程详情页
    function xiangqing() {
        var j = GM_getValue('jj');
        var kewc = document.getElementsByClassName("col-md-2")
        //判断课程是否全部完成，如果完成跳转至首页，否则点击开始学习
        if (kewc[kewc.length-1].getElementsByTagName("span")[0].innerHTML == 100)
        {
             window.open("https://www.ahgbjy.gov.cn/pc/course/courselist.do?categoryid=&year=&coutype=0&mostNInput=0&mostHInput=0&mostTJInput=&keyword=", "_blank");
        }else{
            //点击开始学习
        var xx = document.getElementsByClassName("btn btn-default startlearn");
        xx[0].click();
        }
    }
    
    // 视频课程
    function StarAndExit() {
            //视频课程
         var a = document.getElementsByClassName("jp-duration");
         //获取课程的时间+1分钟
            var TimeN = parseInt(a[0].innerHTML.substring(1,3),10)+1;
        var b= document.getElementById("coursenametitle");
        var c = TimeN;
       function updateTime(){
            b.innerHTML="  脚本将在"+c+"分钟后自动点击完成";
           c=c-1;
    }
       setInterval(updateTime, 1000*60);
            console.log("延迟"+TimeN+"分钟,点击完成")
         //延迟执行，时间到点击完成播放
          setTimeout(function() {
                var wcbtn = document.getElementsByClassName("btn btn-default")
                wcbtn[1].click();
        }, 1000*TimeN*60);
    }
    
    
    //ppt课程
    function playscorm(){
           var fr = document.mainFrame;
          var s = fr.document.getElementsByClassName("continueStudyButton");
           if (s.length>0) {
               s[0].click();
           } else {
               console.error("Element with class 'continueStudyButton' not found.");
           }
       function dianjikaishi(){
      // 在这里执行获取iframe中元素的操作
           var fr = document.mainFrame;
           //获取播放状态
           var PlayStat = fr.document.getElementById("toPlay");
           if(PlayStat.getAttribute("style").includes('block')){
               PlayStat.click();
           }
           if (fr.document.getElementsByClassName("totalTimeLabel")[0].innerHTML==fr.document.getElementsByClassName("currentTimeLabel")[0].innerHTML) {
                // 点击完成播放，上传记录
                var wcbtn = document.getElementsByClassName("btn btn-default")
            //wcbtn[1].removeEventListener('click', function() {});
                wcbtn[1].click();
            }
           };
        setInterval(dianjikaishi, 10000);
    }
    
    
    
    function StartFunc() {
        // 根据当前页面执行相应操作
        if (currentURL.includes('https://www.ahgbjy.gov.cn/pc/course/courselist.do')) {
            xuanke(); // 开始选课
        } else if (currentURL.includes('https://www.ahgbjy.gov.cn/pc/course/coursedetail.do')) {
            xiangqing();
        } else if (currentURL.includes('https://www.ahgbjy.gov.cn/pc/course/playvideo.do' )){
            StarAndExit();
        }else if (currentURL.includes('https://www.ahgbjy.gov.cn/pc/course/playscorm.do' )){
         playscorm();
        }
    }
    
    
    window.onload = function () {
        // 调用需要在页面加载完成后执行的函数
        StartFunc();
    }
    })();
    