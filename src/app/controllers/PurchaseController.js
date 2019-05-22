const Ad = require('../models/Ad')
const User = require('../models/User')
const Purchase = require('../models/Purchase')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async index (req, res) {
    const purcharses = await Purchase.paginate(
      {},
      {
        page: req.query.page || 1,
        limit: 20,
        sort: '-createdAt',
        populate: ['ad']
      }
    )

    return res.json(purcharses)
  }

  async store (req, res) {
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    if (purchaseAd.purchasedBy) {
      return res.status(400).json({ error: 'Purchase already made' })
    }

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    const purchase = await Purchase.create({
      ad: purchaseAd,
      content: content
    })

    return res.json(purchase)
  }

  async accept (req, res) {
    const purchase = await Purchase.findById(req.params.id)
    const ad = await Ad.findById(purchase.ad)
    ad.purchasedBy = purchase.id
    ad.save()

    return res.json(ad)
  }
}

module.exports = new PurchaseController()
