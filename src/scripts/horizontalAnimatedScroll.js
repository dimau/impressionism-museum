// Animated horizontal scrolling for bonuses is working only not on touch devices
// Because it's much better for user to use usual horizontal scroll on a touch device
if (ScrollTrigger.isTouch !== 1) {

  // Gather all bonus cards in one array - each of them we are going to animate
  const bonusCards = gsap.utils.toArray(".bonuses__bonus-card");

  // Get a DOM element for the whole block with bonus cards
  const container = document.querySelector(".bonuses__list");

  // Add additional margin based on scroll distance on the user's device
  container.style.marginBottom = `${container.scrollWidth - document.documentElement.clientWidth}px`;

  gsap.to(bonusCards, {
    x: -(container.scrollWidth - document.documentElement.clientWidth),
    ease: "none",
    scrollTrigger: {
      trigger: ".bonuses__list",
      start: "top 25%",
      end: `+=${container.scrollWidth - document.documentElement.clientWidth}`,
      pin: true,
      scrub: 0.1,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
    }
  });
}