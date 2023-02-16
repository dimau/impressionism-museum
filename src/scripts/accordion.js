export class Accordion {

  constructor(target, config) {
    // Если target элемент не передан, то нечего инициализировать
    if (!target) {
      console.warn("Accordion component is downloaded, but can't be applied");
      return;
    }

    // Получаем элемент DOM, который нужно проинициализировать как аккордеон
    this._el = typeof target === "string" ? document.querySelector(target) : target;

    // Дополняем переданные настройки значениями по умолчанию
    const defaultConfig = {
      alwaysOpen: true, // если == false, то при открытии нового контента закрывать предыдущий
      duration: 350,
    };
    this._config = Object.assign(defaultConfig, config);

    // Вызываем метод для отслеживания кликов по заголовкам аккордеона
    this.addEventListener();
  }


  addEventListener() {
    this._el.addEventListener("click", (e) => {
      // Находим заголовок аккордеона, по которому был клик
      const elHeader = e.target.closest(".accordion__header");
      if (!elHeader) return;

      // Если при открытии контента нужно закрывать предыдущий открытый пункт
      if (!this._config.alwaysOpen) {
        const elOpenItem = this._el.querySelector(".accordion__item_show");
        if (elOpenItem) {
          elOpenItem !== elHeader.parentElement ? this.toggle(elOpenItem) : null;
        }
      }

      // Открываем или закрываем пункт, по которому кликнули
      this.toggle(elHeader.parentElement);
    });
  }

  show(el) {
    // Находим контент, соответствующий заголовку, по которому кликнули
    const elBody = el.querySelector(".accordion__body");

    // Если элемент уже открыт или он в процессе открытия - return
    if (
      elBody.classList.contains("collapsing") ||
      el.classList.contains("accordion__item_show")
    ) {
      return;
    }

    // Делаем элемент видимым и запоминаем его естественную высоту
    elBody.style["display"] = "block";
    const height = elBody.offsetHeight;

    // Сразу меняем высоту до 0 пикселей, чтобы затем анимировать его открытие
    elBody.style["height"] = 0;
    elBody.style["overflow"] = "hidden";
    elBody.style["transition"] = `height ${this._config.duration}ms ease`;
    elBody.classList.add("collapsing");
    el.classList.add("accordion__item_slidedown");
    elBody.offsetHeight;
    elBody.style["height"] = `${height}px`;

    // Убираем все выставленные для анимированного открытия свойства с элемента
    // чтобы можно было его схлопнуть
    window.setTimeout(() => {
      elBody.classList.remove("collapsing");
      el.classList.remove("accordion__item_slidedown");
      elBody.classList.add("collapse");
      el.classList.add("accordion__item_show");
      elBody.style["display"] = "";
      elBody.style["height"] = "";
      elBody.style["transition"] = "";
      elBody.style["overflow"] = "";
    }, this._config.duration);
  }

  hide(el) {
    // Находим контент, соответствующий заголовку, по которому кликнули
    const elBody = el.querySelector(".accordion__body");

    // Если элемент уже закрыт или он в процессе закрытия - return
    if (
      elBody.classList.contains("collapsing") ||
      !el.classList.contains("accordion__item_show")
    ) {
      return;
    }

    // Анимируем схлопывание элемента
    elBody.style["height"] = `${elBody.offsetHeight}px`;
    elBody.offsetHeight;
    elBody.style["display"] = "block";
    elBody.style["height"] = 0;
    elBody.style["overflow"] = "hidden";
    elBody.style["transition"] = `height ${this._config.duration}ms ease`;
    elBody.classList.remove("collapse");
    el.classList.remove("accordion__item_show");
    elBody.classList.add("collapsing");

    // Удаляем выставленные при анимировании схлопывания свойства
    // чтобы его можно было снова открыть
    window.setTimeout(() => {
      elBody.classList.remove("collapsing");
      elBody.classList.add("collapse");
      elBody.style["display"] = "";
      elBody.style["height"] = "";
      elBody.style["transition"] = "";
      elBody.style["overflow"] = "";
    }, this._config.duration);
  }

  toggle(el) {
    el.classList.contains('accordion__item_show') ? this.hide(el) : this.show(el);
  }
}