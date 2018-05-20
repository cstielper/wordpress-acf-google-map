import 'whatwg-fetch';
import 'promise-polyfill';
import './modules/polyfill-array-from';
import './modules/polyfill-foreach';

class WP_Map {
  constructor({
    apiKey,
    mapWrapper = document.getElementById('map-wrapper'),
    mapContainer = document.getElementById('map-canvas'),
    mapOptions: {
      centerLat = 39.130107,
      centerLng = -76.792481,
      zoom = 15,
      mapTypeControl = false,
      scrollWheel = false,
      panControl = false,
      rotateControl = false,
      streetViewControl = false,
      zoomControl = false,
      customMapStyles
    } = {},
    markerOptions: {
      addCenterMarker = true,
      addMarkers = false,
      customCatMarkers = false,
      customSingleMarkers = false,
      markersImgPath,
      centerMarkerImg,
      centerMarkerHeight = 60,
      centerMarkerWidth = 60,
      centerMarkerInfoWindowContent,
      customMarkerImg,
      customMarkerWidth = 40,
      customMarkerHeight = 40,
      markersEndpoint
    } = {},
    categoryOptions: {
      addCategoryNav = false,
      addCategoryCount = false,
      categoriesEndpoint
    } = {},
    directionsOptions: {
      addDirections = false,
      endingAddress = null,
      showFieldLabels = true,
      startFieldLabel = null,
      startFieldPlaceholder = null,
      buttonText = null
    } = {},
    resetOptions: {
      addResetButton = false,
      resetButtonText = 'Reset Map'
    } = {},
    locations = [],
    markers = [],
    infoWindow = null,
    directionsService = null,
    directionsDisplay = null,
    resetBtn
  } = {}) {
    (this.apiKey = apiKey),
    (this.mapWrapper = mapWrapper),
    (this.mapContainer = mapContainer),
    (this.mapOptions = {
      centerLat,
      centerLng,
      zoom,
      mapTypeControl,
      scrollWheel,
      panControl,
      rotateControl,
      streetViewControl,
      zoomControl,
      customMapStyles
    }),
    (this.markerOptions = {
      addCenterMarker,
      addMarkers,
      customCatMarkers,
      customSingleMarkers,
      markersImgPath,
      centerMarkerImg,
      centerMarkerWidth,
      centerMarkerHeight,
      centerMarkerInfoWindowContent,
      customMarkerImg,
      customMarkerWidth,
      customMarkerHeight,
      markersEndpoint
    }),
    (this.categoryOptions = {
      addCategoryNav,
      addCategoryCount,
      categoriesEndpoint
    }),
    (this.directionsOptions = {
      addDirections,
      endingAddress,
      showFieldLabels,
      startFieldLabel,
      startFieldPlaceholder,
      buttonText
    }),
    (this.resetOptions = {
      addResetButton,
      resetButtonText
    }),
    (this.locations = locations),
    (this.markers = markers),
    (this.infoWindow = infoWindow),
    (this.directionsService = directionsService),
    (this.directionsDisplay = directionsDisplay),
    (this.resetBtn = resetBtn);
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      if (this.mapWrapper && this.mapContainer && this.apiKey) {
        let lang;
        document.querySelector('html').lang
          ? (lang = document.querySelector('html').lang)
          : (lang = 'en');

        const mapJsFile = document.createElement('script');
        mapJsFile.type = 'text/javascript';
        mapJsFile.src = `https://maps.googleapis.com/maps/api/js?key=${
          this.apiKey
        }&callback=buildMap&language=${lang}`;
        document.querySelector('body').appendChild(mapJsFile);
      } else if (!this.mapWrapper) {
        console.error('Map wrapper DOM element not found.');
      } else if (!this.mapContainer) {
        console.error('Map container DOM element not found.');
      } else if (!this.apiKey) {
        console.error('API key not found.');
      }
    });

    window.buildMap = this.buildMap.bind(this);
  }

  buildMap() {
    const mapStyles = this.mapOptions.customMapStyles
      ? this.mapOptions.customMapStyles
      : null;

    const map = new google.maps.Map(this.mapContainer, {
      center: {
        lat: this.mapOptions.centerLat,
        lng: this.mapOptions.centerLng
      },
      styles: mapStyles,
      zoom: this.mapOptions.zoom,
      mapTypeControl: this.mapOptions.mapTypeControl,
      scrollwheel: this.mapOptions.scrollWheel,
      panControl: this.mapOptions.panControl,
      rotateControl: this.mapOptions.rotateControl,
      streetViewControl: this.mapOptions.streetViewControl,
      zoomControl: this.mapOptions.zoomControl,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      }
    });

    this.infoWindow = new google.maps.InfoWindow();
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.directionsDisplay.setMap(map);

    if (this.markerOptions.addCenterMarker) {
      this.addCenterMarker(map);
    }

    if (this.markerOptions.addMarkers) {
      if (!this.markerOptions.markersEndpoint) {
        console.error('You must enter an endpoint to your marker data.');
      } else {
        this.fetchMarkerData(map);
      }
    }

    if (this.categoryOptions.addCategoryNav) {
      if (!this.categoryOptions.categoriesEndpoint) {
        console.error('You must enter an endpoint to your category data.');
      } else if (!this.markerOptions.addMarkers) {
        console.error('You should have categorized markers enabled.');
      } else {
        this.fetchCategoryData(map);
      }
    }

    if (this.directionsOptions.addDirections) {
      this.createDirectionsForm(map);
    }

    if (this.resetOptions.addResetButton) {
      this.createResetBtn(map);
    }
  }

  addCenterMarker(map) {
    let centerMarkerIcon = null;
    if (
      this.markerOptions.markersImgPath &&
      this.markerOptions.centerMarkerImg
    ) {
      centerMarkerIcon = {
        url:
          this.markerOptions.markersImgPath +
          this.markerOptions.centerMarkerImg,
        scaledSize: new google.maps.Size(
          this.markerOptions.centerMarkerWidth,
          this.markerOptions.centerMarkerHeight
        ), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(
          this.markerOptions.centerMarkerWidth * 0.5,
          this.markerOptions.centerMarkerHeight * 0.5
        ) // anchor
      };
    }

    let centerMarkerText = this.markerOptions.centerMarkerInfoWindowContent
      ? this.markerOptions.centerMarkerInfoWindowContent
      : null;

    const centerMarker = new google.maps.Marker({
      position: {
        lat: this.mapOptions.centerLat,
        lng: this.mapOptions.centerLng
      },
      map: map,
      zIndex: 1000,
      icon: centerMarkerIcon,
      html: centerMarkerText
    });

    if (this.markerOptions.centerMarkerInfoWindowContent) {
      centerMarker.addListener('click', () => {
        if (this.infoWindow != null) {
          this.infoWindow.close();
        }

        this.infoWindow.setContent(centerMarker.html);
        this.infoWindow.open(map, centerMarker);
      });
    }
  }

  fetchMarkerData(map) {
    fetch(this.markerOptions.markersEndpoint)
      .then(data => data.json())
      .then(data => this.addMarkers(map, data))
      .catch(err => console.error(err));
  }

  addMarkers(map, data) {
    data.forEach((item, index) => {
      let title = item.title.rendered;
      let add = item.acf.address;
      let add2 = item.acf.address_2;
      let phone = item.acf.phone;
      let website = item.acf.website;
      let details = item.acf.additional_details;
      let latitude = parseFloat(item.acf.latitude);
      let longitude = parseFloat(item.acf.longitude);
      let category = 'cat-' + item.landmark_types[0];

      if (title !== '') {
        title = '<strong class="window-heading">' + title + '</strong>';
      } else {
        title = '';
      }

      if (add !== '') {
        add = '<br>' + add;
      } else {
        add = '';
      }

      if (add2 !== '') {
        add2 = '<br>' + add2;
      } else {
        add2 = '';
      }

      if (phone !== '') {
        phone = '<br>' + phone;
      } else {
        phone = '';
      }

      if (website !== '') {
        website =
          '<br><a target="_blank" href="' + website + '">Website &raquo;</a>';
      } else {
        website = '';
      }

      if (details !== '') {
        details = '<br><br>' + details;
      } else {
        details = '';
      }

      this.locations.push({
        index,
        title,
        latitude,
        longitude,
        add,
        add2,
        phone,
        website,
        details,
        category
      });
    });

    let icon = {
      scaledSize: new google.maps.Size(
        this.markerOptions.customMarkerWidth,
        this.markerOptions.customMarkerHeight
      ), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(
        this.markerOptions.customMarkerWidth * 0.5,
        this.markerOptions.customMarkerHeight * 0.5
      ) // anchor
    };

    this.locations.forEach(item => {
      if (
        this.markerOptions.customSingleMarkers &&
        this.markerOptions.customMarkerImg
      ) {
        icon.url =
          this.markerOptions.markersImgPath +
          this.markerOptions.customMarkerImg;
      } else if (this.markerOptions.customCatMarkers) {
        icon.url = this.markerOptions.markersImgPath + item.category + '.png';
      } else {
        icon = null;
      }

      let marker = new google.maps.Marker({
        position: {
          lat: item.latitude,
          lng: item.longitude
        },
        map: map,
        icon: icon,
        html: `${item.title}
          ${item.add}
          ${item.add2}
          ${item.phone}
          ${item.website}
          ${item.details}`
      });
      this.markers.push(marker);
      this.openInfoWindow(marker, map);
    });
  }

  openInfoWindow(marker, map) {
    marker.addListener('click', () => {
      if (this.infoWindow != null) {
        this.infoWindow.close();
      }

      this.infoWindow.setContent(marker.html);
      this.infoWindow.open(map, marker);
    });
  }

  fetchCategoryData(map) {
    fetch(this.categoryOptions.categoriesEndpoint)
      .then(data => data.json())
      .then(data => this.addCategoryNav(map, data))
      .catch(err => console.error(err));
  }

  addCategoryNav(map, data) {
    const catNav = document.createElement('nav');
    catNav.id = 'map-nav';
    const catNavUl = document.createElement('ul');
    catNav.appendChild(catNavUl);
    this.mapWrapper.appendChild(catNav);

    data.forEach(item => {
      if (item.count > 0) {
        const listItem = document.createElement('li');
        listItem.id = 'cat-' + item.id;
        listItem.classList.add(item.slug);

        const listItemHref = document.createElement('a');
        listItemHref.href = '#';

        listItemHref.innerHTML = !this.categoryOptions.addCategoryCount
          ? item.name
          : `<span class="count">${item.count}</span>${item.name}`;
        listItem.appendChild(listItemHref);
        catNavUl.appendChild(listItem);

        this.toggleCats(
          listItemHref,
          catNavUl,
          this.locations,
          this.markers,
          this.infoWindow,
          this.resetBtn
        );
      }
    });

    document.querySelector('body').classList.add('has-map-cat-nav');
  }

  toggleCats(href, ul, locations, markers, infoWindow, resetBtn) {
    href.addEventListener('click', function(evt) {
      evt.preventDefault();
      if (infoWindow != null) {
        infoWindow.close();
      }
      const cat = this.parentElement.getAttribute('id');

      locations.forEach((item, index) => {
        if (item.category === cat) {
          markers[index].setVisible(true);
          markers[index].setOptions({ zIndex: 1100 });
        } else if (item.category !== cat) {
          markers[index].setVisible(false);
        }
      });

      const children = Array.from(ul.children);
      children.forEach(item => {
        item.firstChild.classList.remove('active');
      });

      this.classList.add('active');
      if (resetBtn) {
        resetBtn.classList.add('active');
      }
    });
  }

  createDirectionsForm(map) {
    const endpoint = this.directionsOptions.endingAddress
      ? this.directionsOptions.endingAddress
      : `${this.mapOptions.centerLat}, ${this.mapOptions.centerLng}`;

    let label = '';
    if (this.directionsOptions.showFieldLabels) {
      this.directionsOptions.startFieldLabel
        ? (label = this.directionsOptions.startFieldLabel)
        : (label = 'Starting Address:');
    }

    const placeholder = this.directionsOptions.startFieldPlaceholder
      ? this.directionsOptions.startFieldPlaceholder
      : '';

    const btnTxt = this.directionsOptions.buttonText
      ? this.directionsOptions.buttonText
      : 'Get Directions';

    const directionsForm = document.createElement('form');
    directionsForm.id = 'get-directions';
    directionsForm.innerHTML = `
      <label>${label}<input id="start" type="text" placeholder="${placeholder}"></label>
      <input id="end" value="${endpoint}" type="hidden">
      <div id="map-response-panel"></div>
      <input value="${btnTxt}" type="submit">
    `;

    this.mapWrapper.appendChild(directionsForm);

    directionsForm.addEventListener('submit', evt => {
      this.calcRoute(directionsForm, map);
      evt.preventDefault();
    });

    document.querySelector('body').classList.add('has-map-directions');
  }

  calcRoute(form, map) {
    const start = form[0].value;
    const end = form[1].value;
    const responsePanel = form.children.namedItem('map-response-panel');
    const request = {
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    };

    if (start === '') {
      responsePanel.innerHTML = 'Please enter a starting address';
      responsePanel.classList.add('active');
      responsePanel.classList.add('error');
    } else {
      this.directionsDisplay.setPanel(responsePanel);
      this.directionsService.route(request, (result, status) => {
        responsePanel.classList.remove('error');
        responsePanel.classList.remove('active');
        if (status === 'OK') {
          responsePanel.classList.add('active');
          responsePanel.innerHTML = '';
          this.directionsDisplay.setDirections(result);
          this.directionsDisplay.setMap(map);
          if (this.resetBtn) {
            this.resetBtn.classList.add('active');
          }
        } else {
          responsePanel.innerHTML = `We're sorry, but an error occurred: <span>${status}</span>.<br>Please check your starting address and try again.`;
          responsePanel.classList.add('error');
          responsePanel.classList.add('active');
        }
      });
    }
  }

  createResetBtn(map) {
    this.resetBtn = document.createElement('button');
    this.resetBtn.id = 'map-reset-btn';
    this.resetBtn.textContent = this.resetOptions.resetButtonText
      ? this.resetOptions.resetButtonText
      : 'Reset Map';
    this.mapWrapper.appendChild(this.resetBtn);

    window.resetMap = this.resetMap.bind(this);

    this.resetBtn.addEventListener('click', function() {
      resetMap(map, this);
    });
  }

  resetMap(map, btn) {
    this.markers.forEach(item => {
      item.setVisible(true);
    });

    map.setCenter({
      lat: this.mapOptions.centerLat,
      lng: this.mapOptions.centerLng
    });
    map.setZoom(this.mapOptions.zoom);

    this.infoWindow.close();

    const mapNavItems = document.querySelectorAll('#map-nav li a');
    mapNavItems.forEach(item => {
      item.classList.remove('active');
    });

    btn.classList.remove('active');

    this.directionsDisplay.setMap(null);
    this.directionsDisplay.setPanel(null);
    if (document.getElementById('map-response-panel')) {
      document.getElementById('map-response-panel').innerHTML = '';
      document.getElementById('map-response-panel').classList.remove('error');
      document.getElementById('map-response-panel').classList.remove('active');
    }
  }
}
