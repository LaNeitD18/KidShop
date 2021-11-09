import React, { useEffect, useRef } from 'react';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import * as tt from '@tomtom-international/web-sdk-maps';
import * as ttServices from '@tomtom-international/web-sdk-services';

const mapZoom = 6;
const iconMap = {
  store: 'https://i.ibb.co/Bn0XnWm/location-pin.png',
};

const MAP_API_KEY = 'IsOviojVHPpliKxoC7WZj9WtqaIQ6YPG';

export default function Map({
  mapLocation,
  onChangeMapLocation,
  icon = 'store',
}) {
  const { coordinates, address } = mapLocation;
  const [long, lat] = coordinates;
  const mapElement = useRef();

  useEffect(() => {
    let map = tt.map({
      key: MAP_API_KEY,
      container: mapElement.current,
      center: [parseFloat(long), parseFloat(lat)],
      zoom: mapZoom,
    });
    const initCoordinates = [parseFloat(long), parseFloat(lat)];
    let maker;
    function createMaker(markerCoordinates, popup) {
      const markerElement = document.createElement('div');
      markerElement.innerHTML = `<img src='${iconMap[icon]}' style='width: 36px; height: 36px';>`;
      return new tt.Marker({ element: markerElement })
        .setLngLat(markerCoordinates)
        .setPopup(popup)
        .addTo(map);
    }
    maker = createMaker(
      initCoordinates,
      new tt.Popup({
        offset: 35,
        closeButton: false,
        className: 'text-center max-w-42',
      }).setHTML(address)
    );
    maker.togglePopup();

    function drawMarkerOnMap(geoResponse) {
      if (
        geoResponse &&
        geoResponse.addresses &&
        geoResponse.addresses[0].address.freeformAddress
      ) {
        const pos = geoResponse.addresses[0].position;
        maker.remove();
        maker = createMaker(
          geoResponse.addresses[0].position,
          new tt.Popup({
            offset: 35,
            closeButton: false,
            className: 'text-center max-w-42',
          }).setHTML(geoResponse.addresses[0].address.freeformAddress)
        );
        maker.togglePopup();
        onChangeMapLocation({
          coordinates: [pos.lng, pos.lat],
          address: geoResponse.addresses[0].address.freeformAddress,
        });
      }
    }

    map.on('click', function (event) {
      const position = event.lngLat;
      ttServices.services
        .reverseGeocode({
          key: MAP_API_KEY,
          position: position,
        })
        .then(function (results) {
          drawMarkerOnMap(results);
        });
    });
    return () => map.remove();
  }, []);

  // useEffect(() => {}, [map, onChangeMapLocation]);
  return <div ref={mapElement} className="h-96 md:h-128 shadow-xl" />;
}
