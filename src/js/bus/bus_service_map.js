var app = Vue.createApp({

    data() {
        return {
            selected_bus_stop: '',
            services: [],
            selected_service_no: '',
            auto_complete_suggestion_service: [],
            bus_stops: {},
            selected_bus_stop_arrivals: {},
            bus_routes: {},
            bus_service_sequence: {},
            bus_direction_points: {},
            direction: '',
            service_arrival_time: '',
            service_time: [],
            bus_stop_location: [],
            selected_locations: [],
            table_shown: false,
            direction_dropdown: false,
            display_service_no: ''
        }
    },

    methods: {
        auto_complete_bus_service_search() {
            this.auto_complete_suggestion_service.length = 0
            var hint = []
            var query = this.selected_service_no
            if (this.selected_service_no != '') {
                query = query.toLowerCase()
                var len = query.length

                for (service in this.services) {
                    if (this.stristr(query, service.substr(0, len))) {
                        hint.push(service)
                    }
                }
            }
            // console.log(hint)
            this.auto_complete_suggestion_service = hint
            // console.log(this.auto_complete_suggestion_service)
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

        fill_bus_service(suggestion) {
            this.selected_service_no = suggestion
            this.auto_complete_suggestion_service.length = 0
        },


        get_service_sequence() {
            this.display_service_no = this.selected_service_no
            this.auto_complete_suggestion_service.length = 0
            this.table_shown = false
            this.direction_dropdown = false
            for (const key in this.bus_service_sequence) {
                delete this.bus_service_sequence[key];
            }
            this.direction = ''
            var service_no = this.selected_service_no
            var service_no = this.bus_routes[service_no]
            var first_list = []
            var second_list = []
            var start_direction = service_no[0][0]
            for (value of service_no) {
                if (start_direction == value[0]) {
                    first_list.push(value[1])
                } else {
                    second_list.push(value[1])
                }
            }
            if (first_list.length > 0) {
                this.bus_service_sequence[1] = first_list
            }
            if (second_list.length > 0) {
                this.bus_service_sequence[2] = second_list
            }

            // console.log(this.bus_service_sequence)

            if (Object.keys(this.bus_service_sequence).length == 1) {
                this.direction = 1
                this.table_shown = true
                this.get_google_map()
            } else {
                this.direction_dropdown = true
                this.get_directions()
            }

        },

        get_directions() {
            for (direction in this.bus_service_sequence) {
                var stops = {}
                var first_stop = this.bus_service_sequence[direction][0]
                var second_stop = this.bus_service_sequence[direction][this.bus_service_sequence[direction].length - 1]
                for (desc in this.bus_stops) {
                    if (this.bus_stops[desc] == first_stop) {
                        var first_stop_desc = desc
                    }
                    if (this.bus_stops[desc] == second_stop) {
                        var second_stop_desc = desc
                    }
                }
                first_stop_desc = first_stop_desc.split(' - ')[0]
                second_stop_desc = second_stop_desc.split(' - ')[0]

                var whole = first_stop_desc + " - " + second_stop_desc

                stops[whole] = first_stop

                this.bus_direction_points[direction] = stops
            }
        },

        get_bus_stop_name(bus_stop_code) {
            return Object.keys(this.bus_stops).find(key => this.bus_stops[key] === bus_stop_code)
        },

        get_bus_timing_from_service(bus_stop_code) {
            this.service_arrival_time = 'true'
            // console.log(this.selected_service_no)
            let api_endpoint_url = '../../src/php/bus/bus_arrival.php?BusStopCode=' + bus_stop_code + '&ServiceNo=' + this.selected_service_no 
            axios.get(api_endpoint_url)
                .then(response => {
                    var table = {}
                    // console.log(response)
                    // console.log('here')
                    // console.log(this.service_time)
                    var response = response.data.Services
                    next_bus_no = 0
                    // console.log(response)
                    for (res of response) {
                        // console.log(res)
                        const current = new Date()
                        var bus_big_list = []
                        var bus_no = 'NextBus'
                        var bus_inner_list = []
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
                        // console.log(bus_inner_list)

                        var whole = ''

                        if (capacity == 'SEA') {
                            whole += '<p class="green">' + diff + '</p>'
                        } else if (capacity == 'SDA') {
                            whole += '<p class="yellow">' + diff + '</p>'
                        } else {
                            whole += '<p     class="red">' + diff + '</p>'
                        }

                        if (feature == 'WAB') {
                            whole += '<i class="fa-solid fa-wheelchair display-6"></i>'
                        }
                        if (type = "SD") {
                            whole += '<img src="../../src/img/bus/dd.png" style="width:60px">'
                        } else if (type = 'DD') {
                            whole += '<img src="../../src/img/bus/dd.png" style="width:60px">'
                        } else if (type = 'BD') {
                            whole += '<img src="../../src/img/bus/bd.png" style="width:100px">'
                        }

                        // console.log(whole)
                        // return whole
                        var name = Object.keys(this.bus_stops).find(key => this.bus_stops[key] === bus_stop_code)

                        // var row = `<td>${bus_stop_code}</td>
                        // <td>${name}</td>
                        // <td>${whole}</td>`


                        table['code'] = bus_stop_code
                        table['name'] = name
                        table['str'] = whole

                        // console.log(row)
                        // table += row


                        this.service_time.push(table)

                    }
                    // console.log(this.service_time)
                    // document.getElementById('service_arr_table').innerHTML = table

                })
                .catch(error => {
                    console.log(error.message)
                })
        },


        getting_all_bus_time() {
            this.service_time.length = 0
            // console.log('over here - first')

            // console.log(this.service_time)
            // console.log(this.bus_service_sequence[this.direction])
            for (bus_stop_code of this.bus_service_sequence[this.direction]) {
                console.log(bus_stop_code)
                this.get_bus_timing_from_service(bus_stop_code)
            }
            // console.log('over here -second')

            // console.log(this.service_time)
        },

        get_google_map() {
            this.getting_all_bus_time()
            this.table_shown = true
            this.selected_locations.length = 0
            // console.log(this.direction)
            // console.log(this.bus_service_sequence[this.direction])
            for (value of this.bus_service_sequence[this.direction]) {
                var list = []
                var name = this.get_bus_stop_name(value)
                list.push(name.split(' - ')[0])
                // var coor = this.bus_stop_location[name]
                list.push(this.bus_stop_location[name]['latitude'])
                list.push(this.bus_stop_location[name]['longitude'])
                this.selected_locations.push(list)
            }

            window.initMap = this.initMap();
        },

        initMap() {
            console.log(this.selected_locations)
            var locations = this.selected_locations


            var points = []

            for (i = 0; i < this.selected_locations.length; i++) {
                var latlong = {}
                latlong['lat'] = this.selected_locations[i][1]
                latlong['lng'] = this.selected_locations[i][2]

                points.push(latlong)
            }
            document.getElementById('map').style.height = "500px"
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 12,
                center: new google.maps.LatLng(1.35, 103.8),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });


            const drawpoints = new google.maps.Polyline({
                path: points,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
            });

            drawpoints.setMap(map);

            var infowindow = new google.maps.InfoWindow();

            var marker, i;

            for (i = 0; i < this.selected_locations.length; i++) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map
                });

                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        infowindow.setContent(locations[i][0]);
                        infowindow.open(map, marker);
                    }
                })(marker, i));
            }
        }
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
                            var whole = ''
                            if (desc in this.bus_stops) {
                                continue
                            } else {
                                var correct_desc = ''
                                var words = desc.split(' ')
                                for (word of words) {
                                    correct_desc += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + ' ';
                                }
                                whole = desc + " - " + road
                                this.bus_stops[whole] = value.BusStopCode
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