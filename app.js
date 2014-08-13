(function(window) {
	'use strict';

	// we use $.ajax to load the diagram.
	// make sure you run the application via web-server (ie. connect (node) or asdf (ruby))

	// require the viewer, make sure you added the bpmn-js bower distribution
	// along with all its dependencies to the web site
	var BpmnViewer = window.BpmnJS;

	var viewerOld = new BpmnViewer({ container: '#canvas_old', height: '100%', width: '100%' });

	var viewerNew = new BpmnViewer({ container: '#canvas_new', height: '100%', width: '100%' });

	var _ = window._;

	$.get('pizza-collaboration_old.bpmn', function(pizzaDiagram) {
		viewerOld.importXML(pizzaDiagram, function(err) {

	    if (!err) {
	      console.log('success!');
	      //viewerOld.get('canvas').zoom('fit-viewport');

	    } else {
	      console.log('something went wrong:', err);
	    }
	  });
	});

	$.get('pizza-collaboration_new.bpmn', function(pizzaDiagram) {
	  viewerNew.importXML(pizzaDiagram, function(err) {

	    if (!err) {
	      console.log('success!');
	      //viewerNew.get('canvas').zoom('fit-viewport');
	    } else {
	      console.log('something went wrong:', err);
	    }

		$.getJSON( 'diff.json', function( data ) {
			console.log(data);

		
			$.each(data.removed, function(i, obj) {
			  viewerOld.get("elementRegistry").getGraphicsByElement(obj).addClass("elementRemoved");
			});			

			$.each(data.added, function(i, obj) {
			  viewerNew.get("elementRegistry").getGraphicsByElement(obj).addClass("elementAdded");
			});			

			$.each(data.moved, function(i, obj) {
			  viewerOld.get("elementRegistry").getGraphicsByElement(obj).addClass("elementMoved");
			  viewerNew.get("elementRegistry").getGraphicsByElement(obj).addClass("elementMoved");
			});			

			$.each(data.edited, function(i, obj) {
			  viewerOld.get("elementRegistry").getGraphicsByElement(i).addClass("elementEdited");

			  	var details = "<div id='" + i + "' class='changeDetails'>";
			  	$.each(obj, function(attr, changes) {
			  		details = details + "Attribute: " + attr + " | old: " + changes.old + " | new: " + changes.new + "<br/>";
			  	});

			  	details = details + "</div>";

  			   viewerOld.get("elementRegistry").getGraphicsByElement(i).click (function (event) {
			  	
			  	alert (details);
			  });

			  viewerNew.get("elementRegistry").getGraphicsByElement(i).addClass("elementEdited");

			  // add Popover for Change Details
            var overlays = viewerOld.get('overlays');

            // attach an overlay to a node
            overlays.add(i, {
              position: {
                bottom: 0,
                left: 0
              },
              html: details
            });

			});			


		});

		// viewerOld.get("elementRegistry").getGraphicsByElement("_6-74").addClass("elementRemoved");



	  });
	});


	function openDiagram (xml, target) {
		$( "#" + target ).empty();

		var BpmnViewer = window.BpmnJS;
		var viewer = new BpmnViewer({ container: '#' + target, height: '100%', width: '100%' });

		viewer.importXML(xml, function(err) {
		    if (!err) {
		      console.log('success!');

		    } else {
		      console.log('something went wrong:', err);
		    }
		  });

	}

	$('.file').on('change', function(e) {
		openFile(e.target.files[0], openDiagram, $(this).attr("target"));
	});


	function openFile(file, callback, target) {
	    var reader = new FileReader();
	    reader.onload = function(e) {
	      var xml = e.target.result;
	      callback(xml, target);
	    };

	    reader.readAsText(file);
	  }





	  function oldstuff() {

		var definitions = viewerOld.definitions;
		
		definitions.rootElements;
		definitions.diagrams;

		definitions.$instanceOf('bpmn:FlowNode');

		//debugger;

		_.forEach(definitions.rootElements, function(element) {
			
			//console.log(element.$type, element);
			if(element.$instanceOf('bpmn:Process')) {
				_.forEach(element.flowElements, function(flowElement) {
					console.log(flowElement.$type, flowElement);
				});
			}
		
			

		});


	  }
})(window);