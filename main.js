import youtubeRegex from 'youtube-regex'
import providersList from './src/providers'

const youtubeUrlToId = (url) => {
	const results = youtubeRegex().exec(url)
	if (!results) {
		return false
	}
	return results[1]
}

const fileUrlToId = (url) => {
	let result = new URL(url)
	let s = result.pathname.split('/')
	return s[s.length - 1]
}

const discogsUrlToId = (url) => {
  // https://regexr.com/3i5fa
  let discogsReleaseRegex = /([0-9]+(?:$|(?=\?)|(?=\/$)))/gm
  let result = discogsReleaseRegex.exec(url)
  if (!result) {
		throw new Error('Could not find id from Discogs URL')
  }
  return result[0]
}
const vimeoUrlToId = (url) => {
	// cool it works without the need of a custom parser!
  return fileUrlToId(url)
}
const soundcloudUrlToId = (url) => {
	const getId = (url) => {
		let result = new URL(url)
		// remove first slash
		let s = result.pathname.slice(1)
		return s
	}
	const id = getId(url)
	return id
}

const findId = (url, provider) => {
	if(!provider) return null

	let methods = {
		youtube: (url) => youtubeUrlToId(url),
		file: (url) => fileUrlToId(url),
		discogs: (url) => discogsUrlToId(url),
		vimeo: (url) => vimeoUrlToId(url),
		soundcloud: (url) => soundcloudUrlToId(url)
  }

	let extractMethod = methods[provider]
	if (typeof extractMethod !== 'function') return null

	let extractedId = extractMethod(url)

	if (!extractedId) return null

	return extractedId
}

const findProvider = (url) => {
	let hostId;
	try {
		hostId = extractHostId(new URL(url).host)
	} catch(error) {
		console.error('Cannot find provider from url', url, error)
	}

	// from the hostId, find the provider id
	// and fallback to file.
	const hostExsists = providersList[hostId]
	if (hostExsists) {
		return providersList[hostId]
	} else {
		return 'file'
	}
}

const extractHostId = (host) => {
	let els = host.split('.')

	// If it's an IP address, host should be undefined.
	if (Number(els.join(''))) {
		return null
	}

	// else return the two last elements of the array,
	// the top domain name and its extension
	return els
		.slice(els.length - 2, els.length)
		.join('.')
}

// enforces the presence of a `host` in the url
const normalizeUrl = (url) => {
	// triiim it one last time
	url = url.trim()
	if (!url.startsWith('http') && !url.startsWith('dat')) {
		url = `https://${url}`
	}
	return url
}

const mediaUrlParser = (inputUrl) => {
	// 0. normalize url, so it can be parsed homogenously
	const url = normalizeUrl(inputUrl)
	let id;

	// 1. detect which provider's url it is
	let provider = findProvider(url)

	if (!provider) {
		console.info('Could not detect a known provider: %s', url)
	} else {
		// 2. in this provider url, find a media `id`
		id = findId(url, provider)
		if (!id) {
			console.info('Could not detect id from: %s', url)
		}
	}

	// 3. return a result object
	return { url, provider, id }
}

export {
	mediaUrlParser
}
