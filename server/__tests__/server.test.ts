import request from 'supertest';
import { expect } from 'chai';

import * as sut from '../api/server.ts';
import { Application } from 'express';
import { fieldMappings, csvHeaderMappings, mapPointDataToFields } from '../api/utils.ts';

describe('Server Endpoints', () => {
  let server: Application;
  let app = sut.app;
  let csvFilePath: string;
  before(() => {
    process.env.NODE_ENV = 'test';
    server = app;
    csvFilePath = './FishingSpotsKootenays.csv';
  });

  it('should return health status', async () => {
    const response = await request(server).get('/api/healthz');
    expect(response.status).equal(200);
    expect(response.body).haveOwnProperty('data');
  });

  it('should return fishing spots', async () => {
    const response = await request(server).get('/api/fishing-spots');
    expect(response.status).equal(200);
  });

  it('should update CSV file', async () => {
    const newPointData = {
      name: 'Test Spot',
      latitude: 50.0,
      longitude: -116.0,
      camping: 'YES',
      trailLength: 1000,
      dogFriendly: 'Dogs on leash',
      hikeDifficultyLevel: 3,
      hikeIn: 'YES',
      linkToWebsite: 'http://example.com'
    };

    const response = await request(server)
      .post('/api/update-csv')
      .send(newPointData);

    expect(response.status).equal(200);
    expect(response.text).equal('CSV file updated successfully.');
  });
});
