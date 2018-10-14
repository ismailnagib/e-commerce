Vue.component('purchase-history', {
    template:
    `
    <div class="row mt-4">
        <div class="row col-12 mb-4" v-for='(transaction, index) in transactions.slice().reverse()'>
            <div class="col-1"></div>
            <div class="card col-10 px-0">
                <div class="card-header row mx-0">
                    <h5 class="m-0 p-0 col-6 text-left"><b>Transaction {{ transaction._id }}</b></h5>
                    <h5 class="m-0 p-0 col-6 text-right">{{ transaction.date.slice(0, 10) }}</h5>
                </div>
                <div class="card-body pb-0">
                    <div>
                        <h6 class="card-title mb-4 row" v-for='(item, index2) in transaction.cart.items'>
                            <span class="col-4 text-left">{{ item.name }}</span>
                            <span class="col-1 text-right">x</span>
                            <span class="col-1 text-left">{{ transaction.cart.counts[index2] }}</span>
                            <span class="col-3 text-right">Rp{{ transaction.cart.total[index2] | currencySlice }}</span>
                            <span class="col-3 text-center" v-if='item.ratedBy.indexOf(authuserid) !== -1'>
                                You rated this
                                <i class="fa fa-star gold" v-for='i in item.ratings[item.ratedBy.indexOf(authuserid)]'></i>
                                <i class="fa fa-star" v-for='i in (5 - item.ratings[item.ratedBy.indexOf(authuserid)])'></i>
                            </span>
                            <span class="col-3 text-center" v-else>
                                <i class="fa fa-star gold" v-for='i in starColors[transactions.length - index - 1][index2]'  @click='starClick(transactions.length - index - 1, index2, i)'></i>
                                <i class="fa fa-star" v-for='i in (5 - starColors[transactions.length - index - 1][index2])' @click='starClick(transactions.length - index - 1, index2, i + starColors[transactions.length - index - 1][index2])'></i>
                                <button class="btn ml-2 rateBtn px-2 py-1" @click='rate(transactions.length - index - 1, index2, item._id)'>Rate</button>
                            </span>
                        </h6>
                        <hr>
                        <h6 class="card-title row">
                            <span class="col-4 text-left"><b>Total</b></span>
                            <span class="col-4 text-center discount" v-if='transaction.cart.discount > 0'><b>Discount: Rp{{ transaction.cart.discount | currencySlice }}</b></span>
                            <span class="col-4" v-else></span>
                            <span class="col-4 text-right phTotalSum"><b>Rp{{ transaction.cart.totalsum | currencySlice }}</b></span>
                        </h6>
                    </div>
                </div>
            </div>
            <div class="col-1"></div>
        </div>
    </div>
    `,
    props: ['authuserid'],
    data() {
        return {
            transactions: [],
            starColors: []
        }
    },
    methods: {
        getTransactions() {
            axios({
                url: 'http://localhost:3000/users/ph',
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .then(data => {
                this.transactions = data.data
                let starColors = []
                for (let i = 0; i < data.data.length; i++) {
                    starColors.push([])
                    for (let j = 0; j < data.data[i].cart.items.length; j++) {
                        starColors[i].push(0)
                    }
                }
                this.starColors = starColors
            })
            .catch(err => {
                console.log(err)
            })
        },
        starClick(index, index2, clickedStar) {
            this.starColors[index].splice(index2, 1, clickedStar)
        },
        rate(index, index2, id) {
            let rate = this.starColors[index][index2]
            axios({
                url: `http://localhost:3000/products/rate/${id}`,
                method: 'patch',
                headers: {
                    token: localStorage.getItem('token')
                },
                data: {
                    rate: rate
                }
            })
            .then(() => {
                this.getTransactions()
            })
            .catch(err => {
                console.log(err)
            })
        }
    },
    created() {
        this.getTransactions()
    },
    filters: {
        currencySlice(value) {
            let str = String(value)
            let reversed = str.split('').reverse()
            let counter = 0
            for (let i = 1; i < reversed.length; i++) {
                if (i % 3 === 0 && i + counter < reversed.length) {
                    reversed.splice(i + counter, 0, '.')
                    counter ++
                }
            }
            if (reversed.length > 10) {
                if (reversed[reversed.length-5] !== '0') {
                    return reversed.reverse().join('').slice(0, reversed.length-6) + 'M'
                } else {
                    return reversed.reverse().join('').slice(0, reversed.length-8) + 'M'
                }
            } else {
                return reversed.reverse().join('')
            }
        }
    }
})