app

.factory("Tpl", function(){
    return {
        "live_5_v2_v3" : {
          title : '방송용 1',
          sequence_count : 5
        },
        "live_6_v2_h1_v3" : {
          title : '방송용 2',
          sequence_count : 6
        },
        "live_5_h2_v3" : {
          title : '방송용 3',
          sequence_count : 5
        },
        "live_6_v_h2_v3" : {
          title : '방송용 4',
          sequence_count : 6
        },
        "live_5_v2_v2_v3_2_1" : {
          title : '방송용 5',
          sequence_count : 5
        },
        "did_r" : {
          title : '가로형 DID 1',
          sequence_count : 1
        },
        "did_r_2" : {
          title : '가로형 DID 2',
          sequence_count : 2
        },
        "did_r_3" : {
          title : '가로형 DID 3',
          sequence_count : 3
        },
        "did_r_2_1" : {
          title : '가로형 DID 4',
          sequence_count : 2
        },
        "did_r_2_2" : {
          title : '가로형 DID 5',
          sequence_count : 2
        },
        "did_r_2_3" : {
          title : '가로형 DID 6',
          sequence_count : 2
        },
        "did_r_2_over_right" : {
          title : '가로형 DID 7',
          sequence_count : 2
        },
        "did_r_2_over_left" : {
          title : '가로형 DID 8',
          sequence_count : 2
        },
        "did_r_5_v_hvhv" : {
          title : '가로형 DID 9',
          sequence_count : 5
        },
        "did_r_6" : {
          title : '가로형 DID 10',
          sequence_count : 6
        },
        "did_r_4" : {
          title : '가로형 DID 11',
          sequence_count : 4
        },
        "did_r_7" : {
          title : '가로형 DID 12',
          sequence_count : 7
        },
        "did_r_12" : {
          title : '가로형 DID 13',
          sequence_count : 12
        },
        "did_r_5" : {
          title : '가로형 DID 14',
          sequence_count : 6
        },
        "did_r_9" : {
          title : '가로형 DID 15',
          sequence_count : 9
        },
        "did_c_1" : {
          title : '세로형 DID 1',
          sequence_count : 1
        },
        "did_c_2" : {
          title : '세로형 DID 2',
          sequence_count : 2
        },
        "did_c_7" : {
          title : '세로형 DID 3',
          sequence_count : 7
        },
        "did_c_9" : {
          title : '세로형 DID 4',
          sequence_count : 9
        },
        "did_c_7_2" : {
          title : '세로형 DID 5',
          sequence_count : 7
        },
        "did_c_7_3" : {
          title : '세로형 DID 6',
          sequence_count : 7
        },
        "did_c_2_2" : {
          title : '세로형 DID 7',
          sequence_count : 2
        },
        "did_c_3" : {
          title : '세로형 DID 8',
          sequence_count : 3
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
