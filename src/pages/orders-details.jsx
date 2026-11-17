import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Header from "./header";

// Фикс иконки маркера Leaflet + Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Координаты Бишкека по умолчанию
const BISHKEK = [42.8746, 74.5698];

// Компонент для клика по карте
function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
}

const OrdersDetail = () => {
    const id = useParams().id;
    const [order, setOrder] = useState(null);
    // Координаты маркера на карте
    const [markerLat, setMarkerLat] = useState(BISHKEK[0]);
    const [markerLng, setMarkerLng] = useState(BISHKEK[1]);
    
    useEffect(() => {
        axios.get(`https://6a2fc982a7f8866418d5125a.mockapi.io/orders/${id}`).then((res) => {
            setOrder(res.data);
            if (res.data.lat && res.data.long) {
                setMarkerLat(res.data.lat);
                setMarkerLng(res.data.long);
            }
        });
    }, []);
  
return (
    <div className="container">
        <Header/>
        {order ? (
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden mt-3">

                {/* Заголовок */}
                <div className="card-header bg-primary text-white p-4 border-0">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                            <h4 className="mb-1 fw-bold">
                                <i className="bi bi-receipt me-2"></i>
                                Заказ #{order.id}
                            </h4>
                            <small className="opacity-75">
                                Информация о заказе
                            </small>
                        </div>

                        <span className={`badge rounded-pill px-3 py-2 fs-6 ${
                            order.status === "Завершен"
                                ? "bg-success"
                                : order.status === "Отменен"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                        }`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                {/* Информация */}
                <div className="card-body p-4">

                    <div className="row g-4">

                        {/* Данные клиента */}
                        <div className="col-lg-6">
                            <div className="border rounded-3 p-3 h-100">
                                <h5 className="fw-bold mb-3 text-primary">
                                    <i className="bi bi-person-circle me-2"></i>
                                    Данные клиента
                                </h5>

                                <div className="mb-3">
                                    <small className="text-muted d-block">
                                        Имя клиента
                                    </small>
                                    <span className="fw-semibold">
                                        {order.customerName || "Не указано"}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted d-block">
                                        Телефон
                                    </small>
                                    <span className="fw-semibold">
                                        <i className="bi bi-telephone me-2 text-primary"></i>
                                        {order.customerPhone || "Не указан"}
                                    </span>
                                </div>

                                <div>
                                    <small className="text-muted d-block">
                                        Адрес доставки
                                    </small>
                                    <span className="fw-semibold">
                                        <i className="bi bi-geo-alt me-2 text-danger"></i>
                                        {order.address || "Не указан"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Детали заказа */}
                        <div className="col-lg-6">
                            <div className="border rounded-3 p-3 h-100">
                                <h5 className="fw-bold mb-3 text-primary">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Детали заказа
                                </h5>

                                <div className="mb-3">
                                    <small className="text-muted d-block">
                                        Примечание
                                    </small>
                                    <p className="mb-0 fw-medium">
                                        {order.note || "Без примечаний"}
                                    </p>
                                </div>

                                <div className="bg-light rounded-3 p-3 mt-3">
                                    <small className="text-muted">
                                        Общая сумма заказа
                                    </small>
                                    <h3 className="text-success fw-bold mb-0 mt-1">
                                        {Number(order.totalAmount || 0).toLocaleString("ru-RU")} сом
                                    </h3>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Карта */}
                    <div className="mt-4">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                            <h5 className="fw-bold mb-0">
                                <i className="bi bi-map text-primary me-2"></i>
                                Местоположение доставки
                            </h5>

                            <span className="badge bg-light text-dark border">
                                <i className="bi bi-cursor me-1"></i>
                                Нажмите на карту, чтобы изменить точку
                            </span>
                        </div>

                        <div className="rounded-3 overflow-hidden border shadow-sm">
                            <MapContainer
                                center={[markerLat, markerLng]}
                                zoom={13}
                                style={{
                                    height: "400px",
                                    width: "100%"
                                }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />

                                <Marker position={[markerLat, markerLng]} />

                                <MapClickHandler
                                    onMapClick={(latlng) => {
                                        setMarkerLat(latlng.lat);
                                        setMarkerLng(latlng.lng);
                                    }}
                                />
                            </MapContainer>
                        </div>

                        {/* Координаты */}
                        <div className="d-flex flex-wrap gap-3 mt-3 text-muted small">
                            <span>
                                <i className="bi bi-geo me-1"></i>
                                Широта: {markerLat.toFixed(6)}
                            </span>
                            <span>
                                <i className="bi bi-geo me-1"></i>
                                Долгота: {markerLng.toFixed(6)}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        ) : (
            <div className="card border-0 shadow-sm rounded-4 text-center p-5">
                <i className="bi bi-exclamation-circle text-warning display-3 mb-3"></i>
                <h4 className="fw-bold">Заказ не найден</h4>
                <p className="text-muted mb-0">
                    Возможно, заказ был удалён или указан неверный ID.
                </p>
            </div>
        )}
    </div>
);

}

export default OrdersDetail;