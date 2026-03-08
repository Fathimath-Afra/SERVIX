import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Standard Leaflet Icon fix
let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// "slides" the map to the new worker position
function AutoPan({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.panTo([lat, lng], { animate: true, duration: 1.5 });
        }
    }, [lat, lng, map]);
    return null;
}

const LiveTrackingMap = ({ lat, lng, name }) => {
    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-blue-200 shadow-inner bg-gray-50">
            <MapContainer 
                center={[lat, lng]} 
                zoom={16} 
                scrollWheelZoom={false} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                
                <AutoPan lat={lat} lng={lng} />

                <Marker position={[lat, lng]}>
                    <Popup>
                        <p className="text-xs font-bold uppercase">{name} is here</p>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default LiveTrackingMap;