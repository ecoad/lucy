(function($){
  var workTemplate
  var workThumbnailTemplate
  var resizeTimeout
  var currentMobileSize
  var $workContainer
  var items = []
  
  $(document).ready(function() {
    $.getJSON('http://backstage.io.shortlistmedia.co.uk/elliot-personal', function(data) {
      for (var i in data) {
        items.push(data[i])
      }
      init()
    })
  })

  function init() {
    console.log('Init')
    $workContainer = $('#work')
    initImagePaths()
    setup()
    setupListeners()
  }

  function setupListeners() {
    $(window).bind('main-breakpoint-change', onMainBreakpointChange)
    $(window).resize(function() {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }

      resizeTimeout = setTimeout(onResize, 50)
    })
  }

  function onResize() {
    console.log('Resize')
    var mobileSize = isMobileSize()
    if ((mobileSize && !currentMobileSize) || (!mobileSize && currentMobileSize)) {
      onMainBreakpointChange()
    }
  }

  function initImagePaths() {
    var item
    for (var i = 0; i < items.length; i++) {    
      item = items[i]
      item.images = []
      for (var j = 0; j < item.totalImages; j++) {
        item.images.push('/images/' + item.id + '/' + (j + 1) + '.jpg')
      }
      item.imagePath = item.images[0]
    }
    console.log('Init image paths:', items)
  }

  function setup() {
    $('#work').empty()
    console.log('Setup')
    currentMobileSize = isMobileSize()
    if (currentMobileSize) {
      console.log('Mobile view')
      loadMobileAssets()
      renderMobileView()
    } else {
      console.log('Desktop view')
      loadMainAssets()
      renderMainView()
    }
  }

  function isMobileSize() {
    return $(window).width() < 720
  }

  function onMainBreakpointChange() {
    console.log('Main breakpoint change')
    setup()
  }

  function renderMainView() {
    console.log('Render main view')
    loadWorkThumbnailTemplate()
    loadWorkTemplate()

    var rows = Math.ceil(items.length / 3)
    console.log('Thumbnail rows: ' + rows)
    for (var row = 1; row <= rows; row++) {
      $row = getRowView(items.slice((row -1) * 3, row * 3))
      $workContainer.append($row)
    }

  }

  function renderMobileView() {
    console.log('Render mobile view')
    loadWorkTemplate()
    var $container = $(document.createDocumentFragment())
    var item
    for (var i = 0; i < items.length; i++) {
      item = items[i]
      $container.append(getWorkItemView(item))
    }

    console.log('Append', $container)
    $('#work').append($container)
  }

  function getRowView(items) {
    console.log('Get row view', items)
    var item
    var $fragment = $(document.createDocumentFragment())
    var $row = $('<div />').addClass('row clearfix')
    $fragment.append($row)

    for (var i = 0; i < items.length; i++) {
      item = items[i]
      item.thumbPath = '/images/' + item.id + '/thumb.jpg'
      $thumbnail = $(Mustache.render(workThumbnailTemplate, item))
      $thumbnail.click(onThumbnailClick)
      $row.append($thumbnail)
    }

    return $fragment
  }

  function getWorkItemView(work) {
    console.log('Get work item view', work)
    var $view = $(Mustache.render(workTemplate, work))
    $view.find('a.select-image').click(onImageSelectorClick)
    $view.find('.image-selector li:first-child').addClass('selected')
    return $view
  }

  function onThumbnailClick(event) {
    var $thumbnail = $(event.currentTarget)
    var $row = $thumbnail.parents('.row')
    // $("html, body").animate({ scrollTop: $row.offset().top + "px" });
    var selectedWork = $thumbnail.attr('data-work')
    var work
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === selectedWork) {
        work = items[i]
        break
      }
    }

    console.log(selectedWork + ' selected')
    console.log(work)
    $('.work').remove()
    $row.after(getWorkItemView(work))
    loadNextAsset([{imageLocation: '/images/' + work.id + '/1.jpg', item: work}], 'work')
  }

  function onImageSelectorClick(event) {
    event.preventDefault()
    console.log(event.currentTarget)
    var $link = $(event.currentTarget)
		$link.parents('ul').children('li').removeClass('selected')
    $link.parents('li').addClass('selected')
    var $img = $link.parents('.work').find('img')
    var imagePath = $link.attr('href')
    console.log(imagePath)
    $img.attr('src', imagePath)
  }

  function loadWorkTemplate() {
    if (workTemplate) {
      return
    }
    console.log('Load work template')
    workTemplate = $('#template-work').html()
  }

  function loadWorkThumbnailTemplate() {
    if (workThumbnailTemplate) {
      return
    }
    console.log('Load work thumbnail template')
    workThumbnailTemplate = $('#template-work-thumbnail').html()
  }

  function loadMobileAssets() {
    console.log('Load mobile assets')
    var item
    var assetsToLoad = []
    var imageLocation
    for (var i = 0; i < items.length; i++) {
      item = items[i]
      imageLocation = item.images[0]
      assetsToLoad.push({imageLocation: imageLocation, item: item})
    }
    console.log('Assets to load:')
    console.log(assetsToLoad)

    loadNextAsset(assetsToLoad, 'work')
  }

  function loadMainAssets() {
    console.log('Load main assets')
    var item
    var assetsToLoad = []
    var thumbLocation
    for (var i = 0; i < items.length; i++) {
      item = items[i]
      console.log('item', item)
      thumbLocation = '/images/' + items[i].id + '/thumb.jpg'
      assetsToLoad.push({imageLocation: thumbLocation, item: item})
    }
    console.log('Assets to load:')
    console.log(assetsToLoad)

    loadNextAsset(assetsToLoad, 'thumbnail')
  }

  function loadNextAsset(assetsToLoad, type) {

    if (assetsToLoad.length === 0) {
      return  
    }

    var nextToLoad = assetsToLoad[0]
    console.log('Next to load: ', nextToLoad)
    var image = new Image()
    image.onload = function() {
      assetLoaded(assetsToLoad, type)
    }
    image.src = nextToLoad.imageLocation
  }

  function assetLoaded(assetsToLoad, type) {
    var assetToLoad = assetsToLoad.shift()
    console.log('Asset loaded', assetToLoad)
    var loadingSelector = '.' + type + '.' + assetToLoad.item.id;
    var $work = $workContainer.find(loadingSelector)
    $work.removeClass('loading')
    $img = $work.find('img[data-src]')
    $img.attr('src', $img.data('src'))
    
    loadNextAsset(assetsToLoad, type)
  }
}(jQuery))
