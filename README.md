# Linktable

My personal link redirector and shortener using Airtable, powered by Vercel serverless functions :link:.

Basically, it just rewrites all requests to a Vercel API route, which fetches all the links from an Airtable table, then redirects the user to the appropriate URL and increments the visit counter for that link. 

Note: this isn't a very fast redirector because it sends two requests to airtable before each redirect. When I built this I thought I would be able to use Vercel caching to make redirects super-fast, but apparently Vercel [doesn't support caching 302 redirects](https://github.com/vercel/vercel/discussions/5794).

<!--All redirects have the Vercel `Cache-Control` header with [`stale-while-revalidate`](https://vercel.com/docs/edge-network/caching#stale-while-revalidate) set. This means that redirects will be cached at the Vercel edge and returned to users immediately when they visit the short link. Then, Vercel will send a request to the function to revalidate the cached response. Because this will be sent after every user's request (I think) it will ensure that their visit is counted and the link is kept up-to-date without slowing down the speed of the response (this would not be possible without `stale-while-revalidate`, as Vercel serverless functions terminate immediately upon response).

Additionally, make sure to visit the short link manually every time you update a link in Airtable to force an update of the cache.-->

## Installation steps:

If you want to redirect links from a sub-directory instead of a root domain, fork this repository and edit the rewrites in vercel.json.

#### Create an [Airtable](https://airtable.com/) table

**The table should have the following columns:**:
 + `slug` - string: the path to redirect from (**excluding domain, slash, and subdirectory**)
 + `url` - URL: the full URL to redirect to
 + `permanent` - checkbox (optional): if checked, the redirect will use HTTP code 301 for a permanent redirect. Browsers will cache this locally, so future clicks from the same visitor will never trigger the endpoint thus will not be counted.
 <!--+ `cache` - checkbox (optional): if checked, the redirect will be cached by Vercel for `CACHE_SECONDS` (as specified in the environment variables; default one hour) (this will prevent ALL visitors from being counted for the cache duration while it is checked)-->
 + `visits` - number (integer; optional): will be incremented each time someone visits the link

#### Host on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fscitronboy%2Flinktable&env=AIRTABLE_KEY,BASE_ID,TABLE_NAME,NO_VISIT_COUNT,ROOT_REDIRECT_URL,USE_ROOT_AS_FALLBACK&envDescription=Environment%20variables&envLink=https%3A%2F%2Fgithub.com%2Fscitronboy%2Flinktable%23environment-variables&project-name=my-linktable&repo-name=linktable)

##### Environment vairables

+ `AIRTABLE_KEY` - from your [account page](https://airtable.com/account)
+ `BASE_ID` - you can find this from the [API page](https://airtable.com/api) for your base
+ `TABLE_NAME` - the name of the table your links are stored in (Links for example)
+ `NO_VISIT_COUNT` - leave this empty to count visitors, fill it with anything to disable counting visitors
+ `ROOT_REDIRECT_URL` - where to redirect the root of your domain to (or whatever you put in vercel.json)
+ `USE_ROOT_AS_FALLBACK` - If this is set, unknown URL slugs will redirect to the ROOT_REDIRECT_URL instead of to the 404 page (leave blank to disable).

### Devlopment

To set up on Vercel, then run locally:
1. Install vercel CLI with `npm i -g vercel`
2. Sign in with `vercel login`
3. Run `vercel dev` to start locally

Put env vars in `.env`.

#### Coming later sometime

 + A automatic public listing of links
 + Custom 404 page
