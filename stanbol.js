/**
 * Create the Repositories object. Namespace for Repositories
 * @hide
 */
if ( !GENTICS.Aloha.Repositories ) GENTICS.Aloha.Repositories = {};

/**
 * register the plugin with unique name
 */
GENTICS.Aloha.Repositories.stanbolRepository = new GENTICS.Aloha.Repository('iks.stanbolRepository');
/**
 * If no username is given, the public respoitory is searched:
 * @property
 * @cfg
 */
GENTICS.Aloha.Repositories.stanbolRepository.settings.stanbolUrl = 'http://localhost:8080/';

/**
 * Init method of the repository. Called from Aloha Core to initialize this repository
 * @return void
 * @hide
 */
GENTICS.Aloha.Repositories.stanbolRepository.init = function() {
	var that = this;
	
	// check weight 
	if ( this.settings.weight + 0.15 > 1 ) {
		this.settings.weight = 1 - 0.15;
	}
	this.sites = [];
	
	// curl -X POST -F "query=@srfgquery.json" http://localhost:8080/entityhub/site/dbpedia/query?'
	// default delicious URL. Returns most popular links.
	
	$.stanbolConnector.setConfig({stanbolUrl: this.settings.stanbolUrl});
	$.stanbolConnector.isAlive(function(alive){
	    if(!alive)
            alert(that.settings.stanbolUrl + " is not reachable!");
        else {
            console.info("Connection to stanbol at " + that.settings.stanbolUrl + " is OK");
	        $.stanbolConnector.getSites(function(cb){
	            that.sites = cb;
	        });
	    }
	});
	
	
	// set the repository name
	this.repositoryName = 'Stanbol';// + popular;

};

/** 
 * Searches a repository for object items matching queryString if none found returns null.
 * The returned object items must be an array of Aloha.Repository.Object
 * 
 * @property {String} queryString 
 * @property {array} objectTypeFilter OPTIONAL Object types that will be returned.
 * @property {array} filter OPTIONAL Attributes that will be returned.
 * @property {string} inFolderId OPTIONAL his is a predicate function that tests whether or not a candidate object is a child-object of the folder object identified by the given inFolderId (objectId).
 * @property {string} inTreeId OPTIONAL This is a predicate function that tests whether or not a candidate object is a descendant-object of the folder object identified by the given inTreeId (objectId).
 * @property {array} orderBy OPTIONAL ex. [{lastModificationDate:’DESC’, name:’ASC’}]
 * @property {Integer} maxItems OPTIONAL number items to return as result
 * @property {Integer} skipCount OPTIONAL This is tricky in a merged multi repository scenario
 * @property {array} renditionFilter OPTIONAL Instead of termlist an array of kind or mimetype is expected. If null or array.length == 0 all renditions are returned. See http://docs.oasis-open.org/cmis/CMIS/v1.0/cd04/cmis-spec-v1.0.html#_Ref237323310 for renditionFilter
 * @param {object} params object with properties
 * @param {function} callback this method must be called with all result items
 */
GENTICS.Aloha.Repositories.stanbolRepository.query = function( p, callback ) { 
    var items = [];
    var that = this;
    if ( p.objectTypeFilter.length && jQuery.inArray('website', p.objectTypeFilter) == -1) {
        callback.call( that, []);
    } else {
        var site = "dbPedia";
        s = p.query + "*";
        $.stanbolConnector.entityhubQuery(site, s, function(data){
	        for (var i = 0; i < data.length; i++) {
	            var item = data[i];
		        if (typeof data[i] != 'function' ) {
		            var label = $.stanbolConnector.getEntityLabel(item, "en");
			        items.push(new GENTICS.Aloha.Repository.Document ({
				        id: item.id,
				        name: label,
				        repositoryId: that.repositoryId,
				        type: 'website', 
				        url: item.id,
				        weight: that.settings.weight + (15-1)/100
			        }));
		        }
            }
        	callback.call( that, items);
        });
	}
};

/**
 * Returns all children of a given motherId.
 * @property {array} objectTypeFilter OPTIONAL Object types that will be returned.
 * @property {array} filter OPTIONAL Attributes that will be returned.
 * @property {string} inFolderId OPTIONAL his is a predicate function that tests whether or not a candidate object is a child-object of the folder object identified by the given inFolderId (objectId).
 * @property {array} orderBy OPTIONAL ex. [{lastModificationDate:’DESC’, name:’ASC’}]
 * @property {Integer} maxItems OPTIONAL number items to return as result
 * @property {Integer} skipCount OPTIONAL This is tricky in a merged multi repository scenario
 * @property {array} renditionFilter OPTIONAL Instead of termlist an array of kind or mimetype is expected. If null or array.length == 0 all renditions are returned. See http://docs.oasis-open.org/cmis/CMIS/v1.0/cd04/cmis-spec-v1.0.html#_Ref237323310 for renditionFilter
 * @param {object} params object with properties
 * @param {function} callback this method must be called with all result items
 */
GENTICS.Aloha.Repositories.stanbolRepository.getChildren = function( params, callback ) { 
/*
				success: function(data) {
					var items = [];
					// convert data
					for (var tag in data) {
						// the id is tag[+tag+...+tag]
						var id = (p.inFolderId)?p.inFolderId + '+' + tag:tag;
						if (typeof data[tag] != 'function' ) {
							items.push(new GENTICS.Aloha.Repository.Folder({
								id: id,
								name: tag,
								repositoryId: that.repositoryId,
								type: 'tag', 
								url: 'http://feeds.delicious.com/v2/rss/tags/'+that.settings.username+'/'+id,
								hasMoreItems: true
							}));
						}
					}
					callback.call( that, items);
				}
*/
    callback.call( that, []);
};


/**
 * Make the given jQuery object (representing an object marked as object of this type)
 * clean. All attributes needed for handling should be removed. 
 * @param {jQuery} obj jQuery object to make clean
 * @return void
 */
GENTICS.Aloha.Repositories.stanbolRepository.makeClean = function (obj) {
	obj.removeAttr('data-stanbolRepository');
};

/**
 * Mark or modify an object as needed by that repository for handling, processing or identification.
 * Objects can be any DOM object as A, SPAN, ABBR, etc. or
 * special objects such as GENTICS_aloha_block elements.
 * (see http://dev.w3.org/html5/spec/elements.html#embedding-custom-non-visible-data)
 * @param obj jQuery object to make clean
 * @return void
 */
GENTICS.Aloha.Repositories.stanbolRepository.markObject = function (obj, repositoryItem) {
	// obj.attr('data-stanbolRepository').text(resourceItem.name);
};


