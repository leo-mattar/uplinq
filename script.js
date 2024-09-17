// --- GSAP
gsap.registerPlugin(ScrollTrigger, Flip, MotionPathPlugin);

gsap.config({
  nullTargetWarn: false,
  trialWarn: false,
});

let mm = gsap.matchMedia();

// --- GLOBAL - RELOAD AT THE TOP
window.addEventListener("beforeunload", function () {
  history.scrollRestoration = "manual";
});

// --- LENIS
window.lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// --- PAPER TIGET SIGNATURE
const pprtgr = [
  'color: #F2F3F3',
  'background: #080808',
  'font-size: 12px',
  'padding-left: 10px',
  'line-height: 2',
  'border-left: 5px solid #ff3c31',
].join(';');
console.info(`

%cWebsite by Paper Tiger${' '}
www.papertiger.com${'     '}

`, pprtgr);

// --- CURRENT YEAR
const currentYear = document.querySelector('[current-year]');
if (currentYear) {
  currentYear.innerHTML = new Date().getFullYear();
}

// --- LIGHT SECTIONS REVEAL
function lightSection() {
  const sections = document.querySelectorAll(".c-section[section-theme='light']");

  sections.forEach((section) => {
    const tl = gsap.timeline({ paused: true });

    gsap.set(section, { opacity: 0 });

    tl.to(section, {
      opacity: 1,
      ease: "power2.out",
      duration: 1.2,
    });

    ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      onToggle: (self) => {
        if (self.isActive) {
          tl.play();
        } else {
          tl.reverse();
        }
      },
    });
  });
}

// --- HEADER BG
function headerBg() {
  const header = document.querySelector(".c-header");

  ScrollTrigger.create({
    trigger: "body",
    start: "100 top",
    onToggle: (self) => {
      if (self.isActive) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  });
}

// --- HEADER MEGAMENU
function headerMegamenu() {
  const pageWrapper = document.querySelector(".o-page-wrapper");
  const dropdowns = document.querySelectorAll(".c-dd-trigger-wrap");
  let active;

  dropdowns.forEach((dropdown) => {
    const megamenu = dropdown.querySelector(".c-dd");
    const trigger = dropdown.querySelector(".c-dd-trigger");
    const triggerArrow = dropdown.querySelector(".c-icon.nav-arrow");
    let tl = gsap.timeline({ paused: true, defaults: { duration: 0.8, ease: "expo.inOut" } });

    tl.to(megamenu, { height: "auto", borderBottom: "1px solid #2C3136" });
    tl.to(triggerArrow, { rotation: 180 }, 0);

    dropdown.tl = tl;

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();

      function closeMegamenu() {
        if (active && active.tl) {
          active.tl.reverse();
        }
        active = null;
        pageWrapper.classList.remove("megamenu-open");
        lenis.start();

        // Remove 'non-active' class from all dropdowns
        dropdowns.forEach((dd) => dd.classList.remove("non-active"));
      }

      if (active === dropdown) {
        closeMegamenu();
      } else {
        if (active) active.tl.reverse();

        tl.play();
        active = dropdown;
        pageWrapper.classList.add("megamenu-open");
        lenis.stop();

        // Add 'non-active' class to all dropdowns except the current one
        dropdowns.forEach((dd) => {
          if (dd !== dropdown) {
            dd.classList.add("non-active");
          } else {
            dd.classList.remove("non-active");
          }
        });
      }

      document.addEventListener("click", function () {
        if (active) {
          closeMegamenu();
        }
      });

      // Close with Escape
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          closeMegamenu();
        }
      });

    });
  });
}

//

// --- PRICING TABS
function pricingTabs() {
  const tabs = document.querySelectorAll(".c-pricing-item");
  const links = document.querySelectorAll(".c-pricing-nav-btn");
  const activeBtnBg = document.querySelector(".c-pricing-nav-active");
  const priceSwitchWrap = document.querySelector(".c-pricing-type");

  if (tabs.length === 0) return;

  // Tab links
  links.forEach(link => {
    link.addEventListener("click", function (e) {

      // Active link
      links.forEach(l => l.classList.remove('is-active'));
      link.classList.add('is-active');

      const clickedTab = e.currentTarget.textContent.toLowerCase().replaceAll(" ", "-");

      // Flip
      const state = Flip.getState(activeBtnBg);
      link.insertBefore(activeBtnBg, link.firstChild);
      Flip.from(state, { duration: 0.4, ease: "power3.inOut" });

      tabs.forEach(tab => {
        tab.classList.remove("is-active");
      });

      // Show clicked tab
      const activeTab = document.querySelector(`[data-pricing='${clickedTab}`);
      activeTab.classList.add("is-active");

      // Show/Hide price switch
      if (clickedTab === "catch-up") {
        priceSwitchWrap.style.display = "none";
      } else {
        priceSwitchWrap.style.display = "flex";
      }

    });
  });

  // Price switch
  const priceSwitch = document.querySelector(".c-pricing-type-switch");
  const priceSwitchBullet = document.querySelector(".c-pricing-type-switch-bullet");
  const priceText = document.querySelectorAll(".c-pricing-type-txt");
  const monthlyPrices = document.querySelectorAll(
    ".c-pricing-card-price .t-display-4:nth-of-type(even)");
  const annualPrices = document.querySelectorAll(
    ".c-pricing-card-price .t-display-4:nth-of-type(odd)");

  let currentSwitch = 'monthly';

  function showMonthlyPrices() {
    annualPrices.forEach(price => price.style.display = 'none');
    monthlyPrices.forEach(price => price.style.display = 'block');
  }

  function showAnnualPrices() {
    monthlyPrices.forEach(price => price.style.display = 'none');
    annualPrices.forEach(price => price.style.display = 'block');
  }

  if (currentSwitch === 'monthly') {
    showMonthlyPrices();
  } else {
    showAnnualPrices();
  }

  priceSwitch.addEventListener("click", function () {
    if (currentSwitch === 'monthly') {
      showAnnualPrices();
      currentSwitch = 'annually';
      priceSwitch.classList.toggle("is-monthly");
      priceText.forEach(text => text.classList.toggle("is-active"));
    } else {
      showMonthlyPrices();
      currentSwitch = 'monthly';
      priceSwitch.classList.toggle("is-monthly");
      priceText.forEach(text => text.classList.toggle("is-active"));
    }
  });
}

// --- ACCORDIONS
function accordions() {
  const accordions = document.querySelectorAll(".c-ac-item");
  let active = null;

  if (accordions.length === 0) return;

  accordions.forEach(accordion => {
    const question = accordion.querySelector(".c-ac-question");
    const response = accordion.querySelector(".c-ac-response");
    const arrow = accordion.querySelector(".c-icon.ac-arrow");

    const tl = gsap.timeline({
      paused: true,
      defaults: {
        ease: "power2.inOut",
        duration: 0.5
      }
    });

    tl.to(response, { height: "auto" });
    tl.to(arrow, { rotation: 180 }, 0);

    accordion.tl = tl;

    question.addEventListener("click", function () {
      if (active === accordion) {
        tl.reverse();
        active = null;
      } else {
        if (active) active.tl.reverse();
        tl.play();
        active = accordion;
      }
    });
  });
}

// --- SLIDER - REVIEWS
function reviewsSlider() {
  let eventsSlider = new Swiper(".swiper.reviews", {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 600,
    // grabCursor: true,
    pagination: {
      el: ".swiper-pagination.reviews",
      clickable: true
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    autoplay: {
      delay: 7000,
    },
    breakpoints: {
      320: {
        autoHeight: true
      },
      992: {
        autoHeight: false
      }
    }
  });
}

// --- TIMELINE
function timelines() {
  const timelines = document.querySelectorAll(".c-timeline");

  if (timelines.length === 0) return;

  timelines.forEach(timeline => {
    const progressBar = timeline.querySelector(".c-timeline-p-bar-active");
    const light = timeline.querySelector(".c-img-contain.timeline-light");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: timeline,
        start: "top 40%",
        end: "bottom -30%",
        scrub: true,
      }
    });

    tl.to(light, {
      motionPath: {
        path: timeline.querySelector(".timeline-path"),
        align: timeline.querySelector(".timeline-path"),
        alignOrigin: [0.5, 0.5],
        start: 0,
        end: 1,
      },
    });

    tl.to(progressBar, { height: "100%" }, "<");

  });
}

// --- RETURN TO TOP
function returnToTop() {
  const link = document.querySelector(".c-footer-return-top");

  link.addEventListener("click", function () {

    gsap.to("body", { opacity: 0, duration: 0.2 });

    setTimeout(() => {
      lenis.scrollTo("body", {
        top: 0,
        duration: 0.1,
        lock: true,
        onComplete: () => {
          gsap.to("body", { opacity: 1, duration: 0.2 });
        }
      });
    }, 300);

  });
}

// --- AUTOPLAY SLIDER
function autoplaySlider() {
  const tabs = document.querySelectorAll(".c-tab-item");
  const container = document.querySelector(".o-row.split-slider");

  const animationTargets = [
    ".c-tab-svg.is-1",
    ".c-tab-svg.is-2",
    ".c-tab-svg.is-3"
  ];

  if (tabs.length === 0 || !container) return;

  let currentIndex = 0;
  let intervalId;

  // Function to handle the leave animation
  function handleLeaveAnimation(index, onComplete) {
    gsap.to(animationTargets[index], {
      opacity: 0,
      y: "4em",
      duration: 0.6,
      ease: "power4.in",
      onComplete: () => {
        gsap.set(animationTargets[index], { clearProps: "all" });
        onComplete();
      }
    });
  }

  // Function to handle the enter animation
  function handleEnterAnimation(index) {
    gsap.fromTo(
      animationTargets[index], { opacity: 0, y: "4em" }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power4.out"
      }
    );

    gsap.fromTo(
      `${animationTargets[index]} .c-tab-1-line`, { clipPath: "inset(100% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.05
      }
    );

    gsap.fromTo(
      `${animationTargets[index]} .c-tab-2-loader`, { rotation: 0 },
      {
        rotation: 360,
        duration: 7,
        ease: "linear",
        transformOrigin: "center center"
      }
    );

    gsap.fromTo(
      `${animationTargets[index]} .c-tab-3-card`, { y: "4em", opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        stagger: 0.2,
      }
    );

  }

  function activateTab(index) {
    tabs.forEach((tab, i) => {
      tab.classList.toggle("is-active", i === index);
    });

    handleLeaveAnimation(currentIndex, () => {
      handleEnterAnimation(index);
    });

    currentIndex = index;
  }

  function nextTab() {
    const nextIndex = (currentIndex + 1) % tabs.length;
    activateTab(nextIndex);
  }

  function startInterval() {
    if (!intervalId) {
      intervalId = setInterval(nextTab, 7000);
    }
  }

  function stopInterval() {
    clearInterval(intervalId);
    intervalId = null;
  }

  function handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activateTab(currentIndex);
        startInterval();
        observer.disconnect();
      }
    });
  }

  const observer = new IntersectionObserver(handleIntersection, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });

  observer.observe(container);

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      stopInterval();
      activateTab(i);
      setTimeout(startInterval, 10);
    });
  });
}

//

// --- CAREERS PANELS
function careersPanels() {
  const panels = document.querySelectorAll(".c-panel");
  const track = document.querySelector(".c-section.panels");
  const progressBar = document.querySelector(".c-panels-progress-bar-light");
  const panelsTotalText = document.querySelector("[panel-total-num]");
  const windowWidth = window.innerWidth;

  if (panels.length === 0) return;

  panelsTotalText.textContent = `0${panels.length}`;

  ScrollTrigger.create({
    trigger: track,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: self => {
      const progress = self.progress;
      const panelIndex = Math.floor(progress * panels
        .length);

      panels.forEach((panel, index) => {
        if (index === panelIndex || (progress === 1 && index === panels.length - 1)) {
          panel.classList.add("is-active");
        } else {
          panel.classList.remove("is-active");
        }
      });

      if (windowWidth >= 480) {
        gsap.to(progressBar, {
          duration: 0.1,
          height: `${progress * 100}%`,
          ease: "none"
        });
      } else {
        gsap.to(progressBar, {
          duration: 0.1,
          width: `${progress * 100}%`,
          ease: "none"
        });
      }
    }
  });
}

// --- TEMPLATE 3 HERO PAGE LOAD ANIMATION
function template3PageLoad() {
  const images = document.querySelectorAll(".c-img.absolute");

  if (images.length === 0) return;

  const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1.6, stagger: 0.1 } });

  gsap.set(images, { yPercent: -20, xPercent: 20, translateZ: 300, filter: 'blur(30px)' });
  gsap.set(".c-billboard-txt > *", { y: "3em" });

  tl.to(".c-billboard-txt > *", {
    opacity: 1,
    y: 0
  });

  tl.to(images, {
    opacity: 1,
    yPercent: 0,
    xPercent: 0,
    translateZ: 0,
    filter: 'blur(0px)'
  }, "<0.4");
}

// --- HEADER MOBILE
function headerMobile() {
  const headerBtn = document.querySelector(".c-nav-btn");
  const header = document.querySelector(".c-header-nav");
  const navBar1 = document.querySelector(".c-nav-icon-bar.is-1");
  const navBar2 = document.querySelector(".c-nav-icon-bar.is-2");

  let menuState = "closed";

  const tl = gsap.timeline({
    paused: true,
    defaults: {
      ease: "expo.inOut",
      duration: 1
    }
  });

  tl.fromTo(header, { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)" });
  tl.to(navBar1, { rotation: 45, y: 4 }, 0);
  tl.to(navBar2, { rotation: -45, y: -3 }, 0);

  headerBtn.addEventListener("click", function () {
    if (menuState === "open") {
      lenis.start();
      tl.reverse();
      menuState = "closed";
      header.removeAttribute("data-lenis-prevent", "false");
    } else {
      lenis.stop();
      tl.restart();
      menuState = "open";
      header.setAttribute("data-lenis-prevent", "true");
    }
  });
}

// --- HOME LOADER
function homeLoader() {

  const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2, stagger: 0.1 } });

  const elements =
    ".c-section.hm-hero .t-display-1, .c-section.hm-hero .t-body-1, .c-section.hm-hero .c-btn-hero, .c-img-contain.hm-dashboard";

  gsap.set(elements, { y: "3em" });

  tl.to(elements, {
    autoAlpha: 1,
    stagger: 0.1,
    y: 0
  });

  tl.to(".c-img-contain.hero-bg", { autoAlpha: 1 }, 0);

}

// --- GLOBAL - FADE
function fade() {
  const fadeElements = document.querySelectorAll("[fade]");

  gsap.set(fadeElements, { opacity: 0 });

  ScrollTrigger.batch(fadeElements, {
    once: true,
    start: "top 95%",
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        duration: 1.8,
        ease: "power3.out",
        stagger: 0.2,
      }),
  });
}

// --- TAX STRATEGY DIAGRAM ANIMATION
function diagramAnimation() {
  const diagramWrap = document.querySelectorAll(".o-row.diagram");

  if (diagramWrap.length === 0) return;

  function path1() {
    let tl = gsap.timeline({
      defaults: { repeat: -1 },
      scrollTrigger: {
        trigger: diagramWrap,
        start: "top 70%",
      },
    });

    tl.to(
      ".c-light-path-1-dash",
      {
        duration: 5,
        repeatDelay: 0,
        ease: "power1.inOut",
        motionPath: {
          path: "#light-path-1",
          align: "#light-path-1",
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: 1,
          end: 0
        },
        stagger: 2,
      },
      "<"
    );
  }
  path1();

  function path2() {
    let tl = gsap.timeline({
      defaults: { repeat: -1 },
      scrollTrigger: {
        trigger: diagramWrap,
        start: "top 70%",
      },
    });

    tl.to(
      ".c-light-path-2-dash",
      {
        duration: 7,
        repeatDelay: 0,
        ease: "power1.inOut",
        motionPath: {
          path: "#light-path-2",
          align: "#light-path-2",
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: 1,
          end: 0
        },
        stagger: 2.4,
      },
      "<"
    );
  }
  path2();

  function path3() {
    let tl = gsap.timeline({
      defaults: { repeat: -1 },
      scrollTrigger: {
        trigger: diagramWrap,
        start: "top 70%",
      },
    });

    tl.to(
      ".c-light-path-3-dash",
      {
        duration: 7,
        repeatDelay: 0,
        ease: "power1.inOut",
        motionPath: {
          path: "#light-path-3",
          align: "#light-path-3",
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: 1,
          end: 0
        },
        stagger: 2.8,
      },
      "<"
    );
  }
  path3();

  function path4() {
    let tl = gsap.timeline({
      defaults: { repeat: -1 },
      scrollTrigger: {
        trigger: diagramWrap,
        start: "top 70%",
      },
    });

    tl.to(
      ".c-light-path-4-dash",
      {
        duration: 9,
        repeatDelay: 0,
        ease: "power1.inOut",
        motionPath: {
          path: "#light-path-4",
          align: "#light-path-4",
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: 0,
          end: 1
        },
        stagger: 3.2,
      },
      "<"
    );
  }
  path4();
}

// --- SLIDER - STORY
function storySlider() {
  const storySlider = new Swiper(".swiper.story", {
    spaceBetween: 24,
    speed: 600,
    grabCursor: true,
    navigation: {
      prevEl: ".swiper-prev.story",
      nextEl: ".swiper-next.story",
    },
    breakpoints: {
      320: {
        slidesPerView: 1.2,
      },
      480: {
        slidesPerView: "auto",
      },
    }
  });
}

// --- SECURITY CARDS
function securityCards() {
  const cards = document.querySelectorAll(".c-security-card");

  cards.forEach(card => {
    const badge = card.querySelector(".c-security-card-badge");
    const initialText = card.querySelector(".t-display-6");
    const plusSign = card.querySelector(".c-security-card-plus");
    const hoverText = card.querySelector(".c-security-badge-hover");

    const tl = gsap.timeline({
      paused: true,
      defaults: {
        ease: "power2.inOut",
        duration: 0.6
      }
    });

    tl.to([badge, initialText], { autoAlpha: 0 });
    tl.to(plusSign, { rotation: 45 }, 0);
    tl.to(hoverText, { autoAlpha: 1 }, 0);

    card.addEventListener("click", function () {
      card.classList.toggle("is-open");
      if (card.classList.contains("is-open")) {
        tl.restart();
      } else {
        tl.reverse();
      }
    });

  });
}

// --- HERO BUTTON HOVER
function heroButtonHover() {
  const buttons = document.querySelectorAll(".c-btn-hero");

  buttons.forEach(button => {
    const icons = button.querySelectorAll(".c-btn-icon-hero path");
    const wrap = button.querySelector(".c-btn-icon-hero-wrap");
    const mask = button.querySelector(".c-btn-icon-hero-mask");
    const otherPaths = button.querySelectorAll(
      ".c-btn-icon-hero path:not(.btn-hero-main-arrow)");

    const tl = gsap.timeline({ repeat: -1, ease: "power2.inOut" });

    tl.to(icons, { opacity: 0.3, duration: 0.6, stagger: 0.1 });
    tl.to(icons, { opacity: 1, duration: 0.6, stagger: 0.1 }, "<0.6");

    // Event timeline
    const tl2 = gsap.timeline({ paused: true, duration: 0.6 });

    tl2.to([wrap, mask], { width: "100%", ease: "power2.inOut" }, 0);

    button.addEventListener("mouseenter", () => tl2.restart());
    button.addEventListener("mouseleave", () => tl2.reverse());
  });
}

// --- INTEGRATIONS PAGE
function integrations() {
  const allLink = document.querySelector(".c-filter-link.all");
  const linksWrap = document.querySelector(".c-filter-wrap.integrations");

  if (allLink && linksWrap) {
    linksWrap.insertBefore(allLink, linksWrap.firstChild);
  }
}

// --- FADE PAGE LOAD
function simpleLoader() {
  let tl = gsap.timeline({
    defaults: { ease: "power2.out", duration: 1.4, delay: 0.1 },
  });

  tl.to(".o-wrapper", { autoAlpha: 1 });
}

//
////
//////
////
//

let homepage = document.querySelector("[data-page='homepage']");
let subpage = document.querySelector("[data-page='sub-page']");
let template3 = document.querySelector("[data-page='template-3']");

// --- INIT
function init() {
  headerBg();
  pricingTabs();
  accordions();
  reviewsSlider();
  timelines();
  returnToTop();
  autoplaySlider();
  careersPanels();
  headerMegamenu();
  diagramAnimation();
  storySlider();
  securityCards();
  heroButtonHover();
  integrations();
  if (subpage) {
    simpleLoader();
  }
  if (homepage) {
    homeLoader();
  }
}

init();

const header = document.querySelector(".c-header-nav");
const headerBtnsWrap = document.querySelector(".c-btn-wrap.header_rt");
const headerInitialPosition = document.querySelector(".c-header_rt");

// --- MATCHMEDIA - DESKTOP
mm.add("(min-width: 992px)", () => {
  lightSection();
  fade();
  if (template3) {
    template3PageLoad();
  }
  return () => {
    //
  };
});

// --- MATCHMEDIA - TABLET AND MOBILE
mm.add("(max-width: 991px)", () => {
  headerMobile();
  header.appendChild(headerBtnsWrap);
  return () => {
    headerInitialPosition.appendChild(headerBtnsWrap);
  };
});

mm.add("(max-width: 767px)", () => {
  //
  return () => {
    //
  };
});
