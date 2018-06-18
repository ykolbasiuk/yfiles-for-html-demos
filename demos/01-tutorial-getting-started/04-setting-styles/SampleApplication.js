/****************************************************************************
 ** @license
 ** This demo file is part of yFiles for HTML 2.1.
 ** Copyright (c) 2000-2018 by yWorks GmbH, Vor dem Kreuzberg 28,
 ** 72070 Tuebingen, Germany. All rights reserved.
 **
 ** yFiles demo files exhibit yFiles for HTML functionalities. Any redistribution
 ** of demo files in source code or binary form, with or without
 ** modification, is not permitted.
 **
 ** Owners of a valid software license for a yFiles for HTML version that this
 ** demo is shipped with are allowed to use the demo source code as basis
 ** for their own yFiles for HTML powered applications. Use of such programs is
 ** governed by the rights and conditions as set out in the yFiles for HTML
 ** license agreement.
 **
 ** THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESS OR IMPLIED
 ** WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 ** MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN
 ** NO EVENT SHALL yWorks BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 ** SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 ** TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 ** PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 ** LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 ** NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 ** SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **
 ***************************************************************************/
'use strict'

require.config({
  paths: {
    yfiles: '../../../lib/umd/yfiles/',
    utils: '../../utils/',
    resources: '../../resources/'
  }
})

/**
 * Getting Started - 04 Customizing Styles
 * This demo shows how to configure the visual appearance of graph elements (using so called styles).
 * The visual appearance for each type of graph elements (apart from edge bends) can be
 * customized through implementations of {@link yfiles.styles.INodeStyle}, {@link yfiles.styles.IEdgeStyle} etc. You
 * can either set a default style through the {@link yfiles.graph.IGraph#nodeDefaults} and
 * {@link yfiles.graph.IGraph#edgeDefaults} properties on {@link yfiles.graph.IGraph}, which takes effect for all
 * <b>newly created</b> elements. Or, you can set a style for specific graph elements at creation time with the various
 * <code>create/addXXX</code> methods and overloads, or for existing elements by calling one of the
 * <code>IGraph.setStyle</code> methods.
 *
 * yFiles for HTML already comes with a number of useful styles for most graph element types.
 * It is also possible to create custom styles, which are not covered by this tutorial.
 * Please refer to the Custom Styles tutorial and the yFiles for HTML Developer's Guide.
 */
require(['yfiles/view-editor', 'resources/demo-app', 'resources/license'], (
  /** @type {yfiles_namespace} */ /** typeof yfiles */ yfiles,
  app
) => {
  /** @type {yfiles.view.GraphComponent} */
  let graphComponent = null

  /** @type {yfiles.graph.IGraph} */
  let graph = null

  function run() {
    // Initialize the GraphComponent and place it in the div with CSS selector #graphComponent
    graphComponent = new yfiles.view.GraphComponent('#graphComponent')
    // conveniently store a reference to the graph that is displayed
    graph = graphComponent.graph

    // /////////////// New in this Sample /////////////////

    // Configures default styles for newly created graph elements
    setDefaultStyles()

    // ////////////////////////////////////////////////////

    // Populates the graph and overrides some styles and label models
    populateGraph()

    // Manages the viewport
    updateViewport()

    // bind the demo buttons to their commands
    registerCommands()

    // Initialize the demo application's CSS and Javascript for the description
    app.show(graphComponent)
  }

  /**
   * Creates a sample graph and introduces all important graph elements present in
   * yFiles for HTML. Additionally, this method now overrides the label placement for some specific labels.
   */
  function populateGraph() {
    // ////////// Sample node creation ///////////////////

    // Creates two nodes with the default node size
    // The location is specified for the _center_
    const node1 = graph.createNodeAt(new yfiles.geometry.Point(30, 30))
    const node2 = graph.createNodeAt(new yfiles.geometry.Point(150, 30))
    // Creates a third node with a different size of 60x30
    // In this case, the location of (400,400) describes the _upper left_
    // corner of the node bounds
    const node3 = graph.createNode(new yfiles.geometry.Rect(230, 200, 60, 30))

    // ///////////////////////////////////////////////////

    // ////////// Sample edge creation ///////////////////

    // Creates some edges between the nodes
    const edge1 = graph.createEdge(node1, node2)
    const edge2 = graph.createEdge(node2, node3)

    // ///////////////////////////////////////////////////

    // ////////// Using Bends ////////////////////////////

    // Creates the first bend for edge2 at (260, 30)
    graph.addBend(edge2, new yfiles.geometry.Point(260, 30))

    // ///////////////////////////////////////////////////

    // ////////// Using Ports ////////////////////////////

    // Actually, edges connect "ports", not nodes directly.
    // If necessary, you can manually create ports at nodes
    // and let the edges connect to these.
    // Creates a port in the center of the node layout
    const port1AtNode1 = graph.addPort(
      node1,
      yfiles.graph.FreeNodePortLocationModel.NODE_CENTER_ANCHORED
    )

    // Creates a port at the middle of the left border
    // Note to use absolute locations when placing ports using PointD.
    const port1AtNode3 = graph.addPortAt(
      node3,
      new yfiles.geometry.Point(node3.layout.x, node3.layout.center.y)
    )

    // Creates an edge that connects these specific ports
    const edgeAtPorts = graph.createEdge(port1AtNode1, port1AtNode3)

    // ///////////////////////////////////////////////////

    // ////////// Sample label creation ///////////////////

    // Adds labels to several graph elements
    graph.addLabel(node1, 'n1')
    graph.addLabel(node2, 'n2')
    const n3Label = graph.addLabel(node3, 'n3')
    graph.addLabel(edgeAtPorts, 'Edge at Ports')

    // /////////////// New in this Sample /////////////////

    // Sets the source and target arrows on the edge style instance
    // Note that IEdgeStyle itself does not have these properties
    const sourceArrowStyle = new yfiles.styles.Arrow({
      type: yfiles.styles.ArrowType.CIRCLE,
      stroke: 'red',
      fill: yfiles.view.Fill.RED,
      cropLength: 1
    })

    const targetArrowStyle = new yfiles.styles.Arrow({
      type: yfiles.styles.ArrowType.SHORT,
      stroke: 'red',
      fill: yfiles.view.Fill.RED,
      cropLength: 1
    })

    const edgeStyle = new yfiles.styles.PolylineEdgeStyle({
      stroke: '2px dashed red',
      sourceArrow: sourceArrowStyle,
      targetArrow: targetArrowStyle
    })

    // Assign the defined edge style as the default for all edges that don't have
    // another style assigned explicitly
    graph.setStyle(edge1, edgeStyle)

    // Creates a different style for the label with black text and a red border
    const sls = new yfiles.styles.DefaultLabelStyle({
      backgroundStroke: 'red'
    })

    // And sets the style for the label, again through its owning graph.
    graph.setStyle(n3Label, sls)

    // Custom node style
    const nodeStyle = new yfiles.styles.ShapeNodeStyle({
      shape: 'ellipse',
      fill: 'orange',
      stroke: 'red'
    })
    graph.setStyle(node2, nodeStyle)

    // ////////////////////////////////////////////////////
    // ///////////////////////////////////////////////////
  }

  /**
   * Set up default styles for graph elements.
   * Default styles apply only to elements created after the default style has been set,
   * so typically, you'd set these as early as possible in your application.
   */
  function setDefaultStyles() {
    // Sets the default style for nodes
    // Creates a nice ShinyPlateNodeStyle instance, using an orange Fill.
    // Sets this style as the default for all nodes that don't have another
    // style assigned explicitly
    graph.nodeDefaults.style = new yfiles.styles.ShinyPlateNodeStyle({
      fill: 'rgb(255, 140, 0)'
    })

    // Set the default style for edges
    // Use a red Pen with thickness 2.
    graph.edgeDefaults.style = new yfiles.styles.PolylineEdgeStyle({
      stroke: '2px red',
      targetArrow: new yfiles.styles.Arrow({
        type: 'default',
        stroke: '2px red',
        fill: 'red'
      })
    })

    // Sets the default style for labels
    // Creates a label style with the label text color set to dark red
    const defaultLabelStyle = new yfiles.styles.DefaultLabelStyle({
      font: '12px Tahoma',
      textFill: yfiles.view.Fill.DARK_RED
    })

    // Sets the defined style as the default for both edge and node labels:
    graph.edgeDefaults.labels.style = defaultLabelStyle
    graph.nodeDefaults.labels.style = defaultLabelStyle

    // Sets the default size explicitly to 40x40
    graph.nodeDefaults.size = new yfiles.geometry.Size(40, 40)
  }

  /**
   * Updates the content rectangle to encompass all existing graph elements.
   * If you create your graph elements programmatically, the content rectangle
   * (i.e. the rectangle in <b>world coordinates</b>
   * that encloses the graph) is <b>not</b> updated automatically to enclose these elements.
   * Typically, this manifests in wrong/missing scrollbars, incorrect {@link yfiles.view.GraphOverviewComponent}
   * behavior and the like.
   *
   * This method demonstrates several ways to update the content rectangle, with or without adjusting the zoom level
   * to show the whole graph in the view.
   *
   * Note that updating the content rectangle only does not change the current Viewport (i.e. the world coordinate
   * rectangle that corresponds to the currently visible area in view coordinates)
   *
   * Uncomment various combinations of lines in this method and observe the different effects.
   *
   * The following demos in this tutorial will assume that you've called <code>GraphComponent.fitGraphBounds()</code>
   * in this method.
   */
  function updateViewport() {
    // Uncomment the following line to update the content rectangle
    // to include all graph elements
    // This should result in correct scrolling behaviour:

    // graphComponent.updateContentRect();

    // Additionally, we can also set the zoom level so that the
    // content rectangle fits exactly into the viewport area:
    // Uncomment this line in addition to UpdateContentRect:
    // Note that this changes the zoom level (i.e. the graph elements will look smaller)

    // graphComponent.fitContent();

    // The sequence above is equivalent to just calling:
    graphComponent.fitGraphBounds()
  }

  function registerCommands() {
    const ICommand = yfiles.input.ICommand

    app.bindCommand("button[data-command='ZoomIn']", ICommand.INCREASE_ZOOM, graphComponent)
    app.bindCommand("button[data-command='ZoomOut']", ICommand.DECREASE_ZOOM, graphComponent)
    app.bindCommand("button[data-command='FitContent']", ICommand.FIT_GRAPH_BOUNDS, graphComponent)
    app.bindCommand("button[data-command='ZoomOriginal']", ICommand.ZOOM, graphComponent, 1.0)
  }

  // start tutorial
  run()
})
