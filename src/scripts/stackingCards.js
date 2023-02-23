function getParametersForCardsAndHeader() {
  // Get parameters of the Header of the Section with Cards
  const headerOfSectionWithCards = document.querySelector(".tasks__text-block");
  const computedStylesOfHeader = window.getComputedStyle(headerOfSectionWithCards);
  const textBlockHeight = headerOfSectionWithCards.offsetHeight;
  const textBlockMarginBottom = parseInt(computedStylesOfHeader.getPropertyValue("--margin-bottom"));
  const textBlockFixationMargin = parseInt(computedStylesOfHeader.getPropertyValue("--top-fixation-margin"));

  // Get parameters of cards
  const allCards = document.querySelectorAll(".stack-cards__item");
  const computedStylesOfCard = window.getComputedStyle(allCards[0]);
  const marginBetweenCardsInsideStack = parseInt(computedStylesOfCard.getPropertyValue("--margin-inside-stack"));
  const amountOfCards = allCards.length;
  const cardHeight = parseInt(computedStylesOfCard.height);

  return {textBlockHeight, textBlockMarginBottom, textBlockFixationMargin, marginBetweenCardsInsideStack, amountOfCards, cardHeight};
}

gsap.registerPlugin(ScrollTrigger);

// Initialize animations for each card
const cards = gsap.utils.toArray(".stack-cards__item");
cards.forEach((card, index) => {
  // Animation of scaling
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

  // Fade-in animation for cards
  gsap.to(card, {
    opacity: 1,
    scrollTrigger: {
      trigger: card,
      start: () => `top bottom-=50`,
      // The card must be completely opaque by the time it is attached to the deck
      end: () => {
        const {textBlockHeight, textBlockMarginBottom, textBlockFixationMargin, marginBetweenCardsInsideStack, cardHeight} = getParametersForCardsAndHeader();
        return `top ${textBlockHeight + textBlockMarginBottom + textBlockFixationMargin + cardHeight + marginBetweenCardsInsideStack * index}px`;
      },
      scrub: true,
      invalidateOnRefresh: true
    },
  });

  // Card fixation in the stack
  ScrollTrigger.create({
    trigger: card,
    // Fix each card on an individual edge inside Viewport - when its top reaches the desired indent under the section heading
    start: () => {
      const {textBlockHeight, textBlockMarginBottom, textBlockFixationMargin, marginBetweenCardsInsideStack} = getParametersForCardsAndHeader();
      return `top ${textBlockHeight + textBlockMarginBottom + textBlockFixationMargin + marginBetweenCardsInsideStack * index}px`;
    },
    // We will use the last card in the set as the end trigger
    endTrigger: () => {
      const allCards = document.querySelectorAll(".stack-cards__item");
      return allCards[allCards.length - 1];
    },
    // Touching the top of the last card from the set of it's fixation edge in the Viewport will also be the end the fixation moment for ALL cards in the deck
    end: () => {
      const {textBlockHeight, textBlockMarginBottom, textBlockFixationMargin, marginBetweenCardsInsideStack, amountOfCards} = getParametersForCardsAndHeader();
      return `top ${textBlockHeight + textBlockMarginBottom + textBlockFixationMargin + marginBetweenCardsInsideStack * (amountOfCards - 1)}px`;
    },
    pin: true,
    pinSpacing: false,
    invalidateOnRefresh: true,
  });
});

// Fixation for Header of the section with cards
ScrollTrigger.create({
  trigger: ".tasks__text-block",
  start: () => `top ${20}px`,
  // Exactly the same values of endTrigger and end as the animation of fixing cards in the stack so that they undock and leave synchronously
  endTrigger: () => {
    const allCards = document.querySelectorAll(".stack-cards__item");
    return allCards[allCards.length - 1];
  },
  // Touching the top of the last card from the set of it's fixation edge in the Viewport will also be the end the fixation moment for ALL cards in the deck
  end: () => {
    const {textBlockHeight, textBlockMarginBottom, textBlockFixationMargin, marginBetweenCardsInsideStack, amountOfCards} = getParametersForCardsAndHeader();
    return `top ${textBlockHeight + textBlockMarginBottom + textBlockFixationMargin + marginBetweenCardsInsideStack * (amountOfCards - 1)}px`;
  },
  pin: true,
  pinSpacing: false,
  invalidateOnRefresh: true,
});
