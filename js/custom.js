(function ($) {
    'use strict';

    $(document).on('ready', function () {
        function getAnchorOffsetTop(target) {
            var navHeight = $('.main-nav').outerHeight() || 0;
            return Math.max(target.offset().top - navHeight, 0);
        }

        var sectionLinks = $('.main-nav .navbar-nav .nav-item .nav-link[href^="#"]');
        var navItems = $('.main-nav .navbar-nav .nav-item');
        var homeNavItem = navItems.first();

        function setActiveNavByHash(hash) {
            navItems.removeClass('active');
            if (hash) {
                var activeLink = sectionLinks.filter('[href="' + hash + '"]').first();
                if (activeLink.length) {
                    activeLink.closest('.nav-item').addClass('active');
                    return;
                }
            }
            homeNavItem.addClass('active');
        }

        function updateActiveNavOnScroll(updateUrl) {
            var navHeight = $('.main-nav').outerHeight() || 0;
            var scrollPosition = $(window).scrollTop() + navHeight + 20;
            var currentHash = '';

            sectionLinks.each(function () {
                var hash = this.getAttribute('href');
                var section = $(hash);
                if (section.length && scrollPosition >= section.offset().top) {
                    currentHash = hash;
                }
            });

            setActiveNavByHash(currentHash);

            if (updateUrl && history.replaceState) {
                if (currentHash) {
                    history.replaceState(null, null, currentHash);
                } else {
                    history.replaceState(null, null, window.location.pathname + window.location.search);
                }
            }
        }

        // -----------------------------
        //  Screenshot Slider
        // -----------------------------
        $('.speaker-slider').slick({
            slidesToShow: 3,
            centerMode: true,
            infinite: true,
            autoplay: true,
            arrows: true,
            responsive: [{
                    breakpoint: 1440,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 500,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });
        // -----------------------------
        //  Count Down JS
        // -----------------------------
        $('.timer').syotimer({
            year: 2026,
            month: 4,
            day: 10,
            hour: 9,
            minute: 0
        });
         // -----------------------------
        // Smooth scroll
        // -----------------------------
        $('a[href*="#"]')
            // Remove links that don't actually link to anything
            .not('[href="#"]')
            .not('[href="#0"]')
            .click(function (event) {
                // On-page links
                if (
                    location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
                    location.hostname == this.hostname
                ) {
                    var hash = this.hash;
                    // Figure out element to scroll to
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                    // Does a scroll target exist?
                    if (target.length) {
                        // Only prevent default if animation is actually gonna happen
                        event.preventDefault();
                        $('html, body').animate({
                            scrollTop: getAnchorOffsetTop(target)
                        }, 1000, function () {
                            if (history.pushState) {
                                history.pushState(null, null, hash);
                            } else {
                                window.location.hash = hash;
                            }
                            setActiveNavByHash(hash);
                            // Callback after animation
                            // Must change focus!
                            var $target = $(target);
                            $target.focus();
                            if ($target.is(":focus")) { // Checking if the target was focused
                                return false;
                            } else {
                                $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                                $target.focus(); // Set focus again
                            };
                        });
                    }
                }
            });

        if (window.location.hash) {
            var initialTarget = $(window.location.hash);
            if (initialTarget.length) {
                setTimeout(function () {
                    $('html, body').scrollTop(getAnchorOffsetTop(initialTarget));
                    updateActiveNavOnScroll(false);
                }, 50);
            }
        } else {
            updateActiveNavOnScroll(false);
        }

        var isScrollSpyTicking = false;
        $(window).on('scroll', function () {
            if (isScrollSpyTicking) {
                return;
            }

            isScrollSpyTicking = true;
            window.requestAnimationFrame(function () {
                updateActiveNavOnScroll(true);
                isScrollSpyTicking = false;
            });
        });

        // -----------------------------
        // To Top Init
        // -----------------------------
        $('.to-top').on('click', function () {
            $('html, body').animate({
                scrollTop: 0
            }, 'slow', function () {
                if (history.replaceState) {
                    history.replaceState(null, null, window.location.pathname + window.location.search);
                }
                setActiveNavByHash('');
            });
            return false;
        });

        // -----------------------------
        // Magnific Popup
        // -----------------------------
        $('.image-popup').magnificPopup({
            type: 'image',
            removalDelay: 160, //delay removal by X to allow out-animation
            callbacks: {
                beforeOpen: function () {
                    // just a hack that adds mfp-anim class to markup
                    this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                    this.st.mainClass = this.st.el.attr('data-effect');
                }
            },
            closeOnContentClick: true,
            midClick: true,
            fixedContentPos: false,
            fixedBgPos: true

        });
        // -----------------------------
        // Mixitup
        // -----------------------------
        var containerEl = document.querySelector('.gallery-wrapper');
        var mixer;
        if (containerEl) {
            mixer = mixitup(containerEl);
        }
    });

})(jQuery);