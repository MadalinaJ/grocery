const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : static", () => {

  describe("GET /", () => {

    it("should return status code 200 and have 'Welcome' in the body of the response", (done) => {
      request.get(base, (err, res, body) => {
        expect(body).toContain("Welcome");
        done();
      });
    });

  });

});
