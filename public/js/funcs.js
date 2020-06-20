function getMenuOps(uia, pi, isf, pid = null){
	var ops = [];
			if(uia){
				ops = [
					{
						text: "Edit",
						action: "edit",
						data: pid
					},
					{
						text: "Delete",
						action: "del",
						data: pid
					},
					{
						text: "Save post",
						action: "save_post",
						data: pid
					}
				];
				if(pi != ""){
					ops.push({
						text: "Save image",
						action: "save_img",
						data: pi
					});
				}
			}else{
				ops = [
					{
						text: (isf)? "Unfollow" : "Follow",
						action: "follow",
						data: ''
					},
					{
						text: "Save post",
						action: "save_post",
						data: pid
					}
				];
				if(pi != ""){
					ops.push({
						text: "Save image",
						action: "save_img",
						data: pi
					});
				}
				ops.push({
					text: "Report",
					action: "report",
					data: pid
				});
			}
	return ops;
}


function $(el){
	return document.querySelector(el);
}


function onScrollReveal(target, cb){
	var io = new IntersectionObserver(function (entries, observer){
		for(var i = 0; i < entries.length; i++){
			var entry = entries[i];
			if (entry.isIntersecting){
				cb(entry.target);
				observer.disconnect();
			}
		}
	});
	io.observe(target);
}

function scrollReveal(targets, cb){
	for(var i = 0; i < targets.length; i++){
		onScrollReveal(targets[i], cb);
	}
}


function initFloatingInput(el){
	if(el.value.trim() != ""){
		if(el.parentNode.classList.toString().indexOf('active') == -1){
			el.parentNode.classList = el.parentNode.classList.toString() + " active";
		}
	}
	el.addEventListener('focus', function(){
		if(this.parentNode.classList.toString().indexOf('active') == -1){
			this.parentNode.classList = this.parentNode.classList.toString() + " active";
		}
	});
	el.addEventListener('blur', function(){
		if(this.value.trim() == ""){
			this.parentNode.classList = this.parentNode.classList.toString().replace("active", "");
		}
	});
}
function initAllFloatingInput(){
	var inputs = document.querySelectorAll('.input-group .input');
	for(var i = 0; i < inputs.length; i++){
		initFloatingInput(inputs[i]);
	}
}
initAllFloatingInput();


var toastSpecificEl = null;
var toastIsVisible = false;
var toastTimeout;
function toast(txt, cls = ""){
	var dur = 3000;
	if(toastIsVisible){
		document.body.removeChild(toastSpecificEl);
		toastSpecificEl = null;
		toastIsVisible = false;
		clearTimeout(toastTimeout);
	}
	toastIsVisible = true;
	toastSpecificEl = document.createElement('div');
	if(cls != ""){
		toastSpecificEl.classList = "toast " + cls;
	}else{
		toastSpecificEl.classList = "toast";
	}	
	toastSpecificEl.innerHTML = txt;
	document.body.appendChild(toastSpecificEl);
	toastTimeout = setTimeout(function(){
		document.body.removeChild(toastSpecificEl);
		toastSpecificEl = null;
		toastIsVisible = false;
	}, dur);
}


function resize(t, e, n = !1, i = 0, a = 1) {
 var r = new FileReader;
 r.onload = function(t) {
  var r = new Image;
  r.src = t.target.result, r.addEventListener("load", function() {
   var t = document.createElement("canvas"),
    o = r.width,
    s = r.height,
    d = .5;
   if (o > 1024) {
    var l = s / o;
    o = 1024, s = Math.round(1024 * l), d = .3
   }
   if (t.width = o, t.height = s, n) {
    o = r.width, s = r.height, d = a;
    l = s / o;
    o = i = Math.min(i, o), s = Math.round(i * l), t.width = o, t.height = s
   }
   t.getContext("2d").drawImage(r, 0, 0, o, s);
   var p = t.toDataURL("image/jpeg", d);
   (new Image).src = p, e.setAttribute("src", p)
  })
 }, r.readAsDataURL(t.files[0])
}


function ajaxDownload(fileurl, as, cb){
	axios({
	  url: fileurl,
	  method: 'GET',
	  responseType: 'blob',
	}).then(function(response){
  	const url = window.URL.createObjectURL(new Blob([response.data]));
 	 const link = document.createElement('a');
 	 link.href = url;
	  link.setAttribute('download', as);
	  document.body.appendChild(link);
	  link.click();
	  cb();
	});
}


function userIsActive(y, n){
	axios.get('server/funcs/user/isactive.php').then(function(res){
		if(res.data.trim() == "authed"){
			y();
		}else{
			n();
		}
	});
}





function getPosts(){
	return [
				{
					id: 1,
					dp: "dp4.jpg",
					uid: "Lily Pichu",
					created_at: "31 December 2019",
					title: "What am I doing here",
					text: "Hey there boomers I'm Lily Pichu I just needed some text so started typing these randomly, makes no sense but yes.",
					post_img: "",
					num_hearts: 207,
					num_comments: 64,
					current_user_reacted: false,
					user_is_post_author: true,
					following_author: false
				},
				{
					id: 2,
					dp: "dp3.jpg",
					uid: "Clara Kate",
					created_at: "16 December 2019",
					title: "What am I doing here",
					text: "Hey there boomers I'm Lily Pichu I just needed some text so started typing these randomly, makes no sense but yes.",
					post_img: "1.jpg",
					num_hearts: 0,
					num_comments: 0,
					current_user_reacted: true,
					user_is_post_author: true,
					following_author: false
				},
				{
					id: 6,
					dp: "dp.jpg",
					uid: "Anny Jane",
					created_at: "16 December 2019",
					title: "",
					text: "Hey there boomers I'm Lily Pichu I just needed some text so started typing these randomly, makes no sense but yes.",
					post_img: "",
					num_hearts: 0,
					num_comments: 0,
					current_user_reacted: false,
					user_is_post_author: false,
					following_author: false
				},
				{
					id: 3,
					dp: "dp5.jpg",
					uid: "Mk Ays",
					created_at: "16 December 2019",
					title: "",
					text: "Hey there boomers I'm Lily Pichu I just needed some text so started typing these randomly, makes no sense but yes.",
					post_img: "3.jpg",
					num_hearts: 1,
					num_comments: 0,
					current_user_reacted: true,
					user_is_post_author: false,
					following_author: true
				},
				{
					id: 4,
					dp: "dp3.jpg",
					uid: "Billie Ellish",
					created_at: "16 December 2019",
					title: "",
					text: "Hey there boomers I'm Lily Pichu I just needed some text so started typing these randomly, makes no sense but yes.",
					post_img: "2.jpg",
					num_hearts: 23,
					num_comments: 0,
					current_user_reacted: true,
					user_is_post_author: false,
					following_author: false
				},
				{
					id: 5,
					dp: "dp.jpg",
					uid: "Anny Jane",
					created_at: "16 December 2019",
					title: "",
					text: "",
					post_img: "1.jpg",
					num_hearts: 0,
					num_comments: 0,
					current_user_reacted: false,
					user_is_post_author: false,
					following_author: false
				}
			];
}