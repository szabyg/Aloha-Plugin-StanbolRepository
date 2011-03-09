/**
 * This software is for demonstration and testing purposes.
 * (c) 2011 Szaby Gruenwald, Salzburg Research
 * The IKS Stanbol connector is freely distributable under the MIT license.
 */
(function($){
$.stanbolConnector = {
    options: {
        stanbolUrl: "http://localhost:8080/",
        proxyUrl: "proxy/proxy.php",
        error: function(errMsg){alert(errMsg);}
    },
    /**
     * Get the entityhub sitelist
     * @cb callback, gets an array of site names, e.g. ["dbpedia", "geonames"]
     */
    getSites: function(cb, options){
        $.extend(this.options, options);
        var uri = this.options.stanbolUrl + "entityhub/sites/referenced";
        var that = this;
        this.stanbolRequest(uri,{
            acceptHeader: "application/json", 
            success: function (data, textStatus, jqXHR){
                var res = _.map(data, function(siteUri){
                    return siteUri.replace(this.options.stanbolUrl + "entityhub/site/","").replace("/","")
                }, that);
                cb(res);
            }
        });
    },
    entityhubQuery: function(site, s, cb, options){
        var uri = this.options.stanbolUrl + "entityhub/site/" + site + "/query";
        if(!options)options={};
        var fieldQuery = {
            "selected": [ 
                "http:\/\/www.w3.org\/2000\/01\/rdf-schema#label", 
                "http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#type",
                "http://xmlns.com/foaf/0.1/homepage"
            ], 
            "offset": "0", 
            "limit": options.limit || "1000", 
            "constraints": [{ 
               "type": "text", 
               "patternType": "wildcard", 
               "text": s, 
               "field": "http:\/\/www.w3.org\/2000\/01\/rdf-schema#label" 
            }]
        };
        if(options && options.constraints)
            $.each(options.constraints, function(){fieldQuery.constraints.push(this);});
        var fq;
        if(JSON && JSON.serialize)
            fq = JSON.serialize(fieldQuery);
        else if(JSON && JSON.stringify)
            fq = JSON.stringify(fieldQuery);
        else {
            alert("JSON modul not found");
            console.error("JSON modul not found");
        }
        var postData = {query: fq};
        this.stanbolRequest(uri,{
            method: "POST",
            success: function (data, textStatus, jqXHR){
                cb(_.map(data.results, function(entity){
                    var res = {};
                    _.each(entity, function(value, key){
                        if(_.isArray(value)){
                            res[key] = _.map(value, function(valueObj){
                                return valueObj.value;
                            });
                        } else {
                            res[key] = value;
                        }
                    });
                    return res;
                }));
            },
            error: options.error,
            data: postData,
            processData: false,
            dataType: "string"
        });
    },
    getEntity: function(site, uri, cb, options){
        var uri = this.options.stanbolUrl + "entityhub/site/" + site + "/entity?id="+ /*escape*/(uri);
        $.extend(this.options, options);
        var that = this;
        this.stanbolRequest(uri,{
            acceptHeader: "application/json", 
//            data: {id: uri},
            success: function (data, textStatus, jqXHR){
                cb(data);
            },
            error: options.error
        });
    },
    getEntityLabel: function(item, lan){
      var labels = item["http://www.w3.org/2000/01/rdf-schema#label"];
      var defaultLabel = "";
      for(lab in labels){
        var label = labels[lab];
        var language = label.substring(label.length-2,label.length);
        cleanLabel = label.indexOf("@") != -1 ? label.substring(0,label.length-3):label;
        if(defaultLabel == "")defaultLabel = cleanLabel;
        if(!lan)return defaultLabel;
        if(language == lan)return cleanLabel;
      }
    },
    /**
     * generic call to a stanbol backend through a proxy
     * 
     */
    stanbolRequest: function(uri, options){
        var ajaxOpt = 
        {
            url: this.options.proxyUrl, 
            type: "POST",
            data: {
                proxy_url: uri, 
                Accept: options.acceptHeader || "application/json", 
                verb: options.method || "GET"
            },
            success: options.success,
            error: options.error
        };
        $.extend(ajaxOpt.data, options.data);
        $.ajax(ajaxOpt);
        
    },
    setConfig: function(options){
        $.extend(this.options, options);
    },
    isAlive: function(cb){
        this.stanbolRequest(this.options.stanbolUrl, {success: function(){cb(true);}, error: function(){cb(false);}})
    }
}
})(jQuery)
