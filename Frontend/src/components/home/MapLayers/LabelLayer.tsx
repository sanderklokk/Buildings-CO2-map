import { TileLayer } from 'react-leaflet'

export const LabelLayer = () => {
    return  <TileLayer url='https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png'
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains='abcd'
            maxZoom={20}
            
            zIndex={5}
        
          />
        
     
}