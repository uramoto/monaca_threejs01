// 描画領域のサイズを決める。今回の場合、画面全体に広げる。
var viewWidth =  document.documentElement.clientWidth;
var viewHeight = document.documentElement.clientHeight;

var scene,     // オブジェクトの配置先となるシーン
    camera,    // オブジェクトを捉えるカメラ
    renderer,  // 実際の描画を担当するレンダラー
    chara,     // 表示する3Dキャラクター
    mouse = { x: 0.5, y: 0.5 }   // マウス位置を0,0から1,1までで表現(three.jsとは関係なし)
    ;

// 初期化処理
document.addEventListener("DOMContentLoaded", init, false);
function init() {
    // 空のシーンを作成
    scene = new THREE.Scene();
    
    // カメラの各種設定
    camera = new THREE.PerspectiveCamera(30, viewWidth / viewHeight, 0.1, 1000); 
    camera.position.z = 180;
    camera.position.y = 40;
    
    // シーン全体に広がる環境光を追加
    var light = new THREE.AmbientLight(0xBBBBBB);
    scene.add(light);
    
    // レフ板として点ライトを追加
    var pointLight = new THREE.PointLight(0xFFFFFF, 0.9, 1000);
    pointLight.position.set(100, 0, 200);
    scene.add(pointLight);

    // レンダラーを作り、描画先のDOMエレメントをbody直下に置く
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(viewWidth, viewHeight);
    document.body.appendChild( renderer.domElement );
    
    // OBJ・MTLファイルを読み込み開始
    var objLoader = new THREE.OBJMTLLoader();
    objLoader.load("obj/model.obj", "obj/model.mtl", function(model) {
        // 大きさを調整し、へその位置が地面に来るようにする
        model.scale.set(0.1, 0.1, 0.1);
        model.position.y = -40;
        // モデルをダミーオブジェクトで包む（へそ中心に回転したいため）
        chara = new THREE.Object3D();
        chara.add(model);
        // シーンへ追加する
        scene.add(chara);
        // カメラ方向をオブジェクトへ向ける
        camera.lookAt(chara.position);
        
        doRender();  // 描画開始！
    });

    // タッチやマウス操作のイベント登録
    window.addEventListener("touchmove", onTouchMove, false);
    window.addEventListener("mousemove", onMouseMove, false);
}

// 描画フレーム毎に呼び出される関数（最高で60FPS）
function doRender() {
    // おまじない
    window.requestAnimationFrame(doRender);

    // キャラのY軸・X軸の回転角度を決める。すこし背中側まで回転させたいので1.2を掛けている。
    chara.rotation.y = 1.2 * (-0.5 + mouse.x) * Math.PI;
    chara.rotation.x = 1.2 * (-0.5 + mouse.y) * Math.PI;
    
    // 徐々に正面を向かせたいので、勝手にマウス位置を中央に近づける
    mouse.x += (0.5 - mouse.x) * 0.05;
    mouse.y += (0.5 - mouse.y) * 0.05;

    // シーンを描画
    renderer.render(scene, camera);
}

// タッチイベントを拾う
function onTouchMove(ev) {
    mouse.x = event.changedTouches[0].pageX / screen.width;
    mouse.y = event.changedTouches[0].pageY / screen.height;
    ev.preventDefault();  // スクロール防止
}

// PCでの確認用
function onMouseMove(ev) {
    mouse.x = event.clientX / viewWidth;
    mouse.y = event.clientY / viewHeight;
}