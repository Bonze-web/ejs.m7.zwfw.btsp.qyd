(function (M, $) {
  'use strict';

  var editorEl = document.getElementById('edit-selected'),
    btnCfmEl = document.getElementById('btn-confirm'),
    groupEl = document.getElementById('category-group');

  var $nav = $('#nav');

  var tplCategory = document.getElementById('tpl-category').innerHTML,
    tplContext = document.getElementById('tpl-context').innerHTML;

  // 已选集合
  var selected = [],
    storageId = null, // 树id
    storageData = null; // 树数据

  var rootName = '';

  Util.loadJs(function () {
    storageId = Util.getExtraDataByKey('id');
    storageData = JSON.parse(getStorage(storageId));
    rootName = Util.getExtraDataByKey('rootname') || '根';

    if (typeof storageId !== 'string') {
      Util.ejs.ui.toast('请传入 storageId');
      return;
    }

    // 初始化事件监听
    initListeners();
    // 处理已选数据
    handleSelectedData(storageData.text, storageData.value);
    // 处理树数据
    handleTreeData(storageData);
    // 设置定位导航
    $nav.html('<li class="nav-list-item" data-id="treeselectRoot">'+ rootName +'</li>');
  });

  /**
   * 初始化事件监听
   */
  function initListeners() {
    // 点击确定按钮
    btnCfmEl.addEventListener('tap', function () {

    });

    // 点击编辑已选人员
    editorEl.addEventListener('tap', function () {

    });

    // 点击顶部导航定位
    $nav.on('tap', '.nav-list-item', function () {

    });

    // TODO: 监听栏目
    $(groupEl).on('tap', '.category-title', function() {
      var $parent = $(this).parent();

      if (this.nextElementSibling.checked) {
        return;
      }

      // 添加顶部导航栏
      $nav.get(0).innerHTML += '<li class="nav-list-item" data-id="'+ $parent.data('id') +'">'+ $(this).text() +'</li>';
      // 清空列表
      clearGroup();
    })
      // 监听 checkbox 状态变化
      .on('change', 'input[type=checkbox]', function () {

      });
  }

  /**
   * 获取缓存数据
   * @param {String} id 缓存ID 
   * @retutns {String} 缓存数据
   */
  function getStorage(id) {
    return localStorage.getItem(id + '_comdto');
  }

  /**
   * 处理树数据
   * @param {Object} data tree data
   */
  function handleTreeData(data) {
    var _data = data.data;
    var item = '';

    _data.forEach(function (e) {
      var pid = e.pid;
      var isLeaf = e.isLeaf;

      if (pid == '' || pid == undefined) {
        // isLeaf 为 true 说明没有子节点了
        item += isLeaf ? M.render(tplContext, e) : M.render(tplCategory, e);
      }
    });

    groupEl.innerHTML = item;
  }

  /**
   * 删除已选数据
   */
  function delSelectedData() {
    
  }

  /**
   * 清空 groupEl 元素
   */
  function clearGroup() {
    groupEl.innerHTML = '';
  }

  /**
   * 处理已选数据
   * @param {String} text 已选数据返回的 text 
   * @param {String} value 已选数据返回的 value
   */
  function handleSelectedData(text, value) {
    if (value !== '') {
      value = value.split(',');
      text = text.split(',');
      btnCfmEl.innerHTML = '确定(' + value.length + ')';
      editorEl.classList.remove('hidden');

      value.forEach(function (e, i) {
        selected.push({
          value: e,
          text: text[i]
        });
      });
    }
  }
}(window.Mustache, window.Zepto));