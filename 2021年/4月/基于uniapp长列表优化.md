# 长列表

> 基于uniapp的长列表优化，思路来自 [daisy](https://zhuanlan.zhihu.com/p/146791824)
>
> 思路是：不要产生太多的dom节点，该他渲染的时候就展示出来，不展示出来dom节点都不渲染出来
>
> 性能是小程序原生写的性能最佳，可以无限滚动。
>
> Android环境的小程序 红米 基本实现无限滚动，但是不能滚太快，会出现白屏。
>
> IOS环境小程序 iphone11 性能比较差，滚动到11页就出现白屏，且往下滚都是白屏居多。 



```vue
<template>
	<view class="page">
		<view v-for="(item,index) in list" :key="index" :id="'wrp_'+index">
			<view v-if="item.length">
				<view class="wrp" v-for="(item2,index2) in item" :key="index2">
					当前是第{{ item2.idx }}个元素，为第 {{ index }} 屏数据
				</view>
			</view>
			<view v-else :style="'height:'+item.height + 'rpx'">
			</view>
		</view>
	</view>
</template>

<script>
	const throttle = (fn, delay) => {
		let startTime = new Date();
		return function() {
			let context = this;
			let args = arguments;
			let endTime = new Date();
			let resTime = endTime - startTime;
			//判断大于等于我们给的时间采取执行函数;
			if (resTime >= delay) {
				fn.apply(context, args);
				//执行完函数之后重置初始时间，等于最后一次触发的时间
				startTime = endTime;
			}
		}
	}
	export default {

		data() {
			return {
				list: [],
				datas: "",
				wholePageIndex: 0, // 当前为第几屏
				wholeVideoList: [], //  用来装所有屏的数据
				currentRenderIndex: 0, // 当前正在渲染哪一屏
				lastTimeTop: 0, // 计算上一次距离顶部的距离
				pageHeightArr: [], // 用来装每一屏的高度
				windowHeight: 0, // 当前屏幕的高度
				computedCurrentIndex: 0, // 滚动后计算他应该在那一屏上面 
			}
		},


		onLoad() {
			// 获取屏幕高度
			wx.getSystemInfo({
				success: (res) => {
					let {
						windowHeight
					} = res;
					this.windowHeight = windowHeight * 2;
				}
			})

			const arr = []
			for (let i = 0; i < 10; i++) {
				arr.push({
					idx: this.wholePageIndex + "" + i
				})
			}

			this.wholeVideoList[this.wholePageIndex] = arr;
			this.list[this.wholePageIndex] = arr
			// dom渲染完成才能拿到dom结构的高度
			this.$nextTick(() => {
				this.setHeight();
			})

		},


	
		onPageScroll: throttle(function(e) {
	
			const realScrollTop = e.scrollTop * 2 ; // 每次滚动后距离顶部的距离 *2 因为rpx
			const that = this;
			
			// 滚动的时候需要实时去计算当然应该在哪一屏幕
			let tempScrollTop = 0;
			for (let i = 0; i < this.pageHeightArr.length; i++) {
				tempScrollTop = tempScrollTop + this.pageHeightArr[i]; // 把所有屏幕的高度加到这里来tempScrollTop
				if (tempScrollTop > realScrollTop + this.windowHeight) { // 
					this.computedCurrentIndex = i; // 实时计算 当前位于第几屏幕
					break;
				}
			}
			// 当计算出来的 index 和 当前渲染的不一样
			if (this.computedCurrentIndex !== this.currentRenderIndex) {
				// 这里给不渲染的元素占位
				let tempList = new Array(this.wholePageIndex + 1).fill(0);
				// 三屏的数据
				tempList.forEach((item, index) => {
					if (this.computedCurrentIndex - 1 <= index && index <= this.computedCurrentIndex + 1) {
						tempList[index] = that.wholeVideoList[index];
					} else {
						tempList[index] = {
							height: that.pageHeightArr[index]
						};
					}
				})

				// 需要让他们保持一致
				this.currentRenderIndex = this.computedCurrentIndex;  
				this.list = tempList
			}
		}, 1000),


		methods: {
			// 获取高度
			setHeight() {
				const that = this;
				const wholePageIndex = this.wholePageIndex;
				this.query = wx.createSelectorQuery();
				this.query.select(`#wrp_${wholePageIndex}`).boundingClientRect()

				this.query.exec(function(res) {
					console.log(res,"res")
					that.pageHeightArr[wholePageIndex] = res[0] && res[0].height*2;
				})
			},

			getVideoInfoData() {
				console.log(1111)
				this.wholePageIndex = this.wholePageIndex + 1;
				const arr = []
				for (let i = 0; i < 10; i++) {
					arr.push({
						idx: this.wholePageIndex + "" + i
					})
				}
				this.currentRenderIndex = this.wholePageIndex;
				this.wholeVideoList[this.wholePageIndex] = arr;
				// let datas = {};
				// 生成数组遍历
				let tempList = new Array(this.wholePageIndex + 1).fill(0);
				console.log("tempList:",tempList.length,"this.wholeVideoList:",this.wholeVideoList.length)
				// 大于2的话，证明需要控制不要显示前面的
				if (this.wholePageIndex > 2) {
					
					tempList.forEach((item, index) => {
						// 将最新两条数据显示出来
						if (index < tempList.length - 2) {
							tempList[index] = {
								height: this.pageHeightArr[index]
							};
						} else {
							tempList[index] = this.wholeVideoList[index];
						}

					})
					console.log(tempList,"tempList")
					this.list = tempList;
				} else {
					this.list.splice(this.wholePageIndex, 0, arr)
				}
				this.$nextTick(() => {
					this.setHeight();
				})
			},
		},

		/**
		 * 页面下拉触底事件的处理函数
		 */
		onReachBottom() {
			this.getVideoInfoData();
		},
	}
</script>

<style>
	.wrp {
		width: 375px;
		height: 400rpx;
	}
</style>

```



本来考虑做一个通用组件，无奈，业务，涉及增删改查，复杂度突增，就做成页面先落地，看看效果先。