// Vérifier que les données du formulaires sont valables

// 1 --- Depuis la page Panier, récupérer le panier et ses éléments via localStorage
let produitDuPanier = JSON.parse(localStorage.getItem("panier"));
console.log(produitDuPanier);

// 2 --- On vérifie s'il y a des articles dans le panier, si oui, on les affiche

// on cible l'emplacement
const cartItem = document.getElementById("cart__items");
//si le panier ne contient aucun article
if (produitDuPanier === null) {
  // indiquer que le panier est vide
  alert("Votre panier est vide, veuillez séléctionner au moins un article");
} else {
  //SINON
  //on définis les variables nécessaire au calcul du total en dehors de la boucle
  let totalPrice = [];
  let totalQuantity = [];
  //on crée la boucle permettant d'afficher les produits du panier
  for (let i = 0; i < produitDuPanier.length; i++) {
    //On isole l'id du produit + couleur et qty
    let productId = produitDuPanier[i].id;
    let productColor = produitDuPanier[i].color;
    let productQuantity = produitDuPanier[i].quantity;

    // utiliser fetch pour récupérer et afficher les infos complètes de chaque article
    fetch(`http://localhost:3000/api/products/${productId}`)
      .then((response) => response.json())
      .then((product) => {
        // console.log(product, produitDuPanier[i]);
        cartItem.innerHTML += `               <article class="cart__item" data-id="${productId}" data-color="${productColor}">
        <div class="cart__item__img">
          <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${product.name}</h2>
            <p>${productColor}</p>
            <p>${product.price}</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productQuantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`;
        // Calcul de la quantité et du prix total

        function calculTotal() {
          // quantity total
          totalQuantity.push(productQuantity);

          // prix total
          let productPrice = product.price;
          let sousTotal = productPrice * productQuantity;
          totalPrice.push(sousTotal);

          // on fait le calul grace a la fonction reducer
          let reducer = (accumulator, currentValue) =>
            accumulator + currentValue;
          let TotalQuantityPanier = totalQuantity.reduce(reducer, 0);
          let TotalPricePanier = totalPrice.reduce(reducer, 0);

          // on affiche le total et le nombre d'article
          let quantity = document.getElementById("totalQuantity");
          quantity.textContent = ` ${TotalQuantityPanier}`;
          let total = document.getElementById("totalPrice");
          total.textContent = `${TotalPricePanier}`;
        }
        calculTotal();
        // Gestion de la suppression de produit et changement de quantité
        // Modification qté
        let productCard = document.querySelectorAll(".cart__item");
        let itemQuantity = document.querySelectorAll(".itemQuantity");
        console.log(productCard);

        for (let i = 0; i < productCard.length; i++) {
          let quantity = itemQuantity[i];
          let article = produitDuPanier[i];
          quantity.addEventListener("change", (e) => {
            console.log(e.target.value);
            article.quantity = parseInt(e.target.value); // la quantité
            localStorage.setItem("panier", JSON.stringify(produitDuPanier));
            console.log(article.quantity);
            //mettre à jour le prix total
          });
        }

        //           fonction qui permet de supprimer un produit du panier
        // a mettre dans evenlistener sur btn supprimer
        // function removeProduct(product, produitDuPanier) {
        //   produitDuPanier = produitDuPanier.filter((p) => p.id != product.id); // on supprime l'élément qui a le meme id que product
        //   localStorage.setItem("panier", JSON.stringify(produitDuPanier));
        // }
        // removeProduct();
      });
  }
}

// 3 --- Modifictaion du panier

// productQuantity = e.target.value;
// localStorage.setItem("panier", JSON.stringify(produitDuPanier));
// calculTotal();

// //fonction qui permet de modifier la quantité d'un produit ( A REVOIR)
// // a mettre dans evenlistener sur btn qté input
// //Aussi, la méthode Element.closest() devrait permettre de cibler le produit que vous souhaitez supprimer (où dont vous souhaitez
// //modifier la quantité) grâce à son identifiant et sa couleur.

// function changeQuantity(product, quantity, produitDuPanier) {
//   let foundProduct = produitDuPanier.find((p) => p.id == product.id); // on modifie la quantité du produit qui a le meme id que product
//   if (foundProduct != undefined) {
//     foundProduct.quantity = quantity;
//     if (foundProduct <= 0) {
//       removeProduct(product);
//     } else {
//       localStorage.setItem("panier", JSON.stringify(produitDuPanier));
//     }
//   }
//   changeQuantity();
// }
