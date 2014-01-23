// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // Imports
  var inherit = require( 'PHET_CORE/inherit' );
  var ImageMass = require( 'BALANCING_ACT/common/model/ImageMass' );
  var tireImage = require( 'image!BALANCING_ACT/tire.png' );

  // Constants
  var MASS = 10; // In kg
  var HEIGHT = 0.65; // In meters

  /**
   * @param initialPosition
   * @param isMystery
   * @constructor
   */
  function Tire( initialPosition, isMystery ) {
    ImageMass.call( this, MASS, tireImage, HEIGHT, initialPosition, isMystery );
  }

  return inherit( ImageMass, Tire,
    {
      createCopy: function() {
        var copy = new Tire();
        copy.position = this.position.copy;
        return copy;
      }
    } );
} );