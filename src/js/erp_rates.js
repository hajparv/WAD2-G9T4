var app2 = Vue.createApp({

    data() {
        return {
            vehicleType: '',
            dayType: '',
            startTime: '',
            endTime: '',
            zoneID: '',
            chargeAmt: '',
            effectiveDate: '',
            list12: []
        }
    },

    methods: {
        
        get_erp_rate() {
            console.log("yes")
            
            let api_endpoint_url = '../src/php/car/erp_rates.php' 
            axios.get(api_endpoint_url)
                .then(response => {
                    console.log("SUCCESS")
                    console.log(response.data[0].value)
                    console.log(response.data[0].value[0].StartTime)
                    var start_time = response.data[0].value[0].StartTime
                    var end_time = response.data[0].value[0].EndTime
                    var start_hour = Number(start_time.slice(0,2))
                    var end_hour = Number(end_time.slice(0,2))
                    var start_minute = Number(start_time.slice(3,5))
                    var end_minute = Number(end_time.slice(3,5))
                    var total_rate = response.data[0].value[0].ChargeAmount
                    var date = new Date()
	                var current_time = date.getHours()+":"+date.getMinutes()
                    var current_hour = date.getHours()
                    var current_minute = date.getMinutes()
                    current_hour = Number(current_hour)
                    current_time = Number(current_minute)
                    //current time returns string
                    console.log(typeof(current_time))
                    
                })
                .catch(error => {
                    console.log("we at error ")
                    console.log(error.message)
                })
        },

    },
})
app2.mount("#app2")
