Vue.component("card-menu", {
	props: ['options'],
	methods: {
		runFun: function(a, data){
			if(a == "edit"){
				router.push({ path: "/editpost/" + data });
			}else if(a == "save_img"){
				ajaxDownload(data, "postimg.jpg", function(){
					toast("Starting download");
				});
			}
		}
	},
	template: `
		<i class="fas fa-ellipsis-v icon-btn popup-menu-btn">
			<div class="popup-menu">
				<p class="popup-menu-item" v-for="(option, key) in options.ops" v-bind:key="key" v-on:click="runFun(option.action, option.data)">{{ option.text }}</p>
			</div>
		</i>
	`
});





Vue.component("comment-card", {
	template: `
		<div class="card comment">
			<div class="head">
					<div class="udp">
						<img src="public/img/dp/dp5.jpg" alt="">
						<div class="uinfo">
							<a href="#" class="uid">Mk ays</a>
							<p class="time">2 January 2020</p>
						</div>
					</div><!-- /udp -->
			</div><!-- /head -->
			<div class="content">
				<p class="text">Hey there boomers I'm Lily Pichu I just needed some text so started typing these randomly, makes no sense but yes.</p>
			</div><!-- /content -->
			<div class="nav">
					<span href="#" class="react navi">
						<i class="fas fa-heart"></i>
						React
					</span>
					<span class="navi">
						<i class="fas fa-trash"></i>
						Delete
					</span>
			</div>
		</div>
	`
});





Vue.component("comment-form", {
	data: function(){
		return {
			commentModel: ''
		}
	},
	methods: {
		postCommnet: function(){
			toast(this.commentModel);
		}
	},
	mounted: function(){
		initFloatingInput($('.input-group.textarea .input'));
	},
	template: `
		<form class="card" method="POST" action="comment.php" v-on:submit.prevent="postCommnet()">
			<div class="input-group textarea">
				<label>Type a comment</label>
				<textarea class="input" v-model="commentModel"></textarea>
				<span class="indicator"></span>
				<p class="input-err"></p>
			</div>
			<button type="submit" class="btn block">Post comment</button>
		</form>
	`
});




Vue.component("post-card", {
	props: ['post'],
	computed: {
		dp: function(){
			return "public/img/dp/" + this.post.dp;
		},
		post_img: function(){
			return (this.post.post_img.trim() == "")? "" : "public/img/posts/" + this.post.post_img;
		},
		like_text: function(){
			if(this.post.num_hearts < 1){
				return "React";
			}else{
				return (this.post.num_hearts == 1)? "1 Heart" : this.post.num_hearts + " reacts";
			}
		},
		comment_text: function(){
			if(this.post.num_comments < 1){
				return "Comment";
			}else{
				return (this.post.num_comments == 1)? "1 Comment" : this.post.num_comments + " Comments";
			}
		},
		options: function(){
			return {
				ops: getMenuOps(this.post.user_is_post_author, this.post_img, this.post.following_author, this.post.id),
				post_id: this.post.id
			}
		}
	},
	mounted: function(){
		var imgs = document.querySelectorAll('.content img');
		scrollReveal(imgs, function(el){
			el.classList = "show";
		});
	},
	template: `
		<div class="card">
				<div class="head">
					<div class="udp">
						<img v-bind:src="dp" alt="">
						<div class="uinfo">
							<a href="#" class="uid">{{post.uid}}</a>
							<p class="time">{{post.created_at}}</p>
						</div>
					</div><!-- /udp -->
					<card-menu v-bind:options="options"></card-menu>
				</div><!-- /head -->
				<div to="/" class="content">
					<img v-bind:src="post_img" alt="Post Image" v-if="post_img != ''">
					<p class="title" v-if="post.title != ''">{{post.title}}</p>
					<p class="text" v-if="post.text != ''">{{post.text}}</p>
				</div><!-- /content -->
				<div class="nav">
					<span class="react navi">
						<i class="fas fa-heart" v-bind:class="{ active: post.current_user_reacted }"></i>
						{{like_text}}
					</span>
					<router-link v-bind:to="'/post/' + post.id" class="comment navi">
						<i class="fas fa-comment"></i>
						{{comment_text}}
					</router-link>
				</div>
		</div><!-- /card -->
	`
});






Vue.component("post-form", {
	data: function(){
		return {
			showpimg: false,
			postModel: {
				title: '',
				text: '',
				post_img: ''
			},
			upperc: 0
		}
	},
	props: ['editing', 'pid'],
	methods: {
		imgman: function(){
			this.showpimg = false;
			var file = $('#postfile').value;
			if(!$('#postfile').files[0] || !file){
				$('#postfile').value = "";
				$('#postfile').files[0] = "",
				$('#postfileprev').setAttribute('src', '');
				return;
			}
			var ext = file.split('.').pop().toLowerCase();
			if(ext == "jpg" || ext == "jpeg"){
				this.showpimg = true;
				resize($('#postfile'), $('#postfileprev'));
				toast('Processing image <i class="fas fa-spinner fa-spin"></i>');
			}else{
				$('#postfile').files[0] = "",
				$('#postfile').value = "";
				toast("Only use jpg/jpeg image", "err");
				$('#postfileprev').setAttribute('src', '');
			}
		},
		savePost: function(){
			if(!this.editing){
				this.createPost();
			}
		},
		createPost: function(){
			var data = new FormData;
			data.append('title', this.postModel.title);
			data.append('text', this.postModel.text.replace(/\n/g, "[nl]").replace(/  /g, "[sp]").replace(/\t/g, "[tb]"));
			data.append('post_img', $('#postfileprev').getAttribute('src'));
			var $this = this;
			axios.post("server/funcs/post/create.php", data, {
				headers: {
					"Content-Type": "multipart/form-data"
				},
				onUploadProgress: function(t) {
					this.upperc = parseInt(Math.round(100 * t.loaded / t.total))
				}.bind(this)
			}).then(function(res){
				if(res.data.trim() == 'authed'){
					toast('Post uploaded', 'success');
					$this.postModel.title = "";
					$this.postModel.text = "";
					$this.postModel.post_img = "";
					$('#postfile').value = "";
					$('#postfile').files[0] = "",
					$('#postfileprev').setAttribute('src', '');
					return ;
				}
				toast(res.data, 'err');
			}).catch(function(e){
				toast('Something went wrong', 'err');
			});
		}
	},
	mounted: function(){
		if(this.editing){
			var post = getPosts()[this.pid - 1];
			this.postModel.title = post.title;
			this.postModel.text = post.text;
			this.postModel.post_img = (post.post_img.trim() == '')? '' : "public/img/posts/" + post.post_img;
			setTimeout(initAllFloatingInput, 0);
		}
		initAllFloatingInput();
	},
	template: `
		<form class="form-card card">
			<h2 class="create-title">{{ editing? 'Edit post' : 'Create post' }}</h2>
			<div class="input-group">
				<label>Post title</label>
				<input class="input" type="text" v-model="postModel.title">
				<span class="indicator"></span>
				<p class="input-err"></p>
			</div>
			<label>Select post image</label>
			<label class="btn fselect" for="postfile">
				<i class="fas fa-file-image"></i>
				Select image
			</label>
			<input type="file" class="file" id="postfile" v-on:change="imgman()">
			<div class="content" v-bind:class="{hide: (postModel.post_img == '') }" v-if="editing">
				<img v-bind:src="postModel.post_img" id="postfileprev">
			</div>
			<div class="content" v-bind:class="{hide: !showpimg }" v-else>
				<img src="" id="postfileprev">
			</div>
			<div class="input-group textarea">
				<label>Type post description</label>
				<textarea class="input"  v-model="postModel.text"></textarea>
				<span class="indicator"></span>
				<p class="input-err"></p>
			</div>
			<div class="progress-bar" v-if="upperc > 0 && upperc < 100">
				<div class="progress" v-bind:style="{width: upperc + '%'}"></div>
			</div>
			<div class="create-nav">
				<router-link to="/" class="btn">Cancel</router-link>
				<span class="btn" v-on:click="savePost()">Save</span>
			</div>
		</form>
	`
});




var Homepage = Vue.component("home-page", {
	data: function(){
		return {
			posts: [],
			postModel: {
				searchText: '',
				orderBy: 'desc',
				postOf: 'all'
			},
			altText: 'Getting posts <i class="fas fa-spinner fa-spin"></i>'
		}
	},
	methods: {
		getPosts: function(){
			this.posts = getPosts();
		},
		searchPost: function(){
			toast("Getting posts <i class='fas fa-spinner fa-spin'></i>");
		}
	},
	mounted: function(){
		initFloatingInput($('.search-input .input'));
		var $this = this;
		setTimeout(function(){
			$this.getPosts();
		}, 300);
	},
	template: `
		<div class="home-container">
			<div class="card fetch-card">
				<form class="search-form section" method="GET" action="search.php" v-on:submit.prevent="searchPost()">
					<div class="input-group search-input">
						<label>Search ...</label>
						<input class="input" type="text" v-model="postModel.searchText">
						<span class="indicator"></span>
						<p class="input-err"></p>
					</div>
					<i class="fas fa-search icon-btn" v-on:click="searchPost()"></i>
				</form>
				<div class="fetch-ops section">
					<select v-model="postModel.postOf">
						<option value="" disabled>Get posts:</option>
						<option value="all" selected>All Posts</option>
						<option value="follown">Followings</option>
						<option value="reacted">Reacted</option>
						<option value="saved">Saved</option>
					</select>
					<select v-model="postModel.orderBy">
						<option value="" disabled>Order By</option>
						<option value="desc" selected>New to Old</option>
						<option value="asc">Old to New</option>
						<option value="rand">Random</option>
						<option value="reacts">Reacts</option>
					</select>
				</div>
			</div>
			<div class="posts" v-if="posts.length > 0">
				<post-card v-for="post in posts" v-bind:post="post" v-bind:key="post.id"></post-card>
			</div><!-- /post -->
			<h2 class="card alt-text" v-html="altText"  id="home-bottom"></h2>
			<router-link to="/createpost" class="floating-btn">
				<i class="fas fa-plus"></i>
			</router-link>
		</div>
	`
});





var Loginpage = Vue.component("login-page", {
	data: function(){
		return {
			loginModel: {
				uid: '',
				pwd: ''
			},
			loginErr: {
				uid: '',
				pwd: ''
			}
		}
	},
	methods: {
		loginUser: function(){
			var data = new FormData;
			data.append("uid", this.loginModel.uid);
			data.append("pwd", this.loginModel.pwd);
			var $this = this;
			axios.post("server/funcs/logreg/login.php", data).then(function(res){
				if(!res.data.hasErr && res.data.message.trim() == 'authed'){
					toast('Logged in!', 'success');
					app.userIsLoggedin = true;
					router.push({ path: '/' });
					return
				}
				if(res.data.message.trim() != ''){
					toast(res.data.message, 'err');
				}
				$this.loginErr = res.data.errors;
			}).catch(function(e) {
				toast(e, "err");
			});
		}
	},
	mounted: function(){
		initAllFloatingInput();
	},
	template: `
		<div class="form-container">
			<form class="form-card card" method="POST" action="login.php" v-on:submit.prevent="loginUser()">
				<h2>Login below</h2>
				<div class="input-group"  v-bind:class="{ err: (loginErr.uid.trim() != ''), active: (loginModel.uid.trim() != '') }">
					<label>Username</label>
					<input class="input" type="text" v-model="loginModel.uid">
					<span class="indicator"></span>
					<p class="input-err">{{loginErr.uid}}</p>
				</div>
				<div class="input-group" v-bind:class="{ err: (loginErr.pwd.trim() != ''), active: (loginModel.pwd.trim() != '') }">
					<label>Password</label>
					<input class="input" type="password" v-model="loginModel.pwd">
					<span class="indicator"></span>
					<p class="input-err">{{loginErr.pwd}}</p>
				</div>
				<router-link to="/signup" class="alt">Create a new account.</router-link>
				<button type="submit" class="btn">Login</button>
			</form>
		</div>
	`
});





var Signuppage = Vue.component("login-page", {
	data: function(){
		return {
			signupModel: {
				uid: '',
				email: '',
				pwd: '',
				cpwd: ''
			},
			signupErr: {
				uid: '',
				email: '',
				pwd: '',
				cpwd: ''
			}
		}
	},
	methods: {
		registerUser: function(){
			var data = new FormData;
			data.append("uid", this.signupModel.uid);
			data.append("email", this.signupModel.email);
			data.append("pwd", this.signupModel.pwd);
			data.append("cpwd", this.signupModel.cpwd);
			var $this = this;
			axios.post("server/funcs/logreg/register.php", data).then(function(res){
				if(!res.data.hasErr && res.data.message.trim() == 'authed'){
					toast('Account created!', 'success');
					app.userIsLoggedin = true;
					router.push({ path: '/' });
					return
				}
				if(res.data.message.trim() != ''){
					toast(res.data.message, 'err');
				}
				$this.signupErr = res.data.errors;
			}).catch(function(e) {
				toast(e, "err");
			});
		}
	},
	mounted: function(){
		initAllFloatingInput();
	},
	template: `
		<div class="form-container">
			<form class="form-card card" method="POST" action="login.php" v-on:submit.prevent="registerUser()">
				<h2>Create a new account</h2>
				<div class="input-group"  v-bind:class="{ err: (signupErr.uid.trim() != ''), active: (signupModel.uid.trim() != '') }">
					<label>Username</label>
					<input class="input" type="text" v-model="signupModel.uid">
					<span class="indicator"></span>
					<p class="input-err">{{signupErr.uid}}</p>
				</div>
				<div class="input-group"  v-bind:class="{ err: (signupErr.email.trim() != ''), active: (signupModel.email.trim() != '') }">
					<label>Email Address</label>
					<input class="input" type="text" v-model="signupModel.email">
					<span class="indicator"></span>
					<p class="input-err">{{signupErr.email}}</p>
				</div>
				<div class="input-group"  v-bind:class="{ err: (signupErr.pwd.trim() != ''), active: (signupModel.pwd.trim() != '') }">
					<label>Password</label>
					<input class="input" type="password" v-model="signupModel.pwd">
					<span class="indicator"></span>
					<p class="input-err">{{signupErr.pwd}}</p>
				</div>
				<div class="input-group"  v-bind:class="{ err: (signupErr.cpwd.trim() != ''), active: (signupModel.cpwd.trim() != '') }">
					<label>Confirm password</label>
					<input class="input" type="password" v-model="signupModel.cpwd">
					<span class="indicator"></span>
					<p class="input-err">{{signupErr.cpwd}}</p>
				</div>
				<router-link to="/login" class="alt">Login with existing account.</router-link>
				<button type="submit" class="btn">Sign up</button>
			</form>
		</div>
	`
});






var Postpage = Vue.component("post-page", {
	data: function(){
		return {
			post: {},
			postAltText: 'Loading post <i class="fas fa-spinner fa-spin"></i>',
			commentsAltText: 'Getting comments <i class="fas fa-spinner fa-spin"></i>',
			showPost: false,
			showComments: false
		}
	},
	methods: {
		getPost: function(){
			var pid = this.$route.params.post_id;
			this.post = getPosts()[pid - 1];
			this.showPost = true;
		},
		getComments: function(){
			this.showComments = true;
		}
	},
	mounted: function(){
		var $this = this;
		setTimeout(function(){
			$this.getPost();
			$this.getComments();
		}, 100);
	},
	template: `
		<div class="view-post-container">
			<div class="post section" v-if="showPost">
				<post-card v-bind:post="post"></post-card>
			</div><!-- /post -->
			<h2 class="card alt-text section" v-html="postAltText" v-else></h2>
			<div class="comments section" v-if="showComments">
				<comment-form></comment-form>
				<h2 class="comments-title">Comments:</h2>
				<comment-card></comment-card>
			</div>
			<h2 class="card alt-text she section" v-html="commentsAltText" v-else></h2>
		</div>
	`
});





var Createpost = Vue.component('create-post', {
	template: `
		<post-form v-bind:editing="false" v-bind:pid="null"></post-form>
	`
});


var Editpost = Vue.component('edit-post', {
	template: `
		<post-form v-bind:editing="true" v-bind:pid="$route.params.post_id"></post-form>
	`
});


var Aboutpage = Vue.component('about-page', {
	template: `
		<div class="about-container card">
			<div class="heading">
				<div class="text">
					<p class="small">welcome to</p>
					<p class="big top">feels</p>
					<p class="big">share</p>
				</div>
			</div>
		</div>
	`
});











var routes = [
	{ path: '/', component: Homepage, name: 'homepage' },
	{ path: '/login', component: Loginpage, name: 'loginpage' },
	{ path: '/signup', component: Signuppage, name: 'signuppage' },
	{ path: '/post/:post_id', component: Postpage, name: 'postpage' },
	{ path: '/createpost', component: Createpost, name: 'createpost' },
	{ path: '/editpost/:post_id', component: Editpost, name: 'editpost' },
	{ path: '/about', component: Aboutpage, name: 'aboutpage' },
];

var router = new VueRouter({
  routes: routes
});

var app = new Vue({
	router: router,
	el: '#app',
	methods: {
		logoutUser: function(){
			var $this = this;
			axios.get('server/funcs/user/logout.php').then(function(res){
				if(res.data.trim() == 'authed'){
					$this.userIsLoggedin = false;
					router.push({ path: '/login' });
					toast('Logged out', 'success');
				}
			});
		}
	},
	mounted: function(){
		var $this = this;
		userIsActive(function(){
			$this.userIsLoggedin = true;
		}, function(){
			$this.userIsLoggedin = false;
		});
	},
	data: {
		navbarIsActive: false,
		userIsLoggedin: false
	}
});