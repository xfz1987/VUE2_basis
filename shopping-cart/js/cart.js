var vm = new Vue({
	el: '#app',
	data: {
		totalMoney: 0,
		productList: [],
		checkAll: false,
		delFlag: false,
		curProduct: null
	},
	filters: {
		formatMoney(value, type){
			return '￥' + value.toFixed(2) + type;
		}
	},
	mounted: function(){
		this.$nextTick(function(){
			this.cartView();
			//vm.cartView();
		});
	},
	methods: {
		cartView(){
			// var _this = this;
			this.$http.get('data/cart.json',{'id':123}).then(response=>{
				//箭头函数会将this作用域指向外层(vm),就不需要定义外层this的缓存了
				var res = response.data;
				if(res && res.status == '1'){
					this.productList = res.result.list;
				}
				
			});
		},
		changeMoney(product,way){
			way > 0 ? product.productQuentity++ : (product.productQuentity > 1 && product.productQuentity--);
			this.calcTotalPrice();
		},
		selectProduct(product){
			if(typeof product.checked == 'undefined'){
				//全局注册（用Vue监听一个不存在的变量）
				// Vue.set(product,'checked',true);
				this.$set(product,'checked',true);
			}else{
				product.checked = !product.checked;
			}
			this.calcTotalPrice();

			//联动全选/取消全选
			if(!product.checked){
					this.checkAll = false;
			}else{
				var i = 0,len = this.productList.length;
				this.productList.forEach((val,index)=>{
					if(val.checked) i++;
				});
				if(i == len) this.checkAll = true;
			}
		},
		allCheck(flag){
			this.checkAll = flag;
			this.productList.forEach((val,index)=>{
				if(typeof val.checked == 'undefined'){
					this.$set(val,'checked',this.checkAll);
				}else{
					val.checked = this.checkAll;
				}
			});
			this.calcTotalPrice()
		},
		calcTotalPrice(){
			this.totalMoney = 0;
			this.productList.forEach((val,index)=>{
				if(val.checked){
					this.totalMoney += val.productPrice * val.productQuentity;
				}
			});
		},
		delConfirm(product){
			this.delFlag = true;
			this.curProduct = product;
		},
		delProduct(){
			var index = this.productList.indexOf(this.curProduct);
			this.productList.splice(index,1);
			this.delFlag = false;
			//模拟接口删除
		}
	}
});

//全局过滤器,所有构造器都可以使用
Vue.filter('fmoney',function(value,type){
	return '￥' + value.toFixed(2) + type;
});