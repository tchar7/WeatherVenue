import { LIS } from "./lis.js"
import { picturesLangs } from "../models/translations.js"
import { state } from "../state.js"

// Get pictures for searched place
/**
 * new state.google.maps.places.PlacesService
 * populate pictures on featured_pictures div
 */
 export const getPicture = (place) => {
    const [success, fail] = picturesLangs(state.language)
    LIS.id('imgGrid').innerHTML = ''
    let cache = localStorage.getItem(`wv:${place}`)
    if (cache) {
        cache = JSON.parse(cache)
        for (let i = 0; i < cache.photos.length; i++) {
            LIS.id('imgGrid').innerHTML += '<div class="featured_pictures"><img src="' + cache.photos[i] + '" alt="' + cache.names[i] + '" /></div>'
        }
        return
    }
    const service = new state.google.maps.places.PlacesService(state.map)
    const request = {
        location: state.map.getCenter(),
        radius: '3000',
        query: place,
        //, 'mosque', 'airport', 'amusement_park', 'art_gallery', 'casino', 'church', 'museum', 'park', 'synagogue',
        // 'tourist_attraction', 'university'
        type: ['park'],
    }
    let called = false
    service.nearbySearch(request, callback)
    // Checks that the PlacesServiceStatus is OK, and adds a marker
    // using the place ID and location from the PlacesService.
    function callback(results, status) {
        if (called) {
            return
        }
        called = true
        LIS.id('gallery').innerHTML = success(place)
        if (status === state.google.maps.places.PlacesServiceStatus.OK) {
            const photos = results
                .map((elem) => {
                    return elem.photos ? elem.photos[0].getUrl() : undefined
                })
                .filter((elem) => {
                    return elem
                })
            const names = results.map((elem) => {
                return elem.name
            })
            if (!photos.length) {
                LIS.id('gallery').innerHTML = fail(place)
                return
            }
            localStorage.setItem(`wv:${place}`, JSON.stringify({ photos: photos, names: names }))
            for (let i = 0; i < photos.length; i++) {
                LIS.id('imgGrid').innerHTML +=
                    '<div class="featured_pictures"><img src="' + photos[i] + '" alt="' + names[i] + '" /></div>'
            }
        } else {
            LIS.id('gallery').innerHTML = fail(place)
        }
    }
}
