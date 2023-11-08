let map;
let featureLayer;
let infoWindow;
let lastInteractedFeatureIds = [];
let lastClickedFeatureIds = [];


function handleClick(/* MouseEvent */ e) {
  lastClickedFeatureIds = e.features.map((f) => f.placeId);
  lastInteractedFeatureIds = [];
  featureLayer.style = applyStyle;
  createInfoWindow(e);
}

function handleMouseMove(/* MouseEvent */ e) {
  lastInteractedFeatureIds = e.features.map((f) => f.placeId);
  featureLayer.style = applyStyle;
}

// Declare State locales via json
const states = getJson()[0];
const pids = getJson()[1];

async function initMap() {
  // Request needed libraries.
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 42.2625932, lng:-71.8022934 },
    zoom: 8,
    // In the cloud console, configure your Map ID with a style that enables the
    // 'Administrative Area Level 2' Data Driven Styling type.
    mapId: "155147bec9cead92",
    mapTypeControl: false,
  });

  //@ts-ignore
  featureLayer = map.getFeatureLayer("LOCALITY");

  featureLayer.addListener("click", handleClick);
//   featureLayer.addListener("mousemove", handleMouseMove);
  // Map event listener.
  map.addListener("mousemove", () => {
    // If the map gets a mousemove, that means there are no feature layers
    // with listeners registered under the mouse, so we clear the last
    // interacted feature ids.
    if (lastInteractedFeatureIds?.length) {
      lastInteractedFeatureIds = [];
      featureLayer.style = applyStyle;
    }
  });
  // Create the infowindow.
  infoWindow = new InfoWindow({});
  // Apply style on load, to enable clicking.
 
 
  featureLayer.style = applyStyle;


const colors = { 
    lebel: {
      name: "Most green (Class I renewable content)</span><span>Less green",
      color: "",
    },
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
    r14: {
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
    break: {
      name: "",
      color: "",
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

console.log(colors);
  
  legend = buildLegend(colors);
  
//   const children = legend.childNodes;
//  console.log(children[0]);
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(legend);
 
} //async function initMap()




function buildLegend(colors) {
   // Approved by DPU: #2c52a3, Waiting for DPU approval: #7bb0e1, Researching (in transition): #c6ddf3, 
  // Plan expired or suspended: #cecfd1, Municipal Light PLant (No Class I requirements): #a7a8ac
  const legend = document.getElementById("legend");
  
  for (const [i, [key, value]]  of Object.entries(Object.entries(colors))) {

      const name = value.name;
      const color = value.color;
      const div = document.createElement("div");
      if (i > 9) {
        div.innerHTML = '<div><div style="background-color:' + color +'"></div><div>' + name;
      } else if (i == 0 ) {
        div.setAttribute("id", "label");
        div.innerHTML = '<span>'+ name +'</span>';
      } else if (i == 9) {
        div.setAttribute("class", "break");
      } else {
        div.innerHTML = '<div style="background-color:' + color +'">' + name;
      }
      legend.appendChild(div);
    }
  return legend;
  // console.log(infoWin);
   
}

// Helper function for the infowindow.
async function createInfoWindow(event) {
  let feature = event.features[0];

  if (!feature.placeId) return;
  const locality = states[feature.placeId];
// console.log(locality);
  // Update the infowindow.
  const place = await feature.fetchPlace();
  let content =
    "<span><strong> " +
    place.displayName +
    "</strong><br/> Status: " +
    locality.Status +
    "<br/> Renewable: " + 
    locality.Renewable + 
    "</span>";

  updateInfoWindow(content, event.latLng);
}

// Define styles.
// Stroke and fill with minimum opacity value.
const styleDefault = {
  strokeColor: "#000",
  strokeOpacity: 1.0,
  strokeWeight: .25,
  fillColor: "white",
  fillOpacity: 1, // Polygons must be visible to receive events.
};
// Style for the clicked polygon.
const styleClicked = {
  ...styleDefault,
  fillColor: "white",
  strokeWeight: 1,
  fillOpacity: 0.75,
};

const styleNone = {
    strokeColor: "#000",
    strokeOpacity: 0,
    strokeWeight: 0,
    fillColor: "white",
    fillOpacity: 0, // Polygons must be visible to receive events.
  };

// Apply styles using a feature style function.
function applyStyle(/* FeatureStyleFunctionOptions */ params) {
  
  const placeId = params.feature.placeId;
 
    if (pids.includes(placeId)) {
    const locality = states[placeId];
    // console.log(locality);
    let style = styles(locality);
    //console.log(style.fillColor); // #color
    styleDefault['fillColor'] = style.fillColor;
    //@ts-ignore
    if (lastClickedFeatureIds.includes(placeId)) {
        return styleClicked;
    }
    return styleDefault;
    } else {
        return styleNone;
    }
}

// Helper function to create an info window.
function updateInfoWindow(content, center) {
  infoWindow.setContent(content);
  infoWindow.setPosition(center);
  infoWindow.open({
    map,
    shouldFocus: false,
  });
}

function styles(obj) {
    let fillColor;
switch (obj.Status) {
    case "No Class 1":
      fillColor = "#837359";
      break;
    case "Default > 5%":
      if (obj.Renewable >= 30) {
        fillColor = "#095909" //#0e7c3a
      } else if (obj.Renewable >= 20) {
        fillColor = "#2d8e54"; 
      } else if (obj.Renewable >= 10) {
        fillColor = "#b3e0b8"; 
      } else {
        fillColor = "#94d2ad";
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
    };
}


function getJson() {
    const myRequest = new Request('./localities.json');
    //const states = {};
    let pids = [];
    const states = {};
    fetch(myRequest)
    .then((response) => response.json())
    .then((data) => {
        for (const programs of data) {
            pids.push(programs.pid);
            states[programs.pid] = {
                'Status' : programs.Status, 
                'Renewable' : programs.Renewable,
                'lat' : programs.lat, 
                'lng' : programs.lng,
                'name' : programs.City,
              };
        }
    })
    .catch(console.error);   
    // return states;
    return [states, pids];
}


initMap();