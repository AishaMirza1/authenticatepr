require('dotenv').config()

const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const md5 = require('md5')
const app = express()


app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))


mongoose.connect('mongodb://localhost:27017/userDB')
const userSchema = new mongoose.Schema({
    email:String,
    password: String
});




const User = mongoose.model('User',userSchema)

app.get('/',(req,res)=>{
    res.render(`home`)
})

app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/register',(req,res)=>{
    res.render('register')
})

app.post('/register',(req,res)=>{
    const username = req.body.username
    const password = md5(req.body.password)
 
    const newUser = new User({
        email:username,
        password:password
    });

    newUser.save((err)=>{
        if(!err){
            res.render('secrets')
        }else{
            console.log(err)
        }
    })

})

app.post('/login',(req,res)=>{
    const username = req.body.username
    const password = md5(req.body.password)

    User.findOne({email:username},(err,founduser)=>{
        if(err){
            console.log(err)
        }else{
            if(founduser){
                if(founduser.password === password){
                    res.render('secrets')
                }else{
                    res.send('password not matched')
                }
            }else{
                res.send('user not found')
            }
        }
            
    })
})




app.listen(3000,(req,res)=>{
    console.log('server started at 3000')
})