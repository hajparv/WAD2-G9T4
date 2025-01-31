var app = Vue.createApp({

    data() {
        return {
            selected_bus_stop_code: '',
            selected_bus_stop: '',
            auto_complete_suggestion_bus: [],
            bus_stops: {},
            bus_stops_just_name: {},
            bus_stop_hidden: '',
            selected_bus_stop_arrivals: {},
            bus_stop_location: [],
            pos: {},
            list_of_stops: [],
            services: [],
            bus_routes: {},
            displayed_bus_stop_name: ''
        }
    },

    methods: {
        auto_complete_bus_stop_search() {
            this.auto_complete_suggestion_bus.length = 0
            var hint = []
            var query = this.selected_bus_stop
            if (this.selected_bus_stop != '') {
                query = query.toLowerCase()
                var len = query.length

                for (bus_stop in this.bus_stops) {
                    if (this.stristr(query, bus_stop.substr(0, len))) {
                        hint.push(bus_stop)
                    }
                }
            }
            // console.log(hint)
            this.auto_complete_suggestion_bus = hint
            // console.log(this.auto_complete_suggestion_bus)
        },

        stristr(haystack, needle, bool) {
            var pos = 0;
            haystack += '';
            pos = haystack.toLowerCase().indexOf((needle + '').toLowerCase());
            if (pos == -1) {
                return false;
            } else {
                if (bool) {
                    return haystack.substr(0, pos);
                } else {
                    return haystack.slice(pos);
                }
            }
        },

        fill_bus_stops(suggestion) {
            this.selected_bus_stop = suggestion
            this.auto_complete_suggestion_bus.length = 0
        },

        get_arrival_time_bus_stop() {
            this.auto_complete_suggestion_bus.length =0
            this.bus_stop_hidden = 'false'
            console.log(this.bus_stops[this.selected_bus_stop])
            var code = this.bus_stops[this.selected_bus_stop]
            console.log(code)
            if(code == undefined){
                var bus_stop = this.selected_bus_stop
                // console.log(bus_stop)
                code = this.bus_stops_just_name[bus_stop]
                // console.log(this.bus_stops_just_name)
                // console.log(code)
            }
            this.displayed_bus_stop_name = this.selected_bus_stop
            this.selected_bus_stop_code = code
            let api_endpoint_url = '../../src/php/bus/bus_arrival.php?BusStopCode=' + code + '&ServiceNo=a'
            axios.get(api_endpoint_url)
                .then(response => {
                    // console.log(response)
                    Object.keys(this.selected_bus_stop_arrivals).forEach(key => {
                        delete this.selected_bus_stop_arrivals[key];
                    })
                    // console.log('here')
                    // console.log(this.selected_bus_stop_arrivals)
                    var response = response.data.Services
                    next_bus_no = 0
                    // console.log(response)
                    for (res of response) {
                        console.log(res)
                        const current = new Date()
                        var bus_big_list = []
                        for (i = 1; i <= 3; i++) {
                            var bus_no = 'NextBus'
                            var bus_inner_list = []
                            if (i == 1) {
                                var time = res[bus_no].EstimatedArrival
                                time = new Date(time)
                                var diff = (time.getTime() - current.getTime()) / 1000;
                                diff /= 60;
                                diff = Math.abs(Math.round(diff));
                                if (diff <= 1) {
                                    diff = 'Arr'
                                }
                                var feature = res[bus_no].Feature
                                var capacity = res[bus_no].Load
                                var type = res[bus_no].Type
                                bus_inner_list.push(diff, feature, capacity, type)
                                console.log(bus_inner_list)

                            } else {
                                bus_no += i
                                if (res[bus_no].DestinationCode.length > 0) {
                                    var time = res[bus_no].EstimatedArrival
                                    time = new Date(time)
                                    var diff = (time.getTime() - current.getTime()) / 1000;
                                    diff /= 60;
                                    diff = Math.abs(Math.round(diff));
                                    if (diff == 1) {
                                        diff = 'Arr'
                                    }
                                    var feature = res[bus_no].Feature
                                    var capacity = res[bus_no].Load
                                    var type = res[bus_no].Type
                                    bus_inner_list.push(diff, feature, capacity, type)
                                    console.log(bus_inner_list)
                                }
                            }
                            bus_big_list.push(bus_inner_list)
                        }
                        // console.log(bus_big_list)
                        var ServiceNo = res.ServiceNo
                        // console.log(ServiceNo)
                        this.selected_bus_stop_arrivals[ServiceNo] = bus_big_list
                        // console.log(this.selected_bus_stop_arrivals)
                    }

                })
                .catch(error => {
                    console.log(error.message)
                })
        },

        get_capacity_color(cap) {
            if (cap == 'SEA') {
                return 'green'
            } else if (cap == 'SDA') {
                return 'yellow'
            } else {
                return 'red'
            }
        },
        get_user_location() {
            if (navigator.geolocation) {
                console.log('jere')
                // navigator.geolocation.getCurrentPosition(this,showposition,errorCoor,{maximumAge:60000, timeout:5000, enableHighAccuracy:true})
                navigator.geolocation.getCurrentPosition(position => {
                    this.pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                }, () => {
                    // Browser supports geolocation, but user has denied permission
                    this.pos = {
                        lat: 1.29,
                        lng: 103.8
                    };
                }, {
                    timeout: 50000
                });
            } else {
                // Browser doesn't support geolocation
                this.pos = {
                    lat: 1.29,
                    lng: 103.8
                };
            }
            console.log(this.pos)
        },

        distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
            var earthRadiusKm = 6371;

            var dLat = this.degreesToRadians(lat2 - lat1);
            var dLon = this.degreesToRadians(lon2 - lon1);

            lat1 = this.degreesToRadians(lat1);
            lat2 = this.degreesToRadians(lat2);

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return earthRadiusKm * c * 1000
        },

        degreesToRadians(degrees) {
            return degrees * Math.PI / 180;
        },

        get_bus_stop_map() {
            console.log('here')
            console.log(this.bus_stop_location)
            if (Object.keys(this.pos).length = 0) {
                this.get_user_location()
            }
            for (bus_stop in this.bus_stop_location) {
                // console.log(this.bus_stop_location[bus_stop])
                // console.log(this.pos)
                var lat1 = this.bus_stop_location[bus_stop].latitude
                var long1 = this.bus_stop_location[bus_stop].longitude
                var lat2 = this.pos.lat
                var long2 = this.pos.lng//wya
                var dist = this.distanceInKmBetweenEarthCoordinates(lat1, long1, lat2, long2)
                // console.log(dist)
                if (dist < 500) {
                    var list = []
                    list.push(bus_stop.split(' - ')[0])
                    list.push(this.bus_stop_location[bus_stop]['latitude'])
                    list.push(this.bus_stop_location[bus_stop]['longitude'])
                    list.push(bus_stop)
                    console.log(list)
                    this.list_of_stops.push(list)
                }
            }
            console.log(this.list_of_stops)
            window.initMap = this.initMap();
        },

        initMap() {
            var locations = this.list_of_stops


            var points = []

            for (i = 0; i < this.list_of_stops.length; i++) {
                var latlong = {}
                latlong['lat'] = this.list_of_stops[i][1]
                latlong['lng'] = this.list_of_stops[i][2]

                points.push(latlong)
            }
            console.log(this.pos.lat)
            var lat = this.pos.lat
            lat = lat.toFixed(2)
            var lng = this.pos.lng
            lat = lng.toFixed(2)
            document.getElementById('map').style.height = "500px"
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 17,
                center: this.pos,
                // center: new google.maps.LatLng(this.pos.lat, this.pos.lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            var infowindow = new google.maps.InfoWindow();

            var marker, i;

            for (i = 0; i < this.list_of_stops.length; i++) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map
                });

                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        infowindow.setContent(locations[i][0]);
                        infowindow.open(map, marker);
                        this.selected_bus_stop = locations[i][3]
                        console.log(this.selected_bus_stop)
                    }
                })(marker, i));
            }
        }
    },
    created() {
        // window.initMap = this.initMap();
        this.get_user_location()
    },

    computed: {
        get_bus_stops() {
            let api_endpoint_url1 = '../../src/php/bus/bus_stops.php'
            axios.get(api_endpoint_url1)
                .then(response => {
                    var response = response.data
                    for (res of response) {
                        var block = res.value
                        for (value of block) {
                            var road = value.RoadName
                            var desc = value.Description
                            if (desc in this.bus_stops) {
                                continue
                            } else {
                                var correct_desc = ''
                                var words = desc.split(' ')
                                for (word of words) {
                                    correct_desc += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + ' ';
                                }
                                var whole = correct_desc + " - " + road
                                this.bus_stops[whole] = value.BusStopCode
                                var lower_desc = correct_desc.toLowerCase().trim()
                                this.bus_stops_just_name[lower_desc] = value.BusStopCode
                            }
                            if (desc in this.bus_stop_location) {
                                continue
                            } else {
                                var location = {}
                                location['latitude'] = value.Latitude
                                location['longitude'] = value.Longitude

                                this.bus_stop_location[whole] = location
                            }
                        }
                    }
                    this.get_user_location()
                    // console.log(this.pos)
                    this.get_bus_stop_map()
                    console.log(this.bus_stop_location)
                    this.bus_stops = Object.keys(this.bus_stops)
                        .sort()
                        .reduce((accumulator, key) => {
                            accumulator[key] = this.bus_stops[key];

                            return accumulator;
                        }, {});
                })
                .catch(error => {
                    console.log(error.message)
                })
        },

        get_bus_service() {
            let api_endpoint_url1 = '../../src/php/bus/bus_service.php'
            axios.get(api_endpoint_url1)
                .then(response => {
                    var response = response.data

                    for (res of response) {
                        var block = res.value
                        for (value of block) {
                            var service = value.ServiceNo
                            if (this.services.includes(service)) {
                                continue
                            } else {
                                this.services.push(service)
                            }
                        }
                    }
                    this.services = this.services.sort()
                })
                .catch(error => {
                    console.log(error.message)
                })
        },

        get_bus_routes() {
            let api_endpoint_url1 = '../../src/php/bus/bus_route.php'
            axios.get(api_endpoint_url1)
                .then(response => {
                    var response = response.data
                    for (res of response) {
                        var block = res.value
                        for (value of block) {
                            if (value.ServiceNo in this.bus_routes) {
                                this.bus_routes[value.ServiceNo].push([value.Direction, value.BusStopCode, value.StopSequence])
                            } else {
                                this.bus_routes[value.ServiceNo] = []
                                this.bus_routes[value.ServiceNo].push([value.Direction, value.BusStopCode, value.StopSequence])
                            }
                        }
                    }

                    // console.log(this.bus_routes)
                })
                .catch(error => {
                    console.log(error.message)
                })
        }
    }

})
app.mount("#app")