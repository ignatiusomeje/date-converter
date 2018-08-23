const mongoose = require('mongoose');

const querySchema = mongoose.Schema({
  number:{
    type: Number,
    required: true,
    trim: true,
    default: 1
  },
  unit: {
    type: String,
    required: true,
    default: 'Seconds'
  },
  results:[{
    seconds: {
      type: Number
    },
    minutes:{
      type: Number
    },
    hours:{
      type: Number
    },
    days:{
      type: Number
    },
    weeks:{
      type: Number
    },
    months:{
      type: Number
    },
    years:{
      type: Number
    }
  }] ,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }
});

const Query = mongoose.model('Query', querySchema);

module.exports = {Query};