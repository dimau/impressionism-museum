import "../styles/normalizer.scss";
import "../styles/fonts.scss";
import "../styles/button.scss";
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
new StackingCardsManager(".stack-cards");

// Initialization Accordion component
new Accordion(document.querySelector('.accordion'), {
  alwaysOpen: false,
});