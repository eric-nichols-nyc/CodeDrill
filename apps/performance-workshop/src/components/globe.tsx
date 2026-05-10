import { useWheel } from "@use-gesture/react";
import { type GeoPermissibleObjects, geoOrthographic, geoPath } from "d3-geo";
import { useEffect, useMemo, useRef, useState } from "react";
import { animated, useSpring } from "react-spring";
import { feature } from "topojson-client";
import jsonData from "./countries-110m.json";

// @ts-expect-error 🤷‍♂️
const Countries = feature(jsonData, jsonData.objects.countries).features;

const Globe = animated(
  ({
    lat = 0,
    lng = 0,
    zoom,
    size = 400,
    onGlobeClick,
    currentLocation,
  }: {
    lat: number;
    lng: number;
    zoom: number;
    size: number;
    onGlobeClick: (lat: number, lng: number) => void;
    currentLocation: { userLat: number; userLng: number };
  }) => {
    const svgref = useRef<SVGSVGElement>(null);
    const projection = useMemo(
      () =>
        geoOrthographic()
          .translate([size / 2, size / 2])
          .scale((size / 2) * zoom)
          .clipAngle(90)
          .rotate([-lat, -lng]),
      [size, lat, lng, zoom]
    );

    const pathgen = geoPath(projection);
    const currentCoordinates: [number, number] = [
      currentLocation.userLng,
      currentLocation.userLat,
    ];
    const pinSize = size / 60 / zoom;
    // Check if it's behind the globe
    const isPinVisible = pathgen({
      type: "Point",
      coordinates: currentCoordinates,
    });

    return (
      <svg height={size} ref={svgref} width={size}>
        <title>globe</title>
        <defs>
          <radialGradient
            cx="50%"
            cy="50%"
            fx="50%"
            fy="50%"
            id="gradient"
            r="50%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#325181", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#293E5F", stopOpacity: 1 }}
            />
          </radialGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="url(#gradient)"
          onClick={(e) => {
            if (!(svgref.current && projection.invert)) return;
            const rect = svgref.current.getBoundingClientRect();
            const inverted = projection.invert([
              e.pageX - rect.left,
              e.pageY - rect.top,
            ]);
            if (!inverted) return;
            const [lat, lng] = inverted;
            onGlobeClick.call(null, lat, lng);
          }}
          r={(size / 2) * zoom}
          style={{ cursor: "pointer" }}
        />
        <g style={{ pointerEvents: "none" }}>
          {Countries.map((d: GeoPermissibleObjects) => pathgen(d))
            .filter(Boolean)
            .map((d: string, i: number) => (
              <path d={d} fill="#63A2FF" key={`path-${i}`} stroke="#5891E5" />
            ))}
        </g>
        {currentLocation.userLat && isPinVisible
          ? [0, 1].map((pin) => (
              <circle
                className={`pin-${pin}`}
                cx={projection(currentCoordinates)?.[0]}
                cy={projection(currentCoordinates)?.[1]}
                fill="#fff"
                key={pin}
                r={pinSize >= 15 ? 5 : size / 60 / zoom}
              />
            ))
          : null}
      </svg>
    );
  }
);

function GlobeContainer({ size = 400 }) {
  const [state, setState] = useState({
    lat: 0,
    lng: 0,
    userLat: 0,
    userLng: 0,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) =>
      setState({
        userLng: position.coords.longitude,
        userLat: position.coords.latitude,
        lat: position.coords.longitude,
        lng: position.coords.latitude,
      })
    );
  }, [setState]);

  // Panning
  const { lat, lng } = useSpring({
    lat: state.lat,
    lng: state.lng,
  });

  // Zooming (use cmd/ctrl + scroll to zoom)
  const [zoom, setZoom] = useState({
    wheeling: false,
    scale: 1,
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  const bind = useWheel(
    ({ wheeling, metaKey, delta: [_deltaX, deltaY], event }) => {
      if (metaKey && event) {
        const newScale = Math.min(Math.max(zoom.scale + deltaY / 600, 0.2), 10);

        setZoom({
          ...zoom,
          scale: newScale,
          wheeling: Boolean(wheeling),
        });
      } else {
        setZoom({
          ...zoom,
          wheeling: Boolean(wheeling),
        });
      }
    }
  );

  return (
    <div {...bind()} ref={canvasRef}>
      <Globe
        currentLocation={{ userLat: state.userLat, userLng: state.userLng }}
        lat={lat}
        lng={lng}
        onGlobeClick={(lat: number, lng: number) => {
          setState({
            ...state,
            lat,
            lng,
          });
        }}
        size={size}
        zoom={zoom.scale}
      />
    </div>
  );
}

export default GlobeContainer;
