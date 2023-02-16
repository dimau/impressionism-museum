/***
 * Класс для инициализации и управления
 * одним или несколькими компонентами Stacking Cards на странице
 */
export class StackingCardsManager {
  stackingCardsDOMElements = [];
  stackingCardsArray = [];
  _customEvent = new CustomEvent('resize-stack-cards');

  constructor(elementsSelector = ".stack-cards") {
    // Initialize list of all Stacking Cards DOM elements on the page
    this.stackingCardsDOMElements = document.querySelectorAll(elementsSelector);
    const intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
    const reducedMotion = this.osHasReducedMotion();

    // If there are any Stacking Cards on the page and we have technical opportunity to add animation to them
    if (this.stackingCardsDOMElements.length > 0 && intersectionObserverSupported && !reducedMotion) {
      // Initialize all Stacking Cards components
      this.stackingCardsArray = [];
      for (let i = 0; i < this.stackingCardsDOMElements.length; i++) {
        this.stackingCardsArray.push(new StackingCards(this.stackingCardsDOMElements[i]));
      }

      // Handle resizing of the viewport
      let resizingId = false;

      window.addEventListener('resize', () => {
        if (resizingId) clearTimeout(resizingId);
        resizingId = setTimeout(() => this.doneResizing(), 500);
      });
    }
  }

  // Метод для проверки, выставлена ли настройка в браузере, чтобы система
  // минимизировала количество второстепенных анимаций
  osHasReducedMotion() {
    if (!window.matchMedia) return false;
    const matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (matchMediaObj) return matchMediaObj.matches;
    return false;
  };

  // Обработчик события изменения размеров viewport - оповещаем об этом событии все компоненты
  doneResizing() {
    for (let i = 0; i < this.stackingCardsArray.length; i++) {
      this.stackingCardsArray[i].element.dispatchEvent(this._customEvent);
    }
  }
}

/***
 * Класс компонента Stacking Cards
 */
class StackingCards {

  constructor(element) {
    this.element = element; // Соответствующий компоненту - DOM элемент на странице
    this.items = this.element.getElementsByClassName('stack-cards__item'); // DOM элементы для самих карточек внутри компонента
    this.scrollingFn = false; // Ссылка на функцию обработчик (которую повесили на событие скролла если компонент показался во Viewport)
    this.scrolling = false;
    this.initStackCardsEffect();
    this.initStackCardsResize();
  }

  // Функция инициализирует IntersectionObserver чтобы отслеживать,
  // когда компонент входит в область просмотра – и запускать анимацию
  initStackCardsEffect() {
    this.setStackCards(); // store cards CSS properties
    const observer = new IntersectionObserver((entries) => this.stackCardsCallback(entries), {threshold: [0, 1]});
    observer.observe(this.element);
  }

  // Detect resize to reset gallery
  initStackCardsResize() {
    this.element.addEventListener('resize-stack-cards', () => {
      this.setStackCards();
      this.animateStackCards();
    });
  }

  // Intersection Observer callback
  stackCardsCallback(entries) {
    if (entries[0].isIntersecting) { // cards inside viewport - add scroll listener
      if (this.scrollingFn) return; // listener for scroll event already added

      this.scrollingFn = this.stackCardsScrolling.bind(this);
      window.addEventListener('scroll', this.scrollingFn);

    } else { // cards not inside viewport - remove scroll listener

      if (!this.scrollingFn) return; // listener for scroll event already removed

      window.removeEventListener('scroll', this.scrollingFn);
      this.scrollingFn = false;
    }
  }

  // Этот метод будет вызываться на каждое событие скролла
  // когда компонент находится во Viewport
  //
  stackCardsScrolling() {
    if (this.scrolling) return; // Если анимация скролла карточек уже включена, ничего не делаем
    this.scrolling = true; // Выставляем флаг, что анимация скролла карточек включена
    window.requestAnimationFrame(() => this.animateStackCards());
  }

  setStackCards() {
    // store wrapper properties
    this.marginY = getComputedStyle(this.element).getPropertyValue('--stack-cards-gap');
    this.getIntegerFromProperty(); // convert element.marginY to integer (px value)
    this.elementHeight = this.element.offsetHeight;

    // store card properties
    const cardStyle = getComputedStyle(this.items[0]);
    this.cardTop = Math.floor(parseFloat(cardStyle.getPropertyValue('top')));
    this.cardHeight = Math.floor(parseFloat(cardStyle.getPropertyValue('height')));

    // store window property
    this.windowHeight = window.innerHeight;

    // reset margin + translate values
    if (isNaN(this.marginY)) {
      this.element.style.paddingBottom = '0px';
    } else {
      this.element.style.paddingBottom = (this.marginY * (this.items.length - 1)) + 'px';
    }

    for (let i = 0; i < this.items.length; i++) {
      if (isNaN(this.marginY)) {
        this.items[i].style.transform = 'none;';
      } else {
        this.items[i].style.transform = 'translateY(' + this.marginY * i + 'px)';
      }
    }
  }

  // convert this.marginY to integer (px value)
  getIntegerFromProperty() {
    const node = document.createElement('div');
    node.setAttribute('style', 'opacity: 0; visibility: hidden; position: absolute; height: ' + this.marginY);
    this.element.appendChild(node);
    this.marginY = parseInt(getComputedStyle(node).getPropertyValue('height'));
    this.element.removeChild(node);
  }

  // Непосредственно выполняет анимацию для компонента
  animateStackCards() {
    if (isNaN(this.marginY)) { // --stack-cards-gap not defined - do not trigger the effect
      this.scrolling = false;
      return;
    }

    let top = this.element.getBoundingClientRect().top;

    if (this.cardTop - top + this.element.windowHeight - this.elementHeight - this.cardHeight + this.marginY + this.marginY * this.items.length > 0) {
      this.scrolling = false;
      return;
    }

    // Изменение свойств карточки для сдвига по вертикали и масштабирования в колоде
    for (let i = 0; i < this.items.length; i++) { // use only scale
      let scrolling = this.cardTop - top - i * (this.cardHeight + this.marginY);
      if (scrolling > 0) {
        let scaling = i === this.items.length - 1 ? 1 : (this.cardHeight - scrolling * 0.05) / this.cardHeight;
        this.items[i].style.transform = 'translateY(' + this.marginY * i + 'px) scale(' + scaling + ')';
      } else {
        this.items[i].style.transform = 'translateY(' + this.marginY * i + 'px)';
      }
    }

    this.scrolling = false;
  }
}


