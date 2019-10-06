Vue.component("admin-page", {
  template: `
    <div class="row" id='ap'>
        <div class="col-1"></div>
        <div class="col-10">
            <div class="row">
                <div class='row border-bottom adminmenugroup'>
                    <div class="col-12 mb-4">
                        <h4>Rules for Admins:</h4>
                        <ul>
                            <li>You may not add categories and/or products with the same name</li>
                        </ul>
                        <p class="mt-4">Thanks, please note that these rules may change without any initial notice.</p>
                    </div>
                </div>
                <div class="row border-bottom adminmenugroup">
                    <div class="col-sm-6 col-md-4 text-center adminmenu" @click='addProModal'>
                        <div>
                            <i class="fas fa-plus"></i>
                            <h4>Add New Product</h4>
                        </div>
                    </div>
                    <div class="col-sm-6 col-md-4 text-center adminmenu" @click='editProModal'>
                        <div>
                            <i class="fas fa-edit"></i>
                            <h4>Edit A Product</h4>
                        </div>
                    </div>
                    <div class="col-sm-6 col-md-4 text-center adminmenu" @click='deleteProModal'>
                        <div>
                            <i class="fas fa-trash"></i>
                            <h4>Delete A Product</h4>
                        </div>
                    </div>
                </div>
                <div class="row border-bottom adminmenugroup">
                    <div class="col-sm-6 col-md-4 text-center adminmenu" @click='addCatModal'>
                        <div>
                            <i class="fas fa-plus"></i>
                            <h4>Add New Category</h4>
                        </div>
                    </div>
                    <div class="col-sm-6 col-md-4 text-center adminmenu" @click='editCatModal'>
                        <div>
                            <i class="fas fa-edit"></i>
                            <h4>Edit A Category</h4>
                        </div>
                    </div>
                    <div class="col-sm-6 col-md-4 text-center adminmenu" @click='deleteCatModal'>
                        <div>
                            <i class="fas fa-trash"></i>
                            <h4>Delete A Category</h4>
                        </div>
                    </div>
                </div>
                <!-- <div class="row border-bottom adminmenugroup">
                    <div class="col-sm-6 col-md-4 text-center adminmenu">
                        <div>
                            <i class="fas fa-plus"></i>
                            <h4>Add New User</h4>
                        </div>
                    </div>
                    <div class="col-sm-6 col-md-4 text-center adminmenu">
                        <div>
                            <i class="fas fa-edit"></i>
                            <h4>Edit A User</h4>
                        </div>
                    </div>
                    <div class="col-sm-6 col-md-4 text-center adminmenu">
                        <div>
                            <i class="fas fa-trash"></i>
                            <h4>Delete A User</h4>
                        </div>
                    </div>
                </div> -->
            </div>
            <div class="row mb-4 adminpromote text-center border-top">
                <div>
                    <h2 class="my-4">Promote A User Into Admin</h2>
                    <h6 v-if='promoteNotice.length > 0' style='color: #de4d2f'>{{ promoteNotice }}</h6>
                    <h6 v-else style='color: transparent'>placeholder</h6>
                    <input class='mt-2' type="text" placeholder="The user's registered email" style='text-align: center' v-model='promoteEmail' @keyup.enter='promote'><br><br>
                    <button class='btn' id='promoteBtn' @click='promote'>Promote</button>
                </div>
            </div>
        </div>
        <div class="col-1"></div>
        <div id='categorymodals'>
            <div class='categorymodal' id='addcategorymodal' v-if='addCategoryModal'>
                <div id='addCForm'>
                    <input class="mt-3" type="text" placeholder="Name" v-model='newCatName'><br>
                    <input type="text" placeholder="Icon class *" v-model='newCatIcon'><br>
                    <h6><i>* please refer to <a target='_blank' href='https://fontawesome.com'>FontAwesome</a> or <a target="_blank" href="https://gotdibbs.github.io/Font-Awesome-Extended/">FontAwesomeExtended</a></a></i></h6><br>
                    <div class="row">
                        <div class="col-12 col-md-1"></div>
                        <button class="btn adminModalBtn col-12 col-md-4 mb-3" @click='addCategory'>Add Category</button>
                        <div class="col-12 col-md-2"></div>
                        <button class="btn adminModalBtn col-12 col-md-4 mb-3" @click='addCatModal'><i class="far fa-times-circle"></i></button>
                        <div class="col-12 col-md-1"></div>
                    </div>
                </div>
            </div>
            <div class='categorymodal' id='editcategorymodal' v-if='editCategoryModal'>
                <div id='editCForm'>
                    <select class="mt-3" v-model="selectedCat" @change='selectedC'>
                        <option disabled value="">Please choose a category to be edited</option>
                        <option v-for='(category, index) in categories'>{{ category.name }}</option>
                    </select><br><br>
                    <input type="text" placeholder="Name" v-model='newCatName'><br>
                    <input type="text" placeholder="Icon class *" v-model='newCatIcon'><br>
                    <h6><i>* please refer to <a target='_blank' href='https://fontawesome.com'>FontAwesome</a> or <a target="_blank" href="https://gotdibbs.github.io/Font-Awesome-Extended/">FontAwesomeExtended</a></a></i></h6><br>
                    <div class="row">
                        <div class="col-12 col-md-1"></div>
                        <button class="btn adminModalBtn col-12 col-md-4 mb-3" @click='editCategory'>Edit Category</button>
                        <div class="col-12 col-md-2"></div>
                        <button class="btn adminModalBtn col-12 col-md-4 mb-3" @click='editCatModal'><i class="far fa-times-circle"></i></button>
                        <div class="col-12 col-md-1"></div>
                    </div>
                </div>
            </div>
            <div class='categorymodal' id='deletecategorymodal' v-if='deleteCategoryModal'>
                <div id='deleteCForm'>
                    <select class="mt-3" v-model="selectedCat">
                        <option disabled value="">Please choose a category to be deleted</option>
                        <option v-for='(category, index) in categories'>{{ category.name }}</option>
                    </select><br><br>
                    <div class="row">
                        <div class="col-12 col-md-1"></div>
                        <button class="btn adminModalBtn col-12 col-md-4 mb-3" @click='deleteCategory'>Delete Category</button>
                        <div class="col-12 col-md-2"></div>
                        <button class="btn adminModalBtn col-12 col-md-4 mb-3" @click='deleteCatModal'><i class="far fa-times-circle"></i></button>
                        <div class="col-12 col-md-1"></div>
                    </div>
                </div>
            </div>
            <div class='categorymodal' id='deletecategoryconfirm' v-if='deleteCategoryConfirm'>
                <div id='deleteCForm'>
                    <h3 class="text-center mt-3">Are you sure?</h3><br>
                    <h6 class="text-center">Deleting a category will permanently delete every item inside the category</h6><br>
                    <div class="row">
                        <div class="col-12 col-md-1"></div>
                        <button class="btn adminModalBtn col-12 col-md-4 mb-3" @click='deleteCategory'>Delete Category</button>
                        <div class="col-12 col-md-2"></div>
                        <button class="btn adminModalBtn col-12 col-md-4 mb-3" @click='deleteCatModal'><i class="far fa-times-circle"></i></button>
                        <div class="col-12 col-md-1"></div>
                    </div>
                </div>
            </div>
        </div>
        <div id='productmodals'>
            <div class='productmodal' id='addproductmodal' v-if='addProductModal'>
                <div id='addPForm'>
                    <div class="text-center mt-3">
                        Product image (<b>max. 1MB</b>):<br>
                        <input type="file" id="proImg" accept="image/*" @change='proImgChange'><br><br>
                    </div>
                    <input type="text" placeholder="Name (max. 13 characters)" v-model='newProName' @keyup='valProName'><br>
                    <input type="text" placeholder="Description (max. 72 characters)" v-model='newProDesc' @keyup='valProDesc'><br>
                    <input type="text" placeholder="Backtext (max. 4 characters)" v-model='newProBT' @keyup='valProBT'><br>
                    <input type="text" placeholder="Price (has to be number, max. 10 characters)" v-model='newProPrice' @keyup='valProPrice'><br>
                    <select v-model="newProCat">
                        <option disabled value="">Please choose a category</option>
                        <option v-for='(category, index) in categories'>{{ category.name }}</option>
                    </select><br><br>
                    <div class="row">
                        <div class="col-12 col-md-1"></div>
                        <button class="btn adminModalBtn col-12 col-md-4 mb-3" @click='addProduct'>Add Product</button>
                        <div class="col-12 col-md-2"></div>
                        <button class="btn adminModalBtn col-12 col-md-4 mb-3" @click='addProModal'><i class="far fa-times-circle"></i></button>
                        <div class="col-12 col-md-1"></div>
                    </div>
                </div>
            </div>
            <div class='productmodal' id='editproductmodal' v-if='editProductModal'>
                <div id='editPForm'>
                    <select class="mt-3" v-model="selectedPro" @change='selectedP'>
                        <option disabled value="">Please choose a product to be edited</option>
                        <option v-for='product in products'>{{ product.name }}</option>
                    </select><br><br>
                    <input type="text" placeholder="Name (max. 13 characters)" v-model='newProName' @keyup='valProName'><br>
                    <input type="text" placeholder="Description (max. 72 characters)" v-model='newProDesc' @keyup='valProDesc'><br>
                    <input type="text" placeholder="Backtext (max. 4 characters)" v-model='newProBT' @keyup='valProBT'><br>
                    <input type="text" placeholder="Price (has to be number, max. 10 characters)" v-model='newProPrice' @keyup='valProPrice'><br>
                    <select v-model="newProCat">
                        <option disabled value="">Please choose a category</option>
                        <option v-for='(category, index) in categories'>{{ category.name }}</option>
                    </select><br><br>
                    <div class="row">
                        <div class="col-12 col-md-1"></div>
                        <button class="btn adminModalBtn col-12 col-md-4 mb-3" @click='editProduct'>Edit Product</button>
                        <div class="col-12 col-md-2"></div>
                        <button class="btn adminModalBtn col-12 col-md-4 mb-3" @click='editProModal'><i class="far fa-times-circle"></i></button>
                        <div class="col-12 col-md-1"></div>
                    </div>
                </div>
            </div>
            <div class='productmodal' id='deleteproductmodal' v-if='deleteProductModal'>
                <div id='deletePForm'>
                    <select class="mt-3" v-model="selectedPro">
                        <option disabled value="">Please choose a product to be deleted</option>
                        <option v-for='product in products'>{{ product.name }}</option>
                    </select><br><br>
                    <div class="row">
                        <div class="col-12 col-md-1"></div>
                        <button class="btn adminModalBtn col-12 col-md-4 mb-3" @click='deleteProduct'>Delete Product</button>
                        <div class="col-12 col-md-2"></div>
                        <button class="btn adminModalBtn col-12 col-md-4 mb-3" @click='deleteProModal'><i class="far fa-times-circle"></i></button>
                        <div class="col-12 col-md-1"></div>
                    </div>
                </div>
            </div>
            <div class='productmodal' id='deleteproductconfirm' v-if='deleteProductConfirm'>
                <div id='deleteCForm'>
                    <h3 class="text-center">Are you sure?</h3><br>
                    <div class="row">
                        <div class="col-12 col-md-1"></div>
                        <button class="btn adminModalBtn col-12 col-md-4 mb-3" @click='deleteProduct'>Delete Product</button>
                        <div class="col-12 col-md-2"></div>
                        <button class="btn adminModalBtn col-12 col-md-4 mb-3" @click='deleteProModal'><i class="far fa-times-circle"></i></button>
                        <div class="col-12 col-md-1"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
  props: ["categories", "products", "baseurl"],
  data() {
    return {
      addCategoryModal: false,
      editCategoryModal: false,
      deleteCategoryModal: false,
      deleteCategoryConfirm: false,
      addProductModal: false,
      editProductModal: false,
      deleteProductModal: false,
      deleteProductConfirm: false,
      newCatName: "",
      newCatIcon: "",
      newProName: "",
      newProDesc: "",
      newProBT: "",
      newProPrice: "",
      newProCat: "",
      newProImg: "",
      selectedCat: "",
      selectedPro: "",
      promoteEmail: "",
      promoteNotice: ""
    };
  },
  methods: {
    getProducts(openTab) {
      this.$emit("getproducts", openTab);
    },
    getCategories() {
      this.$emit("getcategories");
    },
    addCatModal() {
      this.addCategoryModal = !this.addCategoryModal;
      this.$emit("togglebackdrop");
      this.newCatName = "";
      this.newCatIcon = "";
    },
    editCatModal() {
      this.editCategoryModal = !this.editCategoryModal;
      this.$emit("togglebackdrop");
      this.selectedCat = "";
      this.newCatName = "";
      this.newCatIcon = "";
    },
    deleteCatModal() {
      if (this.deleteCategoryConfirm) {
        this.deleteCategoryConfirm = false;
        this.deleteCategoryModal = true;
      } else {
        this.deleteCategoryModal = !this.deleteCategoryModal;
        this.$emit("togglebackdrop");
        this.selectedCat = "";
        this.newCatName = "";
        this.newCatIcon = "";
      }
    },
    addProModal() {
      this.addProductModal = !this.addProductModal;
      this.$emit("togglebackdrop");
      this.newProName = "";
      this.newProDesc = "";
      this.newProBT = "";
      this.newProPrice = "";
      this.newProCat = "";
    },
    editProModal() {
      this.editProductModal = !this.editProductModal;
      this.$emit("togglebackdrop");
      this.selectedPro = "";
      this.newProName = "";
      this.newProDesc = "";
      this.newProBT = "";
      this.newProPrice = "";
      this.newProCat = "";
    },
    deleteProModal() {
      if (this.deleteProductConfirm) {
        this.deleteProductConfirm = false;
        this.deleteProductModal = true;
      } else {
        this.deleteProductModal = !this.deleteProductModal;
        this.$emit("togglebackdrop");
        this.selectedPro = "";
        this.newProName = "";
      }
    },
    addCategory() {
      if (this.newCatName.length > 0 && this.newCatIcon.length > 0) {
        axios({
          url: `${this.baseurl}/categories`,
          method: "post",
          headers: {
            token: localStorage.getItem("token")
          },
          data: {
            name: this.newCatName,
            icon: this.newCatIcon
          }
        })
          .then(data => {
            this.getCategories();
            this.addCatModal();
          })
          .catch(err => {
            alert(err.response.data.message);
          });
      }
    },
    addProduct() {
      if (
        this.newProName.length > 0 &&
        this.newProDesc.length > 0 &&
        this.newProBT.length > 0 &&
        this.newProPrice.length > 0 &&
        this.newProCat.length > 0 &&
        this.newProImg.length !== ""
      ) {
        let formData = new FormData();
        formData.append("image", this.newProImg);

        axios({
          url: `${this.baseurl}/upload`,
          method: "post",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token")
          }
        })
          .then(image => {
            axios({
              url: `${this.baseurl}/products`,
              method: "post",
              headers: {
                token: localStorage.getItem("token")
              },
              data: {
                name: this.newProName,
                description: this.newProDesc,
                backtext: this.newProBT,
                price: this.newProPrice,
                image: image.data.link,
                category: this.newProCat
              }
            })
              .then(data => {
                this.getProducts("ap");
                this.addProModal();
              })
              .catch(err => {
                alert(err.response.data.message);
              });
          })
          .catch(err => {
            console.log(JSON.stringify(err));
          });
      }
    },
    selectedC() {
      for (let i = 0; i < this.categories.length; i++) {
        if (this.categories[i].name === this.selectedCat) {
          this.newCatName = this.categories[i].name;
          this.newCatIcon = this.categories[i].icon;
        }
      }
    },
    selectedP() {
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].name === this.selectedPro) {
          this.newProName = this.products[i].name;
          this.newProDesc = this.products[i].description;
          this.newProBT = this.products[i].backtext;
          this.newProPrice = String(this.products[i].price);
          this.newProCat = this.products[i].category.name;
        }
      }
    },
    editCategory() {
      if (
        this.newCatName.length > 0 &&
        this.newCatIcon.length > 0 &&
        this.selectedCat.length > 0
      ) {
        let id = "";
        for (let i = 0; i < this.categories.length; i++) {
          if (this.categories[i].name === this.selectedCat) {
            id = this.categories[i]._id;
          }
        }
        axios({
          url: `${this.baseurl}/categories/${id}`,
          method: "put",
          headers: {
            token: localStorage.getItem("token")
          },
          data: {
            name: this.newCatName,
            icon: this.newCatIcon
          }
        })
          .then(data => {
            this.getCategories();
            this.editCatModal();
          })
          .catch(err => {
            alert(err.response.data.message);
          });
      }
    },
    editProduct() {
      if (
        this.newProName.length > 0 &&
        this.newProDesc.length > 0 &&
        this.newProBT.length > 0 &&
        this.newProPrice.length > 0 &&
        this.newProCat.length > 0
      ) {
        let id = "";
        for (let i = 0; i < this.products.length; i++) {
          if (this.products[i].name === this.selectedPro) {
            id = this.products[i]._id;
          }
        }
        axios({
          url: `${this.baseurl}/products/${id}`,
          method: "put",
          headers: {
            token: localStorage.getItem("token")
          },
          data: {
            name: this.newProName,
            description: this.newProDesc,
            backtext: this.newProBT,
            price: this.newProPrice,
            category: this.newProCat
          }
        })
          .then(data => {
            this.getProducts("ap");
            this.editProModal();
          })
          .catch(err => {
            alert(err.response.data.message);
          });
      }
    },
    deleteCategory() {
      if (this.deleteCategoryConfirm) {
        let id = "";
        for (let i = 0; i < this.categories.length; i++) {
          if (this.categories[i].name === this.selectedCat) {
            id = this.categories[i]._id;
          }
        }
        axios({
          url: `${this.baseurl}/categories/${id}`,
          method: "delete",
          headers: {
            token: localStorage.getItem("token")
          }
        })
          .then(data => {
            this.getCategories();
            this.deleteCategoryConfirm = false;
            this.$emit("closebackdrop");
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.deleteCategoryConfirm = true;
        this.deleteCategoryModal = false;
      }
    },
    deleteProduct() {
      if (this.deleteProductConfirm) {
        let id = "";
        for (let i = 0; i < this.products.length; i++) {
          if (this.products[i].name === this.selectedPro) {
            id = this.products[i]._id;
          }
        }
        axios({
          url: `${this.baseurl}/products/${id}`,
          method: "delete",
          headers: {
            token: localStorage.getItem("token")
          }
        })
          .then(data => {
            this.getProducts("ap");
            this.deleteProductConfirm = false;
            this.$emit("closebackdrop");
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.deleteProductConfirm = true;
        this.deleteProductModal = false;
      }
    },
    proImgChange(event) {
      this.newProImg = event.target.files[0];
    },
    valProName() {
      this.newProName = this.newProName.slice(0, 13);
    },
    valProDesc() {
      this.newProDesc = this.newProDesc.slice(0, 72);
    },
    valProBT() {
      this.newProBT = this.newProBT.slice(0, 4);
    },
    valProPrice() {
      if (Number(this.newProPrice) != this.newProPrice) {
        this.newProPrice = "";
      }
      this.newProPrice = this.newProPrice.slice(0, 10);
    },
    promote() {
      axios({
        url: `${this.baseurl}/users/promote`,
        method: "patch",
        headers: {
          token: localStorage.getItem("token")
        },
        data: {
          email: this.promoteEmail
        }
      })
        .then(data => {
          this.promoteNotice = data.data.message;
        })
        .catch(err => {
          this.promoteNotice = err.response.data.message;
        });
    }
  }
});
