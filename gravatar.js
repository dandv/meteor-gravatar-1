/* global Gravatar, CryptoJS, _ */
Gravatar = {

	/**
	 * `cleantString` remove starting and trailing whitespaces
	 * and lowercase the input
	 * @param  {String} string input string that may contain leading and trailing
	 * whitespaces and uppercase letters
	 * @return {String}        output cleaned string
	 */
	cleanString: function(string) {
		return string.trim().toLowerCase();
	},

	/**
	 * `isHash` check if a string match the MD5 form :
	 * 32 chars string containing letters from `a` to `f`
	 * and digits from `0` to `9`
	 * @param  {String}  string that might be a hash
	 * @return {Boolean}
	 */
	isHash: function(string) {
		var self = this;
		return /^[a-f0-9]{32}$/i.test(self.cleanString(string));
	},

	/**
	 * `hash` takes an input and run it through `CryptoJS.MD5`
	 * @see https://atmospherejs.com/jparker/crypto-md5
	 * @param  {String} string input string
	 * @return {String}        md5 hash of the input
	 */
	hash: function(string) {
		var self = this;
		return CryptoJS.MD5(self.cleanString(string)).toString();
	},

	/**
	 * `imageUrl` will provide the url for the avatar, given an email or a hash
	 * and a set of options to be passed to the gravatar API
	 * @see https://en.gravatar.com/site/implement/images/
	 * @param  {String} emailOrHash email or pregenerated MD5 hash to query
	 * gravatar with.
	 * @param  {Object} options     options to be passed to gravatar in the query
	 * string. The `secure` will be used to determine which base url to use.
	 * @return {String}             complete url to the avatar
	 */
	imageUrl: function(emailOrHash, options) {
		var self = this;
		options = options || {};

		// Want HTTPS ?
		var url = options.secure ?
			'https://secure.gravatar.com/avatar/' :
			'http://www.gravatar.com/avatar/';

		// Is it an MD5 already ?
		if (self.isHash(emailOrHash)) {
			url += emailOrHash;
		} else {
			if (_.isUndefined(options.d)) {
				var normalizedEmail = Email.normalize(emailOrHash);
				if (normalizedEmail !== emailOrHash) {
					options.d = url + self.hash(normalizedEmail);
				}
			}
			url += self.hash(emailOrHash);
		}

		delete options.secure;

		// Have any options to pass ?
		var params = _.map(options, function(val, key) {
			return key + '=' + encodeURIComponent(val);
		}).join('&');

		if (params.length > 0) {
			url += '?' + params;
		}

		return url;
	}
};
