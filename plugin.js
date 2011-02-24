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
GENTICS.Aloha.Repositories.stanbolRepository.settings.stanbolUrl = 'http://stanbol.iksfordrupal.net:9000/entityhub';

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
	
	// default delicious URL. Returns most popular links.
	this.deliciousURL = "http://feeds.delicious.com/v2/json/";
	
	if ( this.settings.username ) {
		
		// if a username is set use public user links
		this.deliciousURL += this.settings.username + '/';
	
		// set the repository name
		this.repositoryName = 'deliciuos/' + this.settings.username;
		
		// when a user is specified get his tags and store it local
		this.tags = [];
		
		jQuery.ajax({ type: "GET",
			dataType: "jsonp",
			url: 'http://feeds.delicious.com/v2/json/tags/'+that.settings.username,
			success: function(data) {
				// convert data
				for (var tag in data) {
					that.tags.push(tag);
				}
			}
		});
	} else {
		// set the repository name
		this.repositoryName = 'deliciuos/' + popular;

		this.deliciousURL += 'tag/';
	}
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
GENTICS.Aloha.Repositories.stanbolRepository.query = function( params, callback ) { 
// get items
	callback.call( this, items);
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
// get items
	callback.call( this, items);
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
	obj.attr('data-stanbolRepository').text(resourceItem.name);
};


