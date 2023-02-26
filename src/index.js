const express=require('express')
const mongoose=require('mongoose')
const route=require('./routes/route')


const aap=express()

aap.use(express.json())

mongoose.set('strictQuery', true)
mongoose.connect('mongodb+srv://HarshJain:harsh321@cluster0.dwkz9.mongodb.net/Fmcg-db').
then(()=>console.log('mongoDb is connected')).
catch((err)=>console.log(err))



aap.use('/',route)



aap.listen(process.env.PORT||3000,function(){
      console.log('Express aap is running on PORT'+(process.env.PORT||3000))
})

