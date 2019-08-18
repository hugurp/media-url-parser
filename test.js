import test from 'ava'
import {mediaUrlParser} from './index.js'
import {
	youtubeDict,
	fileDict,
	discogsDict,
	vimeoDict,
	soundcloudDict
} from './tests/provider-dictionaries'

function testUrl(t, item, provider) {
	let r = mediaUrlParser(item[0])
	t.is(r.provider, provider)
	t.is(r.id, item[1])
}

test('It does not throw when it cant detect a provider', t => {
	let r = mediaUrlParser('not-an-url')
	t.is(r.provider, 'file')
	t.is(r.id, null)
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

test('Discogs URL correctly parse the id', t => {
	t.plan(discogsDict.length * 2)

	discogsDict.forEach(item => {
		testUrl(t, item, 'discogs')
	})
})

test('Vimeo URL correctly parse the id', t => {
	t.plan(vimeoDict.length * 2)

	vimeoDict.forEach(item => {
		testUrl(t, item, 'vimeo')
	})
})

test('Soundcloud URL correctly parse the id', t => {
	t.plan(soundcloudDict.length * 2)

	soundcloudDict.forEach(item => {
		testUrl(t, item, 'soundcloud')
	})
})

test('Dat URL is parsed correctly', t => {
	let url = 'dat://18feb7b306912fccd726b42fb71e9d79c0d08036bbb7f5223eb672e05d211da3+preview//test.m4a'
	let r = mediaUrlParser(url)
	t.is(r.provider, 'file')
	t.is(r.id, 'test.m4a')
	t.is(r.url, url)
})

