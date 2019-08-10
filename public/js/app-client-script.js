console.log('Client Side JavaScript file is loaded')

/*
fetch('http://puzzle.mead.io/puzzle').then((response) => {
    response.json().then((data) =>{
        console.log(data)
    })
})*/ //Sample.
/*
fetch('http://localhost:3000/weather?address=Bangalore').then((response) => {
    response.json().then((data) => {
        if (data.error){
            console.log(data.error)
        }else {
            console.log(data.location)
            console.log(data.forecast)
        }
    })
})
*/ /// Worked for testing.. 

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
    console.log('hello')
    //fetch('https://127.0.0.1/weather?address='+location).then((response) => {
    console.log('https://afe71dc4f1014ab0bc5898277eb4513d.vfs.cloud9.us-east-1.amazonaws.com/weather?address='+location)
    fetch('https://afe71dc4f1014ab0bc5898277eb4513d.vfs.cloud9.us-east-1.amazonaws.com/weather?address='+location).then((response) => {
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
