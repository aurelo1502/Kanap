// fait le lien entre la page Accueil et la page produit en récupérant l'Id du Produit :
async function getProduct() {
  const str = window.location.href;
  const url = new URL(str);
  const recherche_param = new URLSearchParams(url.search);
  if (recherche_param.has("id")) {
    let produitUrlId = recherche_param.get("id");
    //interroge l'API :
    await fetch(`http://localhost:3000/api/products/${produitUrlId}`)
      .then((res) => res.json())
      // affiche les produits sélectionnés
      .then((produit) => {
        //affiche les données du produit dans le DOM de la page Produit
        document.querySelector(
          ".item__img"
        ).innerHTML = `<img src="${produit.imageUrl}" alt="${produit.altTxt}">`;
        document.getElementById("title").innerHTML = produit.name;
        document.getElementById("price").innerHTML = produit.price;
        document.getElementById("description").innerHTML = produit.description;
        //affiche le choix de la couleur
        produit.colors.forEach((couleur) => {
          document.getElementById(
            "colors"
          ).innerHTML += `<option value="${couleur}">${couleur}</option>`;
          // renomme la page avec le nom du produit
          document.title = produit.name;
        });
      })
      .catch(function (err) {
        console.log("erreur");
      });
    // ajoute produit au panier :
    addItem(produitUrlId);
  }
}
// récupère données du panier
getProduct();

// AJOUT DE PRODUITS AU PANIER
function addItem(id) {
  //mise en place un écouteur de l'évènement click
  let bouton = document.getElementById("addToCart");
  bouton.addEventListener("click", function () {
    //selection de la couleur
    let color = document.getElementById("colors");
    color = color.options[color.selectedIndex].value;
    //selection de la qté
    const qty = document.getElementById("quantity").value;
    //définit un nouvel objet Panier :
    const newItem = {
      id: id,
      qty: qty,
      color: color,
    };
    if (color === '') {
      window.alert('Il est nécessaire de choisir une couleur');}

    // si le panier est déjà sauvegardé récupère les données du localStorage
    else if (
      localStorage.getItem("cart") &&
      localStorage.getItem("cart").length > 0
    ) {
      const cart = JSON.parse(localStorage.getItem("cart"));
      // teste les données du panier
      const productPosition = cart.findIndex(
        (item) => item.id === newItem.id && item.color === newItem.color
      );
      // ajoute le nouvel objet Panier au localStorage
      if (productPosition === -1) {
        cart.push(newItem);
        localStorage.setItem("cart", JSON.stringify(cart));
      } else {
        // si le produit est déjà dans le panier on met à jour la qté
        cart[productPosition].qty =
          parseInt(cart[productPosition].qty) + parseInt(newItem.qty);
        localStorage.setItem("cart", JSON.stringify(cart));
      }
      window.alert("Ce canapé à bien été ajouté");
      //alert
    }  else {
      // si le panier n'existait pas on en crée un nouveau dans le localStorage
      let newCart = new Array();
      newCart.push(newItem);
      localStorage.setItem("cart", JSON.stringify(newCart));
      window.alert("Ce canapé à bien été ajouté");
    }
  });
}