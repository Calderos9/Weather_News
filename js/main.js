const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// Link to 7timer
const link = "https://www.7timer.info/bin/api.pl?"
let long;
let lat;
let dataCity; 

// Document Elements
const mainTemp = document.getElementById('main_temp');
const fadeDiv = document.getElementById('fadeDiv');
const triggerbutton = document.getElementById('triggerButton');
const selectElement = document.getElementById("Towns");
// Initializers
checkScreenWidth();
readCSV();
firstload();

// Methode to get the weather of the selected town
function getValue(){
  let selectedElement = selectElement.value;
  lat=dataCity[selectedElement][0];
  long=dataCity[selectedElement][1];

  // SetTimeout in the retrieval function to let animation roll
  setTimeout(function() {
    // Make a GET request
    fetch(link+"lon="+long+"&"+"lat="+lat+"&product=civillight&output=json")
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      else if(response.ok){
        fadeDiv.classList.remove('start');
        mainTemp.classList.remove('start');
        fadeDiv.classList.remove('fade-out');
        mainTemp.classList.remove('fade-out');
        fadeDiv.classList.add('fade-in'); 
        mainTemp.classList.add('fade-in');
      }
      return response.json();
    })
    .then(data => {
      // Create an unordered list element
      let table = document.createElement("table");
      for(let i=0;i<7;i++){
        //Set the main temp
        let temperatureMax = data.dataseries[i].temp2m.max;
        let temperatureMin = data.dataseries[i].temp2m.min;
        let weather = data.dataseries[i].weather;
        let day = setDate(data.dataseries[i].date.toString());
              
        if(i==0){
          mainTemp.innerHTML = `<h2>${dataCity[selectedElement][2]}</h2>`;
          mainTemp.innerHTML += `<img src=images/${weather}.png></img>`;
          mainTemp.innerHTML += `<p>${weather}</p>`;
          mainTemp.innerHTML += `<p>H:${temperatureMax}°C L:${temperatureMin}°C</p>`;
        }else{
          let row = document.createElement("tr");
          let dataArray = [day,weather,"H:"+temperatureMax+"°C L:"+temperatureMin+"°C"];
          dataArray.forEach(function(cellData, index){
            let cell = document.createElement("td");
            if(index==1){
              let img = document.createElement("img");
              img.src = "images/"+cellData+".png";
              cell.appendChild(img);
            }else{
              cell.textContent=cellData;
            }
            row.appendChild(cell);
          });
          table.appendChild(row);
        }     
      }
      // Append the table to the container
      document.getElementById("forcasts").removeChild(document.getElementById("forcasts").lastChild);
      document.getElementById("forcasts").appendChild(table);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }, 1000); 

}

// Add a click event listener to the button
triggerbutton.addEventListener('click',function(){
  // Add the 'fade-out' class to trigger the animation
  fadeDiv.classList.remove('fade-in');
  mainTemp.classList.remove('fade-in');
  fadeDiv.classList.add('fade-out');
  mainTemp.classList.add('fade-out');
})

// Add a event listener on the resizing of the screen
window.addEventListener('resize', checkScreenWidth);

//Function READSCV()
function readCSV() {
  //Filename
  let filename='/city_coordinates.csv';
  //Get the html element
  const options = document.getElementById('Towns');
  //is a built-in JavaScript object that allows you to make network requests to fetch data from a URL asynchronously. 
  var xhr = new XMLHttpRequest();
  //You set up event listeners to track the progress and state changes of the request.
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      // Request completed
      if (xhr.status === 200) {
          // Request was successful
          var csvData = xhr.responseText;
          let count=0;
          dataCity = csvData.split('\n').map(row => {
          var rowData=row.split(',');
          options.innerHTML+=`<option value="${count}">${rowData[2]}</option>`;
          count++;
          return rowData;
        });

        
        // Now you can work with the dataArray
      } else {
        console.error('Failed to load CSV file');
      }
    }
  };
  //Next, you need to open a connection to the server using the open() method.
  xhr.open('GET', filename, false);
  //After setting up the request, you send it to the server using the send() 
  xhr.send();
}

// Function to change the text of the button
function changeButtonText(underSize) {
  var button = document.getElementById('triggerButton');
  if(underSize==true){
    button.textContent = 'Search'
  }else{
    button.textContent = '⌕';
  }
}

// Check screen width and execute the function
function checkScreenWidth() {
  if (window.innerWidth <= 1024) {
      changeButtonText(true);
  }
  else{
    changeButtonText(false);
  }
}

// Function to execute on the first loading 
function firstload(){
  mainTemp.classList.add('start');
  fadeDiv.classList.add('start');
}

// Function on receiving the date, convert it on a appopriate day format
function setDate(date){
  date = date.slice(0,4)+"-"+date.slice(4,6)+"-"+date.slice(6); 
  let d = new Date(date);
  return days[d.getDay()];
}