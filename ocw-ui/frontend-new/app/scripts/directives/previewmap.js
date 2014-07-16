'use strict';

/**
 * @ngdoc directive
 * @name ocwUiApp.directive:previewMap
 * @description
 * # previewMap
 */
angular.module('ocwUiApp')
.directive('previewMap', function($rootScope) {
	return {
		restrict: 'A',
		scope: {dataset: '=previewMap', index: '=index'},
		template: '<div id="{{dataset.name}}" class="preview-map"></div>',
		replace: true,
		link: function(scope, element, attrs) {

			// Any attribute that contains {{}} interpolation will be set to null in the attrs
			// parameter during the link function since the first $digest since the compilation
			// has yet to run to evaluate it! We can't run a $digest in the middle of compilation,
			// so using an $observe (or $watch) is the best way to get the values.
			attrs.$observe('id', function(newId) {
				var map = L.map(attrs.id, {
					zoom: 0,
					scrollWheelZoom: false,
					zoomControl: false,
					attributionControl: false,
					worldCopyJump: true,
				});

				L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {}).addTo(map);

				// Zoom the map to the dataset bound regions (or at least try our best to do so)
				var datasetBounds = [[scope.dataset.latlonVals.latMax, scope.dataset.latlonVals.lonMin], 
									 [scope.dataset.latlonVals.latMin, scope.dataset.latlonVals.lonMax]];
				map.fitBounds(datasetBounds, {});

				// Draw a colored overlay on the region of the map
				var maplatlon = scope.dataset.latlonVals;
				var bounds = [[maplatlon.latMax, maplatlon.lonMin], [maplatlon.latMin, maplatlon.lonMax]];

				var polygon = L.rectangle(bounds,{
					stroke: false,
					fillColor: $rootScope.fillColors[1],
					fillOpacity: 0.6
				});

				// Add layer to Group
				var rectangleGroup = L.layerGroup();
				rectangleGroup.addLayer(polygon);

				// Add the overlay to the map
				rectangleGroup.addTo(map);
			});
		}
	};
});
