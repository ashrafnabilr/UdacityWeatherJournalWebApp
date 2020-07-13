/* Global Variables */
let baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
let authenticationKey = '&appid=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

// Create a new date instance dynamically with JS
let d = new Date();
/* We have to add 1 to the getMonth() function as it returns months from index 0 */
let monthDate = parseInt(d.getMonth()) + 1;
let newDate = monthDate.toString()+'.'+ d.getDate()+'.'+ d.getFullYear();

document.getElementById('generate').addEventListener('click', generateClicked);

const retrieveWeatherData = async (url='') =>{ 
    const request = await fetch(url);
    try {
    // Transform into JSON
    const allData = await request.json();
    console.log(allData);
    return allData;
    }
    catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
};

const postDataToServer = async ( url = '', data = {})=>{
    const response = await fetch(url, {
    method: 'POST', 
    credentials: 'same-origin', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header        
  });

    try {
      const newData = await response.json();
      return newData;
    }catch(error) {
    console.log("error", error);
    }
};

function updateUIWithData(temp, date, feelings){
    document.getElementById('temp').innerText = 'Temperature: ' + temp;
    document.getElementById('date').innerText = 'Date: ' + date;
    document.getElementById('content').innerText = 'My Feelings: ' + feelings;
}

function generateClicked(){
    let zipCode = document.getElementById('zip').value;
    retrieveWeatherData(baseURL + zipCode + authenticationKey)
    .then(function(data){
        let contentText = document.getElementById('feelings').value;
        let dataDict = {date:newDate, temp:data.main.temp, content:contentText};
        postDataToServer('/postData', dataDict);
    })
    .then(function(){
        retrieveWeatherData('/getData')
        .then(function(data){
            updateUIWithData(data.temp, data.date, data.content);
        });
    });
}

