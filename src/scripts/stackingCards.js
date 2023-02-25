// Parameters of the Header of the Section with Cards
const headerOfSectionWithCards = document.querySelector(".tasks__text-block");
let computedStylesOfHeader;
let textBlockHeight;
let textBlockMarginBottom;
let textBlockFixationMargin;

// Parameters of cards
const allCards = document.querySelectorAll(".stack-cards__item");
const amountOfCards = allCards.length;
let computedStylesOfCard;
let marginBetweenCardsInsideStack;
let cardHeight;

gsap.registerPlugin(ScrollTrigger);

// Initialize animations for each card
const cards = gsap.utils.toArray(".stack-cards__item");
cards.forEach((card, index) => {

  // Animation of scaling each card
  gsap.to(card, {
    scale: () => 1 - (cards.length - index) * 0.025,
    transformOrigin: "center top",
    ease: "none",
    scrollTrigger: {
      trigger: card,
      start: () => `top bottom-=100`,
      end: () => `top top+=40`,
      scrub: true,
      invalidateOnRefresh: true
    },
  });

  // Fade-in animation for each card
  gsap.to(card, {
    opacity: 1,
    scrollTrigger: {
      trigger: card,
      start: () => `top bottom-=50`,
      // The card must be completely opaque by the time it is attached to the deck
      end: () => `top ${textBlockHeight + textBlockMarginBottom + textBlockFixationMargin + cardHeight + marginBetweenCardsInsideStack * index}px`,
      scrub: true,
      invalidateOnRefresh: true
    },
  });

  // Card fixation in the stack
  ScrollTrigger.create({
    trigger: card,
    // Fix each card on an individual edge inside Viewport - when its top reaches the desired indent under the section heading
    start: () => `top ${textBlockHeight + textBlockMarginBottom + textBlockFixationMargin + marginBetweenCardsInsideStack * index}px`,
    // We will use the last card in the set as the end trigger
    endTrigger: () => allCards[allCards.length - 1],
    // Touching the top of the last card from the set of it's fixation edge in the Viewport will also be the end the fixation moment for ALL cards in the deck
    end: () => `top ${textBlockHeight + textBlockMarginBottom + textBlockFixationMargin + marginBetweenCardsInsideStack * (amountOfCards - 1)}px`,
    pin: true,
    pinSpacing: false,
    invalidateOnRefresh: true,
  });
});

// Fixation for Header of the section with cards
ScrollTrigger.create({
  trigger: ".tasks__text-block",
  start: () => `top ${textBlockFixationMargin}px`,
  // Exactly the same values of endTrigger and end as the animation of fixing cards in the stack so that they undock and leave synchronously
  endTrigger: () => allCards[allCards.length - 1],
  // Touching the top of the last card from the set of it's fixation edge in the Viewport will also be the end the fixation moment for ALL cards in the deck
  end: () => `top ${textBlockHeight + textBlockMarginBottom + textBlockFixationMargin + marginBetweenCardsInsideStack * (amountOfCards - 1)}px`,
  pin: true,
  pinSpacing: false,
  invalidateOnRefresh: true,
});

// Optimized recalculation all values that are used in several "start" and "end" fields
// Will be automatically called each time on refresh event (for example when viewport is resized)
ScrollTrigger.addEventListener("refreshInit", () => {

  // Get parameters of the Header of the Section with Cards
  computedStylesOfHeader = window.getComputedStyle(headerOfSectionWithCards);
  textBlockHeight = headerOfSectionWithCards.offsetHeight;
  textBlockMarginBottom = parseInt(computedStylesOfHeader.getPropertyValue("--margin-bottom"));
  textBlockFixationMargin = document.querySelector(".header").offsetHeight;

  // Get parameters of cards
  computedStylesOfCard = window.getComputedStyle(allCards[0]);
  marginBetweenCardsInsideStack = parseInt(computedStylesOfCard.getPropertyValue("--margin-inside-stack"));
  cardHeight = parseInt(computedStylesOfCard.height);
});