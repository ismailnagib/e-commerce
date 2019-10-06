Vue.component("product-list", {
  template: `
    <div>
        <div class="row" id='products' v-if='products.length > 0'>
            <div class="containerku col-sm-6 col-md-5 col-lg-3" v-for='product in products'>
                <div class="cardku">
                    <div
                      class="card-head"
                      :style="{ background: 'url('+product.image+') no-repeat center center' }"
                    >
                        <span class="back-text">
                            {{ product.backtext }}
                        </span>
                    </div>
                    <div class="card-bodyku">
                        <div class="product-desc">
                            <span class="product-title">
                                <b>{{ product.name }}</b>
                            </span>
                            <span class="product-desc">
                              {{ product.description }}
                            </span>
                            <span class="product-caption">
                                {{ product.category.name }}
                            </span>
                            <span class="product-rating">
                                <i class="fa fa-star" :style="{ color: i <= Math.round(product.rating) ? 'gold' : 'black' }" v-for='i in 5'></i>
                            </span>
                        </div>
                        <div class="product-properties">
                            <span class="product-price">
                                IDR<b>{{ product.price | priceSlice }}</b>
                            </span>
                            <span class='atclogo' title="Add to Cart">
                                <i class="fas fa-cart-plus" v-on:click='addToCart(product)'></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="row mt-4">
            <div class="col text-center" style="margin-top: 10vh">
                <h2 id="not-found-title">Oops!</h2>
                <h3 id="not-found-subtitle">Sorry, but we couldn't find anything.</h3>
            </div>
        </div>
    </div>
    `,
  props: ["products"],
  methods: {
    getProducts() {
      this.$emit("getproducts", "");
    },
    addToCart(product) {
      app.itemcount++;
      let i = app.items.indexOf(product.name);
      if (i === -1) {
        app.items.push(product.name);
        app.cart.push({
          name: product.name,
          price: product.price,
          count: 1,
          total: product.price
        });
        app.totalsum += product.price;

        app.itemsReal.push(product._id);
        app.counts.push(1);
      } else {
        app.cart[i].count++;
        app.cart[i].total += product.price;
        app.totalsum += product.price;
        app.counts[i]++;
      }

      localStorage.setItem("items", JSON.stringify(app.items));
      localStorage.setItem("itemsID", JSON.stringify(app.itemsReal));
      localStorage.setItem("cart", JSON.stringify(app.cart));
      localStorage.setItem("totalsum", app.totalsum);

      this.$emit("updatecart");
    }
  },
  filters: {
    priceSlice(value) {
      let str = String(value);
      if (str.length > 7) {
        return str.slice(0, str.length - 6) + "M";
      } else if (str.length > 3) {
        return str.slice(0, str.length - 3) + "K";
      } else {
        return str;
      }
    }
  }
});
