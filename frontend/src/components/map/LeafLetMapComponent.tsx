import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ScrollInstructionOverlay from "./ScrollInstructionOverlay";

interface AddressCoordinatesProps {
  address: string;
  lat: number;
  lon: number;
}

function LeafletMapComponent({ address, lat, lon }: AddressCoordinatesProps) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lon], 15);
  }, [lat, lon, map]);

  return (
    <>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lon]}>
        <Popup>{address}</Popup>
      </Marker>
    </>
  );
}

function MapWrapper(props: AddressCoordinatesProps) {
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const mapContainer = document.getElementById("map-container");

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && mapContainer) {
        mapContainer.style.pointerEvents = "auto";
        setShowOverlay(false);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey && mapContainer) {
        mapContainer.style.pointerEvents = "none";
        setShowOverlay(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // disabled interactions
    if (mapContainer) {
      mapContainer.style.pointerEvents = "none";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "400px" }}>
      {showOverlay && <ScrollInstructionOverlay />}
      <MapContainer
        id="map-container"
        center={[props.lat, props.lon]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <LeafletMapComponent {...props} />
      </MapContainer>
    </div>
  );
}

export default MapWrapper;
