const Ad = require('../models/Ad')
const User = require('../models/User')
const Purcharse = require('../models/Purcharse')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async index (req, res) {
    const purcharses = await Purcharse.paginate(
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

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    const purchase = await Purcharse.create({
      ad: purchaseAd,
      content: content
    })

    return res.json(purchase)
  }
}

module.exports = new PurchaseController()
