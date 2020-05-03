document.querySelector('#submit').addEventListener('click', (e) => submitSearch(e));

function submitSearch(e) {
  e.preventDefault();

  const url = document.querySelector("#url").value;
  const targetPrice = document.querySelector("#price").value;
  const email = document.querySelector("#email").value;

  const container = document.querySelector("#output");
  const loading = newEl("h2", { innerText: "Loading", class: "loading" });
  container.prepend(loading);

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
        container.removeChild(loading);
        container.prepend(header);
      } else {
        const { name, price } = data;
        const header = newEl("h2", { innerText: "Track started:" });
        const productName = newEl("span", { innerHTML: `Product: <strong>${name}</strong>` });
        const currentPrice = newEl("span", { innerHTML: `Current price: <strong>${price} kr</strong>` });
        const searchPrice = newEl("span", { innerHTML: `Target price: <strong>${targetPrice} kr</strong>` });
        const emailAdress = newEl("span", { innerHTML: `Email: <strong>${email}</strong>` });

        container.removeChild(loading);
        container.prepend(emailAdress);
        container.prepend(searchPrice);
        container.prepend(currentPrice);
        container.prepend(productName);
        container.prepend(header);
      }
    })
    .catch(error => {
      console.log(error)
      const header = newEl("h2", { innerText: "Något gick fel, försök igen senare." });
      container.removeChild(loading);
      container.prepend(header);
    });
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

