// async function fetchJSON() {
//   let response = await fetch('./localities.json');
//   let user = await response.json();
//   return user;
// }

// async function fetchAsync () {
//   // await response of fetch call
//   const response = await fetch('./localities.json');
//   // only proceed once promise is resolved
//   const data = await response.json();
//   // only proceed once second promise is resolved
//   return data;
// }

async function initMap() {

// for (const a in locales) {
//   console.log(a);
// }
//   let response = await fetch('./localities.json');
//  let locales = await response.json();
  // console.log(locales)
  // Request needed libraries.
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker",
  );
    const map = new Map(document.getElementById("map"), {
      center: { lat: 42.2625932, lng:-71.8022934 }, //Worcester MA
      zoom: 9,
      // In the cloud console, configure this Map ID with a style that enables the
      // "Administrative Area Level 1" feature layer.
      mapId: "155147bec9cead92",  //7ba16be0c9375fa7
    });
    // const featureLayer = map.getFeatureLayer(
    //   google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_1,
    // );
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

    // // Create an array of alphabetical characters used to label the markers.
    // const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // // Add some markers to the map.
    // const markers = locations.map((position, i) => {
    //   const label = labels[i % labels.length];
    //   const pinGlyph = new google.maps.marker.PinElement({
    //     glyph: label,
    //     glyphColor: "white",
    //   });
    //   const marker = new google.maps.marker.AdvancedMarkerElement({
    //     position,
    //     content: pinGlyph.element,
    //   });
  
    //   // markers can only be keyboard focusable when they have click listeners
    //   // open info window when marker is clicked
    //   marker.addListener("gmp-click", () => {
    //     infoWindow.setContent(position.lat + ", " + position.lng);
    //     infoWindow.open(map, marker);
    //   });
    //   return marker;
    // });

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
  
  // const locations = [
  //   { lat: -31.56391, lng: 147.154312 },
  //   { lat: -33.718234, lng: 150.363181 },
  //   { lat: -33.727111, lng: 150.371124 },
  //   { lat: -33.848588, lng: 151.209834 },
  //   { lat: -33.851702, lng: 151.216968 },
  //   { lat: -34.671264, lng: 150.863657 },
  //   { lat: -35.304724, lng: 148.662905 },
  //   { lat: -36.817685, lng: 175.699196 },
  //   { lat: -36.828611, lng: 175.790222 },
  //   { lat: -37.75, lng: 145.116667 },
  //   { lat: -37.759859, lng: 145.128708 },
  //   { lat: -37.765015, lng: 145.133858 }, 
  //   { lat: -37.770104, lng: 145.143299 },
  //   { lat: -37.7737, lng: 145.145187 },
  //   { lat: -37.774785, lng: 145.137978 },
  //   { lat: -37.819616, lng: 144.968119 },
  //   { lat: -38.330766, lng: 144.695692 },
  //   { lat: -39.927193, lng: 175.053218 },
  //   { lat: -41.330162, lng: 174.865694 },
  //   { lat: -42.734358, lng: 147.439506 },
  //   { lat: -42.734358, lng: 147.501315 },
  //   { lat: -42.735258, lng: 147.438 },
  //   { lat: -43.999792, lng: 170.463352 },
  // ];
  
  initMap();