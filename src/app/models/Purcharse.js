const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const PurcharseSchema = new mongoose.Schema({
  ad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ad',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

PurcharseSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Purcharse', PurcharseSchema)
