define([
    "dojo/_base/declare",
    "jimu/BaseWidget",
    "dijit/_WidgetsInTemplateMixin",
    "jimu/LayerInfos/LayerInfos",
    "dojo/store/Memory",
    "dojo/_base/lang",

    "esri/geometry/geometryEngine",
    "esri/graphic",

    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color"
], function (
    declare,
    BaseWidget,
    _WidgetsInTemplateMixin,
    LayerInfos,
    Memory,
    lang,

    geometryEngine,
    Graphic,

    SimpleFillSymbol,
    SimpleLineSymbol,
    Color
    ) {
    var clazz = declare([
        BaseWidget,
        _WidgetsInTemplateMixin
    ], {

        postCreate: function () {
            this.inherited(arguments);

            var store = new Memory();
            LayerInfos.getInstance(this.map, this.map.itemInfo).then(function (layerInfosObject) {
                layerInfosObject.getLayerInfoArray().forEach(function (layerInfo) {
                    store.add(layerInfo);
                });
            });

            this.fltLayerList.set({
                searchAttr: "title",
                store: store
            });

            this.btnBuffer.on("click", lang.hitch(this, function () {
                if (this._clickHandler) {
                    this._clickHandler.remove();
                    this._clickHandler = null;
                } else {
                    this._clickHandler = this.map.on("click", lang.hitch(this, function (evt) {
                        var layerId = this.fltLayerList.get("value");
                        var radius = this.txtRadius.get("value");
                        var layer = this.map.getLayer(layerId);
                        console.log("layer", layer);
                        console.log("map:click", evt, radius);
                        var geoBuffer = geometryEngine.buffer(evt.mapPoint, radius, "meters");

                        var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                            new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                            new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));

                        var bufferGraphic = new Graphic(geoBuffer, sfs);

                        this.map.graphics.clear();
                        this.map.graphics.add(bufferGraphic);

                        layer.queryFeatures({
                            geometry: geoBuffer
                        }).then(lang.hitch(this, function (response) {
                            console.log("layer.query", response);
                        }));
                    }));
                }
            }));
        },

        startup: function () {
        },

        onActive: function () {

        },
        onDeactive: function () {
            if (this._clickHandler) {
                this._clickHandler.remove();
                this._clickHandler = null;
            }
        },
        onOpen: function () {

        },
        onClose: function () {

        }
    });
    return clazz;
});