import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

export interface PointData {
  name: string;
  latitude: number;
  longitude: number;
  camping: string;
  trailLength: number;
  dogFriendly: string;
  hikeDifficultyLevel: number;
  hikeIn: string;
  linkToWebsite?: string;
  //[key: string]: string | number | undefined;
}

export const fieldMappings: { [key in keyof PointData]: string } = {
  name: 'name',
  latitude: 'latitude',
  longitude: 'longitude',
  camping: 'camping',
  trailLength: 'trail length',
  dogFriendly: 'dog friendly',
  hikeDifficultyLevel: 'hike difficulty level',
  hikeIn: 'hike in',
  linkToWebsite: 'Link to Website',
};

export const csvHeaderMappings: { [key in keyof PointData]: string } = {
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
  const mappedData: { [fieldName: string]: string | number | undefined } = {};

  for (const [key, index] of Object.entries(pointData)) {
    if (pointData.hasOwnProperty(key) && fieldMappings.hasOwnProperty(key)) {
      const fieldName = csvHeaderMappings[key as keyof PointData];
      console.log(key, index, fieldName);
      if (fieldName && key) {
        mappedData[fieldName] = pointData[key as keyof PointData];
      }
    }
  }

  return mappedData;
}
export const getGCPCredentials = () => {
  // for Vercel, use environment variables
  return process.env.GCP_PRIVATE_KEY
    ? {
      credentials: {
        client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY,
      },
      projectId: process.env.GCP_PROJECT_ID,
    }
    // for local development, use gcloud CLI
    : {};
};
//export function mapFieldsToPointData(fields: { [fieldName: string]: string | number | undefined }): PointData {
//  const pointData: PointData = {
//    name: '',
//    longitude: 0,
//    latitude: 0,
//    camping: '',
//    trailLength: 0,
//    dogFriendly: '',
//    hikeDifficultyLevel: 0,
//    hikeIn: '',
//    linkToWebsite: '',
//  };
//
//  for (const fieldName in fields) {
//    if (fields.hasOwnProperty(fieldName)) {
//      const pointDataKey = (Object.keys(fieldMappings) as (keyof PointData)[]).find(key => fieldMappings[key] === fieldName);
//      if (pointDataKey) {
//        pointData[pointDataKey] = fields[fieldName];
//      }
//    }
//  }
//
//  return pointData;
//}
