
const userModel = require('../models/user-model');

const fileModel = require('../models/file-model');

const axios = require('axios');

const coucurantModel = require('../models/concurant-model');

const messageModel = require('../models/concurant-model');

const bcrytjs = require('bcryptjs');

const jwt = require('jsonwebtoken');

const reader = require('xlsx');

const path = require('path');





exports.store = async (req, res) => {
    try {

        let {

            service,


            email,

            password,

        } = req.body;

        const user = userModel();

        user.service = service;
        
        user.email = email;

        user.password = bcrytjs.hashSync(password, bcrytjs.genSaltSync(10));

        const token = jwt.sign({
            id_user: user.id,
            service_user: user.service
        }, process.env.JWT_SECRET, { expiresIn: '8784h' });

        user.token = token;

        const userSave = await user.save();



        return res.status(201).json({
            message: 'creation réussi',
            status: 'OK',
            data: userSave,
            statusCode: 201
        });



    } catch (error) {
        return res.status(404).json({
            message: 'erreur server ',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }
}


exports.auth = async (req, res) => {

   

    try {

        let { email, password } = req.body;


        const user = await userModel.findOne({
            email
        }).exec();
    
        if (user != undefined) {
    
            if (bcrytjs.compareSync(password, user.password)) {
    
                const token = jwt.sign({
                    id_user: user.id,
                    service_user: user.service,
                }, process.env.JWT_SECRET, { expiresIn: '8784h' });
    
                user.token = token;
    
                const saveUser = await user.save();
    
                return res.status(200).json({
                    message: 'Connection réussi',
                    status: 'OK',
                    data: saveUser,
                    statusCode: 200
                });
    
            } else {
    
                return res.status(404).json({
                    message: 'Identifiant incorrect',
                    status: 'NOT OK',
                    data: null,
                    statusCode: 404
                });
            }
    
        } else {
    
            return res.status(404).json({
                message: 'Identifiant incorrect',
                status: 'NOT OK',
                data: null,
                statusCode: 404
            });
        }
    

    } catch (error) {
        return res.status(404).json({
            message: 'erreur server ',
            status: 'NOT OK',
            data: error,
            statusCode: 404
        });
    }
}


exports.getAllTell = async (req,res) => {

    let {id} = req.query;

    const fileExel = await  fileModel.findById(id).exec();

    console.log(fileExel);
    
   // Reading our test file
   const file = reader.readFile(path.join(__dirname, '..', 'uploads', fileExel['url'] ));

   let data = []

   const sheets = file.SheetNames

   for(let i = 0; i < sheets.length; i++)
   {
   const temp = reader.utils.sheet_to_json(
           file.Sheets[file.SheetNames[i]])


           for await (const res of temp) {
                const concourant = coucurantModel();

                concourant.nom  = res.Nom;
                concourant.telephone  = res.Telephone;
                concourant.prenom  = res.Prenom.split('.').length > 0 ? res.Prenom.split('.')[1] : res.Prenom ;  
                concourant.daara  = res.daara;  
                concourant.addresse  = res.addresse;  
                concourant.sexe  = res.sexe == "fille" ? 'feminin' : "masculin";
                
                const cSave = await concourant.save();
        
                data.push(res.Telephone)
           }

           
   }


   
   return res.json({
    tel : data
   });

   
}

exports.sendSms = async  (req, res)  => {
    
    // let  {telephones , users} = req.body;

    // telephones.push('772488807');
    // telephones.push('772406480');
    
    const  telephones = 
        [
        "776435932",
        "783408082",
        "784437359",
        "776691686",
        "768695074",
        "775202760",
        "761011066",
        "756315457",
        "773392516",
        "765742441",
        "775943129",
        "769589780",
    ];

   let i =0;
    for await (const element of telephones) {
        console.log(element);
        
       
    let data = JSON.stringify({ "outboundSMSMessageRequest": {
        "address": "tel:+221"+element, 
        "senderAddress": "tel:+221772406480",
        "outboundSMSTextMessage": { 
           "message": "Concours C3s / YMA  \n\nNIONGUI LAY NDOKÉL TÉ DILA YEUGEULNÉ DIOT NANU SA DÉPÔT CANDIDATURE DIEUM CI DIONGANTÉ YAATAL MBINDUM AL XURAN BI C3S DI AMAL." }
        }
        });
         let config = {
           method: 'post', maxBodyLength: Infinity,
           url: 'https://api.orange.com/smsmessaging/v1/outbound/tel:+221772488807/requests', 
           headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+req.accessToken }, 
           data : data 
       }; 
       axios.request(config) .then((response) => { 
        console.log("element success");
        console.log(element);
          
       }) .catch((error) => { 
           console.log("element erreur");
           console.log(element);
           console.log(error);
        });
    }

    

    return res.json({
        data : null
    })



    



}







exports.allConcurant = async (req,res) => {

    const concourants =await coucurantModel.find({}).exec();

    res.status(200).json({
        data : concourants,
    })

}

