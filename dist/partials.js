(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['placeholder.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<a class=\"bubble ph\" href=\"#\">\n    <div class=\"item animation-target placeholder\">\n            <img alt=\"placeholder\" class=\"innerItem\" src='assets/grey.png' />\n    </div>\n</a>";
},"useData":true});
templates['bubble.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <img loading=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"lazy") || (depth0 != null ? lookupProperty(depth0,"lazy") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lazy","hash":{},"data":data,"loc":{"start":{"line":4,"column":26},"end":{"line":4,"column":34}}}) : helper)))
    + "\" alt=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":4,"column":41},"end":{"line":4,"column":50}}}) : helper)))
    + "\" class=\"innerItem\" src='"
    + alias4(((helper = (helper = lookupProperty(helpers,"imageSrc") || (depth0 != null ? lookupProperty(depth0,"imageSrc") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"imageSrc","hash":{},"data":data,"loc":{"start":{"line":4,"column":75},"end":{"line":4,"column":87}}}) : helper)))
    + "' />\n            <p class=\"innerText\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":5,"column":33},"end":{"line":5,"column":42}}}) : helper)))
    + "</p>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <img alt=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":7,"column":22},"end":{"line":7,"column":31}}}) : helper)))
    + "\" class=\"innerItem\" src='assets/grey.png' />\n            <p class=\"innerText\" style=\"opacity:1\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":8,"column":51},"end":{"line":8,"column":60}}}) : helper)))
    + "</p>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<a class=\"bubble\" href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":1,"column":24},"end":{"line":1,"column":30}}}) : helper)))
    + "\">\n    <div class=\"item animation-target\" data-playlist-id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":2,"column":57},"end":{"line":2,"column":63}}}) : helper)))
    + "\">\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"imageSrc") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data,"loc":{"start":{"line":3,"column":8},"end":{"line":9,"column":15}}})) != null ? stack1 : "")
    + "    </div>\n</a>";
},"useData":true});
templates['graph-card.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"gcContainer cursor-pointer h-60\" style=\"margin: 1%;\">\n    <div class=\"gcOverlay rounded-md text-center h-60 d-flex items-center justify-center\" style=\"z-index: 10;position: absolute;width: 18rem;\">\n        <div class=\"graphCardbtn\">\n            <button class=\"btn btn-secondary\" onclick=\"openGraph('"
    + alias4(((helper = (helper = lookupProperty(helpers,"playlist") || (depth0 != null ? lookupProperty(depth0,"playlist") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"playlist","hash":{},"data":data,"loc":{"start":{"line":4,"column":66},"end":{"line":4,"column":78}}}) : helper)))
    + "', '"
    + alias4(((helper = (helper = lookupProperty(helpers,"type") || (depth0 != null ? lookupProperty(depth0,"type") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data,"loc":{"start":{"line":4,"column":82},"end":{"line":4,"column":90}}}) : helper)))
    + "', "
    + alias4(((helper = (helper = lookupProperty(helpers,"variables") || (depth0 != null ? lookupProperty(depth0,"variables") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"variables","hash":{},"data":data,"loc":{"start":{"line":4,"column":93},"end":{"line":4,"column":106}}}) : helper)))
    + ")\" data-bs-toggle=\"tooltip\" title=\"View\" style=\"margin-top:5%; border-radius: 100%; margin: 10px;\"><i class=\"fa fa-eye\"></i></button>\n            <button class=\"btn btn-secondary\" onclick=\"deleteGraph("
    + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":5,"column":67},"end":{"line":5,"column":73}}}) : helper)))
    + ")\" data-bs-toggle=\"tooltip\" title=\"Delete\" style=\"margin-top:5%; border-radius: 100%; margin: 10px;\"><i class=\"fa fa-trash-o\"></i></button>\n        </div>\n    </div>\n    <div class=\"gc card real bg-zinc-700 rounded-md text-center h-60\" style=\"width:18rem\">\n        <div class=\"card-body flex items-center justify-center\">\n            <img loading=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"lazy") || (depth0 != null ? lookupProperty(depth0,"lazy") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lazy","hash":{},"data":data,"loc":{"start":{"line":10,"column":26},"end":{"line":10,"column":34}}}) : helper)))
    + "\" alt=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":10,"column":41},"end":{"line":10,"column":50}}}) : helper)))
    + "\" src='"
    + alias4(((helper = (helper = lookupProperty(helpers,"imageSrc") || (depth0 != null ? lookupProperty(depth0,"imageSrc") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"imageSrc","hash":{},"data":data,"loc":{"start":{"line":10,"column":57},"end":{"line":10,"column":69}}}) : helper)))
    + "' /> \n        </div>\n    </div>\n</div>";
},"useData":true});
})();