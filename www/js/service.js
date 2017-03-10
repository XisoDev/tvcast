app

.factory("Tpl", function(){
    return {
        "full" : {
            title : '(1) 풀스크린',
            sequence_count : 1
        },
        "vh" : {
            title : '(2) 세로분할',
            sequence_count : 2
        },
        "hv" : {
            title : '(2) 가로분할',
            sequence_count : 2
        },
        "vhh" : {
            title : '(3) 왼쪽 1 오른쪽 가로 2분할',
            sequence_count : 3
        },
        "hhv" : {
            title : '(3) 왼쪽 가로 2 오른쪽 1',
            sequence_count : 3
        },
        "vvv" : {
            title : '(3) 가로 3분할',
            sequence_count : 3
        },
        "hhh" : {
            title : '(3) 세로 3분할',
            sequence_count : 3
        },
        "hhvv" : {
            title : '(4) 균등 4분할',
            sequence_count : 4
        },
        "vhhh" : {
            title : '(4) 왼쪽 1 오른쪽 3 수평분할',
            sequence_count : 4
        }
    }
})
    
.factory('FileObj', function(){
    var self = this;
    self.fileObj = {};
    
    self.get = function(){
        return self.fileObj;
    };
    self.set = function(obj){
        console.log('fileObj---');
        console.log(obj);
        self.fileObj = obj;
    };
    
    return self;
})
    
.factory("Server", function(){
    var self = this;

    self.get = function(){
        // 저장된 server 가 없으면 main server 를 넣는다.
        if(!window.localStorage['server']) {
            self.setMain();
        }

        // console.log('getting server ---');
        // console.log(JSON.parse(window.localStorage['server']));
        return JSON.parse(window.localStorage['server']);
    };

    self.set = function(serverObj){
        // console.log('setting server ---');
        // console.log(serverObj);
        window.localStorage['server'] = JSON.stringify(serverObj);
    };

    self.setMain = function(){
        self.set({url: 'http://did.xiso.co.kr', is_main: 'Y'});
    };
    
    return self;
})
    
.factory("Device", function(){
    var self = this;
    
    self.get = function(){
        return JSON.parse(window.localStorage['device']);
    };

    self.set = function(deviceObj){
        window.localStorage['device'] = JSON.stringify(deviceObj);
    };
    
    return self;
})
    
.factory("Auth", function(XisoApi, Device){
    var self = this;
    
    self.get = function(){
        var device = Device.get();
        var params = { uuid : device.uuid, model : device.model, serial : device.serial, version : device.version };
        // console.log(params);

        //플레이어의 uuid로 인증번호 생성. 인증번호 받아옴. 채널ID가 있으면 채널테이블에서 SERVER URL 받아옴
        return XisoApi.send('player.procCheckPlayer', params);
    };
    
    return self;
})

.factory("DownloadedContent", function(){
    var self = this;

    self.get = function(){
        if(!window.localStorage['downloaded_content']) return false;
        
        return JSON.parse(window.localStorage['downloaded_content']);
    };

    self.set = function(content){
        window.localStorage['downloaded_content'] = JSON.stringify(content);
    };

    return self;
})
    
.factory("Content", function(XisoApi){
    var self = this;

    self.get = function(params){
        return XisoApi.send('content.getContent', params);
    };

    return self;
})

.factory("Channel", function(){
    var self = this;

    self.getList = function() {
        var channel_list = [];
        channel_list[0] = {
            'channel': '0000',
            'thumbnail': "./demo/1/1.jpg",
            'category': 'redetto',
            'title': "레데또 채널"
        };
        channel_list[1] = {
            'channel': '0000',
            'thumbnail': "./demo/2/1.jpg",
            'category': '의류/잡화',
            'title': "레데또 채널"
        };
        channel_list[2] = {
            'channel': '0000',
            'thumbnail': "./demo/3/1.jpg",
            'category': '주식',
            'title': "주식의 제왕, 오버코드입니다."
        };
        channel_list[3] = {
            'channel': '0000',
            'thumbnail': "./demo/4/1.jpg",
            'category': 'PC/가전',
            'title': "초대박 가전제품 박람회"
        };
        channel_list[4] = {
            'channel': '0000',
            'thumbnail': "./demo/1/1.jpg",
            'category': 'redetto',
            'title': "레데또 채널"
        };
        channel_list[5] = {
            'channel': '0000',
            'thumbnail': "./demo/2/1.jpg",
            'category': '의류/잡화',
            'title': "레데또 채널"
        };
        channel_list[6] = {
            'channel': '0000',
            'thumbnail': "./demo/3/1.jpg",
            'category': '주식',
            'title': "주식의 제왕, 오버코드입니다."
        };
        channel_list[7] = {
            'channel': '0000',
            'thumbnail': "./demo/4/2.jpg",
            'category': 'PC/가전',
            'title': "초대박 가전제품 박람회"
        };
        channel_list[8] = {
            'channel': '0000',
            'thumbnail': "./demo/5/1.jpg",
            'category': 'PC/가전',
            'title': "초대박 가전제품 박람회"
        };

        return channel_list;
    };

    return self;
})

.factory("Object", function(){
    return function(error, message, data){
        var obj = {};
        obj.error = error;
        obj.message = message;

        if(typeof data === "undefined") {
            data = false;
        }
        obj.data = data;
        return obj;
    }
})

.factory('XisoApi', function($http, Object){
    var service = {};
    var baseUrl = 'http://did.xiso.co.kr';

    var finalUrl = '';

    service.send = function(action, params){
        finalUrl = baseUrl + '/api.php?act=' + action;
        // console.log(finalUrl);

        var result = $http({
            method: 'POST',
            url: finalUrl,
            data: params
        }).then(function(res){
            return res.data;
        }, function(err){
            console.log(err);
            return Object(-1, "서버와의 통신에 실패하였습니다.");
        });

        return result;
    };

    return service;
});