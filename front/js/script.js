//récupère les données de l'API :
async function getProducts() {
  await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((produit) => {
      //insère chaque produit dans le DOM
      for (const item of produit) {
        document.querySelector(
          "section"
        ).innerHTML += `<a href="./product.html?id=${item._id}">
                    <article>
                        <img src="${item.imageUrl}" alt="${item.altTxt}">
                        <h3 class="productName">
                            ${item.name}
                        </h3>
                        <p class="productDescription">
                        ${item.description}
                        </p>
                    </article>
                </a>`;
      }
    })
    .catch(function (err) {
      console.log("erreur");
    });
}
//récupère produits de l'API
getProducts();
