gsap.from(".hero__image", {
  scale: 8,
  transformOrigin: "center center",
  ease: "expo",
  scrollTrigger: {
    trigger: ".hero__image",
    start: "center center",
    end: "center top",
    pin: true,
    scrub: 0.5
  }
});

gsap.to(".ring--right", {
  scale: 5,
  ease: "power4",
  transformOrigin: "center",
  scrollTrigger: {
    trigger: ".ring--right",
    start: "top center",
    end: "bottom+=300 200px",
    pin: true,
    scrub: 0.25
  }
});

gsap.to(".ring--left", {
  scale: 3,
  ease: "power4",
  transformOrigin: "center center",
  scrollTrigger: {
    trigger: ".ring--left",
    start: "center+=100% center",
    end: "bottom+=300 top",
    pin: true,
    scrub: 0.25
  }
});

gsap.to(".hero__title--1", {
  xPercent: -50,
  scrollTrigger: {
    trigger: ".hero__title--1",
    start: "center center",
    pin: true,
    scrub: 0.5
  }
});

gsap.to(".hero__title--2", {
  xPercent: 50,
  scrollTrigger: {
    trigger: ".hero__title--2",
    start: "center center",
    pin: true,
    scrub: 0.5
  }
});

gsap.to(".hero__copy", {
  opacity: 0,
  scrollTrigger: {
    trigger: ".hero__copy",
    start: "top 60%",
    end: "+=60 60%",
    pin: false,
    scrub: 0.5
  }
});

gsap.to(".cross-1", {
  rotate: "+=360",
  scrollTrigger: {
    trigger: ".cross-1",
    start: "bottom bottom",
    end: "bottom top",
    pin: false,
    scrub: 0.5
  }
});

gsap.to(".cross-2", {
  rotate: 360 * 4,
  scrollTrigger: {
    trigger: ".cross-2",
    start: "bottom bottom",
    end: "bottom top",
    pin: false,
    scrub: 0.5
  }
});

gsap.to(".box", {
  y: 500,
  x: "-10vw",
  ease: "power.in",
  scrollTrigger: {
    trigger: ".box",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});

gsap.from(".line", {
  scaleX: 0,
  transformOrigin: "left center",
  ease: "power.in",
  scrollTrigger: {
    trigger: ".line",
    start: "center 75%",
    end: "bottom 10%",
    scrub: 0.5,
    pin: false
  }
});

gsap.to(".big", {
  x: "-130vw",
  transformOrigin: "center center",
  scrollTrigger: {
    trigger: ".big",
    start: "top 62%",
    end: "bottom top-=200",
    pin: true,
    scrub: 1.75
  }
});

gsap.to(".cards", {
  scale: 1.75,
  scrollTrigger: {
    trigger: ".cards",
    start: "center center",
    end: "bottom top",
    pin: true,
    scrub: true
  }
});

gsap.to(".card-1", {
  rotate: -20,
  scale: 0.75,
  x: -200,
  transformOrigin: "bottom center",
  scrollTrigger: {
    trigger: ".cards",
    start: "center center",
    end: "bottom top",
    pin: true,
    scrub: true
  }
});

gsap.to(".card-3", {
  rotate: 20,
  scale: 0.75,
  x: 200,
  transformOrigin: "bottom center",
  scrollTrigger: {
    trigger: ".cards",
    start: "center center",
    end: "bottom top",
    pin: true,
    scrub: true
  }
});

gsap.from(".hero__copy span", {
  opacity: 0,
  duration: 1,
  y: 40,
  delay: 0.5,
  ease: "power2.inOut"
});

let titleOne = new SplitText(".hero__title--1", { type: "words" });
let oneWords = titleOne.words;

gsap.from(oneWords, {
  opacity: 0,
  duration: 1.5,
  y: 80,
  ease: "power4",
  stagger: {
    each: 0.15
  }
});

let titleTwo = new SplitText(".hero__title--2", { type: "words" });
let twoWords = titleTwo.words;

gsap.from(twoWords, {
  opacity: 0,
  duration: 1.5,
  y: 80,

  delay: 0.25,
  ease: "power4",
  stagger: {
    each: 0.15
  }
});

gsap.to(".cross-3", {
  rotate: 360 * 2,
  y: 150,
  scrollTrigger: {
    scrub: 0.5,
    start: "bottom bottom",
    end: "bottom -300px",
    trigger: ".cross-3",
    pin: false
  }
});

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".footer__link",
    start: "top 75%"
  }
});

tl.from(".footer__link", {
  opacity: 0,
  y: 90,
  duration: 2,
  ease: "expo.out"
})
  .from(
    ".footer__copy",
    {
      opacity: 0,
      y: 90,
      duration: 2,
      ease: "expo.out"
    },
    "-=1.75"
  )
  .from(
    ".footer__button",
    {
      opacity: 0,
      y: 90,
      duration: 2,
      ease: "power3.out"
    },
    "-=1.75"
  );

// ScrollTrigger.addEventListener("scrollEnd", () => {
//   document.querySelector('.cross-1').classList.add('scroll-end')
// });

// ScrollTrigger.addEventListener("scrollStart", () => {
//   document.querySelector('.cross-1').classList.remove('scroll-end')
// });

gsap.fromTo(
  ".hero__image",
  {
    opacity: 0,
    objectPosition: "center 0%",
    y: 100
  },
  {
    opacity: 1,
    duration: 2,
    objectPosition: "center 15%",
    y: 0,
    ease: "expo.inOut"
  }
);

gsap.set(".cursor", { force3D: true });
document.addEventListener("mousemove", (e) => {
  let x = e.clientX;
  let y = e.clientY;

  gsap.to(".cursor", {
    x: x - 16,
    y: y - 16,
    ease: "power3"
  });
});

document.body.addEventListener("mouseleave", () => {
  gsap.to(".cursor", {
    scale: 0,
    duration: 0.1,
    ease: "none"
  });
});

document.body.addEventListener("mouseenter", () => {
  gsap.to(".cursor", {
    scale: 1,
    duration: 0.1,
    ease: "none"
  });
});

let hoverCursors = document.querySelectorAll('[data-cursor="hover"]');

hoverCursors.forEach(function (cursor) {
  cursor.addEventListener("mouseenter", () => {
    gsap.to(".cursor", {
      scale: 2.5
    });
  });

  cursor.addEventListener("mouseleave", () => {
    gsap.to(".cursor", {
      scale: 1
    });
  });
});