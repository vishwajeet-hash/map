import * as React from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Room, Star } from "@mui/icons-material";
import "./app.css";
import axios from "axios";
import {format} from "timeago.js"


function App() {
  const [pins, setPins] = React.useState([]);
  const [zoom, setZoom] = React.useState(5);
  const [currentPlaceId, setCurrentPlaceId] = React.useState(null);
  // const [showPopup, setShowPopup] = React.useState(true);
  const handleViewStateChange = (viewState) => {
    setZoom(viewState.zoom);
  };
  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
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
      initialViewState={{
        longitude: 77.1025,
        latitude: 28.7041,
        zoom: 5,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onViewStateChange={handleViewStateChange}
    >
      {pins.map((p) => (
        <React.Fragment key={p._id}>
          <Marker longitude={p.long} latitude={p.lat} anchor="bottom">
            <Room style={{ fontSize: zoom * 10, color: "slateblue" ,cursor: "pointer" }} onClick={() => handleMarkerClick(p._id)} />
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
    </Map>
  );
}

export default App;
