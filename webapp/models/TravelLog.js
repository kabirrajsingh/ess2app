// models/TravelLog.js
const { ConnectToDb } = require('@utils/db');
const mongoose = require('mongoose');
const travelLogSchema = new mongoose.Schema({
  EmployeeID: {
    type: String,
    required: true,
  },
  DateOfTravel: {
    type: Date,
    required: true,
  },
  FromPlace: {
    type: String,
    required: true,
  },
  FromPlaceTag: {
    type: String,
    required: false,
  },
  ToPlace: {
    type: String,
    required: true,
  },
  ToPlaceTag: {
    type: String,
    required: false,
  },
  TravelMode: {
    type: String,
    required: true,
  },
  PurposeOfTravel: {
    type: String,
    required: true,
  },
  DistanceTraveled: {
    type: Number,
    required: true,
  },
  ExpensesIncurred: {
    type: Number,
    required: true,
  },
  PaymentMode: {
    type: String,
    required: true,
  },
  Comments: {
    type: String,
  },
  TypeOfUpload: {
    type: String,
    required: true,
  },
  FileUrl: {
    type: String,
    required: true,
  },
});
travelLogSchema.post('save', async function (doc, next) {
  await ConnectToDb();
  const User = mongoose.model('User');
  
  try {
    // Check if the document is new before updating the user's travelLogs array
      await User.findOneAndUpdate(
        { EmployeeID: doc.EmployeeID },
        { $addToSet: { travelLogs: doc._id } },
        { new: true }
      ).exec();
    
    next();
  } catch (error) {
    next(error);
  }
});

travelLogSchema.post('deleteOne', async function (doc, next) {
  await ConnectToDb();
  const User = mongoose.model('User');
  console.log("removing")
  console.log(this)
  console.log(doc)
  try {
    // Remove the travel log ID from the user's travelLogs array
    await User.findOneAndUpdate(
      { EmployeeID: doc.EmployeeID },
      { $pull: { travelLogs: doc._id } },
      { new: true }
    ).exec();

    next();
  } catch (error) {
    console.log(error)
    next(error);
  }
});


const TravelLogModel = mongoose.models.TravelLog || mongoose.model('TravelLog', travelLogSchema);

module.exports = TravelLogModel;
