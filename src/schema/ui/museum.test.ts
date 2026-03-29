import { describe, expect, it } from 'vitest'
import { museumCreateFormDataSchema, parseAliases, parseScrapeUrls } from './museum'

describe('parseScrapeUrls', () => {
  it('returns trimmed URLs and drops empty lines', () => {
    expect(parseScrapeUrls(' https://a.example.com \n\nhttps://b.example.com  ')).toEqual([
      'https://a.example.com',
      'https://b.example.com',
    ])
  })
})

describe('parseAliases', () => {
  it('returns trimmed aliases and drops empty lines', () => {
    expect(parseAliases(' 東京都美術館 \n\nTokyo Metropolitan Art Museum  ')).toEqual([
      '東京都美術館',
      'Tokyo Metropolitan Art Museum',
    ])
  })
})

describe('museumCreateFormDataSchema', () => {
  const baseInput = {
    name: 'Test Museum',
    address: 'Tokyo',
    access: '5 min walk',
    openingInformation: '',
    venueType: '美術館',
    area: '上野',
    region: '東京',
    officialUrl: 'https://museum.example.com',
  }

  it('parses scrapeUrls into an array when scraping is enabled', () => {
    const parsed = museumCreateFormDataSchema.parse({
      ...baseInput,
      scrapeEnabled: 'true',
      scrapeUrls: 'https://museum.example.com/exhibitions\nhttps://museum.example.com/news',
    })

    expect(parsed.scrapeUrls).toEqual([
      'https://museum.example.com/exhibitions',
      'https://museum.example.com/news',
    ])
  })

  it('stores an empty array when scrapeUrls is omitted', () => {
    const parsed = museumCreateFormDataSchema.parse({
      ...baseInput,
      scrapeEnabled: 'true',
    })

    expect(parsed.scrapeUrls).toEqual([])
  })

  it('stores an empty array when aliases is omitted', () => {
    const parsed = museumCreateFormDataSchema.parse({
      ...baseInput,
      scrapeEnabled: 'true',
    })

    expect(parsed.aliases).toEqual([])
  })

  it('requires scrapeEnabled', () => {
    const parsed = museumCreateFormDataSchema.safeParse({
      ...baseInput,
      scrapeUrls: '',
    })

    expect(parsed.success).toBe(false)
    if (parsed.success) {
      return
    }

    expect(parsed.error.issues.find((issue) => issue.path[0] === 'scrapeEnabled')).toBeDefined()
  })
})
