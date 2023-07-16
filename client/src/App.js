import * as React from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Room, Star } from "@mui/icons-material";
import "./app.css";
import axios from "axios";
import { format } from "timeago.js";

function App() {
  const currentUser = "john";
  const [pins, setPins] = React.useState([]);
  // const [zoom, setZoom] = React.useState(5);
  const [currentPlaceId, setCurrentPlaceId] = React.useState(null);
  const [newPlace, setNewPlace] = React.useState(null);
  const [viewState, setViewState] = React.useState({
    longitude: 77.1025,
    latitude: 28.7041,
    zoom: 5,
  });
  // const [showPopup, setShowPopup] = React.useState(true);
  // const handleViewStateChange = (viewState) => {
  //   setZoom(initialViewState.zoom);
  //   console.log(viewState);
  // };
  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewState({...viewState,latitude:lat,longitude:long})
  };
  const handleAddClick = (e) => {
    console.log("hllo");
    const {lng, lat} = e.lngLat;
    setNewPlace({
      lat:lat,                                    //(don't need to write lat:lat )-> ES6 syntax
      lng:lng,
    });
  };
  React.useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  return (
    <Map
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      {...viewState}
    
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"

      onMove={evt => setViewState(evt.viewState)}
      onDblClick={handleAddClick}
    >
      {pins.map((p) => (
        <React.Fragment key={p._id}>
          <Marker longitude={p.long} latitude={p.lat} anchor="bottom">
            <Room
              style={{
                fontSize: viewState.zoom * 10,
                color: p.username === currentUser ? "tomato" : "slateblue",
                cursor: "pointer",
              }}
              onClick={() => handleMarkerClick(p._id,p.lat,p.long)}
            />
          </Marker>
          {p._id === currentPlaceId && (
            <Popup
              longitude={p.long}
              latitude={p.lat}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setCurrentPlaceId(null)}
              anchor="left"
              // onClose={() => setShowPopup(false)}
            >
              <div className="card">
                <label>Place</label>
                <h4 className="place">{p.title}</h4>
                <label>Review</label>
                <p className="desc">{p.desc}</p>
                <label>Rating</label>
                <div className="stars">
                  <Star className="star" />
                  <Star className="star" />
                  <Star className="star" />
                  <Star className="star" />
                  <Star className="star" />
                </div>
                <label>Information</label>
                <span className="usrname">
                  Created by <b>{p.username}</b>
                </span>
                <span className="date">{format(p.createdAt)}</span>
              </div>
            </Popup>
          )}
        </React.Fragment>
      ))}
      {newPlace && 
      <Popup
              longitude={newPlace.lng}
              latitude={newPlace.lat}
              closeButton={true}
              closeOnClick={false}
              // onClose={() => setCurrentPlaceId(null)}
              onClose={() => setNewPlace(null)}
              anchor="left"
              // onClose={() => setShowPopup(false)}
            >hello</Popup>
      }
            </Map>
  );
}

export default App;
