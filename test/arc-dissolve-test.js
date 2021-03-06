var api = require('..'),
  assert = require('assert');


describe('mapshaper-arc-dissolve.js', function () {

  describe('dissolveArcs()', function () {

    //      b --- c      e
    //     / \   /      / \
    //    /   \ /      /   \
    //   a --- d      g --- h

    var coords = [
      [[1, 1], [2, 2]],  // ab
      [[2, 2], [4, 2], [3, 1]],  // bcd
      [[2, 2], [3, 1]],  // bd
      [[3, 1], [1, 1]],  // da
      [[6, 2], [7, 1], [5, 1], [6, 2]]];  // ehge

    it('test 1', function () {
      var arcs = new api.internal.ArcCollection(coords);
      var layers = [{
            geometry_type: 'polygon',
            shapes: [[[0, 1, 3], [4]]]
          }];

      var targetArcs = [[[1, 1], [2, 2], [4, 2], [3, 1], [1, 1]], [[6, 2], [7, 1], [5, 1], [6, 2]]];
      var targetShapes = [[[0], [1]]];

      api.internal.dissolveArcs(layers, arcs);
      assert.deepEqual(arcs.toArray(), targetArcs);
      assert.deepEqual(layers[0].shapes, targetShapes)
    })

    it('test 2', function () {
      var arcs = new api.internal.ArcCollection(coords),
          layers = [{
            geometry_type: 'polygon',
            shapes: [[[~1, ~0, ~3]]]
          }];

      var targetArcs = [[[3, 1], [4, 2], [2, 2], [1, 1], [3, 1]]];
      var targetShapes = [[[0]]];

      api.internal.dissolveArcs(layers, arcs);
      assert.deepEqual(arcs.toArray(), targetArcs);
      assert.deepEqual(layers[0].shapes, targetShapes)
    })

    it('test 3', function () {
      var arcs = new api.internal.ArcCollection(coords),
          layers = [{
            geometry_type: 'polygon',
            shapes: [[[~1, ~0, ~3]], [[0, 1, 3], [4]]]
          }];

      var targetArcs = [[[3, 1], [4, 2], [2, 2], [1, 1], [3, 1]], [[6, 2], [7, 1], [5, 1], [6, 2]]];
      var targetShapes = [[[0]], [[~0], [1]]];

      api.internal.dissolveArcs(layers, arcs);
      assert.deepEqual(arcs.toArray(), targetArcs);
      assert.deepEqual(layers[0].shapes, targetShapes)
    })

  })

  describe('getArcDissolveTest()', function () {

    //      b --- c      e
    //     / \   /      / \
    //    /   \ /      /   \
    //   a --- d      g --- h

    var coords = [
      [[1, 1], [2, 2]],  // ab
      [[2, 2], [4, 2], [3, 1]],  // bcd
      [[2, 2], [3, 1]],  // bd
      [[3, 1], [1, 1]],  // da
      [[6, 2], [7, 1], [5, 1], [6, 2]]];  // ehge

    it('shapes 1', function () {
      var dataset = {
        arcs: new api.internal.ArcCollection(coords),
        layers: [{
          geometry_type: 'polygon',
          shapes: [[[0, 2, 3]], [[1, ~2]], [[4]]]
        }]
      };
      var test = api.internal.getArcDissolveTest(dataset.layers, dataset.arcs);

      assert.equal(test(~0, ~3), true);
      assert.equal(test(3, 0), true);
      assert.equal(test(0, 2), false);
      assert.equal(test(0, ~2), false);
      assert.equal(test(4, 4), false);
      assert.equal(test(1, 2), false);
      assert.equal(test(1, 3), false);
      assert.equal(test(2, 3), false);
    })

    it('shapes 2', function () {
      var dataset = {
        arcs: new api.internal.ArcCollection(coords),
        layers: [{
          geometry_type: 'polygon',
          shapes: [[[0, 1, 3]]]
        }]
      };
      var test = api.internal.getArcDissolveTest(dataset.layers, dataset.arcs);
      assert.equal(test(0, 1), true);
      assert.equal(test(1, 3), true);
      assert.equal(test(3, 0), true);
      assert.equal(test(1, 0), false);
      assert.equal(test(~1, ~0), true);
      assert.equal(test(0, 2), false);
      assert.equal(test(1, 2), false);
      assert.equal(test(1, ~2), false);
    })

  })
})