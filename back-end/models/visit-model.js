const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VisitSchema = new Schema({
    temperatureDeg: {
      type: Number,
      required: true,
      min: 90,
      max: 110
    },
    temperatureScale:{
      type: String,
      required: true,
      enum: ["C", "F"]
    },
    height: {
      type: String,
      required: true
    },
    weight: {
      type: String,
      required: true
    },
    blood_pressure:{
      type: String,
      required: true
    },
    chief_complaint: {
      type: String,
      required: true
    },
    assessment: {
      type: String,
      required: true,
    },
    treatment:{
      type: String,
      required: true
    },
    patient_id:{
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    doctor_id:{
      type: Schema.Types.ObjectId,
      required: true
    }
  },
    {
      timestamps: true
    }
);

const Visit = mongoose.model('Visit', VisitSchema);

module.exports = Visit;



