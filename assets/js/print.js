if(Ext.isChrome == true) {
	window.print();
} else if(Ext.firefoxVersion > 0) {
	// Set Page Properties
	jsPrintSetup.setOption('orientation', jsPrintSetup.kPortraitOrientation); // Portrait

	jsPrintSetup.setPaperSizeUnit(jsPrintSetup.kPaperSizeMillimeters); // Set Unit first to Millimeters
	jsPrintSetup.setOption('marginTop', 0);
	jsPrintSetup.setOption('marginBottom', 0);
	jsPrintSetup.setOption('marginLeft', 0);
	jsPrintSetup.setOption('marginRight', 0);

	jsPrintSetup.setPaperSizeUnit(jsPrintSetup.kPaperSizeInches); // Set Unit first to Inches
	jsPrintSetup.setOption('paperHeight', 5.5);
	jsPrintSetup.setOption('paperWidth', 8.5);

	// Set Blank Header/Footer
	jsPrintSetup.setOption('headerStrLeft', '');
	jsPrintSetup.setOption('headerStrCenter', '');
	jsPrintSetup.setOption('headerStrRight', '');

	jsPrintSetup.setOption('footerStrLeft', '');
	jsPrintSetup.setOption('footerStrCenter', '');
	jsPrintSetup.setOption('footerStrRight', '');

	window.close();
	jsPrintSetup.clearSilentPrint();
	jsPrintSetup.setOption('printSilent', 1);
	jsPrintSetup.print();
}