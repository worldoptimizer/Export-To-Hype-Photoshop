//@target photoshop
// $.level = 2;

/* 
// BEGIN__HARVEST_EXCEPTION_ZSTRING
 
<javascriptresource>
	<name>Export to Hype...</name>
	<category>scriptexport</category>
	<enableinfo>true</enableinfo>
	<menu>export</menu>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING
*/

/**
 * Copyright Max Ziebell 2022
 * v1.0.7
 */

/*
 *
 * 1.0.0 Release on Gumroad (commercial and educational version)
 * 1.0.1 Corrected MD5 hash, updates modification date
 * 1.0.2 Increased compatibility, numbering layer with same name
 * 1.0.3 Aspect ratio bug (sizeRatio)
 * 1.0.4 Released as Open Source (MIT)
 *       Added Hype Template export type
 *       Simplified logo for slim Script UI image resource
 *       Added ImageOptim and ImageAlpha support
 * 1.0.5 Fixed LayerSet regression, to allow bounds with transparency
 *       Fixed rounding error in retina mode
 * 1.0.6 Fixed bug by replacing the duplication method
 *       Fixed bug that caused an invisible symbol in the library
 * 1.0.7 Removed mdfind and assuming ImageOptim and ImageAlpha at fixed paths
 *       Added option to set default or force colors reduction
 *
 */

// IIFE begin
(function() {

	/* @const */
	const _version = '1.0.7'

	// DIALOG
	// ======
	var dialog = new Window("dialog");
	dialog.text = "Export to Hype";
	dialog.orientation = "column";
	dialog.alignChildren = ["center", "top"];
	dialog.spacing = 10;
	dialog.margins = 16;


	// HEADERGROUP
	// ===========
	var headerGroup = dialog.add("group", undefined, {name: "headerGroup"}); 
		headerGroup.orientation = "row"; 
		headerGroup.alignChildren = ["left","center"]; 
		headerGroup.spacing = 10; 
		headerGroup.margins = 0; 
	
	var headerImage = headerGroup.add("image", undefined, File.decode(getLogoImage()), {name: "headerImage"}); 
		headerImage.helpTip = "Export To Hype"; 
		headerImage.preferredSize.width = 180;

	var headerText = headerGroup.add("statictext", undefined , {name: "headerText"}); 
		headerText.preferredSize.width = 210;
		headerText.preferredSize.height = 70;
		headerText.alignChildren = ["left","center"]; 
		headerText.text = [
			"This tool exports all top-level layers and groups",
			"to cropped PNG and JPEG files and creates a",
			"file usable in Tumult Hype 4 based on your",
			"Photoshop document.",
		].join("\n");
		headerText.graphics.foregroundColor = headerText.graphics.newPen(headerText.graphics.PenType.SOLID_COLOR, [0.9, 0.9, 0.9], 1);
		headerText.graphics.font = "dialog:9";
	
	// EXPORTPANEL
	// ===========
	var exportPanel = dialog.add("panel", undefined, undefined, {name: "exportPanel"}); 
	exportPanel.text = "Export as"; 
	exportPanel.orientation = "column"; 
	exportPanel.alignChildren = ["left","top"]; 
	exportPanel.margins = 15;
	exportPanel.preferredSize.width = 400;
	
	// EXPORTTYPE
	// ==========
	var exportType = exportPanel.add("group", undefined, {name: "exportType"}); 
	exportType.orientation = "column"; 
	exportType.alignChildren = ["left","center"]; 
	exportType.spacing = 10; 
	exportType.margins = 0; 
	
	var radiobutton1 = exportType.add("radiobutton", undefined, undefined, {name: "radiobutton1"}); 
	radiobutton1.text = "Hype Template"; 
	radiobutton1.helpTip = "Select this export type to save a Hype Template.";
	radiobutton1.value = true; 
	
	var radiobutton2 = exportType.add("radiobutton", undefined, undefined, {name: "radiobutton2"});
	radiobutton2.helpTip = "Select this export type to save a Hype Symbol.";
	radiobutton2.text = "Hype Symbol"; 
	
	var radiobutton3 = exportType.add("radiobutton", undefined, undefined, {name: "radiobutton3"});
	radiobutton3.helpTip = "Select this export type to save only the resources (great for updating  and relinking layer manually).";
	radiobutton3.text = "Resources only";
	
	
	// OPTIONPANEL
	// ======
	var optionPanel = dialog.add("panel", undefined, undefined, { name: "optionPanel" });
	optionPanel.text = "Pick your options";
	optionPanel.orientation = "column";
	optionPanel.alignChildren = ["left", "top"];
	//optionPanel.spacing = 10; 
	optionPanel.margins = 15;
	optionPanel.preferredSize.width = 400;
	
		
	// OPTIONS
	// ==========
	var imageOptimPath = getImageOptimPath();
	var canOptimize = imageOptimPath!==null;
	var shouldOptimize = optionPanel.add("checkbox", undefined, undefined, { name: "shouldOptimize" });
		shouldOptimize.helpTip = "Uncheck this if you don't want to use ImageOptim on your export (needs to be installed).";
		shouldOptimize.text = "Run ImageOptim on exported files (lossless compression)";
		shouldOptimize.alignment = ["left", "top"];
		shouldOptimize.value = canOptimize;
		shouldOptimize.enabled = canOptimize;
	
	if (!canOptimize){
		// OPTIMGROUP
		// ==========
		var optimGroup = optionPanel.add("group", undefined, {name: "optimGroup"}); 
			optimGroup.orientation = "row"; 
			optimGroup.alignChildren = ["left","center"]; 
			optimGroup.spacing = 10; 
			optimGroup.margins = [7,0,0,0]; 
		
		var optimDivider = optimGroup.add("panel", undefined, undefined, {name: "optimDivider"}); 
			optimDivider.alignment = "fill";
		
		var optimText = optimGroup.add("statictext", undefined, undefined, {name: "optimText"}); 
			optimText.text = "  Install ImageOptim to enable this feature"; 
			optimText.graphics.foregroundColor = optimText.graphics.newPen(optimText.graphics.PenType.SOLID_COLOR, [0.8, 0.8, 0.8], 1);
			optimText.graphics.font = "dialog:11";
		
		var optimBtn = optimGroup.add("button", undefined, undefined, {name: "optimBtn"}); 
			optimBtn.text = "ImageOptim";
			optimBtn.onClick = function() {
				openURL("https://imageoptim.com/");
			} 
	}
	
	// IMAGEALPHAGROUP
	// ===============
	var imageAlphaPath = getImageAlphaPath();
	var canColorReduce = imageAlphaPath!==null;
	
	var shouldColorReduce = optionPanel.add("checkbox", undefined, undefined, { name: "shouldColorReduce" });
	shouldColorReduce.helpTip = "Check to limit the number of colors used on PNG layers using ImageAlpha.";
	shouldColorReduce.text = "Run ImageAlpha on tagged layers (color + size reduction)";
	shouldColorReduce.alignment = ["left", "top"];
	shouldColorReduce.value = canColorReduce;
	shouldColorReduce.enabled = canColorReduce;
	shouldColorReduce.onClick = function() {
		imageAlphaGroup.enabled = !!this.value;
	}
	
	if (canColorReduce) {
		var imageAlphaGroup = optionPanel.add("group", undefined, {name: "imageAlphaGroup"}); 
			imageAlphaGroup.orientation = "row"; 
			imageAlphaGroup.alignChildren = ["left","center"]; 
			imageAlphaGroup.spacing = 0; 
			imageAlphaGroup.margins = [7,0,0,0];
			
		var colorReduceDivider = imageAlphaGroup.add("panel", undefined, undefined, {name: "colorReduceDivider"}); 
			colorReduceDivider.alignment = "fill";
				
		var colorReduceText1 = imageAlphaGroup.add("statictext", undefined, undefined, {name: "colorReduceText1"}); 
			colorReduceText1.text = "  "
		
		var colorReduceScopeDropDown = imageAlphaGroup.add("dropdownlist", undefined, undefined, {name: "colorReduceScopeDropDown", items: ['export of untagged', 'force export of all']}); 
			colorReduceScopeDropDown.selection = 0;
			
		var colorReduceText2 = imageAlphaGroup.add("statictext", undefined, undefined, {name: "colorReduceText1"}); 
		colorReduceText2.text = " layers with"
		
				
		var colorReduceDropDown_array = ["truecolor","256 colors","128 colors","64 colors","32 colors","16 colors","8 colors","4 colors","2 colors"]; 
		var colorReduceDropDown = imageAlphaGroup.add("dropdownlist", undefined, undefined, {name: "colorReduceDropDown", items: colorReduceDropDown_array}); 
			colorReduceDropDown.selection = 0;
	}
	
	if (!canColorReduce){
		// OPTIMGROUP
		// ==========
		var colorReduceGroup = optionPanel.add("group", undefined, {name: "colorReduceGroup"}); 
			colorReduceGroup.orientation = "row"; 
			colorReduceGroup.alignChildren = ["left","center"]; 
			colorReduceGroup.spacing = 10; 
			colorReduceGroup.margins = [7,0,0,0]; 
		
		var colorReduceDivider = colorReduceGroup.add("panel", undefined, undefined, {name: "colorReduceDivider"}); 
			colorReduceDivider.alignment = "fill";
		
		var colorReduceText = colorReduceGroup.add("statictext", undefined, undefined, {name: "optimText"}); 
			colorReduceText.text = "  Install ImageAlpha to enable this feature"; 
			colorReduceText.graphics.foregroundColor = colorReduceText.graphics.newPen(colorReduceText.graphics.PenType.SOLID_COLOR, [0.8, 0.8, 0.8], 1);
			colorReduceText.graphics.font = "dialog:11";
		
		var colorReduceBtn = colorReduceGroup.add("button", undefined, undefined, {name: "colorReduceBtn"}); 
			colorReduceBtn.text = "ImageAlpha";
			colorReduceBtn.onClick = function() {
				openURL("https://pngmini.com/");
			} 
	}
	
	var customSave = optionPanel.add("checkbox", undefined, undefined, { name: "customSave" });
	customSave.helpTip = "If you check this option Export to Hype will ask you for a folder to save the Hype file.";
	customSave.text = "Save at custom destination (rather then alongside .PSD)";
	customSave.alignment = ["left", "top"];

	var disableRetina = optionPanel.add("checkbox", undefined, undefined, { name: "disableRetina" });
	disableRetina.helpTip = "Check this if you want to export the original pixel densitiy to Hype without half scale retina elements.";
	disableRetina.text = "Disable retina scaling on Hype elements";
	disableRetina.alignment = ["left", "top"];	
	

	
	// GROUP1
	// ======
	var group1 = dialog.add("group", undefined, { name: "group1" });
	group1.orientation = "row";
	group1.alignChildren = ["left", "bottom"]; // before center
	//group1.spacing = 20; 
	group1.margins = 0;
	group1.preferredSize.height = 40;

	var abouttext = group1.add("statictext", undefined, undefined, { name: "abouttext" });
	abouttext.text = "Export to Hype v" + _version + " \nDisclaimer and about...";
	abouttext.preferredSize.width = 120;
	abouttext.preferredSize.height = 30;
	abouttext.alignment = ["left", "bottom"]; //before top
	abouttext.graphics.foregroundColor = abouttext.graphics.newPen(abouttext.graphics.PenType.SOLID_COLOR, [0.6, 0.6, 0.6], 1);
	abouttext.graphics.font = "dialog-Bold:9";
	abouttext.onClick = function() {

		// DIALOGABOUT
		// ===========
		var dialogAbout = new Window("dialog");
		dialogAbout.text = "Disclaimer and About";
		dialogAbout.preferredSize.width = 200;
		dialogAbout.preferredSize.height = 400;
		dialogAbout.orientation = "column";
		dialogAbout.alignChildren = ["center", "top"];
		dialogAbout.spacing = 10;
		dialogAbout.margins = 16;

		var statictext1 = dialogAbout.add("statictext", undefined, undefined, { name: "statictext1", multiline: true });
		statictext1.text = "This tool is put together by Max Ziebell, \nhttps://maxziebell.de, copyright 2022.\nInspired by work from Tomek Cejner, Damien van Holten and Joonas Paakko. Many thanks to Jonathan and Daniel from Tumult for support, testing and feedback.";
		statictext1.preferredSize.width = 300;

		var statictext2 = dialogAbout.add("statictext", undefined, undefined, { name: "statictext2", multiline: true });
		statictext2.text = "This tool is based on ExtendScript and Script-UI. It offers functionality that is heavily dependent on the undocumented file format of Tumult Hype file templates and therefor the functionality cannot be guaranteed.";
		statictext2.preferredSize.width = 300;
		

		var statictext3 = dialogAbout.add("statictext", undefined, undefined, { name: "statictext3", multiline: true });
		statictext3.text = 'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.';
		statictext3.graphics.foregroundColor = statictext3.graphics.newPen(statictext3.graphics.PenType.SOLID_COLOR, [0.7, 0.7, 0.7], 1);
		statictext3.graphics.font = "dialog:11";
		statictext3.preferredSize.width = 300;
		
		var donationText = dialogAbout.add("statictext", undefined, undefined, {name: "abouttext"}); 
		donationText.text = [
			"Please, consider a donations or sponsorship",
			"to support the development of tools like this.",
		].join("\n");
		donationText.preferredSize.width = 300; 
		donationText.preferredSize.height = 40; 
		donationText.alignment = ["left","top"]; 
		donationText.graphics.foregroundColor = donationText.graphics.newPen (donationText.graphics.PenType.SOLID_COLOR, [0.5 ,1, 0.5], 1);
		donationText.graphics.font = "dialog-Bold:11";

		var donationGroup = dialogAbout.add("group", undefined, {name: "donationGroup"}); 
		donationGroup.orientation = "row"; 
		donationGroup.alignChildren = ["left","center"]; 
		donationGroup.spacing = 10; 
		donationGroup.margins = 0; 
		donationGroup.alignment = ["left","top"]; 
		
		var donationBtn = donationGroup.add("button", undefined, undefined, {name: "donationBtn"}); 
			donationBtn.text = "Donation";
			donationBtn.preferredSize.height = 30;	
			donationBtn.onClick = function() {
				openURL("https://www.buymeacoffee.com/MaxZiebell");
			}

		var cancelBtn = donationGroup.add("button", undefined, undefined, { name: "cancelBtn" });
		cancelBtn.text = "Acknowledge and close";
		cancelBtn.preferredSize.height = 30;
		cancelBtn.onClick = function() {
			dialogAbout.close();
		}
		
		dialogAbout.show();
	}


	var cancelBtn = group1.add("button", undefined, undefined, { name: "cancelBtn" });
	cancelBtn.text = "Cancel";
	cancelBtn.preferredSize.height = 30;
	cancelBtn.onClick = function() {
		dialog.close();
	}

	var exportBtn = group1.add("button", undefined, undefined, { name: "exportBtn" });
	exportBtn.helpTip = "Click this button to export";
	exportBtn.text = "Export";
	exportBtn.preferredSize.width = 150;
	exportBtn.preferredSize.height = 30;
	exportBtn.onClick = function() {
	
		HypeLayerExporter({
			disableRetina: disableRetina.value,
			customSave: customSave.value,
			shouldOptimize: shouldOptimize.value,
			shouldColorReduce: shouldColorReduce.value, 
			defaultColorReduce: canColorReduce? parseInt(colorReduceDropDown.selection.text) : null,
			forceColorReduction: colorReduceScopeDropDown.selection.index == 1,
			onlyResources: exportType.children[2].value == true,
			saveAsSymbol: exportType.children[1].value == true,
		});
	
		dialog.close();
	}
	
	// start
	dialog.show();


	/**
	 * This function main function
	 *
	 */
	function HypeLayerExporter(o) {
		// abort if there are no document
		if (!documents.length) return;

		// make we use pixel units
		var rulerUnits = app.preferences.rulerUnits;
		var typeUnits = app.preferences.typeUnits;
		app.preferences.rulerUnits = Units.PIXELS;
		app.preferences.typeUnits = TypeUnits.PIXELS;

		// local
		var disableRetina = o.disableRetina || false;
		var customSave = o.customSave || false;
		var onlyResources = o.onlyResources || false;
		var saveAsSymbol = o.saveAsSymbol;
		var shouldOptimize = o.shouldOptimize;
		var shouldColorReduce = o.shouldColorReduce;
		var defaultColorReduce = o.defaultColorReduce;
		var forceColorReduction = o.forceColorReduction;
		var hypeExtension = saveAsSymbol? 'hypesymbol' : 'hypetemplate';

		// check if we have a doc path (doc is saved)	
		try {
			var docPath = activeDocument.path;
		} catch (e) {
			alert("Export to Hype: You need to save the document before using this exporter!");
			return;
		}

		// check for unique names
		var uniqueNames = {};
		for (var i = 0; i < activeDocument.layers.length; i++) {
			var name = getFileName(activeDocument.layers[i].name);
			if (uniqueNames.hasOwnProperty(name)) {
				alert('Export to Hype: The layer name "' + name + '" was at least used twice! This exporter requires unique top-level layer names.');
				return;
			} else {
				uniqueNames[name] = true;
			}
		}

		// check if we got a custom save path request
		if (!!customSave) {
			var customPath = Folder.selectDialog("Export to Hype: Please, select an output folder");
			if (!customPath) return;
			docPath = customPath;
		}

		// prep more doc vars
		var docName = activeDocument.name.substr(0, activeDocument.name.lastIndexOf('.'));
		var docWidth = activeDocument.width;
		var docHeight = activeDocument.height;
		var docRetinaScale = disableRetina ? 1 : 2;

		// check and create folder structure for symbol
		var hypePath, hypeFolder, resourcesPath, resourcesFolder;
		try {
			if (onlyResources) {
				resourcesPath = docPath + '/' + docName + ' Resources';
				resourcesFolder = new Folder(resourcesPath);
				if (!resourcesFolder.exists) resourcesFolder.create();

			} else {
				hypePath = docPath + '/' + docName + '.' + hypeExtension;
				hypeFolder = new Folder(hypePath);
				if (!hypeFolder.exists) hypeFolder.create();

				resourcesPath = docPath + '/' + docName + '.' + hypeExtension + '/Resources';
				resourcesFolder = new Folder(resourcesPath);
				if (!resourcesFolder.exists) resourcesFolder.create();

			}
		} catch (e) {
			if (onlyResources) {
				alert("Export to Hype: Failed to create resource folder!", "Error", true);
			} else {
				alert("Export to Hype: Failed to create "+hypeExtension+" folder!", "Error", true);
			}
			return;
		}

		// prep vars for plist recursive walk
		var resourcesStr = '';
		var groupsStr = '';
		var elementsStr = '';
		var lid = 2;

		// create a copy of the current document
		var docCopy = app.activeDocument.duplicate();
		selectAnyLayer(app.activeDocument);
		
		// Export to Hype (basic version, flat export)
		for (var i = 0; i < activeDocument.layers.length; i++) {
			var layer = activeDocument.layers[i];
			var name = activeDocument.layers[i].name;

			//skip if layer is not visible
			if (!layer.visible) continue;

			//skip all layers not ArtLayer or LayerSet
			if (layer.typename != 'ArtLayer' && layer.typename != 'LayerSet') continue;

			//skip empty layers
			var lb = getLayerBounds(layer);
			if (lb[0] === "0 px" && lb[1] === "0 px" && lb[2] === "0 px" && lb[3] === "0 px") continue;

			//try to save the layer
			try {
				var saveData = saveLayer(
					layer,
					name,
					resourcesPath,
					shouldOptimize,
					shouldColorReduce,
					defaultColorReduce,
					forceColorReduction
				);
				
				// store layer to PLIST if not only resources and we have a file
				if (!onlyResources || !saveData.file) {
					layerToPlist(layer, name, saveData);
				}
			} catch (e) {
				alert("Export to Hype: Failed to export layer!" + '\n\n'+e.message, "Error", true);
				return;
			}
		}

		// save plist
		if (!onlyResources) saveAsPlistFile(hypePath + '/data.plist', dataPlistString({
			hypeName: docName,
			saveAsSymbol: saveAsSymbol,
			width: Math.round(parseInt(docWidth) / docRetinaScale),
			height: Math.round(parseInt(docHeight) / docRetinaScale),
			resources: resourcesStr,
			groups: groupsStr,
			elements: elementsStr,
		}));

		//touch symbol
		if (!onlyResources) {
			system('touch "' + hypeFolder.fsName + '"');
		}

		//restore ruler units
		app.preferences.rulerUnits = rulerUnits;
		app.preferences.typeUnits = typeUnits;

		//close the copy
		docCopy.close(SaveOptions.DONOTSAVECHANGES);
		
		//helper for plist export
		function layerToPlist(layer, lname, saveData) {
			// prep name
			var name = lname.split('.')[0];
			var fileName = getFileName(lname);

			// get layer bounds
			var lb = saveData.layerBoundsAsObject;

			// set original width and height
			var originalWidth = lb.width;
			var originalHeight = lb.height;

			// scale is not disableRetina
			if (!disableRetina) {
				for (var prop in lb) {
					lb[prop] = Math.round(parseInt(lb[prop]) / 2);
				}
			} else {
				for (var prop in lb) {
					lb[prop] = Math.round(parseInt(lb[prop]));
				}
			}

			// generate plist chunks
			groupsStr += groupPlistString({
				resourceId: lid,
				name: name,
				fileName: fileName,
			});

			resourcesStr += resourcePlistString({
				resourceId: lid,
				name: name,
				fileName: fileName,
				fileSize: saveData.file.length,
				modified: formatDate(saveData.file.modified),
				md5: md5ForFile(saveData.file.fsName).toUpperCase(),
				originalPath: '',
			});

			elementsStr += elementPlistString({
				resourceId: lid,
				name: name,
				top: lb.top,
				left: lb.left,
				height: lb.height,
				width: lb.width,
				originalWidth: originalWidth,
				originalHeight: originalHeight,
				zIndex: 1000 - lid,
				key: 10 + lid,
				opacity: layer.opacity / 100,
			});

			lid++;
		}

	};
	
	
	
	/**
	 * Save a layer as a file.
	 * 
	 * @param  {Object} layer - The layer object.
	 * @param  {String} lname - The layer name.
	 * @param  {String} path - The path to output the file.
	 * @param  {Boolean} shouldOptimize - Optimize the layer.
	 * @param  {Boolean} shouldColorReduce - Reduce colors.
	 * @param  {Number} defaultColorReduce - Number of colors.
	 * @return {Object} The file object.
	 */
	function saveLayer(layer, lname, path, shouldOptimize, shouldColorReduce, defaultColorReduce, forceColorReduction) {
		var saveData = {};
	
		// activate layer and duplicate it
		activeDocument.activeLayer = layer;
		
		// create new document
		var docRef = app.activeDocument;
		var newDocRef = app.documents.add(docRef.width, docRef.height, 72, "tmp", NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
		
		// duplicate layer to new document
		app.activeDocument=docRef;
		layer.duplicate(newDocRef);
		app.activeDocument=newDocRef;
		
		// merge (apart from layerSets etc.)
		if (layer.typename != 'LayerSet') {
			activeDocument.artLayers.add();
			activeDocument.mergeVisibleLayers();
		}
	
		// set active layer	
		activeDocument.activeLayer = activeDocument.layers[0]
	
		// remember layer bounds for PLIST laster
		saveData.layerBounds = getLayerBounds(activeDocument.activeLayer);
		saveData.layerBoundsAsObject = getLayerBoundsAsObject(activeDocument.activeLayer);
		
		// don't do trimming or cropping on backgrounds
		if (!layer.isBackgroundLayer) {
			if (layer.typename == 'LayerSet') {
				activeDocument.crop(saveData.layerBounds);
			} else {
				activeDocument.trim(TrimType.TRANSPARENT, true, true, true, true);
			}
		}
		
		// try to save layer and close it
		try {
			if (getExtension(lname) === '.jpg') {
				saveData.file = File(path + '/' + getFileName(lname));
				saveAsOptimizedJPEG(saveData.file, getQualityOfJPG(lname));
			} else {
				saveData.file = File(path + '/' + getFileName(lname));
				SavePNG(saveData.file);
			}
			app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
	
		} catch (e) {
			return { error: e }
		}
		
		// get quality of png (in case of jpg it defaults to null)
		var qualityOfPNG = null;
		// only determine if requested and is png
		if (shouldColorReduce && getExtension(lname) === '.png') {
			if (forceColorReduction) {
				qualityOfPNG = defaultColorReduce || getQualityOfPNG(lname);
			} else {
				qualityOfPNG = getQualityOfPNG(lname) || defaultColorReduce;
			}
		}
		
		// do optimizations on image if requested
		if (shouldOptimize){
			try {
				// run ImageAlpha for file if installed and user requested it and then transfer to ImageOptim
				if (qualityOfPNG) {
					system(imageAlphaPath+'/Contents/MacOS/pngquant '+qualityOfPNG+' "' + saveData.file.fsName + '" --skip-if-larger --force --ext .png && open -a ImageOptim "' + saveData.file.fsName + '"')	
				// run only ImageOptim for file instead
				} else {
					system('open -a ImageOptim "' + saveData.file.fsName + '"');	
				}
				
			} catch (e) {
				alert("Export to Hype: Failed to optimize image", "Error", true);
			}
		} else {
			// run ImageAlpha for file if installed and user requested it
			if (qualityOfPNG) {
				system(imageAlphaPath+'/Contents/MacOS/pngquant '+qualityOfPNG+' "' + saveData.file.fsName + '" --skip-if-larger --force --ext .png')	
			}
		}
	
		// return data
		return saveData;
	}

	/**
	 * This function makes sure an art layer is selected
	 *
	 * @param {Object} el - The object containing layers.
	 * @return {Object} selected layer
	 */
	function selectAnyLayer(el) {
		for (var i = 0; i < el.layers.length; i++) {
			var layer = el.layers[i];
			if (layer.typename == 'ArtLayer') {
				layer.selected = true;
				activeDocument.activeLayer = layer;
				return layer;
			} else if (layer.typename == 'LayerSet') {
				return selectAnyLayer(layer);
			}
		}
	}
	
	
	/**
	 * This function gets the ImageAlpha path if it is installed
	 *
	 * @return {String} 
	 */
	function getImageOptimPath() {
		try {
			return new Folder('/Applications/ImageOptim.app').exists? '/Applications/ImageOptim.app' : null;
		} catch (e) {
			alert("Export to Hype: Error checking if ImageOptim is installed", "Error", true);
			return null;
		}
	}
	
	/**
	 * This function gets the ImageAlpha path if it is installed
	 *
	 * @return {String} 
	 */
	function getImageAlphaPath() {
		try {
			return new Folder('/Applications/ImageAlpha.app').exists? '/Applications/ImageAlpha.app' : null;
		} catch (e) {
			alert("Export to Hype: Error checking if ImageAlpha is installed", "Error", true);
			return null;
		}
	}

	/**
	 * This function generates a MD5 hash of the file content
	 *
	 * @param {string} path - The path to the file.
	 * @return {string} A MD5 hash of the contents of the file.
	 */
	function md5ForFile(path) {
		try {
			system('md5 "' + path + '" > ' + Folder.temp + '/temp_md5.txt');
			var fileMD5 = new File(Folder.temp + '/temp_md5.txt');
			fileMD5.open('r');
			var md5 = fileMD5.readln().split('=')[1].split(' ').join('');
			fileMD5.remove();
			return md5;
		} catch (e) {
			alert("Export to Hype: Error calculating the md5 file hash", "Error", true);
			return null;
		}
	}
	
	/**
	 * Open a URL in a browser.
	 * 
	 * @param {string} url - The URL to open.
	 */
	function openURL(url) {
		try{
			var fname = "openURL.webloc";
			var webloc = new File(Folder.temp + '/' + fname);
			webloc.open('w');
			webloc.writeln('<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>URL</key><string>'+url+'</string></dict></plist>');
			webloc.close();
			webloc.execute();
			webloc.remove();
		} catch(e){
			alert("Export to Hype: Error opening " + url, "Error", true);
			return null;
		}
	}


	/**
	 * Formats a date as string.
	 *
	 * @param {Date} date - The date to format.
	 * @return {String} The date in string format.
	 */
	function formatDate(date) {
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		// 2020-09-15T19:02:30Z
		var result = year + '-' + pad(month) + '-' + pad(day) + 'T' + pad(hours) + ':' + pad(minutes) + ':' + pad(seconds) + 'Z';
		return result;
	}


	/**
	 * Add leading zeros to a number.
	 * 
	 * @param {number} value - The number to add zeros to.
	 * @param {number} [padding=2] - The number of digits to add.
	 * @return {string} The string representation of the number with leading zeros.
	 */
	function pad(value, padding) {
		padding = padding || 2;
		var string = value.toString();
		while (string.length < 2) {
			string = '0' + string;
		}
		return string;
	}
	
	/**
	 * Return the extension of a file name.
	 *
	 * @param {string} name - The file name.
	 * @return {string} The extension of a file name.
	 */
	function getExtension(name) {
		var ext = name.match(/\.(jpg|jpeg)/g);
		return ext ? '.jpg' : '.png';
	}
	
	/**
	 * Return the name of the file from the full string.
	 *
	 * @param {string} name - the full name of the file.
	 * @return {string} the name of the file.
	 */
	function getFileName(name) {
		var ext = getExtension(name)
		var strippedName = name.split('.')[0];
		strippedName = strippedName.replace(/[^a-zA-Z0-9\s-]/g, '');
		strippedName = strippedName.replace(/^\s+|\s+$/g, "");
		strippedName = strippedName.replace(/\s+/g, '-');
		//if (strippedName.length > 120) strippedName = strippedName.substring(0, 120);
		return strippedName + ext
	}
	
	/**
	 * Extract quality level (1-100) from a filename.
	 * 
	 * @param {string} name - The filename to extract quality level from.
	 * @return {int} Quality level (1-100).
	 */
	function getQualityOfJPG(name) {
		var regex = /\.(jpeg|jpg)(\|(\d{1,3}))?/g;
		var result = regex.exec(name);
		if (result === null) return;
		if (result[3] === undefined) return 75;
		if (parseInt(result[3])>100) return 100;
		return parseInt(result[3]);
	}
	
	/**
	 * Extract quality level from a filename.
	 * 
	 * @param {string} name - The filename to extract quality level from.
	 * @return {int} Quality level.
	 */
	function getQualityOfPNG(name) {
		var regex = /\.(png)(\|(\d{1,3}))?/g;
		var result = regex.exec(name);
		if (result === null) return;
		if (result[3] === undefined) return;
		return parseInt(result[3]);
	}
	

	/**
	 * Saves the active document as a PNG file.
	 *
	 * @param {string} saveFile - The path to the file to save.
	 */
	function SavePNG(saveFile) {
		var pngOpts = new ExportOptionsSaveForWeb;
		pngOpts.format = SaveDocumentType.PNG
		pngOpts.quality = 100;
		pngOpts.PNG8 = false;
		pngOpts.transparency = true;
		pngOpts.interlaced = false;
		activeDocument.exportDocument(new File(saveFile), ExportType.SAVEFORWEB, pngOpts);
	}

	/**
	 * Saves the active document as an optimized JPEG file.
	 *
	 * @param {File} saveFile - The file to save the document as.
	 * @param {Number} jpegQuality - The quality of the JPEG to save.
	 */
	function saveAsOptimizedJPEG(saveFile, jpegQuality) { 
		var sfwOptions = new ExportOptionsSaveForWeb();
		sfwOptions.format = SaveDocumentType.JPEG;
		sfwOptions.includeProfile = false;
		sfwOptions.interlaced = 0;
		sfwOptions.optimized = true;
		sfwOptions.quality = jpegQuality;
		app.activeDocument.exportDocument(saveFile, ExportType.SAVEFORWEB, sfwOptions);
	}

	/**
	 * This function gets the layer bounds (corrected to activeDocument)
	 *
	 * @param {Layer} layer - The layer to get the bounds from
	 * @returns {Array} - The bounds of the layer
	 */
	function getLayerBounds(layer) {
		 try {
			 if (layer.kind == LayerKind.SMARTOBJECT) {
				 var layer0 = activeDocument.activeLayer;
				 activeDocument.activeLayer = layer;
				 var r = new ActionReference();
				 r.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
				 var d = executeActionGet(r).getObjectValue(stringIDToTypeID("smartObjectMore")).getList(stringIDToTypeID("transform"));
				 var x = [d.getDouble(0), d.getDouble(2), d.getDouble(4), d.getDouble(6)];
				 var y = [d.getDouble(1), d.getDouble(3), d.getDouble(5), d.getDouble(7)];
				 var l = [Math.min(x[0], Math.min(x[1], Math.min(x[2], x[3])))];
				 var r = [Math.max(x[0], Math.max(x[1], Math.max(x[2], x[3])))];
				 var t = [Math.min(y[0], Math.min(y[1], Math.min(y[2], y[3])))];
				 var b = [Math.max(y[0], Math.max(y[1], Math.max(y[2], y[3])))];
				 activeDocument.activeLayer = layer0;
				 return [UnitValue(Math.max(0, l), "px"), UnitValue(Math.max(0, t), "px"), UnitValue(Math.min(activeDocument.width, r), "px"), UnitValue(Math.min(activeDocument.height, b), "px")];
			 } else {
				 var l = Math.max(0, layer.bounds[0]);
				 var t = Math.max(0, layer.bounds[1]);
				 var r = Math.min(activeDocument.width, layer.bounds[2]);
				 var b = Math.min(activeDocument.height, layer.bounds[3]);
				 return [UnitValue(l, "px"), UnitValue(t, "px"), UnitValue(r, "px"), UnitValue(b, "px")];
			 }
		 } catch (e) {
			 alert("Export to Hype: Failed to get layer bounds (" + e + ")", "Error", true);
		 }
	 }

	/**
	 * This function gets the layer bounds in object notation  (corrected to activeDocument)
	 * and calculates the additional parameter width and height
	 *
	 * @param {Layer} layer
	 * @returns {Object}
	 */
	function getLayerBoundsAsObject(layer) {
		var lb = getLayerBounds(layer);
		return {
			left: parseInt(lb[0]),
			top: parseInt(lb[1]),
			right: parseInt(lb[2]),
			bottom: parseInt(lb[3]),
			width: parseInt(lb[2]) - parseInt(lb[0]),
			height: parseInt(lb[3]) - parseInt(lb[1]),
		};
	}

	/**
	 * This function saves a text file
	 *
	 * @param {string} filePath - The path of the file to be saved
	 * @param {string} content - The content to be saved in the file
	 * @returns {string} - The error message if there is any error, null otherwise
	 */
	function saveAsPlistFile(filePath, content) {
		var saveFile = new File(filePath);
		saveFile.encoding = "UTF8";
		saveFile.open("w");
		if (saveFile.error) return saveFile.error;
		saveFile.write(content);
		if (saveFile.error) return saveFile.error;
		saveFile.close();
		if (saveFile.error) return saveFile.error;
		return null;
	}

	/**
	 * function from below compiled with closure compile to support template literals in JSX
	 *
	 */
	var $jscomp = $jscomp || {};
	$jscomp.scope = {};
	$jscomp.createTemplateTagFirstArg = function(a) { return a.raw = a };
	$jscomp.createTemplateTagFirstArgWithRaw = function(a, b) { a.raw = b; return a };

	function dataPlistString(a) {
	  var b = a.width, c = a.height;
	  return '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n\n\t<key>documentVersion</key>\n\t<string>648</string>\n\n\t<key>lastCheckDate</key>\n\t<date>2020-10-05T19:20:24Z</date>\n\n\t<key>oidCounter</key>\n\t<integer>11</integer>\n\t<key>resourcesInfo</key>\n\t<dict>\n\t\t<key>groups</key>\n\t\t<array>\n\t\t\t' + a.groups + "\n\t\t</array>\n\t\t<key>posterImageExportSettings</key>\n\t\t<dict>\n\t\t\t<key>exportName</key>\n\t\t\t<string>poster</string>\n\t\t\t<key>format</key>\n\t\t\t<string>jpg</string>\n\t\t\t<key>resolution</key>\n\t\t\t<string>@1x</string>\n\t\t</dict>\n\t\t<key>resources</key>\n\t\t<array>\n\t\t\t" + 
	  a.resources + "\n\t\t</array>\n\t</dict>\n\n\t<key>sceneContainers</key>\n\t<array>\n\t\t<dict>\n\t\t\t<key>currentSceneOid</key>\n\t\t\t<string>12</string>\n\t\t\t<key>name</key>\n\t\t\t<string>Symbol</string>\n\t\t\t<key>oid</key>\n\t\t\t<string>13</string>\n\t\t\t<key>scenes</key>\n\t\t\t<array>\n\t\t\t\t<dict>\n\t\t\t\t\t<key>canvasSize</key>\n\t\t\t\t\t<string>{0, 0}</string>\n\t\t\t\t\t<key>hypeScene</key>\n\t\t\t\t\t<dict>\n\t\t\t\t\t\t<key>backgroundColor</key>\n\t\t\t\t\t\t<string>#FFF</string>\n\t\t\t\t\t\t<key>breakpointWidth</key>\n\t\t\t\t\t\t<real>600</real>\n\t\t\t\t\t\t<key>name</key>\n\t\t\t\t\t\t<string>Untitled Layout</string>\n\t\t\t\t\t\t<key>perspective</key>\n\t\t\t\t\t\t<real>600</real>\n\t\t\t\t\t\t<key>sceneScalePercentageSize</key>\n\t\t\t\t\t\t<string>{1, 1}</string>\n\t\t\t\t\t\t<key>sceneSize</key>\n\t\t\t\t\t\t<string>{" + 
	  b + ", " + c + "}</string>\n\t\t\t\t\t\t<key>shouldScaleSceneHeight</key>\n\t\t\t\t\t\t<false/>\n\t\t\t\t\t\t<key>shouldScaleSceneWidth</key>\n\t\t\t\t\t\t<false/>\n\t\t\t\t\t</dict>\n\t\t\t\t\t<key>oid</key>\n\t\t\t\t\t<string>12</string>\n\t\t\t\t\t<key>rootSymbolControllerOid</key>\n\t\t\t\t\t<string>8</string>\n\t\t\t\t\t<key>scrollViewOffset</key>\n\t\t\t\t\t<string>{0, 0}</string>\n\t\t\t\t</dict>\n\t\t\t</array>\n\t\t</dict>\n\t</array>\n\n\t<key>symbolDisplayMode</key>\n\t<integer>0</integer>\n\t<key>symbols</key>\n\t<array>\n\t\t<dict>\n\t\t\t<key>documentIdentifier</key>\n\t\t\t<string>E583F3EB-7A7F-48E6-AECE-2889E0765764-3465-00001E61DF926BF9</string>\n\t\t\t<key>selectedObjects</key>\n\t\t\t<array/>\n\t\t\t<key>symbol</key>\n\t\t\t<dict>\n\t\t\t\t<key>addToNewSceneControllers</key>\n\t\t\t\t<false/>\n\t\t\t\t<key>currentTimelineIdentifier</key>\n\t\t\t\t<string>kTimelineDefaultIdentifier</string>\n\t\t\t\t<key>customBehaviors</key>\n\t\t\t\t<array/>\n\t\t\t\t<key>elements</key>\n\t\t\t\t<dict>\n\t\t\t\t\t" + 
	  a.elements + "\n\t\t\t\t</dict>\n\t\t\t\t<key>isPersistentSymbol</key>\n\t\t\t\t<false/>\n\t\t\t\t<key>name</key>\n\t\t\t\t<string>" + a.hypeName + "</string>\n\t\t\t\t<key>oid</key>\n\t\t\t\t<string>8</string>\n\t\t\t\t<key>onTopDuringSceneTransition</key>\n\t\t\t\t<true/>\n\t\t\t\t<key>preferredSize</key>\n\t\t\t\t<string>{" + b + ", " + c + "}</string>\n\t\t\t\t<key>properties</key>\n\t\t\t\t<dict>\n\t\t\t\t\t<key>PhysicsGravityAngle</key>\n\t\t\t\t\t<real>180</real>\n\t\t\t\t\t<key>PhysicsGravityForce</key>\n\t\t\t\t\t<real>1</real>\n\t\t\t\t\t<key>PhysicsGravityInheritFromParent</key>\n\t\t\t\t\t<false/>\n\t\t\t\t\t<key>PhysicsGravityUsesDeviceTilt</key>\n\t\t\t\t\t<false/>\n\t\t\t\t</dict>\n\t\t\t\t<key>removeWhenNoLongerReferenced</key>\n\t\t\t\t<true/>\n\t\t\t\t<key>showInResourceLibrary</key>\n\t\t\t\t<" + 
	  (a.saveAsSymbol ? "true" : "false") + "/>\n\t\t\t\t<key>timelines</key>\n\t\t\t\t<array>\n\t\t\t\t\t<dict>\n\t\t\t\t\t\t<key>animations</key>\n\t\t\t\t\t\t<array/>\n\t\t\t\t\t\t<key>firstKeyframeIsRelative</key>\n\t\t\t\t\t\t<false/>\n\t\t\t\t\t\t<key>framesPerSecond</key>\n\t\t\t\t\t\t<integer>30</integer>\n\t\t\t\t\t\t<key>hidden</key>\n\t\t\t\t\t\t<false/>\n\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t<string>kTimelineDefaultIdentifier</string>\n\t\t\t\t\t\t<key>loop</key>\n\t\t\t\t\t\t<false/>\n\t\t\t\t\t\t<key>name</key>\n\t\t\t\t\t\t<string>Main Timeline</string>\n\t\t\t\t\t\t<key>userDefinedDuration</key>\n\t\t\t\t\t\t<real>0.0</real>\n\t\t\t\t\t</dict>\n\t\t\t\t</array>\n\t\t\t</dict>\n\t\t</dict>\n\t</array>\n\n</dict>\n</plist>\n";
	}
	
	function groupPlistString(a) { return "\n\t\t\t<dict>\n\t\t\t\t<key>expanded</key>\n\t\t\t\t<true/>\n\t\t\t\t<key>isPosterImageGroup</key>\n\t\t\t\t<false/>\n\t\t\t\t<key>name</key>\n\t\t\t\t<string>" + a.name + "</string>\n\t\t\t\t<key>oid</key>\n\t\t\t\t<string>" + a.resourceId + "</string>\n\t\t\t\t<key>resources</key>\n\t\t\t\t<array>\n\t\t\t\t\t<string>" + a.fileName + "</string>\n\t\t\t\t</array>\n\t\t\t</dict>\n\t" }

	function resourcePlistString(a) { return "\n\t\t\t<dict>\n\t\t\t\t<key>fileModificationDate</key>\n\t\t\t\t<date>" + a.modified + "</date>\n\t\t\t\t<key>fileSize</key>\n\t\t\t\t<integer>" + a.fileSize + "</integer>\n\t\t\t\t<key>md5</key>\n\t\t\t\t<string>" + a.md5 + "</string>\n\t\t\t\t<key>notifyOnBookmarkChange</key>\n\t\t\t\t<true/>\n\t\t\t\t<key>originalPath</key>\n\t\t\t\t<string>" + a.originalPath + "</string>\n\t\t\t\t<key>resourceName</key>\n\t\t\t\t<string>" + a.fileName + "</string>\n\t\t\t\t<key>shouldAutoResize</key>\n\t\t\t\t<true/>\n\t\t\t\t<key>shouldIncludeInDocumentHeadHTML</key>\n\t\t\t\t<false/>\n\t\t\t\t<key>shouldPreload</key>\n\t\t\t\t<true/>\n\t\t\t\t<key>shouldRemoveWhenNoLongerReferenced</key>\n\t\t\t\t<true/>\n\t\t\t\t<key>type</key>\n\t\t\t\t<string>FileResource</string>\n\t\t\t</dict>\n\t" }

	function elementPlistString(a) {
		return "\n\t\t\t\t\t<key>" + a.key + "</key>\n\t\t\t\t\t<array>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>DisplayName</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>" + a.name + "</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>Position</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>absolute</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>OriginalWidth</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>" +
			(a.originalWidth + "px</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>SizeRatio</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>") + Math.floor(a.originalWidth / a.originalHeight * 1E3) / 1E3 + "</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>Left</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>" + (a.left + "px</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>OriginalHeight</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>") +
			(a.originalHeight + "px</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>Display</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>inline</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>Opacity</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>") + a.opacity + "</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>ConstrainProportions</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>YES</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>Height</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>" +
			(a.height + "px</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>Overflow</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>visible</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>Width</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>") + (a.width + "px</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>Top</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>") +
			(a.top + "px</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>BackgroundImageResourceGroupOid</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>") + a.resourceId + "</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>BackgroundSize</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>100% 100%</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>BackgroundRepeat</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>no-repeat</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>TagName</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>div</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>AccessibilityRole</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>img</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>ZIndex</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>" +
			a.zIndex + "</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t\t<dict>\n\t\t\t\t\t\t\t<key>identifier</key>\n\t\t\t\t\t\t\t<string>ClassType</string>\n\t\t\t\t\t\t\t<key>objectValue</key>\n\t\t\t\t\t\t\t<string>Image</string>\n\t\t\t\t\t\t</dict>\n\t\t\t\t\t</array>\n\t"
	};



	/**
	 * function returning embeded image
	 *
	 */

	function getLogoImage() {
		var imgString = "%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%C2%AF%00%00%00%3C%08%03%00%00%00'%C2%BE%1A%C2%AA%00%00%00%04gAMA%00%00%C2%B1%C2%8F%0B%C3%BCa%05%00%00%00%01sRGB%00%C2%AE%C3%8E%1C%C3%A9%00%00%00%60PLTE%C3%A9%C3%A9%C3%A9%C3%A2%C3%A1%C3%A2%C2%A5%C2%A4%C2%A3%C3%AD%C2%AE%5B%C2%85%C2%83%C2%82%C3%B79%05%C3%B3%C2%BAiSSS%C3%86%C3%86%C3%87%C3%B0%C3%B6%C3%B6%1C%1C%1C%C3%BD%C3%BE%C3%BE%C3%B8%C2%A21%C3%BC%C2%91%10%40%40Ausq%C3%99%C3%99%C3%99%C3%BES%03%C2%B4%C2%B4%C2%B4a%60%5E%C3%B7%0F%00001%03%05%09%C3%8D%C2%9B_%C3%8F%C3%91%C3%91%C2%A6%C2%8Ap%C2%97%C2%96%C2%95%C3%B0%C2%B2%C2%9A%C3%B4hH%C2%AFg%3C%C3%B7%C3%9C%C3%95%C3%B6%C2%8Dx%07%12%C3%94%C2%80%00%00%07FIDATh%C3%9E%C3%AD%C2%9A%C2%8Bv%C3%A28%0C%C2%86m'4%C3%97b7%06r!%C2%81%C3%B7%7F%C3%8B%C2%95%C3%A4K%C3%AC%C3%9C%C3%A8%C3%8Ct%C2%B7%C2%9DsVd%18%08i%C3%BC%C3%A5%C2%8F%24K%06%C2%96%C3%BD%5D%C3%86%C3%BE%C3%A7%C3%BD%C2%8Fx%C2%B5L%C3%BBC%C2%93%C3%BA%07%C3%B1%C3%AA%C2%BEM%C2%92%C3%A4%C2%8D%1E%C3%BE%C3%BF%C2%B7%C3%B9%C2%81%C3%AF%C3%9A%5E%C3%BE%14%C3%9E%1E!_Z%C2%92%C3%B4%C3%BA'%C3%B0%C3%AA%C2%96%60%13%C3%BAg%C2%B9%C2%93%16%1E%C3%915%C3%90%C3%87%C2%89%C3%BC~%5E%C3%84MfR%40%05_%C3%95%3A%C2%83%7F%C2%B2o%C2%93%C2%85%C3%84%C3%B2%C3%9By%C3%9B%C3%9A%C3%81%C3%A2S%0B%C3%B7%C3%BC%1CX%26%C3%9B%08%C2%B8%C3%BD%C2%AA%C2%A1%C3%93T%C3%BE%16oZ%C2%9B%C3%98%22%C3%A6V%12%C3%AC%C3%95%C2%B0%5E%C3%81%C3%A0%C2%B5%0E%C2%89%C2%93%3E%3AA%C3%8EfK%C2%B3%C2%AC%C3%89%C3%81%C2%88c%C2%B0%C2%AFR%C3%B7i%C3%9E%04%7CCg%C3%B6%C2%A5%C3%8B%C3%B3p%7BX%C3%8A%22Kg%C3%9E%C3%96%C3%84%3Fm%7D%24%C2%AD%25%06f%C3%A9%C3%94G%C2%8F%C3%90%07%C2%BC4L%C2%83%1F(%C3%84Y%0C%C3%9C%C3%98%3F%C2%95%C2%9D%C2%A3c%C2%B9%5E%C2%9FG%1C%C3%B1%C3%AA%C3%84%C3%99%5B%C2%A2%C2%BD%C2%B2%06%C3%96%C3%A2%C2%96%C3%A55k%7D%C3%94%25%C3%A9%01%C2%AFy%0F%0A%0DnG4pn%C2%92'_%C3%AD%C2%8A%C3%8E%C2%83%C3%80%C2%BB%C2%BC%C2%A9%C2%83%7Dk%C2%97%C3%A2%C2%9E%C2%AF%C2%96%C2%B8%2C%C3%8Bs%C3%AB%24%C2%AE%C3%BB%25%2F%C3%8F%C2%8D%C3%A1%C2%8D%C2%94v%C2%BC%C3%9C%C2%A1%18%C3%85%C2%85h%C2%98%C2%BD%12%C3%8B%C3%86%1B%C2%91%7B5%C3%8D%3E%25%C2%84%C3%9D%C2%A73%C2%89'%C2%A4%C3%9B%C3%90y%17%23%C3%9E%C2%BE%C2%B6%C3%80%1B%C2%B8N_%C2%92%C2%B8usI%C2%BB%C3%A4%C3%8D%C3%83%1D%C3%88%C3%85%C2%B5%C3%B4p%C2%A9%C2%93GF%C2%B7%C2%9AK%C3%BFJG%C3%A7%11%C2%B8o%C2%B0!%19J%1B%C3%B0%C3%96%60%13%C2%AA%C2%88v%C2%A5%C3%8D%C3%98%C2%AD%C2%BCy%2B'%3C%0E%0E%3E%C3%A65X%C3%82%C2%B9q0fg%0Fmf%C2%8A%19n%3E%C3%8F%C2%AC%C3%B9%26o%0B%C3%A9%C3%A1%0E6%C2%A4%C2%A9%C3%99%C2%9C%C3%89T%C2%86%06%C3%89%18%0F%03%C2%89%C2%8Fy%09G)'o0%C2%A6%3B%14%C2%BDW%05%17%C2%97%C3%BF%22o%7D%2F%C3%90*g%C3%B4%C2%8E1%C3%9C%0A%7C%C3%A6%5C)%C3%95)%C2%95%C3%A7M%C2%937%C3%B5%C2%9A%17%C3%BD%0E%C3%8C%C2%95%226%C2%9A%C2%9A%C3%A5%C2%98%C3%9C%C3%AC%C3%94%C3%81%C2%87%3E%C2%8B%C3%8C%C2%BC%C3%83%0B%7F%40%5Edb%5Ca~%C3%A1%1D%C3%A7%C3%88%C3%96%C2%A9%C2%AE%C2%83gp%C3%B6%0E)%C3%9D%C2%96%C2%8B%C2%BAn%C3%B5v~p%C2%BB%04%C2%9BC%2B%18%C2%B3%C2%B1%20i%20%C2%A0%C3%B9%C3%B3%C2%90w%C3%A0%5B%7F%1B%C3%B36%1C%C3%A5-%3AT%C2%B1%23Fk%C2%8D%C2%91T%60x%C2%8B%5C%C3%A1%1E%01%1E%C2%9C%1D%C3%B3J%C2%93X%C2%B3%60L8%25q(%7D%C3%84kS%C3%B2%C2%AC%C3%BE%0Eo%2BztPa%C3%81%C2%A2m6%C2%B8%C2%93%19%C3%96%13u%C2%B2%C3%90%C2%97%2Fx%C3%8D%C3%90%3C%C3%94%C3%88%C2%B1%C3%B8%C2%A4%C2%B0%C3%8F%C2%8BW%C2%A7%0Fy%C2%93%C3%BA%C3%BD%0C%C2%A9%C3%A0%C2%AC(%C3%A5%C2%81%C2%BE%24%C2%B4%C2%B5%C2%8E%0C%3E%60%1Ar%C3%84%15%12%C3%84%C3%9A%1F%3A%13%C2%A0Y%0C%C3%98%C2%ACx%3B%C3%A9%03%C3%8A%C2%A9%C3%8FC%C3%BFu%C2%B3%C2%85%3F%C3%BF%5E~h1%C3%99%C3%A6%15%C2%B7JA%C2%94Yc%14y%C2%8C%C3%BC%C2%9BA%1E.!%09%C2%AF%C3%B4%5D%C3%A4%07%C3%9C%C3%93%C2%B08%3F%C3%A0%05%0B%19%C3%84X%C2%98%1F%C2%9A%20nYt%C2%BA%3D%C3%9E%09f%06%5D)%C3%8E-%C2%B1%C3%A14%C3%99%C3%81%C3%90B%C2%8E%C2%A8%C3%A4%C3%ADZ%C3%AA%C2%97%C2%BC)M%01%3E%C3%AE7%C3%86l%C3%A6%0C%C3%90%2C%C3%B3o%13%1D%C2%BD%C3%A7%0FP7%C2%94b%C3%A6-%02%C2%85%C2%9D%C2%BC%5C%159N%26%C3%89%2B%5EE%C2%8A%C3%B9%C3%B2acL%C3%A9%5D%C2%99%C2%8ER%C3%A1y(%19v%2Fx%13%C2%9C%7C%3B%C2%86%C2%BC%18%3C%0E%C2%B6b6%0D%C2%93%C2%BE%C3%B0%19x98%C3%84%C2%9A%C3%97%C3%95%0F%C2%83C%C2%90%C3%861%C2%BB%C3%AD1w%C3%AB%C2%87%C3%9C%25Cq%C3%8C%0B%C3%AE%7B%C3%8D%0C%C2%94%C3%B7%C2%86%C2%8A%1EN%60%C3%94WU%1A%1Cb%C3%9A%C3%A0%0D%C3%AB%40e%1D%C3%92%C3%8F%C2%B4%1B%C2%BC%C2%BA%0Bk%C3%8C%C3%B8%3E%C2%91%C3%80%5C%1F%C3%B2%C2%A2%C3%BB%C3%8Abv%C2%87%C3%82%C3%B0%120%2Bf%07No%C3%97%C3%9B%0B%5E%C3%A1F%C2%A0q%7D%C2%BA%C2%8DyC%C3%A0f%C3%A9Wbsn%5C%C3%B2%C2%96i%11%C2%BA%2F%C3%A1V%C3%B6%C3%89%C2%8A%C3%8C%2B%01%C3%A5%C2%8F%06%C3%9El%C2%97W%C3%BB%C3%BC%C3%A4o%C3%AC%16%C3%AFN%7F%C2%91%C3%BB%00X%C3%95%1E%2B%7D%07%0A%C2%B7%C3%99%1DL%25%C3%B1p%C3%8E%C2%8B%C2%A9%C2%98%09Hh%19%C3%8E%C3%87Z%7F_%C3%BFF%C2%BC%C3%99u%08%C3%B5%C2%AD%2C%C3%B0%C3%A3%C2%B4m%C2%97%C3%A9%C3%BB%C3%BAc%C2%98%C2%8F%C2%A7%C2%B3%C3%A3%0D%C3%83%0D%C2%8C%C2%9F.%3F%C2%8F%C3%B7%C2%9Dxg%C3%BF5%C3%A9%C2%8C%C3%B2%03%1B%03%C3%88%0Fo%C2%A7K%C3%BF%C2%BD%C2%BC%C3%A0%0F%1A%C3%AA%C3%89yz%C2%AB%2C%C3%B1x%C3%99%04~%C3%89%2B%C3%93T%C3%BF%7B%C2%BC5%C2%B6j%C2%8A%05%02%C2%BB%C3%A9m%C2%9Bw%C3%96w%C2%B3%C2%8B%C2%95%C2%8D%C2%A9%1D%C3%85%02%19%C3%97%26%5C%C2%B6%C2%A5%C3%99E%C3%A7~%C2%8F%C2%B4%C3%B3%C2%8DK7*%1F%C3%B4V%03ny!%C2%A1%C2%89%22%C2%A8%1F%1C%C3%B0%C3%B3r%C2%BA%3C%C3%B9%23%C2%B2%11x%C3%93%03%5E1%C2%97%C2%8FC%C2%B6%C3%93%3A%C3%99%5C7%C2%97E%C3%82t%C3%85a%19%C3%8C%C3%93%5D%C3%9E%C2%A9%3C%C2%97%C2%B2Rq%C3%81%C3%83%1C%C2%AF%C3%95%C3%9A%C2%B5K%C3%A0%C3%93%17%C2%B9%C3%8F%2B%C2%B6%C2%96%0Dvx%7D%C3%8B%C3%AC%C2%A7%C3%85h%19B%C3%AE%C3%B1%C2%B6%25t%C3%AE%C2%AAp%05%043%C3%8D%1Bs%C2%BCf%C3%8As%C2%BC%C3%A0%0F'%C3%87%C2%BB%5E%250W%C3%90%C2%89F%C2%B1%60b%C3%9D%C3%A15%C2%BDiPu%C3%B8vPE%C2%8D%C3%A8%C2%BC%C3%80ax%C3%9F%C2%AF8sUa~0%C3%A5%C3%83%1Dx%C3%87%C2%A2%C3%A0%23%C3%9A%C2%93%C2%9EG%C3%A4%C3%95%C3%8B%0A%C3%92%2BI%C2%A7G%C2%A5t%1EV.%3B%C2%BC%C3%92V%19MX%06%C3%A7%C2%9B%C2%8D%C3%9D%1Co%C3%AF%C3%89%C2%BD%C3%87%C3%A6%1D%C3%9A%08l%2F%C3%9D%C2%86%C3%8A%09%C3%83%C3%8B.%60%C2%A7%0F%17q%C2%A7q%C2%97W.V%C2%9D%C3%941%C2%AF)%C3%AEM%C3%8B%2C%C3%97mr%C2%BA%C3%8D%7B%C3%AF%C3%80%0D%0A%C3%AEz%C3%8C%06L%C3%90%C3%96%0C%C3%A0%C2%AB%23%C3%A8%7DB%5E%C2%9F%25.c%C2%B6%C3%87%1B%C2%AE%C3%8E%04M%C3%86.%2FU%C3%B7%04%C2%97%C3%87%C3%87%C2%A4%07%C2%BC-.1%C3%98%0D%3B7%C3%9B%C3%89C%C3%9F%C3%96%20!%C3%B0%C3%9Eg%7B%02%C3%AF%C2%B4%C3%8B%1B2%0E%C2%8B%C2%88%0B%C2%96*%C3%A2%C2%BA%C2%97%C2%8A%C2%9Ft%C2%A3L%C2%93%C2%AB%05%0E%C2%A3o%14%C3%BFA%C3%ABV(%C3%A4%7D%14a%C2%BC%C3%9DOG%C2%BCy%C3%90(%C2%A7%0B%07%C3%8E%C3%A3d%22%C3%BCA%5D%C2%BCL%C2%89%2F%C2%A5w%C2%A6x%C3%81%C3%80%C3%A8%C2%8B%26%C3%8F%C2%9A%2C%C3%83%C2%877%2C%16%1EQ%3E%7B%C2%9E%C2%96%C3%93%C3%9B%C3%AF%C3%B0r%C3%BF%C2%89-%C2%85%C2%87%C2%A8%5D%C3%A9X%C3%A4%C3%A1!o%C3%BF%5E%C2%BF%C2%A3M%C2%B7-%C2%9B%20%19%3C%C3%AF%C3%8F%C2%A7u%C2%86%C3%87%1F%C3%B2%C3%B2%C2%95%C2%BE%C3%86k%7C%5C%C3%A6%C2%AB%C3%8E%23%5E%C3%A00%C2%BC%C3%B0%00%C2%BB%C3%9D%C3%8A%C2%A5%11%C3%AF%C3%85%1AJ%C2%8D%C3%93%C3%85%11%C2%AF%08%C3%BCWl%C3%B8%C2%AF%5D%C2%AA%08%C2%AFD%05%C3%B2F%C3%8B%10%5B%0B%1C%C3%84%5B%C2%9B%C2%AD.o%5B%C2%BC%C2%97'c%C2%90%C2%87)%C2%99%15%C2%86W%C3%AE%C3%B2%0E%C2%BF%C2%98%1F%C3%9Ce-%C3%9B%C3%97%C3%86%C2%95%0F%C2%AB%C3%BC%20%C3%81%17%1C%C3%B0y)%C2%B1%C3%A1%C2%A5y%03xO%1F8%1D%7F%C2%9C%0Ex%C3%A5%7Cs%25%C3%BBD%C3%BE%C3%9D%C3%A2%C3%8D%C2%B3%C3%BD%05%5B%C3%BC%C2%BE%C3%85%C3%A2%22%C3%B0T%C3%86%C3%84%C2%B7%C2%B3%C3%A1%7D%C2%8C%C3%A0%15%1F%1FO3%1D%1F%C3%B0%1AQ%1B%C3%9FS%0E_%C3%8Fk%05%C2%B6%12g%C2%B4%C2%94NK%C3%AB%C2%8Ew%C2%A4%C3%AA%C2%87%C2%82%C2%AD%C2%AA%C3%98j%3A%C2%8EyeT%3F(%C3%BD%25%C2%BC%C3%B3%02%07%7D_hp%5D%C3%9CM%C3%97%20%3F%C2%94%C3%84%1B%C3%A4%C2%B3%C3%87%0B%5E%1B%C3%AF%2CZ%C2%A3%C3%BCS%C3%9E9%04%C3%A9%C3%BB%C3%98%C3%B1%C2%9D%24%26%60%C3%8A%14%C3%93%C3%99%7C%C2%83q%3DO8a%C2%8C%C3%8F%3B'%C3%9E%07%C3%8En%C3%8B%C3%A9x%C3%99u%0F%3B%C2%B8_%C3%86%C2%9B%C3%A9%C3%96%02%07%C3%88%C2%B5%7DC%C3%AD%25%C3%A4%C2%B2%11fb%085*%1F%C2%A6C%C3%9E%C3%9D%C3%BE%C3%A2%C3%8Bx3Hj%7B%C3%A6%5B%C3%A2%C2%8Bo%C2%88%3E%C3%91%1D%C3%BF%C2%8B%C3%BD%C2%9B%C3%BF%C2%BD%C3%866%2Fq%C2%86%C3%AD%1B%C2%90%7F%5B7%1F%C3%BD~GB%0D%C3%9C%C3%8B%3EM%7B9%3Fd%3A%C2%B9Z%12Y%C3%B1%C3%B58%C3%89%1F%C3%81%C2%BBgZ%C3%B6%13%C2%B9%03rO%C3%9F%C3%BC3%C2%9EO%C3%BE%3E%C2%8Ad%C2%9E~%C3%80O%C2%8E%3E%C3%BF%7B.%C3%BD%C2%A3~%1F%C3%B5%C3%B7%C3%BD%C3%BE%C3%AC%C3%AF%C2%B0%7F%00l%130%1E%054%C3%B9%C3%AC%00%00%00%00IEND%C2%AEB%60%C2%82"; 
		return imgString;
	}


	// IIFE end
})();


/*
These are the PLIST functions as template literals. 
Sadly ExtendScript doesn't support ES6 syntax, so after modifications
please compile them down to ES5 using something like Closure Compiler
and replace the corresponding function above.
*/ 

/*

function dataPlistString(o){
	var hypeName = o.hypeName;
	var width = o.width;
	var height = o.height;
	var resources = o.resources;
	var groups = o.groups;
	var elements = o.elements;
	var showInResourceLibrary = o.saveAsSymbol? 'true' : 'false';

	return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	
	<key>documentVersion</key>
	<string>648</string>
	
	<key>lastCheckDate</key>
	<date>2020-10-05T19:20:24Z</date>
	
	<key>oidCounter</key>
	<integer>11</integer>
	<key>resourcesInfo</key>
	<dict>
		<key>groups</key>
		<array>
			${groups}
		</array>
		<key>posterImageExportSettings</key>
		<dict>
			<key>exportName</key>
			<string>poster</string>
			<key>format</key>
			<string>jpg</string>
			<key>resolution</key>
			<string>@1x</string>
		</dict>
		<key>resources</key>
		<array>
			${resources}
		</array>
	</dict>		

	<key>sceneContainers</key>
	<array>
		<dict>
			<key>currentSceneOid</key>
			<string>12</string>
			<key>name</key>
			<string>Symbol</string>
			<key>oid</key>
			<string>13</string>
			<key>scenes</key>
			<array>
				<dict>
					<key>canvasSize</key>
					<string>{0, 0}</string>
					<key>hypeScene</key>
					<dict>
						<key>backgroundColor</key>
						<string>#FFF</string>
						<key>breakpointWidth</key>
						<real>600</real>
						<key>name</key>
						<string>Untitled Layout</string>
						<key>perspective</key>
						<real>600</real>
						<key>sceneScalePercentageSize</key>
						<string>{1, 1}</string>
						<key>sceneSize</key>
						<string>{${width}, ${height}}</string>
						<key>shouldScaleSceneHeight</key>
						<false/>
						<key>shouldScaleSceneWidth</key>
						<false/>
					</dict>
					<key>oid</key>
					<string>12</string>
					<key>rootSymbolControllerOid</key>
					<string>8</string>
					<key>scrollViewOffset</key>
					<string>{0, 0}</string>
				</dict>
			</array>
		</dict>
	</array>

	<key>symbolDisplayMode</key>
	<integer>0</integer>
	<key>symbols</key>
	<array>
		<dict>
			<key>documentIdentifier</key>
			<string>E583F3EB-7A7F-48E6-AECE-2889E0765764-3465-00001E61DF926BF9</string>
			<key>selectedObjects</key>
			<array/>
			<key>symbol</key>
			<dict>
				<key>addToNewSceneControllers</key>
				<false/>
				<key>currentTimelineIdentifier</key>
				<string>kTimelineDefaultIdentifier</string>
				<key>customBehaviors</key>
				<array/>
				<key>elements</key>
				<dict>
					${elements}
				</dict>
				<key>isPersistentSymbol</key>
				<false/>
				<key>name</key>
				<string>${hypeName}</string>
				<key>oid</key>
				<string>8</string>
				<key>onTopDuringSceneTransition</key>
				<true/>
				<key>preferredSize</key>
				<string>{${width}, ${height}}</string>
				<key>properties</key>
				<dict>
					<key>PhysicsGravityAngle</key>
					<real>180</real>
					<key>PhysicsGravityForce</key>
					<real>1</real>
					<key>PhysicsGravityInheritFromParent</key>
					<false/>
					<key>PhysicsGravityUsesDeviceTilt</key>
					<false/>
				</dict>
				<key>removeWhenNoLongerReferenced</key>
				<true/>
				<key>showInResourceLibrary</key>
				<${showInResourceLibrary}/>
				<key>timelines</key>
				<array>
					<dict>
						<key>animations</key>
						<array/>
						<key>firstKeyframeIsRelative</key>
						<false/>
						<key>framesPerSecond</key>
						<integer>30</integer>
						<key>hidden</key>
						<false/>
						<key>identifier</key>
						<string>kTimelineDefaultIdentifier</string>
						<key>loop</key>
						<false/>
						<key>name</key>
						<string>Main Timeline</string>
						<key>userDefinedDuration</key>
						<real>0.0</real>
					</dict>
				</array>
			</dict>
		</dict>
	</array>
	
</dict>
</plist>
`;
}



function groupPlistString (o){
	var name = o.name;
	var fileName = o.fileName;
	var resourceId = o.resourceId;

	return `
			<dict>
				<key>expanded</key>
				<true/>
				<key>isPosterImageGroup</key>
				<false/>
				<key>name</key>
				<string>${name}</string>
				<key>oid</key>
				<string>${resourceId}</string>
				<key>resources</key>
				<array>
					<string>${fileName}</string>
				</array>
			</dict>
	`;
}

function resourcePlistString (o){
	var name = o.name;
	var fileName = o.fileName;
	var fileSize = o.fileSize;
	var originalPath = o.originalPath;
	var resourceId = o.resourceId;
	var modified = o.modified;
	var md5 = o.md5;

	return `
			<dict>
				<key>fileModificationDate</key>
				<date>${modified}</date>
				<key>fileSize</key>
				<integer>${fileSize}</integer>
				<key>md5</key>
				<string>${md5}</string>
				<key>notifyOnBookmarkChange</key>
				<true/>
				<key>originalPath</key>
				<string>${originalPath}</string>
				<key>resourceName</key>
				<string>${fileName}</string>
				<key>shouldAutoResize</key>
				<true/>
				<key>shouldIncludeInDocumentHeadHTML</key>
				<false/>
				<key>shouldPreload</key>
				<true/>
				<key>shouldRemoveWhenNoLongerReferenced</key>
				<true/>
				<key>type</key>
				<string>FileResource</string>
			</dict>
	`;
}


function elementPlistString (o){
	var resourceId = o.resourceId;
	var name = o.name;
	var top = o.top+'px';
	var left = o.left+'px';
	var height = o.height+'px';
	var width = o.width+'px';
	var originalHeight = o.originalHeight+'px';
	var originalWidth = o.originalWidth+'px';
	var zIndex = o.zIndex;
	var key = o.key;
	var opacity = o.opacity;

	var sizeRatio = Math.floor(o.originalWidth / o.originalHeight * 1000)/1000;

	return `
					<key>${key}</key>
					<array>
						<dict>
							<key>identifier</key>
							<string>DisplayName</string>
							<key>objectValue</key>
							<string>${name}</string>
						</dict>
						<dict>
							<key>identifier</key>
							<string>Position</string>
							<key>objectValue</key>
							<string>absolute</string>
						</dict>
						<dict>
							<key>identifier</key>
							<string>OriginalWidth</string>
							<key>objectValue</key>
							<string>${originalWidth}</string>
						</dict>
						<dict>
							<key>identifier</key>
							<string>SizeRatio</string>
							<key>objectValue</key>
							<string>${sizeRatio}</string>
						</dict>
						<dict>
							<key>identifier</key>
							<string>Left</string>
							<key>objectValue</key>
							<string>${left}</string>
						</dict>
						<dict>
							<key>identifier</key>
							<string>OriginalHeight</string>
							<key>objectValue</key>
							<string>${originalHeight}</string>
						</dict>
						<dict>
							<key>identifier</key>
							<string>Display</string>
							<key>objectValue</key>
							<string>inline</string>
						</dict>
						<dict>
							<key>identifier</key>
							<string>Opacity</string>
							<key>objectValue</key>
							<string>${opacity}</string>
						</dict>
						<dict>
							<key>identifier</key>
							<string>ConstrainProportions</string>
							<key>objectValue</key>
							<string>YES</string>
						</dict>
						<dict>
							<key>identifier</key>
							<string>Height</string>
							<key>objectValue</key>
							<string>${height}</string>
						</dict>
						<dict>
							<key>identifier</key>
							<string>Overflow</string>
							<key>objectValue</key>
							<string>visible</string>
						</dict>
						<dict>
							<key>identifier</key>
							<string>Width</string>
							<key>objectValue</key>
							<string>${width}</string>
						</dict>
						<dict>
							<key>identifier</key>
							<string>Top</string>
							<key>objectValue</key>
							<string>${top}</string>
						</dict>
						<dict>
							<key>identifier</key>
							<string>BackgroundImageResourceGroupOid</string>
							<key>objectValue</key>
							<string>${resourceId}</string>
						</dict>
						<dict>
							<key>identifier</key>
							<string>BackgroundSize</string>
							<key>objectValue</key>
							<string>100% 100%</string>
						</dict>
						<dict>
							<key>identifier</key>
							<string>BackgroundRepeat</string>
							<key>objectValue</key>
							<string>no-repeat</string>
						</dict>
						<dict>
							<key>identifier</key>
							<string>TagName</string>
							<key>objectValue</key>
							<string>div</string>
						</dict>
						<dict>
							<key>identifier</key>
							<string>AccessibilityRole</string>
							<key>objectValue</key>
							<string>img</string>
						</dict>
						<dict>
							<key>identifier</key>
							<string>ZIndex</string>
							<key>objectValue</key>
							<string>${zIndex}</string>
						</dict>
						<dict>
							<key>identifier</key>
							<string>ClassType</string>
							<key>objectValue</key>
							<string>Image</string>
						</dict>
					</array>
	`;
}
*/
