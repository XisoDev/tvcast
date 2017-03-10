// 레이아웃
app.controller('playerCtrl', function($scope, $ionicModal, $cordovaFileTransfer, $timeout, FileObj, Server, Auth, Tpl, DownloadedContent, Content, Channel){
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

    $scope.next = function(obj_id, data_obj, seq_idx){
        //일단 이 시퀀스 내의 모든 비디오를 중지
        jQuery("#" + obj_id).find("video").each(function () {
            this.pause();
            this.currentTime = 0;
        });

        var a = jQuery("#" + obj_id);
        var l = a.find(".bp-hs_inner");
        l.find(".bp-hs_inner__item.is-active").next().length ? (l.find(".bp-hs_inner__item.is-active").removeClass("is-active").next().addClass("is-active"), a.find(".bp-bullets_bullet.current").removeClass("current").next().addClass("current")) : (l.find(".bp-hs_inner__item.is-active").removeClass("is-active"), a.find(".bp-bullets_bullet.current").removeClass("current"), l.find(".bp-hs_inner__item").eq(0).addClass("is-active"), a.find(".bp-bullets_bullet").eq(0).addClass("current"));

        //이번 클립이 비디오면 재생.
        if (data_obj[seq_idx].file_type.indexOf('v') == 0) {
            if (l.find(".bp-hs_inner__item.is-active").find('video').size()) {
                l.find(".bp-hs_inner__item.is-active").find('video')[0].play();
            }
        }

        //build next_seq
        setTimeout(function () {
            if (data_obj[seq_idx + 1]) {
                $scope.next(obj_id, data_obj, seq_idx + 1);
            } else {
                $scope.next(obj_id, data_obj, 0);
            }
        }, data_obj[seq_idx].duration * 1000);
    };

    $scope.sequence = [];
    $scope.buildSlider = function(obj_id, data_obj){
        $scope.sequence[obj_id] = data_obj;

        setTimeout(function () {
            jQuery('#' + obj_id).addClass('bp-hs');
            jQuery('#' + obj_id).bpHS({
                autoPlay: false,
                showControl: false,
                showButtons: false,
                showBullets: false,
                touchSwipe: false
            });

            //이번 클립이 비디오면 재생.
            if (data_obj[0].file_type.indexOf('v') == 0) {
                var a = jQuery("#" + obj_id);
                var l = a.find(".bp-hs_inner");
                l.find(".bp-hs_inner__item.is-active").find('video')[0].play();
                console.log("playVideo");
            }
        }, 1000);

        //build timeout
        setTimeout(function () {
            $scope.next(obj_id, data_obj, 1);
        }, data_obj[0].duration * 1000);
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
            var url = Server.get().url;
            var path = DownloadedContent.get().content_srl + timelines[$scope.down_cur].uploaded_filename.substr(timelines[$scope.down_cur].uploaded_filename.lastIndexOf('/'));
            var targetPath = fileObj.externalDataDirectory + path;
            timelines[$scope.down_cur].device_filename = targetPath;
            // console.log(targetPath);

            var downUrl = encodeURI(url + timelines[$scope.down_cur].uploaded_filename.substr(1));
            console.log('downUrl = '+downUrl);

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
            document.location.reload();
            // $scope.runSlider(timelines);
        }
    };

    $scope.download = function(timelines){
        document.addEventListener('deviceready', function () {
            down(timelines);
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
                clip.device_filename = fileObj.externalDataDirectory + path;
            }

            this[clip.seq].push(clip);
        },sequences);

        $scope.sequence = [];
        angular.forEach(sequences, function(sequence,idx){
            $scope.buildSlider("sequence" + (idx + 1), sequence);
        });

        clearInterval($scope.time_id1);
        $scope.time_id1 = setInterval($scope.checkChannel, 20000);    // 30초 마다 갱신
    };

    // 채널 정보를 받아온다. 없으면 인증번호를 받아옴.
    $scope.checkChannel = function(){
        console.log('check Channel');

        Auth.get().then(function(res){
            // console.log(res);
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

                $scope.auth_no = res.result.auth_no;

                Content.get().then(function(res2){
                    console.log(res2);

                    $scope.setContent(res2.result);
                });
            }
        });

    };

    // 다운받은 컨텐츠를 정리한다
    $scope.setContent = function(content){

        // 기기에 저장된 Demo 시퀀스와 비교해서 다르면 다운로드 받는다.
        if($scope.template_mode != content.template) $scope.template_mode = content.template;
        if($scope.sequence_count != $scope.tpls[content.template].sequence_count) $scope.sequence_count = $scope.tpls[content.template].sequence_count;
        $scope.player.ch_srl = content.ch_srl;

        $scope.player.notice = [];

        for(var key in content.notices){
            var notice = {};
            if(content.notices[key].url && content.notices[key].url != 'null'){
                notice.link = content.notices[key].url_prefix + content.notices[key].url;
            }
            notice.text = content.notices[key].content;
            $scope.player.notice.push(notice);
        }

        if(content.timelines.length > 0) {
            var timelines = [];
            angular.forEach(content.timelines, function (value, key) {
                angular.forEach(value, function (v, k) {
                    v.seq = key;
                    this.push(v);
                }, timelines);
            });

            if(!DownloadedContent.get() || (DownloadedContent.get().content_srl != content.content_srl)){

                console.log('down');

                DownloadedContent.set(content);

                $scope.is_downloading = true;
                $scope.down_total = timelines.length;
                $scope.down_cur = 0;

                clearInterval($scope.time_id1); // interval clear

                $scope.download(timelines);

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

    // is different content? : device 에 저장된 컨텐츠와 다운받으려는 컨텐츠가 다르면 true
    // $scope.isDiffContent = function(){
    //     if(!DownloadedContent.get()) return true;
    // };

    $scope.time_id1 = setInterval($scope.checkChannel, 2000);

    // function safeApply(scope, fn) {
    //     (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
    // }

});
