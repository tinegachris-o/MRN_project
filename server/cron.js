import cron from 'cron'
import https from "https"
const url='https://mrn-project.onrender.com'
const job=new cron.CronJob('*/14 ****',function(){
    https.get(url,(res)=>{
        if(res.statusCode ==200){
            console.log("Get request sent sucessfully")
        }else{
            console.log("Get request failed ",res.statusCode)
        }
    }).on("error",(e)=>{
        console.log("error while sending request",e)
    })
})
export default job