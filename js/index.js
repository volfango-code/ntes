//滑动导航
(function () {
  // 获取滑动的里外盒子
  var scrollWrap = document.querySelector('.scrollWrap'),
    inner = document.querySelector('.inner');
  // 获取手指按下、拖动、以及按下当时元素的位置
  var startPointX = 0,
    startLeft = 0,
    movePointX = 0;
  // 为内盒子设置行内样式，用于获取移动距离
  inner.style.transform = 'translateX(0px)';
  // 为外盒子添加手指触摸事件
  scrollWrap.addEventListener('touchstart', function (e) {
    // changedTouches 触发当前事件的手指列表
    startPointX = e.changedTouches[0].pageX; // 获取手指按下时的坐标位置
    startLeft = parseInt(inner.style.transform.split('(')[1]); // 获取手指按下时内盒子的位置
  });
  // 为外盒子添加手指滑动事件
  scrollWrap.addEventListener('touchmove', function (e) {
    movePointX = e.changedTouches[0].pageX - startPointX; // 获取手指滑动的距离
    var x = movePointX + startLeft; // 滑动距离 + 元素本身的位置 = 实际移动距离
    // 判断移动距离，防止滑动过头
    if (x >= 0) {
      // 说明左边到头了
      x = 0;
    } else if (x <= scrollWrap.offsetWidth - inner.offsetWidth) {
      // 说明右边到头了
      x = scrollWrap.offsetWidth - inner.offsetWidth;
    }
    inner.style.transform = 'translateX(' + x + 'px)'; // 通过移动距离让内盒子移动
    e.preventDefault(); // 防止左右滑动时触发滚动条上下滚
  });
})();

// 折叠导航
(function () {
  // 获取所有相关节点
  var more = document.querySelector('.channel .more span'),
    channel = document.querySelector('.channel'),
    shadow = document.querySelector('.shadow'),
    inner = document.querySelector('.inner');
  // 定义标记，用于导航的展开收起
  var shrink = true;
  // 为更多按钮添加手指抬起事件
  more.addEventListener('touchend', function () {
    if (shrink) {
      // 导航为收起状态，进行展开
      channel.classList.add("blockChannel");
      inner.style.transform = "translateX(0px)"; // 当导航展开时让内盒子回归原位，避免样式错乱
      shadow.style.display = "block"; // 显示遮罩层
    } else {
      // 导航为展开状态，进行收起
      channel.classList.remove("blockChannel");
      shadow.style.display = "none"; // 隐藏遮罩层
    }

    // 操作完成之后修改标记状态
    shrink = !shrink;
  })

  // 解决遮罩层弹出时还能滑动的问题
  shadow.addEventListener('touchstart', function (e) {
    e.preventDefault();
  })
})();



//轮播图
(function () {
  // 获取所有相关节点
  var banner = document.querySelector('.banner'),
    wrap = document.querySelector('.wrap'),
    circles = document.querySelectorAll('.banner .circle span'),
    imgWidth = banner.offsetWidth;

  // 获取手指按下、拖动、以及按下当时元素的位置
  var startPointX = 0,
    startLeft = 0,
    movePointX = 0,
    currentIndex = 0, // 当前的索引值
    lastIndex = 0, // 上一个的索引值
    timer = null; // 自动轮播

  // 初始化
  wrap.innerHTML += wrap.innerHTML; // 多复制一份图片，用于无缝滚动
  var len = wrap.children.length; // 获取图片总数量
  wrap.style.width = len * 100 + 'vw'; // 图片数量翻了一倍，会导致宽度不够放不下，重新设置内盒子宽度
  wrap.style.transform = 'translateX(0px)';  // 为内盒子设置行内样式，用于获取移动距离

  // 手指按下
  banner.addEventListener('touchstart', function (e) {
    clearInterval(timer);
    wrap.style.transition = 'null';
    if (currentIndex == 0) { // 如果按下的是第一张图片，如果往右边拖动，左侧将会出现空白
      currentIndex = len / 2; // 将索引定位到第二份的第一张图即可
    }
    if (currentIndex == len - 1) { // 如果按下的是最后一张图片，如果往左继续拖动，右侧将会出现空白
      currentIndex = len / 2 - 1; // 将索引定位到第一份的最后一张图即可
    }

    wrap.style.transform = 'translateX(' + -currentIndex * imgWidth + 'px)';

    // changedTouches 触发当前事件的手指列表
    startPointX = e.changedTouches[0].pageX; // 获取手指按下时的坐标位置
    startLeft = parseInt(wrap.style.transform.split('(')[1]); // 获取手指按下时内盒子的位置
  });

  // 手指拖动
  banner.addEventListener('touchmove', function (e) {
    movePointX = e.changedTouches[0].pageX - startPointX; // 获取手指滑动的距离
    var x = movePointX + startLeft; // 滑动距离 + 元素本身的位置 = 实际移动距离

    wrap.style.transform = 'translateX(' + x + 'px)'; // 通过移动距离让内盒子移动

    // 解决滑动轮播图时上下拖拽会触发滚动条滚动页面的问题
    e.preventDefault();
  });

  // 手指抬起
  banner.addEventListener('touchend', function (e) {
    movePointX = e.changedTouches[0].pageX - startPointX; // 获取手指滑动的距离

    var backWidth = imgWidth / 8; // 设置回弹范围，判断用户是否误触，只有超过回弹范围才认定触摸有效，进行图片切换

    if (Math.abs(movePointX) > backWidth) {
      // 1. movePointX为正值代表往右拖，往右拖要显示上一张图，currentIndex要减
      // 2. movePointX为负值代表往左拖，往左拖要显示下一张图，currentIndex要加
      currentIndex -= movePointX / Math.abs(movePointX);
    }

    // 图片滚动
    wrap.style.transition = '.3s';
    wrap.style.transform = 'translateX(' + -currentIndex * imgWidth + 'px)'; // 通过移动距离让内盒子移动

    // 小圆点切换
    /* currentIndex: 0  1  2  3  4  5  6  7  8  9  10  11  12  13  14  15
       currentIndex % 8: 0  1  2  3  4  5  6  7  0  1  2   3   4   5   6   7 */
    // 让两份图片的索引对应一份小圆点
    var currentCircle = currentIndex % (len / 2); // currentIndex % ( 图片总数的一半 )
    circles[lastIndex].className = '';
    circles[currentCircle].className = 'active';
    lastIndex = currentCircle;

    timer = setInterval(move, 2000);
  });

  // 图片滚动函数
  function move() {
    currentIndex++;

    wrap.style.transition = '.3s';
    wrap.style.transform = 'translateX(' + -currentIndex * imgWidth + 'px)';

    // 处理无缝滚动
    wrap.addEventListener('transitionend', function () {
      if (currentIndex >= len - 1) { // 如果按下的是最后一张图片，如果往左继续拖动，右侧将会出现空白
        currentIndex = len / 2 - 1; // 将索引定位到第一份的最后一张图即可
      }

      wrap.style.transition = 'null';
      wrap.style.transform = 'translateX(' + -currentIndex * imgWidth + 'px)';
    });

    // 轮播圆点
    var currentCircle = currentIndex % (len / 2); // currentIndex % ( 图片总数的一半 )
    circles[lastIndex].className = '';
    circles[currentCircle].className = 'active';
    lastIndex = currentCircle;
  }

  // 自动轮播
  timer = setInterval(move, 2000);
})();

// 回到顶部
(function () {
  var backTop = document.querySelector('.backTop');
  window.addEventListener('scroll', function () {
    var top = this.pageYOffset; // 滚动条的滚动距离
    backTop.style.opacity = top > 600 ? 1 : 0; // 滚动距离超过600则显示回到顶部按钮，反之则隐藏
  });

  // 点击按钮回到顶部
  backTop.addEventListener('touchend', function () {
    window.scrollTo(0, 0);
  });
})();

