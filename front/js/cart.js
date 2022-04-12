// faire en sorte de pouvoir changer la quantité ou supprimer un produit
// Vérifier que les données du formulaires sont valables

// 1 --- Depuis la page Panier, récupérer le panier et ses éléments via localStorage
let produitDuPanier = JSON.parse(localStorage.getItem("panier"));
console.log(produitDuPanier);

// 2 --- On vérifie s'il y a des articles dans le panier, si oui, on les affiche (A REVOIR)

// on cible l'emplacement
const cartItem = document.getElementById("cart__items");
//si le panier ne contient aucun article
if (produitDuPanier === null) {
  // indiquer que le panier est vide
  alert("Votre panier est vide, veuillez séléctionner au moins un article");
} else {
  //SINON
  for (let i = 0; i < produitDuPanier.length; i++) {
    // console.log(produitDuPanier.length);
    //On isole l'id du produit
    let productId = produitDuPanier[i].id;
    // utiliser fetch pour récupérer les infos complètes de chaque article
    fetch(`http://localhost:3000/api/products/${productId}`)
      .then((response) => response.json())
      .then((product) => {
        console.log(product, produitDuPanier[i]);
        cartItem.innerHTML += `               <article class="cart__item" data-id="${productId}" data-color="{product-color}">
        <div class="cart__item__img">
          <img src="../images/product01.jpg" alt="Photographie d'un canapé">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>Nom du produit</h2>
            <p>Vert</p>
            <p>${product.price}</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`;

        // //créer et insérer les éléments à afficher
        // //article
        // let article = document.createElement("article");
        // console.log(produitDuPanier[i].color);
        // article.className = "cart__item";
        // article.setAttribute("data_id", `${productId}`);
        // article.setAttribute("data_color", `${produitDuPanier[i].color}`);
        // cartItem.append(article);

        // //divImage + image
        // let divImage = document.createElement("div");
        // divImage.className = "cart__item__img";
        // article.append(divImage);
        // let image = document.createElement("img");
        // image.src = product.imageUrl;
        // image.alt = product.altTxt;
        // divImage.append(image);

        // //divItemContent + childs (description et quantité)
        // let divItemContent = document.createElement("div");
        // divItemContent.className = "cart__item__content";
        // divItemContent.append(article);

        // //divdescription (name, color, price)
        // let divDescription = document.createElement("div");
        // divDescription.className = "cart__item__content__description";
        // divItemContent.append(divDescription);
        // let productName = document.createElement("h2");
        // productName.textContent = product.name;
        // divDescription.append(productName);
        // let productColor = document.createElement("p");
        // productColor.textContent = produitDuPanier[i].color;
        // divDescription.append(productColor);
        // let productPrice = document.createElement("p");
        // productPrice.textContent = product.price;
        // divDescription.append(productPrice);

        // //divsettings (divqté(qté + input))
        // let divSettings = document.createElement("div");
        // divSettings.className = "cart__item__content__settings";
        // divItemContent.append(divSettings);
        // let divQuantity = document.createElement("div");
        // divQuantity.className = "cart__item__content__settings__quantity";
        // divSettings.append(divQuantity);
        // let productQuantity = document.createElement("p");
        // productQuantity.innerText = "Qté : ";
        // divQuantity.append(productQuantity);
        // let quantityInput = document.createElement("input");
        // quantityInput.className = "itemQuantity";
        // quantityInput.setAttribute("type", "number");
        // quantityInput.value = produitDuPanier[i].quantity;
        // divQuantity.append(quantityInput);

        // //divDelete + child
        // let divSettingsDelete = document.createElement("div");
        // divSettingsDelete.className = "cart__item__content__settings__delete";
        // divSettingsDelete.appendChild(article);
        // let deleteItem = document.createElement("p");
        // deleteItem.className = "deleteItem";
        // deleteItem.innerText = "Supprimer";

        // on calcule le total
        // for (t = 0; t < product.length; t++) {
        //   let calculTotal = [];
        //   console.log(product.price);
        //   calculTotal.push(product.price);
        //   console.log(total);
        //   let reducer = (accumulator, currentValue) =>
        //     accumulator + currentValue;
        //   let prixTotal = calculTotal.reduce(reducer, 0);
        //   console.log(prixTotal);
        // }
      });
  }
}
// 3 --- Modifictaion du panier

//fonction qui permet de supprimer un produit du panier
// a mettre dans evenlistener sur btn supprimer
function removeProduct(product, produitDuPanier) {
  produitDuPanier = produitDuPanier.filter((p) => p.id != product.id); // on supprime l'élément qui a le meme id que product
  localStorage.setItem("panier", JSON.stringify(produitDuPanier));
}

//fonction qui permet de modifier la quantité d'un produit ( A REVOIR)
// a mettre dans evenlistener sur btn qté input
//Aussi, la méthode Element.closest() devrait permettre de cibler le produit que vous souhaitez supprimer (où dont vous souhaitez
//modifier la quantité) grâce à son identifiant et sa couleur.

function changeQuantity(product, quantity, produitDuPanier) {
  let foundProduct = produitDuPanier.find((p) => p.id == product.id); // on modifie la quantité du produit qui a le meme id que product
  if (foundProduct != undefined) {
    foundProduct.quantity = quantity; //(AJOUT OK MAIS COMMENT ENLEVER UN PRODUIT)
    if (foundProduct <= 0) {
      removeProduct(product);
    } else {
      localStorage.setItem("panier", JSON.stringify(produitDuPanier));
    }
  }
}
