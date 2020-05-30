document.querySelector('#submit').addEventListener('click', (e) => submitSearch(e));

function submitSearch(e) {
  e.preventDefault();

  const url = document.querySelector("#url").value;
  let targetPrice = document.querySelector("#price").value;
  const email = document.querySelector("#email").value;
  const errorUrl = document.querySelector("#error-url");
  const errorPrice = document.querySelector("#error-price");
  const errorEmail = document.querySelector("#error-email");
  const messageContainer = document.querySelector("#output");

  if (ValidateUrl(url, errorUrl) && ValidatePrice(targetPrice, errorPrice) && ValidateEmail(email, errorEmail)) {

    const loading = newEl("h2", { innerText: "Loading", class: "loading" });
    messageContainer.prepend(loading);

    targetPrice = +targetPrice;

    fetch("http://localhost:3000/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url, targetPrice, email })
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          const header = newEl("h2", { innerText: data.message });
          messageContainer.removeChild(loading);
          messageContainer.prepend(header);
        } else {
          const { name, price } = data;
          const header = newEl("h2", { innerText: "Track started:" });
          const productName = newEl("span", { innerHTML: `Product: <strong>${name}</strong>` });
          const currentPrice = newEl("span", { innerHTML: `Current price: <strong>${price} $</strong>` });
          const searchPrice = newEl("span", { innerHTML: `Target price: <strong>${targetPrice} $</strong>` });
          const emailAdress = newEl("span", { innerHTML: `Email: <strong>${email}</strong>` });

          messageContainer.removeChild(loading);
          messageContainer.prepend(emailAdress);
          messageContainer.prepend(searchPrice);
          messageContainer.prepend(currentPrice);
          messageContainer.prepend(productName);
          messageContainer.prepend(header);
        }
      })
      .catch(error => {
        const header = newEl("h2", { innerText: "Something went wrong. Try again later." });
        messageContainer.removeChild(loading);
        messageContainer.prepend(header);
      });
  }
}

function newEl(type, attrs = {}) {
  const el = document.createElement(type);
  for (let attr in attrs) {
    const value = attrs[attr];
    if (attr == "innerText") el.innerText = value;
    else if (attr == "innerHTML") el.innerHTML = value;
    else el.setAttribute(attr, value);
  }
  return el;
}

function ValidateEmail(inputText, errorMessage) {
  const mailformat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  if (inputText.match(mailformat)) {
    errorMessage.innerText = "";
    return true;
  }
  else {
    document.querySelector("#email").focus();
    errorMessage.innerText = "Invalid email address";
    return false;
  }
}

function ValidateUrl(inputText, errorMessage) {
  if (inputText.includes("https://www.amazon")) {
    errorMessage.innerText = "";
    return true;
  }
  else {
    document.querySelector("#url").focus();
    errorMessage.innerText = "Invalid adress";
    return false;
  }
}

function ValidatePrice(inputText, errorMessage) {
  if (+inputText > 0) {
    errorMessage.innerText = "";
    return true;
  }
  else {
    document.querySelector("#price").focus();
    errorMessage.innerText = "Price need to be a positive number";
    return false;
  }
}