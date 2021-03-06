/* @requires mapshaper-shape-geom, mapshaper-filter */

api.filterIslands = function(lyr, arcs, opts) {
  var filter = null;
  if (lyr.geometry_type != 'polygon') {
    message("[filter-islands] skipping a non-polygon layer");
    return;
  }

  if (opts.min_area) {
    MapShaper.editShapes(lyr.shapes, MapShaper.getIslandAreaFilter(arcs, opts.min_area));
  }
  if (opts.min_vertices) {
    MapShaper.editShapes(lyr.shapes, MapShaper.getIslandVertexFilter(arcs, opts.min_vertices));
  }

  if (opts.remove_empty) {
    api.filterFeatures(lyr, arcs, {remove_empty: true});
  }
};

MapShaper.getIslandVertexFilter = function(arcs, minVertices) {
  var minCount = minVertices + 1; // first and last vertex in ring count as one
  return function(paths) {
    return MapShaper.editPaths(paths, function(path) {
      if (path.length == 1 && geom.countVerticesInPath(path, arcs) < minCount) {
        return null;
      }
    });
  };
};

MapShaper.getIslandAreaFilter = function(arcs, minArea) {
  var pathArea = MapShaper.probablyDecimalDegreeBounds(arcs.getBounds()) ?
        geom.getSphericalPathArea : geom.getPlanarPathArea;
  return function(paths) {
    return MapShaper.editPaths(paths, function(path) {
      if (path.length == 1 && Math.abs(pathArea(path, arcs)) < minArea) {
        // Found an island to remove
        // TODO: Remove all enclosed holes, including multi-part holes
        return null;
      }
    });
  };
};

MapShaper.editShapes = function(shapes, filter) {
  for (var i=0, n=shapes.length; i<n; i++) {
    shapes[i] = filter(shapes[i]);
  }
};
