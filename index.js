
async function initMap() {

  // Request needed libraries.
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker",
  );
    const map = new Map(document.getElementById("map"), {
      center: { lat: 42.2625932, lng:-71.8022934 }, //Worcester MA
      zoom: 9,
      mapId: "155147bec9cead92",  //7ba16be0c9375fa7
    });

    const featureLayer = map.getFeatureLayer(
      google.maps.FeatureType.LOCALITY
    );
  
    featureLayer.style = (featureStyleFunctionOptions) => {
      const placeFeature = featureStyleFunctionOptions.feature;
      const locality = states[placeFeature.placeId];
      const obj = new Object(locality);
      // console.log(pid.pid);
      let fillColor;
  
       const infoWindow = new google.maps.InfoWindow({
      content: "",
      disableAutoPan: true,
    });

      switch (obj.Status) {
        case "No Class 1":
          fillColor = "#837359";
          break;
        case "Default > 5%":
          if (obj.Renewable > 30) {
            fillColor = "#0e7c3a"
          } else if (obj.Renewable > 20) {
            fillColor = "#7abc96"; 
          } else if (obj.Renewable > 10) {
            fillColor = "#b3e0b8"; 
          } else {
            fillColor = "#095909"; 
          }
          break;
        case "No Aggregation":
          fillColor = "#837359"; 
          break;
        case "Opt Up Class I":
          fillColor = "#d9c3a2";
          break;
        case "Approved by DPU":
            fillColor = "#2c52a3";
            break;
        case "Waiting for DPU approval":
          fillColor = "#7bb0e1";
          break;
        case "Researching (in transition)":
          fillColor = "#c6ddf3";
          break;
        case "Plan expired or suspended":
          fillColor = "#cecfd1";
          break;
        case "Municipal Light Plant":
            fillColor = "#a7a8ac";
            break;
        default:
          fillColor = "white";
          break;
      }  return {
        fillColor,
        fillOpacity: 1,
      };
    };

   

    const myRequest = new Request('./localities.json');
    const states = {};
    fetch(myRequest)
    .then((response) => response.json())
    .then((data) => {
      for (const programs of data) {
       //states[programs.pid] = programs.Status;
       states[programs.pid] = {
        'Status' : programs.Status, 
        'Renewable' : programs.Renewable,
        'lat' : programs.lat, 
        'lng' : programs.lng
      };
     }

    })
    .catch(console.error);

console.log(states);

const colors = { 
  r30: {
    name: "> 30%",
    color: "#095909",
  },
  r2029: {
    name: "20 - 29%",
    color: "#0e7c3a",
  },
  r1019: {
    name: "10 - 19%",
    color: "#7abc96",
  },
  r59: {
    name: "5 - 9%",
    color: "#b3e0b8",
  },
  r59: {
    name: "1 - 4%",
    color: "#c9e7d9",
  },
  optUp: {
    name: "Opt Up option",
    color: "#d9c3a2",
  },
  noClass: {
    name: "No Class I",
    color: "#837359",
  },
  Other: {
    name: "No Aggregation",
    color: "#f2f9f4",
  },
  app_dpu: {
    name: "Approved by DPU",
    color: "#2c52a3",
  },
  waiting: {
    name: "Waiting for DPU approval",
    color: "#7bb0e1",
  },
  research: {
    name: "Researching (in transition)",
    color: "#c6ddf3",
  },
  expired: {
    name: "Plan expired or suspended",
    color: "#cecfd1",
  },
  muni: {
    name: "Municipal Light PLant (No Class I requirements)",
    color: "#a7a8ac",
  },
};
// Approved by DPU: #2c52a3, Waiting for DPU approval: #7bb0e1, Researching (in transition): #c6ddf3, 
// Plan expired or suspended: #cecfd1, Municipal Light PLant (No Class I requirements): #a7a8ac

const legend = document.getElementById("legend");

let i = 0;
  for (const key in colors) {
    i++;
    const type = colors[key];
    const name = type.name;
    const color = type.color;
    const div = document.createElement("div");
    if (i > 8) {
      div.innerHTML = '<div><div style="background-color:' + color + '"></div><div>' + name;
    } else if (i == 1 ) {
      div.setAttribute("id", "label");
      div.innerHTML = '<span>Most green (Class I renewable content)</span><span>Less green</span>';
    } else if (i == 8) {
      div.setAttribute("class", "break");;
    } else {
      div.innerHTML = '<div style="background-color:' + color + '">' + name ;
    }
    legend.appendChild(div);
  }

  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(legend);


  }
  
  initMap();