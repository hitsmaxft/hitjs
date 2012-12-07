(function (window){
	var urlmod = (function(){
		var r=function(key, value, url){
			var pair = key + '=' + encodeURIComponent(value)
			var l = url  || window.location.href, reg=new RegExp('([?&])(' + key + '=.*)(&?.*$)')
			if ( ! reg.test(l) ) {
				return l + '&' + pair
			} else {
				return l.replace(reg, '$1' + pair + '$3')
			}
		}

		var j = function(url) {
			window.location.href = url
		}

		var tab = function(url) {
			window.open(url)
		}

		return {
			replace:r
			//,add:add
			//,window:w
			,jump:j
			,test:test
		}
	})()

	var store = (function() {
		var read, write, flush
	})()

	//base modules
	var bucket = (function(U){
		var keyName = 'bucket_id'
		var sw = function(id, url) {
			var u = url || window.location.href
			U.jump(U.replace(keyName, id, u))
		}

		var rm = function(){
		}
		var rem = function(){
		}
		return {
			swich:sw
			,remove:rm
			,remember:rem
		}
	})(urlmod)

	var keybind = (function(){
	})()

	var tsDebug = (function (U,Key){

	})(urlmod, keybind)
	var test = (function (U,Key){
		return {
			run:function(){
				console.log(U.replace('app', '忍忍', 'http://taobao.com/search?q=123&cat=123'))
			}
		}
	})(urlmod, keybind)

	test.run()

})(this)
