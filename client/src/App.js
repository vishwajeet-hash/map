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
  const [zoom, setZoom] = React.useState(5);
  const [currentPlaceId, setCurrentPlaceId] = React.useState(null);
  const [newPlace, setNewPlace] = React.useState(null);
  // const [showPopup, setShowPopup] = React.useState(true);
  const [viewport, setViewport] = React.useState({
    longitude: 77.1025,
    latitude: 28.7041,
    zoom: 5,
  });
  const handleViewStateChange = (viewState) => {
    setZoom(viewState.zoom);
  };
  const handleMarkerClick = (id, lat, long) => {
    console.log(123)
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };
  const handleAddClick = (e) => {
    const { lng, lat } = e.lngLat;
    setNewPlace({
      lat: lat, //(don't need to write lat:lat )-> ES6 syntax
      lng: lng,
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
    {...viewport}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onViewStateChange={handleViewStateChange}
      onDblClick={handleAddClick}
    >
      {pins.map((p) => (
        <React.Fragment key={p._id}>
          <Marker longitude={p.long} latitude={p.lat} anchor="bottom">
            <Room
              style={{
                fontSize: zoom * 10,
                color: p.username === currentUser ? "tomato" : "slateblue",
                cursor: "pointer",
              }}
              onClick={() => handleMarkerClick(p._id,p.lat, p.long)}
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
      {newPlace && (
        <Popup
          longitude={newPlace.lng}
          latitude={newPlace.lat}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setNewPlace(null)}
          anchor="left"
          // onClose={() => setShowPopup(false)}
        >
          hello
        </Popup>
      )}
    </Map>
  );
}

export default App;
