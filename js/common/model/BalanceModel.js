// Copyright 2002-2013, University of Colorado Boulder

/**
 * Basic model for depicting masses on a balance, meant to be used as a base
 * type.
 *
 * @author John Blanco
 */

define( function( require ) {
  'use strict';

  // Imports
  var Dimension2 = require( 'DOT/Dimension2' );
  var Fulcrum = require( 'BALANCING_ACT/common/model/Fulcrum' );
  var LevelSupportColumn = require( 'BALANCING_ACT/common/model/LevelSupportColumn' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Plank = require( 'BALANCING_ACT/common/model/Plank' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // Constants
  var FULCRUM_HEIGHT = 0.85; // In meters.
  var PLANK_HEIGHT = 0.75; // In meters.

  /**
   * @constructor
   */
  function BalanceModel() {

    var thisModel = this;

    // Model elements
    thisModel.fulcrum = new Fulcrum( new Dimension2( 1, FULCRUM_HEIGHT ) );
    thisModel.massList = new ObservableArray().setID( 'massesInModel' );
    thisModel.userControlledMasses = []; // Masses being controlled by user(s), potentially more than one in touch environment.
    thisModel.columnStateProperty = new Property( 'doubleColumns' ); // Valid values are doubleColumns, singleColumn, noColumns.
    thisModel.plank = new Plank( new Vector2( 0, PLANK_HEIGHT ), new Vector2( 0, FULCRUM_HEIGHT ), this.columnStateProperty, this.userControlledMasses );
    thisModel.supportColumns = [
      new LevelSupportColumn( PLANK_HEIGHT, -1.625 ),
      new LevelSupportColumn( PLANK_HEIGHT, 1.625 )
    ];
  }

  BalanceModel.prototype = {

    // Step function, called by the framework, clocks time-dependent behavior.
    step: function( dt ) {
      this.plank.step( dt );
      this.massList.forEach( function( mass ) {
        mass.step( dt );
      } );
    },

    // Add a mass to the model.  Subclasses generally do additional things.
    addMass: function( mass ) {
      this.massList.push( mass );
      var thisModel = this;

      // Add a listener that will update the list of user controlled masses
      // that is used by the plank to update the active drop locations.
      var userControlledMassesUpdater = function( userControlled ) {
        if ( userControlled ) {
          thisModel.userControlledMasses.push( mass );
        }
        else {
          thisModel.userControlledMasses.splice( thisModel.userControlledMasses.indexOf( mass ), 1 );
        }
      };
      mass.userControlledProperty.link( userControlledMassesUpdater );

      // Attach a reference for this listener to the mass so that it can be removed later.
      mass.userControlledMassesUpdater = userControlledMassesUpdater;
    },

    // Remove a mass from the model.  Sub-types often do additional things.
    removeMass: function( mass ) {
      this.massList.remove( mass );
      mass.userControlledProperty.unlink( mass.userControlledMassesUpdater );
      mass.userControlledMassesUpdater = null;
    },

    reset: function() {
      this.plank.removeAllMasses();
      this.columnStateProperty.reset();
    }
  };

  return BalanceModel;
} );
