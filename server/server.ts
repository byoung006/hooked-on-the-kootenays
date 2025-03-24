import express, { Response, Request, Application } from 'express'
import fs from 'fs'
import cors from 'cors'
import Papa from 'papaparse'
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import { type PointData, fieldMappings, mapPointDataToFields, mapFieldsToPointData } from './utils';
dotenv.config({ path: './.env' });
const app: Application = express()
const port = 3000
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

function isString(value: any): value is string {
  return typeof value === 'string';
}

const credentialsString = process.env.GOOGLE_APPLICATION_CREDENTIALS;
console.log(credentialsString, 'this thing')
if (!isString(credentialsString)) {
  throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not a valid string.');
}

try {

  const storage = new Storage({
    keyFilename: credentialsString,
  });
  const bucketName = 'hooked-on-the-koots';
  const csvFilePath = 'data/FishingSpotsKootenays.csv'

  function validatePointData(data: any): data is PointData {
    const requiredFields: (keyof PointData)[] = [
      'name',
      'latitude',
      'longitude',
      'camping',
      'trailLength',
      'dogFriendly',
      'hikeDifficultyLevel',
      'hikeIn',
    ];

    for (const field of requiredFields) {
      if (data[field] === undefined) {
        return false;
      }
    }

    if (typeof data.name !== 'string' ||
      typeof data.latitude !== 'number' ||
      typeof data.longitude !== 'number') {
      return false;
    }

    return true;
  }

  app.get('/api/healthz', async (req: Request, res: Response): Promise<any> => {
    try {
      const file = storage.bucket(bucketName).file(csvFilePath);
      console.log(file, 'the file data')
      const [fileData] = await file.download();
      const csvData = fileData.toString();

      Papa.parse(csvData, {
        header: true,
        complete: (results) => {
          res.json(results);
        },
      });
    } catch (error) {
      console.error('Error reading CSV from GCS:', error);
      res.status(500).send('Error reading CSV from GCS.');
    }
  });
  app.post('/api/update-csv', async (req: Request, res: Response) => {
    try {
      const file = storage.bucket(bucketName).file(csvFilePath);
      const [fileData] = await file.download();
      const csvData = fileData.toString();

      Papa.parse(csvData, {
        header: true,
        complete: async (results) => {
          let existingData = results.data;

          // Validate and map the new data
          if (!validatePointData(req.body)) {
            return res.status(400).send('Invalid Field Data');
          }
          const newData = mapPointDataToFields(req.body);

          // Add the new data
          existingData.push(newData);

          // Unparse the combined data
          const updatedCsv = Papa.unparse(existingData);

          // Save the updated CSV
          await file.save(updatedCsv);
          res.send('CSV file updated successfully.');
        },
        error: (error: Error) => {
          console.error('PapaParse Error:', error);
          return res.status(500).send('Error parsing CSV data.');
        }
      });
    } catch (error) {
      console.error('Error updating CSV:', error);
      res.status(500).send('Error updating CSV file.');
    }
  });


  app.get('/api/fishing-spots', async (req: Request, res: Response): Promise<any> => {
    try {
      const file = storage.bucket(bucketName).file(csvFilePath)
      const [fileData] = await file.download();
      const csvData = fileData.toString();

      Papa.parse(csvData, {
        header: true,
        complete: (results) => {
          res.json(results);
        },
      });
    } catch (error) {
      console.error('Error reading CSV:', error);
      res.status(500).send('Error reading CSV file.');
    }
  });

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
  })
} catch (error) {
  console.error('Error parsing env vars', error)
  throw error
}
