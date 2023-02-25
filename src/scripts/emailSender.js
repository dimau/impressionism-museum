const formId = "footer__form";
const formElem = document.getElementById(formId);
formElem.addEventListener("submit", e => e.preventDefault());

const sendButton = formElem.querySelector(".footer__button");
sendButton.addEventListener("click", submitHandler);

const repeatButton = formElem.querySelector(".footer__one-more-button");
repeatButton.addEventListener("click", onRepeatButton);

const data = {
  "access_token": "fvgf3wjj6vjgnapxsxnwhp0z"
};


function submitHandler() {
  sendButton.disabled = true;

  // Show loader inside button instead of default message
  formElem.querySelector(".footer__form-button-default-text").style.display = "none";
  formElem.querySelector(".footer__form-button-loader").style.display = "block";

  // If the previous try to send data was failed we should to hide fail message
  formElem.querySelector(".footer__form-fail-message").style.display = "none";

  const request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      onSuccess();
    } else if (request.readyState === 4) {
      onError(request.response);
    }
  };

  const subject = "Новое обращение с сайта"
  const message = formElem.querySelector(".footer__input").value;
  data['subject'] = subject;
  data['text'] = message;
  const params = toParams(data);

  request.open("POST", "https://postmail.invotes.com/send", true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(params);

  return false;
}

function toParams(data) {
  const formData = [];
  for (const key in data) {
    formData.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
  }
  return formData.join("&");
}

function onSuccess() {
  sendButton.disabled = false;

  // Change text to default
  formElem.querySelector(".footer__form-button-loader").style.display = "none";
  formElem.querySelector(".footer__form-button-default-text").style.display = "";

  // Instead of submit button we are going to show another button
  formElem.querySelector(".footer__button").style.display = "none";
  formElem.querySelector(".footer__one-more-button").style.display = "block";

  // Instead of input we are going to show success message text
  formElem.querySelector(".footer__input").style.display = "none";
  formElem.querySelector(".footer__form-success-message").style.display = "flex";
}

function onError(error) {
  sendButton.disabled = false;

  // Change text to default
  formElem.querySelector(".footer__form-button-loader").style.display = "none";
  formElem.querySelector(".footer__form-button-default-text").style.display = "";

  // Show message about error
  formElem.querySelector(".footer__form-fail-message").style.display = "flex";
}

function onRepeatButton() {
  // Instead of repeatButton we are going to show submit button again
  formElem.querySelector(".footer__button").style.display = "";
  formElem.querySelector(".footer__one-more-button").style.display = "none";

  // Instead of success message we are going to show input again
  formElem.querySelector(".footer__input").style.display = "";
  formElem.querySelector(".footer__form-success-message").style.display = "none";
}
