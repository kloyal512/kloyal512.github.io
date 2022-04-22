/**
 * 当前是否正在寻找
 * @type {boolean} false-未开始/已成功, true-寻找中
 */
let startFlg = false;
/**
 * 点击开始时播放的音频，默认为牛乐器
 */
let braveCowAudio;
/**
 * 成功时播放的音频，默认为拉姐的勇敢牛牛不怕困难
 */
let braveCowBella;
let $bellaInfoImageA;
let $bellaInfoImageB;
let $bellaTargetImageA;
let $bellaTargetImageB;
/**
 * 音量 请控制在 [0.1,1] 这个区间
 * @type {number}
 */
let voice = 0.5;
/**
 * 存储页面宽度，计算位置用
 */
let maxWidth;
/**
 * 存储页面高度，计算位置用
 */
let maxHeight;
/**
 * 目标的位置，每次开始游戏会计算出一个随机的
 */
let bellaLeft;
/**
 * 目标的位置，每次开始游戏会计算出一个随机的
 */
let bellaTop;
/**
 * 寻找到目标的计数
 * @type {number}
 */
let findBellaCount = 0;
/**
 * 存储鼠标位置的X值
 */
let mouseX;
/**
 * 存储鼠标位置的Y值
 */
let mouseY;
/**
 * 图片高度 如果html中进行调整需要这里也同步修改，避免位置计算出错
 * @type {number}
 */
let imageHeight = 150;


$(document).ready(function () {
  maxWidth = window.innerWidth;
  maxHeight = window.innerHeight;
  $bellaInfoImageA = $("#bellaInfoImgA");
  $bellaInfoImageB = $("#bellaInfoImgB");
  $bellaTargetImageA = $("#bellaTargetImgA");
  $bellaTargetImageB = $("#bellaTargetImgB");
  // 两张图来回切换，敲击铁锅和大锤  如果只是单一图片可以把这个注掉，或者图片地址设成同样的
  setInterval("bellaImgClock()", 500);
  setInterval("calDis()", 500);
  initBraveCowAudio();
  $("#startBtn").click(function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    $("#into").hide();
    startFlg = true;
    resetBellaTargetImg();
    voice = 1;
    braveCowAudio.play();
  });
  $("#restartBtn").click(function () {
    callRestart();
  });

  function callRestart() {
    $("#bellaTargetContainer").hide();
    $("#success").hide();
    startFlg = true;
    resetBellaTargetImg();
    calDis();
    braveCowAudio.play();
  }

  document.onmousemove = mouseMove;

  // 实时获取鼠标位置
  function mouseMove(ev) {
    ev = ev || window.event;
    let mousePos = mouseCoords(ev);
    mouseX = mousePos.x;
    mouseY = mousePos.y;
  }

  // 实时获取鼠标位置
  function mouseCoords(ev) {
    if (ev.pageX || ev.pageY) {
      return {x: ev.pageX, y: ev.pageY};
    }
    return {
      x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
      y: ev.clientY + document.body.scrollTop - document.body.clientTop
    };
  }

  // 添加点击事件 如果当前在寻找目标且距离圆心小于指定距离，判断成功并播放音频
  $(document).click(function (e) {
    if (startFlg) {
      let x = e.clientX;
      let y = e.clientY;
      let dis = (x - bellaLeft) * (x - bellaLeft) + (y - bellaTop) * (y - bellaTop);
      if (dis < (imageHeight * imageHeight / 4)) {
        startFlg = false;
        // 成功后播放音频
        braveCowBella.currentTime = 0;
        braveCowBella.play();
        findBellaCount++;
        $("#findBellaCount").html(findBellaCount);
        $("#success").show();
        $("#bellaTargetContainer").show();
      }
    }
  });
  $("#bellaTargetContainer").click(function () {
    if (!startFlg) {
      callRestart();
    }
  });
});

/**
 * 计算鼠标和目标的距离，调整音量
 */
function calDis() {
  if (startFlg) {
    let x = mouseX;
    let y = mouseY;
    // 计算距离圆心的距离
    let dis = Math.sqrt((x - bellaLeft) * (x - bellaLeft) + (y - bellaTop) * (y - bellaTop));
    voice = 1 - (dis * 2 / maxWidth);
    if (voice < 0.1) {
      voice = 0.1;
    }
    // 控制台输出音量，正式版可以注掉
    console.log(voice);
  }
}

/**
 * 重新随机设置目标的位置
 */
function resetBellaTargetImg() {
  bellaLeft = Math.random() * maxWidth;
  bellaTop = Math.random() * (maxHeight - 20) + 20;
  $("#bellaTargetContainer").css("top", bellaTop - (imageHeight / 2)).css("left", bellaLeft - (imageHeight / 2));
}

// 初始化音频
function initBraveCowAudio() {
  braveCowAudio = $('#braveCowAudio')[0];
  braveCowBella = $('#braveCowAudio2')[0];
  // 循环播放牛乐器
  braveCowAudio.addEventListener('ended', playBraveCowAudio, false);
}

// 牛乐器
function playBraveCowAudio() {
  if (startFlg) {
    braveCowAudio.currentTime = 0;
    braveCowAudio.play();
    braveCowAudio.volume = voice;
  }
}

/**
 * 两张图来回切换，敲击铁锅和大锤
 */
function bellaImgClock() {
  $bellaInfoImageA.toggle();
  $bellaInfoImageB.toggle();
  $bellaTargetImageA.toggle();
  $bellaTargetImageB.toggle();
}