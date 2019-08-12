console.log('Client Side JavaScript file is loaded')
// Specify the Front End Service Endpoint URL / Load Balancer URL 
//e.g. http://front-end.poc-demo.work      .. if port 80, then leave as it is, else use port http://front-end.poc-demo.work:8080

const frontEndDNSURLandPort = 'http://front-end.poc-demo.work'

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-One')
const messageTwo = document.querySelector('#message-Two')

messageOne.textContent = '.......'
messageTwo.textContent = '.......'



weatherForm.addEventListener('submit', (event) =>{
    event.preventDefault()      //prevent default page refresh
    const location = search.value
    messageOne.textContent = 'Searching... Please Wait......'
    messageTwo.textContent = '.......'
  //  const onevar = document.currentScript.getAttribute('onevar')


    
    console.log('https://afe71dc4f1014ab0bc5898277eb4513d.vfs.cloud9.us-east-1.amazonaws.com/weather?address='+location)
  //fetch('https://afe71dc4f1014ab0bc5898277eb4513d.vfs.cloud9.us-east-1.amazonaws.com/weather?address='+location).then((response) => {
    
  fetch(frontEndDNSURLandPort+'/weather?address='+location).then((response) => {
    
        
             //fetch('https://localhost:8080/weather?address='+location).then((response) => {
        response.json().then((data) => {
            if (data.error){
                console.log(data.error)
                messageTwo.textContent = data.error
                messageOne.textContent = '.......'
            }else {
                
                console.log(data.location)
                
                messageOne.textContent = data.location
                console.log(data.forecast)
                messageTwo.textContent = data.forecast

            }
        })
    })

    console.log(location)
 
})

    