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
        self.fileObj = obj;
    };
    
    return self;
})
    
.factory("Server", function(){
    var self = this;

    self.get = function(){
        var url = '/api';
        var url = 'http://did.xiso.co.kr';
        // 저장된 server 가 없으면 main server 를 넣는다.
        if(!window.localStorage['server']) {
            self.set({url: url, is_main: 'Y'});
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
    
    return self;
})
    
.factory("Device", function(){
    var self = this;
    
    self.get = function(){
        return JSON.parse(window.localStorage['device']);
    };

    self.set = function(deviceObj){
        // console.log(deviceObj);
        window.localStorage['device'] = JSON.stringify(deviceObj);
    };
    
    return self;
})
    
.factory("Auth", function(XisoApi, Device){
    var self = this;
    
    self.get = function(){
        var device = Device.get();
        var params = { uuid : device.uuid, model : device.model, serial : device.serial, version : device.version };

        //플레이어의 uuid로 인증번호 생성. 인증번호 받아옴. 채널ID가 있으면 채널테이블에서 SERVER URL 받아옴
        return XisoApi.send('player.procCheckPlayer', params);
    };
    
    return self;
})

.factory("Demo", function(XisoApi){
    var self = this;

    self.get = function(){
        return XisoApi.send('content.getDemoContent');
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

.factory('XisoApi', function($http, Object, Server){
    var service = {};
    var baseUrl = '';
    baseUrl = Server.get().url;

    var finalUrl = '';

    service.send = function(action, params){
        finalUrl = baseUrl + '/api.php?act=' + action;

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