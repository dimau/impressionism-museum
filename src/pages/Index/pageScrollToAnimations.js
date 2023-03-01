import {bonusCardsAnimation} from "../../widgets/Bonuses/horizontalAnimatedScroll";
import {tasksSectionHeaderAnimation} from "../../shared/ui/StackingCards/stackingCards";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Scroll to Bonuses section
document.querySelector(".nav__link-bonuses").addEventListener("click", (e) => {
  e.preventDefault();

  // NOT touch devices - that have horizontal scroll animation
  if (bonusCardsAnimation) {
    gsap.to(window, {
      scrollTo: bonusCardsAnimation.start,
      ease: "expo.out",
      duration: 0.1,
    });

    // TOUCH devices - without horizontal scroll animation
  } else {
    gsap.to(window, {
      scrollTo: {
        y: "#bonuses",
        offsetY: 120,
      },
      ease: "none",
      duration: 0.1,
    });
  }
});

// Scroll to Tasks section
document.querySelector(".nav__link-tasks").addEventListener("click", (e) => {
  e.preventDefault();
  gsap.to(window, {
    scrollTo: tasksSectionHeaderAnimation.start,
    ease: "expo.out",
    duration: 0.1,
  });
});

// Scroll to About section
document.querySelector(".nav__link-about").addEventListener("click", (e) => {
  e.preventDefault();
  gsap.to(window, {
    scrollTo: {
      y: "#about",
      offsetY: 120,
    },
    ease: "none",
    duration: 0.1,
  });
});

// Scroll to FAQ section
document.querySelector(".nav__link-faq").addEventListener("click", (e) => {
  e.preventDefault();
  gsap.to(window, {
    scrollTo: {
      y: "#faq",
      offsetY: 120,
    },
    ease: "none",
    duration: 0.1,
  });
});

// Scroll to Call To Action Form at Footer
const callToActionButtons = document.querySelectorAll(".nav__button, .promo__button, .steps__button");
callToActionButtons.forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    gsap.to(window, {
      scrollTo: {
        y: "#footer",
      },
      ease: "none",
      duration: 0.1,
    });
  });
});