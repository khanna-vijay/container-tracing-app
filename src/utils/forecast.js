const yargs = require('yargs')
const chalk = require('chalk')
const request = require('request')

const forecast = (latitude, longitude, DarkSkyAPISecret, weatherUnits, weatherLanguage, callback) => {
//const darkSkyNetURLString = 'https://api.darksky.net/forecast/'+DarkSkyAPISecret+'/'+latitude+','+longitude+'?units='+weatherUnits+'&lang='+weatherLanguage
const url = 'https://api.darksky.net/forecast/'+DarkSkyAPISecret+'/'+latitude+','+longitude+'?units='+weatherUnits+'&lang='+weatherLanguage
    //const mapBoxForwardEncodingURLString = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+encodeURIComponent(address)+'.json?access_token='+MapBoxAccessToken+'&limit=1'
    // encode will put %20 instead of Space. and manage special characters. 

    request({url, json : true },(error,{ body }) => {  
        if(error){
            callback('Unable to Connect to Weather Service DarkSkyNet API. Possibly Internet/Wifi Issue', undefined)
            console.log(chalk.red.inverse.bold('Unable to Connect to Weather Service DarkSkyNet API.. Possibly Internet connection/Wifi issue'))
    
        }else if (body.error) {
            callback('Unable to find Location in DarkSkyNet API, try another address', undefined)
            //console.log(chalk.red.inverse.bold('\n Unable to find Location in Darksky API'))
            }
       
        else{
            percentRainChance = (body.currently.precipProbability*100)
            percentRainChance = percentRainChance.toFixed(2)        //Limiting the Percent to 2 digits

            callback(undefined, body.currently.summary+' It is Currently '+body.currently.temperature+' Celcius. There is a '+ percentRainChance+' Percent Chance of rain'    
                /*summary: body.currently.summary,
                temperature: body.currently.temperature,
                percentRainChance: percentRainChance,
                timezone: body.timezone */

         )
      
        //Check for Internet Connectivity Errors
        //console.log(response)
        //const data = JSON.parse(response.body)            //Removed this as we are not using json=true for direct JSON format output
        //console.log(response.body.currently.summary)         //Pulling Specific JSON Object Values. 
        
        //console.log(percentRainChance)
        
       //// console.log(chalk.yellow('\n Weather is '+response.body.currently.summary+'. \n'))
        //// console.log(chalk.green.inverse('It is Currently '+ response.body.currently.temperature+' degrees Celcius out there in '+response.body.timezone+' . \n'))
        //// console.log('There is a '+ percentRainChance+' percent chance of rain.\n' )
    }
       
    })
    
}
       
module.exports = forecast

// Below to be removed
/*
request({url: darkSkyNetURL, json : true },(error,response) => {     //json = true helps to have default output in JSON format.. so parsing is not required
    // *** either error or response will be there..
    //console.log(error)
    if(error){
        console.log(chalk.red.inverse.bold('Unable to Connect to Weather Service DarkSkyNet API.. Possibly Internet connection/Wifi issue'))

    }else if (response.body.error) {
        console.log(chalk.red.inverse.bold('\n Unable to find Location in Darksky API'))

    }
   
    else{
  
    //Check for Internet Connectivity Errors
    //console.log(response)
    //const data = JSON.parse(response.body)            //Removed this as we are not using json=true for direct JSON format output
    //console.log(response.body.currently.summary)         //Pulling Specific JSON Object Values. 
    percentRainChance = (response.body.currently.precipProbability*100)
    percentRainChance = percentRainChance.toFixed(2)        //Limiting the Percent to 2 digits
    //console.log(percentRainChance)
    
    console.log(chalk.yellow('\n Weather is '+response.body.currently.summary+'. \n'))
    console.log(chalk.green.inverse('It is Currently '+ response.body.currently.temperature+' degrees Celcius out there in '+response.body.timezone+' . \n'))
    console.log('There is a '+ percentRainChance+' percent chance of rain.\n' )
}
   
})

*/