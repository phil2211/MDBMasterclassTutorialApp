# Search Fundamentals
In this video, I will show you how to use Atlas Search to build a search engine for your application. I will also explain the basics of how full text search works and how you can use it to build a search engine for your application.

Let's first compare a simple database query with a full text search query. In a simple query you are looking for a specific value in a specific field. For example, you want to find all customers with a total balance greater than 10'000. Full text search queries are different. They compare your search term against analyzed text.

Let's look at a concrete example:

Imagine you have a shop for mystical creatures and you want to build a search engine for your customers. You have a collection of products and each product has a title and description field. One example could look like this:

```json
{
    "_id": "5e9b4b9b0f5ae100179f0b1a",
    "title": "Rainbow-Hued Mane and Tail",
    "description": "With rainbow-hued mane and tail, this magical creature gallops across fields of green, leaving a trail of shimmering stardust in its wake.",
    "price": 10000,
    "stock": 1
}
```
If your customer is now searching for unicorns using the search terms "magic rainbow creature" in your shop, and your database only supports simple queries, how would that work?

Of course, you can try to use regular expressions or wildcards to search in the description, but it would not work, because the search term is not matching the description exactly. 

With full text search, you will find the product because it understands that the search term is a combination of the words "magic", "rainbow" and "creature".

But how is the search engine doing this? Let me walk you through the process of full text search.

## //Grafik
The text to be searched is passed through an analyzer. This produces a collection of individual tokens which are stored in an inversed index. A token is a fragment of the text, usually a single word or a derivation of a single word.

When you execute a query, it goes through the same analysis process and also generates a collection of individual tokens. Then it looks for matches in the tokens from the search term and the text to be searched. Depending on how many tokens match and in what order a score is calculated that is returned with the search result.

## //Grafik
An analyzer consists of three components: character filters, a tokenizer and token filters. The character filters and token filters are optional.

1. The character filters remove individual characters from the text that would be problematic in the search. For example, formatting characters or HTML tags.
2. As soon as all character filters have been processed, the resulting text is passed to the tokenizer. The tokenizer splits the text into individual tokens. Usually based on spaces or other special characters in the text. In addition, it determines the position of the tokens in the text. This information is important for special query types, as well as for highlighting hits in the search request. Each analyzer can use exactly one tokenizer.

3. The tokens produced by the tokenizer are sent to the last step, the token filters. The token filters modify, remove or add tokens. As with the character filters, multiple token filters can occur in an analyzer. Token filters usually convert tokens to lowercase, remove unwanted tokens such as stop words or perform a so-called stemming, which reduces words to their stem form.

Full text search is usually based on the Apache Lucene engine. Lucene is an open source search engine that is used in many applications. MongoDB has integrated Lucene into its Atlas Search service. Atlas Search combines the two technologies MongoDB and Lucene under a single, easy to use API for developers.

Enough theory, time to get your hands dirty.

As always, I take the MDB Masterclass Tutorial App as a basis. It is very easy to install and freely available on GitHub. The link is in the video description and on the top right there is a link to my setup tutorial if you missed it.

By the way, if you have not subscribed to my YouTube channel yet, please do so now. I regularly publish new videos on MongoDB and other topics related to the development of web applications.

## //Compass
To follow the tutorial, you will find the test data under /testData in the file "unicorns.json"

## //Atlas
Connect to your Atlas cluster. You will find the connection information if you click on the "connect" button here.

## //Compass
In Compass, create a new database called "Mythical" and in it a new collection called "BeastDescriptions".

In this collection, you can now load the test data from the file "testData/unicorns.json".

## //Atlas
In Atlas you can now create the search index. Choose your MyCustomers cluster and go to the Search tab. Here you can see the existing search index from the MDB Masterclass Tutorial App.

For this tutorial, however, you will create a completely new search index. Click on "CREATE INDEX" at the top right.

As a first step, you can choose between visual and JSON editor to create the search index. I recommend you to start with the visual editor. You can always switch to the JSON editor later.

In the next step, you have to give your index a name and select the collection that contains the data. I leave the name on "default" and select the just created "beastDescriptions" collection in the Mythical database.

In the last step, you need to assign an analyzer to each field you want to index. By default, the lucene.standard analyzer is used with a dynamic mapping. This means that all fields in our documents are processed with this analyzer and stored in the index.

Click on "Create Search Index" to create the index.

That's it. Now all documents in the beastDescriptions collection are indexed with the lucene standard analyzer and are ready for full text search. As I mentioned earlier, the query of the search index is possible with the same API as you would normally query your MongoDB. The index is also automatically kept in sync with the data in the collection. If you change or add a document, the index is updated automatically.

## //Compass
Time to test the index. I switch to Compass and open the "beastDescriptions" collection.

You can access the search index using the aggregation pipeline. To do this, switch to the "Aggregations" tab. I prefer to use the text editor here. In the text editor, you can enter the aggregation pipeline directly in JSON format.

The first stage of the aggregation pipeline is always the $search stage. This is where you define how you would like to query the index. In this case, I want to search for the term "magic rainbow creature" in the description field. I also want to see the score of the search result. This is the score that the search engine has calculated for the search result. The higher the score, the better the match.

```JSON
[
  {
    $search: {
      index: "default",
      text: {
        query: "magical rainbow creature",
        path: "description",
      },
    },
  },
  {
    $set: {
      score: {
        $meta: "searchScore",
      },
    },
  },
]
```

Take a look at the result. All our products are found, but the one that contains the most words in the same order will be displayed first.

Now let's try a phrase search. In this case all words must appear in the text. With the "slop" parameter you can define how many words can be in a different order. The default value is 0, which means that the words must appear in the same order.

```JSON
[
  {
    $search: {
      index: "default",
      phrase: {
        query: "magical rainbow creature",
        path: "description",
        slop: 10,
      },
    },
  },
  {
    $set: {
      score: {
        $meta: "searchScore",
      },
    },
  },
]
```

But what happens if we search for "magic rainbow creatures"? 

The search engine can not find anything because we use the plural form of "creature" in the search term. This can be fixed using a language specific analyzer that supports the so called stemming.

Have a quick look what happens to our text after processing by the lucene english analyzer.


## //Analyzer Website
As you can see, the word "creatures" is converted to "creature". This is called stemming. The analyzer also removes stop words like  "and", "of" and "the".

Let's quickly change this in our search definition...

## //Atlas Switch to German
It will take a few seconds for your search index to be updated. Don't worry, the old index will remain in place until the new index is fully built in the background. Your productive application can therefore continue to access the old index.

Let's see what happens now.
## //Compass
```JSON
[
  {
    $search: {
      index: "default",
      phrase: {
        query: "magic rainbow creatures",
        path: "description",
        slop: 10,
      },
    },
  },
  {
    $set: {
      score: {
        $meta: "searchScore",
      },
    },
  },
]
```

## //Summary
When you develop full text search, you have to find the balance between precision and fuzziness. It depends heavily on what your data looks like and what your users expect from the search. Atlas helps you here through its very simple implementation and API to quickly and safely find the right settings.

In this video I have only scratched the surface of what is possible with search. If you have a specific challenge for full text search, please let me know in the comments, I will be happy to address your specific challenges and maybe make a video about your challenge.

I hope this video has been useful to you and you have learned something. If you have any questions, you can leave me a comment or contact me on Twitter.

Until next time