var mongoose = require('mongoose');
const express = require('express');
const userRoutes = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user-model')
const Visit = require('../models/visit-model')

// function checkDoctor(){
//   return function(req, res, next){
//     if(req.user === true && req.user.role === "Doctor"){
//       return next();
//     } else {
//       res.status(401).json({ message: 'Unauthorized Access'});
//     }
//   }
// }

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

    // If Patient tries to view
    if(req.user.role !== 'Doctor'){
      res.status(401).json({message: "Unauthorized Access"});
      return;
    }

    const doctorId = req.params.id;

    Visit.find({"doctor_id": doctorId}, (err, clients)=>{
      if (err) {
        res.status(500).json({message:"Clients List Not Found"});
        return
      }
      res.status(200).json(clients)
    });
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

    //Change Password
    // //Hash Password
    // const salt = bcrypt.genSaltSync(10);
    // const hashedPassword = bcrypt.hashSync(req.body.changePassword, salt)
  
    const updates = {
    username: req.body.editedUsername,
    firstName: req.body.editedFirstName,
    lastName: req.body.editedLastName,
    address: req.body.editedAddress,
    insurance_co: req.body.editedInsuranceCo
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

// Delete a User
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

    res.json({
        message: "User Removed From Database"
    });
  });
});

module.exports = userRoutes;
