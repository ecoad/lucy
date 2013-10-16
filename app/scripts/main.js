(function($){
  var workTemplate;
  var resizeTimeout;
  var currentMobileSize;
  var data = {
    items: [{
        id: 'itv',
        name: 'ITV',
        description: 'I worked on a short contract with ITV and produced some illustrative social media graphics for ITV3 and ITV4',
        totalImages: 4 
      }, {
        id: 'comic-relief',
        name: 'Comic Relief',
        description: 'I worked on a short contract...',
        totalImages: 3 
      }
    ]
  };
  
  $(document).ready(function() {
    console.log('Ready');
    init();
  });

  function init() {
    console.log('Init');
    initImagePaths();
    setup();
    setupListeners();
  }

  function setupListeners() {
    $(window).bind('main-breakpoint-change', onMainBreakpointChange);
    $(window).resize(function() {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = setTimeout(onResize, 50);
    });
  }

  function onResize() {
    console.log('Resize');
    var mobileSize = isMobileSize();
    if ((mobileSize && !currentMobileSize) || (!mobileSize && currentMobileSize)) {
      onMainBreakpointChange();
    }
  }

  function initImagePaths() {
    var item;
    for (var i = 0; i < data.items.length; i++) {    
      item = data.items[i];
      item.images = [];
      for (var j = 0; j < item.totalImages; j++) {
        item.images.push('/images/' + item.id + '/' + (j + 1) + '.jpg');
      }
    }
    console.log('Init image paths:', data.items);
  }

  function setup() {
    $('#work').empty();
    console.log('Setup');
    currentMobileSize = isMobileSize();
    if (currentMobileSize) {
      console.log('Mobile view');
      loadMobileAssets();
      setupMobileDOM();
    } else {
      console.log('Desktop view');
      loadMainAssets();
      setupMainDOM();
    }
  }

  function isMobileSize() {
    return $(window).width() <= 320;
  }

  function onMainBreakpointChange() {
    console.log('Main breakpoint change');
    setup();
  }

  function setupMainDOM() {
    console.log('Setup DOM');    
  }

  function setupMobileDOM() {
    console.log('Setup Mobile DOM');    
  }

  function loadMainAssets() {
    console.log('Load');
    var item;
    var assetsToLoad = [];
    var thumbLocation;
    for (var i = 0; i < data.items.length; i++) {
      thumbLocation = '/images/' + data.items[i].id + '/thumb.jpg';
      assetsToLoad.push(thumbLocation);
    }
    console.log('Assets to load:');
    console.log(assetsToLoad);

    loadNextAsset(assetsToLoad, assetsToLoad.length, renderLoader, renderMainView);
  }

  function loadMobileAssets() {
    console.log('Load');
    var item;
    var assetsToLoad = [];
    var imageLocation;
    for (var i = 0; i < data.items.length; i++) {
      imageLocation = data.items[i].images[0];
      assetsToLoad.push(imageLocation);
    }
    console.log('Assets to load:');
    console.log(assetsToLoad);

    loadNextAsset(assetsToLoad, assetsToLoad.length, renderLoader, renderMobileView);
  }

  function renderLoader(percentage) {
    console.log('Loader update: ' + percentage);
  }

  function renderMainView() {
    console.log('Render main view');
  }

  function renderMobileView() {
    console.log('Render mobile view');
    loadWorkTemplate();
    var $container = $(document.createDocumentFragment());
    var item;
    for (var i = 0; i < data.items.length; i++) {
      item = data.items[i];
      item.imagePath = item.images[0];
      $container.append(getWorkItemView(item));
    }

    console.log('Append', $container);
    $('#work').append($container);
  }

  function getWorkItemView(work) {
    console.log('Get work item view', work);
    var $view = $(Mustache.render(workTemplate, work));
    return $view;
  }

  function loadWorkTemplate() {
    if (workTemplate) {
      return;
    }
    console.log('Load work template');
    workTemplate = $('#template-work').html();
  }

  function loadNextAsset(assetsToLoad, assetsTotal, onAssetLoad, onAllAssetsLoad) {
    if (assetsToLoad.length === 0) {
      onAllAssetsLoad();
      return;  
    }

    var nextToLoad = assetsToLoad[0];
    console.log('Next to load: ' + nextToLoad);
    var image = new Image();
    image.onload = function() {
      assetLoaded(assetsToLoad, assetsTotal, onAssetLoad, onAllAssetsLoad);
    };
    image.src = nextToLoad;
  }

  function assetLoaded(assetsToLoad, assetsTotal, onAssetLoad, onAllAssetsLoad) {
    var loadedAsset = assetsToLoad.shift();
    console.log('Asset loaded: ' + loadedAsset);
    onAssetLoad(1 - (assetsToLoad.length / assetsTotal));
    loadNextAsset(assetsToLoad, assetsTotal, onAssetLoad, onAllAssetsLoad);
  }
}(jQuery));
