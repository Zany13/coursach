import fs from "fs";

const Beer = "./db/beer.json"
const Purchase = "./db/purchase.json"
const Settings = "./db/settings.json"

function getCollection(path) {
    return JSON.parse(fs.readFileSync(path))
}

function saveCollection(path, collection) {
    fs.writeFileSync(path, JSON.stringify(collection))
}

const db = {
    beer: {
        getBeerList: () => {
            return getCollection(Beer)
        },

        getBeer: (id) => {
            const beerList = getCollection(Beer)
            return beerList.find((e) => e.id == id)
        }
    },

    purchase: {
        getPurchase: (id) => {
            const purchaseList = getCollection(Purchase)
            return purchaseList.find((e) => e.id == id)
        },

        createPurchase: (data) => {
            const purchaseList = getCollection(Purchase)
            purchaseList.push(data)
            saveCollection(Purchase, purchaseList)
        },

        updatePurchase: (id, data) => {
            const purchaseList = getCollection(Purchase)
            const purchase = purchaseList.find((e) => e.id == id)
            for (const prop in data) {
                purchase[prop] = data[prop]
            }
            saveCollection(Purchase, purchaseList)
        }
    },

    settings: {
        get: () => {
            return getCollection(Settings)[0]
        },

        update: (data) => {
            saveCollection(Settings, [data])
        }
    }
}

export default db;