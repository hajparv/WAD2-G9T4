let all_accident = []

var app = Vue.createApp({

    data() {
        return {
            test: "hello world 123",
            accidents: [],
            services_affected: [],
            
            selected_service_no: '',
            accident_details: {},//{accident: type, lat, long }
            

        }
    },

    methods:{
        get_accident(){
            console.log("=== [traffic.js] get_accident() ===")
            let api_endpoint_url1 = '../../src/js/traffic_accident.php'
            axios.get(api_endpoint_url1, {
                headers: {
                    'AccountKey': 'rA62Al3wSpWoBqzOBOIC6g==',
                    'accept': 'application/json',
                }
            })
            .then(response => {

                var response = response.data
                console.log(response)
                
                for(var res of response){
                    //response is the array of objects of 500s
                    let accident_object = res.value
                    //res.value is the individual arrays with objects
                    console.log(res.value)
                    if(accident_object != [] ){
                        for(var accident of accident_object){
                            this.accidents.push(accident)
                            all_accident.push(accident)
                        }
                        console.log("===get_accident()===")
                        console.log(all_accident)
                
                    }
                    console.log(this.accidents)
                }
                //array of objects(key = number key = type,lat,long)
                this.accident_details
            })
            .catch(error => {
                console.log(error.message)
            })
        },
        get_roadworks(){

            console.log("=== [traffic.js] get_roadworks() ===")
            let api_endpoint_url1 = '../../src/js/traffic_roadworks.php'
            axios.get(api_endpoint_url1, {
                headers: {
                    'AccountKey': 'rA62Al3wSpWoBqzOBOIC6g==',
                    'accept': 'application/json',
                }
            })
            .then(response => {
                console.log('test')
                var response = response.data
                console.log(response)
                for(res of response){
                    console.log(res)
                }
                
                
            })
            .catch(error => {
                console.log(error.message)
            })
        }
    }
})

app.mount("#appp")
// alert("this is traffic js")