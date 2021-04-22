/**
 * 作者： 戴荔春
 * 创建时间： 2018/01/08
 * 版本： [1.0, 2018/01/08]
 * 版权： 江苏国泰新点软件有限公司
 * 描述： 重新一个简洁版本的gotop，以前的那个引用了大量的jq脚本和样式，过度冗余
 * 这里的样式直接放到了common中
 */
(function() {
    var defaultSetting = {
        container: document.body,
        isHide: false,
        duration: 500,
        // 滚动多少后显示totop
        scrollTop: 400,
    };

    /**
     * 构造一个滚动到顶部的小插件
     * @param {Object} options 配置参数，包括
     * isHide 是否默认隐藏
     * scrollTop 滚动到什么地方才显示
     * 像时间，动画之类的都在css中控制
     */
    function GoTop(options) {
        options = Util.extend({}, defaultSetting, options);

        if (typeof options.container === 'string') {
            options.container = document.querySelector(options.container);
        }
        
        // 兼容一些调用
        options.isHide = options.hide || options.isHide;
        options.duration = options.time !== undefined ?  options.time : options.duration;
        
        
        this.options = options;
        this.container = options.container;
        this.init();
    }

    GoTop.prototype.init = function() {
        var self = this;
        // 如果是Body上的滑动，需要监听window的scroll
        var targetScrollDom = (this.container === document.body) ? window : this.container;
        var toTopBtn = document.createElement('div');

        toTopBtn.className = 'common-totop common-hidden';
        toTopBtn.onclick = function() {
            if (!self.isScrollTo) {
                self.scrollToTop(self.options.duration);
            }
        };
        this.toTopBtn = toTopBtn;
        this.isShowToTopBtn = false;
        this.targetScrollDom = targetScrollDom;
        this.scrollWrap = this.container;
        this.container.appendChild(this.toTopBtn);

        
        var hideTimer;
        var scroll = function() {
            var scrollTop = self.scrollWrap.scrollTop;
            
            if (self.container === document.body) {
                scrollTop = scrollTop || document.documentElement.scrollTop || 0;
            }
            
            if (scrollTop >= self.options.scrollTop) {
                if (!self.isShowToTopBtn) {
                    toTopBtn.classList.remove('common-fade-out');
                    toTopBtn.classList.remove('common-hidden');
                    toTopBtn.classList.add('common-fade-in');
                    self.isShowToTopBtn = true;
                }
                if (self.options.isHide) {
                    clearTimeout(hideTimer);
                    hideTimer = setTimeout(function() {
                        toTopBtn.classList.add('common-fade-out');
                        toTopBtn.classList.remove('common-fade-in');
                        self.isShowToTopBtn = false;
                    }, 2000);
                }
            } else if (self.isShowToTopBtn) {
                toTopBtn.classList.add('common-fade-out');
                toTopBtn.classList.remove('common-fade-in');
                self.isShowToTopBtn = false;
            }
        };

        targetScrollDom.addEventListener('scroll', debounce(scroll, 50));
        // targetScrollDom.addEventListener('scroll', scroll);
    };
    
    GoTop.prototype.scrollToTop = function(duration) {
        duration = duration || 0;
        
        var self = this;
        var scrollWrap = this.scrollWrap;
        var diff = scrollWrap.scrollTop;
        
        if (this.container === document.body && !diff) {
            // 兼容body时，而且scrolltop为0的情况，使用documentElement
            diff = document.documentElement.scrollTop || 0;
            scrollWrap = document.documentElement;
        }

        if (diff === 0 || duration === 0) {
            // 已经在顶部
            return;
        }

        // 每秒60帧，计算一共多少帧，然后每帧的步长
        var count = Math.floor(duration / (1000 / 60));
        var step = diff / count;
        var curr = 0;
        var execute = function() {
            if (curr < count) {
                if (curr === count - 1) {
                    // 最后一次直接设置y,避免计算误差
                    scrollWrap.scrollTop = 0;
                } else {
                    scrollWrap.scrollTop -= step;
                }
                curr += 1;
                requestAnimationFrame(execute);
            } else {
                scrollWrap.scrollTop = 0;
                self.isScrollTo = false;
            }
        };

        // 锁定状态
        this.isScrollTo = true;
        requestAnimationFrame(execute);
    };

    // 防抖函数
    function debounce(fn, duration) {
        var timer;
        var ctx = this;

        return function() {
            var args = arguments;

            clearTimeout(timer);
            timer = setTimeout(function() {
                fn.apply(ctx, args);
                // 防止循环引用
                ctx = null;
            }, duration);
        };
    }

    window.GoTop = GoTop;
})();