// 레이아웃
app.controller('playerCtrl', function($scope, $ionicModal, $cordovaFile, $cordovaFileTransfer, $timeout, FileObj, Server, Auth, Tpl, DownloadedContent, Content, Channel, Viewcount){
    setTimeout(function(){
      jQuery("#splash").fadeOut();
    },5000);

    $scope.time_id1 = null;
    $scope.is_downloding = false;
    $scope.tpls = Tpl;
    $scope.is_first = true;

    $scope.player = {};

    //채널코드. 단말기의 인증여부를 검사함. localStorage에 별도 저장하고 매번 호출해와야함.
    // $scope.player.channel = "0000";

    //우하단 버튼노출유무
    $scope.player.didmode = true;

    $scope.seq_code = "";
    $scope.time_ids = [];
    $scope.video_ended = new Array();
    $scope.next = function(seq_code, data_obj, clip_idx){
        //뷰카운트를 전송
        Viewcount.send(DownloadedContent.get().content_srl, data_obj[clip_idx].file_srl);

        //일단 이 시퀀스 내의 모든 비디오를 중지
        jQuery("#" + seq_code).find("video").each(function () {
            this.pause();
            this.currentTime = 0;
        });

        var a = jQuery("#" + seq_code);
        var l = a.find(".bp-hs_inner");
        l.find(".bp-hs_inner__item.is-active").next().length ? (l.find(".bp-hs_inner__item.is-active").removeClass("is-active").next().addClass("is-active"), a.find(".bp-bullets_bullet.current").removeClass("current").next().addClass("current")) : (l.find(".bp-hs_inner__item.is-active").removeClass("is-active"), a.find(".bp-bullets_bullet.current").removeClass("current"), l.find(".bp-hs_inner__item").eq(0).addClass("is-active"), a.find(".bp-bullets_bullet").eq(0).addClass("current"));

        //이번 클립이 비디오면 재생.
        if (data_obj[clip_idx].clip_type == 'V'  && l.find(".bp-hs_inner__item.is-active").find('video').size()) {
            var video = l.find(".bp-hs_inner__item.is-active").find('video')[0];

            video.play();

            if($scope.video_ended.indexOf(seq_code + "_" + data_obj[clip_idx].file_srl) == -1){
                $scope.video_ended.push(seq_code + "_" + data_obj[clip_idx].file_srl);

                video.addEventListener("ended", function(){
                    console.log("ended video : " + seq_code + "_" + data_obj[clip_idx].file_srl);
                    if (data_obj[parseInt(clip_idx) + 1]) {
                        $scope.next(seq_code, data_obj, parseInt(clip_idx) + 1); // 다음 클립이 있으면 다음 클립
                    } else {
                        $scope.next(seq_code, data_obj, 0); // 다음 클립이 없으면 0번째 부터
                    }
                });
            }
        //이번 클립이 비디오가 아닐때
        }else{
            //build next_seq
            $scope.time_ids[seq_code + '_' + data_obj[clip_idx].file_srl] = setTimeout(function () {
                if (data_obj[parseInt(clip_idx) + 1]) {
                    $scope.next(seq_code, data_obj, parseInt(clip_idx) + 1);
                } else {
                    $scope.next(seq_code, data_obj, 0);
                }
            }, data_obj[clip_idx].duration * 1000);
        }
    };

    $scope.sequence = [];
    $scope.buildSlider = function(seq_idx, data_obj){
        //무료가아닐땐 하단배너가없으므로.. 템플릿에선 sequence 1부터 플레이되야함.
        var seq_code = '';
        if($scope.is_free != "Y"){
            var temp_idx = parseInt(seq_idx) + 1;
            seq_code = 'sequence' + temp_idx;
        }else {
            seq_code = 'sequence' + seq_idx;
        }

        $scope.sequence[seq_code] = data_obj;

        setTimeout(function () {
            jQuery('#' + seq_code).addClass('bp-hs');
            jQuery('#' + seq_code).bpHS({
                autoPlay: false,
                showControl: false,
                showButtons: false,
                showBullets: false,
                touchSwipe: false
            });

            var a = jQuery("#" + seq_code);
            var l = a.find(".bp-hs_inner");

            //이번 클립이 비디오면 재생.
            if (data_obj[0].clip_type == 'V'  && l.find(".bp-hs_inner__item.is-active").find('video').size()) {
                var video = l.find(".bp-hs_inner__item.is-active").find('video')[0];
                video.play();

                $scope.video_ended.push(seq_code + "_" + data_obj[0].file_srl);

                video.addEventListener("ended", function () {
                    console.log("ended video : " + seq_code + "_" + data_obj[0].file_srl);
                    if (data_obj[1]) {
                        $scope.next(seq_code, data_obj, 1);
                    } else {
                        video.play();
                    }
                });
            }else{
                // 이미지일때
                $scope.time_ids[seq_code + '_' + data_obj[0].file_srl] = setTimeout(function () {
                    // 다음 클립이 있을때만 동작
                    if(data_obj[1]) {
                        $scope.next(seq_code, data_obj, 1);
                    }
                }, data_obj[0].duration * 1000);
            }
        }, 1000);


    };

    function tick(){
        jQuery('#ticker_01 li:first').slideUp( function () { jQuery(this).appendTo(jQuery('#ticker_01')).slideDown(); });
    }
    setInterval(function(){ tick () }, 3000);

    $scope.openWebView = function(url){
        window.open(url, '_blank', 'closebuttoncaption=닫기, location=no, zoom=no');
    };

    $scope.play_toggle = function(data, seq_code, index){
        console.log(data);
        console.log(seq_code + '_' +index);
        if(data.clip_type == 'V') {
            //비디오일때
            var video = jQuery('#' + seq_code + '_' + index)[0];   //#sequence0_0
            // video.paused ? video.play() : video.pause();
            if(data.is_pause) {
                video.play();
                data.is_pause = false;
            }else{
                video.pause();
                data.is_pause = true;
            }
        }else if(data.clip_type == 'I'){
            //이미지일때
            if(data.is_pause) {
                // 이미지일때 다음 클립이 있을때
                if($scope.sequence[seq_code][index+1]) {
                    $scope.time_ids[seq_code + '_' + data.file_srl] = setTimeout(function () {
                        $scope.next(seq_code, $scope.sequence[seq_code], index + 1);
                    }, 3000);
                }else{
                    $scope.time_ids[seq_code + '_' + data.file_srl] = setTimeout(function () {
                        $scope.next(seq_code, $scope.sequence[seq_code], 0);
                    }, 3000);
                }
                data.is_pause = false;
            }else{
                clearTimeout($scope.time_ids[seq_code + '_' + data.file_srl]);
                data.is_pause = true;
            }
        }else{
            //URL 일때

        }
    };

    $scope.go_more = function(data, seq_code, index){
        // console.log('go more clicked');
        // 'http://','https://','tel:','sms:','mailto:'
        if(data.url_prefix == 'content:'){
            Content.update(data.url).then(function(res){
              if(res.error == 0){
                document.location.reload();
              }else{
                alert('컨텐츠의 변경에 실패했습니다.');
              }
            });
        } else if(data.url_prefix == 'http://' || data.url_prefix == 'https://'){
            $scope.openInAppBrowser(data.url_prefix + data.url);
        } else {
            window.location.href = data.url_prefix + data.url;
        }
    };

    $scope.openInExternalBrowser = function(url){ // Open in external browser
        window.open(url,'_system','location=yes');
    };

    $scope.openInAppBrowser = function(url){ // Open in app browser
        window.open(url,'_blank', 'closebuttoncaption=닫기, location=no, zoom=no');
    };

    $scope.openCordovaWebView = function(url){ // Open cordova webview if the url is in the whitelist otherwise opens in app browser
        window.open(url,'_self');
    };

    //다른채널 보기
    //데모 목록
    $scope.channel_list = Channel.getList();

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

    $scope.down_total = 0; // 다운로드 해야 될 파일 수
    $scope.down_cur = 0;

    // 다운로드 성공하면 다음 파일 순차 다운로드 및 완료 처리
    var down = function(timelines){

        var fileObj = FileObj.get();
        // console.log(fileObj);

        if($scope.down_cur < $scope.down_total){
            var url = '';
            if(timelines[$scope.down_cur].seq == 0 && timelines[$scope.down_cur].is_main == 'Y'){
              url = Server.getMain();
            }else{
              url = Server.get().url;
            }

            if($scope.is_free=='Y' && $scope.down_cur == 0){
                url = Server.getMain();
            }

            var path = DownloadedContent.get().content_srl + timelines[$scope.down_cur].uploaded_filename.substr(timelines[$scope.down_cur].uploaded_filename.lastIndexOf('/'));
            var targetPath = fileObj.externalDataDirectory + path;
            // var targetPath = fileObj.dataDirectory + path;
            // console.log(targetPath);

            if(timelines[$scope.down_cur].clip_type != 'U') {
                var downUrl = encodeURI(url + timelines[$scope.down_cur].uploaded_filename.substr(1));
                console.log('downUrl = '+downUrl);

                $cordovaFileTransfer.download(downUrl, targetPath, {}, true).then(function (res) {
                    console.log(res);
                    timelines[$scope.down_cur].device_filename = res.toInternalURL();
                    $scope.down_cur++;

                    down(timelines);
                }, function (err) {
                    console.log(err);
                }, function (progress) {
                    $timeout(function () {
                        $scope.progress = Math.floor((progress.loaded / progress.total) * 100);
                    });
                });
            }else{
                $scope.down_cur++;
                down(timelines);
            }
        }else{
            $scope.is_downloading = false;
            //바꿔치기 하고
            window.localStorage['play_content'] = window.localStorage['downloaded_content'];
            //찌꺼기제거
            delete window.localStorage['downloaded_content'];

            document.location.reload();
        }
    };

    $scope.download = function(timelines){
        document.addEventListener('deviceready', function () {
            down(timelines);
        }, false);
    };

    $scope.background_download = function(content){
        document.addEventListener('deviceready', function () {
            console.log(content.background);
            if(content.background) {
                var downUrl = encodeURI(Server.getMain() + content.bg_img.substr(1));
                $cordovaFileTransfer.download(downUrl, content.background, {}, true).then(function(res){
                    console.log(res);
                },function(err){
                    console.log(err);
                });
            }
        }, false);
    };

    // 슬라이더를 실행한다
    $scope.runSlider = function(timelines){
        var fileObj = FileObj.get();
        var sequences = [];
        angular.forEach(timelines, function(clip, idx){
            if(!Array.isArray(this[clip.seq])){
                this[clip.seq] = [];
            }
            if(!clip.device_filename) {
                var path = DownloadedContent.get().content_srl + clip.uploaded_filename.substr(clip.uploaded_filename.lastIndexOf('/'));
                // console.log(fileObj.dataDirectory);
                // console.log(path);
                // clip.device_filename = "cdvfile://localhost/files/" + path;
                // clip.device_filename = "http://did-data.xiso.co.kr/./files/images/201703/" + clip.uploaded_filename.substr(clip.uploaded_filename.lastIndexOf('/'));

                path = fileObj.externalDataDirectory + path;
                clip.device_filename = path;
            }

            this[clip.seq].push(clip);
        },sequences);

        angular.forEach(sequences, function(sequence, seq_idx){
            $scope.buildSlider(seq_idx, sequence);
        });

        clearInterval($scope.time_id1);
        $scope.time_id1 = setInterval($scope.checkChannel, 20000);    // 30초 마다 갱신
    };

    // 채널 정보를 받아온다. 없으면 인증번호를 받아옴.
    $scope.checkChannel = function(){
        console.log('check Channel');

        Auth.get().then(function(res){
            // console.log(res);
            $scope.auth_no = res.result.auth_no;

            // 데이터 서버 주소가 있으면 (채널 ID 가 있으면) 데이터 서버에서 컨텐츠 정보를 받아온다.
            if(res.result.server_url){

                Server.set({url: res.result.server_url, is_main: 'N'});

                Content.get(res.result).then(function(res2){
                    // console.log(res2);

                    $scope.setContent(res2.result);
                });

            // 채널 ID 가 없으면 인증번호를 받고 데모 컨텐츠 정보를 받아온다
            }else{

                Server.setMain();

                Content.get().then(function(res2){
                    console.log(res2);

                    $scope.setContent(res2.result);
                });
            }
        });

    };

    // 다운받은 컨텐츠를 정리한다
    $scope.is_free = "";
    $scope.setContent = function(content){
        // 기기에 저장된 Demo 시퀀스와 비교해서 다르면 다운로드 받는다.
        if($scope.template_mode != content.template) $scope.template_mode = content.template;
        if($scope.sequence_count != $scope.tpls[content.template].sequence_count) $scope.sequence_count = $scope.tpls[content.template].sequence_count;
        $scope.player.ch_srl = content.ch_srl;
        $scope.is_free = content.is_free;
        console.log(content);
        $scope.player.clock = content.clock;

        $scope.player.notice = [];

        for(var key in content.notices){
            var notice = {};
            if(content.notices[key].url && content.notices[key].url != 'null'){
                notice.link = content.notices[key].url_prefix + content.notices[key].url;
            }
            notice.text = content.notices[key].content;
            $scope.player.notice.push(notice);
        }

        if(content.bg_img) {
            var fileObj = FileObj.get();
            var bg_img = content.content_srl + content.bg_img.substr(content.bg_img.lastIndexOf('/'));
            content.background = fileObj.externalDataDirectory + bg_img;
            $scope.player.background = content.background;
        }

        if(content.timelines.length > 0) {
            var timelines = $scope.arr_2D_to_1D(content.timelines);

            if(!DownloadedContent.get() || (DownloadedContent.get().content_srl != content.content_srl) || !$scope.isSameContent(DownloadedContent.get(), content)){

                console.log('down');


                DownloadedContent.set(content); // content 정보 기기에 저장

                $scope.is_downloading = true;
                $scope.down_total = timelines.length;
                $scope.down_cur = 0;

                clearInterval($scope.time_id1); // interval clear

                $scope.download(timelines);

                if(content.bg_img && content.background) {
                    $scope.background_download(content);    // 배경이미지 다운로드
                }

                $scope.is_first = false;
            }else{
                console.log('no down');
                // console.log($scope.sequence);
                if($scope.is_first) {
                    // TODO 일단 content_srl 이 같으면 skip 한다
                    // content_srl 이 같아도 변경되어 있을 수 있기 때문에 나중에 수정
                    $scope.runSlider(timelines);

                    $scope.is_first = false;
                }
            }
        }

    };

    $scope.time_id1 = setInterval($scope.checkChannel, 2000);

    // function safeApply(scope, fn) {
    //     (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
    // }

    // 같은 타임라인인지 비교
    $scope.isSameContent = function(a, b){
        var result = true;

        if(a.notices && b.notices){
          if(a.notices.length != b.notices.length) return false;

          for(i=0; i< a.notices.length; i++){
            if(a.notices[i].url_prefix != b.notices[i].url_prefix) return false;
            if(a.notices[i].url != b.notices[i].url) return false;
            if(a.notices[i].content != b.notices[i].content) return false;
          }

        }

        if(a.template != b.template) return false;

        var timeline1 = $scope.arr_2D_to_1D(a.timelines);
        var timeline2 = $scope.arr_2D_to_1D(b.timelines);

        // 타임라인 길이가 다르면
        if(timeline1.length != timeline2.length) return false;

        for(i =0 ; i < timeline1.length ; i++){
            if(timeline1[i].sid != timeline2[i].sid){
                result = false; return false;
            }
            if(timeline1[i].duration != timeline2[i].duration){
                result = false; return false;
            }
            if(timeline1[i].url_prefix != timeline2[i].url_prefix){
                result = false; return false;
            }
            if(timeline1[i].url != timeline2[i].url){
                result = false; return false;
            }
            if(timeline1[i].transition != timeline2[i].transition){
                result = false; return false;
            }
        }

        return result;
    };

    $scope.arr_2D_to_1D = function(arr){
        var convertedArr = [];

        angular.forEach(arr, function (value, key) {
            angular.forEach(value, function (v, k) {
                v.seq = key;
                this.push(v);
            }, convertedArr);
        });

        return convertedArr;
    };

});
