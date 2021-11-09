import React, { useEffect, useRef, useState } from 'react';
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
  center,
}) {
  const mapElement = useRef();
  const map = useRef();
  const maker = useRef();

  useEffect(() => {
    const { coordinates, address } = mapLocation;
    const [long, lat] = coordinates;
    map.current = tt.map({
      key: MAP_API_KEY,
      container: mapElement.current,
      center: [parseFloat(long), parseFloat(lat)],
      zoom: mapZoom,
    });
    if (maker.current) maker.current.remove();

    function createMaker(markerCoordinates, popup) {
      const markerElement = document.createElement('div');
      markerElement.innerHTML = `<img src='${iconMap[icon]}' style='width: 36px; height: 36px';>`;
      return new tt.Marker({ element: markerElement })
        .setLngLat(markerCoordinates)
        .setPopup(popup)
        .addTo(map.current);
    }

    function drawMarkerOnMap(geoResponse) {
      if (
        geoResponse &&
        geoResponse.addresses &&
        geoResponse.addresses[0].address.freeformAddress
      ) {
        const pos = geoResponse.addresses[0].position;
        maker.current.remove();
        maker.current = createMaker(
          geoResponse.addresses[0].position,
          new tt.Popup({
            offset: 35,
            closeButton: false,
            className: 'text-center max-w-42',
          }).setHTML(geoResponse.addresses[0].address.freeformAddress)
        );
        maker.current.togglePopup();
        onChangeMapLocation({
          coordinates: [pos.lng, pos.lat],
          address: geoResponse.addresses[0].address.freeformAddress,
        });
      }
    }

    function handleClickMap(position) {
      ttServices.services
        .reverseGeocode({
          key: MAP_API_KEY,
          position: position,
        })
        .then(function (results) {
          drawMarkerOnMap(results);
        });
    }

    map.current.on('click', function (event) {
      handleClickMap(event.lngLat);
    });

    const initCoordinates = [parseFloat(long), parseFloat(lat)];
    maker.current = createMaker(
      initCoordinates,
      new tt.Popup({
        offset: 35,
        closeButton: false,
        className: 'text-center max-w-42',
      }).setHTML(address)
    );

    maker.current.togglePopup();
    return () => map.current.remove();
  }, [center]);

  return <div ref={mapElement} className="h-96 md:h-128 shadow-xl" />;
}
