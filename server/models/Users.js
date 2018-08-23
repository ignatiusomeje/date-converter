const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
	username:{
		type: String,
		unique: true,
		trim: true,
		required: true,
		minlength: 2
	},
	password:{
		type: String,
		required: true,
		trim: true,
		minlength: 6
	},
	tokens: {
		access:{
			type: String,
			required: true
		},
		token:{
			type: String,
			required: true
		}
	}
});

userSchema.methods.generateAuthenticationkey = async function(){
	const user = this;
	const access = "auth";
	const token = jwt.sign({_id: user._id.toHexString(),access},'bewareofhackers').toString();

	user.tokens.access = access
	user.tokens.token = token
	await user.save();
	return token;
}

userSchema.pre('save', function(next){
	const user = this;
	if (user.isModified('password')){
		bcrypt.genSalt(10,function(err,salt){
			bcrypt.hash(user.password, salt, function(err, hash){
				user.password = hash;
				next();
			});
		});
	} else{
		next()
	};
});

userSchema.statics.verifyUser = async function(username, password){
	const Users = this;
	var user = await Users.findOne({username});

	if (!user){ 
		return Promise.reject('Username or Password not found')
	};

	var pass = await bcrypt.compare(password, user.password);

	if (pass){
		return user;
	} 
	else {
		return Promise.reject('Username or Password incorrect');
	}; 
};

userSchema.methods.signOut = function(token){
	const user = this;
	return user.update({
		$unset:{
			tokens:{token}
		}
	});
};

userSchema.statics.findByToken = async function(token){
	const Users = this
	let decoded;
	try{
		decoded = await jwt.verify(token,'bewareofhackers')
	}catch(e){
		return e
	}
	return Users.findOne({
		'_id': decoded._id,
		'tokens.access': 'auth',
		'tokens.token': token
	})
}

const Users = mongoose.model('Users', userSchema);

module.exports = {Users};
