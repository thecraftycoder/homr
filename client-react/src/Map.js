import React from 'react'
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from '@react-google-maps/api'
import { formatRelative } from 'date-fns'
import mapStyles from './mapstyles'
import secret from './secrets'

// globals
const mapContainerStyle = {
  // width: '100vw',
  // height: '100vh'
  width: '100%',
  height: '65vh'
}

// come back and set this to user's browser location
const center = {
  lat: 45.512230,
  lng: -122.658722
}

// the options that are presented on the page ie: zoom, map style
const options = {
  styles: mapStyles,
  disabledDefaultUI: true,
  zoomControl: true
}

// this is a locate component that will auto populate the map to your current location when pressed
function Locate ({ panTo }) {
  return (
    <button
      className='locate'
      // on click that calls the browsers geolocation with the built in hoot getCurrentPostion and calls the panTo function made above
      onClick={() => {
        navigator.geolocation.getCurrentPosition((position) => {
          panTo({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        () => null
        )
      }}
    >
      <img src='homr.png' alt='compass' />
    </button>
  )
}

export default function Map () {
  const { isLoaded, loadError } = useLoadScript({
    // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    googleMapsApiKey: secret.key
  })

  // this is the state of this component
  const [markers, setMarkers] = React.useState([])
  // the set state below makes it so you have access to the current one you click on. in this instance you can grab the lat long of that click
  const [selected, setSelected] = React.useState(null)

  // useCallback allows you to create a function that always retains the same value unless the properties passed inside the array change
  const onMapClick = React.useCallback((event) => {
    setMarkers((current) => [
      ...current,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date()
      }
    ])
  }, [])

  // the code below can be used to re render the map without causing hte state to be re rendered
  const mapRef = React.useRef()

  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map
  }, [])

  // this react hook uses creates a callback that you can use insted of writing it every time you want to use it
  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng })
    mapRef.current.setZoom(14)
  }, [])

  if (loadError) return 'Load Error loading Maps.'
  if (!isLoaded) return 'Loading..'

  return (
    <div>
      <h1 id='maph1'>Incidents by Districts</h1>
      <Locate panTo={panTo} />

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.time.toISOString()}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelected(marker)
            }}
          />
        ))}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            // this on close runs when the user clicks the x to close and re renders the state to null so the next location can populate
            onCloseClick={() => {
              setSelected(null)
            }}
          >
            <div>
              <h2>patient mark</h2>
              {/* takes two dates and spits out a nicly formated date time */}
              <p>placed at {formatRelative(selected.time, new Date())}</p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  )
}
