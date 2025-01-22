
const userModel = require('../models/user-model');

const fileModel = require('../models/file-model');

const axios = require('axios');

const coucurantModel = require('../models/concurant-model');

const messageModel = require('../models/message-model');

const bcrytjs = require('bcryptjs');

const jwt = require('jsonwebtoken');

const reader = require('xlsx');

const path = require('path');



const nodemailer = require('nodemailer');


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
    
    let  {telephones  , subTitle , desc} = req.body;

    // telephones.push('772488807');
    // telephones.push('772406480');

    // const telephones = ['772488807']
    
    //const  telephones = 
      //  [

           
            // "763865719",
            // "763290893",
            // "777201932",
            // "767477992",
            // "762861684",
            // "780131819",
            // "771520996",
            // "778794386",
            // "776916687",
            // "768385872",
            // "767723610",
            // "770315480",
            // "766960676",
            // "766960676",
            // "777201973",
            // "774714913"

        // "789670688",
        // "766035408",
        // "770185363",
        // "781107668",
        // "768131983",
        // "786817205",
        // "762555523",
        // "780131819",
        // "779055623",
        // "765002543",
        // "767762131"
        // "767485139",
        // "781979239",
        // "766960676",
        // "766653950",
        // "768792856",
        // "762605549",
        // "784430248",
        // "752527434",
        // "762570502",
   // ];

   let i =0;
   let tabEchec= [];
    for await (const element of telephones) {
        console.log(element);
      try {
          
        const user = await coucurantModel.findOne({
            telephone : element
        });

        console.log("user");
        console.log(user);

        const message = messageModel();

        message.titre = "Concours C3s / YMA";
        message.subTitle = subTitle;
        message.desc = desc;
        message.sender = user._id;
        const messageSave = await message.save();
        

        console.log("messageSave");
        console.log(messageSave);
        
       
    let data = JSON.stringify({ "outboundSMSMessageRequest": {
        "address": "tel:+221"+element, 
        "senderAddress": "tel:+221772406480",
        "outboundSMSTextMessage": { 
           "message": `${messageSave.titre}  \n\n ${messageSave.subTitle}   \n\n  ${messageSave.desc}`}
        }
        });
         let config = {
           method: 'post', maxBodyLength: Infinity,
           url: 'https://api.orange.com/smsmessaging/v1/outbound/tel:+221772406480/requests', 
           headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+req.accessToken }, 
           data : data 
       }; 
       axios.request(config) .then(async (response) => { 
        console.log("element success");
        console.log(element);
            const m = await messageModel.findById(messageSave._id);

            m.success = "1";

            const ms = await m.save();
          
       }) .catch(async (error) => { 
        tabEchec.push(element);
        const m = await messageModel.findById(messageSave._id);

        m.success = "1";

        const ms = await m.save();
           console.log("element erreur");
           console.log(element);
           console.log(error);
        });
      } catch (error) {
        tabEchec.push(element);
      }
    }

    

    return res.json({
        data : tabEchec
    })



    



}

exports.sendMailContact = async (req ,res ) => {

   try {
    const {prenom ,nom , telephone , message , email} =req.body ;

    // Configurer le transporteur SMTP
//     const transporter = nodemailer.createTransport({
//      service: 'IMAP',
//      host: 'ssl0.ovh.net', // 'ssl0.ovh.net',
//      port: 993,
//      secure: true, // Utilisez true si vous utilisez SSL/TLS
//      auth: {
//          user: 'ndiogou.diop@c3s.sn',
//          pass: 'P@sser2028'
//      }
//  });

  // Configurer le transporteur SMTP
  const transporter = nodemailer.createTransport({
    service: 'SMTP',
    host: 'smtp.mail.ovh.net', // 'ssl0.ovh.net',
    port: 465,
    secure: true, // Utilisez true si vous utilisez SSL/TLS
    auth: {
        user: 'ndiogou.diop@c3s.sn',
        pass: 'P@sser2028'
    }
});

     // Définir les informations de l'e-mail
     const mailOptions = {
         comom: " Support <ndiogou.diop@c3s.sn>",
         to:email,
         subject: 'Contact via app yataalMbinde',
         html: `Mr ${prenom} ${nom} vient de vous contacter à propos de : \n ${message} \n NB :Son numéro de téléphone est ${telephone} .`
     };

     // Envoyer l'e-mail
     await transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
             console.log('Erreur lors de l\'envoi de l\'e-mail:', error);

         } else {
             console.log('E-mail envoyé avec succès:', info.response);

         }
     });
     res.json(null);
   } catch (error) {
    console.log(error);
    
    res.json(null);
   }

}







exports.allConcurant = async (req,res) => {

    const concourants =await coucurantModel.find({}).exec();

    res.status(200).json({
        data : concourants,
    })

}

