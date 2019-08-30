var env = "test";
// var env = "pro";
const prefix = {
	"test":{
		baseUrl:"",
		ossUrl:"",
	},
	"pro":{
		baseUrl:"",
		ossUrl:"",
	}
}

export default prefix[env]