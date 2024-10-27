/* eslint-disable react-hooks/exhaustive-deps */
import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import BuildingContext from "store/BuildingContext";

// Components
import { GeoJsonLayer } from "@deck.gl/layers";
import DeckGL, { FlyToInterpolator } from "deck.gl";
import { Map as MapUi } from "react-map-gl";

interface initialViewStateProps {
  latitude: number;
  longitude: number;
  zoom: number;
  pitch: number;
  transitionDuration: number;
  opacity?: number;
  transitionInterpolator?: FlyToInterpolator;
}

export const Map = () => {
  const { state, setBuildingPolygon, setLandingPolygon } =
    useContext(BuildingContext);

  const [initialViewState, setInitialViewState] =
    useState<initialViewStateProps>({
      longitude: 6.6111029,
      latitude: 46.5141469,
      zoom: 17,
      pitch: 10,
      transitionDuration: 8000,
      opacity: 0.5,
    });

  const goToNewCoordinate = useCallback(() => {
    if (state.landingPolygon?.coordinates[0] !== undefined) {
      setInitialViewState({
        longitude: state.landingPolygon.coordinates[0][0][0][0],
        latitude: state.landingPolygon.coordinates[0][0][0][1],
        zoom: 16,
        pitch: 10,
        transitionDuration: 5000,
        transitionInterpolator: new FlyToInterpolator(),
      });
    }
  }, [state.landingPolygon]);

  useEffect(() => {
    goToNewCoordinate();
  }, [goToNewCoordinate]);

  const LandingLayer = useMemo(() => {
    let layer = new GeoJsonLayer({
      id: "building",
      data: {
        type: "Feature",
        properties: {},
        geometry: state.landingPolygon,
      },
      filled: true,
      stroked: true,
      extruded: false,
      getLineWidth: 5,
      lineWidthUnits: "meters",
      autoHighlight: true,
      highlightColor: [100, 111, 255, 220],
      getFillColor: [133, 133, 133, 200],
      getLineColor: [111, 111, 111],
      getPointRadius: 100,
    });

    return layer;
  }, [state.landingPolygon]);

  const BuildingLayer = useMemo(() => {
    if (!state.buildingPolygon.coordinates?.length) return [];

    // Create horizontal lines for each floor
    const floorLines = [];
    for (let floor = 1; floor < state.numberOfFloors; floor++) {
      // Get the building polygon coordinates
      const coordinates = state.buildingPolygon.coordinates[0][0];
      
      // Create a line feature at each floor height
      const floorHeight = floor * state.floorHeight;
      
      // Create lines connecting each vertex of the polygon at the floor height
      for (let i = 0; i < coordinates.length - 1; i++) {
        floorLines.push({
          type: "Feature",
          properties: { height: floorHeight },
          geometry: {
            type: "LineString",
            coordinates: [
              [...coordinates[i], floorHeight],   // Start point with elevation
              [...coordinates[i + 1], floorHeight] // End point with elevation
            ]
          }
        });
      }
      
      // Close the shape by connecting the last vertex to the first
      floorLines.push({
        type: "Feature",
        properties: { height: floorHeight },
        geometry: {
          type: "LineString",
          coordinates: [
            [...coordinates[coordinates.length - 1], floorHeight],
            [...coordinates[0], floorHeight]
          ]
        }
      });
    }

    return [
      // Base building
      new GeoJsonLayer({
        id: "building-base",
        data: {
          type: "Feature",
          properties: {},
          geometry: state.buildingPolygon,
        },
        filled: true,
        stroked: true,
        extruded: true,
        getElevation: state.floorHeight * state.numberOfFloors,
        getFillColor: [160, 160, 180, 200],
        getLineColor: [50, 50, 50],
        getLineWidth: 1,
        lineWidthUnits: "pixels",
      }),
      // Floor lines
      new GeoJsonLayer({
        id: "floor-lines",
        data: floorLines,
        stroked: true,
        filled: false,
        lineWidthUnits: "pixels",
        getLineWidth: 2,
        getLineColor: [30, 30, 30],
        getElevation: (d: any) => (d as { properties: { height: number } }).properties.height,
        parameters: {
          depthTest: true,
          lineWidthMinPixels: 1,
        }
      })
    ];
  }, [state.buildingPolygon, state.floorHeight, state.numberOfFloors]);

  const mapRef = useRef(null);
  const deckRef = useRef(null);

  return (
    <DeckGL
      ref={deckRef}
      controller={true}
      initialViewState={initialViewState}
      layers={[LandingLayer, ...BuildingLayer]}
    >
      <MapUi
        ref={mapRef}
        style={{ height: "100vh" }}
        mapStyle="mapbox://styles/rafilos556/ckhrp0auk0ol119s02qvctvh4"
        mapboxAccessToken="pk.eyJ1IjoicmFmaWxvczU1NiIsImEiOiJja2hoaHFwZjcwZ3pyMnFwNmY3aHY2eDg4In0.Ai4rUxBMjwoNzHTIDqmuBA"
      />
    </DeckGL>
  );
};

export default Map;
