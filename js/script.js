"use strict";

(function () {
  /**
   * Global variables
   */

  var userAgent = navigator.userAgent.toLowerCase(),
    initialDate = new Date(),

    $window = $(window),
    $document = $(document),
    $html = $('html'),

    isDesktop = $html.hasClass("desktop"),
    isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    plugins = {
      materialParallax: $(".material-parallax"),
      copyrightYear: $(".copyright-year"),
      search: $('.search-form'),
      rdGoogleMaps: $(".rd-google-map"),
      responsiveTabs: $('.responsive-tabs'),
      rdNavbar: $('.rd-navbar'),
      swiperSlider: $(".swiper-slider"),
      gallerySwiper: $('.swiper-container'),
      progressBar: $(".progress-bar-custom"),
      counterCustom: $('.counter'),
      progressBarLinear: $('.progress-bar'),
      tooltipCustom: $('[data-toggle="tooltip"]'),
      owlCarousel: $('.owl-carousel'),
      svgPhone: $('#svg-phone_1'),
      viewAnimate: $('.view-animate'),
      scrollToCustom: $('.questions'),
      rdSearch: $('.rd-navbar-search'),
      dateCountdown: $('#DateCountdown'),
      galleryItem: $('[data-lightbox]').not('[data-lightbox="gallery"] [data-lightbox]'),
      galleryGroup: $('[data-lightbox^="gallery"]'),
      isotopeCustom: $(".isotope"),
      timeLine: $('.timeline'),
      selectFilter: $("select"),

      rdMailForm: $(".rd-mailform"),
      rdInputLabel: $(".form-label"),
      regula: $("[data-constraints]"),
      radio: $("input[type='radio']"),
      checkbox: $("input[type='checkbox']"),
      captcha: $('.recaptcha')
    };

  $document.ready(function () {
    var isNoviBuilder = window.xMode;

    /**
     * getSwiperHeight
     * @description  calculate the height of swiper slider basing on data attr
     */
    function getSwiperHeight(object, attr) {
      var val = object.attr("data-" + attr),
        dim;

      if (!val) {
        return undefined;
      }

      dim = val.match(/(px)|(%)|(vh)$/i);

      if (dim.length) {
        switch (dim[0]) {
          case "px":
            return parseFloat(val);
          case "vh":
            return $window.height() * (parseFloat(val) / 100);
          case "%":
            return object.width() * (parseFloat(val) / 100);
        }
      } else {
        return undefined;
      }
    }

    /**
     * toggleSwiperInnerVideos
     * @description  toggle swiper videos on active slides
     */
    function toggleSwiperInnerVideos(swiper) {
      var prevSlide = $(swiper.slides[swiper.previousIndex]),
        nextSlide = $(swiper.slides[swiper.activeIndex]),
        videos,
        videoItems = prevSlide.find("video");

      for (i = 0; i < videoItems.length; i++) {
        videoItems[i].pause();
      }

      videos = nextSlide.find("video");
      if (videos.length) {
        videos.get(0).play();
      }
    }

    /**
     * toggleSwiperCaptionAnimation
     * @description  toggle swiper animations on active slides
     */
    function toggleSwiperCaptionAnimation(swiper) {
      var prevSlide = $(swiper.container).find("[data-caption-animate]"),
        nextSlide = $(swiper.slides[swiper.activeIndex]).find("[data-caption-animate]"),
        delay,
        duration,
        nextSlideItem,
        prevSlideItem;

      for (i = 0; i < prevSlide.length; i++) {
        prevSlideItem = $(prevSlide[i]);

        prevSlideItem.removeClass("animated")
          .removeClass(prevSlideItem.attr("data-caption-animate"))
          .addClass("not-animated");
      }


      var tempFunction = function (nextSlideItem, duration) {
        return function () {
          nextSlideItem
            .removeClass("not-animated")
            .addClass(nextSlideItem.attr("data-caption-animate"))
            .addClass("animated");
          if (duration) {
            nextSlideItem.css('animation-duration', duration + 'ms');
          }
        };
      };

      for (i = 0; i < nextSlide.length; i++) {
        nextSlideItem = $(nextSlide[i]);
        delay = nextSlideItem.attr("data-caption-delay");
        duration = nextSlideItem.attr('data-caption-duration');
        setTimeout(tempFunction(nextSlideItem, duration), delay ? parseInt(delay, 10) : 0);
      }
    }

    // isScrolledIntoView
    function isScrolledIntoView(elem) {
      if (!isNoviBuilder) {
        return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
      }
      else {
        return true;
      }
    }

    // initOnView
    function lazyInit(element, func) {
      var $win = jQuery(window);
      $win.on('load scroll', function () {
        if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
          func.call();
          element.addClass('lazy-loaded');
        }
      });
    }

    // attachFormValidator
    function attachFormValidator(elements) {
      for (var i = 0; i < elements.length; i++) {
        var o = $(elements[i]), v;
        o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
        v = o.parent().find(".form-validation");
        if (v.is(":last-child")) {
          o.addClass("form-control-last-child");
        }
      }

      elements
        .on('input change propertychange blur', function (e) {
          var $this = $(this), results;

          if (e.type != "blur") {
            if (!$this.parent().hasClass("has-error")) {
              return;
            }
          }

          if ($this.parents('.rd-mailform').hasClass('success')) {
            return;
          }

          if ((results = $this.regula('validate')).length) {
            for (i = 0; i < results.length; i++) {
              $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")
            }
          } else {
            $this.siblings(".form-validation").text("").parent().removeClass("has-error")
          }
        })
        .regula('bind');

      var regularConstraintsMessages = [
        {
          type: regula.Constraint.Required,
          newMessage: "The text field is required."
        },
        {
          type: regula.Constraint.Email,
          newMessage: "The email is not a valid email."
        },
        {
          type: regula.Constraint.Numeric,
          newMessage: "Only numbers are required"
        },
        {
          type: regula.Constraint.Selected,
          newMessage: "Please choose an option."
        }
      ];


      for (var i = 0; i < regularConstraintsMessages.length; i++) {
        var regularConstraint = regularConstraintsMessages[i];

        regula.override({
          constraintType: regularConstraint.type,
          defaultMessage: regularConstraint.newMessage
        });
      }
    }


    // validateReCaptcha
    function validateReCaptcha(captcha) {
      var $captchaToken = captcha.find('.g-recaptcha-response').val();

      if ($captchaToken == '') {
        captcha
          .siblings('.form-validation')
          .html('Please, prove that you are not robot.')
          .addClass('active');
        captcha
          .closest('.form-group')
          .addClass('has-error');

        captcha.on('propertychange', function () {
          var $this = $(this),
            $captchaToken = $this.find('.g-recaptcha-response').val();

          if ($captchaToken != '') {
            $this
              .closest('.form-group')
              .removeClass('has-error');
            $this
              .siblings('.form-validation')
              .removeClass('active')
              .html('');
            $this.off('propertychange');
          }
        });

        return false;
      }

      return true;
    }

    // isValidated
    function isValidated(elements, captcha) {
      var results, errors = 0;

      if (elements.length) {
        for (j = 0; j < elements.length; j++) {

          var $input = $(elements[j]);
          if ((results = $input.regula('validate')).length) {
            for (k = 0; k < results.length; k++) {
              errors++;
              $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
            }
          } else {
            $input.siblings(".form-validation").text("").parent().removeClass("has-error")
          }
        }

        if (captcha) {
          if (captcha.length) {
            return validateReCaptcha(captcha) && errors == 0
          }
        }

        return errors == 0;
      }
      return true;
    }


    // onloadCaptchaCallback
    window.onloadCaptchaCallback = function () {
      for (i = 0; i < plugins.captcha.length; i++) {
        var $capthcaItem = $(plugins.captcha[i]);

        grecaptcha.render(
          $capthcaItem.attr('id'),
          {
            sitekey: $capthcaItem.attr('data-sitekey'),
            size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
            theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
            callback: function (e) {
              $('.recaptcha').trigger('propertychange');
            }
          }
        );
        $capthcaItem.after("<span class='form-validation'></span>");
      }
    };

    /**
     * IE Polyfills
     * @description  Adds some loosing functionality to IE browsers
     */
    if (isIE) {
      if (isIE < 10) {
        $html.addClass("lt-ie10");
      }

      if (isIE < 11) {
        if (plugins.pointerEvents) {
          $.getScript(plugins.pointerEvents)
            .done(function () {
              $html.addClass("lt-ie11");
              PointerEventsPolyfill.initialize({});
            });
        }
      }

      if (isIE === 11) {
        $("html").addClass("ie-11");
      }

      if (isIE === 12) {
        $("html").addClass("ie-edge");
      }
    }


    /**
     * @module       ToTop
     * @description  Enables ToTop Plugin
     */
    if (!isNoviBuilder && isDesktop) {
      $().UItoTop({
        easingType: 'easeOutQuart',
        containerClass: 'ui-to-top fl-bigmug-line-up107'
      });
    }


    /**
     * @module       WOW Animation
     * @description  Enables scroll animation on the page
     */
    if (!isNoviBuilder && isDesktop && $html.hasClass("wow-animation") && $(".wow").length) {
      new WOW().init();
    }


    /**
     * @module       Copyright
     * @description  Evaluates the copyright year
     */
    if (plugins.copyrightYear.length) {
      plugins.copyrightYear.text(initialDate.getFullYear());
    }

    /**
     * @module       Responsive Tabs
     * @description  Enables Easy Responsive Tabs Plugin
     */
    if (plugins.responsiveTabs.length > 0) {
      plugins.responsiveTabs.each(function () {
        var $this = $(this);
        $this.easyResponsiveTabs({
          type: $this.attr("data-type") === "accordion" ? "accordion" : "default"
        });
      })
    }

    /**
     * @module       RD Google Map
     * @description  Enables RD Google Map Plugin
     */
    if (plugins.rdGoogleMaps.length) {
      var i;

      $.getScript("//maps.google.com/maps/api/js?key=AIzaSyAwH60q5rWrS8bXwpkZwZwhw9Bw0pqKTZM&sensor=false&libraries=geometry,places&v=3.7", function () {
        var head = document.getElementsByTagName('head')[0],
          insertBefore = head.insertBefore;

        head.insertBefore = function (newElement, referenceElement) {
          if (newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') != -1 || newElement.innerHTML.indexOf('gm-style') != -1) {
            return;
          }
          insertBefore.call(head, newElement, referenceElement);
        };

        for (i = 0; i < plugins.rdGoogleMaps.length; i++) {

          var $googleMapItem = $(plugins.rdGoogleMaps[i]);

          lazyInit($googleMapItem, $.proxy(function () {
            var $this = $(this),
              styles = $this.attr("data-styles");

            $this.googleMap({
              marker: {
                basic: $this.data('marker'),
                active: $this.data('marker-active')
              },
              styles: styles ? JSON.parse(styles) : [],
              onInit: function (map) {
                var inputAddress = $('#rd-google-map-address');


                if (inputAddress.length) {
                  var input = inputAddress;
                  var geocoder = new google.maps.Geocoder();
                  var marker = new google.maps.Marker(
                    {
                      map: map,
                      icon: $this.data('marker-url'),
                    }
                  );

                  var autocomplete = new google.maps.places.Autocomplete(inputAddress[0]);
                  autocomplete.bindTo('bounds', map);
                  inputAddress.attr('placeholder', '');
                  inputAddress.on('change', function () {
                    $("#rd-google-map-address-submit").trigger('click');
                  });
                  inputAddress.on('keydown', function (e) {
                    if (e.keyCode == 13) {
                      $("#rd-google-map-address-submit").trigger('click');
                    }
                  });


                  $("#rd-google-map-address-submit").on('click', function (e) {
                    e.preventDefault();
                    var address = input.val();
                    geocoder.geocode({'address': address}, function (results, status) {
                      if (status == google.maps.GeocoderStatus.OK) {
                        var latitude = results[0].geometry.location.lat();
                        var longitude = results[0].geometry.location.lng();

                        map.setCenter(new google.maps.LatLng(
                          parseFloat(latitude),
                          parseFloat(longitude)
                        ));
                        marker.setPosition(new google.maps.LatLng(
                          parseFloat(latitude),
                          parseFloat(longitude)
                        ))
                      }
                    });
                  });
                }
              }
            });
          }, $googleMapItem));
        }
      });
    }

    /**
     * @module       Swiper Slider
     * @description  Enables Swiper Plugin
     */
    if (plugins.swiperSlider.length) {
      plugins.swiperSlider.each(function () {
        var s = $(this);

        var pag = s.find(".swiper-pagination"),
          next = s.find(".swiper-button-next"),
          prev = s.find(".swiper-button-prev"),
          bar = s.find(".swiper-scrollbar"),
          h = getSwiperHeight(plugins.swiperSlider, "height"), mh = getSwiperHeight(plugins.swiperSlider, "min-height");
        s.find(".swiper-slide")
          .each(function () {
            var $this = $(this),
              url;
            if (url = $this.attr("data-slide-bg")) {
              $this.css({
                "background-image": "url(" + url + ")",
                "background-size": "cover"
              })
            }
          })
          .end()
          .find("[data-caption-animate]")
          .addClass("not-animated")
          .end()
          .swiper({
            autoplay: s.attr('data-autoplay') ? s.attr('data-autoplay') === "false" ? undefined : s.attr('data-autoplay') : 5000,
            direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",
            effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "slide",
            speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 600,
            keyboardControl: s.attr('data-keyboard') === "true",
            mousewheelControl: s.attr('data-mousewheel') === "true",
            mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",
            nextButton: next.length ? next.get(0) : null,
            prevButton: prev.length ? prev.get(0) : null,
            pagination: pag.length ? pag.get(0) : null,
            //allowSwipeToNext: false,
            //allowSwipeToPrev: false,
            paginationClickable: pag.length ? pag.attr("data-clickable") !== "false" : false,
            paginationBulletRender: pag.length ? pag.attr("data-index-bullet") === "true" ? function (index, className) {
              return '<span class="' + className + '">' + (index + 1) + '</span>';
            } : null : null,
            scrollbar: bar.length ? bar.get(0) : null,
            scrollbarDraggable: bar.length ? bar.attr("data-draggable") !== "false" : true,
            scrollbarHide: bar.length ? bar.attr("data-draggable") === "false" : false,
            loop: s.attr('data-loop') !== "false",
            simulateTouch: false,
            threshold: 2000,
            onTransitionStart: function (swiper) {
              toggleSwiperInnerVideos(swiper);
            },
            onTransitionEnd: function (swiper) {
              toggleSwiperCaptionAnimation(swiper);
            },
            onInit: function (swiper) {
              toggleSwiperInnerVideos(swiper);
              toggleSwiperCaptionAnimation(swiper);
            }
          });

        $(window)
          .on("resize", function () {
            var mh = getSwiperHeight(s, "min-height"),
              h = getSwiperHeight(s, "height");
            if (h) {
              s.css("height", mh ? mh > h ? mh : h : h);
            }
          })
          .trigger("resize");
      });

    }

    // Gallery init

    if (plugins.gallerySwiper.length) {

      var galleryTop = new Swiper('.gallery-top', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 10
      });

      var galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true
      });

      galleryTop.params.control = galleryThumbs;
      galleryThumbs.params.control = galleryTop;
      //galleryThumbs.slideTo( $('.first-el').index(),1000,false );
      $(".first-el").click(function () {
        var v = $(this).index();
        galleryThumbs.slideTo(v, 1000, false);
      });
      $('.first-el').click();

    }
    // End Gallery init

    /**
     * @module       Progress Bar custom
     * @description  Enables Progress Bar Plugin
     */
    if (plugins.progressBar.length) {
      plugins.progressBar.each(function () {
        var bar, type;
        if (
          this.className.indexOf("progress-bar-horizontal") > -1
        ) {
          type = 'Line';
        }

        if (
          this.className.indexOf("progress-bar-radial") > -1
        ) {
          type = 'Circle';
        }

        if (this.getAttribute("data-stroke") && this.getAttribute("data-value") && type) {
          //console.log(this.offsetWidth);
          //console.log(parseFloat(this.getAttribute("data-stroke")) / this.offsetWidth * 100);
          bar = new ProgressBar[type](this, {
            strokeWidth: Math.round(parseFloat(this.getAttribute("data-stroke")) / this.offsetWidth * 100)
            ,
            trailWidth: this.getAttribute("data-trail") ? Math.round(parseFloat(this.getAttribute("data-trail")) / this.offsetWidth * 100) : 0
            ,
            text: {
              value: this.getAttribute("data-counter") === "true" ? '0' : null
              , className: 'progress-bar__body'
              , style: null
            }
          });

          bar.svg.setAttribute('preserveAspectRatio', "none meet");
          if (type === 'Line') {
            bar.svg.setAttributeNS(null, "height", this.getAttribute("data-stroke"));
          }

          bar.path.removeAttribute("stroke");
          bar.path.className.baseVal = "progress-bar__stroke";
          if (bar.trail) {
            bar.trail.removeAttribute("stroke");
            bar.trail.className.baseVal = "progress-bar__trail";
          }

          if (this.getAttribute("data-easing") && !isIE) {
            $(document)
              .on("scroll", $.proxy(function () {
                //console.log(isScrolledIntoView(this));
                if (isScrolledIntoView($(this)) && this.className.indexOf("progress-bar--animated") === -1) {
                  console.log(1);
                  this.className += " progress-bar--animated";
                  bar.animate(parseInt(this.getAttribute("data-value")) / 100.0, {
                    easing: this.getAttribute("data-easing")
                    ,
                    duration: this.getAttribute("data-duration") ? parseInt(this.getAttribute("data-duration")) : 800
                    ,
                    step: function (state, b) {
                      if (b._container.className.indexOf("progress-bar-horizontal") > -1 ||
                        b._container.className.indexOf("progress-bar-vertical") > -1) {
                        b.text.style.width = Math.abs(b.value() * 100).toFixed(0) + "%"
                      }
                      b.setText(Math.abs(b.value() * 100).toFixed(0));
                    }
                  });
                }
              }, this))
              .trigger("scroll");
          } else {
            bar.set(parseInt(this.getAttribute("data-value")) / 100.0);
            bar.setText(this.getAttribute("data-value"));
            if (type === 'Line') {
              bar.text.style.width = parseInt(this.getAttribute("data-value")) + "%";
            }
          }
        } else {
          console.error(this.className + ": progress bar type is not defined");
        }
      });
    }

    /**
     * @module       RD Navbar
     * @description  Enables RD Navbar Plugin
     */
    if (plugins.rdNavbar.length) {
      for (i = 0; i < plugins.rdNavbar.length; i++) {
        var $currentNavbar = $(plugins.rdNavbar[i]);
        $currentNavbar.RDNavbar({
          stickUpClone: ($currentNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? $currentNavbar.attr("data-stick-up-clone") === 'true' : false,
          responsive: {
            0: {
              stickUp: (!isNoviBuilder) ? $currentNavbar.attr("data-stick-up") === 'true' : false
            },
            768: {
              stickUp: (!isNoviBuilder) ? $currentNavbar.attr("data-sm-stick-up") === 'true' : false
            },
            992: {
              stickUp: (!isNoviBuilder) ? $currentNavbar.attr("data-md-stick-up") === 'true' : false
            },
            1200: {
              stickUp: (!isNoviBuilder) ? $currentNavbar.attr("data-lg-stick-up") === 'true' : false
            }
          },
          callbacks: {
            onStuck: function () {
              var navbarSearch = this.$element.find('.rd-search input');

              if (navbarSearch) {
                navbarSearch.val('').trigger('propertychange');
              }
            },
            onUnstuck: function () {
              if (this.$clone === null)
                return;

              var navbarSearch = this.$clone.find('.rd-search input');

              if (navbarSearch) {
                navbarSearch.val('').trigger('propertychange');
                navbarSearch.blur();
              }
            },
            onDropdownOver: function(){
              return !isNoviBuilder;
            }
          }
        });
        if (plugins.rdNavbar.attr("data-body-class")) {
          document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
        }
      }
    }

    /**
     * @module       Count To
     * @description  Enables Count To Plugin
     */
    if (plugins.counterCustom.length > 0) {
      $(document)
      //$(this).scroll(function () {
        .on("scroll", $.proxy(function () {
          plugins.counterCustom.not('.animated').each(function () {
            var $this = $(this);
            var position = $this.offset().top;

            if (($(window).scrollTop() + $(window).height()) > position) {

              $this.countTo();
              $this.addClass('animated');
            }
          });
        }, $(this)))
        .trigger("scroll");
    }

    /**
     * @module      Progress Horizontal Bootstrap
     * @description  Enables Animation
     */
    if (plugins.progressBarLinear.length > 0) {

      $(document)
      //$(this).scroll(function () {
        .on("scroll", $.proxy(function () {
          plugins.progressBarLinear.not('.animated').each(function () {

            var position = $(this).offset().top;

            if (($(window).scrollTop() + $(window).height()) > position) {
              var $this = $(this);
              var start = $this.attr("aria-valuemin");
              var end = $this.attr("aria-valuenow");
              $this.css({width: end + '%'});

              $this.parent().find('span').counter({
                start: start,
                end: end,
                time: 0.4,
                step: 20
              });
              $this.addClass('animated');
            }

          });
        }, $(this)))
        .trigger("scroll");

    }


    // Material Parallax
    if (plugins.materialParallax.length) {
      var i;
      if (!isNoviBuilder && !isIE && !isMobile) {
        plugins.materialParallax.parallax();
      } else if (isNoviBuilder) {
        for (i = 0; i < plugins.materialParallax.length; i++) {
          $(plugins.materialParallax[i]).find("img").addClass('parallax-image-stretch');
        }
      } else {
        for (i = 0; i < plugins.materialParallax.length; i++) {
          $(plugins.materialParallax[i]).css({
            "background-image": 'url(' + $(plugins.materialParallax[i]).find("img").attr("src") + ')',
            "background-attachment": "fixed",
            "background-size": "cover"
          });
        }
      }
    }

    /**
     * @module       tooltip
     * @description  Bootstrap tooltips
     */
    if (plugins.tooltipCustom.length) {
      $(function () {
        plugins.tooltipCustom.tooltip()
      });
    }

    /**
     * @module       Tabs
     * @description  Bootstrap tabs
     */
    $('#myTabs a').click(function (e) {
      e.preventDefault();
      $(this).tab('show')
    });

    $('#myTabs2 a').click(function (e) {
      e.preventDefault();
      $(this).tab('show')
    });

    /**
     * @module     Owl Carousel
     * @description Enables Owl Carousel Plugin
     */
    if (plugins.owlCarousel.length) {

      var isTouch = "ontouchstart" in window;


      plugins.owlCarousel.each(function () {
        var c = $(this),
          responsive = {};

        var aliaces = ["-", "-xs-", "-sm-", "-md-", "-lg-"],
          values = [0, 480, 768, 992, 1200],
          i, j;

        for (i = 0; i < values.length; i++) {
          responsive[values[i]] = {};
          for (j = i; j >= -1; j--) {
            if (!responsive[values[i]]["items"] && c.attr("data" + aliaces[j] + "items")) {
              responsive[values[i]]["items"] = j < 0 ? 1 : parseInt(c.attr("data" + aliaces[j] + "items"));
            }
            if (!responsive[values[i]]["stagePadding"] && responsive[values[i]]["stagePadding"] !== 0 && c.attr("data" + aliaces[j] + "stage-padding")) {
              responsive[values[i]]["stagePadding"] = j < 0 ? 0 : parseInt(c.attr("data" + aliaces[j] + "stage-padding"));
            }
            if (!responsive[values[i]]["margin"] && responsive[values[i]]["margin"] !== 0 && c.attr("data" + aliaces[j] + "margin")) {
              responsive[values[i]]["margin"] = j < 0 ? 30 : parseInt(c.attr("data" + aliaces[j] + "margin"));
            }
          }
        }
        // console.log('string', c);
        c.owlCarousel({
          autoplay: c.attr("data-autoplay") === "true",
          loop: c.attr("data-loop") !== "false",
          item: 1,
          mouseDrag: c.attr("data-mouse-drag") !== "false",
          nav: c.attr("data-nav") === "true",
          dots: c.attr("data-dots") === "true",
          dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each")) : false,
          responsive: responsive,
          navText: [],
          onInitialized: function () {

          }
        });
      });

    }

    /**
     * @module       SVG-Animate
     * @description  Enables SVG-Animate *
     */
    var msie = !!navigator.userAgent.match(/Trident\/7\./);
    //(!document.all) - is IE11-
    if ((plugins.svgPhone.length) && (!msie)) {


      $(this).on("scroll", $.proxy(function () {
        plugins.svgPhone.not('.active').each(function () {
          var $this = $(this);
          var position = $this.offset().top;

          if (($(window).scrollTop() + $(window).height()) > position) {
            $this.attr("class", "active");
            $this.parent().find('.phone_1').addClass('active');
          }
        });
      }, $(this)))
        .trigger("scroll");
    }

    /**
     * @module       ViewPort Universal
     * @description  Add class in viewport
     */
    if (plugins.viewAnimate.length) {
      $(this).on("scroll", $.proxy(function () {
        plugins.viewAnimate.not('.active').each(function () {
          var $this = $(this);
          var position = $this.offset().top;

          if (($(window).scrollTop() + $(window).height()) > position) {
            $this.addClass("active");
          }
        });
      }, $(this)))
        .trigger("scroll");
    }

    /**
     * @module       Scroll To
     * @description  Enables Scroll To
     */
    if (plugins.scrollToCustom.length) {
      plugins.scrollToCustom.scrollTo({});
    }

    /**
     * @module       RD Search
     * @description  Enables RD Search Plugin
     */
    if (plugins.rdSearch.length) {
      plugins.rdSearch.RDSearch({});
    }

    /**
     * @module       Countdown
     * @description  Enables RD Search Plugin
     */
    if (plugins.dateCountdown.length) {
      var time = {
        "Days": {
          "text": "Days",
          "color": "#95cf24",
          "show": true
        },
        "Hours": {
          "text": "Hours",
          "color": "#95cf24",
          "show": true
        },
        "Minutes": {
          "text": "Minutes",
          "color": "#95cf24",
          "show": true
        },
        "Seconds": {
          "text": "Seconds",
          "color": "#95cf24",
          "show": true
        }
      };
      plugins.dateCountdown.TimeCircles({
        "animation": "smooth",
        "bg_width": 0.4,
        "fg_width": 0.02666666666666667,
        "circle_bg_color": "rgba(0,0,0,.2)",
        "time": time
      });
      $(window).on('load resize orientationchange', function () {
        if ($(window).width() < 479) {
          plugins.dateCountdown.TimeCircles({
            time: {
              //Days: {show: true},
              //Hours: {show: true},
              Minutes: {show: true},
              Seconds: {show: false}
            }
          }).rebuild();
        } else if ($(window).width() < 767) {
          plugins.dateCountdown.TimeCircles({
            time: {
              //Minutes: {show: true},
              Seconds: {show: false}
            }
          }).rebuild();
        } else {
          plugins.dateCountdown.TimeCircles({time: time}).rebuild();
        }
      });
    }

    /**
     * @module       Magnific Popup
     * @description  Enables Magnific Popup Plugin
     */
    if (plugins.galleryItem.length > 0 || plugins.galleryGroup.length > 0) {
      if (plugins.galleryItem.length) {
        plugins.galleryItem.each(function () {
          var $this = $(this);
          $this.magnificPopup({
            type: $this.attr("data-lightbox")
          });
        })
      }
      if (plugins.galleryGroup.length) {
        plugins.galleryGroup.each(function () {
          var $gallery = $(this);
          $gallery
            .find('[data-lightbox]').each(function () {
            var $item = $(this);
            $item.addClass("mfp-" + $item.attr("data-lightbox"));
          })
            .end()
            .magnificPopup({
              delegate: '[data-lightbox]',
              type: "image",
              // Delay in milliseconds before popup is removed
              removalDelay: 300,
              // Class that is added to popup wrapper and background
              // make it unique to apply your CSS animations just to this exact popup
              mainClass: 'mfp-fade',
              gallery: {
                enabled: true
              }
            });
        })
      }
    }

    /**
     * @module       Isotope
     * @description  Enables Isotope Plugin
     */
    if (plugins.isotopeCustom.length) {
      plugins.isotopeCustom.each(function () {
        var _this = this
          , iso = new Isotope(_this, {
          itemSelector: '[class*="col-"], .isotope-item',
          layoutMode: _this.getAttribute('data-layout') ? _this.getAttribute('data-layout') : 'masonry'
        });

        $(window).on("resize", function () {
          iso.layout();
        });

        $(window).load(function () {
          iso.layout();
          setTimeout(function () {
            _this.className += " isotope--loaded";
            iso.layout();
          }, 600);
        });
      });

      $(".isotope-filters-trigger").on("click", function () {
        $(this).parents(".isotope-filters").toggleClass("active");
      });

      $('.isotope').magnificPopup({
        delegate: ' > :visible .mfp-image',
        type: "image",
        gallery: {
          enabled: true
        },
      });

      $("[data-isotope-filter]").on("click", function () {
        $('[data-isotope-filter][data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]').removeClass("active");
        $(this).addClass("active");
        $(this).parents(".isotope-filters").removeClass("active");
        $('.isotope[data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]')
          .isotope({filter: this.getAttribute("data-isotope-filter") == '*' ? '*' : '[data-filter="' + this.getAttribute("data-isotope-filter") + '"]'});
      })
    }

    /**
     * @module       Onclick functions
     * @description  Add ... to onclick
     */
    if (plugins.timeLine.length) {
      plugins.timeLine.find(".timeline-btn").on("click", function () {
        $(this).toggleClass("active");
        // plugins.timeLine.find(".timeline-hidden").toggleClass("active");
        if (plugins.timeLine.find(".timeline-hidden").is(':hidden')) {
          plugins.timeLine.find(".timeline-hidden").slideDown(800);
        } else {
          plugins.timeLine.find(".timeline-hidden").slideUp(800);
        }
      });
    }

    /**
     * Select2
     * @description Enables select2 plugin
     */
    if (plugins.selectFilter.length) {
      var i;
      for (i = 0; i < plugins.selectFilter.length; i++) {
        var select = $(plugins.selectFilter[i]);

        select.select2({
          placeholder: select.attr("data-placeholder") ? select.attr("data-placeholder") : false,
          minimumResultsForSearch: select.attr("data-minimum-results-search") ? select.attr("data-minimum-results-search") : 10,
          maximumSelectionSize: 3
        });
      }
    }

    // RD Input Label
    if (plugins.rdInputLabel.length) {
      plugins.rdInputLabel.RDInputLabel();
    }


    // Radio
    if (plugins.radio.length) {
      var i;
      for (i = 0; i < plugins.radio.length; i++) {
        var $this = $(plugins.radio[i]);
        $this.addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
      }
    }


    // Checkbox
    if (plugins.checkbox.length) {
      var i;
      for (i = 0; i < plugins.checkbox.length; i++) {
        var $this = $(plugins.checkbox[i]);
        $this.addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
      }
    }


    // Regula
    if (plugins.regula.length) {
      attachFormValidator(plugins.regula);
    }


    // Google ReCaptcha
    if (plugins.captcha.length) {
      $.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
    }


    // RD Mailform
    if (plugins.rdMailForm.length) {
      var i, j, k,
        msg = {
          'MF000': 'Successfully sent!',
          'MF001': 'Recipients are not set!',
          'MF002': 'Form will not work locally!',
          'MF003': 'Please, define email field in your form!',
          'MF004': 'Please, define type of your form!',
          'MF254': 'Something went wrong with PHPMailer!',
          'MF255': 'Aw, snap! Something went wrong.'
        },
        recipients = 'demo@link.com';

      for (i = 0; i < plugins.rdMailForm.length; i++) {
        var $form = $(plugins.rdMailForm[i]),
          formHasCaptcha = false;

        $form.attr('novalidate', 'novalidate').ajaxForm({
          data: {
            "form-type": $form.attr("data-form-type") || "contact",
            "recipients": recipients,
            "counter": i
          },
          beforeSubmit: function (arr, $form, options) {
            if (isNoviBuilder)
              return;

            var form = $(plugins.rdMailForm[this.extraData.counter]),
              inputs = form.find("[data-constraints]"),
              output = $("#" + form.attr("data-form-output")),
              captcha = form.find('.recaptcha'),
              captchaFlag = true;

            output.removeClass("active error success");

            if (isValidated(inputs, captcha)) {

              // veify reCaptcha
              if (captcha.length) {
                var captchaToken = captcha.find('.g-recaptcha-response').val(),
                  captchaMsg = {
                    'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
                    'CPT002': 'Something wrong with google reCaptcha'
                  }

                formHasCaptcha = true;

                $.ajax({
                  method: "POST",
                  url: "bat/reCaptcha.php",
                  data: {'g-recaptcha-response': captchaToken},
                  async: false
                })
                  .done(function (responceCode) {
                    if (responceCode != 'CPT000') {
                      if (output.hasClass("snackbars")) {
                        output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

                        setTimeout(function () {
                          output.removeClass("active");
                        }, 3500);

                        captchaFlag = false;
                      } else {
                        output.html(captchaMsg[responceCode]);
                      }

                      output.addClass("active");
                    }
                  });
              }

              if (!captchaFlag) {
                return false;
              }

              form.addClass('form-in-process');

              if (output.hasClass("snackbars")) {
                output.html('<p><span class="icon icon-xxs fa fa-circle-o-notch fa-spin"></span><span>Sending</span></p>');
                output.addClass("active");
              }
            } else {
              return false;
            }
          },
          error: function (result) {
            if (isNoviBuilder)
              return;

            var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
              form = $(plugins.rdMailForm[this.extraData.counter]);

            output.text(msg[result]);
            form.removeClass('form-in-process');

            if (formHasCaptcha) {
              grecaptcha.reset();
            }
          },
          success: function (result) {
            if (isNoviBuilder)
              return;

            var form = $(plugins.rdMailForm[this.extraData.counter]),
              output = $("#" + form.attr("data-form-output")),
              select = form.find('select');

            form
              .addClass('success')
              .removeClass('form-in-process');

            if (formHasCaptcha) {
              grecaptcha.reset();
            }

            result = result.length === 5 ? result : 'MF255';
            output.text(msg[result]);

            if (result === "MF000") {
              if (output.hasClass("snackbars")) {
                output.html('<p><span class="icon icon-xxs fa-check"></span><span>' + msg[result] + '</span></p>');
              } else {
                output.addClass("active success");
              }
            } else {
              if (output.hasClass("snackbars")) {
                output.html(' <p class="snackbars-left"><span class="icon icon-xxs fa-exclamation-triangle"></span><span>' + msg[result] + '</span></p>');
              } else {
                output.addClass("active error");
              }
            }

            form.clearForm();
            form.find('input, textarea').trigger('blur');

            if (select.length) {
              select.select2("val", "");
            }

            setTimeout(function () {
              output.removeClass("active error success");
              form.removeClass('success');
            }, 3500);
          }
        });
      }
    }

  });
}());