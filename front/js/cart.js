//AFFICHAGE DU RECAPITULATIF DES ACHATS

// récupère les données du panier dans le localStorage
function getItemsFromCart() {
  return JSON.parse(localStorage.getItem("cart"));
}
//MISE A JOUR DU PANIER

//GESTION DES MODIFICATIONS

// Suppression produit
function deleteItem(produitId, produitColor) {
  const panier = getItemsFromCart();
  const newPanier = panier.filter((item) => {
    if (item.id === produitId && item.color === produitColor) {
      return false;
    } else {
      return true;
    }
  });
  // ajout au localStorage
  localStorage.setItem("cart", JSON.stringify(newPanier));
  // met à jour le panier
  loadCart();
}
//modifications du Panier
function updateQty(produitId, produitColor, produitQty) {
  const panier = getItemsFromCart();
  // teste les données du panier
  const pos = panier.findIndex(
    (item) => item.id === produitId && item.color === produitColor
  );
  panier[pos].qty = produitQty;
  // sauvegarde la qté dans localStorage
  localStorage.setItem("cart", JSON.stringify(panier));
  //affiche le panier
  loadCart();
}

// création de produit
async function createProducts() {
  // récupère le panier
  let panier = getItemsFromCart();
  // initialise le prix et la qté à 0
  let prixTotal = 0;
  let quantiteTotal = 0;
  // et contenu html comme vide
  let contentHtml = "";

  // s'il y a des produits dans panier
  if (panier != null) {
    // crée une boucle des produits du panier pour parcourir le tableau
    for (const produit of panier) {
      let produitId = produit.id;
      let produitColor = produit.color;
      let produitQuantity = produit.qty;

      // utilise la méthode fetch pour récupérer produits de l'API
      await fetch(`http://localhost:3000/api/products/${produitId}`)
        .then((res) => res.json())
        .then((produitApi) => {
          let produitImage = produitApi.imageUrl;
          let produitAlt = produitApi.altTxt;
          let produitNom = produitApi.name;
          let produitPrix = produitApi.price;
          let total = produitPrix * produitQuantity;

          // insère éléments dans page panier
          contentHtml += `<article class="cart__item item_${produitId}" data-id="${produitId}" data-color="${produitColor}">
              <div class="cart__item__img">
                <img src="${produitImage}" alt="${produitAlt}">
              </div>
              <div class="cart__item__content">
                <div class="cart__item__content__titlePrice">
                  <h2>${produitNom}</h2>
                  <p id="color">${produitColor}</p>
                  <p data-name="prix" id="prix">${total} €</p>
                </div>
                <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p id="quantite">Qté : ${produitQuantity} </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${produitQuantity}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                  </div>
                </div>
              </div>
            </article>`;
          //ajoute le prix total et la qté aux valeurs initiales
          prixTotal = parseInt(prixTotal) + parseInt(total);
          document.getElementById("totalPrice").innerHTML = prixTotal;
          quantiteTotal = parseInt(quantiteTotal) + parseInt(produitQuantity);
          document.getElementById("totalQuantity").innerHTML = quantiteTotal;
        })
        // sinon on retourne une erreur
        .catch(function (err) {
          console.log("erreur");
        });
    }
    // affichage si panier vide
  } else {
    contentHtml = "Votre panier est vide";
    document.getElementById("totalPrice").innerHTML = document.getElementById(
      "totalQuantity"
    ).innerHTML = 0;
  }
  document.getElementById("cart__items").innerHTML = "";
  document.getElementById("cart__items").innerHTML = contentHtml;
}

// gestion de l'événement click
function handleEvents() {
  let supprimer = document.querySelectorAll(".deleteItem");
  let quantites = document.querySelectorAll(".itemQuantity");

  // on appelle deleteItem et updateQty au click
  // gère l'evt click
  supprimer.forEach((suppr) => {
    suppr.addEventListener("click", function (event) {
      const item = event.target.closest("article");
      const itemId = item.dataset.id;
      const itemColor = item.dataset.color;
      deleteItem(itemId, itemColor);
    });
  });
  //gère evt modification de la qté
  quantites.forEach((element) => {
    element.addEventListener("change", function (event) {
      const item = event.target.closest("article");
      const itemId = item.dataset.id;
      const produitQty = event.target.value;
      const itemColor = item.dataset.color;
      updateQty(itemId, itemColor, produitQty);
    });
  });
}

// chargement du panier
async function loadCart() {
  const products = await createProducts();
  handleEvents(); // ajoute événement
}

loadCart(); // charge panier

//DONNEES DU FORMULAIRE
// on récupère une chaîne à utiliser en HTML
function escapeHtml(unsafe) {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
// gestion du formulaire
function checkForm() {
  // regExp pour vérifier données saisies par utilisateur
  let emailReg =
    /^([a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*)@([a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,})$/g;
  let regAdress = /^(([a-zA-Zà-ùÀ-Ù0-9\-\.']+)(\ )?){0,7}$/g;
  let reg = /^(([a-zA-Zà-ùÀ-Ù\-\.']+)(\ )?){0,7}$/g;
  //récupère les valeurs saisies par utilisateurs
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const email = document.getElementById("email").value;

  // gestion des erreurs et incrémentation des résultats
  function erreur(erreur, donnee) {
    erreur.innerHTML = `${escapeHtml(donnee)} est invalide`;
  }
  let falseCount = 0;

  // vérifie que les données saisies correspondent aux regEx et affichage messages d'erreurs
  if (!firstName.match(reg)) {
    const prenom = document.getElementById("firstNameErrorMsg");
    erreur(prenom, firstName);
    falseCount++;
  }
  if (!lastName.match(reg)) {
    const nom = document.getElementById("lastNameErrorMsg");
    erreur(nom, lastName);
    falseCount++;
  }
  if (!address.match(regAdress)) {
    const adresse = document.getElementById("addressErrorMsg");
    erreur(adresse, address);
    falseCount++;
  }
  if (!city.match(reg)) {
    const ville = document.getElementById("cityErrorMsg");
    erreur(ville, city);
    falseCount++;
  }
  if (!email.match(emailReg)) {
    const mail = document.getElementById("emailErrorMsg");
    erreur(mail, email);
    falseCount++;
  } else {
    if (falseCount === 0) {
      return true;
    } else {
      return false;
    }
  }
}

// ENVOI DES DONNÉES DU FORMULAIRE
function send() {
  //envoie les données à l'Api et redirige vers page confirmation
  const isFormValid = checkForm();
  if (isFormValid) {
    //crée un nouvel objet contact et 1 tableau de produits :
    let panier = getItemsFromCart();
    let products = new Array();
    panier.forEach((element) => {
      products.push(element.id);
    });
    let contact = {
      contact: {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value,
      },
      products: products,
    };
    //requête POST pour transmettre objet contact à l'API en sérialisant données en JSON
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    })
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      //redirige vers page confirmation et récupére ID de commande et le supprime du localStorage
      .then(function (res) {
        document.location.href = `confirmation.html?orderId=${res.orderId}`;
        localStorage.clear();
      });
  } else {
    alert("Le formulaire est mal rempli.");
  }
}

//envoi du formulaire au click sur bouton Commander
document.getElementById("order").addEventListener("click", function (e) {
  e.preventDefault();
  send();
});
