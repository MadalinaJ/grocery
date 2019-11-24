const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";
const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const User = require("../../src/db/models").User;
const Item = require("../../src/db/models").Item;

describe("routes : lists", () => {

    beforeEach((done) => {
     this.list;
     this.item;
     this.user;

     sequelize.sync({force: true}).then((res) => {

       User.create({
         email: "starman@tesla.com",
         password: "Trekkie4lyfe"
       })
       .then((user) => {
         this.user = user; //store the user

         List.create({
           title: "Expeditions to Alpha Centauri",
           description: "A compilation of reports from recent visits to the star system.",

           items: [{
             title: "My first visit to Proxima Centauri b",
             description: "I saw some rocks.",
             userId: this.user.id
           }]
         }, {

           include: {
             model: Item,
             as: "items"
           }
         })
         .then((list) => {
           this.list = list; //store the list
           this.item = list.items[0]; //store the item
           done();
         })
       })
     });
   });

  describe("GET /lists/new", () => {

    it("should render a new item form and contain 'New List'", (done) => {
      request.get(`${base}lists/new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New List");
        done();
      });
    });
    });


  describe("POST /lists/create", () => {
    const options = {
      url: `${base}/lists/create`,
      form: {
        title: "blink-182 songs",
        description: "What's your favorite blink-182 song?"
      }
    };
    it("should create a new item and redirect", (done) => {
      
        request.post(options,
          (err, res, body) => {
            List.findOne({
              where: {
                title: "blink-182 songs"}
              })
            .then((list) => {
              expect(list.title).toBe("blink-182 songs");
              expect(list.description).toBe("What's your favorite blink-182 song?");
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          }
        );
      });
    });

    describe("GET /lists/:id", () => {

     it("should render a view with the selected list", (done) => {
       request.get(`${base}lists/${this.list.id}`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).toContain("Expeditions to Alpha Centauri");
         done();
       });
     });

   });

   describe("POST /lists/:id/destroy", () => {

     it("should delete the list with the associated ID", (done) => {

       List.findAll()
       .then((lists) => {

         const listCountBeforeDelete = lists.length;
         expect(listCountBeforeDelete).toBe(1);

         request.post(`${base}lists/${this.list.id}/destroy`, (err, res, body) => {
           List.findAll()
           .then((lists) => {
             expect(err).toBeNull();
             expect(lists.length).toBe(listCountBeforeDelete - 1);
             done();
           })

         });
       });

     });

   });

   describe("GET /lists/:id/edit", () => {

     it("should render a view with an edit item form", (done) => {
       request.get(`${base}lists/${this.list.id}/edit`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).toContain("Edit List");
         expect(body).toContain("Expeditions to Alpha Centauri");
         done();
       });
     });

   });

   describe("POST /lists/:id/update", () => {

     it("should update the item with the given values", (done) => {
        const options = {
           url: `${base}${List.id}/update`,
           form: {
             title: "JavaScript Frameworks",
             description: "There are a lot of them"
           }
         };
         request.post(options,
           (err, res, body) => {

           expect(err).toBeNull();
           List.findOne({
             where: { id: this.list.id }
           })
           .then((list) => {
             expect(list.title).toBe("Expeditions to Alpha Centauri");
             done();
           });
         });
     });

   });


});
