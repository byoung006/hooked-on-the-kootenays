
export interface PointData {
  name: string;
  latitude: number;
  longitude: number;
  camping: string;
  trailLength?: string;
  dogFriendly?: string;
  hikeDifficultyLevel?: number;
  hikeIn?: string;
  linkToWebsite?: string | undefined;
  [key: string]: string | number | undefined;
}

export const fieldMappings: { [key in keyof PointData]: string } = {
  name: 'Name',
  latitude: 'Latitude',
  longitude: 'Longitude',
  camping: 'Camping',
  trailLength: 'Trail Length',
  dogFriendly: 'Dog Friendly',
  hikeDifficultyLevel: 'Hike Difficulty Level',
  hikeIn: 'Hike In',
  linkToWebsite: 'Link to Website',
};

export function mapPointDataToFields(pointData: PointData): { [fieldName: string]: string | number | undefined } {
  // ... (your mapPointDataToFields function)
  const mappedData: { [fieldName: string]: string | number | undefined } = {};

  for (const key in pointData) {
    if (pointData.hasOwnProperty(key) && fieldMappings.hasOwnProperty(key)) {
      const fieldName = fieldMappings[key as keyof PointData];
      mappedData[fieldName] = pointData[key];
    }
  }

  return mappedData;
}

export function mapFieldsToPointData(fields: { [fieldName: string]: string | number | undefined }): PointData {
  // ... (your mapFieldsToPointData function)
  const pointData: PointData = {
    name: '',
    latitude: 0,
    longitude: 0,
    camping: '',
  };

  for (const fieldName in fields) {
    if (fields.hasOwnProperty(fieldName)) {
      const pointDataKey = (Object.keys(fieldMappings) as (keyof PointData)[]).find(key => fieldMappings[key] === fieldName);
      if (pointDataKey) {
        pointData[pointDataKey] = fields[fieldName];
      }
    }
  }

  return pointData;
}
