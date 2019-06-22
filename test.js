import test from 'ava'
import {mediaUrlParser} from './index.js'
import {youtubeDict, fileDict, discogsDict, vimeoDict} from './tests/provider-dictionaries'

function testUrl(t, item, provider) {
	let r = mediaUrlParser(item[0])
	t.is(r.id, item[1])
	t.is(r.provider, provider)
}

test('It throws when it cant detect a provider', t => {
	t.throws(() => {
		testUrl(t, 'not-an-url', 'not a provider')
	})
})

test('object returned includes a normalized url property', t => {
	youtubeDict.forEach(item => {
		let r = mediaUrlParser(item[0])
		t.truthy(typeof r.url, 'string')
		t.is(r.url.includes(item[0]), true)
	})
})

/*
  Providers, check if they are correctly discovered in a url
*/

test('File URL correctly parse the provider', async t => {
	t.plan(fileDict.length * 2)

	fileDict.forEach(item => {
		testUrl(t, item, 'file')
	})
})

test('Youtube URL correctly parse the provider', t => {
	t.plan(youtubeDict.length * 2)

	youtubeDict.forEach(item => {
		testUrl(t, item, 'youtube')
	})
})

test('Discogs URL correctly parse the id correctly', t => {
	t.plan(discogsDict.length * 2)

	discogsDict.forEach(item => {
		testUrl(t, item, 'discogs')
	})
})

test('Vimeo URL correctly parse the id correctly', t => {
	t.plan(vimeoDict.length * 2)

	vimeoDict.forEach(item => {
		testUrl(t, item, 'vimeo')
	})
})
