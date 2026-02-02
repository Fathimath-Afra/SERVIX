import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'; // Added useMap
import { useEffect } from 'react';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// 🆕 Helper component to move the map when data arrives
function RecenterMap({ tasks }) {
    const map = useMap();
    useEffect(() => {
        if (tasks.length > 0 && tasks[0].location) {
            const { lat, lng } = tasks[0].location;
            map.setView([lat, lng], 13); // Moves camera to first task
        }
    }, [tasks, map]);
    return null;
}

const TaskOverviewMap = ({ tasks }) => {
    const validTasks = tasks.filter(t => t.location && t.location.lat && t.location.lng);

    return (
        <div className="h-[400px] w-full border-b border-gray-200 mb-8 z-0 relative bg-blue-100">
            <MapContainer 
                center={[0, 0]} 
                zoom={2} 
                scrollWheelZoom={true} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* 🆕 This component handles the auto-centering */}
                <RecenterMap tasks={validTasks} />

                {validTasks.map((task) => (
                    <Marker key={task._id} position={[task.location.lat, task.location.lng]}>
                        <Popup>
                            <div className="p-1 font-sans">
                                <p className="font-black uppercase text-[10px] text-blue-600">{task.category}</p>
                                <h3 className="font-bold text-sm">{task.title}</h3>
                                <p className="text-xs text-gray-500">Status: {task.status}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            
            <div className="absolute bottom-4 right-4 bg-white p-2 border border-gray-200 shadow-sm z-[1000] text-[10px] font-bold uppercase">
                📍 {validTasks.length} Tasks Nearby
            </div>
        </div>
    );
};

export default TaskOverviewMap;