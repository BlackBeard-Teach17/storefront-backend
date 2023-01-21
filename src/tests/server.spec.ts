import supertest from "supertest";
import app from "../server";

describe('Server', () => {
    it('should return 200', async () => {
        supertest(app).get('/').expect(200);
    });
});