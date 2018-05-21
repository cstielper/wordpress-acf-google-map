# WordPress/ACF Google Map
![Version 1.0.0](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)

JavaScript ES6 class that uses the Google Maps API, WordPress REST API, and the Advanced Custom Fields WordPress plugin to create a Google Map. Features include configurable map options, landmark categories and directions.

Follow the steps below to get started:

## Install Required Plugins
NOTE: The included [JSON file](acf-fields.json) to import into Advanced Custom fields is for use with the pro version of the plugin.

1. [Advanced Custom Fields](https://www.advancedcustomfields.com/) 
2. [ACF to Rest API](https://wordpress.org/plugins/acf-to-rest-api/)
3. [Radio Buttons for Taxonomies](https://wordpress.org/plugins/radio-buttons-for-taxonomies/)

## Create Custom Post Type and Taxonomy
Add this to your theme's functions.php file (or use any other method that allows you to include it in your theme). Don't forget to prefix your function names, add your theme's text-domain, and to flush your permalinks:

~~~~
<?php
function YOUR_FUNCTION_PREFIX_create_custom_posts() {
  $labels = array(
    'name'                  => _x( 'Area Landmarks', 'Post Type General Name', 'text_domain' ),
    'singular_name'         => _x( 'Area Landmark', 'Post Type Singular Name', 'text_domain' ),
    'menu_name'             => __( 'Area Landmarks', 'text_domain' ),
    'name_admin_bar'        => __( 'Area Landmarks', 'text_domain' ),
    'archives'              => __( 'Item Archives', 'text_domain' ),
    'parent_item_colon'     => __( 'Parent Item:', 'text_domain' ),
    'all_items'             => __( 'All Landmarks', 'text_domain' ),
    'add_new_item'          => __( 'Add New Landmark', 'text_domain' ),
    'add_new'               => __( 'Add New Landmark', 'text_domain' ),
    'new_item'              => __( 'New Landmark', 'text_domain' ),
    'edit_item'             => __( 'Edit Landmark', 'text_domain' ),
    'update_item'           => __( 'Update Landmark', 'text_domain' ),
    'view_item'             => __( 'View Landmark', 'text_domain' ),
    'search_items'          => __( 'Search Landmarks', 'text_domain' ),
    'not_found'             => __( 'Not found', 'text_domain' ),
    'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
    'featured_image'        => __( 'Featured Image', 'text_domain' ),
    'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
    'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
    'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
    'insert_into_item'      => __( 'Insert into item', 'text_domain' ),
    'uploaded_to_this_item' => __( 'Uploaded to this item', 'text_domain' ),
    'items_list'            => __( 'Items list', 'text_domain' ),
    'items_list_navigation' => __( 'Items list navigation', 'text_domain' ),
    'filter_items_list'     => __( 'Filter items list', 'text_domain' ),
  );
  $args = array(
    'label'                 => __( 'Area Landmark', 'text_domain' ),
    'description'           => __( 'Post Type Description', 'text_domain' ),
    'labels'                => $labels,
    'supports'              => array( 'title', 'revisions', ),
    'taxonomies'            => array( 'landmark_types' ),
    'hierarchical'          => false,
    'public'                => true,
    'show_ui'               => true,
    'show_in_menu'          => true,
    'menu_position'         => 20,
    'menu_icon'             => 'dashicons-location',
    'show_in_admin_bar'     => false,
    'show_in_nav_menus'     => false,
    'can_export'            => true,
    'has_archive'           => false,		
    'exclude_from_search'   => true,
    'publicly_queryable'    => true,
    'capability_type'       => 'post',
    'show_in_rest'			=> true,
  );
  register_post_type( 'area_landmarks', $args );

}
add_action( 'init', 'YOUR_FUNCTION_PREFIX_create_custom_posts', 0 );

function YOUR_FUNCTION_PREFIX_create_custom_taxonomies() {
  $labels = array(
    'name'                       => _x( 'Landmark Types', 'Taxonomy General Name', 'text_domain' ),
    'singular_name'              => _x( 'Landmark Type', 'Taxonomy Singular Name', 'text_domain' ),
    'menu_name'                  => __( 'Landmark Types', 'text_domain' ),
    'all_items'                  => __( 'All Landmark Types', 'text_domain' ),
    'parent_item'                => __( 'Parent Item', 'text_domain' ),
    'parent_item_colon'          => __( 'Parent Item:', 'text_domain' ),
    'new_item_name'              => __( 'New Landmark Type', 'text_domain' ),
    'add_new_item'               => __( 'Add New Landmark Type', 'text_domain' ),
    'edit_item'                  => __( 'Edit Landmark Type', 'text_domain' ),
    'update_item'                => __( 'Update Landmark Type', 'text_domain' ),
    'view_item'                  => __( 'View Landmark Type', 'text_domain' ),
    'separate_items_with_commas' => __( 'Separate items with commas', 'text_domain' ),
    'add_or_remove_items'        => __( 'Add or remove items', 'text_domain' ),
    'choose_from_most_used'      => __( 'Choose from the most used', 'text_domain' ),
    'popular_items'              => __( 'Popular Items', 'text_domain' ),
    'search_items'               => __( 'Search Items', 'text_domain' ),
    'not_found'                  => __( 'Not Found', 'text_domain' ),
    'no_terms'                   => __( 'No items', 'text_domain' ),
    'items_list'                 => __( 'Items list', 'text_domain' ),
    'items_list_navigation'      => __( 'Items list navigation', 'text_domain' ),
  );
  $args = array(
    'labels'                     => $labels,
    'hierarchical'               => true,
    'public'                     => true,
    'show_ui'                    => true,
    'show_admin_column'          => true,
    'show_in_nav_menus'          => false,
    'show_tagcloud'              => false,
    'show_in_rest'				=> true,
  );
  register_taxonomy( 'landmark_types', array( 'area_landmarks' ), $args );

}
add_action( 'init', 'YOUR_FUNCTION_PREFIX_create_custom_taxonomies', 0 );
?>
~~~~

## Setup Plugin Options
### Advanced Custom Fields
Import the [JSON file](acf-fields.json) into Advanced Custom Fields.

### Radio Buttons For Taxonomies
Go to Settings --> Radio Buttons for Taxonomies from the WordPress Dashboard and check the option for "Landmark Types."

Add this to your functions.php file to remove the "None" option for Radio Buttons for Taxonomies:
~~~~
<?php
// Remove option for no type from radio button for taxonomies plugin
add_filter('radio_buttons_for_taxonomies_no_term_landmark_types', '__return_FALSE' );
?>
~~~~

## Usage
### HTML Markup
~~~~
<div id="map-wrapper">
  <div id="map-canvas"></div>
</div>
~~~~

### Include the JS class
~~~~
<script src="path/to/the/JS/class/wp-acf-map.class.min.js"></script>
~~~~

### Javascript Implementation
Instantiate the JS class and pass in an object with your options:
~~~~
var mapStyles = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      { saturation: -75 },
      { color: '#aed4f3' },
      { lightness: 35 }
    ]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      { color: '#d0d1d2' }
    ]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      { color: '#f1f1f1' }
    ]
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      { color: '#dcd9d4' }
    ]
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{
      visibility: "off"
    }]
  },
  {
    featureType: 'transit',
    elementType: 'labels',
    stylers: [{
      visibility: "off"
    }]
  }
];

var options = {
  apiKey: 'YOUR_API_KEY_FROM_GOOGLE',
  mapWrapper: document.getElementById('map-wrapper'),
  mapContainer: document.getElementById('map-canvas'),
  mapOptions: {
    centerLat: 39.284053,
    centerLng: -76.619898,
    zoom: 14,
    customMapStyles: mapStyles,
    mapTypeControl: true,
    scrollWheel: true,
    panControl: true,
    rotateControl: true,
    streetViewControl: true,
    zoomControl: true
  },
  markerOptions: {
    markersImgPath: '/path/to/your/icon/image/files/',
    addCenterMarker: true,
    centerMarkerImg: 'custom-icon-image-name.png',
    centerMarkerWidth: 55,
    centerMarkerHeight: 55,
    centerMarkerInfoWindowContent: '<strong class="window-heading">Hello</strong><br>This should be some text.<br>Another line of text.',
    addMarkers: true,
    markersEndpoint: '/wp-json/wp/v2/area_landmarks?per_page=100',
    customCatMarkers: false,
    customSingleMarkers: true,
    customMarkerImg: 'custom-icon-image-name.png',
    customMarkerWidth: 35,
    customMarkerHeight: 35
  },
  categoryOptions: {
    addCategoryNav: true,
    categoriesEndpoint: '/wp-json/wp/v2/landmark_types',
    addCategoryCount: true
  },
  directionsOptions: {
    addDirections: true,
    endingAddress: '333 W Camden Street, Baltimore, MD 21201',
    showFieldLabels: true,
    startFieldLabel: 'Enter Your Starting Address:',
    startFieldPlaceholder: 'Enter Your Starting Address',
    buttonText: 'Directions'
  },
  resetOptions: {
    addResetButton: true,
    resetButtonText: 'Reset'
  }
}

var myMap = new WP_Map(options);
myMap.init();
~~~~

## Description of Options
### Base options

1. **apiKey** - Google Map API Key  
*Required | Type: String | Default: null*
2. **mapWrapper** - DOM element that holds the map and additional components  
*Required | Type: Object | Default: document.getElementById('map-wrapper')*
3. **mapContainer** - DOM element that holds the map  
*Required | Type: Object | Default: document.getElementById('map-canvas')*

### Map Options

1. **centerLat** - Latitude for map center  
*Required | Type: Number | Default: 39.130107*
2. **centerLng** - Longitude for map center  
*Required | Type: Number | Default: -76.792481*
3. **customMapStyles** - Custom styles to be used by the Google Maps API  
*Optional | Type: JSON | Default: null | [Reference](https://developers.google.com/maps/documentation/javascript/style-reference)* 
4. **mapTypeControl** - Adds Google Map Type Control to the map  
*Optional | Type: Boolean | Default: false*
5. **scrollWheel** - Adds scroll wheel functionality to the map  
*Optional | Type: Boolean | Default: false*
6. **panControl** - Adds Google Map Pan Control to the map  
*Optional | Type: Boolean | Default: false*
7. **rotateControl** - Adds Google Map Rotate Control to the map  
*Optional | Type: Boolean | Default: false*
8. **streetViewControl** - Adds Google Map Street View Control to the map  
*Optional | Type: Boolean | Default: false*
9. **zoomControl** - Adds Google Map Zoom Control to the map  
*Optional | Type: Boolean | Default: false*
10. **zoom** - Initial zoom level of the map  
*Optional | Type: Number | Default: 15 | Note: this has no effect if "zoomControl" option is set to false*

### Marker Options

1. **markersImgPath** - The path to your custom maker images  
*Optional (required if setting any custom marker option to true) | Type: String | Default: null*
2. **addCenterMarker** - Adds a marker showing the center point of the map  
*Optional | Type: Boolean | Default: true*
3. **centerMarkerImg** - Adds a custom marker to the center point of the map  
*Optional | Type: String | Default: null | Note: If this option is omitted/null and the "addCenterMarker" option is set to true, the default Google balloon will be used as the marker*
4. **centerMarkerWidth** - Width of the custom center marker image  
*Optional | Type: Number | Default: 60*
5. **centerMarkerHeight** - Height of the custom center marker image  
*Optional | Type: Number | Default: 60*
6. **centerMarkerInfoWindowContent** - HTML to be displayed in the center marker's Google Map info window  
*Optional | Type: String | Default: null*
7. **addMarkers** - Adds additional markers to the map using the "area_landmarks" custom post type  
*Optional | Type: Boolean | Default: false*
8. **markersEndpoint** - Endpoint for the "area_landmarks" custom post type in the WordPress REST API  
*Optional (required if "addMarkers" option is set to true) | Type: String | Default: null*
9. **customCatMarkers** - Adds custom category markers based on the taxonomy (landmark_type) ID that the landmark is assigned to. A .png image must be used and the image should be named as: "cat-[ID].png"  
*Optional | Type: Boolean | Default: false* 
10. **customSingleMarkers** - Adds an icon for all landmarks regardless of category  
*Optional | Type: Boolean | Default: false*
11. **customMarkerImg** - The image to be used when "customSingleMarkers" is set to true  
*Optional | Type: String | Default: null | Note: If this option is omitted/null and the "customSingleMarkers" option is set to true, the default Google balloon will be used for the markers*
12. **customMarkerWidth** - Width of the custom marker images  
*Optional | Type: Number | Default: 40*
13. **customMarkerHeight** - Height of the custom marker images  
*Optional | Type: Number | Default: 40*

*NOTE: If "customCatMarkers" and "customSingleMarkers" are both set to true, the "customSingleMarkers" option will take precedence.*

### Category Options

1. **addCategoryNav** - Adds category navigation to toggle markers in that category on/off on the map  
*Optional | Type: Boolean | Default: false*
2. **categoriesEndpoint** - Endpoint for the "landmark_types" custom taxonomy in the WordPress REST API  
*Optional (required if "addCategoryNav" option is set to true) | Type: String | Default: null* 
3. **addCategoryCount** - Adds a count of how many markers are in each category  
*Optional | Type: Boolean | Default: false*

### Directions Options

1. **addDirections** - Adds a directions form for users to get driving directions from their specified location  
*Optional | Type: Boolean | Default: false*
2. **endingAddress** - Specify a custom address for the end of the directions route  
*Optional | Type: String | Default: null | Note: If this option is omitted/null then the end route will be the "centerLat"/"centerLng" options*
3. **showFieldLabels** - Adds a label to the "start" field in the directions form  
*Optional | Type: Boolean | Default: true*
4. **startFieldLabel** - Customize the text for the "start" field label  
*Optional | Type: String | Default: "Starting Address:"*
5. **startFieldPlaceholder** - Adds placeholder text to the "start" field input  
*Optional | Type: String | Default: null* 
6. **buttonText** - Customize the text for the submit button of the directions form  
*Optional | Type: String | Default: "Get Directions"*

### Reset Options

1. **addResetButton** - Adds a reset button to reset the map to its initial state after a user selects a category or gets directions  
*Optional | Type: Boolean | Default: false* 
2. **resetButtonText** - Customize the text of the reset button  
*Optional | Type: String | Default: "Reset Map"*

## Demo
Download the files in the [demo folder](demo/) and add your registered Google Maps API key. Sample JSON responses have been provided in the demo file.