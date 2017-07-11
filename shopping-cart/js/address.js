var vm = new Vue({
	el: '.container',
	data: {
		limitNum: 3,
		addressList: [],
		curIndex: 0,
		shiipingMethod: 1
	},
	mounted: function(){
		this.$nextTick(function(){
			this.getAddressList();
		});
	},
	computed: {
		_addressList(){
			//splice直接对原来的数组操作，所以要用slice
			return this.addressList.slice(0,this.limitNum);
		}
	},
	methods: {
		getAddressList(){
			this.$http.get('data/address.json').then(response=>{
				var res = response.data;
				if(res && res.status == '1'){
					this.addressList = res.result;
				}
			});
		},
		setDefaullt(addressId){
			this.addressList.forEach(function(item,index){
				if(addressId == item.addressId){
					item.isDefault = true;
				}else{
					item.isDefault = false;
				}
			});
		}
	}
});