(function($){
  var workTemplate
  var workThumbnailTemplate
  var resizeTimeout
  var currentMobileSize
  var $workContainer
  var data = {
    items: [{
        id: 'cadbury',
        name: 'Cadbury',
        summary: 'Design, UI, Social Media, Responsive site',
        description: 'I’ve worked at Comic Relief over the past 3 years on Sport Relief 2012 and 2014 and a Red Nose Day 2013. My work has been prodeminantly on the giving platforms where I’ve been the lead designer. The projects are agile and I worked closely with the developers, projects mangers and marketing as well as the in house design team.',
        totalImages: 2
      }, {
        id: 'itv',
        name: 'ITV',
        summary: 'Design, UI, Social Media, Responsive site',
        description: 'I’ve worked at Comic Relief over the past 3 years on Sport Relief 2012 and 2014 and a Red Nose Day 2013. My work has been prodeminantly on the giving platforms where I’ve been the lead designer. The projects are agile and I worked closely with the developers, projects mangers and marketing as well as the in house design team',
        totalImages: 2 
      }, {
        id: 'silver-spoon',
        name: 'Silver Spoon',
        summary: 'Concepts, Design, UI, UX, Layout',
        description: 'I got the chance to design the new Silver Spoon site while freelancing at CMW.',
        totalImages: 2
      }, {
        id: 'boomerang',
        name: 'Boomerang',
        summary: 'Design, UI, Social Meida, Responsive site',
        description: 'I’ve worked at Comic Relief over the past 3 years on Sport Relief 2012 and 2014 and a Red Nose Day 2013. My work has been prodeminantly on the giving platforms where I’ve been the lead designer. The projects are agile and I worked closely with the developers, projects mangers and marketing as well as the in house design team.',
        totalImages: 2
      }, {
        id: 'stylist',
        name: 'Stylist',
        summary: 'Design, UI, UX, Wireframes, Layout',
        description: 'In 2010 I was lucky enough to work on the Stylist website as lead designer while working full time at Clock. Taking inspiration from the magazine, I put together the homepage, article and video pages, once those were designed the rest of the site was taken from these templates. The site was briefed to be like an online version of the printed magazine, clean and friendly with a strong fashion edge. The site is still being used today.',
        totalImages: 2 
      }, {
        id: 'archive',
        name: 'From the Archive',
        summary: 'Design, Illustration, Concepts',
        description: 'During my time working at my first job with Real 451 I got to work on various projects for TFL. We were asked to design the Oystercard welcome screens for the underground. They had to be fairly abstract but show an element of movement and colours you associate with the underground network. They ended up using these 3 of my designs.',
        totalImages: 3 
      }, /*{
        id: 'just-for-laughts',
        name: 'Just for Laughs',
        summary: 'Concepts, Design, Layout, Typography',
        description: 'While working at Clock I worked on an open brief to design Just for Laughs’ main website. I went down the route of a comedy poster and',
        totalImages: 3 
      }, */{
        id: 'ocado',
        name: 'Ocado',
        summary: 'Design, UI, Social Media, Emails, Concepts',
        description: 'I was freelancing with Ocado for 5 months. During that time I worked on a number of projects including a marketing campaign for the spring cleaning event. That involved creating concepts and then working up the chosen idea and expanding it across the site- emails, social media, backgrounds, etc. I also made numerous emails, I create the weekly newsletter which really allowed creative freedom.',
        totalImages: 4 
      }, {
        id: 'comic-relief',
        name: 'Design, UI, Social Meida, Responsive site',
        summary: 'Design, UI, UX, Wireframes, Layout',
        description: 'I’ve worked at Comic Relief over the past 3 years on Sport Relief 2012 and 2014 and a Red Nose Day 2013. My work has been predeminantly on the giving platforms where I’ve been the lead designer. Working in an Agile team I was in constant contact with the developers, projects mangers and marketing as well as the in house design team. Other projects there included email design, banners and pages for the main site.',
        totalImages: 4 
      }, {
        id: 'yeyah',
        name: 'Yeyah',
        summary: 'Design, Print, Illustration, Branding',
        description: 'I’ve worked at Comic Relief over the past 3 years on Sport Relief 2012 and 2014 and a Red Nose Day 2013. My work has been prodeminantly on the giving platforms where I’ve been the lead designer. The projects are agile and I worked closely with the developers, projects mangers and marketing as well as the in house design team.',
        totalImages: 4 
      }, {
        id: 'asos',
        name: 'ASOS',
        summary: 'Design, Print, Illustration, Branding',
        description: 'I’ve worked at Comic Relief over the past 3 years on Sport Relief 2012 and 2014 and a Red Nose Day 2013. My work has been prodeminantly on the giving platforms where I’ve been the lead designer. The projects are agile and I worked closely with the developers, projects mangers and marketing as well as the in house design team. ',
        totalImages: 2 
      }, {
        id: 'halloween',
        name: 'Halloween Flyers and Poster',
        summary: 'Design, Print, Illustration',
        description: 'I’ve worked at Comic Relief over the past 3 years on Sport Relief 2012 and 2014 and a Red Nose Day 2013. My work has been prodeminantly on the giving platforms where I’ve been the lead designer. The projects are agile and I worked closely with the developers, projects mangers and marketing as well as the in house design team. ',
        totalImages: 2 
      }
    ]
  }
  
  $(document).ready(function() {
    console.log('Ready')
    init()
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
    for (var i = 0; i < data.items.length; i++) {    
      item = data.items[i]
      item.images = []
      for (var j = 0; j < item.totalImages; j++) {
        item.images.push('/images/' + item.id + '/' + (j + 1) + '.jpg')
      }
      item.imagePath = item.images[0]
    }
    console.log('Init image paths:', data.items)
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

    var rows = Math.ceil(data.items.length / 3)
    console.log('Thumbnail rows: ' + rows)
    for (var row = 1; row <= rows; row++) {
      $row = getRowView(data.items.slice((row -1) * 3, row * 3))
      $workContainer.append($row)
    }

  }

  function renderMobileView() {
    console.log('Render mobile view')
    loadWorkTemplate()
    var $container = $(document.createDocumentFragment())
    var item
    for (var i = 0; i < data.items.length; i++) {
      item = data.items[i]
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
    var selectedWork = $thumbnail.attr('data-work')
    var work
    for (var i = 0; i < data.items.length; i++) {
      if (data.items[i].id === selectedWork) {
        work = data.items[i]
        break
      }
    }

    console.log(selectedWork + ' selected')
    console.log(work)
    $('.work').remove()
    $row.after(getWorkItemView(work))
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
    for (var i = 0; i < data.items.length; i++) {
      item = data.items[i]
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
    for (var i = 0; i < data.items.length; i++) {
      item = data.items[i]
      console.log('item', item)
      thumbLocation = '/images/' + data.items[i].id + '/1.jpg'
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
    $workContainer.find(loadingSelector).removeClass('loading')
    
    loadNextAsset(assetsToLoad, type)
  }
}(jQuery))
