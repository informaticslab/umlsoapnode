 var soap = require('soap');
 var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('properties.js');
  var secargs = {user: properties.get('main.umls.username'),
				pw: properties.get('main.umls.password')};
  var securl = 'https://uts-ws.nlm.nih.gov/services/nwsSecurity?wsdl';
  var sectoken = 'notatoken';
  var serviceVersion = '2014AB';
  var serviceName = "http://umlsks.nlm.nih.gov";

  // var serviceargs = 
		// 		{umlsRelease: '1.0',
		// 		serviceName: 'http://umlsks.nlm.nih.gov'};
	soap.createClient(securl, function (err, client){
		client.getProxyGrantTicket(secargs, function(err, result) {
			
			
			sectoken = result.return;
			//console.log(sectoken);
			var moresecargs = {TGT: sectoken,
							   service: 'http://umlsks.nlm.nih.gov'};
			client.getProxyTicket(moresecargs, function(err, tokenresult){
				var tkn = tokenresult.return
				//console.log('token is ' + tkn);

				var metaURL = "https://uts-ws.nlm.nih.gov/services/nwsMetadata?wsdl";
				var metaArgs = {
									ticket: tkn,
									serviceName: serviceName
								}
				soap.createClient(metaURL, function(err,metaClient)
				{

					metaClient.getCurrentUMLSVersion(metaArgs, function(err, metaResult) {
					serviceVersion = metaResult.return;
					console.log(serviceVersion);
					client.getProxyTicket(moresecargs, function(err,tokenresult){
						tkn = tokenresult.return;
				 var contentURL = 'https://uts-ws.nlm.nih.gov/services/nwsContent?wsdl';
				 var contentArgs = {
				 						ticket: tkn,
				 						version: serviceVersion,
				 						conceptId: 'C0018787'
				 					}
				// var searchurl = 'https://uts-ws.nlm.nih.gov/services/nwsFinder?wsdl'
				// var searchArgs = {	ticket: tkn,
				// 					version: '1.0',
				// 					target: 'atom',
				// 					string: 'lou gehrig disease',
				// 					searchType: 'words'
				// 				}
					// soap.createClient(searchurl, function(err,searchClient)
					// {
					// 	searchClient.findConcepts(searchArgs, function(err, searchresult){
					// 		console.log(err);
					// 		console.log(searchresult);
					// 	})
					// })
					soap.createClient(contentURL, function(err,contentClient)
					{
						//console.log(contentClient.describe());
						contentClient.getConcept(contentArgs, function(err, contentresult){
							//console.log(err);
							console.log(contentClient.lastRequest);
							console.log(contentresult);
						})
					})
				})
})
					})
				})
			});
		});



  //https://uts-ws.nlm.nih.gov/services/nwsContent?wsdl
  //https://uts-ws.nlm.nih.gov/services/nwsSecurity?wsdl