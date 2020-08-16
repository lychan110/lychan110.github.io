window.onload = window.onresize = function () {
	
	var navH = document.getElementById("mainNav").offsetHeight;
	console.log(navH);
	
	if (window.matchMedia( "(min-width: 768px)" ).matches) {
		
		document.getElementById("header-container").style.paddingTop = navH + "px";
		
	} else {
		
		document.getElementById("header-container").style.paddingTop = "0px";
		
	}
	
	if (window.matchMedia( "(min-width: 992px)" ).matches) {
		
		document.getElementById("cv-summary").classList.add('sticky-top');
		
		document.getElementById("cv-summary").style.paddingTop = navH + "px";

		document.getElementById("cv-main").style.paddingTop = navH + "px";
		
		// document.getElementById("cv-summary").style.marginBottom = "0px";
		
    } else {
		
		document.getElementById("cv-summary").classList.remove('sticky-top');
		
		document.getElementById("cv-summary").style.paddingTop = "0px";
		
		// document.getElementById("cv-summary").style.marginBottom = "1.6rem";
		
    }
};