// 레이아웃
app.controller('playerCtrl', function($scope, $ionicModal, $cordovaFileTransfer, $timeout, FileObj, Server, Auth, Demo, Tpl){
    $scope.time_id1 = null;
    $scope.intervalTime = 2000;    // 기본 반복시간 10초 컨텐츠 다운 이후에는 1분으로 조정
    $scope.is_downloding = false;
    $scope.tpls = Tpl;

    $scope.player = {};

    //채널코드. 단말기의 인증여부를 검사함. localStorage에 별도 저장하고 매번 호출해와야함.
    $scope.player.channel = "0000";
    // $scope.player.rightBanner = {};
    // $scope.player.rightBanner.link = "http://naver.com";
    // $scope.player.rightBanner.src = "./demo/rightbanner.jpg";
    //
    // $scope.player.leftBanner = {};
    // $scope.player.leftBanner.link = "http://naver.com";
    // $scope.player.leftBanner.src = "./demo/leftbanner.png";

    //우하단 버튼노출유무
    $scope.player.didmode = true;

    //전화하기 주문하기 버튼 노출유무
    // $scope.player.callnum = "01057595999";
    // $scope.player.order_url = "http://softgear.xiso.kr";


    //demodata
    var demoData = [];
    var demoData1 = [];
    var demoData2 = [];
    var demoData3 = [];
    var demoData4 = [];
    var demoData5 = [];
    var demoData6 = [];
    var demoData7 = [];
    var demoData8 = [];
    var demoData9 = [];
    var demoData10 = [];
    var demoData11 = [];

    var clip = {};
    clip.clip_srl = 0;
    clip.clip_type = "V";
    clip.clip_url = "./demo/mov.mp4";
    clip.transform = "fadeInUp";
    clip.running_time = 30000;
    demoData.push(clip);
    demoData.push(clip);

    var clip = {};
    clip.clip_srl = 1;
    clip.clip_type = "I";
    clip.clip_url = "./demo/1/1.jpg";
    clip.transform = "scale";
    clip.running_time = 3000;
    demoData1.push(clip);
    var clip = {};
    clip.clip_srl = 2;
    clip.clip_type = "I";
    clip.clip_url = "./demo/1/2.jpg";
    clip.transform = "rotate";
    clip.running_time = 5000;
    demoData1.push(clip);

    var clip = {};
    clip.clip_srl = 3;
    clip.clip_type = "I";
    clip.clip_url = "./demo/2/1.jpg";
    clip.transform = "scale";
    clip.running_time = 2000;
    demoData2.push(clip);
    var clip = {};
    clip.clip_srl = 4;
    clip.clip_type = "I";
    clip.clip_url = "./demo/2/2.jpg";
    clip.transform = "rotate";
    clip.running_time = 2500;
    demoData2.push(clip);

    var clip = {};
    clip.clip_srl = 5;
    clip.clip_type = "I";
    clip.clip_url = "./demo/3/1.jpg";
    clip.transform = "fadeInRight";
    clip.running_time = 2000;
    demoData3.push(clip);
    var clip = {};
    clip.clip_srl = 6;
    clip.clip_type = "I";
    clip.clip_url = "./demo/3/2.jpg";
    clip.transform = "fadeInLeft";
    clip.running_time = 2500;
    demoData3.push(clip);

    var clip = {};
    clip.clip_srl = 7;
    clip.clip_type = "I";
    clip.clip_url = "./demo/4/1.jpg";
    clip.transform = "fadeInRight";
    clip.running_time = 4000;
    demoData4.push(clip);
    var clip = {};
    clip.clip_srl = 8;
    clip.clip_type = "I";
    clip.clip_url = "./demo/4/2.jpg";
    clip.transform = "fadeInRight";
    clip.running_time = 4000;
    demoData4.push(clip);




    $scope.seq_code = "";
    //시퀀스 하나짜리 풀스크린
    $scope.template_mode = "full";
    $scope.sequence_count = 1;
    //두개 세로분할
    // $scope.template_mode = "vh";
    // $scope.sequence_count = 2;
    //두개 가로분할
    // $scope.template_mode = "hv";
    // $scope.sequence_count = 2;
    //세개 왼쪽1 오른쪽 가로 2분할
    // $scope.template_mode = "vhh";
    // $scope.sequence_count = 3;
    //세개 왼쪽 가로 2 오른쪽 1 분할
    // $scope.template_mode = "hhv";
    // $scope.sequence_count = 3;
    //세개 가로 3분할
    // $scope.template_mode = "vvv";
    // $scope.sequence_count = 3;
    //세개 세로 3분할
    // $scope.template_mode = "hhh";
    // $scope.sequence_count = 3;
    //4개 균등분할
    // $scope.template_mode = "hhvv";
    // $scope.sequence_count = 4;
    //4개 왼쪽 1 : 오른쪽 3 수평분할
    // $scope.template_mode = "vhhh";
    // $scope.sequence_count = 4;

    $scope.next = function(obj_id, data_obj, seq_idx){
        //일단 이 시퀀스 내의 모든 비디오를 중지
        jQuery("#"+obj_id).find("video").each(function () { this.pause(); this.currentTime = 0; });

        var a = jQuery("#" + obj_id);
        var l = a.find(".bp-hs_inner");
        l.find(".bp-hs_inner__item.is-active").next().length ? (l.find(".bp-hs_inner__item.is-active").removeClass("is-active").next().addClass("is-active"), a.find(".bp-bullets_bullet.current").removeClass("current").next().addClass("current")) : (l.find(".bp-hs_inner__item.is-active").removeClass("is-active"), a.find(".bp-bullets_bullet.current").removeClass("current"), l.find(".bp-hs_inner__item").eq(0).addClass("is-active"), a.find(".bp-bullets_bullet").eq(0).addClass("current"));

        //이번 클립이 비디오면 재생.
        if(data_obj[seq_idx].file_type.indexOf('v') == 0){
            if(l.find(".bp-hs_inner__item.is-active").find('video').size()){
                l.find(".bp-hs_inner__item.is-active").find('video')[0].play();
            }
        }

        //build next_seq
        setTimeout(function(){
            if(data_obj[seq_idx+1]){
                $scope.next(obj_id, data_obj, seq_idx+1);
            }else{
                $scope.next(obj_id, data_obj, 0);
}
        },data_obj[seq_idx].duration * 1000);
        $scope.apply;
    };

    $scope.sequence = [];
    $scope.buildSlider = function(obj_id, data_obj){
        $scope.sequence[obj_id] = data_obj;
        $scope.apply;

        setTimeout(function(){
            jQuery('#' + obj_id).bpHS({
                autoPlay: false,
                showControl: false,
                showButtons: false,
                showBullets: false
            });

            //이번 클립이 비디오면 재생.
            if(data_obj[0].file_type.indexOf('v') == 0){
                var a = jQuery("#" + obj_id);
                var l = a.find(".bp-hs_inner");
                l.find(".bp-hs_inner__item.is-active").find('video')[0].play();
                console.log("playVideo");
            }
        },1000);

        //build timeout
        setTimeout(function(){
            $scope.next(obj_id, data_obj, 1);
        },data_obj[0].duration * 1000);
    };

    function tick(){
        jQuery('#ticker_01 li:first').slideUp( function () { jQuery(this).appendTo(jQuery('#ticker_01')).slideDown(); });
    }
    setInterval(function(){ tick () }, 3000);

    $scope.openWebView = function(url){
        window.open(url, '_blank', 'closebuttoncaption=닫기, location=no, zoom=no');
    };

    //다른채널 보기
    //데모 목록
    $scope.channel_list = [];
    $scope.channel_list[0] = {
        'channel' : '0000',
        'thumbnail' : "./demo/1/1.jpg",
        'category' : 'redetto',
        'title' : "레데또 채널"
    };
    $scope.channel_list[1] = {
        'channel' : '0000',
        'thumbnail' : "./demo/2/1.jpg",
        'category' : '의류/잡화',
        'title' : "레데또 채널"
    };
    $scope.channel_list[2] = {
        'channel' : '0000',
        'thumbnail' : "./demo/3/1.jpg",
        'category' : '주식',
        'title' : "주식의 제왕, 오버코드입니다."
    };
    $scope.channel_list[3] = {
        'channel' : '0000',
        'thumbnail' : "./demo/4/1.jpg",
        'category' : 'PC/가전',
        'title' : "초대박 가전제품 박람회"
    };
    $scope.channel_list[4] = {
        'channel' : '0000',
        'thumbnail' : "./demo/1/1.jpg",
        'category' : 'redetto',
        'title' : "레데또 채널"
    };
    $scope.channel_list[5] = {
        'channel' : '0000',
        'thumbnail' : "./demo/2/1.jpg",
        'category' : '의류/잡화',
        'title' : "레데또 채널"
    };
    $scope.channel_list[6] = {
        'channel' : '0000',
        'thumbnail' : "./demo/3/1.jpg",
        'category' : '주식',
        'title' : "주식의 제왕, 오버코드입니다."
    };
    $scope.channel_list[7] = {
        'channel' : '0000',
        'thumbnail' : "./demo/4/2.jpg",
        'category' : 'PC/가전',
        'title' : "초대박 가전제품 박람회"
    };
    $scope.channel_list[8] = {
        'channel' : '0000',
        'thumbnail' : "./demo/5/1.jpg",
        'category' : 'PC/가전',
        'title' : "초대박 가전제품 박람회"
    };

    $scope.changeChannel = function(channel){
        //마찬가지로 localStorage에 저장해야하고

        //새 채널에관한 시퀀스정보를 받아서

        //다운로드해야함. (프로그래스)

        //그리고 플레이어의 채널을 변경.
        $scope.player.channel = channel;
        $scope.closeChannelList();
    };

    $ionicModal.fromTemplateUrl('./templates/channel_list.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openChannelList = function() {
        $scope.modal.show();
    };
    $scope.closeChannelList = function() {
        $scope.modal.hide();
    };

    $scope.down_total = 0; // 다운로드 남은개수
    $scope.down_cur = 0;

    // 다운로드 성공하면 다음 파일 순차 다운로드 및 완료 처리
    var down = function(timelines){
        // 새 디렉토리 dir
        // 예전 디렉토리 device_dir
        // server Url url
        // Timelines  timelines

        var fileObj = FileObj.get();
        // console.log(fileObj);

        if($scope.down_cur < $scope.down_total){
            var url = Server.get().url;
            var dir = $scope.content.content_srl + timelines[$scope.down_cur].uploaded_filename.substr(timelines[$scope.down_cur].uploaded_filename.lastIndexOf('/'));
            var targetPath = fileObj.externalDataDirectory + dir;
            timelines[$scope.down_cur].device_filename = targetPath;
            // console.log(targetPath);

            var downUrl = url + timelines[$scope.down_cur].uploaded_filename.substr(1);

            //'http://master.softgear.kr/files/images/201702/afb47f5529e9ed9868f78311d3a3857c.mp4'
            //'http://xiso.co.kr/files/attach/images/10567/567/010/72bd535d474df279509285f1b373aab5.png'
            console.log(downUrl);

            $cordovaFileTransfer.download(downUrl, targetPath, {}, true).then(function(res){
                console.log(res);
                $scope.down_cur++;

                down(timelines);
            },function(err){
                console.log(err);
            }, function (progress) {
                $timeout(function () {
                    $scope.progress = Math.floor((progress.loaded / progress.total) * 100);
                });
            });
        }else{
            $scope.is_downloading = false;
            console.log('파일 다운로드 완료');

            // device_filename: "file:///storage/emulated/0/Android/data/com.ionicframework.did930910/files/36/b19c9422ef533f9a60850e9f7d7f8cf8.jpg"
            // duration: "3"
            // file_size: "148814"
            // file_srl: "31"
            // file_type: "image/jpeg"
            // is_show_qr: "N"
            // member_srl: "1"
            // member_user_id: "softgear"
            // member_user_name: "관리자"
            // regdate: "20170301002350"
            // seq: 0
            // sid: "442c35d18bde1e26a45ef1cacf2c2e1c"
            // source_filename: "featured-section-new-to-mac_2x.jpg"
            // thumb_filename: "./files/images/201703/thumb/b19c9422ef533f9a60850e9f7d7f8cf8.jpg.jpg"
            // title: "epofjwoefjopwjgoprjopdfb"
            // transition: "scale"
            // uploaded_filename: "./files/images/201703/b19c9422ef533f9a60850e9f7d7f8cf8.jpg"
            // url: "null"
            // url_prefix: "null"
            // view_count: "0"
            // self.removeDir(device_dir);
            var sequences = [];
            angular.forEach(timelines, function(clip, idx){
                if(!Array.isArray(this[clip.seq])){
                    this[clip.seq] = [];
                }
                this[clip.seq].push(clip);
            },sequences);

            angular.forEach(sequences, function(sequence,idx){
                $scope.buildSlider("sequence" + (idx + 1), sequence);
            });


            // self.getSeq();  // 다시 interval 돌림

            // self.tempToMain();  // 다운로드 완료되면 시퀀스 덮어씀
        }
    };


    $scope.download = function(){
        document.addEventListener('deviceready', function () {

            if($scope.content.timelines.length > 0) {
                var timelines = [];
                angular.forEach($scope.content.timelines, function(value,key){
                    angular.forEach(value, function(v,k){
                        v.seq = key;
                        this.push(v);
                    },timelines);
                });
                // console.log(timelines);

                $scope.is_downloading = true;
                $scope.down_total = timelines.length;
                $scope.down_cur = 0;

                clearInterval($scope.time_id1); // interval clear

                down(timelines);
            }
        }, false);
    };

    // 채널 정보를 받아온다. 없으면 인증번호를 받아옴.
    $scope.checkChannel = function(){
        Auth.get().then(function(res){
            // console.log(res);
            if(res.result.server_url){
                console.log(res.result.server_url);
            }else{
                $scope.auth_no = res.result.auth_no;

                Demo.get().then(function(res){
                    console.log(res);
                    $scope.content = res.result;
                    // 기기에 저장된 Demo 시퀀스와 비교해서 다르면 다운로드 받는다.

                    $scope.template_mode = $scope.content.template;
                    $scope.sequence_count = $scope.tpls[$scope.content.template].sequence_count;

                    $scope.player.notice = [];

                    for(var key in $scope.content.notices){
                        var notice = {};
                        if($scope.content.notices[key].url && $scope.content.notices[key].url != 'null'){
                            notice.link = $scope.content.notices[key].url_prefix + $scope.content.notices[key].url;
                        }
                        notice.text = $scope.content.notices[key].content;
                        $scope.player.notice.push(notice);
                    }

                    console.log($scope.player.notice);

                    // $scope.player.notice = {};
                    // $scope.player.notice[0] = {
                    //     'link' : 'http://softgear.xiso.kr',
                    //     'text' : '공지사항 테스트!~!~!~!'
                    // };
                    // $scope.player.notice[1] = {
                    //     'link' : 'http://naver.com',
                    //     'text' : '링크도 동작함.'
                    // };
                    // $scope.player.notice[2] = {
                    //     'link' : 'http://daum.net',
                    //     'text' : '링크오픈해보기.'
                    // };

                    $scope.download();

                    $scope.intervalTime = 30000;
                });
            }
        });
    };

    $scope.time_id1 = setInterval(function(){
        // if(window.localStorage['server_url']) self.server_url = JSON.parse(window.localStorage['server_url']);

        // console.log('get demo contents');
        $scope.checkChannel();



    }, $scope.intervalTime);

});
