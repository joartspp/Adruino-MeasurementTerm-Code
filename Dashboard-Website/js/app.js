var url = ""; // API Database
var url_now = ""; // API ล่าสุด
var vmApp = new Vue({
    el:'#dashboard',
    data:{
        nav_Header:"JETPIE",
        mainPage:'first_page',
        time_update:'00:00:00',
        time_data_update:'00:00:00',
        inti:false,
        room_data:'ROOM',
        light_state:false,
        page_init:'dashboard',
        data_table:[],
        show_data_count:100,
        button_list_last:true,
        parts_table:[
            {
                "url_img":"https://cu.lnwfile.com/_/cu/_raw/xr/hm/v7.jpg",
                "topic":"บอร์ด Arduino",
                "desc":"รุ่น Arduino UNO+WiFiR3 ATmega328P + ESP8266",
                "price" : "250.00",
                "url_shop" : "https://www.myarduino.net/product/1723/arduino-unowifi-r3-atmega328pesp8266-32mb-memory-usb-ttl-ch340g-compatible-for-arduino-uno-nodemcu-w"
            },
            {
                "url_img":"https://cu.lnwfile.com/_/cu/_raw/q5/1s/ed.jpg",
                "topic":"หลอดไฟ LED",
                "desc":"หลอดไฟ LED สีขาว 5mm",
                "price" : "10.00",
                "url_shop" : "https://www.myarduino.net/product/722/led-5mm-%E0%B8%AB%E0%B8%A5%E0%B8%AD%E0%B8%94%E0%B9%83%E0%B8%AA-%E0%B8%AA%E0%B8%B5%E0%B8%82%E0%B8%B2%E0%B8%A7-%E0%B8%88%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%995%E0%B8%94%E0%B8%A7%E0%B8%87"
            },
            {
                "url_img":"https://cu.lnwfile.com/_/cu/_raw/82/vu/ot.jpg",
                "topic":"บอร์ดทดลอง",
                "desc":"บอร์ดทดลอง แบบใส Breadboard 830 Point",
                "price" : "70.00",
                "url_shop" : "https://www.myarduino.net/product/1089/%E0%B8%9A%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%94%E0%B8%97%E0%B8%94%E0%B8%A5%E0%B8%AD%E0%B8%87-%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B9%83%E0%B8%AA-breadboard-830-point"
            },
            {
                "url_img":"https://cu.lnwfile.com/_/cu/_raw/jc/4m/va.jpg",
                "topic":"Light Dependent Resistor",
                "desc":"LDR 10mm Photocell Photoresistor ตัวต้านทานปรับค่าได้ตามแสง LDR ขนาด 10MM",
                "price" : "12.00",
                "url_shop" : "https://www.myarduino.net/product/1700/ldr-10mm-photocell-photoresistor-%E0%B8%95%E0%B8%B1%E0%B8%A7%E0%B8%95%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B2%E0%B8%99%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B9%81%E0%B8%AA%E0%B8%87-ldr-%E0%B8%82%E0%B8%99%E0%B8%B2%E0%B8%94-10mm"
            },
            {
                "url_img":"https://ae01.alicdn.com/kf/HTB1aER0LXXXXXagXpXXq6xXFXXX5/5D-15-NTC-negative-temperature-coefficient-thermistor-Free-shipping-Hot-sale.jpg",
                "topic":"Thermistor NTC",
                "desc":"Negative Temperature Coefficient ค่าความต้านทานจะลดลงเมื่ออุณหภูมิเพิ่มขึ้น",
                "price" : "ไม่ทราบ",
                "url_shop" : ""
            },
            {
                "url_img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBKhNoBSa8iEIUfcTtgU20iHRb1Va7YBn3dA&usqp=CAU",
                "topic":"Thermistor PTC",
                "desc":"Positive Temperature Coefficient ค่าความต้านทานจะเพิ่มขึ้นเมื่ออุณหภูมิเพิ่มขึ้น",
                "price" : "ไม่ทราบ",
                "url_shop" : ""
            },
            {
                "url_img":"https://o.lnwfile.com/_/o/_raw/z1/2r/t2.jpg",
                "topic":"K-Type Thermocouple",
                "desc":"(MAX6675) Module with Temperature Sensor Probe",
                "price" : "165.00",
                "url_shop" : "https://www.arduitronics.com/product/1126/k-type-thermocouple-max6675-module-with-temperature-sensor-probe"
            }
        ]
    },
    methods:{
        gotoOtherPage:(url)=>{
            window.location,href(url);
        },
        listAlignTable:(boole)=>{
            axios.get(url)
            .then(function(resp){
                var result = resp['data'];
                if (boole) {
                    // เก่าสุด
                    vmApp.data_table = result;
                    vmApp.button_list_last = false;
                } else {
                    // ล่าสุด
                    vmApp.button_list_last =  true;
                    vmApp.data_table = result.reverse();
                }
            });
        },
        listTableAll:()=>{
            axios.get(url)
            .then(function(resp){
                var result = resp['data'];
                vmApp.show_data_count = result.length;
            });
        },
        calibratedValue:function(num_volt){
            let numCal = parseFloat(num_volt);
            return ((numCal-0.7078)/0.0447).toFixed(2);
        },
        errorPencentage:function(theoryValue,realValue){
            return Math.abs(((parseFloat(realValue)-parseFloat(theoryValue))/(parseFloat(realValue))) * 100).toFixed(2);
        },
        openNewTab:function(url){
            window.open(url);
        }
    },
    computed:{
        showingNumber:function(){
            if (this.show_data_count == '') {
                return parseInt(1);
            } else {
                return parseInt(this.show_data_count)+1;
            }
            
        },
        
    }
});

$(document).ready(function(){
    // $('.ui-dashboard').hide();
    // $('.main-dashboard').hide();

    // $('.main-dashboard').show('fade',500,()=>{
    //     $('.ui-dashboard').show('slide',{direction:'left'},800,()=>{
    //     });
    // });

    $('#upTotop').click(function(){
        topFunction();
    });

    function topFunction() {
        $('.ui-dashboard').animate({
            scrollTop:0
        },"slow");
    }

    $('.ui-dashboard').scroll(function() {
        if ($(this).scrollTop() > 600) {
            $('#upTotop').css('display','block');
        } else {
            $('#upTotop').css('display','none');
        }
    });



    var now_page = 'dashboard';
    $('.graph-opened').hide();
    $('.cali-opened').hide();
    $('.table-opened').hide();
    $('.tools-opened').hide();
    $('.menu-a').click(function(){
        var goPage = $(this).attr('value');
        $('.menu-a').removeClass('active');
        if (vmApp.page_init != goPage) {
            vmApp.page_init = goPage;
            changeUI(goPage);
            $(this).addClass('active');
        }
    });
   
    function changeUI(page){
        if (now_page != page) {
            $('.'+now_page+'-opened').hide('slide',{direction:'right'},800,()=>{
                $('.'+page+'-opened').show('slide',{direction:'left'},800);
                now_page = page;
            });
        }
    }
    function initDataFromWS(isReverse){
        axios.get(url)
        .then(function(resp){
            var result = resp['data'];
            if (isReverse) {
                // เก่าสุด
                vmApp.data_table = result;
                vmApp.button_list_last = false;
            } else {
                // ล่าสุด
                vmApp.button_list_last =  true;
                vmApp.data_table = result.reverse();
            }
        });
    }

    initDataFromWS(false);

    var dialyTxC = $('#dialyThermocoupleC');
    var dialyTxF = $('#dialyThermocoupleF');
    var data_setting = {
        labels : ["Initializing"],
        datasets: [{
            label: '# of Votes',
            data: [0,100],
            text: "ff",
            backgroundColor: [
                'rgba(255, 159, 64, 0.5)'
            ],
            borderColor: [
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    }
    var dialyTxChartC = new Chart(dialyTxC,{
        type:'doughnut',
        data:data_setting,
        options:{
            responsive: true,
            rotation:1*Math.PI,
            circumference:1*Math.PI,
            title : {
                display : true,
                text : "Realtime : Thermocouple ( °C )"
            },
            tooltips: {enabled: false},
            hover: {mode: null},
        }
    });
    var dialyTxChartF = new Chart(dialyTxF,{
        type:'doughnut',
        data:data_setting,
        options:{
            responsive: true,
            rotation:1*Math.PI,
            circumference:1*Math.PI,
            title : {
                display : true,
                text : "Realtime : Thermocouple ( °F )"
            },
            tooltips: {enabled: false},
            hover: {mode: null},
        }
    });

    var thermisTx = $('#lineThermistor');
    var thermisTxChart = new Chart(thermisTx,{
        type:'bar',
        data:{
            labels:['Thermistor Sensor'],
            datasets:[
                {
                    label:"Positive ( Initializing )",
                    type:'bar',
                    backgroundColor:'rgba(0,255,0,0.3)',
                    data:[0,5]
                },
                {
                    label:"Negative ( Initializing )",
                    type:'bar',
                    backgroundColor:'rgba(255,0,0,0.3)',
                    data:[0,5]
                },
            ]
        },
        options:{
            title:{
                display:true,
                text : "Realtime : Thermistor ( Voltage )"
            },
            tooltips: {
                enabled: false
            },
            hover: {
                mode: null
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    var ldrTx = $('#dialyLightDR');
    var ldrTxChart = new Chart(ldrTx,{
        type:'doughnut',
        data:{
            labels : ["Initializing"],
            datasets: [{
                label: '# of Votes',
                data: [0,1000],
                text: "ff",
                backgroundColor: [
                    'rgba(255, 159, 64, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options:{
            responsive: true,
            rotation:1*Math.PI,
            circumference:1*Math.PI,
            title : {
                display : true,
                text : "Realtime : Light Dependent Resistor ( Ohm )"
            },
            tooltips: {enabled: false},
            hover: {mode: null},
        }
    });

    var sthermTx = $('#scatterThermistor');
    // var sthermTx = document.getElementById("scatterThermistor").getContext('2d');
    var sthermTxChart = new Chart(sthermTx,{
        type:'scatter',
        data:{
            datasets : [{
                label:"Initializing", // Point of Relation
                data:[],
                backgroundColor:'#2196f3',
            }]
        },
        options:{
            responsive: true,
            title : {
                display : true,
                text : "Scatter Graph Thermistor Negative & Thermocouple C | จากข้อมูลทั้งหมด"
            },
            maintainAspectRatio: true,
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Thermistor Negative (V)'
                    },
                    ticks: {
                        min:0,
                        max:5,
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Thermocouple (C)'
                    },
                    ticks: {
                        min:20,
                        max:35,
                        beginAtZero: true
                    },
                }]
            }
        }
    });

    var lineTcTx = $('#lineChartThermocouple');
    var lineTcTxChart = new Chart(lineTcTx,{
        type:'line',
        data : {
            labels:[0,1,2,3,4,5,6,7,8,9,10],
            datasets:[
                {
                    data:[],
                    label:"Initializing",//C
                    borderColor:'#3e95cd',
                    fill:false,
                    pointRadius: 0.5,
                    backgroundColor:'rgba(62, 149, 205,0.2)'
                },
                {
                    data:[],
                    label:"Initializing",//F
                    borderColor:'#f57542',
                    fill:false,
                    pointRadius: 0.5,
                    backgroundColor:'rgba(245, 117, 66,0.2)'

                }
            ],
        },
        options: {
            responsive: true,
            title: {
              display: true,
              text: 'Line Chart Thermocouple ( Celsius & Fahrenheit ) | ข้อมูลล่าสุด 1000 ข้อมูล'
            },
            scales:{
                yAxes:[{
                    ticks: {
                        min:0,
                        max:100,
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'อุณหภูมิ'
                    },
                }],
                xAxes:[{
                    scaleLabel: {
                        display: true,
                        labelString: 'จำนวนข้อมูล'
                    },
                }]
            }
        }
    });

    setTimeout(()=>{
        axios.get(url)
        .then(function(result){
            var data_import = result.data.reverse();
            var scatter_data = [];
            var dataPush = {};

            var line_Label = [];
            var line_data_C = [];
            var line_data_F = [];
            var lineDataPush = [];

            let data_i = 0
            for ( data_i ; data_i <= result.data.length-1 ; data_i++) {
                dataPush = {
                    x : parseFloat(data_import[data_i]['data']['Thermocouple_(C)']),
                    y : parseFloat(data_import[data_i]['data']['Thermistor_Negative_(V)'])
                };
                scatter_data.push(dataPush);
            }

            sthermTxChart.data.datasets[0].data = scatter_data;
            sthermTxChart.data.datasets[0].label = ["Point of Relation"];
            sthermTxChart.update();
            
            for (let id_data = 0 ; id_data <= 1000 ; id_data++ ) {
                line_data_C.push(data_import[id_data]['data']['Thermocouple_(C)']);
                line_data_F.push(data_import[id_data]['data']['Thermocouple_(F)']);
                line_Label.push(id_data);
            }

            lineTcTxChart.data.labels = line_Label;
            lineTcTxChart.data.datasets[0].data = line_data_C;
            lineTcTxChart.data.datasets[0].label = "Thermocouple (C)";
            lineTcTxChart.data.datasets[1].label = "Thermocouple (F)";
            lineTcTxChart.data.datasets[1].data = line_data_F;
            lineTcTxChart.update();
        });
    },5000);

    setInterval(()=>{
        if (!vmApp.inti) {vmApp.inti = true;};
        var time = new Date();
        var now_Date = time.getDate();
        vmApp.time_update = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
        axios.get(url_now)
        .then(function(resp){
            var data_import = resp.data;
                vmApp.room_data = data_import['data']['Room'];
                vmApp.time_data_update = `${data_import['time']}`;
                if (parseInt(data_import['data']['LED_Status']) == 1) {
                    vmApp.light_state = true;
                } else {
                    vmApp.light_state = false;
                }
                var toNumValue = parseFloat(data_import['data']['Thermocouple_(C)']);
                dialyTxChartC.data.labels = ["Temperature : " + toNumValue.toString() + "°C"];
                dialyTxChartC.data.datasets[0].data = [toNumValue,100.00-toNumValue];
                dialyTxChartC.update();

                dialyTxChartF.data.labels = ["Temperature : " + data_import['data']['Thermocouple_(F)'].toString() + "°F"];
                dialyTxChartF.data.datasets[0].data = [parseFloat(data_import['data']['Thermocouple_(F)']),200.00-parseFloat(data_import['data']['Thermocouple_(F)'])];
                dialyTxChartF.update();

                ldrTxChart.data.labels = ["LDR : " + data_import['data']['Light_Dependent_Resist'].toString() + " Ohm"];
                ldrTxChart.data.datasets[0].data = [parseFloat(data_import['data']['Light_Dependent_Resist']),1000.00-parseFloat(data_import['data']['Light_Dependent_Resist'])];
                ldrTxChart.update();
                
                thermisTxChart.data.datasets[0].label = `Positive ( ${(data_import['data']['Thermistor_Positive_(V)']).toString()} V )`;
                thermisTxChart.data.datasets[0].data = [parseFloat(data_import['data']['Thermistor_Positive_(V)']),5.0];
                thermisTxChart.data.datasets[1].label = `Negative ( ${(data_import['data']['Thermistor_Negative_(V)']).toString()} V )`;
                thermisTxChart.data.datasets[1].data = [parseFloat(data_import['data']['Thermistor_Negative_(V)']),5.0];
                thermisTxChart.update();
        });

    },5000);

    setInterval(()=>{
        axios.get(url)
        .then(function(resp){
            var result = resp.data;
            if (vmApp.button_list_last) {
                vmApp.data_table = result.reverse();
            } else {
                vmApp.data_table = result;
            }
        });
    },30000);
});


