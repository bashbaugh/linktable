const Airtable = require('airtable')

const table = new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base(process.env.BASE_ID)(process.env.TABLE_NAME)

module.exports = async (req, res) => {
  
  const slug = req.query.slug

  if (!slug && process.env.ROOT_REDIRECT_URL) return res.redirect(process.env.ROOT_REDIRECT_URL)

  const redirect = (await table.select({ filterByFormula: `{slug} = '${slug}'`}).firstPage().catch(console.error))[0]

  if (!redirect || !redirect.fields.url) return res.redirect(process.env.USE_ROOT_AS_FALLBACK ? process.env.ROOT_REDIRECT_URL : '/404')

  const { fields: { url, permanent, visits }, id } = redirect

  const status = permanent ? 301 : 302

  try {
    if (!process.env.NO_VISIT_COUNT) await table.update([{
      id,
      fields: {
        visits: (visits || 0) + 1
      }
    }]) 
  } finally {
    res.setHeader('Cache-Control', `s-maxage=0.1, stale-while-revalidate`) // Doesn't actually work with 302 redirects
    res.redirect(status, url)

    return
  }
}
