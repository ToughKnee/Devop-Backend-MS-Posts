import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.test' });


// Global test setup
beforeAll(async () => {
  // Clear all mocks before each test suite
  jest.clearAllMocks();
});

afterAll(async () => {
  // Clean up any resources if needed
});

// Add global mocks that might be needed across tests
global.console.error = jest.fn();