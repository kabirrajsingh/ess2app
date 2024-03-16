import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  EmployeeID: {
    type: String,
    required: true,
    unique: true,
  },
  Email: {
    type: String,
    required: true, 
    unique: true,
  },
  Password:{
    type:String,
    required:true
  },
  Gmail:{
    type:String,
    required:false
  },
  refreshToken:{
    type:String,
    required:false
  },
  messageIds:{
    type:[String],
    required:false
  },
  addresses:{
    //will have an array of key value pairs of address and address name
    type:[Object],
    required:false
  },
  defaultPaymentMode:{
    type:String,
    required:false,
    default:"Cash",
  },
  defaultTravelPurpose:{
    type:String,
    required:false,
    default:"Daily Commute",
  },travelLogs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'TravelLog',
    },
  ],
},
{timestamps:true});
 
userSchema.pre('remove', async function (next) {
  // Remove associated travel logs when a user is deleted
  await TravelLogModel.deleteMany({ EmployeeID: this.EmployeeID }).exec();
  next();
});



const User = models.User || model("User", userSchema);

export default User;