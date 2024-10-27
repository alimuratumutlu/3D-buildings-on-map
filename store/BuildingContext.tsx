import { createContext } from "react";
import { BuildingContextType } from "./BuildingTypes";

const BuildingContext = createContext<BuildingContextType>({
  state: {
    floorArea: 0,
    landingPolygon: { type: "", coordinates: [] },
    buildingPolygon: { type: "", coordinates: [] },
    floorHeight: 0,
    numberOfFloors: 0,
    scaleRate: 1,
  },
  setFloorArea: () => {},
  setLandingPolygon: () => {},
  setBuildingPolygon: () => {},
  setFloorHeight: () => {},
  setNumberOfFloors: () => {},
  setScaleRate: () => {},
});

export default BuildingContext;
