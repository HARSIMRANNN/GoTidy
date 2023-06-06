const express = require("express")
const mongoose = require('mongoose')
const path = require('path');
const cors = require('cors')
const multer = require('multer')
require('dotenv').config();
const UserModel = require('./model/logRegModel')
const ServiceModel = require('./model/ServiceSchema')
const twilio = require('twilio')

const Order = require('./model/UserOrdersModel');
const PORT = process.env.PORT || 5000


const app = express();
app.use(express.json());
//CORS: Cross origin Resource Sharing- license to share data across different ports
app.use(cors());
app.use(express.static(path.join(__dirname, '/frontend/build')))
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './frotnend/build/index.html'))
})

// async function sendSMS(){
//    const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
//    return client.messages
//    .create({body:'Order received',from:'+13204387282', to:process.env.PHONE_NUMBER})
//    .then(message=>console.log(message))
//    .catch(err=>console.log(err))
// }
// sendSMS()

//getting url for DB
const dbUrl = process.env.Mongo_DB_URL

//using mongoose to connect BED with DB
mongoose.connect(dbUrl)
    .then(() => console.log('DB Connected'))
    .catch(error => console.log(error));


app.patch("/getUser/:id", async (req, res) => {
    let id = req.params.id

    try {
        let newData = req.body

        const options = { new: true };

        let data = await UserModel.find({ _id: id })
        data[0].orders.unshift(newData);

        const response = await UserModel.findByIdAndUpdate(id, data[0], options)

        res.send(response)
    }
    catch (error) {
        res.send(error)
        console.log(`User_error: ${error}`);
    }


});

app.get('/sendMessage/:contactNo', async (req, res) => {
    let contactNo = req.params.contactNo
    const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
    return client.messages
        .create({ body: 'Order received', from: '+13204387282', to: contactNo })
        .then(message => console.log('message sent', message))
        .catch(err => console.log('error', err))
})


app.get("/getUser", async (req, res) => {
    try {
        let data = await UserModel.find({})
        res.send(data)
    }
    catch (error) {
        res.send(error)
        console.log(`User_error: ${error}`);
    }

});

app.get("/getUser/:id", async (req, res) => {
    let id = req.params.id

    try {




        let data = await UserModel.find({ _id: id })


        const response = await UserModel.findByIdAndUpdate(id)

        res.send(response)
    }
    catch (error) {
        res.send(error)
        console.log(`User_error: ${error}`);
    }


});

app.get("/prevOrder/:id", async (req, res) => {
    let id = req.params.id
    try {
        let pOrder = await UserModel.find({ _id: id })
        const orders = pOrder[0].orders
        console.log(pOrder[0]);
        res.send({ user: pOrder[0], prevOrders: orders })

        console.log(orders);

    } catch (error) {
        console.log(error);
    }
})

//get request at root to read the data
app.get("/", (req, res) => {
    res.send("Hello bhaiya ,mein server")
});




// for admin to view all services
app.get("/getAllServices", async (req, res) => {
    try {
        console.log('route hit hogya');
        const allServices = await ServiceModel.find({})
        // console.log(allServices);
        // res.json({data:'Services list...'})
        res.send({ status: 'OK', data: allServices })
        //  console.log(res)
    } catch (error) {
        console.log(error);
    }
})

// for profile to view all orders
app.get("/getAllServices/:id", async (req, res) => {
    try {
        console.log('route hit hogya');
        let id = req.params.id;
        const allServices = await ServiceModel.find({ _id: id })
        // console.log(allServices);
        // res.json({data:'Services list...'})
        res.send({ status: 'OK', data: allServices })
        //  console.log(res)
    } catch (error) {
        console.log(error);
    }
})

// app.get("/cart/:id", async(req,res)=>{
//     try {

//         let cartId = [req.params.id];
//         const all = await ServiceModel.find({id:cartId});
//         res.send({status:"ok", data:all})

//     } catch (error) {
//         console.log(error);
//     }
// })

app.post('/getFilteredServices', async (req, res) => {
    // console.log(`Request data : ${req.body.location}`);

    try {
        const resultData = await ServiceModel.find({ validationTooltip03: req.body.location, validationTooltip01: req.body.service });
        // console.log(`Response data: ${resultData}`);
        res.send(resultData);
    } catch (error) {
        res.send(error)
    }
})







app.post('/register', async (req, res) => {
    let { username, password, email, address, mobile } = req.body;
    // res.json(user);
    try {
        const newUser = new UserModel({
            username: username,
            password: password,
            email: email,
            address: address,
            mobile: mobile
        })
        const result = await newUser.save()
        res.send(result);
        // console.log(result);

    } catch (error) {
        res.send(error)
    }
})

app.post('/addservice', async (req, res) => {
    let { id, validationTooltip01, validationTooltip02, validationTooltip03, validationTooltip04, validationTooltip05 } = req.body;
    try {
        const newService = new ServiceModel({
            id: id,
            validationTooltip01: validationTooltip01,
            validationTooltip02: validationTooltip02,
            validationTooltip03: validationTooltip03,
            validationTooltip04: validationTooltip04,
            validationTooltip05: validationTooltip05
        })
        const result = await newService.save()
        res.send(result);
        // console.log(result);


    } catch (error) {
        res.send(error)
    }
})


app.post('/login', async (req, res) => {
    // console.log(req.body);
    let userData = req.body;


    const { username, password } = userData;

    const result = await UserModel.find({ username: username })
    // console.log(result[0].password, password);

    if (result != null) {
        if (result[0].password === password) {
            res.send({ msg: 'Login Success', data: result[0] });
        } else {
            res.send({ msg: 'Wrong Creds' })
        }
    }
    else {
        res.send({ msg: 'Login Failed! User not found' })
    }
})




app.listen(PORT, () => console.log(`Server running at ${PORT}`))


