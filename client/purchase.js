async function formatOrder(order) {
    let html = '<ul>';
    for (const beerId in order) {
        if (Object.hasOwnProperty.call(order, beerId)) {
            const amount = order[beerId];
            const response = await fetch(`http://127.0.0.1:5000/pivo/${beerId}`)
            const beer = await response.json()
            html += `<li>${beer.name} ${beer.volume}l x ${amount}</li>`
        }
    }
    html += '</ul>'
    return html;
}

async function onLoad() {
    const purchaseId = window.localStorage.getItem('purchaseid')
    const response = await fetch(`http://127.0.0.1:5000/purchase/${purchaseId}`)
    const purchase = await response.json()
    const purchaseCard = document.getElementById("purchaseCard");
    purchaseCard.innerHTML = `
        <h2 id="order_label" class="he2">Order ${purchase.id}: ${purchase.status}</h2>
        <p><b>Name:</b> <i>${purchase.clientName}</i></p>
        <p><b>Address:</b> <i>${purchase.city}, ${purchase.address}</i></p>
        <p><b>Comment:</b> <i>${purchase.user_comment}</i></p>
        <p><b>Purchase Date:</b><i> ${purchase.purchase_date}</i></p>
        <p><b>Estimated Delivery Date:</b><i> ${purchase.estimated_date}</i></p>
        <p><b>Price:</b><i> ${purchase.price} UAH</i></p>
        <p><b>Order:</b></p>
        ${await formatOrder(purchase.order)}
    `;

    if (purchase.status !== "Canceled") {
        const purchaseCancel = document.getElementById("cancelPurchase");
        purchaseCancel.innerHTML = `
            <form id="cancelPurchaseForm">
                <h3>Cancel order:</h3>
                <input type="text" id="status_comment" name="status_comment" placeholder="text your reason"><br>
                <input type="submit" value="Cancel" class="Submit">
            </form>
        `;

        const cancelForm = document.getElementById("cancelPurchaseForm");
        cancelForm.addEventListener('submit', async (e) => {
            e.preventDefault()

            const comment = cancelForm.elements['status_comment'].value;

            const data = {
                id: purchase.id,
                comment
            }
            const response = await fetch(`http://127.0.0.1:5000/cancel`, {
                method: 'POST',
                body: JSON.stringify(data)
            })
            if (response.ok) {
                purchaseCancel.hidden = true
                document.getElementById("order_label").innerHTML = `Order ${purchase.id}: Canceled`;
            }
        })
    }
}

onLoad().then()