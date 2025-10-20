//var connection = new WebSocket('ws://192.168.70.211:8001/websocket');
//var connection = new WebSocket('ws://192.168.70.211:8001/websocket?id=map_loc');
var connection = new WebSocket('ws://localhost:8001/websocket?id=map_loc');
//var connection = new ReconnectingWebSocket('ws://140.109.171.96:8001/websocket?id=map_loc',null, {debug: true, reconnectInterval: 1000});
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GeoJSONLayer",
    "esri/layers/TileLayer",
    "esri/Graphic",
    "esri/rest/support/Query"
], function(Map, MapView, GeoJSONLayer, TileLayer,Graphic) {

    // 創建地圖
     // var map = new Map({
     //     basemap: "dark-gray", // 使用 ArcGIS Dark Gray 底圖
     //     language: "zh-TW"
     // });
   
    //https://basemaps-api.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer
    const layer = new TileLayer({ url: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer" });
    const layer2 = new TileLayer({ url: "https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer" });
    //map.layers.add([layer]);
  const map = new Map({ layers: [layer,layer2] });
  //const map = new Map({ layers: [layer,layer2] });
    // 創建 MapView（地圖視圖）
    var view = new MapView({
        container: "viewDiv", // 指定地圖容器 ID
        map: map,
        center: [121.600, 25.039], // 地圖中心位置 (內科)
        zoom: 14 // 設定縮放級別
    });

    // 顯示 GeoJSON 層 1 (Neihu.geojson)
    var geojsonLayer1 = new GeoJSONLayer({
        //url: "https://raw.githubusercontent.com/ryanma20/GeoRyanMa/refs/heads/main/Geojsonfiles/Neihu.geojson",
        url: "static/Geojsonfiles/Nankang_village.geojson",
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-fill", // 填充符號
                color: [0, 255, 255, 0.1], // 半透明藍色
                outline: {
                    color: [0, 255, 255, 1],
                    width: 1
                }
            }
        }
    });

    // 顯示 GeoJSON 層 2 (Rush hour.geojson)
    var geojsonLayer2 = new GeoJSONLayer({
        url: "https://raw.githubusercontent.com/ryanma20/GeoRyanMa/refs/heads/main/Geojsonfiles/Rush%20hour.geojson",
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-marker", // 簡單點符號
                style: "circle",
                color: [255, 0, 0, 0.8], // 紅色
                size: 8,
                outline: {
                    color: [255, 255, 255],
                    width: 1
                }
            }
        }
    });
    var geojsonLayer3 = new GeoJSONLayer({
        url: "static/Geojsonfiles/mainroad_taiwan.geojson",
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-fill", // 簡單點符號
                size: 8,
                outline: {
                    color: [255, 255, 255],
                    width: 1
                }
            }
        }
    }); 

     var geojsonLayer4 = new GeoJSONLayer({
        //url: "https://raw.githubusercontent.com/ryanma20/GeoRyanMa/refs/heads/main/Geojsonfiles/Neihu.geojson",
        url: "static/Geojsonfiles/Academia_Sinica.geojson",
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-fill", // 填充符號
                color: [255, 255, 0, 0.1], // 半透明黃
                outline: {
                    color: [255, 255, 0, 1],
                    width: 1
                }
            }
        }
    });


   var geojsonLayer5 = new GeoJSONLayer({
        //url: "https://raw.githubusercontent.com/ryanma20/GeoRyanMa/refs/heads/main/Geojsonfiles/Neihu.geojson",
        url: "static/Geojsonfiles/123.geojson",
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-fill", // 填充符號
                color: [255, 255, 0, 0.1], // 半透明黃
                outline: {
                    color: [255, 255, 0, 1],
                    width: 1
                }
            }
        }
    });



    // 設置 PopupTemplate 用來顯示點資料的名稱，標題使用點的 name 欄位
    geojsonLayer2.popupTemplate = {
        title: "{name}", // 使用 {name} 顯示每個點的名稱
        content: function(graphic) {
            var name = graphic.attributes.name || "無名稱"; // 確保名稱存在
            console.log("點的屬性:", graphic.attributes); // 檢查屬性
            return "點名稱: " + name;
        }
    };

    // 當點擊點資料時顯示名稱
    view.on("click", function(event) {
        view.hitTest(event).then(function(response) {
            if (response.results.length > 0) {
                var graphic = response.results[0].graphic;
               // if (graphic.layer === geojsonLayer2) {
                if (graphic.attributes.name) {
                    var name = graphic.attributes.name; // 獲取該點的名稱
                    var id = graphic.attributes.nodeid; // 獲取該點的名稱
                    console.log(id);
                    // 顯示 popup
                    if (name) {
                        view.popup.open({
                            title: id, // 使用點的名稱作為標題
                            content: "編號: "+id+"<br>點名稱: " + name, // 顯示點名稱
                            location: event.mapPoint, // 使彈出窗口在點上顯示
                            dockOptions: {
                                buttonEnabled: false,
                                position: "top-right" // 彈出視窗顯示在點的右側
                            }
                        });
                    } else {
                        view.popup.open({
                            title: "無名稱", // 如果沒有 "name" 屬性，顯示 "無名稱"
                            content: "此點沒有名稱", // 顯示提示信息
                            location: event.mapPoint, // 使彈出窗口在點上顯示
                            dockOptions: {
                                buttonEnabled: false,
                                position: "top-right" // 彈出視窗顯示在點的右側
                            }
                        });
                    }
                }
            } else {
                view.popup.close(); // 如果沒有點擊到任何資料，則關閉彈出視窗
            }
        });
    });

    // 將兩個 GeoJSONLayer 添加到地圖
    map.addMany([geojsonLayer1,geojsonLayer4]);
    //map.layers.add(geojsonLayer1);
    // view.on("click", function(event){
    //       console.log(event.mapPoint.latitude,event.mapPoint.longitude);
    //       createGraphic(event.mapPoint.latitude, event.mapPoint.longitude);
    //     });
    let symboltyphoon = {
  type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
  url: "static/pic1.png",
  width: "16px",
  height: "16px"
};


  function switch_group(data_group){

  	if (data_group == 1){

        
          group_symbol = {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            color: [78, 227, 41]
          }; 


         }else if(data_group == 2){

        
          group_symbol = {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            color: [227, 53, 41]
          }; 

        }else if(data_group == 3){
    
          group_symbol = {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            color: [5, 234, 250]
          }; 
        }else if(data_group == 4){
       
	group_symbol = {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            //color: [226, 250, 5]
            color: [255, 193, 7]
          };

 
       } else{

	group_symbol = {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            color: [226, 119, 40]
          };


  	}



return  group_symbol
}







    function createGraphic(Graphicdata,hands_on,test=false){
          // First create a point geometry 
          lat = Graphicdata.latitude;
          long = Graphicdata.longitude;
          name = Graphicdata.name;
          id = Graphicdata.id;
          //if (Graphicdata.Group_ != "undefined" ){
          //Graphicdata.group = Graphicdata.Group_
        //}

          gis_group = Graphicdata.group;
          if(test){
            gis_group = 'test';
          }
          symbol_group = switch_group(gis_group);
          var point = {
            type: "point", // autocasts as new Point()
            longitude: long,
            latitude: lat
          };

          // Create a symbol for drawing the point
          //var markerSymbol = {
          //  type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          //  color: [226, 119, 40]
         // };

          polylineAtt = {
              name: name,
              group : gis_group,
              nodeid: id
           };
          // Create a graphic and add the geometry and symbol to it
          var pointGraphic = new Graphic({
            geometry: point,
            //symbol: markerSymbol,
            //symbol:symboltyphoon,
            symbol: symbol_group,
            attributes: polylineAtt
          });

          pointGraphic.popupTemplate = {
        title: "{name}", // 使用 {name} 顯示每個點的名稱
        content: function(graphic) {
            var name = graphic.attributes.name || "無名稱"; // 確保名稱存在
            console.log("點的屬性:", graphic.attributes); // 檢查屬性
            return "點名稱: " + name +'<br>'+ graphic.attributes.group;
        }
    };

       if(hands_on){
          // Add the graphics to the view's graphics layer
          //view.graphics.add(pointGraphic);
           view.goTo({
           center: [long, lat], // Target location
           zoom: 17 // Zoom level
  			}).then(function(){
                 setTimeout(function() {
                 view.graphics.add(pointGraphic);
                },1000);
            }).then(function(){
            setTimeout(function() {
                view.popup.open({
                    location: pointGraphic.geometry, // location of the click on the view
                    Features: [view.graphics], // display the content for the selected feature if a popupTemplate is defined.
                    title:"受訪者: "+pointGraphic.attributes.nodeid,
                    content: '<div style="font-size: 16px;">組別: '+pointGraphic.attributes.group+'<br>'+"地址: "+pointGraphic.attributes.name+'</div>'
                });
               },1200);
            });
	   } else{

           view.graphics.add(pointGraphic);
          }

     
        }
    //connection.send("Hello, world");





     connection.onmessage = function(event) {
        console.log(event.data);
        var newData = JSON.parse(event.data);
        if(newData.id == '280-data'){
             view.goTo({
                    center: [121.600, 25.039], // Target location
                    zoom: 14 // Zoom level
                          });
          Object.keys(newData.data).forEach(function(k){
            console.log(newData.data[k]);
            createGraphic(newData.data[k],false,false);
                       })
        }else{
        createGraphic(newData,true);
}
 
     }

    connection.onclose = () => {
        console.log("WebSocket closed. Attempting to reconnect in", reconnectInterval / 1000, "seconds...");
        setTimeout(() => {
            connectWebSocket();
        }, 1000);
        
    };
  function connectWebSocket(){
    connection = new WebSocket('ws://140.109.171.96:8001/websocket?id=map_loc');
  }
});
