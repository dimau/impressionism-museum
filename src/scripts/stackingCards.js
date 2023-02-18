export class StackingCardsManager {
  stackingCardsDOMElements = [];
  stackingCardsArray = [];
  _customEvent = new CustomEvent("resize-all-stacking-cards");

  constructor(elementsSelector = ".stack-cards", options = {}) {
    // Gather list of all Stacking Cards DOM elements on the page
    if (typeof elementsSelector === "string") {
      this.stackingCardsDOMElements =
        document.querySelectorAll(elementsSelector);
    } else if (elementsSelector instanceof HTMLElement) {
      this.stackingCardsDOMElements = [elementsSelector];
    } else {
      console.warn("Can't find DOM elements for Stacking cards on the page");
    }

    // Check that current browser supports IntersectionObserver API
    const intersectionObserverSupported =
      "IntersectionObserver" in window &&
      "IntersectionObserverEntry" in window &&
      "intersectionRatio" in window.IntersectionObserverEntry.prototype;
    // Check that user allows animations
    const reducedMotion = this.osHasReducedMotion();

    // If there are any Stacking Cards on the page and we have technical opportunity to add animation to them
    if (
      this.stackingCardsDOMElements.length > 0 &&
      intersectionObserverSupported &&
      !reducedMotion
    ) {
      // Initialize all Stacking Cards components
      for (let i = 0; i < this.stackingCardsDOMElements.length; i++) {
        this.stackingCardsArray.push(
          new StackingCards(this.stackingCardsDOMElements[i], options)
        );
      }

      // Handle resizing of the viewport
      let resizingId = false;
      window.addEventListener("resize", () => {
        if (resizingId) clearTimeout(resizingId);
        resizingId = setTimeout(() => this.doneResizing(), 500);
      });
    }
  }

  // Метод для проверки, выставлена ли настройка в браузере, чтобы система
  // минимизировала количество второстепенных анимаций
  osHasReducedMotion() {
    if (!window.matchMedia) return false;
    const matchMediaObj = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (matchMediaObj) return matchMediaObj.matches;
    return false;
  }

  // Обработчик события изменения размеров viewport - оповещаем об этом событии все компоненты
  doneResizing() {
    for (let i = 0; i < this.stackingCardsArray.length; i++) {
      this.stackingCardsArray[i].element.dispatchEvent(this._customEvent);
    }
  }
}

class StackingCards {
  element = null; // Corresponding DOM element for this Stacking Cards component
  items = []; // Array of corresponding DOM elements for all cards inside of the Stacking Cards component
  scrollingFn = false; // Callback handler that will be executed when scroll event occurs and component is in the viewport
  scrolling = false; // Flag, if scrolling == true that's mean that new iteration of animation is requested
  windowHeight = 0; // Height of the window

  // Component wrapper properties
  marginY = 0; // Distance between cards from "--stack-cards-gap"
  elementHeight = 0; // Full actual height of the Stacking Cards component on the page

  // First card properties
  cardTop = 0; // Margin from the top of the viewport where the first card will be fixed
  cardHeight = 0; // Actual height of the first card

  // For tracking moment when we should call callbacks
  isFirstCardFixed = false;
  isLastCardFixed = false;
  callbackAfterFixingFirstCard = () => {};
  callbackAfterFixingLastCard = () => {};
  callbackAfterUnfixingLastCard = () => {};
  callbackAfterUnfixingFirstCard = () => {};

  constructor(element, options = {}) {
    // Enrich options with default values
    const defaultOptions = {
      classForItems: "stack-cards__item", // Class name for items (cards) of this Stacking Cards component
      callbackAfterFixingFirstCard: () => {}, // It's useful for fixing header of the section for example
      callbackAfterFixingLastCard: () => {}, // It's useful for unfixing header of the section for example
    };
    options = Object.assign(defaultOptions, options);

    this.element = element;
    this.items = this.element.getElementsByClassName(options.classForItems);
    this.callbackAfterFixingFirstCard = options.callbackAfterFixingFirstCard;
    this.callbackAfterFixingLastCard = options.callbackAfterFixingLastCard;
    this.callbackAfterUnfixingFirstCard =
      options.callbackAfterUnfixingFirstCard;
    this.callbackAfterUnfixingLastCard = options.callbackAfterUnfixingLastCard;
    this.scrollingFn = false;
    this.scrolling = false;
    this.initStackCardsEffect();
    this.initStackCardsResize();
  }

  // Using IntersectionObserver browser API we ask browser
  // to call "stackCardsCallback" method when
  // - StackingCards component starting appear on the screen
  // - StackingCards component finishing appear on the screen (fully visible)
  initStackCardsEffect() {
    this.setStackCards();
    const observer = new IntersectionObserver(
      (entries) => this.stackCardsCallback(entries),
      { threshold: [0, 1] }
    );
    observer.observe(this.element);
  }

  // Detect resize to reset gallery
  initStackCardsResize() {
    this.element.addEventListener("resize-all-stacking-cards", () => {
      this.setStackCards();
      this.animateStackCards();
    });
  }

  // Intersection Observer callback
  // Add method "stackCardsScrolling" as scrolling event handler
  // when component is inside the Viewport
  stackCardsCallback(entries) {
    if (entries[0].isIntersecting) {
      // Component is inside the viewport - add scroll listener
      if (this.scrollingFn) return; // listener for scroll event already added
      this.scrollingFn = this.stackCardsScrolling.bind(this);
      window.addEventListener("scroll", this.scrollingFn);
    } else {
      // Component is outside the viewport - remove scroll listener
      if (!this.scrollingFn) return; // listener for scroll event already removed
      window.removeEventListener("scroll", this.scrollingFn);
      this.scrollingFn = false;
    }
  }

  // Asks the browser to call an "animateStackCards" method on every scroll event
  // when the component is inside the Viewport
  stackCardsScrolling() {
    if (this.scrolling) return; // If we already requested a new iteration of animation and it's not done yet, nothing to do
    this.scrolling = true; // Set a flag that we need a new iteration of animation because of new event of scroll
    // Ask browser to plan a call of "animateStackCards" method before nearest re-paint
    window.requestAnimationFrame(() => this.animateStackCards());
  }

  setStackCards() {
    // Automatically bring the height of all cards to the maximum value
    this.normalizeCardsHeight();

    // store wrapper properties
    this.marginY = getComputedStyle(this.element).getPropertyValue(
      "--stack-cards-gap"
    );
    this.getIntegerFromProperty(); // convert element.marginY to integer (px value)
    this.elementHeight = this.element.offsetHeight; // get the full actual height of the Stacking Cards component on the page

    // store card properties
    const cardStyle = getComputedStyle(this.items[0]);
    this.cardTop = Math.floor(parseFloat(cardStyle.getPropertyValue("top")));
    this.cardHeight = Math.floor(
      parseFloat(cardStyle.getPropertyValue("height"))
    );

    // store window property
    this.windowHeight = window.innerHeight;

    // reset margin + translate values
    if (isNaN(this.marginY)) {
      this.element.style.paddingBottom = "0px";
    } else {
      this.element.style.paddingBottom =
        this.marginY * (this.items.length - 1) + "px";
    }

    // Shift cards from each other down by "this.marginY" pixels
    for (let i = 0; i < this.items.length; i++) {
      if (isNaN(this.marginY)) {
        this.items[i].style.transform = "none;";
      } else {
        this.items[i].style.transform = `translateY(${this.marginY * i}px)`;
      }
    }
  }

  // Convert string "this.marginY" (it can be value with px, em, rem...) to integer px value
  getIntegerFromProperty() {
    const node = document.createElement("div");
    node.setAttribute(
      "style",
      `opacity: 0; visibility: hidden; position: absolute; height: ${this.marginY}`
    );
    this.element.appendChild(node);
    this.marginY = parseInt(getComputedStyle(node).getPropertyValue("height"));
    this.element.removeChild(node);
  }

  // Define maximum height among all cards and set this height to all of them
  normalizeCardsHeight() {
    // Clear previous height in inline styles if there is any
    for (const item of this.items) {
      item.style.height = "";
    }

    // Define the maximum height among all cards
    let maxCardHeight = 0;
    for (const item of this.items) {
      const cardStyle = getComputedStyle(item);
      const cardHeight = Math.floor(
        parseFloat(cardStyle.getPropertyValue("height"))
      );
      maxCardHeight = Math.max(maxCardHeight, cardHeight);
    }

    // Set max height for all cards to normalize their height
    for (const item of this.items) {
      item.style.height = `${maxCardHeight}px`;
    }
  }

  // Perform cards animation
  animateStackCards() {
    if (isNaN(this.marginY)) {
      // --stack-cards-gap not defined - do not trigger the effect
      this.scrolling = false;
      return;
    }

    // Current distance in px from the top of viewport to the top border of component
    // It is a negative value when the top border of the component will be above top of viewport (when scrolling)
    let top = this.element.getBoundingClientRect().top;

    if (
      this.cardTop -
        top +
        this.element.windowHeight -
        this.elementHeight -
        this.cardHeight +
        this.marginY +
        this.marginY * this.items.length >
      0
    ) {
      this.scrolling = false;
      return;
    }

    // Changing properties of each card
    for (let i = 0; i < this.items.length; i++) {
      // If the number is negative, it shows how many pixels are left before the position where this card should be fixed
      // If the number is positive, it shows how many pixels the user scrolled the component after fixing this card
      let scrolling = this.cardTop - top - i * (this.cardHeight + this.marginY);

      // For debugging purposes
      // if (i === 0)
      //   console.log({
      //     i,
      //     scrolling,
      //     top,
      //     cardTop: this.cardTop,
      //     isFirstCardFixed: this.isFirstCardFixed,
      //   });

      // When component becoming fixed in the viewport
      if (i === 0 && scrolling >= 0 && this.isFirstCardFixed === false) {
        this.isFirstCardFixed = true;
        this.callbackAfterFixingFirstCard();
      }

      if (
        i === this.items.length - 1 &&
        scrolling >= -1 * i * this.marginY &&
        this.isLastCardFixed === false
      ) {
        this.isLastCardFixed = true;
        this.callbackAfterFixingLastCard();
      }

      if (
        i === this.items.length - 1 &&
        scrolling < -1 * i * this.marginY &&
        this.isLastCardFixed === true
      ) {
        this.isLastCardFixed = false;
        this.callbackAfterUnfixingLastCard();
      }

      if (i === 0 && scrolling < 0 && this.isFirstCardFixed === true) {
        this.isFirstCardFixed = false;
        this.callbackAfterUnfixingFirstCard();
      }

      // Animation of scaling cards in the stack
      if (scrolling > 0) {
        // If card is on it's final Y coordinate on the screen - scaling it
        let scaling =
          i === this.items.length - 1
            ? 1
            : (this.cardHeight - scrolling * 0.05) / this.cardHeight;
        this.items[i].style.transform = `translateY(${
          this.marginY * i
        }px) scale(${scaling})`;
      } else {
        // If card is NOT YET on the it's final Y coordinate on the screen
        this.items[i].style.transform = `translateY(${this.marginY * i}px)`;
      }

      // Animation of fade-in cards
      // if (scrolling < -this.cardHeight) {
      this.items[i].style.opacity = `${1 + scrolling / this.cardHeight}`;
      // }
    }

    // The requested iteration of animation is done
    this.scrolling = false;
  }
}
