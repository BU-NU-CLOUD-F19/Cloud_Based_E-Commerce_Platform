const cartCookie = 'cart';
const gwUrl = "http://localhost:3050/"
const cartNum = 3;
const sid = "rj_36sCy"

async function gwGetQuery(queryStr) {
  const query = { query: `{${queryStr}}` };
  const resp = await fetch(gwUrl, {method: 'POST', body: JSON.stringify(query), headers: { 'Content-Type': 'application/json' }});
  if (!resp.ok) {
    console.log("Query failed");
    return {};
  }
  const result = await resp.json();
  console.log(`Query result: ${JSON.stringify(result)}`);
  return result.data;
}

async function gwPostQuery(queryStr) {
  const query = { query: `mutation { ${queryStr} }` };
  const resp = await fetch(gwUrl, {method: 'POST', body: JSON.stringify(query), headers: { 'Content-Type': 'application/json' }});
  if (!resp.ok) {
    console.log("Query failed");
    return {};
  }
  const result = await resp.json();
  console.log(`Query result: ${JSON.stringify(result)}`);
  return result.data;
}

function startCheckout() {
  const query = `beginCheckout(id: ${cartNum}, sid: "${sid}") { message } `;
  gwPostQuery(query).then(res => {
    console.log(res);
    let $link = $("<a href='#'>Please pay to continue checkout</a>");
    $link.click(continueCheckout);
    let $abortIt = $("<a href='#'>Abort checkout</a>");
    $abortIt.click(abortCheckout);
    $("body").html('');
    $("body").append($link);
    $("body").append("<br><br>");
    $("body").append($abortIt);
  });
}

function continueCheckout() {
  const query = `completeCheckout(id: ${cartNum}, sid: "${sid}") { message, data { oid, total_price, date, shipping }}`;
  gwPostQuery(query).then(res => {
    $("body").html('');
    let $order = $("<div></div>")
    $order.append(`<h3>Order details:</h3>`);
    $order.append(`<ul>`);
    $order.append(`<li>Order ID: ${res.completeCheckout.data.oid}</li>`);
    $order.append(`<li>Price: ${res.completeCheckout.data.total_price}</li>`);
    $order.append(`<li>Shipping price: ${res.completeCheckout.data.shipping}</li>`);
    $order.append(`<li>On date: ${res.completeCheckout.data.date}</li></ul>`);
    $("body").append($order);
    $("body").append("<button onclick='document.location.reload()'>Continue to main page</button>");
  });
}
function abortCheckout() {
  const query = `abortCheckout(id: ${cartNum}, sid: "${sid}") { message }`;
  gwPostQuery(query).then(() => document.location.reload());
}
function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}
function setCookie(name, value, days) {
  var d = new Date;
  d.setTime(d.getTime() + 24*60*60*1000*days);
  document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}
function deleteCookie(name) { setCookie(name, '', -1); }

async function getProducts() {
  const query = `products{
    pid,
    pname,
    description
  }`

  result = await gwGetQuery(query);
  if (result.products) {
    return result.products;
  }
  else {
    return []
  }
}

function formatRow(product) {
  let $row = $("<tr></tr>");
  let rowContent = `<td>${product.pid}</td>`;
  rowContent += `<td>${product.pname}</td>`;
  rowContent += `<td>${product.description}</td>`;
  rowContent += `<td><input type="number" id="amount-${product.pid}" /><button id="${product.pid}">Add to cart</button></td>`;
  $row.html(rowContent);
  return $row;
}

async function addToCart(prod, cartId) {
  let query = `
  addProductToCart(
  id: ${cartId}
  input: { pid: ${prod.pid}, amount_in_cart: ${prod.amount_in_cart}}
  sid: "${sid}")
  {
  message
  data {
    pid
    amount_in_cart
  }
  auth {
    authorized
    uid
    as
  }
  }
  `
  const res = await gwPostQuery(query);
  console.log(res);
  document.location.reload();
}
async function getCart(cartId) {
  let query = `
    getProducts(id: ${cartId}, sid: "${sid}") {
          data { pid, amount_in_cart },
          auth { uid }
    }`

  const result = await gwGetQuery(query)
  return result.getProducts.data;
}
async function emptyCart() {
  let query = `
    emptyCart(id: ${cartNum}, sid: "${sid}") {
      message
      data
      auth {
        authorized
        uid
        as
      }
    }
  `
  const res = await gwPostQuery(query);
  console.log(res);
  document.location.reload();
  return true;
}

$(function() {
  getProducts().then(res => {
    $table = $("table#products");

    for (let prod of res) {
      $table.append(formatRow(prod));
    }

    getCart(cartNum).then(cart => {
      $("span#items-in-cart").html(cart.length);

      for (let prod of cart) {
        $("#cart-listing").append(`<li>Product ${prod.pid} (${prod.amount_in_cart})</li>`);
      }
    });

    $("table#products button").click(e => {
      let pid = e.target.id;
      let amount = $(`input#amount-${pid}`).val();

      let addedProduct = { pid, amount_in_cart: amount};
      addToCart(addedProduct, cartNum).then(() => {
        $(`input#amount-${pid}`).val('');
      });
    })

    $("button#checkout").click(startCheckout);

    $("button#empty").click(emptyCart);
  })
})
