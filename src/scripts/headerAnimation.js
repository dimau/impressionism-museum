let mm = gsap.matchMedia();

const tl = gsap.timeline();
tl.to(".header", {
  background: "rgba(255, 255, 255, 1)",
  scrollTrigger: {
    trigger: ".main",
    start: "top 120px",
    end: "+=100",
    scrub: true,
  }
})

// add a media query. When it matches, the associated function will run
mm.add("(min-width: 1024px)", () => {

  tl.to(".nav__logo", {
    scale: 0.6,
    transformOrigin: "left top",
    // Changing height is better but causes jumping all other ScrollTrigger animations on the pade on start
    // height: 48,
    // width: 108,
    scrollTrigger: {
      trigger: ".main",
      start: "top 120px",
      end: "+=100",
      scrub: true,
      invalidateOnRefresh: true,
    }
  });

  // return () => { // optional
  //   // custom cleanup code here (runs when it STOPS matching)
  // };
});
