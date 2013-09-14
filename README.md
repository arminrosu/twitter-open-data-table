# Twitter Open Data Table

An [Open Data Table](http://www.datatables.org/) definition for use in [YQL](http://developer.yahoo.com/yql/).

Since twitter closed unauthenticated access to their API, getting a user's public stream is difficult to do in javascript. This is meant to make it a bit easier.

Originally developed for use in [jQuery Lifestream](https://github.com/christianv/jquery-lifestream).

## Usage

To get the recent tweets of [@neiltyson](https://twitter.com/neiltyson):

``` SQL
USE "http://arminrosu.github.io/twitter-open-data-table/table.xml" AS twitter;
SELECT * FROM twitter WHERE screen_name = "neiltyson"
```

View it in the [YQL Console](http://y.ahoo.it/I+P1W).

## Response Format

This table tries to emulate the twitter API as much as possible and return data, when available, in the same format as the [statuses/user_timeline](https://dev.twitter.com/docs/api/1/get/statuses/user_timeline) endpoint. Currently, this is format for a tweet:

``` JSON
{
	"id": "3.5210371347895091E17",
	"text": "Still trying to accept the fact that a pitcher for the Oakland  @Athletics  in Major League Baseball ( @MLB ) is named Balfour.",
	"created_at": "1372783041",
	"user": {
		"id": "1.9725644E7",
		"entities": {
			"user_mentions": [
				"Athletics",
				"MLB"
			]
		},
		"screen_name": "neiltyson",
		"name": "Neil deGrasse Tyson",
		"id_str": "19725644"
	},
	"id_str": "352103713478950912"
}
```

Please note, **dates are expressed in Unix Time**, not the non-standard Twitter format. This is for ease of usage. Also, numeric ID's are in scientific notation, due to YQL transformations.

## Additional Files

* *execute.js* - contains most of the code. For use in local development with [Mozilla Rhino](https://developer.mozilla.org/en/docs/Rhino). YQL supports xpath selectors (via the `y` object). Rhino doesn't, but supports more advanced [E4X](https://developer.mozilla.org/en-US/docs/E4X) selectors. Hence this file contains both selectors, where necessary.
* *results.html* - sample html containing the the results of the htmlQuery YQL query, for use in execute.js.

## Resources

Some helpful links to get you started:

* [Creating YQL Open Data Tables](http://developer.yahoo.com/yql/guide/yql_dev_guide.html)
* [E4X Quick Start Guide](http://wso2.com/project/mashup/0.2/docs/e4xquickstart.html)
* [Mozilla Developer Network E4X](https://developer.mozilla.org/en-US/docs/E4X)
* [Mozilla Rhino](https://developer.mozilla.org/en/docs/Rhino)
* [Open Data Table Lint](http://www.datatables.org/healthchecker/lint/) (not very useful but should be on your checklist)

## To Do

* Parse tweet text better / faster.

## License

Licensend under the [MIT License](http://opensource.org/licenses/MIT).
