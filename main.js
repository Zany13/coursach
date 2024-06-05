import express from 'express'
import bodyParser from 'body-parser'
import db from './db/db.js'
const app = express()
const port = 5000

app.use(bodyParser.text());

// Get beer list for homepage
app.get('/pivo', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    const beerList = db.beer.getBeerList()
    res.send(beerList.map(b => {
        return {
            id: b.id,
            name: b.name,
            type: b.type,
            alc: b.alc,
            volume: b.volume,
            price: b.price
        }
    }))
    // res.send(beerList)
})

// Get single beer for beer page
app.get('/pivo/:id', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    const beer = db.beer.getBeer(req.params.id)
    if (beer)
        res.send(beer)
    else
        res.status(404).send()
})

// View purchase by id
app.get('/purchase/:id', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    const purchase = db.purchase.getPurchase(req.params.id)
    if (purchase)
        res.send(purchase)
    else
        res.status(404).send()
})

// Make purchase
app.post('/purchase', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    const body = JSON.parse(req.body)
    const settings = db.settings.get()
    const date = new Date()

    let price = 0
    for (const beerId in body.order) {
        if (Object.hasOwnProperty.call(body.order, beerId)) {
            const amount = body.order[beerId];
            const beer = db.beer.getBeer(beerId)
            price += beer.price * amount
        }
    }

    const purchaseid = settings.next_purchase_id;
    db.purchase.createPurchase({
        id: settings.next_purchase_id++,
        clientName: body.clientName,
        city: body.city,
        address: body.address,
        user_comment: body.comment,
        purchase_date: date.toUTCString(),
        estimated_date: (new Date(date.getTime() + 2 * 60 * 60 * 1000)).toUTCString(),
        status: "Ongoing",
        status_date: date.toUTCString(),
        status_comment: "",
        price: price,
        order: body.order
    })

    db.settings.update(settings);
    res.send({ id: purchaseid });
})

// Cancel purchase
app.post('/cancel', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    const body = JSON.parse(req.body)
    const purchase = db.purchase.getPurchase(body.id)
    if (purchase) {
        if (purchase.status === "Ongoing") {
            db.purchase.updatePurchase(body.id, {
                "status": "Canceled",
                "status_date": (new Date()).toUTCString(),
                "status_comment": body.comment
            })
        } else {
            res.status(401)
        }
    } else {
        res.status(404)
    }

    res.send()
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})