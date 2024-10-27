import { useContext } from "react";

import BuildingContext from "store/BuildingContext";

import { calculatePolygonArea, resizePolygon } from "@/helpers/PolygonHelpers";

export default function useGeojson() {
  const {
    setBuildingPolygon,
    setLandingPolygon,
  } = useContext(BuildingContext);

  const processGeoJsonData = (data: any) => {
    setLandingPolygon(data);

    if (data.coordinates) {
      calculatePolygonArea(data.coordinates);
    }

    resizePolygon(data, 0.5, setBuildingPolygon);
  };

  const loadPredefinedFile = async (filename: string) => {
    try {
      const response = await fetch(`/geojsonExamples/${filename}.geojson`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      processGeoJsonData(data);
    } catch (error) {
      console.error('Error loading predefined file:', error);
    }
  };

  return { loadPredefinedFile };
}
