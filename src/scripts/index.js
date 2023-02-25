// Styles basic and specific for each section
import "../styles/normalizer.scss";
import "../styles/fonts.scss";
import "../styles/button.scss";
import "../styles/input-text.scss";
import "../styles/index.scss";
import "../styles/header.scss";
import "../styles/promo.scss";
import "../styles/bonuses.scss";
import "../styles/tasks.scss";
import "../styles/steps.scss";
import "../styles/about.scss";
import "../styles/accordion.scss";
import "../styles/faq.scss";
import "../styles/footer.scss";

// JS for components
import "./stackingCards";
import {Accordion} from "./accordion";
import "./horizontalAnimatedScroll";
import "./emailSender";
import "./headerAnimation";

// Initialization Accordion component
new Accordion(document.querySelector(".accordion"), {
  alwaysOpen: false,
});
