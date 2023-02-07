const deleteProduct = (btn) => {
  // note - can just pass prod id and csrf token in ejs in the button and access them easily like in jsx.
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  const csrfToken = btn.parentNode.querySelector("[name=_csrf]").value;

  const productElement = btn.closest("article");

  console.log(productElement);

  fetch(`/admin/product/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "csrf-token": csrfToken,
    },
  })
    .then((result) => result.json())
    .then((data) => {
      console.log(data);
      productElement.parentNode.removeChild(productElement);
    })
    .catch((err) => console.log(err));
};
