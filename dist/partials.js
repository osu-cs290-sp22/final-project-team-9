(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
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

  return "<a class=\"bubble\" href=\"/next?id="
    + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":1,"column":33},"end":{"line":1,"column":39}}}) : helper)))
    + "\">\n    <div class=\"item animation-target\" data-playlist-id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":2,"column":57},"end":{"line":2,"column":63}}}) : helper)))
    + "\">\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"imageSrc") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data,"loc":{"start":{"line":3,"column":8},"end":{"line":9,"column":15}}})) != null ? stack1 : "")
    + "    </div>\n</a>";
},"useData":true});
templates['head.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<meta charset=\"UTF-8\">\n<link href=\"/assets/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link href=\"/assets/brand-buttons-inversed.min.css\" rel=\"stylesheet\">\n<link href=\"/assets/brand-buttons.min.css\" rel=\"stylesheet\">\n<link href=\"/assets/css/font-awesome.min.css\" rel=\"stylesheet\">\n<link href=\"/assets/animate.min.css\" rel=\"stylesheet\">\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap-select@1.14.0-beta3/dist/css/bootstrap-select.min.css\">\n<link href=\"/assets/style.css\" rel=\"stylesheet\">";
},"useData":true});
templates['nav.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "            <ul class=\"navbar-nav ms-auto\">\n                <li class=\"nav-item dropdown\">\n                    <a class=\"btn btn-spotify\" href=\"/api/auth/share\" id=\"shareButton\"><i class=\"fa-solid fa-share\"></i>Share</a>\n                    <a class=\"btn btn-spotify\" href=\"/api/auth/login\" id=\"loginButton\">Login</a>\n            </ul>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "            <ul class=\"navbar-nav ms-auto\">\n                <li class=\"nav-item dropdown\">\n                    <a class=\"btn btn-spotify\" href=\"/api/auth/share\" id=\"shareButton\">Share</a>\n                    <a class=\"btn btn-spotify\" href=\"/api/auth/logout\" id=\"loginButton\">Logout</a>\n            </ul>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<nav class=\"navbar navbar-expand-xl fixed-top navbar-dark bg-dark\">\n    \n    <div class=\"container-fluid\">\n        <a class=\"navbar-brand mb-0 h1\" href=\"/\">SmartLists</a>\n        <button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#navbarNav\" aria-controls=\"navbarNav\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n            <span class=\"navbar-toggler-icon\"></span>\n        </button>\n        <div class=\"collapse navbar-collapse\" id=\"navbarNav\">\n            <ul class=\"navbar-nav\">\n                <li class=\"nav-item\">\n                    <a class=\"nav-link\" href=\"/about\">About</a>\n                </li>\n            </ul>\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"navState") : depth0),1,{"name":"eq","hash":{},"data":data,"loc":{"start":{"line":14,"column":18},"end":{"line":14,"column":33}}}),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":14,"column":12},"end":{"line":20,"column":19}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"navState") : depth0),2,{"name":"eq","hash":{},"data":data,"loc":{"start":{"line":21,"column":18},"end":{"line":21,"column":33}}}),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":12},"end":{"line":27,"column":19}}})) != null ? stack1 : "")
    + "        </div>\n    </div>\n</nav>";
},"useData":true});
templates['placeholder.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<a class=\"bubble ph\" href=\"#\">\n    <div class=\"item animation-target placeholder\">\n            <img alt=\"placeholder\" class=\"innerItem\" src='assets/grey.png' />\n    </div>\n</a>";
},"useData":true});
})();