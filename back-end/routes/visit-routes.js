const mongoose = require('mongoose');
const express = require('express');
const visitRoutes = express.Router();

const Visit = require('../models/visit-model');
const User = require('../models/user-model')

//Create New Visit. :id = patient_id
visitRoutes.post('/api/visits/:id/new', (req, res, next)=>{
    // If There's No Session, Return Error
    if(!req.user){
      res.status(401).json({message: "Log In To Add A Visit"});
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    if(req.user.role !== 'Doctor'){
      res.status(401).json({message: "Unauthorized Access"});
      return;
    }

    //Confirm Patient Exists and That Id Belongs to Patient
    User.findById(req.params.id, (err, thePatient)=>{
      if(err){
        res.status(500).json({message: "Client check went wrong"});
        return;
      }
      //Check if Patient Already Exists in Database
        if(!thePatient || thePatient.role !== "Patient"){
          res.status(400).json({message: "Error Adding Visit. Client Id Invalid or Client Doesn't Exist"});
          return;
        }
   

    const newVisit = new Visit({
      temperature: req.body.temperature,
      height: req.body.height, 
      weight: req.body.weight,
      blood_pressure: req.body.bloodPressure,
      chief_complaint: req.body.chiefComplaint,
      assessment: req.body.assessment,
      treatment: req.body.treatment,
      patient_id: req.params.id,
      doctor_id: req.user.id,
    });

    newVisit.save((err)=>{
      if(err){
          res.status(500).json({message: "Error Saving to Database" });
          return;
      }
      //Validation Errors 
      if (err && newVisit.errors){
        res.status(400).json({
          temperatureError: newVisit.errors.temperature,
          heightError: newVisit.errors.height,
          weightError: newVisit.errors.weight,
          bloodPressureError: newVisit.errors.blood_pressure,
          chiefComplaintError: newVisit.errors.chief_complaint,
          assessmentError: newVisit.errors.assessment,
          treatmentError: newVisit.error.treatment
        });
        return
      }

      //Hide Password From Front End
      req.user.encryptedPassword=undefined; 
      //Add New Visit Object to User Object
      newVisit.user = req.user;

      //Send Visit Object to Front End
      res.status(200).json(newVisit);
    });
  });
});

//Get All Visits for Patient
visitRoutes.get("/api/visits/:id", (req, res, next)=>{
  if (!req.user) {
    res.status(401).json({ message: "Log In To View Visit." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Visit.find({"patient_id": req.params.id}, (err, theVisit)=>{
    if (err) {
      res.status(500).json({ message: "Error Finding Visits" });
      return;
    }

    res.status(200).json(theVisit);
  });
});

//Get Individual Visit 
visitRoutes.get("/api/visits/visit/:id", (req, res, next)=>{
  if (!req.user) {
    res.status(401).json({ message: "Log In To View Visit." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Visit.findById(req.params.id, (err, theVisit)=>{
    if (err) {
      res.status(500).json({message: "Error Finding Visit"});
      return;
    }
    
    res.status(200).json(theVisit)
  });
});








module.exports = visitRoutes; 