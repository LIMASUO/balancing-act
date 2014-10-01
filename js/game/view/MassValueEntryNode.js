// Copyright 2002-2014, University of Colorado Boulder

/**
 * This class presents a dialog to the user that allows them to enter a mass value.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // Imports
  var ArrowButton = require( 'SCENERY_PHET/ArrowButton' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var kgString = require( 'string!BALANCING_ACT/kg' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var pattern0Value1UnitsString = require( 'string!BALANCING_ACT/pattern0Value1Units' );
  var Property = require( 'AXON/Property' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // Constants
  var READOUT_FONT = new PhetFont( 16 );
  var ARROW_HEIGHT = 15;
  var MAX_MASS = 100;
  var TICK_MARK_FONT = new PhetFont( 10 );

  /**
   * @constructor
   */
  function MassValueEntryNode( options ) {
    Node.call( this );
    var thisNode = this;
    thisNode.massValue = new Property( 0 );

    // Create and add the readout, including the background.
    var readoutText = new Text( StringUtils.format( pattern0Value1UnitsString, 0, kgString ), { font: READOUT_FONT } );
    var readoutBackground = new Rectangle( 0, 0, readoutText.width * 2.5, readoutText.height * 1.3, 4, 4,
      {
        fill: 'white',
        stroke: 'black'
      }
    );
    var panelContent = new Node();
    panelContent.addChild( readoutBackground );
    readoutText.centerY = readoutBackground.centerY;
    panelContent.addChild( readoutText );

    // Create and add the slider.
    this.sliderValue = new Property( 0 );
    var slider = new HSlider( thisNode.sliderValue, { min: 0, max: MAX_MASS },
      {
        thumbSize: new Dimension2( 15, 30 ),
        majorTickLength: 15,
        tickLabelSpacing: 2
      } );
    panelContent.addChild( slider );
    for ( var i = 0; i <= MAX_MASS; i += 10 ) {
      if ( i % 50 === 0 ) {
        slider.addMajorTick( i, new Text( i, { font: TICK_MARK_FONT } ) );
      }
      else {
        slider.addMinorTick( i, null );
      }
    }

    // Hook up the slider property to the mass value so that mass only contains integer values.
    thisNode.sliderValue.link( function( value ) {
      thisNode.massValue.value = Math.round( value );
    } );

    // Hook them up in the other direction so that changes to the mass value
    // that occur outside of the slider (e.g. the arrow buttons).
    thisNode.massValue.link( function( massValue ) {
      thisNode.sliderValue.value = massValue;
    } );

    // Create and add the arrow buttons.
    var arrowButtonOptions = { arrowHeight: ARROW_HEIGHT, arrowWidth: ARROW_HEIGHT * Math.sqrt( 3 ) / 2 };
    var leftArrowButton = new ArrowButton( 'left', function() { thisNode.massValue.value--; }, arrowButtonOptions );
    panelContent.addChild( leftArrowButton );
    var rightArrowButton = new ArrowButton( 'right', function() { thisNode.massValue.value++; }, arrowButtonOptions );
    panelContent.addChild( rightArrowButton );

    // layout
    thisNode.massValue.value = MAX_MASS / 2; // Make sure slider is in the middle during layout.
    readoutBackground.centerX = slider.bounds.width / 2;
    readoutBackground.top = 0;
    slider.left = 0;
    slider.top = readoutBackground.bottom + 5;
    leftArrowButton.right = slider.left - 12;
    leftArrowButton.centerY = slider.centerY;
    rightArrowButton.left = slider.right + 12;
    rightArrowButton.centerY = slider.centerY;
    thisNode.massValue.reset(); // Put slider back to original position.

    // Put the contents into a panel.
    var panel = new Panel( panelContent, { fill: 'rgb( 234, 234, 174 )', xMargin: 7, yMargin: 7 } );
    thisNode.addChild( panel );

    // Update the readout text and arrow button states whenever the value changes.
    thisNode.massValue.link( function( value ) {
      readoutText.text = StringUtils.format( pattern0Value1UnitsString, value, kgString );
      readoutText.centerX = readoutBackground.centerX;
      leftArrowButton.enabled = value > 0;
      rightArrowButton.enabled = value < MAX_MASS;
    } );

    thisNode.mutate( options );
  }

  return inherit( Node, MassValueEntryNode, {
    clear: function() {
      this.sliderValue.reset();
    },
    showAnswer: function( massValue ) {
      this.sliderValue.value = massValue;
    }
  } );
} );
