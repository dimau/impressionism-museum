import "../styles/normalizer.scss";
import "../styles/fonts.scss";
import "../styles/button.scss";
import "../styles/input-text.scss";
import "../styles/index.scss";
import "../styles/header.scss";
import "../styles/promo.scss";
import "../styles/bonuses.scss";
import "../styles/stackingCards.scss";
import { StackingCardsManager } from "./stackingCards";
import "../styles/tasks.scss";
import "../styles/steps.scss";
import "../styles/about.scss";
import "../styles/accordion.scss";
import { Accordion } from "./accordion";
import "../styles/faq.scss";
import "../styles/footer.scss";

// Initialization Stacking Cards component
new StackingCardsManager(".stack-cards", {
  callbackAfterFixingFirstCard: () => {
    const header = document.querySelector(".tasks__text-block");
    if (!header) return;
    const top = header.getBoundingClientRect().top;
    header.style.position = "fixed";
    header.style.top = `${top}px`;
  },
  callbackAfterFixingLastCard: () => {
    const header = document.querySelector(".tasks__text-block");
    if (!header) return;
    const top = header.getBoundingClientRect().top;
    header.style.position = "absolute";
    header.style.top = `${top + window.pageYOffset}px`;
  },
  callbackAfterUnfixingFirstCard: () => {
    const header = document.querySelector(".tasks__text-block");
    if (!header) return;
    header.style.position = "";
    header.style.top = "";
  },
  callbackAfterUnfixingLastCard: () => {
    const header = document.querySelector(".tasks__text-block");
    if (!header) return;
    const top = header.getBoundingClientRect().top;
    header.style.position = "fixed";
    header.style.top = `${top}px`;
  },
});

// Initialization Accordion component
new Accordion(document.querySelector(".accordion"), {
  alwaysOpen: false,
});
