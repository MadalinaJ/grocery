const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/lists/";

const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const Item = require("../../src/db/models").Item;
const User = require("../../src/db/models").User;
const Purchase = require("../../src/db/models").Purchase;

describe("routes : purchases", () => {

 beforeEach((done) => {

   this.user;
   this.list;
   this.item;

   sequelize.sync({force: true}).then((res) => {
     User.create({
       email: "starman@tesla.com",
       password: "Trekkie4lyfe"
     })
     .then((res) => {
       this.user = res;

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
       .then((res) => {
         this.list = res;
         this.item = this.list.items[0];
         done();
       })
       .catch((err) => {
         console.log(err);
         done();
       });
     });
   });
 });

 describe("guest user mark purchase on an item", () => {

    beforeEach((done) => {    // before each suite in this context

      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          userId: 0
        }
      },
        (err, res, body) => {
          done();
        }
      );

      });
    });

    describe("POST /lists/:listId/items/:itemId/purchases/create", () => {

      it("should not create a new purchase", (done) => {
        const options = {
          url: `${base}lists/${this.list.id}/items/${this.item.id}/purchases/create`
        };

        let purchaseCountBeforeCreate;
        this.item.getPurchases()
        .then((purchases) => {
          purchaseCountBeforeCreate = purchases.length;
          request.post(options,
            (err, res, body) => {
              Purchase.findAll()
              .then((purchase) => {
                expect(purchaseCountBeforeCreate).toBe(purchase.length); // confirm no maked as purchased created
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
            });
          })
        });
      });
  
    });
    //       done();
    //     });
    //   });

    // });

    describe("signed in user favoriting a post", () => {

     beforeEach((done) => {  // before each suite in this context
       request.get({         // mock authentication
         url: "http://localhost:3000/auth/fake",
         form: {
           role: "member",     // mock authenticate as member user
           userId: this.user.id
         }
       },
         (err, res, body) => {
           done();
         }
       );
      });
     });

     describe("POST /lists/:listId/items/:itemId/purchases/create", () => {

       it("should create a purchase", (done) => {
         const options = {
           url: `${base}lists/${this.list.id}/items/${this.item.id}/purchases/create`
         };
         request.post(options,
           (err, res, body) => {
             Purchase.findOne({
               where: {
                 userId: this.user.id,
                 itemId: this.item.id
               }
             })
             .then((purchase) => {               // confirm that a favorite was created
               expect(purchase).toBeNull();
               expect(purchase.userId).toBe(this.user.id);
               expect(purchase.itemId).toBe(this.item.id);
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

    //  describe("POST /lists/:listId/items/:itemId/purchases/:id/destroy", () => {

    //    it("should destroy a purchase", (done) => {
    //      const options = {
    //        url: `${base}${this.list.id}/items/${this.item.id}/purchases/create`
    //      };

    //      let purCountBeforeDelete;

    //      request.post(options, (err, res, body) => {
    //        this.post.getPurchases()
    //        .then((purchases) => {
    //          const purchase = purchases[0];
    //          purCountBeforeDelete = purchases.length;

    //          request.post(`${base}${this.list.id}/items/${this.item.id}/purchases/${purchase.id}/destroy`,
    //            (err, res, body) => {
    //              this.item.getPurchases()
    //              .then((purchases) => {
    //                expect(purchases.length).toBe(purCountBeforeDelete - 1);
    //                done();
    //              });
    //            }
    //          );
    //        });
    //      });
    //    });
    //  });

