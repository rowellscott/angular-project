var mongoose = require('mongoose');
const express = require('express');
const userRoutes = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user-model')
const Visit = require('../models/visit-model')

//Create New Patient
userRoutes.post('/api/users/new', (req, res, next)=>{
  if(!req.user){
    res.status(401).json({message: "Log In To Add Client"});
    return;
  }

  //  If Patient tries to add
   if(req.user.role !== 'Doctor'){
    res.status(401).json({message: "Unauthorized Access"});
    return;
  }

  //Verify This Is the User's Profile
  if(req.params.id !== req.user._id.toString()){
    res.status(401).json({message: "Unauthorized Access"});
    return
  }

  //Check if Patient Is in Database
  User.findOne({
    'firstName': req.body.patientFirstName,
    'lastName': req.body.patientLastName,
    'address': req.body.patientAddress,
    },  (err, patient)=>{
  
    if(err){
    res.status(500).json({message: "Client check went wrong"});
    return;
  }
  //Check if Patient Already Exists in Database
    if(patient){
      res.status(400).json({message: "Client Already Exists"});
      return;
    }

    //Define Patient
    const newPatient = new User({
        firstName: req.body.patientFirstName,
        lastName: req.body.patientLastName, 
        address: req.body.patientAddress,
        city: req.body.patientCity,
        state: req.body.patientState, 
        zip: req.body.patientZip,
        gender: req.body.patientGender,
        insurance_co: req.body.patientInsuranceCo,
      });
      
    //Save The User To Database
    newPatient.save((err)=> {
        if(err){
          res.status(500).json({message: "Error Saving User."});
          return;
        }

    if (err && newPatient.errors){
      res.status(400).json({
        firstNameError: newPatient.errors.firstName,
        lastNameError: newPatient.errors.lasttName,
        addressError: newPatient.errors.address,
        cityError: newPatient.errors.city,
        stateError: newPatient.errors.state,
        zipError: newPatient.errors.zip,
        genderError: newPatient.errors.gender,
        insuranceCoError: newPatient.errors.insurance_co,
      });
      return;
    } 
    
    req.user.encryptedPassword = undefined;
    newPatient.user = req.user;

    res.status(200).json(newPatient);

    });
  });
});

// List All Clients For Doctor
userRoutes.get('/api/users/:id', (req, res, next)=>{
    if(!req.user){
      res.status(401).json({message: "Log In To See Clients"});
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
  }

  //Verify This Is the User's Profile
    if  (req.params.id !== req.user._id.toString()){
      res.status(401).json({message: "Unauthorized Access"});
      return
    }

    if( req.user.role==="Doctor"){
    // If Patient tries to view
    if(req.user.role !== 'Doctor'){
      res.status(401).json({message: "Unauthorized Access"});
      return;
    }

    const doctorId = req.params.id;
    //Find All Patients for Doctor By Id
    Visit.find({ "doctor_id": doctorId}).distinct("patient_id", (err, clientIds)=>{
      if (err) {
            res.status(500).json({message:"Clients List Not Found"});
            return
          }
    //Find All Patients Data By Id
      User.find({'_id': {$in: clientIds}
      }, (err, clients) =>{
        if(err){
          res.status(500).json({message:"Clients List Not Found"});
          return
        }
        res.status(200).json(clients)
      })
  });
  }

  if( req.user.role==="Patient"){
    
    if(req.user.role !== 'Patient'){
      res.status(401).json({message: "Unauthorized Access"});
      return;
    }

    //Find Latest Visit For Patient and Send to Front-End
    Visit.findOne({'patient_id': req.params.id}).sort({"updatedAt": -1}).exec((err, latestVisit)=>{
        if(err){
          res.status(500).json({message:"Latest Visit Not Found"});
          return
        }
        console.log(latestVisit)

        //Convert Object To Array with Object For Easier Manipulation in Angular
        var array = new Set([latestVisit]);
        var objectArray = Array.from(array)
        res.status(200).json(objectArray)
    });
  }
});

//Doctor, Patient View Profile
userRoutes.get('/api/users/:id/edit', (req, res, next)=>{
  if(!req.user){
    res.status(401).json({message: "Log In To Edit"});
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  //Verify This Is the User's Profile
  if(req.params.id !== req.user._id.toString()){
    res.status(401).json({message: "Unauthorized Access"});
    return
  }

  User.findById(req.params.id, (err, theUser)=>{
      if (err) {
        res.status(500).json({ message: "User Not Found"});
        return
      }

      res.status(200).json(theUser);
    });
  });

//Doctor, Patient Edit Profile
userRoutes.put('/api/users/:id/edit', (req, res, next)=>{
  if(!req.user){
    res.status(401).json({message: "Log In To Edit"});
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  //Verify This Is the User's Profile
  if (req.params.id !== req.user._id.toString()){
    res.status(401).json({message: "Unauthorized Access"});
    return;
  }

    //Change Password
    // //Hash Password
    // const salt = bcrypt.genSaltSync(10);
    // const hashedPassword = bcrypt.hashSync(req.body.editedPassword, salt)
  
  if (req.user.role==="Patient"){
      const updates = {
        username: req.body.editedUsername,
        firstName: req.body.editedFirstName,
        lastName: req.body.editedLastName,
        address: req.body.editedAddress,
        city: req.body.editedCity,
        state: req.body.editedState,
        zip: req.body.editedZip,
        gender: req.body.editedGender,
        insurance_co: req.body.editedInsuranceCo
      }
    }

    //Without Insurance
    if (req.user.role==="Doctor"){
      const updates = {
        username: req.body.editedUsername,
        firstName: req.body.editedFirstName,
        lastName: req.body.editedLastName,
        address: req.body.editedAddress,
        city: req.body.editedCity,
        state: req.body.editedState,
        zip: req.body.editedZip,
      }
    }


  User.findByIdAndUpdate(req.params.id, updates, err =>{
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: "User updated successfully"
    });
  });
});

// Delete a User - If Need
userRoutes.delete("/api/users/:id/delete", (req, res, next)=>{
  if (!req.user) {
    res.status(401).json({ message: "Log In To Delete User." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid." });
    return;
  }

  User.remove({_id: req.params.id}, err => {
    if (err) {
      res.json(err);
      return;
    }

    //Wouldn't Do In Reality, Inserted For Example Purposes. Remove All Records Associated With Patient
    Visit.remove({'patient_id': req.params.id}, err => {
      if (err) {
        res.json(err);
        return;
      }
    });

    res.json({
        message: "User Removed From Database"
    });
  });

  
});

module.exports = userRoutes;
