import express, { Response, Request, Application } from 'express'
import fs from 'fs'
import cors from 'cors'
import Papa from 'papaparse'
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import { type PointData, mapPointDataToFields, getGCPCredentials } from './utils';

export const app: Application = express()
dotenv.config({ path: './.env' });
const port = 3000
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://hooked-on-the-kootenays-backend.vercel.app',
      'https://hooked-on-the-kootenays-q9quucwhy-byoung006s-projects.vercel.app'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json())

const isTestEnv = process.env.NODE_ENV === 'test';

try {
  //const storage = isTestEnv ? undefined : new Storage({
  //  keyFilename: credentialsString,
  //});
  const storage = new Storage(getGCPCredentials());
  const bucketName = 'hooked-on-the-koots';
  const csvFilePath = isTestEnv ? './FishingSpotsKootenays.csv' : 'data/FishingSpotsKootenays.csv'

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
    res.send('Healthy');
  });
  app.post('/api/update-csv', async (req: Request, res: Response) => {
    try {
      const csvData = isTestEnv
        ? fs.readFileSync(csvFilePath, 'utf8')
        : (await storage!.bucket(bucketName).file(csvFilePath).download())[0].toString();


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

          if (isTestEnv) {
            fs.writeFileSync(csvFilePath, updatedCsv);
          } else {
            await storage!.bucket(bucketName).file(csvFilePath).save(updatedCsv);
          }
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
      const csvData = isTestEnv
        ? fs.readFileSync(csvFilePath, 'utf8')
        : (await storage!.bucket(bucketName).file(csvFilePath).download())[0].toString();

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
