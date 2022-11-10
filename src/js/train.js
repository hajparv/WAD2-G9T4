var app = Vue.createApp({

  data() {
      return {
          status:'',
          AffectedSegments:[ // affectedsegment object
            {
              // "Line":"NEL",
              // "Direction":"HarbourFront",
              // "Stations":"NE9,NE8,NE7,NE6",
              // "FreePublicBus":"",
              // "FreeMRTShuttle":"",
              // "MRTShuttleDirection":""
            }




          ],// line, direction, stations, FreePublicBus, FreeMRTShuttle, MRTShuttleDirection (array of objects)
          Message:[
            {
              // "Content":"1657 hrs",
              // "CreatedDate":""
            }
          ],

          table_headers: [
            // "Line",
            // "Direction",
            // "Stations",
            // "Remarks"
            
        ],
        Notif:"",



        
      }
  },
  computed:{
    get_station_name(){
      let api_endpoint_url1 = '../src/php/train.php'
            axios.get(api_endpoint_url1)
                .then(response => {
                    var response = response.data
                    console.log('here')
                    console.log(response)
                    var status=response.value.Status
                    if(status==1){
                      this.Notif="No disruptions "
                    }else{
                      this.Notif="huh"
                    }
    })
    
  }
  }
})
app.mount("#app")