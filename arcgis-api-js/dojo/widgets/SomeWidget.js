define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./SomeWidget.html",
    "dijit/form/Button"
], function (
    declare,
    lang,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    template,
    Button
) {
    return declare([
        _WidgetBase,
        _TemplatedMixin,
        _WidgetsInTemplateMixin
    ], {
        baseClass: "some-widget",
        templateString: template,

        constructor: function () {
            console.log("constructor", arguments);
        },

        postCreate: function () {
            this.inherited(arguments);
            console.log("postCreate", arguments);
            this.btnClick.on("click", lang.hitch(this, function (evt) {
                console.log("target", this);
                console.log("evt:click", evt);
            }));
        },

        startup: function () {
            console.log("startup", arguments);
            console.log("data-dojo-attach-point:titleNode", this.titleNode);
        }
    });
});